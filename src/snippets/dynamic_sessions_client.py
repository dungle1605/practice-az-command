"""
Dynamic Sessions Client for Azure Container Apps.
Dùng để chạy code AI-generated một cách an toàn trong môi trường cô lập.
"""

import os
from pathlib import Path
from typing import Any
from urllib.parse import quote
from uuid import uuid4

import requests
from azure.identity import DefaultAzureCredential


# ===== CẤU HÌNH =====
API_VERSION = "2024-02-02-preview"
TOKEN_SCOPE = "https://dynamicsessions.io/.default"


class CodeExecutionError(Exception):
    """Lỗi khi code bên trong session thực thi thất bại."""
    pass


class DynamicSessionRequestError(Exception):
    """Lỗi khi gọi REST API của Dynamic Sessions."""
    pass


class DynamicSessionClient:
    """
    Client để tương tác với Azure Container Apps Dynamic Sessions.
    
    Mỗi client được gắn với một identifier (UUID) duy nhất, đảm bảo
    các request liên quan được route đến cùng một session cô lập.
    """

    def __init__(self, endpoint: str, credential: DefaultAzureCredential, identifier: str):
        self.endpoint = endpoint.rstrip("/")
        self.credential = credential
        self.identifier = identifier

    # ===== XÁC THỰC =====
    def _headers(self) -> dict[str, str]:
        """Lấy Bearer Token từ Microsoft Entra ID."""
        token = self.credential.get_token(TOKEN_SCOPE).token
        return {"Authorization": f"Bearer {token}"}

    def _params(self) -> dict[str, str]:
        """Tham số chung cho mọi request: api-version và identifier."""
        return {"api-version": API_VERSION, "identifier": self.identifier}

    def _request(self, method: str, path: str, **kwargs) -> requests.Response:
        """Gửi request đến Dynamic Sessions API."""
        url = f"{self.endpoint}{path}"
        response = requests.request(
            method, url, headers=self._headers(), params=self._params(), **kwargs
        )
        if not response.ok:
            raise DynamicSessionRequestError(
                f"HTTP {response.status_code}: {response.text}"
            )
        return response

    def _json_object(self, response: requests.Response) -> dict[str, Any]:
        """Parse JSON từ response, đảm bảo là dict."""
        body = response.json()
        if not isinstance(body, dict):
            raise DynamicSessionRequestError("Expected a JSON object")
        return body

    # ===== UPLOAD FILE =====
    def upload_file(self, file_path: Path) -> dict[str, Any]:
        """Upload file vào /mnt/data của session."""
        with file_path.open("rb") as source:
            response = self._request(
                "POST", "/files",
                files={"file": (file_path.name, source, "text/csv")},
                timeout=(5, 30),
            )
        return self._json_object(response)

    # ===== THỰC THI CODE =====
    def execute_code(self, code: str) -> dict[str, Any]:
        """
        Thực thi code Python trong session cô lập.
        
        Phân biệt:
        - REST success (HTTP 200): Service đã nhận và chạy operation.
        - Execution success (status == "Succeeded"): Code thực sự chạy thành công.
        """
        response = self._request(
            "POST", "/executions",
            json={
                "codeInputType": "Inline",
                "executionType": "Synchronous",
                "code": code,
                "timeoutInSeconds": 60,
                "outputStreamsMaxLength": 4096,
            },
            timeout=(5, 90),
        )
        execution = self._json_object(response)

        if execution.get("status") != "Succeeded":
            result = execution.get("result")
            stderr = result.get("stderr") if isinstance(result, dict) else None
            error = execution.get("error")
            message = None
            if isinstance(error, dict):
                message = error.get("message")
            raise CodeExecutionError(str(stderr or message or "Code execution failed"))
        return execution

    # ===== QUẢN LÝ FILE =====
    def list_files(self) -> list[dict[str, Any]]:
        """Liệt kê file trong session hiện tại."""
        response = self._request("GET", "/files", timeout=(5, 15))
        body = self._json_object(response)
        files = body.get("value", [])
        if not isinstance(files, list):
            raise DynamicSessionRequestError("Unexpected file list format")
        return files

    def download_file(self, file_name: str) -> bytes:
        """
        Tải file từ session.
        
        Bảo mật: Kiểm tra path traversal - không cho phép tên file chứa
        đường dẫn (ví dụ: '../../etc/passwd').
        """
        if Path(file_name).name != file_name:
            raise ValueError("A file name without a directory is required")
        safe_name = quote(file_name, safe="")
        response = self._request("GET", f"/files/{safe_name}/content", timeout=(5, 30))
        return response.content

    # ===== XÓA SESSION =====
    def delete_session(self) -> int:
        """Xóa session ngay lập tức (giải phóng tài nguyên)."""
        response = self._request("DELETE", "/session", timeout=(5, 15))
        return response.status_code


# ===== FACTORY FUNCTION =====
def get_session_client() -> DynamicSessionClient:
    """
    Tạo client từ biến môi trường SESSION_POOL_ENDPOINT.
    
    Identifier được sinh tự động bằng UUID, đảm bảo không đoán được.
    """
    endpoint = os.environ.get("SESSION_POOL_ENDPOINT", "").strip()
    if not endpoint:
        raise ValueError("SESSION_POOL_ENDPOINT environment variable must be set")
    identifier = str(uuid4())
    credential = DefaultAzureCredential()
    return DynamicSessionClient(endpoint, credential=credential, identifier=identifier)
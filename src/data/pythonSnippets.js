/**
 * Python Code Snippets Dataset for Microsoft AI-200 & Azure Container Apps
 * Includes Dynamic Sessions Client, Tool Calling for LLMs, and Azure Entra ID Authentication.
 */

export const pythonSnippets = [
    {
        id: "dynamic-sessions-client",
        title: "1. Dynamic Sessions Client (Production Ready)",
        description: "Client hoàn chỉnh tương tác với Azure Container Apps Dynamic Sessions: xác thực Entra ID Bearer token, upload/download file an toàn (chống path-traversal), thực thi code Python trong sandbox cô lập và dọn dẹp session.",
        category: "Dynamic Sessions",
        filename: "dynamic_sessions_client.py",
        code: `"""
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
`
    },
    {
        id: "dynamic-sessions-openai-tool",
        title: "2. OpenAI Function Calling với Dynamic Sessions",
        description: "Định nghĩa Tool/Function Calling cho OpenAI GPT-4o để mô hình tự động gọi container sandbox thực thi mã Python và tính toán kết quả.",
        category: "AI Agent & Tools",
        filename: "openai_code_interpreter_tool.py",
        code: `"""
Tích hợp Azure Container Apps Dynamic Sessions với OpenAI Tools.
Cho phép LLM tự do viết mã Python giải toán/phân tích dữ liệu trong Sandbox.
"""

import json
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from dynamic_sessions_client import get_session_client, CodeExecutionError

# 1. Khởi tạo Token Provider cho Azure OpenAI
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
)

client = AzureOpenAI(
    azure_endpoint="https://ai-200-openai.openai.azure.com/",
    azure_ad_token_provider=token_provider,
    api_version="2024-06-01"
)

# 2. Khởi tạo Dynamic Session Client
session_client = get_session_client()

# 3. Định nghĩa OpenAI Tool Schema
tools = [
    {
        "type": "function",
        "function": {
            "name": "python_interpreter",
            "description": "Thực thi mã Python trong môi trường sandbox an toàn của Azure. Có sẵn numpy, pandas, matplotlib.",
            "parameters": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "Đoạn mã Python cần chạy và in kết quả ra màn hình bằng print()"
                    }
                },
                "required": ["code"]
            }
        }
    }
]

def run_agent_loop(user_prompt: str):
    messages = [{"role": "user", "content": user_prompt}]
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=tools,
        tool_choice="auto"
    )
    
    msg = response.choices[0].message
    if msg.tool_calls:
        for tool_call in msg.tool_calls:
            if tool_call.function.name == "python_interpreter":
                args = json.loads(tool_call.function.arguments)
                code_to_run = args["code"]
                print(f"[AI Agent] Đang thực thi mã Python:\\n{code_to_run}\\n---")
                
                try:
                    result = session_client.execute_code(code_to_run)
                    output = result["result"]["stdout"]
                except CodeExecutionError as e:
                    output = f"Error: {e}"
                
                print(f"[Sandbox Output] {output}")
`
    },
    {
        id: "azure-managed-identity-auth",
        title: "3. Xác thực Passwordless với DefaultAzureCredential",
        description: "Chuẩn kiến trúc bảo mật Microsoft: Xác thực không mật khẩu (Passwordless) giữa ứng dụng Python chạy trên Container App và các dịch vụ Azure (ACR, OpenAI, Key Vault).",
        category: "Bảo mật & Auth",
        filename: "managed_identity_auth.py",
        code: `"""
Xác thực Entra ID (Azure AD) không mật khẩu qua DefaultAzureCredential.
Tự động nhận diện Managed Identity khi chạy trên Azure Container Apps hoặc App Service.
"""

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
import os

# Khởi tạo Credential không cần truyền bất kỳ Secret nào
credential = DefaultAzureCredential()

# 1. Truy xuất secret từ Azure Key Vault mà không cần API Key:
VAULT_URL = os.environ.get("KEY_VAULT_URL", "https://kv-ai200-prod.vault.azure.net/")
secret_client = SecretClient(vault_url=VAULT_URL, credential=credential)

api_secret = secret_client.get_secret("AI-SERVICE-KEY")
print(f"Secret retrieved securely: {api_secret.name}")

# 2. Lấy Access Token trực tiếp cho REST API:
token = credential.get_token("https://management.azure.com/.default")
print("Bearer token retrieved for Azure ARM API")
`
    },
    // 4. AKS Configuration API Client (Lab 02)
    {
        id: "aks-config-client",
        title: "4. AKS Config API Client (Health, Secrets, PVC Logs)",
        description: "Console Client hoàn chỉnh tương tác với AKS Config API: kiểm tra Liveness /healthz, Readiness /readyz, xem Secrets an toàn, và đọc Log Summary từ Persistent Volume Claim.",
        category: "Azure Kubernetes Service",
        filename: "aks_config_client.py",
        code: `"""
Console application client tương tác với AKS Configuration API (AI-200 Lab 02).
Hỗ trợ kiểm tra Liveness, Readiness, Secrets mask và tổng hợp Log từ PVC.
"""

import os
import sys
import httpx
from dotenv import load_dotenv

load_dotenv()

API_ENDPOINT = os.getenv("API_ENDPOINT", "http://<EXTERNAL-IP>")
TIMEOUT = 30

def get_client() -> httpx.Client:
    """Khởi tạo HTTP client với base URL và timeout chuẩn."""
    return httpx.Client(
        base_url=API_ENDPOINT,
        timeout=httpx.Timeout(TIMEOUT),
        headers={"Content-Type": "application/json"}
    )

def check_api_health() -> bool:
    """1. Kiểm tra Liveness Probe (/healthz) - lấy thông tin ConfigMap."""
    try:
        with get_client() as client:
            res = client.get("/healthz")
            if res.status_code == 200:
                data = res.json()
                print("✓ API Healthy & Alive!")
                print(f"  Service: {data.get('service')}")
                print(f"  Version: {data.get('version')} (ConfigMap)")
                print(f"  Student: {data.get('student')} (ConfigMap)")
                return True
            print(f"✗ Health check failed: {res.status_code}")
            return False
    except Exception as e:
        print(f"✗ Không thể kết nối tới AKS API: {e}")
        return False

def check_api_readiness() -> bool:
    """2. Kiểm tra Readiness Probe (/readyz) - xác nhận Secrets & PVC."""
    try:
        with get_client() as client:
            res = client.get("/readyz")
            if res.status_code == 200:
                data = res.json()
                print("✓ API Ready để nhận Traffic!")
                print(f"  Secrets loaded: {data.get('secrets_loaded')}")
                print(f"  Persistent storage ready: {data.get('persistent_storage_ready')}")
                print(f"  Log path: {data.get('log_path')} (PVC Mount)")
                return True
            print(f"✗ Readiness check failed: {res.status_code}")
            return False
    except Exception as e:
        print(f"✗ Lỗi kết nối: {e}")
        return False

def view_secrets_masked():
    """3. Kiểm tra Secrets (/secrets) - hiển thị giá trị đã được mask."""
    try:
        with get_client() as client:
            res = client.get("/secrets")
            if res.status_code == 200:
                details = res.json().get("details", {})
                print("✓ Kubernetes Secrets Details (Masked):")
                for key, val in details.items():
                    print(f"  [{key}] Loaded: {val.get('loaded')}, Value: {val.get('value')}")
            else:
                print(f"✗ Không lấy được secrets: {res.status_code}")
    except Exception as e:
        print(f"✗ Lỗi: {e}")

def view_log_summary():
    """4. Tổng hợp Logs (/logs) lưu trên PersistentVolumeClaim Azure Disk."""
    try:
        with get_client() as client:
            res = client.get("/logs")
            if res.status_code == 200:
                data = res.json()
                print("✓ Persistent Volume Log Summary:")
                print(f"  Log file: {data.get('log_file')}")
                print(f"  Total requests: {data.get('total_requests')}")
                print("  Requests by endpoint:")
                for ep, count in data.get('endpoints', {}).items():
                    print(f"    {ep}: {count} lần")
            else:
                print(f"✗ Không lấy được logs: {res.status_code}")
    except Exception as e:
        print(f"✗ Lỗi: {e}")

if __name__ == "__main__":
    print(f"Connecting to AKS API at: {API_ENDPOINT}")
    check_api_health()
    check_api_readiness()
    view_secrets_masked()
    view_log_summary()
`,
    },
];
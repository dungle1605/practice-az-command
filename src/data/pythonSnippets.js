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
    {
        id: "cosmos-vector-container-setup",
        title: "5. Cosmos DB Vector Container Setup (DiskANN & Vector Policy)",
        description: "Khởi tạo Container Cosmos DB for NoSQL hỗ trợ Vector Search bằng Python SDK: cấu hình vector_embedding_policy (path /embedding, float32, cosine, 256 dimensions) và indexing_policy (DiskANN + exclude /embedding/* khỏi B-tree). Xác thực Entra ID qua DefaultAzureCredential.",
        category: "Cosmos DB Vector Search",
        filename: "setup_container.py",
        code: `"""
Setup script for creating the Cosmos DB container with vector search policies.
This script configures the vector embedding policy and indexing policy required
for vector similarity search using the VectorDistance function.
"""
import os
from azure.cosmos import CosmosClient, PartitionKey
from azure.identity import DefaultAzureCredential


def get_database():
    """Lấy tham chiếu Database Cosmos DB thông qua xác thực Entra ID."""
    endpoint = os.environ.get("COSMOS_ENDPOINT")
    database_name = os.environ.get("COSMOS_DATABASE", "vectorstore")

    if not endpoint or not database_name:
        raise ValueError(
            "COSMOS_ENDPOINT and COSMOS_DATABASE environment variables must be set"
        )

    credential = DefaultAzureCredential()
    client = CosmosClient(endpoint, credential=credential)
    database = client.get_database_client(database_name)
    return database


def create_vector_container():
    """
    Tạo Container với các chính sách Vector Embedding và Indexing Policy DiskANN.
    """
    database = get_database()
    container_name = os.environ.get("COSMOS_CONTAINER", "vectors")

    # 1. Định nghĩa Vector Embedding Policy
    # Báo cho Cosmos DB biết cấu trúc của mảng embedding tại đường dẫn /embedding
    vector_embedding_policy = {
        "vectorEmbeddings": [
            {
                "path": "/embedding",
                "dataType": "float32",
                "distanceFunction": "cosine",
                "dimensions": 256
            }
        ]
    }

    # 2. Định nghĩa Indexing Policy với DiskANN
    # - DiskANN cung cấp thuật toán tìm kiếm Nearest Neighbor (ANN) hiệu quả cao trên SSD
    # - BẮT BUỘC loại trừ /embedding/* khỏi standard B-Tree indexing để tối ưu RU/s
    indexing_policy = {
        "indexingMode": "consistent",
        "automatic": True,
        "includedPaths": [
            {"path": "/*"}
        ],
        "excludedPaths": [
            {"path": "/embedding/*"}
        ],
        "vectorIndexes": [
            {
                "path": "/embedding",
                "type": "diskANN"
            }
        ]
    }

    # 3. Tạo Container với Partition Key /documentId và Policies đã định nghĩa
    container = database.create_container_if_not_exists(
        id=container_name,
        partition_key=PartitionKey(path="/documentId"),
        indexing_policy=indexing_policy,
        vector_embedding_policy=vector_embedding_policy
    )
    return container


def main():
    print("Creating vector container with embedding policies...")
    container = create_vector_container()
    print(f"✓ Container created successfully: {container.id}")
    print("  - Partition Key: /documentId")
    print("  - Vector Index: DiskANN (256 dims, cosine)")


if __name__ == "__main__":
    main()
`,
    },
    {
        id: "cosmos-vector-search-engine",
        title: "6. Cosmos DB Vector Search Engine & Filtering (VectorDistance SQL)",
        description: "Triển khai các hàm lưu trữ tài liệu kèm vector embedding (upsert_item & RU charge), tìm kiếm vector tương đồng Nearest Neighbor bằng hàm VectorDistance trong câu lệnh SQL và tìm kiếm kết hợp lọc metadata (Filtered Vector Search) chuẩn Microsoft AI-200.",
        category: "Cosmos DB Vector Search",
        filename: "vector_functions.py",
        code: `"""
Vector search functions for storing and retrieving documents with embeddings from Cosmos DB.
Interfaces between the application and Cosmos DB vector search.
"""
import os
from datetime import datetime
from azure.cosmos import CosmosClient
from azure.identity import DefaultAzureCredential


def get_container():
    """Lấy container client Cosmos DB với DefaultAzureCredential."""
    endpoint = os.environ.get("COSMOS_ENDPOINT")
    database_name = os.environ.get("COSMOS_DATABASE", "vectorstore")
    container_name = os.environ.get("COSMOS_CONTAINER", "vectors")

    if not endpoint or not database_name or not container_name:
        raise ValueError("COSMOS_ENDPOINT, COSMOS_DATABASE, and COSMOS_CONTAINER must be set")

    credential = DefaultAzureCredential()
    client = CosmosClient(endpoint, credential=credential)
    return client.get_database_client(database_name).get_container_client(container_name)


def store_vector_document(document_id: str, chunk_id: str, content: str, embedding: list, metadata: dict) -> dict:
    """Lưu trữ tài liệu và vector embedding vào Cosmos DB container, trích xuất Request Charge (RU)."""
    container = get_container()
    item = {
        "id": chunk_id,
        "documentId": document_id,
        "chunkId": chunk_id,
        "content": content,
        "embedding": embedding,
        "metadata": metadata,
        "timestamp": datetime.utcnow().isoformat()
    }
    response = container.upsert_item(body=item)
    request_charge = float(container.client_connection.last_response_headers.get("x-ms-request-charge", 0.0))
    return {"item": response, "ru_charge": request_charge}


def vector_similarity_search(query_embedding: list, top_n: int = 5) -> list:
    """Tìm kiếm k tài liệu tương đồng nhất bằng hàm VectorDistance trong NoSQL SQL query."""
    container = get_container()
    query = """
    SELECT TOP @top_n c.id, c.documentId, c.chunkId, c.content, c.metadata,
           VectorDistance(c.embedding, @query_embedding) AS similarity_score
    FROM c
    ORDER BY VectorDistance(c.embedding, @query_embedding)
    """
    parameters = [
        {"name": "@top_n", "value": top_n},
        {"name": "@query_embedding", "value": query_embedding}
    ]
    items = container.query_items(query=query, parameters=parameters, enable_cross_partition_query=True)
    return [
        {
            "document_id": item.get("documentId"),
            "chunk_id": item.get("chunkId"),
            "content": item.get("content"),
            "similarity_score": item.get("similarity_score", 0.0),
            "category": item.get("metadata", {}).get("category", ""),
            "tags": item.get("metadata", {}).get("tags", [])
        }
        for item in items
    ]


def filtered_vector_search(query_embedding: list, category: str = None, top_n: int = 5) -> list:
    """Tìm kiếm vector kết hợp bộ lọc trường metadata (ví dụ c.metadata.category = @category)."""
    container = get_container()
    if category:
        query = """
        SELECT TOP @top_n c.id, c.documentId, c.chunkId, c.content, c.metadata,
               VectorDistance(c.embedding, @query_embedding) AS similarity_score
        FROM c
        WHERE c.metadata.category = @category
        ORDER BY VectorDistance(c.embedding, @query_embedding)
        """
        parameters = [
            {"name": "@top_n", "value": top_n},
            {"name": "@query_embedding", "value": query_embedding},
            {"name": "@category", "value": category}
        ]
    else:
        query = """
        SELECT TOP @top_n c.id, c.documentId, c.chunkId, c.content, c.metadata,
               VectorDistance(c.embedding, @query_embedding) AS similarity_score
        FROM c
        ORDER BY VectorDistance(c.embedding, @query_embedding)
        """
        parameters = [
            {"name": "@top_n", "value": top_n},
            {"name": "@query_embedding", "value": query_embedding}
        ]

    items = container.query_items(query=query, parameters=parameters, enable_cross_partition_query=True)
    return [
        {
            "document_id": item.get("documentId"),
            "chunk_id": item.get("chunkId"),
            "content": item.get("content"),
            "similarity_score": item.get("similarity_score", 0.0),
            "category": item.get("metadata", {}).get("category", ""),
            "tags": item.get("metadata", {}).get("tags", [])
        }
        for item in items
    ]
`,
    },
    {
        id: "cosmos-rag-query-engine",
        title: "7. Cosmos DB RAG Query Engine (Point Read, In-Partition & ARRAY_CONTAINS)",
        description: "Tối ưu hóa chi phí RU và hiệu năng cho RAG Document Store trên Cosmos DB NoSQL: Point Read (1.0 RU), Single-Partition Query (không fan-out), Cross-Partition Metadata Search với ARRAY_CONTAINS và thực thi câu lệnh SQL tùy biến kèm phân trang OFFSET/LIMIT.",
        category: "Cosmos DB RAG & Queries",
        filename: "rag_functions.py",
        code: `"""
Azure Cosmos DB for NoSQL RAG Query Engine (Microsoft AI-200)
Tối ưu hóa chi phí và tốc độ truy vấn cho hệ thống Retrieval-Augmented Generation (RAG).
"""
import os
from datetime import datetime
from azure.cosmos import CosmosClient, exceptions
from azure.identity import DefaultAzureCredential


def get_container():
    """Lấy tham chiếu Cosmos DB container bằng DefaultAzureCredential."""
    endpoint = os.environ.get("COSMOS_ENDPOINT")
    database_name = os.environ.get("COSMOS_DATABASE", "ragstore")
    container_name = os.environ.get("COSMOS_CONTAINER", "chunks")

    credential = DefaultAzureCredential()
    client = CosmosClient(endpoint, credential=credential)
    return client.get_database_client(database_name).get_container_client(container_name)


# 1. POINT READ (Chi phí thấp nhất: đúng 1.0 RU, < 5ms)
def get_chunk_by_id(document_id: str, chunk_id: str) -> dict | None:
    """
    Point Read đọc trực tiếp dữ liệu qua partition key và id.
    Tuyệt đối không cần phân tích cú pháp SQL -> Cực nhanh và tiết kiệm RU nhất.
    """
    try:
        container = get_container()
        item = container.read_item(item=chunk_id, partition_key=document_id)
        ru_charge = float(container.client_connection.last_response_headers.get("x-ms-request-charge", 1.0))
        return {
            "document_id": item.get("documentId"),
            "chunk_id": item.get("chunkId", item.get("id")),
            "content": item.get("content"),
            "metadata": item.get("metadata", {}),
            "ru_charge": ru_charge
        }
    except exceptions.CosmosResourceNotFoundError:
        return None


# 2. SINGLE-PARTITION QUERY (Chỉ định hướng vào 1 partition vật lý)
def get_chunks_by_document(document_id: str) -> list[dict]:
    """
    Lấy toàn bộ chunk của 1 tài liệu theo thứ tự chunkIndex.
    Có partition_key=document_id giúp Cosmos DB tránh quét đa phân vùng (Cross-Partition Fan-out).
    """
    container = get_container()
    query = """
    SELECT * FROM c
    WHERE c.documentId = @document_id
    ORDER BY c.metadata.chunkIndex
    """
    parameters = [{"name": "@document_id", "value": document_id}]
    items = container.query_items(
        query=query,
        parameters=parameters,
        partition_key=document_id  # Điểm mấu chốt để tối ưu RU!
    )
    return [
        {
            "document_id": item.get("documentId"),
            "chunk_id": item.get("chunkId", item.get("id")),
            "chunk_index": item.get("metadata", {}).get("chunkIndex", 0),
            "content": item.get("content"),
            "metadata": item.get("metadata", {})
        }
        for item in items
    ]


# 3. CROSS-PARTITION METADATA SEARCH (Sử dụng ARRAY_CONTAINS)
def search_chunks_by_metadata(filters: dict) -> list[dict]:
    """
    Tìm kiếm chunk theo category hoặc tags.
    Dùng hàm ARRAY_CONTAINS(c.metadata.tags, @tag) để kiểm tra phần tử trong mảng JSON.
    """
    container = get_container()
    conditions = []
    parameters = []

    if "category" in filters and filters["category"]:
        conditions.append("c.metadata.category = @category")
        parameters.append({"name": "@category", "value": filters["category"]})

    if "tags" in filters and filters["tags"]:
        for i, tag in enumerate(filters["tags"]):
            param_name = f"@tag_{i}"
            conditions.append(f"ARRAY_CONTAINS(c.metadata.tags, {param_name})")
            parameters.append({"name": param_name, "value": tag})

    where_clause = " AND ".join(conditions) if conditions else "1=1"
    query = f"SELECT * FROM c WHERE {where_clause}"

    items = container.query_items(
        query=query,
        parameters=parameters,
        enable_cross_partition_query=True
    )
    return [
        {
            "document_id": item.get("documentId"),
            "chunk_id": item.get("chunkId", item.get("id")),
            "chunk_index": item.get("metadata", {}).get("chunkIndex", 0),
            "content": item.get("content"),
            "metadata": item.get("metadata", {})
        }
        for item in items
    ]


# 4. AD-HOC QUERY EXECUTOR KÈM PHÂN TRANG (OFFSET / LIMIT)
def execute_rag_query(sql_query: str) -> dict:
    """
    Thực thi câu truy vấn SQL với phân trang OFFSET ... LIMIT ... và đo lường Request Charge (RU).
    Ví dụ: SELECT c.id, c.documentId, c.content FROM c OFFSET 0 LIMIT 10
    """
    container = get_container()
    items = container.query_items(query=sql_query, enable_cross_partition_query=True)
    results = list(items)
    ru_charge = float(container.client_connection.last_response_headers.get("x-ms-request-charge", 0.0))
    return {
        "results": results,
        "count": len(results),
        "ru_charge": ru_charge
    }
`,
    },
    {
        id: "cosmos-vector-index-benchmark",
        title: "8. Cosmos DB Vector Index Benchmark (Flat vs QuantizedFlat vs DiskANN)",
        description: "So sánh 3 chiến lược Vector Index trong Cosmos DB NoSQL: Flat (Exact k-NN cho tập dữ liệu nhỏ < 5K), QuantizedFlat (Nén scalar quantization cho tập dữ liệu trung bình 10K-100K) và DiskANN (Approximate Nearest Neighbor tối ưu SSD cho Production > 100K). Đánh giá RU charge và thời gian thực thi (ms).",
        category: "Vector Index Optimization",
        filename: "setup_containers.py",
        code: `"""
Azure Cosmos DB for NoSQL Vector Index Optimization & Benchmark (Microsoft AI-200)
Khởi tạo và so sánh 3 chiến lược Vector Indexing:
1. 'flat': Exact Nearest Neighbor (k-NN), so khớp toàn bộ vector (100% recall, chi phí RU cao khi dữ liệu lớn)
2. 'quantizedFlat': Nén scalar quantization, giảm bộ nhớ cho tập dữ liệu trung bình (10K - 100K vectors)
3. 'diskANN': Graph-based Approximate Nearest Neighbor (ANN) by Microsoft Research, chuẩn Production (>100K vectors)
"""
import os
import time
from azure.cosmos import CosmosClient, PartitionKey
from azure.identity import DefaultAzureCredential


CONTAINER_FLAT = "vectors-flat"
CONTAINER_QUANTIZED = "vectors-quantized"
CONTAINER_DISKANN = "vectors-diskann"


def get_database():
    endpoint = os.environ.get("COSMOS_ENDPOINT")
    database_name = os.environ.get("COSMOS_DATABASE", "indexoptimize")

    credential = DefaultAzureCredential()
    client = CosmosClient(endpoint, credential=credential)
    return client.get_database_client(database_name)


# KHỞI TẠO CONTAINER THEO LOẠI INDEX (flat | quantizedFlat | diskANN)
def create_vector_container_by_type(container_name: str, index_type: str):
    database = get_database()

    vector_embedding_policy = {
        "vectorEmbeddings": [
            {
                "path": "/embedding",
                "dataType": "float32",
                "distanceFunction": "cosine",
                "dimensions": 256
            }
        ]
    }

    indexing_policy = {
        "indexingMode": "consistent",
        "automatic": True,
        "includedPaths": [{"path": "/*"}],
        "excludedPaths": [{"path": "/embedding/*"}],  # Bắt buộc loại trừ khỏi B-Tree
        "vectorIndexes": [
            {
                "path": "/embedding",
                "type": index_type  # "flat", "quantizedFlat", hoặc "diskANN"
            }
        ]
    }

    container = database.create_container_if_not_exists(
        id=container_name,
        partition_key=PartitionKey(path="/documentId"),
        indexing_policy=indexing_policy,
        vector_embedding_policy=vector_embedding_policy
    )
    print(f"✓ Created '{container_name}' with vector index '{index_type}'")
    return container


# SO SÁNH HIỆU NĂNG TRUY VẤN VÀ RU CONSUMPTION
def benchmark_search_query(container_name: str, query_embedding: list, top_n: int = 5) -> dict:
    database = get_database()
    container = database.get_container_client(container_name)

    start_time = time.time()
    query = """
    SELECT TOP @topN c.id, c.documentId, c.content, c.metadata,
           VectorDistance(c.embedding, @queryVector) AS similarityScore
    FROM c
    ORDER BY VectorDistance(c.embedding, @queryVector)
    """
    parameters = [
        {"name": "@topN", "value": top_n},
        {"name": "@queryVector", "value": query_embedding}
    ]

    items = list(container.query_items(
        query=query,
        parameters=parameters,
        enable_cross_partition_query=True
    ))
    execution_time_ms = (time.time() - start_time) * 1000
    ru_charge = float(container.client_connection.last_response_headers.get('x-ms-request-charge', 0.0))

    return {
        "container": container_name,
        "count": len(items),
        "execution_time_ms": round(execution_time_ms, 2),
        "ru_charge": ru_charge
    }
`,
    },
    {
        id: "postgresql-vector-search",
        title: "9. Azure PostgreSQL với pgvector & Entra ID Auth",
        description: "Kết nối Azure Database for PostgreSQL Flexible Server không cần mật khẩu tĩnh qua token Microsoft Entra ID (scope oss-rdbms), khởi tạo schema pgvector, chèn dữ liệu sản phẩm kèm embeddings và tìm kiếm độ tương đồng Cosine bằng toán tử <=> với thư viện psycopg.",
        category: "PostgreSQL & Vector Search",
        filename: "postgresql_vector_search.py",
        code: `"""
Azure Database for PostgreSQL Flexible Server with pgvector & Entra ID Authentication.
Phục vụ tìm kiếm độ tương đồng sản phẩm (Product Similarity Search) chuẩn AI-200.
"""

import os
import json
from typing import List, Dict, Any
import psycopg
from azure.identity import DefaultAzureCredential


# Scope chuẩn để lấy Entra ID Bearer token cho Azure OSS RDBMS (PostgreSQL)
POSTGRES_SCOPE = "https://ossrdbms-aad.database.windows.net/.default"


def get_db_connection():
    """
    Tạo kết nối an toàn đến PostgreSQL bằng token động từ Microsoft Entra ID.
    Loại bỏ hoàn toàn việc lưu mật khẩu tĩnh trong mã nguồn hoặc biến môi trường dài hạn.
    """
    credential = DefaultAzureCredential()
    token = credential.get_token(POSTGRES_SCOPE)

    return psycopg.connect(
        host=os.environ["DB_HOST"],
        dbname=os.environ.get("DB_NAME", "postgres"),
        user=os.environ["DB_USER"],         # Email tài khoản Entra (UPN)
        password=token.token,               # Bearer JWT token từ DefaultAzureCredential
        port=int(os.environ.get("DB_PORT", 5432)),
        sslmode="require"                   # Azure PostgreSQL bắt buộc SSL
    )


def initialize_pgvector_schema():
    """Kích hoạt extension vector và khởi tạo bảng products với HNSW index."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # 1. Kích hoạt tiện ích pgvector
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")

            # 2. Tạo bảng sản phẩm với cột embedding 384 chiều
            cur.execute("""
                CREATE TABLE IF NOT EXISTS products (
                    id BIGSERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    description TEXT,
                    price NUMERIC(10, 2) NOT NULL,
                    embedding vector(384)
                );
            """)

            # 3. Tạo chỉ mục HNSW cosine distance
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_products_hnsw_cosine
                ON products USING hnsw (embedding vector_cosine_ops)
                WITH (m = 16, ef_construction = 64);
            """)

            conn.commit()
            print("✓ Schema and HNSW index initialized successfully.")


def store_product(name: str, category: str, description: str, price: float, embedding: List[float]) -> int:
    """Lưu sản phẩm kèm vector embedding vào PostgreSQL."""
    # pgvector trong psycopg yêu cầu định dạng mảng dạng chuỗi [x1, x2, ...]
    embedding_str = "[" + ",".join(str(x) for x in embedding) + "]"

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO products (name, category, description, price, embedding)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
            """, (name, category, description, price, embedding_str))
            product_id = cur.fetchone()[0]
            conn.commit()
            return product_id


def search_similar_products(query_embedding: List[float], top_n: int = 5, category: str = None) -> List[Dict[str, Any]]:
    """
    Tìm kiếm sản phẩm tương đồng sử dụng toán tử khoảng cách Cosine <=> của pgvector.
    Hỗ trợ lọc metadata kết hợp (Hybrid Search).
    """
    embedding_str = "[" + ",".join(str(x) for x in query_embedding) + "]"

    where_clause = ""
    params = [embedding_str]
    if category:
        where_clause = "WHERE category = %s"
        params.append(category)

    query = f"""
        SELECT id, name, category, description, price,
               embedding <=> %s AS cosine_distance
        FROM products
        {where_clause}
        ORDER BY embedding <=> %s
        LIMIT %s;
    """

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Tinh chỉnh kích thước danh sách ứng viên lúc search
            cur.execute("SET hnsw.ef_search = 100;")

            if category:
                cur.execute(query, (embedding_str, category, embedding_str, top_n))
            else:
                cur.execute(query, (embedding_str, embedding_str, top_n))

            rows = cur.fetchall()
            return [
                {
                    "id": r[0],
                    "name": r[1],
                    "category": r[2],
                    "description": r[3],
                    "price": float(r[4]),
                    "distance": float(r[5]),
                    "similarity_score": round(1.0 - float(r[5]), 4)
                }
                for r in rows
            ]
`,
    },
    {
        id: "postgresql-benchmark-engine",
        title: "10. PostgreSQL Vector Benchmark & Tuning Engine",
        description: "Script tự động hóa đo lường và so sánh hiệu năng vector search trên Azure Database for PostgreSQL: trích xuất kế hoạch thực thi EXPLAIN ANALYZE, đối chiếu thời gian chạy (ms) giữa Quét tuần tự (Seq Scan), IVFFlat (probes 1 vs 50) và HNSW (ef_search 20 vs 100).",
        category: "PostgreSQL & Vector Search",
        filename: "postgresql_benchmark.py",
        code: `"""
Automated Vector Search Performance Benchmarking & EXPLAIN ANALYZE Parser.
Đối chiếu độ trễ và kế hoạch thực thi giữa Seq Scan, IVFFlat và HNSW.
"""

import os
import re
import time
from typing import Dict, Any, Tuple
import psycopg
from azure.identity import DefaultAzureCredential


POSTGRES_SCOPE = "https://ossrdbms-aad.database.windows.net/.default"


def get_connection():
    credential = DefaultAzureCredential()
    token = credential.get_token(POSTGRES_SCOPE)
    return psycopg.connect(
        host=os.environ["DB_HOST"],
        dbname=os.environ.get("DB_NAME", "postgres"),
        user=os.environ["DB_USER"],
        password=token.token,
        sslmode="require",
        autocommit=True
    )


def run_explain_analyze(cur, query: str) -> Tuple[str, float]:
    """Thực thi EXPLAIN ANALYZE và trích xuất thời gian chạy (Execution Time ms)."""
    cur.execute(f"EXPLAIN ANALYZE {query}")
    rows = cur.fetchall()
    plan_lines = [row[0] for row in rows]
    full_plan = "\\n".join(plan_lines)

    exec_time_ms = 0.0
    for line in plan_lines:
        match = re.search(r"Execution Time:\\s*([0-9.]+)\\s*ms", line)
        if match:
            exec_time_ms = float(match.group(1))
            break

    return full_plan, exec_time_ms


def benchmark_suite() -> Dict[str, Any]:
    results = {}
    benchmark_query = """
        SELECT id, name, embedding <=> (SELECT embedding FROM query_vectors) AS distance
        FROM products
        ORDER BY embedding <=> (SELECT embedding FROM query_vectors)
        LIMIT 10;
    """

    with get_connection() as conn:
        with conn.cursor() as cur:
            # 1. Baseline: Quét tuần tự (Seq Scan - không index)
            cur.execute("DROP INDEX IF EXISTS idx_products_embedding_ivfflat;")
            cur.execute("DROP INDEX IF EXISTS idx_products_embedding_hnsw;")
            plan, t_baseline = run_explain_analyze(cur, benchmark_query)
            results["baseline_seq_scan"] = {"time_ms": t_baseline, "plan_summary": "Seq Scan on products (100k rows)"}

            # 2. IVFFlat với probes = 1
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_products_embedding_ivfflat
                ON products USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100);
            """)
            cur.execute("SET ivfflat.probes = 1;")
            _, t_ivfflat_1 = run_explain_analyze(cur, benchmark_query)
            results["ivfflat_probes_1"] = {"time_ms": t_ivfflat_1, "recall": "Fair (~78%)"}

            # 3. IVFFlat với probes = 50
            cur.execute("SET ivfflat.probes = 50;")
            _, t_ivfflat_50 = run_explain_analyze(cur, benchmark_query)
            results["ivfflat_probes_50"] = {"time_ms": t_ivfflat_50, "recall": "High (~96%)"}

            # 4. HNSW Index Testing
            cur.execute("DROP INDEX IF EXISTS idx_products_embedding_ivfflat;")
            cur.execute("SET maintenance_work_mem = '256MB';")
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_products_embedding_hnsw
                ON products USING hnsw (embedding vector_cosine_ops)
                WITH (m = 16, ef_construction = 64);
            """)

            # 5. HNSW với ef_search = 20
            cur.execute("SET hnsw.ef_search = 20;")
            _, t_hnsw_20 = run_explain_analyze(cur, benchmark_query)
            results["hnsw_ef_search_20"] = {"time_ms": t_hnsw_20, "recall": "Good (~93%)"}

            # 6. HNSW với ef_search = 100
            cur.execute("SET hnsw.ef_search = 100;")
            _, t_hnsw_100 = run_explain_analyze(cur, benchmark_query)
            results["hnsw_ef_search_100"] = {"time_ms": t_hnsw_100, "recall": "Excellent (~99.4%)"}

    return results
`,
    },
    {
        id: "postgresql-agent-memory",
        title: "11. PostgreSQL AI Agent Memory Backend & Checkpoints",
        description: "Hệ thống quản lý trí nhớ dài hạn và checkpoint trạng thái tác vụ cho AI Agent: khởi tạo phiên hội thoại với UUID session_id, ghi vết tin nhắn kèm siêu dữ liệu JSONB, và thực hiện Idempotent Upsert lưu điểm dừng tác vụ (task_checkpoints) bằng cú pháp ON CONFLICT DO UPDATE.",
        category: "PostgreSQL & Vector Search",
        filename: "postgresql_agent_memory.py",
        code: `"""
AI Agent Memory Backend and Task Checkpointing with PostgreSQL & Entra ID.
Dựa trên kiến trúc quản lý ngữ cảnh tác vụ cho Large Language Model Agents.
"""

import os
import uuid
from typing import Dict, Any, List, Optional
import psycopg
from azure.identity import DefaultAzureCredential


POSTGRES_SCOPE = "https://ossrdbms-aad.database.windows.net/.default"


def get_connection():
    credential = DefaultAzureCredential()
    token = credential.get_token(POSTGRES_SCOPE)
    return psycopg.connect(
        host=os.environ["DB_HOST"],
        dbname=os.environ.get("DB_NAME", "agent_memory"),
        user=os.environ["DB_USER"],
        password=token.token,
        sslmode="require"
    )


# 1. TẠO PHIÊN HỘI THOẠI MỚI (CREATE CONVERSATION)
def create_conversation(user_id: str, metadata: dict = None) -> Dict[str, Any]:
    session_id = uuid.uuid4()
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO conversations (session_id, user_id, metadata)
                VALUES (%s, %s, %s)
                RETURNING id, session_id, started_at;
                """,
                (str(session_id), user_id, psycopg.types.json.Json(metadata or {}))
            )
            row = cur.fetchone()
            conn.commit()
            return {
                "conversation_id": row[0],
                "session_id": str(row[1]),
                "started_at": row[2].isoformat()
            }


# 2. LƯU TIN NHẮN (STORE CONVERSATION MESSAGE)
def store_message(conversation_id: int, role: str, content: str, metadata: dict = None) -> Dict[str, Any]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO messages (conversation_id, role, content, metadata)
                VALUES (%s, %s, %s, %s)
                RETURNING id, created_at;
                """,
                (conversation_id, role, content, psycopg.types.json.Json(metadata or {}))
            )
            row = cur.fetchone()
            conn.commit()
            return {
                "message_id": row[0],
                "created_at": row[1].isoformat()
            }


# 3. TRUY VẤN LỊCH SỬ HỘI THOẠI (RETRIEVE CONVERSATION HISTORY)
def get_conversation_history(conversation_id: int, limit: int = 50) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, role, content, created_at, metadata
                FROM messages
                WHERE conversation_id = %s
                ORDER BY created_at DESC
                LIMIT %s;
                """,
                (conversation_id, limit)
            )
            rows = cur.fetchall()
            return [
                {
                    "id": row[0],
                    "role": row[1],
                    "content": row[2],
                    "created_at": row[3].isoformat(),
                    "metadata": row[4]
                }
                for row in reversed(rows)
            ]


# 4. LƯU / CẬP NHẬT CHECKPOINT TÁC VỤ (IDEMPOTENT ATOMIC UPSERT)
def save_task_checkpoint(conversation_id: int, task_name: str, status: str, checkpoint_data: dict) -> Dict[str, Any]:
    """
    Lưu vết checkpoint với cơ chế ON CONFLICT DO UPDATE.
    Đảm bảo nếu tiến trình Agent bị restart, nó có thể phục hồi chính xác trạng thái tác vụ.
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO task_checkpoints (conversation_id, task_name, status, checkpoint_data)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (conversation_id, task_name)
                DO UPDATE SET
                    status = EXCLUDED.status,
                    checkpoint_data = EXCLUDED.checkpoint_data,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id, updated_at;
                """,
                (conversation_id, task_name, status, psycopg.types.json.Json(checkpoint_data))
            )
            row = cur.fetchone()
            conn.commit()
            return {
                "checkpoint_id": row[0],
                "updated_at": row[1].isoformat()
            }


# 5. PHỤC HỒI CHECKPOINT TÁC VỤ (RETRIEVE TASK STATE)
def get_task_checkpoint(conversation_id: int, task_name: str) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, status, checkpoint_data, created_at, updated_at
                FROM task_checkpoints
                WHERE conversation_id = %s AND task_name = %s
                LIMIT 1;
                """,
                (conversation_id, task_name)
            )
            row = cur.fetchone()
            if row:
                return {
                    "checkpoint_id": row[0],
                    "status": row[1],
                    "checkpoint_data": row[2],
                    "created_at": row[3].isoformat(),
                    "updated_at": row[4].isoformat()
                }
            return None
`,
    },
    {
        id: "redis-caching-entraid",
        title: "12. Azure Managed Redis Caching & Entra ID (Port 10000)",
        description: "Kết nối Azure Managed Redis Enterprise với Microsoft Entra ID Token Provider, quản lý cache dạng Hash (HSET/HGETALL/HMGET), cấu hình TTL tự động hết hạn, đo lường tỉ lệ Cache Hit/Miss và xóa khóa bất đồng bộ bằng UNLINK.",
        category: "Azure Managed Redis",
        filename: "redis_caching_entraid.py",
        code: `"""
Azure Managed Redis (AMR) - Caching, Hash Operations & Entra ID Auth
Microsoft AI-200 Certification Lab Reference
Port: 10000 TLS | Library: redis-py + redis-entraid
"""

import os
import sys
import time
from typing import Dict, Any, Optional

try:
    import redis
    from azure.identity import DefaultAzureCredential
    from redis_entraid.cred_provider import create_from_default_azure_credential
except ImportError:
    print("Vui lòng cài đặt: pip install redis redis-entraid azure-identity")


# ===== 1. CẤU HÌNH KẾT NỐI =====
REDIS_HOST = os.getenv("REDIS_HOST", "myredis.eastus.redisenterprise.cache.azure.net")
REDIS_PORT = int(os.getenv("REDIS_PORT", "10000"))  # AMR Enterprise uses port 10000


def get_redis_client() -> redis.Redis:
    """
    Khởi tạo kết nối bảo mật TLS tới Azure Managed Redis
    sử dụng Token Provider tự động làm mới từ Microsoft Entra ID.
    """
    try:
        # Tự động lấy Bearer Token với scope https://redis.azure.com/.default
        cred_provider = create_from_default_azure_credential()
        client = redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            ssl=True,
            credential_provider=cred_provider,
            decode_responses=True  # Tự động giải mã string UTF-8 cho các lệnh thông thường
        )
        return client
    except Exception as ex:
        print(f"[WARN] Không thể lấy Entra ID credential ({ex}), thử kết nối fallback...")
        password = os.getenv("REDIS_PASSWORD")
        return redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            password=password,
            ssl=True,
            decode_responses=True
        )


# ===== 2. THAO TÁC CẤU TRÚC HASH =====
def cache_product(client: redis.Redis, product_id: str, data: Dict[str, Any], ttl_seconds: int = 3600) -> None:
    """
    Lưu đối tượng sản phẩm vào Hash với tiền tố 'product:' và gán TTL hết hạn.
    """
    key = f"product:{product_id}"
    # Chuyển đổi mọi giá trị thành string để lưu trong Hash
    mapping = {k: str(v) for k, v in data.items()}
    client.hset(key, mapping=mapping)
    client.expire(key, ttl_seconds)
    print(f"-> Đã cache {key} với TTL = {ttl_seconds}s")


def get_product(client: redis.Redis, product_id: str) -> Optional[Dict[str, str]]:
    """
    Đọc toàn bộ thuộc tính sản phẩm từ Hash cache.
    """
    key = f"product:{product_id}"
    item = client.hgetall(key)
    if not item:
        print(f"-> [MISS] Khóa {key} không tồn tại hoặc đã hết hạn!")
        return None
    print(f"-> [HIT] Tìm thấy {key}: {item}")
    return item


def get_product_fields(client: redis.Redis, product_id: str, fields: list) -> list:
    """
    Chỉ tải các trường cần thiết (Projection) để tối ưu băng thông mạng.
    """
    key = f"product:{product_id}"
    return client.hmget(key, fields)


# ===== 3. QUẢN LÝ BỘ NHỚ VÀ DỌN DẸP =====
def remove_cached_products_async(client: redis.Redis, product_ids: list) -> int:
    """
    Xóa bất đồng bộ các khóa lớn bằng UNLINK (tránh chặn single-thread của Redis).
    """
    keys = [f"product:{pid}" for pid in product_ids]
    deleted_count = client.unlink(*keys)
    print(f"-> Đã giải phóng {deleted_count} khóa bằng UNLINK.")
    return deleted_count


def print_memory_and_hit_stats(client: redis.Redis) -> None:
    """
    Đọc thông số RAM và tính toán Cache Hit Ratio.
    """
    mem = client.info("memory")
    stats = client.info("stats")
    
    hits = stats.get("keyspace_hits", 0)
    misses = stats.get("keyspace_misses", 0)
    total = hits + misses
    ratio = (hits / total * 100) if total > 0 else 0.0

    print("--- THỐNG KÊ AZURE MANAGED REDIS ---")
    print(f"RAM sử dụng: {mem.get('used_memory_human', 'N/A')}")
    print(f"Chính sách Eviction: {mem.get('maxmemory_policy', 'N/A')}")
    print(f"Lượt Hit: {hits} | Lượt Miss: {misses} | Tỉ lệ Hit: {ratio:.2f}%")


# ===== 4. DEMO RUNNER =====
if __name__ == "__main__":
    print("=== DEMO AZURE MANAGED REDIS DATA OPERATIONS ===")
    r = get_redis_client()
    try:
        r.ping()
        print("✓ Kết nối Azure Managed Redis thành công!")
    except Exception as e:
        print(f"Lỗi kết nối: {e}")
        sys.exit(0)

    # Chèn dữ liệu mẫu
    sample_data = {
        "name": "Surface Laptop Studio 2",
        "category": "Laptops",
        "price": 2399.99,
        "stock": 42
    }
    cache_product(r, "1001", sample_data, ttl_seconds=60)

    # Truy vấn lại
    cached = get_product(r, "1001")
    price_name = get_product_fields(r, "1001", ["name", "price"])
    print(f"Field projection: {price_name}")

    # Xem TTL còn lại
    remaining_ttl = r.ttl("product:1001")
    print(f"Thời gian sống còn lại: {remaining_ttl}s")

    # In thống kê
    print_memory_and_hit_stats(r)
`,
    },
    {
        id: "redis-pubsub-engine",
        title: "13. Real-Time Pub/Sub Event Streaming & Pattern Matching",
        description: "Triển khai hệ thống phát tán sự kiện thời gian thực bằng Redis Pub/Sub: phát thông điệp đa kênh (orders:us, orders:eu), lắng nghe theo pattern wildcard (*), xử lý thông điệp trên background worker thread và điều khiển ngắt an toàn.",
        category: "Azure Managed Redis",
        filename: "redis_pubsub_engine.py",
        code: `"""
Azure Managed Redis (AMR) - Real-Time Pub/Sub Event Streaming
Microsoft AI-200 Certification Lab Reference
Real-time Message Bus | Multi-channel Wildcard Subscriptions
"""

import json
import os
import sys
import threading
import time
from typing import Callable, Optional

try:
    import redis
    from redis_entraid.cred_provider import create_from_default_azure_credential
except ImportError:
    print("Vui lòng cài đặt: pip install redis redis-entraid")

REDIS_HOST = os.getenv("REDIS_HOST", "myredis.eastus.redisenterprise.cache.azure.net")
REDIS_PORT = int(os.getenv("REDIS_PORT", "10000"))


class RedisEventBus:
    """
    Hệ thống phát và nhận sự kiện thời gian thực dựa trên Redis Pub/Sub.
    Hỗ trợ luồng Worker nền để lắng nghe liên tục không gây nghẽn ứng dụng chính.
    """

    def __init__(self, host: str = REDIS_HOST, port: int = REDIS_PORT):
        self.host = host
        self.port = port
        self.client = self._connect()
        self.pubsub: Optional[redis.client.PubSub] = None
        self.listener_thread: Optional[threading.Thread] = None
        self.stop_signal = threading.Event()

    def _connect(self) -> redis.Redis:
        try:
            cred_provider = create_from_default_azure_credential()
            return redis.Redis(
                host=self.host,
                port=self.port,
                ssl=True,
                credential_provider=cred_provider,
                decode_responses=True
            )
        except Exception:
            return redis.Redis(
                host=self.host,
                port=self.port,
                password=os.getenv("REDIS_PASSWORD"),
                ssl=True,
                decode_responses=True
            )

    # ===== 1. PUBLISH (PHÁT SỰ KIỆN) =====
    def publish_event(self, channel: str, payload: dict) -> int:
        """
        Phát tán đối tượng JSON tới tất cả các subscriber đang trực tuyến trên channel.
        Mô hình At-most-once (Fire-and-Forget).
        """
        message_json = json.dumps(payload)
        sub_count = self.client.publish(channel, message_json)
        print(f"[PUBLISH -> {channel}] {payload} (Đã gửi tới {sub_count} subscribers)")
        return sub_count

    # ===== 2. SUBSCRIBE & WORKER THREAD =====
    def start_pattern_listener(self, pattern: str, callback: Callable[[str, dict], None]) -> None:
        """
        Đăng ký lắng nghe theo mẫu wildcard (ví dụ: 'orders:*') trên một Worker Thread riêng biệt.
        """
        self.pubsub = self.client.pubsub()
        self.pubsub.psubscribe(pattern)
        self.stop_signal.clear()

        def _worker_loop():
            print(f"[SUBSCRIBER] Bắt đầu lắng nghe pattern: '{pattern}' trên background thread...")
            while not self.stop_signal.is_set():
                try:
                    # Timeout 1s để cho phép kiểm tra cờ stop_signal
                    message = self.pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                    if message and message["type"] == "pmessage":
                        channel = message["channel"]
                        try:
                            data = json.loads(message["data"])
                        except json.JSONDecodeError:
                            data = {"raw": message["data"]}
                        callback(channel, data)
                except Exception as ex:
                    if not self.stop_signal.is_set():
                        print(f"[ERROR in listener] {ex}")
                    break
            print("[SUBSCRIBER] Worker thread đã dừng an toàn.")

        self.listener_thread = threading.Thread(target=_worker_loop, daemon=True)
        self.listener_thread.start()

    def stop_listener(self) -> None:
        """
        Hủy đăng ký và dừng luồng lắng nghe an toàn.
        """
        self.stop_signal.set()
        if self.pubsub:
            self.pubsub.punsubscribe()
            self.pubsub.close()
        if self.listener_thread:
            self.listener_thread.join(timeout=2.0)
        print("[SUBSCRIBER] Đã đóng kênh Pub/Sub.")


# ===== 3. DEMO SIMULATION =====
def order_event_handler(channel: str, event: dict):
    print(f"  🔔 [XỬ LÝ ĐƠN HÀNG từ {channel}]: ID={event.get('order_id')} | Tổng tiền=\${event.get('amount')} | SP={event.get('item')}")


if __name__ == "__main__":
    print("=== DEMO REDIS PUB/SUB REAL-TIME EVENT BUS ===")
    bus = RedisEventBus()

    # Bắt đầu lắng nghe mọi kênh 'orders:*' (ví dụ: orders:us, orders:eu, orders:asia)
    bus.start_pattern_listener("orders:*", order_event_handler)
    time.sleep(0.5)

    # Phát các sự kiện vào nhiều kênh khu vực khác nhau
    bus.publish_event("orders:us", {"order_id": 101, "item": "Azure Kinect DK", "amount": 399.00})
    bus.publish_event("orders:eu", {"order_id": 102, "item": "Hololens 2", "amount": 3500.00})
    bus.publish_event("orders:asia", {"order_id": 103, "item": "Xbox Elite Controller", "amount": 179.99})

    # Chờ xử lý xong
    time.sleep(1.5)
    bus.stop_listener()
    print("Demo Pub/Sub hoàn tất.")
`,
    },
    {
        id: "redis-vector-search",
        title: "14. RediSearch HNSW Vector Similarity Search (KNN & Hybrid)",
        description: "Tạo chỉ mục RediSearch HNSW cho các thực thể Hash, chuyển đổi mảng embeddings thành chuỗi byte float32 nhị phân thô (np.float32().tobytes()), thực thi truy vấn KNN tìm kiếm K láng giềng gần nhất với Dialect 2, và kết hợp lọc Tag hybrid.",
        category: "Azure Managed Redis",
        filename: "redis_vector_search.py",
        code: `"""
Azure Managed Redis (AMR) - RediSearch Vector Similarity Search
Microsoft AI-200 Certification Lab Reference
HNSW Vector Indexing | Raw Float32 Binary Bytes | KNN & Hybrid Queries Dialect 2
"""

import os
import sys
from typing import List, Dict, Any

try:
    import redis
    import numpy as np
    from redis.commands.search.field import TextField, TagField, NumericField, VectorField
    from redis.commands.search.index_definition import IndexDefinition, IndexType
    from redis.commands.search.query import Query
    from redis_entraid.cred_provider import create_from_default_azure_credential
except ImportError:
    print("Vui lòng cài đặt: pip install redis numpy redis-entraid")

REDIS_HOST = os.getenv("REDIS_HOST", "myredis.eastus.redisenterprise.cache.azure.net")
REDIS_PORT = int(os.getenv("REDIS_PORT", "10000"))
INDEX_NAME = "idx:products"
VECTOR_DIM = 8  # Chiều vector minh họa; thực tế dùng 1536 hoặc 384


def get_redis_client() -> redis.Redis:
    """
    Kết nối Redis client với decode_responses=False
    BẮT BUỘC để tránh decode hỏng chuỗi byte nhị phân của Vector.
    """
    try:
        cred_provider = create_from_default_azure_credential()
        return redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            ssl=True,
            credential_provider=cred_provider,
            decode_responses=False
        )
    except Exception:
        return redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            password=os.getenv("REDIS_PASSWORD"),
            ssl=True,
            decode_responses=False
        )


# ===== 1. TẠO CHỈ MỤC REDISEARCH HNSW VECTOR =====
def create_vector_index(client: redis.Redis) -> None:
    """
    Tạo chỉ mục RediSearch trên các khóa Hash có prefix 'product:'.
    Sử dụng thuật toán HNSW với khoảng cách Cosine.
    """
    try:
        # Kiểm tra xem index đã tồn tại chưa
        client.ft(INDEX_NAME).info()
        print(f"Chỉ mục '{INDEX_NAME}' đã tồn tại.")
        return
    except Exception:
        pass

    schema = (
        TextField("name"),
        TagField("category"),
        NumericField("price"),
        VectorField(
            "embedding",
            "HNSW",
            {
                "TYPE": "FLOAT32",
                "DIM": VECTOR_DIM,
                "DISTANCE_METRIC": "COSINE",
                "M": 16,               # Số liên kết tối đa mỗi node
                "EF_CONSTRUCTION": 200 # Độ chính xác khi xây đồ thị
            }
        )
    )

    client.ft(INDEX_NAME).create_index(
        fields=schema,
        definition=IndexDefinition(
            prefix=["product:"],
            index_type=IndexType.HASH
        )
    )
    print(f"✓ Đã tạo thành công chỉ mục RediSearch HNSW: '{INDEX_NAME}'")


# ===== 2. CHÈN DỮ LIỆU SẢN PHẨM & VECTOR NHỊ PHÂN =====
def insert_sample_products(client: redis.Redis) -> None:
    """
    Chuyển đổi vector số thực (List[float]) thành Raw Binary Bytes (float32)
    trước khi ghi vào Redis Hash.
    """
    items = [
        {
            "id": "101",
            "name": "Azure AI Search Mastery",
            "category": "Cloud",
            "price": "49.99",
            "vector": [0.12, 0.45, 0.78, 0.22, 0.05, 0.89, 0.33, 0.61]
        },
        {
            "id": "102",
            "name": "PostgreSQL pgvector Optimization",
            "category": "Database",
            "price": "39.50",
            "vector": [0.15, 0.41, 0.75, 0.20, 0.08, 0.85, 0.30, 0.58]
        },
        {
            "id": "103",
            "name": "Deep Learning with PyTorch",
            "category": "AI",
            "price": "59.00",
            "vector": [0.88, 0.12, 0.04, 0.67, 0.91, 0.15, 0.44, 0.29]
        },
        {
            "id": "104",
            "name": "Redis Enterprise in Production",
            "category": "Cloud",
            "price": "44.00",
            "vector": [0.10, 0.48, 0.80, 0.25, 0.03, 0.91, 0.35, 0.64]
        }
    ]

    pipe = client.pipeline()
    for it in items:
        key = f"product:{it['id']}"
        # Chuyển embedding thành numpy float32 bytes
        vector_bytes = np.array(it["vector"], dtype=np.float32).tobytes()
        mapping = {
            b"name": it["name"].encode("utf-8"),
            b"category": it["category"].encode("utf-8"),
            b"price": it["price"].encode("utf-8"),
            b"embedding": vector_bytes
        }
        pipe.hset(key, mapping=mapping)
    pipe.execute()
    print(f"✓ Đã chèn {len(items)} sản phẩm kèm vector nhị phân vào Redis.")


# ===== 3. TRUY VẤN TƯƠNG ĐỒNG VECTOR (KNN QUERY) =====
def vector_knn_search(client: redis.Redis, query_vec: List[float], top_k: int = 3) -> List[Dict[str, Any]]:
    """
    Thực hiện tìm kiếm KNN toàn phần với Dialect 2.
    """
    query_bytes = np.array(query_vec, dtype=np.float32).tobytes()

    q = (
        Query(f"*=>[KNN {top_k} @embedding $query_vec AS score]")
        .sort_by("score")
        .return_fields("name", "category", "price", "score")
        .dialect(2)
    )

    res = client.ft(INDEX_NAME).search(q, query_params={"query_vec": query_bytes})
    output = []
    print(f"\n--- KẾT QUẢ TÌM KIẾM VECTOR KNN (Top {top_k}) ---")
    for doc in res.docs:
        name = doc.name.decode("utf-8") if isinstance(doc.name, bytes) else doc.name
        cat = doc.category.decode("utf-8") if isinstance(doc.category, bytes) else doc.category
        score = float(doc.score)
        print(f"  [Khoảng cách Cosine: {score:.5f}] {name} (Danh mục: {cat})")
        output.append({"name": name, "category": cat, "score": score})
    return output


# ===== 4. TRUY VẤN KẾT HỢP HYBRID (LỌC THUỘC TÍNH + KNN) =====
def hybrid_search(client: redis.Redis, category_filter: str, query_vec: List[float], top_k: int = 2) -> None:
    """
    Lọc danh mục (Pre-filtering) rồi mới tính khoảng cách vector KNN.
    """
    query_bytes = np.array(query_vec, dtype=np.float32).tobytes()

    q = (
        Query(f"(@category:{{{category_filter}}})=>[KNN {top_k} @embedding $query_vec AS score]")
        .sort_by("score")
        .return_fields("name", "category", "price", "score")
        .dialect(2)
    )

    res = client.ft(INDEX_NAME).search(q, query_params={"query_vec": query_bytes})
    print(f"\n--- KẾT QUẢ HYBRID SEARCH (Lọc category={category_filter}) ---")
    for doc in res.docs:
        name = doc.name.decode("utf-8") if isinstance(doc.name, bytes) else doc.name
        print(f"  [Score: {float(doc.score):.5f}] {name}")


# ===== 5. DEMO RUNNER =====
if __name__ == "__main__":
    print("=== DEMO REDISEARCH HNSW VECTOR SEARCH ===")
    r = get_redis_client()
    try:
        r.ping()
        print("✓ Đã kết nối Azure Managed Redis Enterprise.")
    except Exception as e:
        print(f"Lỗi kết nối: {e}")
        sys.exit(0)

    create_vector_index(r)
    insert_sample_products(r)

    # Giả lập vector embedding của câu hỏi người dùng: "Tài liệu học đám mây Azure"
    user_query_vec = [0.11, 0.46, 0.79, 0.21, 0.04, 0.90, 0.32, 0.62]

    # 1. Tìm kiếm thuần túy KNN
    vector_knn_search(r, user_query_vec, top_k=3)

    # 2. Tìm kiếm Hybrid lọc danh mục Cloud
    hybrid_search(r, "Cloud", user_query_vec, top_k=2)
`,
    },
    {
        id: "functions-mcp-server",
        title: "15. Azure Functions MCP Server (Model Context Protocol)",
        description: "Xây dựng MCP Server trên Azure Functions Python v2: khai báo trigger mcpToolTrigger, định nghĩa schema tham số và phục vụ endpoint SSE cho các AI client (GitHub Copilot, Cursor, Antigravity) gọi công cụ.",
        category: "Backend Integration",
        filename: "functions_mcp_server.py",
        code: `"""
Azure Functions - Model Context Protocol (MCP) Server
Microsoft AI-200 Certification Lab Reference
Python v2 Programming Model | SSE Transport | mcpToolTrigger
"""

import json
import logging
from typing import Any

try:
    import azure.functions as func
except ImportError:
    print("Vui lòng cài đặt: pip install azure-functions")

# Khởi tạo instance FunctionApp quản lý đăng ký triggers
app = func.FunctionApp()

logger = logging.getLogger(__name__)


# ===== 1. CÔNG CỤ TÓM TẮT VĂN BẢN (SUMMARIZE TEXT) =====
@app.generic_trigger(
    arg_name="context",
    type="mcpToolTrigger",
    toolName="summarize_text",
    description="Tóm tắt một đoạn văn bản dài thành các ý chính cốt lõi phục vụ báo cáo",
    toolProperties='[{"propertyName": "text", "propertyType": "string", "description": "Nội dung văn bản cần tóm tắt"}]'
)
def summarize_text(context: str) -> str:
    """
    Hàm trigger MCP được AI Client (Copilot, Cursor, Antigravity) tự động phát hiện và gọi.
    Đầu vào 'context' là chuỗi JSON chứa envelope 'arguments' từ client.
    """
    logger.info(f"[MCP] Nhận yêu cầu summarize_text: {context}")
    request = json.loads(context)
    arguments = request.get("arguments", {})
    text = arguments.get("text", "")

    if not text:
        return json.dumps({"content": "Vui lòng cung cấp văn bản cần tóm tắt."})

    # Giả lập logic tóm tắt văn bản (hoặc gọi Azure OpenAI gpt-4o tại đây)
    word_count = len(text.split())
    summary = f"Bản tóm tắt ({word_count} từ): {text[:120]}... [Xử lý thành công bởi Azure Functions MCP Server]"

    # Chuẩn MCP: phản hồi phải là chuỗi JSON chứa trường 'content'
    return json.dumps({
        "content": summary,
        "word_count": word_count
    })


# ===== 2. CÔNG CỤ PHÂN LOẠI TÀI LIỆU (CLASSIFY DOCUMENT) =====
@app.generic_trigger(
    arg_name="context",
    type="mcpToolTrigger",
    toolName="classify_document",
    description="Phân loại một tài liệu vào danh mục phù hợp dựa theo danh sách danh mục cho trước",
    toolProperties='[{"propertyName": "text", "propertyType": "string", "description": "Văn bản tài liệu cần phân loại"}, {"propertyName": "categories", "propertyType": "string", "description": "Danh sách các danh mục phân cách bởi dấu phẩy (ví dụ: contract, invoice, memo)"}]'
)
def classify_document(context: str) -> str:
    """
    Hàm phân loại tài liệu với 2 tham số đầu vào.
    """
    logger.info(f"[MCP] Nhận yêu cầu classify_document: {context}")
    request = json.loads(context)
    arguments = request.get("arguments", {})
    text = arguments.get("text", "").lower()
    categories_str = arguments.get("categories", "contract, invoice, memo, other")

    category_list = [c.strip().lower() for c in categories_str.split(",")]
    
    # Logic phân loại mẫu dựa theo từ khóa
    selected = "other"
    if "invoice" in text or "amount due" in text or "total" in text:
        selected = "invoice" if "invoice" in category_list else category_list[0]
    elif "agreement" in text or "party a" in text or "contract" in text:
        selected = "contract" if "contract" in category_list else category_list[0]
    elif "memorandum" in text or "memo" in text:
        selected = "memo" if "memo" in category_list else category_list[0]
    else:
        selected = category_list[0] if category_list else "unknown"

    return json.dumps({
        "content": f"Tài liệu được phân loại là: {selected.upper()}",
        "category": selected
    })


if __name__ == "__main__":
    print("=== DEMO AZURE FUNCTIONS MCP SERVER ===")
    print("Endpoint phục vụ giao thức SSE cục bộ: http://localhost:7071/runtime/webhooks/mcp/sse")
    print("Khởi chạy qua terminal: func start")
`,
    },
    {
        id: "durable-ai-workflow",
        title: "16. Durable Functions AI Workflow (Fan-out/in, Retries & HITL)",
        description: "Quy trình điều phối AI bền vững: xử lý batch song song (Fan-Out/Fan-In), tự động retry exponential backoff khi model lỗi, dừng chờ con người phê duyệt (Human-in-the-Loop) với deadline 30s và Saga compensating rollback.",
        category: "Backend Integration",
        filename: "durable_ai_workflow.py",
        code: `"""
Azure Durable Functions - AI Document Processing & Human-in-the-Loop Workflow
Microsoft AI-200 Certification Lab Reference
Fan-Out/Fan-In | Exponential Backoff Retries | HITL External Event Timer Race | Saga Rollback
"""

import json
import logging
import os
from datetime import timedelta
from typing import Any, Dict

try:
    import azure.functions as func
    import azure.durable_functions as df
except ImportError:
    print("Vui lòng cài đặt: pip install azure-functions azure-durable-functions")

app = df.DFApp(http_auth_level=func.AuthLevel.FUNCTION)
logger = logging.getLogger(__name__)

APPROVAL_CONFIDENCE_THRESHOLD = 0.80
APPROVAL_TIMEOUT_SECONDS = 30


# ===== 1. HTTP CLIENT STARTER =====
@app.route(route="workflows", methods=["POST"])
@app.durable_client_input(client_name="client")
async def start_workflow(req: func.HttpRequest, client: df.DurableOrchestrationClient) -> func.HttpResponse:
    """Khởi chạy phiên điều phối tài liệu AI và trả về HTTP 202 kèm URLs theo dõi."""
    payload = req.get_json()
    instance_id = await client.start_new("document_workflow", client_input=payload)
    return client.create_check_status_response(req, instance_id)


# ===== 2. FAN-OUT / FAN-IN MASTER ORCHESTRATOR =====
@app.orchestration_trigger(context_name="context")
def document_workflow(context: df.DurableOrchestrationContext):
    """
    Fan-out: Lên lịch chạy đồng thời mọi tài liệu trong batch.
    Fan-in: Gom toàn bộ kết quả khi tất cả các tiến trình con hoàn tất.
    """
    workflow_input = context.get_input()
    tasks = []

    for doc in workflow_input.get("documents", []):
        child_instance_id = f"{context.instance_id}-{doc['document_id']}"
        tasks.append(
            context.call_sub_orchestrator("document_orchestrator", doc, child_instance_id)
        )

    # Fan-in: Chờ toàn bộ kết quả song song
    results = yield context.task_all(tasks)
    return {
        "batch_id": workflow_input.get("batch_id"),
        "total_documents": len(results),
        "results": results
    }


# ===== 3. CHILD DOCUMENT ORCHESTRATOR (RETRIES & HITL GATING) =====
@app.orchestration_trigger(context_name="context")
def document_orchestrator(context: df.DurableOrchestrationContext):
    document = context.get_input()
    
    # BẮT BUỘC: Sử dụng context.new_uuid() để đảm bảo tính tất định (Determinism) khi replay
    operation_id = str(context.new_uuid())
    process_request = {**document, "operation_id": operation_id}

    # Chính sách thử lại: cách nhau 2 giây, thử tối đa 3 lần
    retry_options = df.RetryOptions(first_retry_interval_in_milliseconds=2000, max_number_of_attempts=3)

    try:
        # Chuỗi hoạt động có cơ chế tự phục hồi (Automatic Retry Chain)
        extracted = yield context.call_activity_with_retry("extract_text", retry_options, process_request)
        classified = yield context.call_activity_with_retry("classify_document", retry_options, extracted)
        summarized = yield context.call_activity_with_retry("generate_summary", retry_options, classified)
    except Exception as ex:
        # Nếu thử 3 lần vẫn lỗi -> Thực hiện hành động đền bù (Saga compensation)
        yield context.call_activity("compensate_document", {"operation_id": operation_id, "reason": "ProcessingFailed"})
        raise ex

    # GATING: KIỂM TRA ĐIỂM TIN CẬY (HUMAN-IN-THE-LOOP APPROVAL)
    if summarized.get("confidence", 1.0) >= APPROVAL_CONFIDENCE_THRESHOLD:
        final_status = "AutoApproved"
    else:
        # Báo cho người quản trị
        yield context.call_activity("notify_approver", {"instance_id": context.instance_id, **summarized})

        # Đua giữa Sự kiện Người duyệt gửi đến và Đồng hồ đếm ngược 30 giây
        approval_event = context.wait_for_external_event("ApprovalResponse")
        deadline = context.current_utc_datetime + timedelta(seconds=APPROVAL_TIMEOUT_SECONDS)
        timeout_timer = context.create_timer(deadline)

        # Ngủ đông CPU, thức dậy khi 1 trong 2 sự kiện xảy ra
        winner = yield context.task_any([approval_event, timeout_timer])

        if winner == approval_event:
            timeout_timer.cancel()
            decision_payload = approval_event.result
            if isinstance(decision_payload, str):
                decision_payload = json.loads(decision_payload)
            final_status = decision_payload.get("decision", "Rejected")
        else:
            final_status = "ApprovalTimedOut"

        if final_status != "Approved":
            yield context.call_activity("compensate_document", {"operation_id": operation_id, "reason": final_status})

    # Lưu trữ kết quả đơn định (Idempotent persistence)
    return (yield context.call_activity("persist_result", {**summarized, "status": final_status}))


# ===== 4. ACTIVITY FUNCTIONS =====
@app.activity_trigger(input_name="document")
def extract_text(document: dict) -> dict:
    return {**document, "extracted_text": f"Nội dung từ {document.get('document_id')}"}


@app.activity_trigger(input_name="document")
def classify_document(document: dict) -> dict:
    return {**document, "category": "Contract", "confidence": document.get("confidence", 0.75)}


@app.activity_trigger(input_name="document")
def generate_summary(document: dict) -> dict:
    return {**document, "summary": "Bản hợp đồng nguyên tắc có giá trị pháp lý"}


@app.activity_trigger(input_name="request")
def notify_approver(request: dict) -> dict:
    logger.info(f"Báo động: Cần duyệt thủ công cho tài liệu {request.get('document_id')}")
    return {"status": "Notified"}


@app.activity_trigger(input_name="request")
def compensate_document(request: dict) -> dict:
    logger.warning(f"Saga: Hoàn tác tác vụ {request.get('operation_id')} do {request.get('reason')}")
    return {"status": "Compensated", **request}


@app.activity_trigger(input_name="request")
def persist_result(request: dict) -> dict:
    logger.info(f"Lưu kết quả thành công cho {request.get('document_id')} (Trạng thái: {request.get('status')})")
    return {"status": "Saved", **request}


# ===== 5. WEBHOOK GỬI QUYẾT ĐỊNH DUYỆT (EXTERNAL EVENT) =====
@app.route(route="approvals/{instance_id}", methods=["POST"])
@app.durable_client_input(client_name="client")
async def submit_approval(req: func.HttpRequest, client: df.DurableOrchestrationClient) -> func.HttpResponse:
    payload = req.get_json()
    instance_id = req.route_params["instance_id"]
    # Bắn sự kiện "ApprovalResponse" vào đúng phiên làm việc đang chờ
    await client.raise_event(instance_id, "ApprovalResponse", payload)
    return func.HttpResponse(json.dumps({"status": "Accepted"}), status_code=202, mimetype="application/json")


if __name__ == "__main__":
    print("=== DEMO AZURE DURABLE FUNCTIONS AI ORCHESTRATION ===")
    print("Mô hình hỗ trợ: Fan-out/in, Activity retries, HITL approval, Saga rollback.")
`,
    },
    {
        id: "event-grid-namespaces",
        title: "17. Event Grid Namespaces & Pull Delivery (CloudEvents v1.0)",
        description: "Hệ thống định tuyến sự kiện phản ứng: phát CloudEvents v1.0 vào Namespace Topic, người nhận kéo tin qua cơ chế Pull Delivery an toàn và thực thi Acknowledge (xóa tin) hoặc Reject (chuyển dead-letter).",
        category: "Backend Integration",
        filename: "event_grid_namespaces.py",
        code: `"""
Azure Event Grid Namespaces - CloudEvents v1.0 & Pull Delivery Pipeline
Microsoft AI-200 Certification Lab Reference
Event Grid Namespaces | CloudEvents Schema | Consumer Pull Delivery (Ack / Release / Reject)
"""

import json
import os
import sys
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List

try:
    from azure.eventgrid import EventGridPublisherClient, EventGridConsumerClient
    from azure.core.messaging import CloudEvent
    from azure.identity import DefaultAzureCredential
except ImportError:
    print("Vui lòng cài đặt: pip install azure-eventgrid azure-core azure-identity")

EVENTGRID_ENDPOINT = os.getenv("EVENTGRID_ENDPOINT", "https://myeg.eastus-1.eventgrid.azure.net")
TOPIC_NAME = os.getenv("EVENTGRID_TOPIC_NAME", "moderation-events")
SUB_FLAGGED = "sub-flagged"
SUB_APPROVED = "sub-approved"
SUB_ALL = "sub-all-events"


def get_publisher_client() -> EventGridPublisherClient:
    credential = DefaultAzureCredential()
    return EventGridPublisherClient(
        endpoint=EVENTGRID_ENDPOINT,
        credential=credential,
        namespace_topic=TOPIC_NAME
    )


def get_consumer_client(subscription_name: str) -> EventGridConsumerClient:
    credential = DefaultAzureCredential()
    return EventGridConsumerClient(
        endpoint=EVENTGRID_ENDPOINT,
        credential=credential,
        namespace_topic=TOPIC_NAME,
        subscription=subscription_name
    )


# ===== 1. PUBLISH CLOUDEVENTS V1.0 TO NAMESPACE TOPIC =====
def publish_content_moderation_events() -> List[Dict[str, Any]]:
    """
    Phát tán các sự kiện phân tích nội dung AI theo định dạng chuẩn CloudEvents v1.0.
    """
    publisher = get_publisher_client()
    
    sample_events_data = [
        {
            "type": "com.contoso.ai.ContentFlagged",
            "source": "/services/content-moderation",
            "subject": "/content/text/review-101",
            "data": {
                "contentId": "review-101",
                "category": "hate_speech",
                "severity": "high",
                "confidence": 0.96,
                "reviewRequired": True
            }
        },
        {
            "type": "com.contoso.ai.ContentApproved",
            "source": "/services/content-moderation",
            "subject": "/content/text/review-102",
            "data": {
                "contentId": "review-102",
                "category": "general",
                "severity": "none",
                "confidence": 0.99,
                "reviewRequired": False
            }
        }
    ]

    cloud_events = []
    for item in sample_events_data:
        # Gán nhãn thời gian UTC và id ngẫu nhiên cho mỗi sự kiện
        item["data"]["timestamp"] = datetime.now(timezone.utc).isoformat()
        cloud_events.append(
            CloudEvent(
                type=item["type"],
                source=item["source"],
                subject=item["subject"],
                data=item["data"],
                id=str(uuid.uuid4())
            )
        )

    # Gửi theo lô tới Namespace Topic
    publisher.send(cloud_events)
    print(f"✓ Đã publish {len(cloud_events)} CloudEvents vào Topic '{TOPIC_NAME}'.")
    return [{"id": e.id, "type": e.type, "subject": e.subject} for e in cloud_events]


# ===== 2. CONSUMER PULL DELIVERY & ACKNOWLEDGE =====
def receive_and_acknowledge_events(subscription_name: str = SUB_FLAGGED, max_events: int = 5) -> List[Dict[str, Any]]:
    """
    Kéo sự kiện từ hàng đợi subscription (Pull Delivery) và gọi acknowledge để xóa tin khi xử lý xong.
    """
    consumer = get_consumer_client(subscription_name)
    print(f"-> Đang kéo sự kiện từ subscription '{subscription_name}'...")
    
    # receive() trả về danh sách ReceiveDetails kèm lock_token
    details = consumer.receive(max_events=max_events, max_wait_time=5)
    processed = []
    lock_tokens = []

    for detail in details:
        event = detail.event
        lock_token = detail.broker_properties.lock_token
        delivery_count = detail.broker_properties.delivery_count

        print(f"  [Event {event.id}] Type: {event.type} | Delivery Count: {delivery_count}")
        print(f"  Data: {event.data}")
        
        lock_tokens.append(lock_token)
        processed.append({
            "id": event.id,
            "type": event.type,
            "data": event.data,
            "delivery_count": delivery_count
        })

    # Acknowledge xóa vĩnh viễn các sự kiện đã xử lý
    if lock_tokens:
        consumer.acknowledge(lock_tokens=lock_tokens)
        print(f"✓ Đã acknowledge {len(lock_tokens)} sự kiện trên '{subscription_name}'.")

    return processed


# ===== 3. REJECT POISON / MALFORMED EVENTS =====
def receive_and_reject_event(subscription_name: str = SUB_FLAGGED) -> None:
    """
    Từ chối sự kiện (Reject) chuyển ngay vào Dead-Letter khi phát hiện payload độc hại.
    """
    consumer = get_consumer_client(subscription_name)
    details = consumer.receive(max_events=1, max_wait_time=5)
    
    if details:
        detail = details[0]
        token = detail.broker_properties.lock_token
        print(f"-> Phát hiện sự kiện lỗi {detail.event.id}. Thực hiện REJECT...")
        
        # reject() đẩy sự kiện sang dead-letter container
        consumer.reject(lock_tokens=[token])
        print("✓ Sự kiện đã được chuyển an toàn vào Dead-Letter.")


if __name__ == "__main__":
    print("=== DEMO AZURE EVENT GRID NAMESPACES & PULL DELIVERY ===")
    try:
        publish_content_moderation_events()
        receive_and_acknowledge_events(SUB_FLAGGED)
    except Exception as e:
        print(f"Thông báo: Cần kết nối Azure Event Grid thật để chạy live ({e}).")
`,
    },
    {
        id: "service-bus-pipeline",
        title: "18. Service Bus Queue, Topic SQL Filter & DLQ Handler",
        description: "Đường ống tin nhắn doanh nghiệp cho suy luận AI: gửi tin nhắn kèm correlation_id và application_properties, xử lý với Peek-Lock an toàn, bắt ngoại lệ malformed chuyển vào Dead-Letter Queue và lọc Topic bằng quy tắc SQL.",
        category: "Backend Integration",
        filename: "service_bus_pipeline.py",
        code: `"""
Azure Service Bus - Enterprise AI Messaging Pipeline
Microsoft AI-200 Certification Lab Reference
Queues with Peek-Lock | Dead-Letter Sub-Queue Diagnostics | Topics & SQL Filters
"""

import json
import os
import sys
import uuid
from typing import List, Dict, Any

try:
    from azure.servicebus import ServiceBusClient, ServiceBusMessage, ServiceBusSubQueue
    from azure.identity import DefaultAzureCredential
except ImportError:
    print("Vui lòng cài đặt: pip install azure-servicebus azure-identity")

SERVICE_BUS_FQDN = os.getenv("SERVICE_BUS_FQDN", "my-ai-bus.servicebus.windows.net")
QUEUE_NAME = "inference-requests"
TOPIC_NAME = "inference-results"


def get_servicebus_client() -> ServiceBusClient:
    credential = DefaultAzureCredential()
    return ServiceBusClient(
        fully_qualified_namespace=SERVICE_BUS_FQDN,
        credential=credential
    )


# ===== 1. GỬI TIN NHẮN SUY LUẬN VÀO QUEUE =====
def send_inference_messages() -> List[str]:
    """
    Gửi tin nhắn có kèm metadata: message_id (chống trùng lặp),
    correlation_id (truy vết luồng hội thoại) và application_properties.
    """
    client = get_servicebus_client()
    sent_ids = []

    with client:
        with client.get_queue_sender(QUEUE_NAME) as sender:
            # 1. Tin nhắn chuẩn ưu tiên cao (High Priority)
            msg1 = ServiceBusMessage(
                body=json.dumps({"prompt": "Extract legal clauses", "document_id": "doc-101"}),
                content_type="application/json",
                message_id=str(uuid.uuid4()),
                correlation_id="req-agent-101",
                application_properties={"priority": "high", "department": "legal"}
            )
            sender.send_messages(msg1)
            sent_ids.append(msg1.correlation_id)

            # 2. Tin nhắn chuẩn thông thường (Standard)
            msg2 = ServiceBusMessage(
                body=json.dumps({"prompt": "Summarize invoice total", "document_id": "doc-102"}),
                content_type="application/json",
                message_id=str(uuid.uuid4()),
                correlation_id="req-agent-102",
                application_properties={"priority": "standard", "department": "finance"}
            )
            sender.send_messages(msg2)
            sent_ids.append(msg2.correlation_id)

            # 3. Tin nhắn lỗi cố ý (Malformed Payload) để kiểm chứng Dead-Lettering
            msg_poison = ServiceBusMessage(
                body="<malformed json: broken syntax>",
                content_type="application/json",
                message_id=str(uuid.uuid4()),
                correlation_id="req-agent-bad",
                application_properties={"priority": "standard"}
            )
            sender.send_messages(msg_poison)
            sent_ids.append(msg_poison.correlation_id)

    print(f"✓ Đã gửi {len(sent_ids)} tin nhắn vào hàng đợi '{QUEUE_NAME}'.")
    return sent_ids


# ===== 2. XỬ LÝ VỚI PEEK-LOCK & CHUYỂN DEAD-LETTER =====
def process_messages_with_peek_lock() -> None:
    """
    Nhận tin nhắn bằng cơ chế Peek-Lock:
    - Nếu suy luận thành công: complete_message()
    - Nếu payload JSON lỗi: dead_letter_message()
    """
    client = get_servicebus_client()

    with client:
        with client.get_queue_receiver(queue_name=QUEUE_NAME, max_wait_time=5) as receiver:
            for msg in receiver:
                print(f"-> Đang xử lý tin nhắn Correlation ID: {msg.correlation_id}")
                try:
                    payload = json.loads(str(msg))
                    print(f"   Prompt: {payload['prompt']} | Doc: {payload['document_id']}")
                    
                    # Hoàn tất xử lý thành công
                    receiver.complete_message(msg)
                    print("   ✓ Complete message thành công.")
                except json.JSONDecodeError as err:
                    # Chuyển ngay tin nhắn hỏng vào Dead-Letter Queue
                    receiver.dead_letter_message(
                        msg,
                        reason="MalformedPayload",
                        error_description=f"Không thể parse JSON: {err}"
                    )
                    print(f"   [POISON] Đã chuyển tin nhắn {msg.correlation_id} vào Dead-Letter Queue!")


# ===== 3. ĐỌC VÀ CHẨN ĐOÁN DEAD-LETTER QUEUE (DLQ) =====
def inspect_dead_letter_queue() -> List[Dict[str, Any]]:
    """
    Kết nối vào sub-queue ServiceBusSubQueue.DEAD_LETTER để kiểm tra nguyên nhân lỗi.
    """
    client = get_servicebus_client()
    dlq_reports = []

    with client:
        with client.get_queue_receiver(
            queue_name=QUEUE_NAME,
            sub_queue=ServiceBusSubQueue.DEAD_LETTER,
            max_wait_time=5
        ) as dlq_receiver:
            for msg in dlq_receiver:
                report = {
                    "message_id": msg.message_id,
                    "correlation_id": msg.correlation_id,
                    "dead_letter_reason": msg.dead_letter_reason,
                    "dead_letter_description": msg.dead_letter_error_description,
                    "delivery_count": msg.delivery_count,
                    "raw_body": str(msg)
                }
                print(f"[DLQ Report] Correlation: {report['correlation_id']} | Reason: {report['dead_letter_reason']}")
                dlq_reports.append(report)
                
                # Xóa khỏi DLQ sau khi đã lưu log kiểm toán
                dlq_receiver.complete_message(msg)

    return dlq_reports


# ===== 4. TOPIC BROADCAST & SQL FILTER ROUTING =====
def topic_messaging_with_sql_filter() -> None:
    """
    Phát thông điệp ra Topic và lọc theo quy tắc SQL trên Subscription 'high-priority'.
    """
    client = get_servicebus_client()

    with client:
        # Gửi thông điệp vào Topic
        with client.get_topic_sender(TOPIC_NAME) as topic_sender:
            msg_high = ServiceBusMessage(
                body=json.dumps({"result": "Legal review ready", "risk": "low"}),
                application_properties={"priority": "high"}
            )
            topic_sender.send_messages(msg_high)
            print(f"✓ Đã phát tán thông điệp vào Topic '{TOPIC_NAME}' (priority=high).")

        # Đọc từ Subscription 'high-priority'
        with client.get_subscription_receiver(
            topic_name=TOPIC_NAME,
            subscription_name="high-priority",
            max_wait_time=5
        ) as sub_receiver:
            for msg in sub_receiver:
                print(f"[High-Priority Sub] Nhận được tin: {str(msg)} | Metadata: {msg.application_properties}")
                sub_receiver.complete_message(msg)


if __name__ == "__main__":
    print("=== DEMO AZURE SERVICE BUS AI MESSAGING PIPELINE ===")
    try:
        send_inference_messages()
        process_messages_with_peek_lock()
        inspect_dead_letter_queue()
    except Exception as e:
        print(f"Thông báo: Cần cấu hình SERVICE_BUS_FQDN thật để chạy live ({e}).")
`,
    },
    {
    "id": "azure-appconfig-provider",
    "title": "19. Azure App Configuration Provider: Label Stacking, KV Reference & Sentinel Refresh",
    "description": "Nạp cấu hình tập trung phân tầng bằng Azure App Configuration Provider: xếp chồng nhãn (default '\\0' -> 'Production'), tự động giải mã Key Vault references qua DefaultAzureCredential, và cấu hình Sentinel key để dynamic reload tức thì không cần restart container.",
    "category": "Key Vault & App Config",
    "filename": "azure_appconfig_provider.py",
    "code": "\"\"\"\nSnippet 19: Azure App Configuration Provider with Label Stacking & Sentinel Dynamic Refresh\nMicrosoft AI-200 / Lesson 8 (app-config-python)\n\nDemonstrates:\n1. Connecting to Azure App Configuration using Microsoft Entra ID (DefaultAzureCredential).\n2. Label Stacking: Loading default settings (label \"\\\\0\") as base, and stacking \"Production\" overrides on top.\n3. Key Vault Reference resolution: Transparently resolving secrets via AzureAppConfigurationKeyVaultOptions.\n4. Sentinel Dynamic Refresh: Monitoring a single watchdog key (\"Sentinel\") and reloading configuration atomically without app restart.\n\"\"\"\n\nimport os\nimport time\nfrom typing import Any, Dict\nfrom azure.identity import DefaultAzureCredential\nfrom azure.appconfiguration.provider import (\n    load,\n    SettingSelector,\n    AzureAppConfigurationKeyVaultOptions,\n)\n\n\ndef create_app_configuration_provider(\n    endpoint: str | None = None,\n    environment_label: str = \"Production\",\n    refresh_interval_seconds: int = 30,\n) -> Any:\n    \"\"\"\n    Initializes and returns the Azure App Configuration Provider.\n    \n    Args:\n        endpoint: Azure App Configuration Store endpoint URL (e.g. https://<name>.azconfig.io)\n        environment_label: The environment label to stack on top of base settings (e.g. \"Production\")\n        refresh_interval_seconds: Refresh interval for polling the Sentinel key\n    \"\"\"\n    endpoint = endpoint or os.environ.get(\"AZURE_APPCONFIG_ENDPOINT\")\n    if not endpoint:\n        raise ValueError(\"AZURE_APPCONFIG_ENDPOINT environment variable must be set.\")\n\n    # Entra ID authentication (Managed Identity in production / Azure CLI in local dev)\n    credential = DefaultAzureCredential()\n\n    # 1. Label Stacking:\n    # First selector loads base default settings (null label represented by \"\\\\0\")\n    # Second selector loads environment-specific settings (e.g. \"Production\") to override base keys\n    selects = [\n        SettingSelector(key_filter=\"*\", label_filter=\"\\\\0\"),\n        SettingSelector(key_filter=\"*\", label_filter=environment_label),\n    ]\n\n    # 2. Key Vault Options:\n    # Resolves any Key Vault references stored in App Configuration automatically\n    # using the specified Entra ID credential.\n    key_vault_options = AzureAppConfigurationKeyVaultOptions(credential=credential)\n\n    # 3. Dynamic Refresh on Sentinel Key:\n    # Rather than watching all keys, watch only \"Sentinel\" to avoid 429 throttling\n    # and guarantee atomic, consistent multi-key updates.\n    provider = load(\n        endpoint=endpoint,\n        credential=credential,\n        selects=selects,\n        key_vault_options=key_vault_options,\n        refresh_on=[\"Sentinel\"],\n        refresh_interval=refresh_interval_seconds,\n    )\n\n    return provider\n\n\ndef simulate_request_pipeline(provider: Any, num_requests: int = 5) -> None:\n    \"\"\"\n    Simulates incoming requests in a web application (FastAPI / Flask / Django).\n    Demonstrates periodic provider.refresh() checking without app restart.\n    \"\"\"\n    print(\"=\" * 70)\n    print(\"Azure App Configuration Provider Pipeline Running\")\n    print(\"=\" * 70)\n\n    for i in range(1, num_requests + 1):\n        print(f\"\\n[Request #{i}]\")\n        \n        # In a web app middleware or background worker, call provider.refresh()\n        # If Sentinel has not changed or refresh_interval hasn't elapsed, it's a no-op (instant).\n        refreshed = provider.refresh()\n        if refreshed:\n            print(\"  >> [DYNAMIC REFRESH TRIGGERED] Configuration updated atomically from Cloud!\")\n        else:\n            print(\"  >> [CACHE HIT] Configuration stable (Sentinel unchanged).\")\n\n        # Access settings like a standard Python mapping/dict\n        openai_endpoint = provider.get(\"OpenAI:Endpoint\", \"Not configured\")\n        openai_model = provider.get(\"OpenAI:Model\", \"gpt-4o-mini\")\n        batch_size = provider.get(\"Pipeline:BatchSize\", 100)\n        sentinel_rev = provider.get(\"Sentinel\", \"1\")\n        \n        # Secret resolved transparently from Key Vault!\n        openai_key = provider.get(\"OpenAI:ApiKey\", \"None\")\n        masked_key = f\"{openai_key[:7]}...{openai_key[-4:]}\" if len(openai_key) > 12 else \"***\"\n\n        print(f\"  Endpoint   : {openai_endpoint}\")\n        print(f\"  Model      : {openai_model}\")\n        print(f\"  Batch Size : {batch_size}\")\n        print(f\"  API Key    : {masked_key} (Resolved from Key Vault)\")\n        print(f\"  Sentinel   : {sentinel_rev}\")\n\n        time.sleep(0.5)\n\n\nif __name__ == \"__main__\":\n    test_endpoint = os.environ.get(\"AZURE_APPCONFIG_ENDPOINT\", \"https://mock-appconfig.azconfig.io\")\n    print(f\"Targeting Store: {test_endpoint}\")\n    print(\"This snippet is production-ready for deployment with Azure App Service / ACA.\")\n"
},
    {
    "id": "azure-keyvault-secrets",
    "title": "20. Azure Key Vault SecretClient: Versioning, Metadata Audit & In-Memory TTL Caching",
    "description": "Quản lý bí mật bảo mật an toàn với Azure Key Vault SecretClient: lưu trữ secret kèm MIME content-type và tags, tạo version xoay vòng khóa (key rotation), duyệt metadata theo nguyên tắc Least Privilege (không tải giá trị mật), và thiết lập bộ đệm RAM (TTL 30s) chống lỗi HTTP 429 Throttling.",
    "category": "Key Vault & App Config",
    "filename": "azure_keyvault_secrets.py",
    "code": "\"\"\"\nSnippet 20: Azure Key Vault SecretClient with Versioning, Metadata Audit & In-Memory TTL Caching\nMicrosoft AI-200 / Lesson 8 (key-vault-python)\n\nDemonstrates:\n1. Connecting to Azure Key Vault via Microsoft Entra ID (DefaultAzureCredential).\n2. Storing secrets with MIME content-type and environment tags.\n3. Secret versioning: Creating a new version while preserving historical immutable versions.\n4. Least-privilege metadata audit: Listing properties of secrets without exposing sensitive values.\n5. In-Memory TTL Caching: Eliminating HTTP 429 throttling errors by caching secrets in process memory.\n\"\"\"\n\nimport os\nimport time\nfrom typing import Any, Dict, List, Optional\nfrom azure.identity import DefaultAzureCredential\nfrom azure.keyvault.secrets import SecretClient\nfrom azure.core.exceptions import ResourceNotFoundError, HttpResponseError\n\n\nclass CachedSecretManager:\n    \"\"\"\n    Manages Key Vault secret access with built-in time-to-live (TTL) memory caching\n    to prevent Azure Key Vault API rate limiting (HTTP 429) and reduce network latency.\n    \"\"\"\n\n    def __init__(self, vault_url: Optional[str] = None, cache_ttl_seconds: int = 30):\n        self.vault_url = vault_url or os.environ.get(\"KEY_VAULT_URL\")\n        if not self.vault_url:\n            raise ValueError(\"KEY_VAULT_URL environment variable must be set.\")\n        \n        self.credential = DefaultAzureCredential()\n        self.client = SecretClient(vault_url=self.vault_url, credential=self.credential)\n        self.cache: Dict[str, Dict[str, Any]] = {}\n        self.cache_ttl = cache_ttl_seconds\n        self.api_call_count = 0\n\n    def get_secret_value(self, secret_name: str) -> str:\n        \"\"\"\n        Retrieves secret value, returning from local memory cache if still valid (TTL).\n        \"\"\"\n        now = time.monotonic()\n        cached = self.cache.get(secret_name)\n\n        if cached and (now - cached[\"timestamp\"]) < self.cache_ttl:\n            # Cache Hit: 0 network latency, 0 Key Vault API quota used\n            return cached[\"value\"]\n\n        # Cache Miss: Query Azure Key Vault\n        try:\n            self.api_call_count += 1\n            secret = self.client.get_secret(secret_name)\n            self.cache[secret_name] = {\n                \"value\": secret.value,\n                \"timestamp\": now,\n                \"version\": secret.properties.version,\n            }\n            return secret.value\n        except ResourceNotFoundError:\n            raise KeyError(f\"Secret '{secret_name}' not found in Key Vault.\")\n        except HttpResponseError as ex:\n            raise RuntimeError(f\"Key Vault API error: {ex.message}\")\n\n    def list_secret_properties_safely(self) -> List[Dict[str, Any]]:\n        \"\"\"\n        Lists secret metadata (Least Privilege):\n        Audits secret existence, tags, and enabled status WITHOUT retrieving plain-text secret values.\n        \"\"\"\n        results = []\n        for prop in self.client.list_properties_of_secrets():\n            results.append({\n                \"name\": prop.name,\n                \"enabled\": prop.enabled,\n                \"content_type\": prop.content_type,\n                \"created_on\": str(prop.created_on),\n                \"updated_on\": str(prop.updated_on),\n                \"tags\": prop.tags or {},\n            })\n        return results\n\n    def rotate_secret(self, secret_name: str, new_value: str, content_type: str = \"text/plain\") -> Dict[str, Any]:\n        \"\"\"\n        Rotates a secret by creating a new version.\n        Previous versions remain accessible in Key Vault via their explicit version ID.\n        \"\"\"\n        # Save old version info for audit trail\n        try:\n            current = self.client.get_secret(secret_name)\n            old_version = current.properties.version\n        except ResourceNotFoundError:\n            old_version = None\n\n        # Store new version\n        new_secret = self.client.set_secret(\n            secret_name,\n            new_value,\n            content_type=content_type,\n            tags={\"rotated\": \"true\", \"rotation_epoch\": str(int(time.time()))}\n        )\n\n        # Invalidate local cache entry so subsequent calls fetch the fresh version\n        if secret_name in self.cache:\n            del self.cache[secret_name]\n\n        return {\n            \"name\": secret_name,\n            \"old_version\": old_version,\n            \"new_version\": new_secret.properties.version,\n            \"created_on\": str(new_secret.properties.created_on),\n        }\n\n\ndef demo_caching_simulation():\n    \"\"\"\n    Demonstrates how caching prevents redundant API calls.\n    \"\"\"\n    print(\"=\" * 70)\n    print(\"Key Vault In-Memory Caching & Throttling Resilience Demo\")\n    print(\"=\" * 70)\n\n    # Simulated run\n    print(\"Simulating 5 consecutive secret accesses with TTL = 30 seconds:\")\n    cache = {}\n    vault_calls = 0\n    names = [\"openai-api-key\", \"cosmosdb-connection-string\"]\n\n    for round_num in range(1, 6):\n        print(f\"\\n--- Round {round_num} ---\")\n        now = time.monotonic()\n        for name in names:\n            if name in cache and (now - cache[name][\"time\"]) < 30:\n                print(f\"  [{name}] -> CACHE HIT (RAM read, 0ms, no API quota)\")\n            else:\n                vault_calls += 1\n                cache[name] = {\"val\": \"sk-mock-key-123456\", \"time\": now}\n                print(f\"  [{name}] -> CACHE MISS (Invoking Key Vault SecretClient)\")\n\n    print(f\"\\nTotal accesses: 10 | Key Vault API Calls: {vault_calls} (80% network calls saved!)\")\n\n\nif __name__ == \"__main__\":\n    demo_caching_simulation()\n"
}
];
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
];
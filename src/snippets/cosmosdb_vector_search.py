"""
Azure Cosmos DB for NoSQL Vector Search Client (Microsoft AI-200)
Configures DiskANN vector indexing, cosine similarity policies,
stores embedded documents, and executes VectorDistance similarity queries.
"""

import os
from datetime import datetime
from azure.cosmos import CosmosClient, PartitionKey, exceptions
from azure.identity import DefaultAzureCredential


# =============================================================================
# 1. KẾT NỐI VÀ KHỞI TẠO CONTAINER VỚI VECTOR POLICIES
# =============================================================================

def get_database():
    """Lấy tham chiếu Database Cosmos DB thông qua xác thực Microsoft Entra ID (DefaultAzureCredential)."""
    endpoint = os.environ.get("COSMOS_ENDPOINT")
    database_name = os.environ.get("COSMOS_DATABASE", "vectorstore")

    if not endpoint or not database_name:
        raise ValueError("COSMOS_ENDPOINT and COSMOS_DATABASE environment variables must be set")

    credential = DefaultAzureCredential()
    client = CosmosClient(endpoint, credential=credential)
    return client.get_database_client(database_name)


def create_vector_container():
    """
    Tạo Container với:
    - Partition Key: /documentId
    - Vector Embedding Policy: /embedding, float32, cosine, 256 chiều
    - Indexing Policy: DiskANN index cho /embedding và loại trừ /embedding/* khỏi B-tree mặc định
    """
    database = get_database()
    container_name = os.environ.get("COSMOS_CONTAINER", "vectors")

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
        "excludedPaths": [{"path": "/embedding/*"}],
        "vectorIndexes": [
            {
                "path": "/embedding",
                "type": "diskANN"
            }
        ]
    }

    container = database.create_container_if_not_exists(
        id=container_name,
        partition_key=PartitionKey(path="/documentId"),
        indexing_policy=indexing_policy,
        vector_embedding_policy=vector_embedding_policy
    )
    return container


# =============================================================================
# 2. LƯU TRỮ VÀ TRUY VẤN TƯƠNG ĐỒNG VECTOR
# =============================================================================

def get_container():
    """Lấy client container Cosmos DB."""
    database = get_database()
    container_name = os.environ.get("COSMOS_CONTAINER", "vectors")
    return database.get_container_client(container_name)


def store_vector_document(document_id: str, chunk_id: str, content: str, embedding: list, metadata: dict) -> dict:
    """
    Lưu trữ tài liệu và vector embedding vào Cosmos DB container.
    Trả về response và số Request Units (RU) đã tiêu tốn.
    """
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
    """
    Tìm kiếm văn bản tương đồng nhất với vector câu hỏi bằng hàm VectorDistance trong NoSQL SQL.
    Sắp xếp tăng dần theo khoảng cách Cosine (giá trị càng nhỏ càng tương đồng).
    """
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
    items = container.query_items(
        query=query,
        parameters=parameters,
        enable_cross_partition_query=True
    )
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
    """
    Tìm kiếm vector kết hợp bộ lọc metadata (ví dụ category = 'billing' hoặc 'technical').
    """
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

    items = container.query_items(
        query=query,
        parameters=parameters,
        enable_cross_partition_query=True
    )
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


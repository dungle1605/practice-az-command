"""
Azure Cosmos DB for NoSQL RAG Query Engine (Microsoft AI-200)
Implements:
1. Point Read (container.read_item): Fastest operation at exactly 1.0 RU
2. Single-Partition Query (scoped by documentId partition key): Low RU, low latency
3. Cross-Partition Metadata Search with ARRAY_CONTAINS()
4. Ad-hoc SQL Query execution with pagination (OFFSET/LIMIT) and RU tracking
"""

import os
from datetime import datetime
from azure.cosmos import CosmosClient, exceptions
from azure.identity import DefaultAzureCredential


def get_container():
    """Lấy client container Cosmos DB với xác thực Entra ID Passwordless."""
    endpoint = os.environ.get("COSMOS_ENDPOINT")
    database_name = os.environ.get("COSMOS_DATABASE", "ragstore")
    container_name = os.environ.get("COSMOS_CONTAINER", "chunks")

    if not endpoint or not database_name or not container_name:
        raise ValueError("COSMOS_ENDPOINT, COSMOS_DATABASE, and COSMOS_CONTAINER must be set")

    credential = DefaultAzureCredential()
    client = CosmosClient(endpoint, credential=credential)
    return client.get_database_client(database_name).get_container_client(container_name)


# =============================================================================
# 1. POINT READ (Thao tác nhanh nhất, tốn đúng 1.0 RU)
# =============================================================================
def get_chunk_by_id(document_id: str, chunk_id: str) -> dict | None:
    """
    Point Read: Truy xuất trực tiếp document bằng ID và Partition Key.
    Chi phí: Cố định 1.0 RU cho document <= 1KB.
    Độ trễ: < 5ms (không cần biên dịch câu lệnh SQL).
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


# =============================================================================
# 2. SINGLE-PARTITION QUERY (Truy vấn trong 1 partition duy nhất)
# =============================================================================
def get_chunks_by_document(document_id: str) -> list[dict]:
    """
    Lấy toàn bộ chunk của một tài liệu, sắp xếp theo thứ tự chunkIndex.
    Vì có cờ partition_key=document_id, Cosmos DB chỉ định tuyến query
    đến đúng 1 partition vật lý (Single-Partition Query), tốn rất ít RU (~2.5 - 3.5 RU).
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
        partition_key=document_id  # Tránh Fan-out sang các partition khác!
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


# =============================================================================
# 3. CROSS-PARTITION METADATA SEARCH (ARRAY_CONTAINS & Filtering)
# =============================================================================
def search_chunks_by_metadata(filters: dict) -> list[dict]:
    """
    Tìm kiếm chunks theo metadata (category hoặc tags) trên toàn bộ container.
    Sử dụng hàm ARRAY_CONTAINS để tìm tag bên trong mảng JSON.
    Vì không biết partition key trước, cần enable_cross_partition_query=True.
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


# =============================================================================
# 4. AD-HOC QUERY EXECUTOR VỚI PHÂN TRANG (OFFSET / LIMIT)
# =============================================================================
def execute_rag_query(sql_query: str, enable_cross_partition: bool = True) -> dict:
    """
    Thực thi câu truy vấn SQL tùy biến với phân trang và đo lường Request Charge (RU).
    Ví dụ: SELECT c.id, c.documentId, c.content FROM c OFFSET 0 LIMIT 10
    """
    query_upper = sql_query.strip().upper()
    if not query_upper.startswith("SELECT"):
        return {"success": False, "results": [], "count": 0, "error": "Chỉ hỗ trợ câu lệnh SELECT"}

    try:
        container = get_container()
        items = container.query_items(
            query=sql_query,
            enable_cross_partition_query=enable_cross_partition
        )
        results = list(items)
        ru_charge = float(container.client_connection.last_response_headers.get("x-ms-request-charge", 0.0))
        return {
            "success": True,
            "results": results,
            "count": len(results),
            "ru_charge": ru_charge,
            "error": None
        }
    except Exception as e:
        return {"success": False, "results": [], "count": 0, "ru_charge": 0.0, "error": str(e)}


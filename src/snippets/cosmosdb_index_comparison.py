"""
Azure Cosmos DB for NoSQL Vector Index Optimization & Benchmark (Microsoft AI-200)
Compares the 3 Vector Indexing Strategies:
1. 'flat': Exact Nearest Neighbor (k-NN), compares against all vectors (100% recall, high RU on large datasets)
2. 'quantizedFlat': Quantized compression, reduced memory footprint for medium datasets (10K - 100K vectors)
3. 'diskANN': Graph-based Approximate Nearest Neighbor (ANN) by Microsoft Research, optimal for production (>100K vectors)
"""

import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from azure.cosmos import CosmosClient, PartitionKey
from azure.identity import DefaultAzureCredential


CONTAINER_FLAT = "vectors-flat"
CONTAINER_QUANTIZED = "vectors-quantized"
CONTAINER_DISKANN = "vectors-diskann"


def get_database():
    """Lấy Database client thông qua Entra ID DefaultAzureCredential."""
    endpoint = os.environ.get("COSMOS_ENDPOINT")
    database_name = os.environ.get("COSMOS_DATABASE", "indexoptimize")

    if not endpoint or not database_name:
        raise ValueError("COSMOS_ENDPOINT and COSMOS_DATABASE environment variables must be set")

    credential = DefaultAzureCredential()
    client = CosmosClient(endpoint, credential=credential)
    return client.get_database_client(database_name)


# =============================================================================
# 1. KHỞI TẠO 3 CONTAINERS VỚI 3 CHIẾN LƯỢC VECTOR INDEX KHÁC NHAU
# =============================================================================

def create_vector_container_by_type(container_name: str, index_type: str):
    """
    Tạo container với loại vector index chỉ định:
    - index_type = 'flat'
    - index_type = 'quantizedFlat'
    - index_type = 'diskANN'
    """
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
        "excludedPaths": [{"path": "/embedding/*"}],  # Loại trừ mảng vector khỏi B-Tree mặc định
        "vectorIndexes": [
            {
                "path": "/embedding",
                "type": index_type
            }
        ]
    }

    container = database.create_container_if_not_exists(
        id=container_name,
        partition_key=PartitionKey(path="/documentId"),
        indexing_policy=indexing_policy,
        vector_embedding_policy=vector_embedding_policy
    )
    print(f"✓ Created container '{container_name}' with vector index type '{index_type}'")
    return container


def setup_all_benchmark_containers():
    """Khởi tạo đồng thời cả 3 containers phục vụ đo lường và đánh giá hiệu năng."""
    create_vector_container_by_type(CONTAINER_FLAT, "flat")
    create_vector_container_by_type(CONTAINER_QUANTIZED, "quantizedFlat")
    create_vector_container_by_type(CONTAINER_DISKANN, "diskANN")


# =============================================================================
# 2. SO SÁNH HIỆU NĂNG TRUY VẤN VÀ TIÊU THỤ RU GIỮA 3 LOẠI CHỈ MỤC
# =============================================================================

def benchmark_search_query(container_name: str, query_embedding: list, top_n: int = 5) -> dict:
    """
    Thực thi tìm kiếm VectorDistance trên 1 container cụ thể và đo lường
    thời gian thực thi (ms) và số lượng Request Units (RU).
    """
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
        "results_count": len(items),
        "execution_time_ms": round(execution_time_ms, 2),
        "ru_charge": ru_charge
    }


def compare_all_indexes(query_embedding: list, top_n: int = 5) -> dict:
    """
    Chạy cùng một vector câu hỏi trên cả 3 containers để so sánh:
    flat vs quantizedFlat vs diskANN.
    """
    results = {}
    for name in [CONTAINER_FLAT, CONTAINER_QUANTIZED, CONTAINER_DISKANN]:
        results[name] = benchmark_search_query(name, query_embedding, top_n)
    return results


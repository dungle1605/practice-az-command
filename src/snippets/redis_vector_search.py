"""
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


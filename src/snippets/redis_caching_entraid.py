"""
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


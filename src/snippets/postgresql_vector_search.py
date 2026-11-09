"""
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


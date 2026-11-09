"""
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
            # Đảo ngược danh sách để trả về đúng thứ tự thời gian tăng dần
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


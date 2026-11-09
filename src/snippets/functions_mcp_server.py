"""
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

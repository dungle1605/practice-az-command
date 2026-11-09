"""
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

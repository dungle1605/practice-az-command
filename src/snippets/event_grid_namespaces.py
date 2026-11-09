"""
Azure Event Grid Namespaces - CloudEvents v1.0 & Pull Delivery Pipeline
Microsoft AI-200 Certification Lab Reference
Event Grid Namespaces | CloudEvents Schema | Consumer Pull Delivery (Ack / Release / Reject)
"""

import json
import os
import sys
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List

try:
    from azure.eventgrid import EventGridPublisherClient, EventGridConsumerClient
    from azure.core.messaging import CloudEvent
    from azure.identity import DefaultAzureCredential
except ImportError:
    print("Vui lòng cài đặt: pip install azure-eventgrid azure-core azure-identity")

EVENTGRID_ENDPOINT = os.getenv("EVENTGRID_ENDPOINT", "https://myeg.eastus-1.eventgrid.azure.net")
TOPIC_NAME = os.getenv("EVENTGRID_TOPIC_NAME", "moderation-events")
SUB_FLAGGED = "sub-flagged"
SUB_APPROVED = "sub-approved"
SUB_ALL = "sub-all-events"


def get_publisher_client() -> EventGridPublisherClient:
    credential = DefaultAzureCredential()
    return EventGridPublisherClient(
        endpoint=EVENTGRID_ENDPOINT,
        credential=credential,
        namespace_topic=TOPIC_NAME
    )


def get_consumer_client(subscription_name: str) -> EventGridConsumerClient:
    credential = DefaultAzureCredential()
    return EventGridConsumerClient(
        endpoint=EVENTGRID_ENDPOINT,
        credential=credential,
        namespace_topic=TOPIC_NAME,
        subscription=subscription_name
    )


# ===== 1. PUBLISH CLOUDEVENTS V1.0 TO NAMESPACE TOPIC =====
def publish_content_moderation_events() -> List[Dict[str, Any]]:
    """
    Phát tán các sự kiện phân tích nội dung AI theo định dạng chuẩn CloudEvents v1.0.
    """
    publisher = get_publisher_client()
    
    sample_events_data = [
        {
            "type": "com.contoso.ai.ContentFlagged",
            "source": "/services/content-moderation",
            "subject": "/content/text/review-101",
            "data": {
                "contentId": "review-101",
                "category": "hate_speech",
                "severity": "high",
                "confidence": 0.96,
                "reviewRequired": True
            }
        },
        {
            "type": "com.contoso.ai.ContentApproved",
            "source": "/services/content-moderation",
            "subject": "/content/text/review-102",
            "data": {
                "contentId": "review-102",
                "category": "general",
                "severity": "none",
                "confidence": 0.99,
                "reviewRequired": False
            }
        }
    ]

    cloud_events = []
    for item in sample_events_data:
        # Gán nhãn thời gian UTC và id ngẫu nhiên cho mỗi sự kiện
        item["data"]["timestamp"] = datetime.now(timezone.utc).isoformat()
        cloud_events.append(
            CloudEvent(
                type=item["type"],
                source=item["source"],
                subject=item["subject"],
                data=item["data"],
                id=str(uuid.uuid4())
            )
        )

    # Gửi theo lô tới Namespace Topic
    publisher.send(cloud_events)
    print(f"✓ Đã publish {len(cloud_events)} CloudEvents vào Topic '{TOPIC_NAME}'.")
    return [{"id": e.id, "type": e.type, "subject": e.subject} for e in cloud_events]


# ===== 2. CONSUMER PULL DELIVERY & ACKNOWLEDGE =====
def receive_and_acknowledge_events(subscription_name: str = SUB_FLAGGED, max_events: int = 5) -> List[Dict[str, Any]]:
    """
    Kéo sự kiện từ hàng đợi subscription (Pull Delivery) và gọi acknowledge để xóa tin khi xử lý xong.
    """
    consumer = get_consumer_client(subscription_name)
    print(f"-> Đang kéo sự kiện từ subscription '{subscription_name}'...")
    
    # receive() trả về danh sách ReceiveDetails kèm lock_token
    details = consumer.receive(max_events=max_events, max_wait_time=5)
    processed = []
    lock_tokens = []

    for detail in details:
        event = detail.event
        lock_token = detail.broker_properties.lock_token
        delivery_count = detail.broker_properties.delivery_count

        print(f"  [Event {event.id}] Type: {event.type} | Delivery Count: {delivery_count}")
        print(f"  Data: {event.data}")
        
        lock_tokens.append(lock_token)
        processed.append({
            "id": event.id,
            "type": event.type,
            "data": event.data,
            "delivery_count": delivery_count
        })

    # Acknowledge xóa vĩnh viễn các sự kiện đã xử lý
    if lock_tokens:
        consumer.acknowledge(lock_tokens=lock_tokens)
        print(f"✓ Đã acknowledge {len(lock_tokens)} sự kiện trên '{subscription_name}'.")

    return processed


# ===== 3. REJECT POISON / MALFORMED EVENTS =====
def receive_and_reject_event(subscription_name: str = SUB_FLAGGED) -> None:
    """
    Từ chối sự kiện (Reject) chuyển ngay vào Dead-Letter khi phát hiện payload độc hại.
    """
    consumer = get_consumer_client(subscription_name)
    details = consumer.receive(max_events=1, max_wait_time=5)
    
    if details:
        detail = details[0]
        token = detail.broker_properties.lock_token
        print(f"-> Phát hiện sự kiện lỗi {detail.event.id}. Thực hiện REJECT...")
        
        # reject() đẩy sự kiện sang dead-letter container
        consumer.reject(lock_tokens=[token])
        print("✓ Sự kiện đã được chuyển an toàn vào Dead-Letter.")


if __name__ == "__main__":
    print("=== DEMO AZURE EVENT GRID NAMESPACES & PULL DELIVERY ===")
    try:
        publish_content_moderation_events()
        receive_and_acknowledge_events(SUB_FLAGGED)
    except Exception as e:
        print(f"Thông báo: Cần kết nối Azure Event Grid thật để chạy live ({e}).")

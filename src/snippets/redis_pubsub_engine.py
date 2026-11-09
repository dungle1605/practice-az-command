"""
Azure Managed Redis (AMR) - Real-Time Pub/Sub Event Streaming
Microsoft AI-200 Certification Lab Reference
Real-time Message Bus | Multi-channel Wildcard Subscriptions
"""

import json
import os
import sys
import threading
import time
from typing import Callable, Optional

try:
    import redis
    from redis_entraid.cred_provider import create_from_default_azure_credential
except ImportError:
    print("Vui lòng cài đặt: pip install redis redis-entraid")

REDIS_HOST = os.getenv("REDIS_HOST", "myredis.eastus.redisenterprise.cache.azure.net")
REDIS_PORT = int(os.getenv("REDIS_PORT", "10000"))


class RedisEventBus:
    """
    Hệ thống phát và nhận sự kiện thời gian thực dựa trên Redis Pub/Sub.
    Hỗ trợ luồng Worker nền để lắng nghe liên tục không gây nghẽn ứng dụng chính.
    """

    def __init__(self, host: str = REDIS_HOST, port: int = REDIS_PORT):
        self.host = host
        self.port = port
        self.client = self._connect()
        self.pubsub: Optional[redis.client.PubSub] = None
        self.listener_thread: Optional[threading.Thread] = None
        self.stop_signal = threading.Event()

    def _connect(self) -> redis.Redis:
        try:
            cred_provider = create_from_default_azure_credential()
            return redis.Redis(
                host=self.host,
                port=self.port,
                ssl=True,
                credential_provider=cred_provider,
                decode_responses=True
            )
        except Exception:
            return redis.Redis(
                host=self.host,
                port=self.port,
                password=os.getenv("REDIS_PASSWORD"),
                ssl=True,
                decode_responses=True
            )

    # ===== 1. PUBLISH (PHÁT SỰ KIỆN) =====
    def publish_event(self, channel: str, payload: dict) -> int:
        """
        Phát tán đối tượng JSON tới tất cả các subscriber đang trực tuyến trên channel.
        Mô hình At-most-once (Fire-and-Forget).
        """
        message_json = json.dumps(payload)
        sub_count = self.client.publish(channel, message_json)
        print(f"[PUBLISH -> {channel}] {payload} (Đã gửi tới {sub_count} subscribers)")
        return sub_count

    # ===== 2. SUBSCRIBE & WORKER THREAD =====
    def start_pattern_listener(self, pattern: str, callback: Callable[[str, dict], None]) -> None:
        """
        Đăng ký lắng nghe theo mẫu wildcard (ví dụ: 'orders:*') trên một Worker Thread riêng biệt.
        """
        self.pubsub = self.client.pubsub()
        self.pubsub.psubscribe(pattern)
        self.stop_signal.clear()

        def _worker_loop():
            print(f"[SUBSCRIBER] Bắt đầu lắng nghe pattern: '{pattern}' trên background thread...")
            while not self.stop_signal.is_set():
                try:
                    # Timeout 1s để cho phép kiểm tra cờ stop_signal
                    message = self.pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                    if message and message["type"] == "pmessage":
                        channel = message["channel"]
                        try:
                            data = json.loads(message["data"])
                        except json.JSONDecodeError:
                            data = {"raw": message["data"]}
                        callback(channel, data)
                except Exception as ex:
                    if not self.stop_signal.is_set():
                        print(f"[ERROR in listener] {ex}")
                    break
            print("[SUBSCRIBER] Worker thread đã dừng an toàn.")

        self.listener_thread = threading.Thread(target=_worker_loop, daemon=True)
        self.listener_thread.start()

    def stop_listener(self) -> None:
        """
        Hủy đăng ký và dừng luồng lắng nghe an toàn.
        """
        self.stop_signal.set()
        if self.pubsub:
            self.pubsub.punsubscribe()
            self.pubsub.close()
        if self.listener_thread:
            self.listener_thread.join(timeout=2.0)
        print("[SUBSCRIBER] Đã đóng kênh Pub/Sub.")


# ===== 3. DEMO SIMULATION =====
def order_event_handler(channel: str, event: dict):
    print(f"  🔔 [XỬ LÝ ĐƠN HÀNG từ {channel}]: ID={event.get('order_id')} | Tổng tiền=${event.get('amount')} | SP={event.get('item')}")


if __name__ == "__main__":
    print("=== DEMO REDIS PUB/SUB REAL-TIME EVENT BUS ===")
    bus = RedisEventBus()

    # Bắt đầu lắng nghe mọi kênh 'orders:*' (ví dụ: orders:us, orders:eu, orders:asia)
    bus.start_pattern_listener("orders:*", order_event_handler)
    time.sleep(0.5)

    # Phát các sự kiện vào nhiều kênh khu vực khác nhau
    bus.publish_event("orders:us", {"order_id": 101, "item": "Azure Kinect DK", "amount": 399.00})
    bus.publish_event("orders:eu", {"order_id": 102, "item": "Hololens 2", "amount": 3500.00})
    bus.publish_event("orders:asia", {"order_id": 103, "item": "Xbox Elite Controller", "amount": 179.99})

    # Chờ xử lý xong
    time.sleep(1.5)
    bus.stop_listener()
    print("Demo Pub/Sub hoàn tất.")


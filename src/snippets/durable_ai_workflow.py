"""
Azure Durable Functions - AI Document Processing & Human-in-the-Loop Workflow
Microsoft AI-200 Certification Lab Reference
Fan-Out/Fan-In | Exponential Backoff Retries | HITL External Event Timer Race | Saga Rollback
"""

import json
import logging
import os
from datetime import timedelta
from typing import Any, Dict

try:
    import azure.functions as func
    import azure.durable_functions as df
except ImportError:
    print("Vui lòng cài đặt: pip install azure-functions azure-durable-functions")

app = df.DFApp(http_auth_level=func.AuthLevel.FUNCTION)
logger = logging.getLogger(__name__)

APPROVAL_CONFIDENCE_THRESHOLD = 0.80
APPROVAL_TIMEOUT_SECONDS = 30


# ===== 1. HTTP CLIENT STARTER =====
@app.route(route="workflows", methods=["POST"])
@app.durable_client_input(client_name="client")
async def start_workflow(req: func.HttpRequest, client: df.DurableOrchestrationClient) -> func.HttpResponse:
    """Khởi chạy phiên điều phối tài liệu AI và trả về HTTP 202 kèm URLs theo dõi."""
    payload = req.get_json()
    instance_id = await client.start_new("document_workflow", client_input=payload)
    return client.create_check_status_response(req, instance_id)


# ===== 2. FAN-OUT / FAN-IN MASTER ORCHESTRATOR =====
@app.orchestration_trigger(context_name="context")
def document_workflow(context: df.DurableOrchestrationContext):
    """
    Fan-out: Lên lịch chạy đồng thời mọi tài liệu trong batch.
    Fan-in: Gom toàn bộ kết quả khi tất cả các tiến trình con hoàn tất.
    """
    workflow_input = context.get_input()
    tasks = []

    for doc in workflow_input.get("documents", []):
        child_instance_id = f"{context.instance_id}-{doc['document_id']}"
        tasks.append(
            context.call_sub_orchestrator("document_orchestrator", doc, child_instance_id)
        )

    # Fan-in: Chờ toàn bộ kết quả song song
    results = yield context.task_all(tasks)
    return {
        "batch_id": workflow_input.get("batch_id"),
        "total_documents": len(results),
        "results": results
    }


# ===== 3. CHILD DOCUMENT ORCHESTRATOR (RETRIES & HITL GATING) =====
@app.orchestration_trigger(context_name="context")
def document_orchestrator(context: df.DurableOrchestrationContext):
    document = context.get_input()
    
    # BẮT BUỘC: Sử dụng context.new_uuid() để đảm bảo tính tất định (Determinism) khi replay
    operation_id = str(context.new_uuid())
    process_request = {**document, "operation_id": operation_id}

    # Chính sách thử lại: cách nhau 2 giây, thử tối đa 3 lần
    retry_options = df.RetryOptions(first_retry_interval_in_milliseconds=2000, max_number_of_attempts=3)

    try:
        # Chuỗi hoạt động có cơ chế tự phục hồi (Automatic Retry Chain)
        extracted = yield context.call_activity_with_retry("extract_text", retry_options, process_request)
        classified = yield context.call_activity_with_retry("classify_document", retry_options, extracted)
        summarized = yield context.call_activity_with_retry("generate_summary", retry_options, classified)
    except Exception as ex:
        # Nếu thử 3 lần vẫn lỗi -> Thực hiện hành động đền bù (Saga compensation)
        yield context.call_activity("compensate_document", {"operation_id": operation_id, "reason": "ProcessingFailed"})
        raise ex

    # GATING: KIỂM TRA ĐIỂM TIN CẬY (HUMAN-IN-THE-LOOP APPROVAL)
    if summarized.get("confidence", 1.0) >= APPROVAL_CONFIDENCE_THRESHOLD:
        final_status = "AutoApproved"
    else:
        # Báo cho người quản trị
        yield context.call_activity("notify_approver", {"instance_id": context.instance_id, **summarized})

        # Đua giữa Sự kiện Người duyệt gửi đến và Đồng hồ đếm ngược 30 giây
        approval_event = context.wait_for_external_event("ApprovalResponse")
        deadline = context.current_utc_datetime + timedelta(seconds=APPROVAL_TIMEOUT_SECONDS)
        timeout_timer = context.create_timer(deadline)

        # Ngủ đông CPU, thức dậy khi 1 trong 2 sự kiện xảy ra
        winner = yield context.task_any([approval_event, timeout_timer])

        if winner == approval_event:
            timeout_timer.cancel()
            decision_payload = approval_event.result
            if isinstance(decision_payload, str):
                decision_payload = json.loads(decision_payload)
            final_status = decision_payload.get("decision", "Rejected")
        else:
            final_status = "ApprovalTimedOut"

        if final_status != "Approved":
            yield context.call_activity("compensate_document", {"operation_id": operation_id, "reason": final_status})

    # Lưu trữ kết quả đơn định (Idempotent persistence)
    return (yield context.call_activity("persist_result", {**summarized, "status": final_status}))


# ===== 4. ACTIVITY FUNCTIONS =====
@app.activity_trigger(input_name="document")
def extract_text(document: dict) -> dict:
    return {**document, "extracted_text": f"Nội dung từ {document.get('document_id')}"}


@app.activity_trigger(input_name="document")
def classify_document(document: dict) -> dict:
    return {**document, "category": "Contract", "confidence": document.get("confidence", 0.75)}


@app.activity_trigger(input_name="document")
def generate_summary(document: dict) -> dict:
    return {**document, "summary": "Bản hợp đồng nguyên tắc có giá trị pháp lý"}


@app.activity_trigger(input_name="request")
def notify_approver(request: dict) -> dict:
    logger.info(f"Báo động: Cần duyệt thủ công cho tài liệu {request.get('document_id')}")
    return {"status": "Notified"}


@app.activity_trigger(input_name="request")
def compensate_document(request: dict) -> dict:
    logger.warning(f"Saga: Hoàn tác tác vụ {request.get('operation_id')} do {request.get('reason')}")
    return {"status": "Compensated", **request}


@app.activity_trigger(input_name="request")
def persist_result(request: dict) -> dict:
    logger.info(f"Lưu kết quả thành công cho {request.get('document_id')} (Trạng thái: {request.get('status')})")
    return {"status": "Saved", **request}


# ===== 5. WEBHOOK GỬI QUYẾT ĐỊNH DUYỆT (EXTERNAL EVENT) =====
@app.route(route="approvals/{instance_id}", methods=["POST"])
@app.durable_client_input(client_name="client")
async def submit_approval(req: func.HttpRequest, client: df.DurableOrchestrationClient) -> func.HttpResponse:
    payload = req.get_json()
    instance_id = req.route_params["instance_id"]
    # Bắn sự kiện "ApprovalResponse" vào đúng phiên làm việc đang chờ
    await client.raise_event(instance_id, "ApprovalResponse", payload)
    return func.HttpResponse(json.dumps({"status": "Accepted"}), status_code=202, mimetype="application/json")


if __name__ == "__main__":
    print("=== DEMO AZURE DURABLE FUNCTIONS AI ORCHESTRATION ===")
    print("Mô hình hỗ trợ: Fan-out/in, Activity retries, HITL approval, Saga rollback.")

/**
 * Azure Integration & Backend Services Dataset for Microsoft AI-200
 * Sourced directly from Lesson 7 Microsoft AI-200 Repos:
 * - azure-functions-mcp-server (Model Context Protocol Server on Azure Functions Python v2)
 * - durable-functions-python (AI Workflow Orchestration: Fan-out/in, HITL Approval, Activity Retries, Idempotency)
 * - event-grid-python (Event Grid Namespaces, CloudEvents v1.0, Pull Delivery Ack/Release/Reject)
 * - service-bus-python (Enterprise Queues, Peek-Lock, Dead-Lettering, Topics, Subscriptions & SQL Filters)
 */

export const INTEGRATION_CATEGORIES = [
  { id: "all", name: "🌟 Tất cả dịch vụ", icon: "📚" },
  { id: "servicebus", name: "📬 Azure Service Bus (Queues & Topics)", icon: "🚌" },
  { id: "eventgrid", name: "⚡ Event Grid (CloudEvents & Pull Delivery)", icon: "🌐" },
  { id: "durable", name: "🔄 Durable Functions (AI Workflows & HITL)", icon: "⏳" },
  { id: "mcp", name: "🤖 MCP Server (Model Context Protocol)", icon: "🛠️" }
];

export const INTEGRATION_OPERATIONS = [
  // ==========================================
  // 1. AZURE SERVICE BUS
  // ==========================================
  {
    id: "sb-send-queue",
    category: "servicebus",
    title: "1. Gửi Tin Nhắn Yêu Cầu Suy Luận Vào Service Bus Queue",
    summary: "Đính kèm metadata nhận dạng (message_id), liên kết luồng hội thoại (correlation_id) và thuộc tính định tuyến (application_properties).",
    cliCommand: `az servicebus queue send --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --name inference-requests --message-body '{"prompt":"Extract entities","model":"gpt-4o"}'`,
    pythonEquivalent: `from azure.servicebus import ServiceBusClient, ServiceBusMessage
from azure.identity import DefaultAzureCredential
import json, uuid

client = ServiceBusClient(
    fully_qualified_namespace="mysb.servicebus.windows.net",
    credential=DefaultAzureCredential()
)

with client.get_queue_sender("inference-requests") as sender:
    msg = ServiceBusMessage(
        body=json.dumps({"prompt": "Extract contract parties", "model": "gpt-4o"}),
        content_type="application/json",
        message_id=str(uuid.uuid4()),        # Chống gửi trùng lặp (Deduplication)
        correlation_id="req-doc-001",       # Truy vết luồng AI Agent (Tracing)
        application_properties={"priority": "high", "document_type": "contract"}
    )
    sender.send_messages(msg)
    print("✓ Đã gửi tin nhắn suy luận vào Queue với Correlation ID:", msg.correlation_id)`,
    parameters: [
      { name: "message_id", desc: "Định danh duy nhất giúp Service Bus tự động loại bỏ tin nhắn trùng lặp nếu bật Duplicate Detection." },
      { name: "correlation_id", desc: "Mã định danh liên kết toàn bộ chuỗi request-reply giữa người dùng và các AI agent phân tán." },
      { name: "application_properties", desc: "Tập hợp key-value trong header dùng cho bộ lọc SQL Filter mà không cần mở body." }
    ],
    examTip: "⭐ AI-200: Dùng `correlation_id` để kết nối prompt ban đầu với phản hồi streaming hoàn tất của LLM.",
    simulatedOutput: `[ServiceBus] Message req-doc-001 queued successfully.`
  },
  {
    id: "sb-peek-lock",
    category: "servicebus",
    title: "2. Xử Lý Tin Nhắn An Toàn Bằng Chế Độ Peek-Lock",
    summary: "Nhận tin nhắn kèm khóa tạm thời. Chỉ khi worker AI hoàn thành suy luận mới xóa tin nhắn khỏi hàng đợi bằng complete_message.",
    cliCommand: `az servicebus queue receive --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --name inference-requests`,
    pythonEquivalent: `with client.get_queue_receiver(queue_name="inference-requests", max_wait_time=5) as receiver:
    for msg in receiver:
        try:
            payload = json.loads(str(msg))
            print(f"Đang suy luận model {payload['model']} cho prompt: {payload['prompt']}")
            # ... Gọi OpenAI / Azure AI Services ...
            receiver.complete_message(msg) # Xóa tin nhắn khỏi Queue khi thành công
            print("✓ Xử lý thành công và đã complete message.")
        except Exception as ex:
            print("Lỗi suy luận:", ex)
            receiver.abandon_message(msg)  # Mở khóa để worker khác nhận lại`,
    parameters: [
      { name: "Peek-Lock", desc: "Chế độ mặc định bảo vệ tin nhắn không bị mất khi worker gặp sự cố (At-least-once)." },
      { name: "complete_message()", desc: "Báo cho Service Bus biết công việc đã xong, xóa vĩnh viễn tin nhắn." },
      { name: "abandon_message()", desc: "Hủy bỏ khóa lock, lập tức đưa tin nhắn trở lại hàng đợi cho worker khác." }
    ],
    examTip: "⭐ AI-200: Khác với Receive-and-Delete (xóa ngay khi đọc), Peek-Lock là bắt buộc cho các tác vụ suy luận AI quan trọng.",
    simulatedOutput: `[Worker-1] Locked message req-doc-001 (Lock expires in 60s)
[Worker-1] Inference completed in 1.42s
[ServiceBus] Message req-doc-001 completed and removed from queue.`
  },
  {
    id: "sb-dead-letter",
    category: "servicebus",
    title: "3. Cô Lập Tin Nhắn Hỏng Vào Dead-Letter Queue (DLQ)",
    summary: "Khi gặp dữ liệu độc hại hoặc JSON lỗi cú pháp, chủ động đẩy tin nhắn vào DLQ kèm lý do và mô tả lỗi chẩn đoán.",
    cliCommand: `az servicebus queue show --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --name inference-requests --query countDetails.deadLetterMessageCount -o tsv`,
    pythonEquivalent: `with client.get_queue_receiver(queue_name="inference-requests", max_wait_time=5) as receiver:
    for msg in receiver:
        try:
            payload = json.loads(str(msg))
        except json.JSONDecodeError as err:
            # Chủ động đẩy tin nhắn hỏng vào Dead-Letter sub-queue
            receiver.dead_letter_message(
                msg,
                reason="MalformedPayload",
                error_description="Nội dung tin nhắn không phải JSON hợp lệ"
            )
            print(f"[POISON] Đã chuyển tin nhắn {msg.correlation_id} vào DLQ!")`,
    parameters: [
      { name: "dead_letter_message()", desc: "Chuyển tin nhắn vào hàng đợi phụ DLQ của chính queue đó." },
      { name: "reason & description", desc: "Lưu vết chẩn đoán phục vụ đội ngũ kỹ sư điều tra nguyên nhân." }
    ],
    examTip: "⭐ Dead-Letter Queue ngăn chặn poison message gây quá tải worker AI trong vòng lặp vô tận.",
    simulatedOutput: `[DLQ] Moved message req-doc-003 to dead-letter sub-queue. Reason: MalformedPayload`
  },
  {
    id: "sb-inspect-dlq",
    category: "servicebus",
    title: "4. Kiểm Tra & Khắc Phục Sự Cố Từ Dead-Letter Queue",
    summary: "Đọc các tin nhắn bị lỗi từ sub-queue `ServiceBusSubQueue.DEAD_LETTER` để chẩn đoán và dọn dẹp.",
    cliCommand: `az servicebus queue receive --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --name inference-requests --sub-queue dead-letter`,
    pythonEquivalent: `from azure.servicebus import ServiceBusSubQueue

with client.get_queue_receiver(
    queue_name="inference-requests",
    sub_queue=ServiceBusSubQueue.DEAD_LETTER,
    max_wait_time=5
) as dlq_receiver:
    for msg in dlq_receiver:
        print(f"DLQ Message ID: {msg.message_id}")
        print(f"  Lý do lỗi: {msg.dead_letter_reason}")
        print(f"  Mô tả: {msg.dead_letter_error_description}")
        print(f"  Số lần đã thử: {msg.delivery_count}")
        # Xóa khỏi DLQ sau khi đã lưu log cảnh báo
        dlq_receiver.complete_message(msg)`,
    parameters: [
      { name: "ServiceBusSubQueue.DEAD_LETTER", desc: "Định tuyến receiver trỏ thẳng vào hộp thư chết của Queue hoặc Topic Subscription." },
      { name: "delivery_count", desc: "Số lượt gửi không thành công của tin nhắn." }
    ],
    examTip: "⭐ Tin nhắn vào DLQ khi: (1) Gọi `dead_letter_message()` thủ công, (2) Vượt quá `max-delivery-count`, hoặc (3) Hết hạn TTL nếu bật DLQ on expiration.",
    simulatedOutput: `Found 1 DLQ message:
  ID: 4a2b-9c...
  Reason: MalformedPayload
  Description: Message body is not valid JSON
  Delivery Count: 1`
  },
  {
    id: "sb-topic-sql-filter",
    category: "servicebus",
    title: "5. Phát Tán Topic & Lọc Bằng Quy Tắc SQL (priority = 'high')",
    summary: "Phát thông điệp ra Topic và cho phép Subscription lọc nhận theo thuộc tính metadata mà không cần đọc nội dung body.",
    cliCommand: `az servicebus topic subscription rule create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --subscription-name high-priority --name high-priority-filter --filter-sql-expression "priority = 'high'"`,
    pythonEquivalent: `# 1. Gửi thông điệp vào Topic
with client.get_topic_sender("inference-results") as sender:
    msg = ServiceBusMessage(
        body=json.dumps({"document_id": "doc-002", "summary": "Contract agreed"}),
        application_properties={"priority": "high", "tier": "enterprise"}
    )
    sender.send_messages(msg)

# 2. Đọc từ subscription 'high-priority' (chỉ nhận tin priority='high')
with client.get_subscription_receiver(
    topic_name="inference-results",
    subscription_name="high-priority",
    max_wait_time=5
) as sub_receiver:
    for msg in sub_receiver:
        print("Nhận tin ưu tiên cao:", msg.application_properties)
        sub_receiver.complete_message(msg)`,
    parameters: [
      { name: "SQL Filter", desc: "Cú pháp tương tự SQL-92 đánh giá trực tiếp trên các thuộc tính do người dùng định nghĩa." },
      { name: "Xóa $Default", desc: "Bắt buộc xóa TrueFilter ban đầu để bộ lọc SQL có hiệu lực thực sự." }
    ],
    examTip: "⭐ AI-200: SQL Filter chạy cực nhanh trên Broker tầng Network, không tiêu tốn tài nguyên giải mã JSON body của ứng dụng.",
    simulatedOutput: `[Topic] Published message with properties: {'priority': 'high', 'tier': 'enterprise'}
[Subscription: high-priority] Matched SQL rule "priority = 'high'" -> Delivered!`
  },

  // ==========================================
  // 2. AZURE EVENT GRID
  // ==========================================
  {
    id: "eg-publish-cloudevent",
    category: "eventgrid",
    title: "6. Phát Sự Kiện Tiêu Chuẩn CloudEvents v1.0 Vào Event Grid",
    summary: "Tạo sự kiện theo đặc tả CNCF CloudEvents (id, source, type, data) phát tán vào Namespace Topic.",
    cliCommand: `az eventgrid namespace topic create --resource-group $env:RG --namespace-name $env:EG_NAMESPACE --name moderation-events --input-schema CloudEventSchemaV1_0`,
    pythonEquivalent: `from azure.eventgrid import EventGridPublisherClient
from azure.core.messaging import CloudEvent
from azure.identity import DefaultAzureCredential
import uuid
from datetime import datetime, timezone

client = EventGridPublisherClient(
    endpoint="https://myeg.eastus-1.eventgrid.azure.net",
    credential=DefaultAzureCredential(),
    namespace_topic="moderation-events"
)

event = CloudEvent(
    type="com.contoso.ai.ContentFlagged",
    source="/services/content-moderation",
    subject="/content/text/review-89",
    data={
        "contentId": "review-89",
        "category": "hate_speech",
        "confidence": 0.94,
        "reviewRequired": True
    },
    id=str(uuid.uuid4())
)
client.send([event])
print("✓ Đã publish CloudEvent kiểm duyệt nội dung vào Event Grid Namespace Topic!")`,
    parameters: [
      { name: "CloudEvents v1.0", desc: "Đặc tả sự kiện chuẩn của CNCF, tương thích đa nền tảng và đa ngôn ngữ." },
      { name: "namespace_topic", desc: "Kênh nhận sự kiện thuộc Event Grid Namespace thế hệ mới." }
    ],
    examTip: "⭐ Event Grid Namespace Topics chỉ hỗ trợ duy nhất một chuẩn đóng gói là `CloudEventSchemaV1_0`.",
    simulatedOutput: `[EventGrid] CloudEvent id=e1b8... type=com.contoso.ai.ContentFlagged accepted by broker.`
  },
  {
    id: "eg-pull-receive",
    category: "eventgrid",
    title: "7. Nhận Sự Kiện Bằng Cơ Chế Pull Delivery (Queue Mode)",
    summary: "Consumer chủ động gọi receive() để kéo các sự kiện phù hợp từ subscription mà không cần mở public inbound webhook.",
    cliCommand: `az eventgrid namespace topic event-subscription show --resource-group $env:RG --namespace-name $env:EG_NAMESPACE --topic-name moderation-events --name sub-flagged`,
    pythonEquivalent: `from azure.eventgrid import EventGridConsumerClient
from azure.identity import DefaultAzureCredential

consumer = EventGridConsumerClient(
    endpoint="https://myeg.eastus-1.eventgrid.azure.net",
    credential=DefaultAzureCredential(),
    namespace_topic="moderation-events",
    subscription="sub-flagged"
)

# Kéo tối đa 10 sự kiện, chờ tối đa 10 giây
details = consumer.receive(max_events=10, max_wait_time=10)
for detail in details:
    event = detail.event
    lock_token = detail.broker_properties.lock_token
    print(f"Nhận sự kiện: {event.type} cho contentId={event.data['contentId']}")`,
    parameters: [
      { name: "Pull Delivery", desc: "Ứng dụng tự kết nối ra ngoài để lấy tin, an toàn tuyệt đối sau tường lửa/VNet." },
      { name: "lock_token", desc: "Chuỗi token đại diện cho quyền sở hữu khóa xử lý sự kiện trong khoảng thời gian nhận." }
    ],
    examTip: "⭐ Pull Delivery trong Event Grid Namespace giúp các AI Agent trên máy local hoặc Kubernetes private có thể nhận sự kiện an toàn.",
    simulatedOutput: `[EventGrid Consumer] Received 1 event on sub-flagged:
  Type: com.contoso.ai.ContentFlagged
  ContentId: review-89
  Lock Token: e4a7...`
  },
  {
    id: "eg-pull-ack",
    category: "eventgrid",
    title: "8. Xác Nhận Xử Lý Thành Công (Acknowledge / Ack)",
    summary: "Báo cho Event Grid biết sự kiện đã được xử lý xong để giải phóng khỏi hàng đợi của Subscription.",
    cliCommand: `# Được thực thi qua SDK Consumer Client sau khi gọi receive()`,
    pythonEquivalent: `# Tiếp tục từ bước receive:
lock_tokens = [d.broker_properties.lock_token for d in details]
if lock_tokens:
    # Acknowledge xóa vĩnh viễn sự kiện khỏi subscription
    consumer.acknowledge(lock_tokens=lock_tokens)
    print(f"✓ Đã acknowledge {len(lock_tokens)} sự kiện thành công.")`,
    parameters: [
      { name: "acknowledge(lock_tokens)", desc: "Xóa sự kiện khỏi subscription, ngăn không cho gửi lại." }
    ],
    examTip: "Nếu không gọi `acknowledge` trước khi khóa lock hết hạn, sự kiện sẽ tự động xuất hiện lại cho consumer khác.",
    simulatedOutput: `[EventGrid] Acknowledged lock tokens. Event deleted from sub-flagged queue.`
  },
  {
    id: "eg-pull-reject",
    category: "eventgrid",
    title: "9. Từ Chối Xử Lý Sự Kiện Độc Hại (Reject / Dead-Letter)",
    summary: "Từ chối sự kiện không thể xử lý, Event Grid sẽ chuyển ngay vào dead-letter hoặc hủy bỏ mà không thử lại.",
    cliCommand: `# Được thực thi qua SDK Consumer Client khi phát hiện dữ liệu lỗi`,
    pythonEquivalent: `for detail in details:
    if detail.event.data.get("invalid_format"):
        # Reject thông báo sự kiện bị hỏng, đưa vào dead-letter
        consumer.reject(lock_tokens=[detail.broker_properties.lock_token])
        print(f"[REJECTED] Đã từ chối sự kiện {detail.event.id}")`,
    parameters: [
      { name: "reject vs release", desc: "Release = trả lại để thử lại sau; Reject = từ chối vĩnh viễn và đưa vào dead-letter." }
    ],
    examTip: "⭐ Phân biệt trong bài thi: `release()` dùng cho lỗi mạng tạm thời; `reject()` dùng cho nội dung dữ liệu hỏng vĩnh viễn.",
    simulatedOutput: `[EventGrid] Rejected event e1b8... Moved to Dead-Letter storage.`
  },

  // ==========================================
  // 3. AZURE DURABLE FUNCTIONS
  // ==========================================
  {
    id: "df-fan-out-fan-in",
    category: "durable",
    title: "10. Mô Hình Phân Tán Song Song (Fan-Out / Fan-In Orchestration)",
    summary: "Xử lý hàng loạt tài liệu AI đồng thời trên nhiều serverless workers và gom kết quả toàn bộ bằng context.task_all.",
    cliCommand: `func start`,
    pythonEquivalent: `import azure.durable_functions as df

@app.orchestration_trigger(context_name="context")
def document_workflow(context: df.DurableOrchestrationContext):
    workflow_input = context.get_input()
    tasks = []

    # 1. FAN-OUT: Lên lịch chạy đồng thời mọi sub-orchestrator con
    for doc in workflow_input["documents"]:
        child_id = f"{context.instance_id}-{doc['document_id']}"
        tasks.append(
            context.call_sub_orchestrator("document_orchestrator", doc, child_id)
        )

    # 2. FAN-IN: Chờ toàn bộ các tiến trình con hoàn tất và gom kết quả
    results = yield context.task_all(tasks)
    return {"batch_id": workflow_input["batch_id"], "documents": results}`,
    parameters: [
      { name: "call_sub_orchestrator", desc: "Tạo phiên điều phối con độc lập có instance ID riêng biệt." },
      { name: "context.task_all(tasks)", desc: "Tương đương Promise.all, chờ tất cả tasks kết thúc mới tiếp tục." }
    ],
    examTip: "⭐ Fan-Out / Fan-In là mô hình kinh điển để xử lý batch hàng trăm file PDF/văn bản bằng các worker AI serverless co giãn tự động.",
    simulatedOutput: `[Orchestrator] Fanning out 20 document tasks...
[Orchestrator] Fan-in completed. All 20 documents processed concurrently.`
  },
  {
    id: "df-activity-retry",
    category: "durable",
    title: "11. Tự Động Thử Lại Hoạt Động (Activity Retries & Backoff)",
    summary: "Cấu hình chính sách thử lại khi gọi mô hình AI gặp lỗi tạm thời (Rate Limit 429 hoặc Service Unavailable).",
    cliCommand: `func host start`,
    pythonEquivalent: `@app.orchestration_trigger(context_name="context")
def document_orchestrator(context: df.DurableOrchestrationContext):
    document = context.get_input()
    operation_id = str(context.new_uuid()) # Bắt buộc dùng context.new_uuid() để đảm bảo tính tất định!
    
    # Cấu hình retry: chờ 2 giây lần đầu, thử lại tối đa 3 lần
    retry_options = df.RetryOptions(first_retry_interval_in_milliseconds=2000, max_number_of_attempts=3)
    
    try:
        classified = yield context.call_activity_with_retry(
            "classify_document",
            retry_options,
            {**document, "operation_id": operation_id}
        )
        return classified
    except Exception:
        # Nếu thử 3 lần vẫn lỗi -> Thực hiện hành động đền bù (Saga compensation)
        yield context.call_activity("compensate_document", {"operation_id": operation_id})
        raise`,
    parameters: [
      { name: "context.new_uuid()", desc: "Hàm sinh UUID đơn định (deterministic) an toàn khi Orchestrator replay." },
      { name: "RetryOptions", desc: "Chính sách thử lại tự động theo cấp số nhân." }
    ],
    examTip: "⭐ Tuyệt đối KHÔNG dùng `uuid.uuid4()` hoặc `datetime.now()` trực tiếp trong hàm Orchestrator; phải dùng hàm từ `context`.",
    simulatedOutput: `[Activity: classify_document] Attempt 1 failed (RateLimit). Retrying in 2000ms...
[Activity: classify_document] Attempt 2 succeeded!`
  },
  {
    id: "df-human-in-loop",
    category: "durable",
    title: "12. Phê Duyệt Con Người Can Thiệp (Human-in-the-Loop Pattern)",
    summary: "Nếu độ tin cậy của AI < 80%, tạm dừng workflow chờ con người bấm Duyệt qua webhook, tự động timeout sau 30 giây.",
    cliCommand: `Invoke-RestMethod -Uri "http://localhost:7071/api/approvals/{instanceId}" -Method Post -Body '{"decision":"Approved","event_id":"evt-1"}'`,
    pythonEquivalent: `APPROVAL_THRESHOLD = 0.80

if summarized["confidence"] >= APPROVAL_THRESHOLD:
    final_status = "AutoApproved"
else:
    # 1. Báo cho người quản trị
    yield context.call_activity("notify_approver", {"instance_id": context.instance_id})
    
    # 2. Đua giữa sự kiện người duyệt gửi đến và đồng hồ hẹn giờ 30s
    approval_event = context.wait_for_external_event("ApprovalResponse")
    deadline = context.current_utc_datetime + timedelta(seconds=30)
    timeout_timer = context.create_timer(deadline)
    
    # task_any không làm nghẽn CPU, orchestrator ngủ đông cho đến khi có sự kiện
    winner = yield context.task_any([approval_event, timeout_timer])
    
    if winner == approval_event:
        timeout_timer.cancel()
        final_status = approval_event.result["decision"] # "Approved" hoặc "Rejected"
    else:
        final_status = "ApprovalTimedOut"`,
    parameters: [
      { name: "wait_for_external_event", desc: "Đăng ký lắng nghe sự kiện ngoài được bắn vào theo instance ID." },
      { name: "create_timer", desc: "Tạo đồng hồ đếm ngược bền vững (durable timer) trong kho lưu trữ." },
      { name: "task_any([event, timer])", desc: "Chạy đua: sự kiện nào đến trước thì xử lý trước." }
    ],
    examTip: "⭐ Human-in-the-Loop trong AI: AI xử lý tự động các trường hợp tin cậy cao, đẩy trường hợp nghi vấn cho con người thẩm định.",
    simulatedOutput: `[HITL] Document doc-002 confidence=0.72 < 0.80 -> Pausing workflow for Human Approval...
[HITL] External event "ApprovalResponse" received: Decision = Approved. Resuming workflow!`
  },

  // ==========================================
  // 4. MODEL CONTEXT PROTOCOL (MCP)
  // ==========================================
  {
    id: "mcp-tool-trigger",
    category: "mcp",
    title: "13. Khởi Tạo MCP Server Bằng Azure Functions Python v2",
    summary: "Khai báo trigger `mcpToolTrigger` công khai các công cụ suy luận văn bản cho các AI Client (Copilot, Cursor, Antigravity) qua SSE.",
    cliCommand: `func start`,
    pythonEquivalent: `import azure.functions as func
import json

app = func.FunctionApp()

# Khai báo công cụ tóm tắt văn bản chuẩn Model Context Protocol (MCP)
@app.generic_trigger(
    arg_name="context",
    type="mcpToolTrigger",
    toolName="summarize_text",
    description="Tóm tắt một đoạn văn bản dài thành các ý chính cốt lõi",
    toolProperties='[{"propertyName": "text", "propertyType": "string", "description": "Văn bản cần tóm tắt"}]'
)
def summarize_text(context: str) -> str:
    request = json.loads(context)
    arguments = request.get("arguments", {})
    text = arguments.get("text", "")
    
    # Thực hiện suy luận AI hoặc logic backend
    summary = f"Tóm tắt ({len(text.split())} từ): {text[:80]}..."
    
    # Trả về đối tượng JSON có trường 'content' cho MCP client
    return json.dumps({"content": summary})`,
    parameters: [
      { name: "type=mcpToolTrigger", desc: "Trigger phơi bày hàm Python thành công cụ gọi được trong giao thức MCP." },
      { name: "toolProperties", desc: "Định nghĩa JSON Schema các tham số đầu vào để LLM sinh đối số chính xác." },
      { name: "ExtensionBundle.Preview", desc: "Gói mở rộng trong host.json kích hoạt giao thức MCP trên Azure Functions." }
    ],
    examTip: "⭐ MCP Server trên Azure Functions phục vụ giao thức SSE tại đường dẫn `/runtime/webhooks/mcp/sse`.",
    simulatedOutput: `Functions:
    summarize_text: mcpToolTrigger
    classify_document: mcpToolTrigger
[MCP Host] Serving SSE transport at http://localhost:7071/runtime/webhooks/mcp/sse`
  },
  {
    id: "mcp-vscode-config",
    category: "mcp",
    title: "14. Cấu Hình Kết Nối MCP Client (.vscode/mcp.json)",
    summary: "Đăng ký MCP Server cục bộ hoặc cloud vào VS Code và GitHub Copilot Agent Mode.",
    cliCommand: `cat .vscode/mcp.json`,
    pythonEquivalent: `{
  "servers": {
    "document-tools-local": {
      "type": "sse",
      "url": "http://localhost:7071/runtime/webhooks/mcp/sse"
    },
    "document-tools-azure": {
      "type": "sse",
      "url": "https://func-ai-tools.azurewebsites.net/runtime/webhooks/mcp/sse"
    }
  }
}`,
    parameters: [
      { name: "type: sse", desc: "Server-Sent Events: Giao thức truyền tải HTTP streaming chuẩn của MCP qua mạng." },
      { name: "url", desc: "Địa chỉ webhook SSE của Azure Functions MCP extension." }
    ],
    examTip: "Các AI Agent (Copilot, Claude Desktop) đọc tệp mcp.json này để tự động nạp danh sách Tools và tham số.",
    simulatedOutput: `[VS Code / Copilot] Connected to MCP Server "document-tools-local". Discovered 2 tools: [summarize_text, classify_document]`
  },
  {
    id: "df-idempotency",
    category: "durable",
    title: "15. Lưu Trữ Kết Quả Đơn Định Bất Biến (Idempotent Persistence)",
    summary: "Sử dụng `operation_id` làm khóa bất biến trong Blob Storage, ngăn chặn việc ghi đè lặp lại khi replay workflow.",
    cliCommand: `az storage blob upload --account-name $env:STORAGE_ACCOUNT --container-name workflow-results --file result.json --name $OPERATION_ID.json --overwrite false`,
    pythonEquivalent: `@app.activity_trigger(input_name="request")
def persist_result(request):
    container = get_container("workflow-results")
    # Operation ID là idempotency key bất biến
    blob = container.get_blob_client(f"{request['operation_id']}.json")
    
    try:
        # overwrite=False đảm bảo nếu đã ghi rồi thì không ghi đè
        blob.upload_blob(json.dumps(request), overwrite=False)
        write_status = "Created"
    except ResourceExistsError:
        # Nếu replay chạy lại, trả về kết quả đã lưu trước đó
        write_status = "AlreadyExists"
        
    return {**request, "result_url": blob.url, "write_status": write_status}`,
    parameters: [
      { name: "overwrite=False", desc: "Kích hoạt kiểm tra khóa trùng lặp ở tầng Azure Blob Storage." },
      { name: "ResourceExistsError", desc: "Bắt lỗi khi tài nguyên đã tồn tại, đảm bảo an toàn đơn định (Idempotence)." }
    ],
    examTip: "Idempotency là yêu cầu sống còn trong kiến trúc Event-Driven AI để tránh trừ tiền tài khoản hoặc tạo bản ghi trùng khi có retry.",
    simulatedOutput: `[Storage] Uploaded 4b3d-8e...json (write_status: Created)`
  }
];

export const SERVICE_BUS_VS_EVENT_GRID_VS_REDIS = [
  {
    feature: "Kiểu Kiến Trúc Cốt Lõi",
    serviceBus: "Hàng đợi tin nhắn doanh nghiệp (Enterprise Message Broker)",
    eventGrid: "Định tuyến sự kiện phản ứng (Reactive Event Distribution)",
    redisPubSub: "Phát tán thời gian thực trong RAM (In-Memory Ephemeral Bus)"
  },
  {
    feature: "Bảo Đảm Chuyển Giao (Delivery)",
    serviceBus: "At-least-once, hỗ trợ giao dịch ACID và FIFO Sessions",
    eventGrid: "At-least-once (Retry tự động tối đa 24 giờ với exponential backoff)",
    redisPubSub: "At-most-once (Fire-and-forget; subscriber vắng mặt sẽ mất tin)"
  },
  {
    feature: "Mô Hình Tiếp Nhận (Consumption)",
    serviceBus: "Pull (Peek-Lock hoặc Receive-and-Delete)",
    eventGrid: "Cả Push (Webhook HTTP) và Pull (Queue Delivery Mode)",
    redisPubSub: "Push (Lắng nghe liên tục qua subscribe/psubscribe)"
  },
  {
    feature: "Bộ Lọc Định Tuyến (Filtering)",
    serviceBus: "SQL Filter (SQL-92) & Correlation Filter trên metadata header",
    eventGrid: "Lọc nâng cao theo Event Type, Subject prefix/suffix và JSON Data attributes",
    redisPubSub: "Chỉ lọc theo tên kênh dạng Wildcard Glob (ví dụ: orders:*)"
  },
  {
    feature: "Xử Lý Tin Nhắn Hỏng (Dead-Lettering)",
    serviceBus: "Tích hợp sẵn Dead-Letter sub-queue trực tiếp trên từng Queue/Topic",
    eventGrid: "Đẩy sự kiện không thể giao tới Azure Storage Blob container",
    redisPubSub: "Không hỗ trợ (Không lưu vết tin nhắn lỗi)"
  },
  {
    feature: "Độ Trễ Xử Lý (Latency)",
    serviceBus: "~5 - 15 mili-giây",
    eventGrid: "~10 - 25 mili-giây",
    redisPubSub: "< 1 mili-giây (Cực nhanh)"
  },
  {
    feature: "Khuyến Nghị Ứng Dụng Trong AI-200",
    serviceBus: "Hàng đợi xử lý Prompt suy luận, điều phối đơn hàng, tác vụ tài chính có trạng thái",
    eventGrid: "Phản ứng khi có file ảnh mới upload lên Blob, kích hoạt pipeline OCR / Vectorization",
    redisPubSub: "Streaming token chat trực tiếp, cập nhật thanh tiến độ Agent trên UI thời gian thực"
  }
];

export const DURABLE_WORKFLOW_PATTERNS = [
  {
    pattern: "1. Function Chaining (Chuỗi Tuần Tự)",
    description: "Thực thi tuần tự các hàm: kết quả đầu ra của hàm trước làm đầu vào của hàm sau.",
    aiScenario: "Trích xuất văn bản từ PDF -> Phân loại loại tài liệu -> Tóm tắt nội dung bằng LLM."
  },
  {
    pattern: "2. Fan-Out / Fan-In (Phân Tán & Gom Tụ)",
    description: "Khởi chạy song song hàng loạt tác vụ con, sau đó gom toàn bộ kết quả bằng task_all().",
    aiScenario: "Chia nhỏ tài liệu 500 trang thành 20 chunks, chạy embedding song song, gom lại lưu vào Vector DB."
  },
  {
    pattern: "3. Async HTTP APIs (Bất Đồng Bộ Kéo Dài)",
    description: "Trả về HTTP 202 Accepted kèm URL theo dõi trạng thái cho tác vụ chạy lâu (vài phút đến vài giờ).",
    aiScenario: "Huấn luyện Fine-tuning mô hình ngôn ngữ hoặc sinh video AI mất 15 phút."
  },
  {
    pattern: "4. Monitor (Thăm Dò Định Kỳ)",
    description: "Vòng lặp có thời gian ngủ đông (create_timer) thăm dò trạng thái tài nguyên bên ngoài.",
    aiScenario: "Theo dõi tiến độ batch job OCR trên Azure AI Document Intelligence cho đến khi hoàn thành."
  },
  {
    pattern: "5. Human Interaction (Con Người Thẩm Định)",
    description: "Tạm dừng workflow và ngủ đông chờ sự kiện người dùng bấm Duyệt (external event) kèm timeout timer.",
    aiScenario: "Hệ thống AI duyệt hồ sơ vay: tự động duyệt nếu điểm tin cậy > 85%, chờ nhân viên duyệt nếu < 85%."
  }
];

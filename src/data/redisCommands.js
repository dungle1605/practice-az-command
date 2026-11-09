/**
 * Azure Managed Redis (AMR) & RediSearch Interactive Lab Dataset for Microsoft AI-200
 * Sourced directly from Microsoft Learn AI-200 AMR Repos:
 * - amr-data-operations-python (Core Hash Operations, TTL Caching, Entra ID Authentication on Port 10000)
 * - amr-pub-sub-python (Real-Time Pub/Sub Message Bus, Pattern Wildcards, Threaded Consumer)
 * - amr-vector-query-python (RediSearch HNSW Vector Indexing, Float32 Binary Bytes, KNN Queries Dialect 2)
 */

export const REDIS_CATEGORIES = [
  { id: "all", name: "🌟 Tất cả câu lệnh", icon: "📚" },
  { id: "connect", name: "🔐 Kết nối & Xác thực Entra ID", icon: "🔑" },
  { id: "hash", name: "📦 Caching & Cấu trúc Hash", icon: "🏷️" },
  { id: "ttl", name: "⏳ Hết hạn & Chiến lược Eviction", icon: "⏱️" },
  { id: "pubsub", name: "📡 Pub/Sub Phát tán Sự kiện", icon: "📣" },
  { id: "vector_idx", name: "🌐 RediSearch & Chỉ mục HNSW", icon: "🕸️" },
  { id: "vector_query", name: "🔍 Truy vấn KNN & Hybrid Vector", icon: "🎯" },
  { id: "admin", name: "🛠️ Quản trị Bộ nhớ & Bảo trì", icon: "⚡" }
];

export const REDIS_COMMANDS = [
  // ==========================================
  // 1. CONNECT & AUTH
  // ==========================================
  {
    id: "redis-ping",
    category: "connect",
    title: "1. Kiểm tra Kết nối Đường truyền (PING / PONG)",
    summary: "Xác nhận kết nối socket TLS tới Azure Managed Redis cluster trên cổng 10000.",
    command: `PING "Azure Managed Redis Health Check"`,
    pythonEquivalent: `import redis

client = redis.Redis(
    host="myredis.eastus.redisenterprise.cache.azure.net",
    port=10000,
    ssl=True,
    decode_responses=True
)
response = client.ping()
print(f"Ping response: {response}")`,
    parameters: [
      { name: "Port 10000", desc: "Azure Managed Redis (Enterprise) sử dụng mặc định cổng 10000 thay cho cổng 6379 của Redis truyền thống." },
      { name: "ssl=True", desc: "Bắt buộc mã hóa đường truyền TLS v1.2+ đối với toàn bộ kết nối cloud." }
    ],
    examTip: "⭐ AI-200: Không kết nối cổng 6379 với AMR Enterprise cluster; luôn trỏ vào cổng 10000 và bật TLS.",
    simulatedOutput: `"Azure Managed Redis Health Check"`
  },
  {
    id: "redis-auth-entraid",
    category: "connect",
    title: "2. Xác thực Không dùng Mật khẩu qua Microsoft Entra ID",
    summary: "Sử dụng token OAuth 2.0 từ Entra ID cấp cho ứng dụng, loại bỏ hoàn toàn access keys cố định.",
    command: `AUTH "<Entra-User-Or-App-OID>" "<OAuth2-Access-Token-JWT>"`,
    pythonEquivalent: `from azure.identity import DefaultAzureCredential
from redis_entraid.cred_provider import create_from_default_azure_credential
import redis

# Tạo Credential Provider tự động làm mới JWT token từ Entra ID
cred_provider = create_from_default_azure_credential()

client = redis.Redis(
    host="myredis.eastus.redisenterprise.cache.azure.net",
    port=10000,
    ssl=True,
    credential_provider=cred_provider,
    decode_responses=False # Khuyến nghị False khi làm việc với Vector nhị phân
)
print("Connected securely via Microsoft Entra ID!")`,
    parameters: [
      { name: "redis_entraid", desc: "Thư viện chính thức của Microsoft hỗ trợ tự động gia hạn OAuth token trước khi hết hạn 1 giờ." },
      { name: "DefaultAzureCredential", desc: "Tự động nhận diện Azure CLI, Managed Identity hoặc Environment Variables." }
    ],
    examTip: "⭐ AI-200: Khuyến nghị an ninh cao nhất của Microsoft là kích hoạt Microsoft Entra Authorization và gán Access Policy 'default' cho User/Principal OID.",
    simulatedOutput: `OK`
  },

  // ==========================================
  // 2. HASH OPERATIONS
  // ==========================================
  {
    id: "redis-hset-product",
    category: "hash",
    title: "3. Lưu Trữ Dữ Liệu Thực Thể Dạng Hash (HSET)",
    summary: "Lưu trữ thuộc tính của sản phẩm hoặc phiên làm việc người dùng vào cấu trúc Hash tối ưu bộ nhớ.",
    command: `HSET product:101 name "Azure AI Studio Guide" category "Cloud" price 49.99 stock 150`,
    pythonEquivalent: `r.hset("product:101", mapping={
    "name": "Azure AI Studio Guide",
    "category": "Cloud",
    "price": "49.99",
    "stock": "150"
})`,
    parameters: [
      { name: "Key Prefix (product:)", desc: "Quy ước đặt tên khóa theo namespace giúp dễ dàng phân loại và tạo tiền tố cho RediSearch Index." },
      { name: "mapping={...}", desc: "Thiết lập nhiều trường đồng thời trong một lượt truyền dữ liệu (pipelining ngầm)." }
    ],
    examTip: "⭐ Hash trong Redis lưu các cặp trường-giá trị trong cùng 1 khóa, tiết kiệm RAM hơn nhiều so với việc lưu từng giá trị dưới dạng key riêng biệt.",
    simulatedOutput: `(integer) 4`
  },
  {
    id: "redis-hgetall-product",
    category: "hash",
    title: "4. Truy Vấn Toàn Bộ Thuộc Tính Của Đối Tượng (HGETALL)",
    summary: "Đọc toàn bộ các trường và giá trị liên quan đến đối tượng được lưu trong cấu trúc Hash.",
    command: `HGETALL product:101`,
    pythonEquivalent: `item = r.hgetall("product:101")
print("Product details:", item)`,
    parameters: [
      { name: "HGETALL", desc: "Trả về danh sách xen kẽ trường và giá trị. Trong Python redis-py trả về dict." }
    ],
    examTip: "Với các Hash có hàng ngàn trường, nên dùng HMGET để lấy trường cần thiết, tránh nghẽn luồng xử lý đơn của Redis.",
    simulatedOutput: `1) "name"
2) "Azure AI Studio Guide"
3) "category"
4) "Cloud"
5) "price"
6) "49.99"
7) "stock"
8) "150"`
  },
  {
    id: "redis-hmget-fields",
    category: "hash",
    title: "5. Đọc Chọn Lọc Các Trường Cần Thiết (HMGET)",
    summary: "Chỉ tải các trường quan trọng (Projection) để tối ưu băng thông mạng và độ trễ dưới 1 mili-giây.",
    command: `HMGET product:101 name price`,
    pythonEquivalent: `name, price = r.hmget("product:101", ["name", "price"])
print(f"Name: {name}, Price: \${price}")`,
    parameters: [
      { name: "HMGET key field1 field2", desc: "Truy vấn danh sách trường con cụ thể từ hash." }
    ],
    examTip: "⭐ Tương đương với mệnh đề SELECT column1, column2 trong SQL.",
    simulatedOutput: `1) "Azure AI Studio Guide"
2) "49.99"`
  },

  // ==========================================
  // 3. TTL & EXPIRATION
  // ==========================================
  {
    id: "redis-expire-ttl",
    category: "ttl",
    title: "6. Thiết Lập Thời Gian Sống (TTL) Cho Khóa Cache",
    summary: "Quy định khóa tự động biến mất sau khoảng thời gian tính bằng giây, giải phóng dung lượng bộ nhớ.",
    command: `EXPIRE product:101 3600
TTL product:101`,
    pythonEquivalent: `# Thiết lập hết hạn sau 1 giờ (3600s)
r.expire("product:101", 3600)

# Kiểm tra số giây còn lại
remaining_seconds = r.ttl("product:101")
print(f"TTL remaining: {remaining_seconds}s")`,
    parameters: [
      { name: "EXPIRE key seconds", desc: "Gán bộ đếm lùi thời gian sống cho khóa." },
      { name: "TTL", desc: "Trả về số giây còn lại (> 0), -1 nếu không bao giờ hết hạn, hoặc -2 nếu khóa không tồn tại." }
    ],
    examTip: "⭐ AI-200: TTL là phương pháp cốt lõi để làm mới dữ liệu cache phân tán và ngăn chặn hiện tượng rò rỉ bộ nhớ (memory bloat).",
    simulatedOutput: `(integer) 1
(integer) 3598`
  },
  {
    id: "redis-persist-key",
    category: "ttl",
    title: "7. Giữ Khóa Vĩnh Viễn Không Cho Hết Hạn (PERSIST)",
    summary: "Xóa bỏ bộ đếm lùi TTL, biến khóa cache thành dữ liệu lưu trú dài hạn trong RAM.",
    command: `PERSIST product:101
TTL product:101`,
    pythonEquivalent: `r.persist("product:101")
print("TTL after persist:", r.ttl("product:101")) # Returns -1`,
    parameters: [
      { name: "PERSIST key", desc: "Hủy bỏ bộ đếm thời gian sống, giữ khóa an toàn trong RAM trừ khi bị xóa thủ công hoặc bị eviction." }
    ],
    examTip: "TTL trả về `-1` cho biết khóa đang tồn tại nhưng không có bất kỳ thời gian hết hạn nào.",
    simulatedOutput: `(integer) 1
(integer) -1`
  },

  // ==========================================
  // 4. PUB/SUB EVENT STREAMING
  // ==========================================
  {
    id: "redis-publish-event",
    category: "pubsub",
    title: "8. Phát Tán Sự Kiện Thời Gian Thực (PUBLISH)",
    summary: "Gửi thông điệp thời gian thực (real-time message) tới tất cả các subscriber đang lắng nghe trên kênh chỉ định.",
    command: `PUBLISH orders:europe "{\"order_id\": 9901, \"item\": \"Surface Pro\", \"amount\": 1299.00}"`,
    pythonEquivalent: `import json

event_data = {
    "order_id": 9901,
    "item": "Surface Pro",
    "amount": 1299.00
}
subscriber_count = r.publish("orders:europe", json.dumps(event_data))
print(f"Event broadcasted to {subscriber_count} active listeners.")`,
    parameters: [
      { name: "PUBLISH channel message", desc: "Phát thông điệp theo mô hình at-most-once (không lưu lại vào lịch sử bộ nhớ)." },
      { name: "Return Value", desc: "Trả về số lượng subscriber đã nhận được thông điệp tại thời điểm phát." }
    ],
    examTip: "⭐ AI-200: Redis Pub/Sub là cơ chế 'Fire-and-Forget'. Nếu subscriber bị rớt mạng lúc gửi tin, tin nhắn đó sẽ bị mất.",
    simulatedOutput: `(integer) 3`
  },
  {
    id: "redis-psubscribe-pattern",
    category: "pubsub",
    title: "9. Lắng Nghe Đa Kênh Bằng Ký Tự Đại Diện (PSUBSCRIBE)",
    summary: "Đăng ký lắng nghe hàng loạt kênh khớp với mẫu định dạng glob (ví dụ: orders:*).",
    command: `PSUBSCRIBE orders:*`,
    pythonEquivalent: `import threading

def event_listener():
    pubsub = r.pubsub()
    pubsub.psubscribe("orders:*")
    print("Listening on orders:* channels...")
    for message in pubsub.listen():
        if message["type"] == "pmessage":
            print(f"[{message['channel']}] Received: {message['data']}")

# Chạy listener trên luồng nền (background thread)
listener_thread = threading.Thread(target=event_listener, daemon=True)
listener_thread.start()`,
    parameters: [
      { name: "PSUBSCRIBE pattern", desc: "Đăng ký lắng nghe theo mẫu ký tự đại diện wildcard (*)." },
      { name: "pmessage", desc: "Kiểu thông điệp nhận được khi khớp mẫu đăng ký pattern." }
    ],
    examTip: "Trong ứng dụng AI Agent đa kênh, `PSUBSCRIBE agent:tasks:*` cho phép giám sát tiến độ của nhiều subagent cùng lúc.",
    simulatedOutput: `1) "psubscribe"
2) "orders:*"
3) (integer) 1`
  },

  // ==========================================
  // 5. REDISEARCH VECTOR INDEXING
  // ==========================================
  {
    id: "redis-ft-create-vector-index",
    category: "vector_idx",
    title: "10. Khởi Tạo Chỉ Mục Vector RediSearch HNSW (FT.CREATE)",
    summary: "Tạo chỉ mục RediSearch trên các khóa Hash có tiền tố 'product:', bao gồm trường Vector 8 chiều thuật toán HNSW Cosine.",
    command: `FT.CREATE idx:products ON HASH PREFIX 1 product: SCHEMA name TEXT category TAG embedding VECTOR HNSW 6 TYPE FLOAT32 DIM 8 DISTANCE_METRIC COSINE`,
    pythonEquivalent: `from redis.commands.search.field import TextField, TagField, VectorField
from redis.commands.search.index_definition import IndexDefinition, IndexType

schema = (
    TextField("name"),
    TagField("category"),
    VectorField(
        "embedding",
        "HNSW",
        {
            "TYPE": "FLOAT32",
            "DIM": 8,
            "DISTANCE_METRIC": "COSINE"
        }
    )
)

r.ft("idx:products").create_index(
    fields=schema,
    definition=IndexDefinition(
        prefix=["product:"],
        index_type=IndexType.HASH
    )
)`,
    parameters: [
      { name: "ON HASH PREFIX 1 product:", desc: "Chỉ định RediSearch tự động index mọi key bắt đầu bằng chuỗi 'product:'." },
      { name: "VECTOR HNSW", desc: "Sử dụng đồ thị phân tầng Hierarchical Navigable Small World cho tốc độ truy vấn mili-giây." },
      { name: "TYPE FLOAT32", desc: "Kiểu vector số thực 32-bit chuẩn hoá." },
      { name: "DISTANCE_METRIC COSINE", desc: "Thước đo khoảng cách Cosine phù hợp với tìm kiếm ngữ nghĩa văn bản." }
    ],
    examTip: "⭐ AI-200: Trong Azure Managed Redis, RediSearch được tích hợp sẵn dưới dạng module cốt lõi (RediSearch 2.x+), không cần cài đặt bổ sung.",
    simulatedOutput: `OK`
  },
  {
    id: "redis-ft-info-index",
    category: "vector_idx",
    title: "11. Kiểm Tra Siêu Dữ Liệu Chỉ Mục RediSearch (FT.INFO)",
    summary: "Xem số lượng tài liệu đã lập chỉ mục, trạng thái indexing, và cấu hình thuật toán HNSW.",
    command: `FT.INFO idx:products`,
    pythonEquivalent: `info = r.ft("idx:products").info()
print("Indexed docs count:", info["num_docs"])
print("Indexing state:", info["indexing"])`,
    parameters: [
      { name: "FT.INFO index_name", desc: "Lấy báo cáo chi tiết về kích thước RAM, số lượng documents và cấu trúc trường." }
    ],
    examTip: "Trường `num_docs` phải phản ánh chính xác số lượng khóa `product:*` đã chèn vào Redis.",
    simulatedOutput: ` 1) index_name
 2) idx:products
 3) index_options
 4) (empty array)
 5) index_definition
 6)  1) key_type
     2) HASH
     3) prefixes
     4) 1) "product:"
 7) fields
 8) 1) 1) identifier
       2) name
       3) type
       4) TEXT
    2) 1) identifier
       2) category
       3) type
       4) TAG
    3) 1) identifier
       2) embedding
       3) type
       4) VECTOR
 9) num_docs
10) "100"`
  },

  // ==========================================
  // 6. VECTOR KNN & HYBRID QUERIES
  // ==========================================
  {
    id: "redis-ft-search-knn",
    category: "vector_query",
    title: "12. Tìm Kiếm Tương Đồng Vector K-Nearest Neighbors (KNN)",
    summary: "Tìm 3 sản phẩm có độ tương đồng ngữ nghĩa cao nhất với vector truy vấn, trả về điểm khoảng cách Cosine.",
    command: `FT.SEARCH idx:products "*=>[KNN 3 @embedding $query_vec AS score]" PARAMS 2 query_vec "\\x00\\x00..." SORTBY score DIALECT 2`,
    pythonEquivalent: `import numpy as np
from redis.commands.search.query import Query

# 1. Chuẩn bị vector truy vấn 8 chiều dạng float32 bytes
query_vector = np.array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], dtype=np.float32).tobytes()

# 2. Xây dựng câu truy vấn KNN với DIALECT 2
q = (
    Query("*=>[KNN 3 @embedding $query_vec AS score]")
    .sort_by("score")
    .return_fields("name", "category", "score")
    .dialect(2)
)

# 3. Thực thi tìm kiếm
results = r.ft("idx:products").search(q, query_params={"query_vec": query_vector})
for doc in results.docs:
    print(f"[{doc.score}] {doc.name} (Category: {doc.category})")`,
    parameters: [
      { name: "np.float32().tobytes()", desc: "Bắt buộc: Redis lưu vector dưới dạng chuỗi byte nhị phân thô (Raw binary blob)." },
      { name: "*=>[KNN k @field $vec AS score]", desc: "Cú pháp KNN của RediSearch. Dấu * biểu thị tìm kiếm trên toàn bộ tập dữ liệu." },
      { name: "DIALECT 2", desc: "Bắt buộc kích hoạt Dialect 2 trở lên để hỗ trợ cú pháp Vector Search và ánh xạ tham số $params." }
    ],
    examTip: "⭐ AI-200: Trong RediSearch Cosine Distance, điểm score càng nhỏ (gần 0) thì độ tương đồng ngữ nghĩa càng cao.",
    simulatedOutput: `1) (integer) 3
2) "product:101"
3) 1) "name"
   2) "Azure AI Studio Guide"
   3) "category"
   4) "Cloud"
   5) "score"
   6) "0.04128"
4) "product:104"
5) 1) "name"
   2) "Cloud Architecture Book"
   3) "category"
   4) "Cloud"
   5) "score"
   6) "0.08945"`
  },
  {
    id: "redis-ft-search-hybrid",
    category: "vector_query",
    title: "13. Tìm Kiếm Kết Hợp: Lọc Thuộc Tính & Vector KNN (Hybrid)",
    summary: "Chỉ tìm kiếm vector trong tập con sản phẩm thuộc phân loại 'Cloud' (Pre-filtering) giúp tăng tốc độ và độ chuẩn xác.",
    command: `FT.SEARCH idx:products "(@category:{Cloud})=>[KNN 3 @embedding $query_vec AS score]" PARAMS 2 query_vec "\\x00..." SORTBY score DIALECT 2`,
    pythonEquivalent: `# Lọc theo TAG category: "Cloud" trước khi thực hiện KNN vector similarity
hybrid_query = (
    Query("(@category:{Cloud})=>[KNN 3 @embedding $query_vec AS score]")
    .sort_by("score")
    .return_fields("name", "price", "score")
    .dialect(2)
)

results = r.ft("idx:products").search(hybrid_query, query_params={"query_vec": query_vector})
print(f"Total matching items: {results.total}")`,
    parameters: [
      { name: "(@category:{Cloud})", desc: "Biểu thức lọc metadata TAG trước khi tiến hành tính toán khoảng cách vector." },
      { name: "Pre-filtering", desc: "Giảm không gian tìm kiếm đồ thị HNSW, mang lại độ trễ cực thấp (< 1ms)." }
    ],
    examTip: "⭐ AI-200: RediSearch hỗ trợ Hybrid Search nguyên bản mà không cần phối hợp nhiều hệ cơ sở dữ liệu riêng rẽ.",
    simulatedOutput: `1) (integer) 2
2) "product:101"
3) 1) "name"
   2) "Azure AI Studio Guide"
   3) "price"
   4) "49.99"
   5) "score"
   6) "0.04128"`
  },

  // ==========================================
  // 7. ADMIN & MAINTENANCE
  // ==========================================
  {
    id: "redis-unlink-async",
    category: "admin",
    title: "14. Xóa Khóa Bất Đồng Bộ Không Nghẽn Luồng (UNLINK)",
    summary: "Xóa các khóa lớn trên luồng phụ nền (background thread), tránh tình trạng chặn luồng chính như lệnh DEL cổ điển.",
    command: `UNLINK product:101 product:102`,
    pythonEquivalent: `# Sử dụng UNLINK thay cho DEL đối với cấu trúc lớn
deleted_count = r.unlink("product:101", "product:102")
print(f"Successfully unlinked {deleted_count} keys asynchronously.")`,
    parameters: [
      { name: "UNLINK vs DEL", desc: "DEL là thao tác đồng bộ; xóa khóa lớn có thể làm đơ hệ thống trong vài giây. UNLINK giải phóng bộ nhớ ngầm." }
    ],
    examTip: "⭐ Best Practice: Trong môi trường Production với hàng triệu keys, luôn sử dụng UNLINK thay vì DEL.",
    simulatedOutput: `(integer) 2`
  },
  {
    id: "redis-memory-stats",
    category: "admin",
    title: "15. Kiểm Tra Tình Trạng Bộ Nhớ & Tỉ Lệ Hit/Miss (INFO)",
    summary: "Đo lường dung lượng RAM thực tế đang tiêu thụ và tỉ lệ cache hit để đánh giá hiệu quả lưu đệm.",
    command: `INFO memory
INFO stats`,
    pythonEquivalent: `mem_info = r.info("memory")
stats_info = r.info("stats")

hits = stats_info["keyspace_hits"]
misses = stats_info["keyspace_misses"]
hit_ratio = (hits / (hits + misses) * 100) if (hits + misses) > 0 else 0

print(f"RAM Used: {mem_info['used_memory_human']}")
print(f"Cache Hit Ratio: {hit_ratio:.2f}%")`,
    parameters: [
      { name: "used_memory_human", desc: "Dung lượng bộ nhớ Redis đang phân bổ, định dạng dễ đọc (ví dụ: 12.50M)." },
      { name: "keyspace_hits / misses", desc: "Số lượt tìm thấy và không tìm thấy khóa trong cache." }
    ],
    examTip: "Mục tiêu tối ưu của một hệ thống caching là duy trì Cache Hit Ratio trên 85-90%.",
    simulatedOutput: `# Memory
used_memory:13107200
used_memory_human:12.50M
used_memory_peak_human:14.20M
maxmemory_policy:volatile-lru

# Stats
keyspace_hits:142500
keyspace_misses:12400`
  }
];

export const REDIS_EVICTION_POLICIES = [
  {
    policy: "volatile-lru (Mặc định AMR)",
    description: "Loại bỏ khóa ít được sử dụng gần đây nhất (LRU) trong số các khóa có gán TTL.",
    bestFor: "Mô hình kết hợp giữa dữ liệu cache tạm thời và dữ liệu cấu hình tĩnh không có TTL."
  },
  {
    policy: "allkeys-lru",
    description: "Loại bỏ bất kỳ khóa nào ít được sử dụng gần đây nhất, bất kể có gán TTL hay không.",
    bestFor: "Hệ thống thuần túy làm cache đệm tầng trước Database hoặc AI embeddings."
  },
  {
    policy: "volatile-lfu",
    description: "Loại bỏ khóa có tần suất sử dụng thấp nhất (LFU) trong số các khóa có gán TTL.",
    bestFor: "Dữ liệu có chu kỳ truy cập đều đặn, tránh bị thanh trừng bởi một lần quét ngẫu nhiên."
  },
  {
    policy: "allkeys-lfu",
    description: "Loại bỏ khóa có tần suất truy cập thấp nhất trên toàn bộ cơ sở dữ liệu.",
    bestFor: "Bộ đệm đề xuất nội dung, các sản phẩm phổ biến được giữ lại lâu hơn."
  },
  {
    policy: "volatile-ttl",
    description: "Loại bỏ khóa có thời gian sống còn lại ngắn nhất (sắp hết hạn nhất).",
    bestFor: "Ưu tiên giải phóng các phần tử gần tới hạn trước để giảm thiểu tác động nghiệp vụ."
  },
  {
    policy: "noeviction",
    description: "Không tự động loại bỏ bất kỳ khóa nào. Khi đầy RAM, mọi lệnh ghi mới sẽ trả về lỗi OOM.",
    bestFor: "Redis đóng vai trò cơ sở dữ liệu chính hoặc hàng đợi tin nhắn không được phép mất dữ liệu."
  }
];

export const REDIS_VS_POSTGRES_VECTOR = [
  {
    dimension: "Bản chất Lưu trữ",
    redis: "Toàn bộ trong RAM (In-Memory First), cực kỳ tối ưu độ trễ",
    postgres: "Lưu trữ trên Ổ đĩa (Disk-backed với Shared Buffers RAM)"
  },
  {
    dimension: "Độ trễ Truy vấn (Query Latency)",
    redis: "Cực thấp (< 1 mili-giây)",
    postgres: "Rất nhanh (~2 - 10 mili-giây)"
  },
  {
    dimension: "Định dạng Vector trong Code",
    redis: "Chuỗi byte nhị phân thô (`np.float32().tobytes()`)",
    postgres: "Chuỗi văn bản hoặc mảng mảng số thực (`[0.1, 0.2, ...]`)"
  },
  {
    dimension: "Thuật toán Chỉ mục Hỗ trợ",
    redis: "HNSW và FLAT (Module RediSearch)",
    postgres: "HNSW và IVFFlat (Extension pgvector)"
  },
  {
    dimension: "Tốc độ Đọc/Ghi Tăng dần",
    redis: "Hàng chục ngàn thao tác chèn/giây không suy giảm tốc độ",
    postgres: "Phù hợp chèn theo lô (Batch inserts) với WAL"
  },
  {
    dimension: "Tính Bền vững (Persistence)",
    redis: "Snapshot RDB và ghi nhật ký AOF định kỳ",
    postgres: "ACID hoàn toàn, ghi nhật ký giao dịch Write-Ahead Log"
  },
  {
    dimension: "Kịch bản Sử dụng trong AI-200",
    redis: "Working memory tức thời của AI Agent, Semantic Caching cho LLM, Session Store",
    postgres: "Kho tri thức dài hạn (Knowledge Base), RAG chuyên sâu, Kết hợp dữ liệu quan hệ"
  }
];

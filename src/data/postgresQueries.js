/**
 * PostgreSQL & pgvector Interactive Lab Dataset for Microsoft AI-200
 * Sourced directly from Microsoft Learn AI-200 PostgreSQL Labs:
 * - postgresql-vector-search-python (Vector Similarity Search & Flask app)
 * - postgresql-optimize-vector-search-python (HNSW vs IVFFlat Tuning, EXPLAIN ANALYZE, Hybrid Filter)
 * - postgresql-build-agent-python (AI Agent Memory Backend, Conversation & Task Checkpoints)
 */

export const POSTGRES_CATEGORIES = [
  { id: "all", name: "🌟 Tất cả câu lệnh", icon: "📚" },
  { id: "setup", name: "⚙️ Cài đặt & Schema", icon: "🛠️" },
  { id: "operators", name: "📐 Toán tử pgvector", icon: "📏" },
  { id: "hnsw", name: "🌐 Chỉ mục HNSW", icon: "🕸️" },
  { id: "ivfflat", name: "📊 Chỉ mục IVFFlat", icon: "📑" },
  { id: "explain", name: "⚡ Kế hoạch EXPLAIN ANALYZE", icon: "🔍" },
  { id: "hybrid", name: "🔀 Hybrid Search & Lọc B-tree", icon: "🎯" },
  { id: "agent", name: "🧠 Bộ nhớ AI Agent & Checkpoints", icon: "🤖" },
  { id: "connect", name: "🔑 Kết nối psql & Entra ID", icon: "🔐" }
];

export const POSTGRES_QUERIES = [
  // ==========================================
  // 1. SETUP & EXTENSION
  // ==========================================
  {
    id: "pg-enable-vector",
    category: "setup",
    title: "1. Kích hoạt Tiện ích mở rộng pgvector",
    summary: "Bật extension vector trong database hiện tại sau khi đã allow-list tham số azure.extensions trên server.",
    sql: `-- Bắt buộc: Chạy với quyền quản trị viên database
CREATE EXTENSION IF NOT EXISTS vector;

-- Kiểm tra phiên bản pgvector đang hoạt động
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';`,
    parameters: [
      { name: "IF NOT EXISTS", desc: "Không báo lỗi nếu tiện ích mở rộng vector đã được kích hoạt trước đó." }
    ],
    examTip: "⭐ AI-200: Tiện ích pgvector bổ sung kiểu dữ liệu `vector(n)` và các toán tử tính khoảng cách vector `<=>`, `<->`, `<#>` vào PostgreSQL.",
    simulatedOutput: `CREATE EXTENSION
 extname | extversion 
---------+------------
 vector  | 0.7.0
(1 row)`
  },
  {
    id: "pg-create-table-products",
    category: "setup",
    title: "2. Khởi tạo Bảng Sản phẩm với Cột Vector 384 Chiều",
    summary: "Định nghĩa bảng chứa thông tin sản phẩm và vector embedding 384 chiều (kích thước chuẩn của Sentence Transformers).",
    sql: `CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    in_stock BOOLEAN DEFAULT true,
    embedding vector(384) -- Vector embedding 384-dimensional
);`,
    parameters: [
      { name: "vector(384)", desc: "Kiểu dữ liệu vector có kích thước cố định 384 chiều. Nếu chèn vector khác 384 số thực, hệ thống sẽ báo lỗi." }
    ],
    examTip: "⭐ AI-200: Cần chọn số chiều trong `vector(n)` khớp chính xác với mô hình sinh embedding (ví dụ: all-MiniLM-L6-v2 dùng 384, text-embedding-3-small dùng 1536).",
    simulatedOutput: `CREATE TABLE`
  },
  {
    id: "pg-populate-test-data",
    category: "setup",
    title: "3. Sinh Dữ liệu Giả lập 100,000 Vector Ngẫu nhiên",
    summary: "Tạo 100,000 bản ghi sản phẩm kèm vector embedding 384 chiều ngẫu nhiên trong khoảng [-1.0, 1.0] để benchmark hiệu năng.",
    sql: `INSERT INTO products (name, category_id, price, in_stock, embedding)
SELECT
    'Product ' || i,
    (random() * 20)::int + 1,
    (random() * 1000)::numeric(10, 2),
    random() > 0.1,
    ('[' || array_to_string(ARRAY(
        SELECT (random() * 2 - 1)::float4
        FROM generate_series(1, 384)
    ), ',') || ']')::vector
FROM generate_series(1, 100000) AS i;

-- Xác nhận tổng số dòng trong bảng
SELECT COUNT(*) AS total_products FROM products;`,
    parameters: [
      { name: "generate_series(1, 100000)", desc: "Hàm sinh dãy số từ 1 đến 100,000 phục vụ chèn dữ liệu hàng loạt." },
      { name: "array_to_string(...) ::vector", desc: "Chuyển mảng float4 thành chuỗi dạng [x1,x2,...] rồi ép kiểu sang vector." }
    ],
    examTip: "Trong bài lab tối ưu hóa, 100,000 vector mất khoảng 20-40 giây để khởi tạo và là tập dữ liệu chuẩn để kiểm chứng sự khác biệt giữa Seq Scan và Index Scan.",
    simulatedOutput: `INSERT 0 100000
 total_products 
----------------
         100000
(1 row)`
  },

  // ==========================================
  // 2. VECTOR OPERATORS
  // ==========================================
  {
    id: "pg-op-cosine",
    category: "operators",
    title: "4. Toán tử Khoảng cách Cosine (<=>) và vector_cosine_ops",
    summary: "Tìm kiếm các sản phẩm tương đồng nhất dựa trên khoảng cách góc Cosine (0 = trùng khớp, 2 = đối nghịch).",
    sql: `-- Truy vấn 5 sản phẩm gần nhất theo Cosine Distance
SELECT id, name, price,
       embedding <=> '[0.05, -0.12, 0.43, ...]'::vector AS cosine_distance
FROM products
WHERE id != 42
ORDER BY embedding <=> '[0.05, -0.12, 0.43, ...]'::vector
LIMIT 5;`,
    parameters: [
      { name: "<=>", desc: "Toán tử khoảng cách Cosine trong pgvector. Giá trị càng nhỏ thì mức độ tương đồng ngữ nghĩa càng cao." },
      { name: "vector_cosine_ops", desc: "Lớp toán tử (operator class) tương ứng khi tạo chỉ mục HNSW hoặc IVFFlat." }
    ],
    examTip: "⭐ Trọng tâm thi AI-200: `<=>` là toán tử phổ biến nhất cho semantic search văn bản vì không bị ảnh hưởng bởi độ dài vector.",
    simulatedOutput: ` id  |          name           | price  |  cosine_distance  
-----+-------------------------+--------+-------------------
 104 | Wireless Noise-Cancel   | 149.99 | 0.082145129381294
 812 | Bluetooth Studio Bass   | 189.50 | 0.114298102941042
  57 | Compact Earbuds Pro     |  79.00 | 0.140812930192841
 943 | Over-Ear HiFi Monitor   | 220.00 | 0.158209148192031
 419 | Premium Audio Cable     |  29.99 | 0.181290381029381
(5 rows)`
  },
  {
    id: "pg-op-l2-innerproduct",
    category: "operators",
    title: "5. Toán tử L2 Euclidean (<->) & Negative Inner Product (<#>)",
    summary: "So sánh các toán tử đo khoảng cách vector khác được pgvector hỗ trợ.",
    sql: `-- 1. Khoảng cách L2 (Euclidean Distance)
-- Phù hợp khi độ lớn (magnitude) của vector mang ý nghĩa đặc trưng
SELECT id, name, embedding <-> $query_vector AS l2_distance
FROM products
ORDER BY embedding <-> $query_vector
LIMIT 5;

-- 2. Tích vô hướng âm (Negative Inner Product)
-- Trả về - (x . y). Thích hợp với vector đã được chuẩn hóa L2 (normalized)
SELECT id, name, (embedding <#> $query_vector) * -1 AS dot_product
FROM products
ORDER BY embedding <#> $query_vector
LIMIT 5;`,
    parameters: [
      { name: "<->", desc: "Khoảng cách đường thẳng Euclidean L2 (toán tử lớp: vector_l2_ops)." },
      { name: "<#>", desc: "Tích vô hướng âm (toán tử lớp: vector_ip_ops). Sắp xếp tăng dần theo <#> tương đương giảm dần theo tích vô hướng." }
    ],
    examTip: "Bảng tổng hợp: Cosine `<=>` (vector_cosine_ops) | Euclidean `<->` (vector_l2_ops) | Dot Product `<#>` (vector_ip_ops).",
    simulatedOutput: `[L2 Euclidean & Inner Product Results computed]`
  },

  // ==========================================
  // 3. HNSW INDEXING & TUNING
  // ==========================================
  {
    id: "pg-hnsw-create",
    category: "hnsw",
    title: "6. Tạo Chỉ mục HNSW (Hierarchical Navigable Small World)",
    summary: "Xây dựng chỉ mục đồ thị nhiều tầng tối ưu cho tốc độ tìm kiếm và hỗ trợ chèn tăng dần.",
    sql: `-- Tăng dung lượng bộ nhớ tạm cho tác vụ dựng index
SET maintenance_work_mem = '256MB';

-- Tạo chỉ mục HNSW với m=16 và ef_construction=64
CREATE INDEX IF NOT EXISTS idx_products_embedding_hnsw
ON products USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);`,
    parameters: [
      { name: "m = 16", desc: "Số lượng liên kết tối đa giữa một node với các node lân cận trên mỗi tầng đồ thị (mặc định 16, thường từ 16 - 64)." },
      { name: "ef_construction = 64", desc: "Kích thước danh sách ứng viên động được khám phá khi thêm vector vào đồ thị (mặc định 64). Tăng lên giúp đồ thị chính xác hơn nhưng build lâu hơn." },
      { name: "maintenance_work_mem", desc: "Bộ nhớ cấp cho tác vụ tạo index; khuyến nghị đặt '256MB' để tránh tràn ra đĩa gây chậm." }
    ],
    examTip: "⭐ AI-200: HNSW là lựa chọn hàng đầu cho Production workloads vì truy vấn cực nhanh và không cần phải rebuild lại khi thêm bản ghi mới.",
    simulatedOutput: `SET
CREATE INDEX
Time: 42150.320 ms (00:42.150)`
  },
  {
    id: "pg-hnsw-tune-search",
    category: "hnsw",
    title: "7. Tinh chỉnh hnsw.ef_search ở Thời điểm Truy vấn",
    summary: "Điều chỉnh kích thước danh sách ứng viên động lúc tìm kiếm để cân bằng giữa Recall và Tốc độ (Latency).",
    sql: `-- Cấu hình tốc độ cực nhanh (Low latency, recall vừa phải)
SET hnsw.ef_search = 20;

EXPLAIN ANALYZE
SELECT id, name, embedding <=> (SELECT embedding FROM query_vectors) AS distance
FROM products
ORDER BY embedding <=> (SELECT embedding FROM query_vectors)
LIMIT 10;

-- Cấu hình độ chính xác cao (High recall, độ trễ tăng nhẹ)
SET hnsw.ef_search = 100;

EXPLAIN ANALYZE
SELECT id, name, embedding <=> (SELECT embedding FROM query_vectors) AS distance
FROM products
ORDER BY embedding <=> (SELECT embedding FROM query_vectors)
LIMIT 10;`,
    parameters: [
      { name: "hnsw.ef_search", desc: "Kích thước danh sách ứng viên tìm kiếm (mặc định 40). Giá trị càng cao duyệt qua càng nhiều đường đi trên đồ thị, tìm ra lân cận chính xác hơn nhưng tốn nhiều phép tính hơn." }
    ],
    examTip: "⭐ Tham số `hnsw.ef_search` được cấu hình cấp phiên làm việc (session-level), không cần sửa đổi cấu trúc bảng hay xây dựng lại index.",
    simulatedOutput: `SET
Execution Time with ef_search=20:  ~1.85 ms (Recall ~92%)
Execution Time with ef_search=100: ~4.12 ms (Recall ~99.4%)`
  },

  // ==========================================
  // 4. IVFFLAT INDEXING & TUNING
  // ==========================================
  {
    id: "pg-ivfflat-create",
    category: "ivfflat",
    title: "8. Tạo Chỉ mục IVFFlat (Inverted File Flat)",
    summary: "Phân chia không gian vector thành các cụm (clusters/lists). Tốc độ tạo index nhanh và tốn ít RAM hơn HNSW.",
    sql: `-- Áp dụng quy tắc rows / 1000 cho bảng 100,000 hàng: lists = 100
CREATE INDEX IF NOT EXISTS idx_products_embedding_ivfflat
ON products USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);`,
    parameters: [
      { name: "lists = 100", desc: "Số lượng cụm tâm (centroids) phân vùng. Với <= 1 triệu hàng, công thức khuyên dùng là rows / 1000. Với > 1 triệu hàng, dùng sqrt(rows)." }
    ],
    examTip: "⭐ Lưu ý thi AI-200: Chỉ nên tạo chỉ mục IVFFlat SAU KHI bảng đã có sẵn dữ liệu, vì thuật toán k-means cần dữ liệu thực tế để tính toán tọa độ các cụm.",
    simulatedOutput: `CREATE INDEX
Time: 8430.120 ms (00:08.430)`
  },
  {
    id: "pg-ivfflat-tune-probes",
    category: "ivfflat",
    title: "9. Tinh chỉnh ivfflat.probes để Cân bằng Recall",
    summary: "Điều chỉnh số lượng cụm lân cận được quét khi thực thi câu truy vấn tìm kiếm vector.",
    sql: `-- Fast Mode (probes = 1): Chỉ quét đúng 1 cụm gần nhất
SET ivfflat.probes = 1;

EXPLAIN ANALYZE
SELECT id, name, embedding <=> (SELECT embedding FROM query_vectors) AS distance
FROM products
ORDER BY embedding <=> (SELECT embedding FROM query_vectors)
LIMIT 10;

-- Accurate Mode (probes = 50): Quét qua 50% số cụm để tăng Recall
SET ivfflat.probes = 50;

EXPLAIN ANALYZE
SELECT id, name, embedding <=> (SELECT embedding FROM query_vectors) AS distance
FROM products
ORDER BY embedding <=> (SELECT embedding FROM query_vectors)
LIMIT 10;`,
    parameters: [
      { name: "ivfflat.probes", desc: "Số lượng cụm được khám phá lúc truy vấn (mặc định 1). Nếu probes = lists, IVFFlat sẽ quét toàn bộ và trở thành Exact Search." }
    ],
    examTip: "Nếu kết quả vector bị bỏ sót (missed true nearest neighbors), giải pháp là tăng giá trị `ivfflat.probes`.",
    simulatedOutput: `SET
Execution Time with probes=1:  ~2.40 ms (Recall ~78%)
Execution Time with probes=50: ~18.20 ms (Recall ~96%)`
  },

  // ==========================================
  // 5. EXPLAIN ANALYZE
  // ==========================================
  {
    id: "pg-explain-baseline",
    category: "explain",
    title: "10. Baseline: Chẩn đoán Seq Scan khi Chưa có Index",
    summary: "Đo lường kế hoạch thực thi khi cơ sở dữ liệu phải quét toàn bộ 100,000 bản ghi để so sánh vector.",
    sql: `EXPLAIN ANALYZE
SELECT id, name, embedding <=> (SELECT embedding FROM query_vectors) AS distance
FROM products
ORDER BY embedding <=> (SELECT embedding FROM query_vectors)
LIMIT 10;`,
    parameters: [
      { name: "EXPLAIN ANALYZE", desc: "Thực thi câu truy vấn và in ra cây kế hoạch thực tế kèm thời gian chạy chi tiết từng node." }
    ],
    examTip: "Nút `Seq Scan on products` xuất hiện thể hiện việc chưa có index hoặc optimizer nhận định quét tuần tự rẻ hơn.",
    simulatedOutput: `Limit  (cost=12540.00..12540.03 rows=10 width=48) (actual time=245.312..245.315 rows=10 loops=1)
  InitPlan 1 (returns $0)
    ->  Seq Scan on query_vectors  (cost=0.00..1.01 rows=1 width=1536) (actual time=0.015..0.016 rows=1 loops=1)
  ->  Sort  (cost=12539.99..12789.99 rows=100000 width=48) (actual time=245.310..245.312 rows=10 loops=1)
        Sort Key: ((products.embedding <=> $0))
        Sort Method: top-N heapsort  Memory: 26kB
        ->  Seq Scan on products  (cost=0.00..9850.00 rows=100000 width=48) (actual time=0.032..210.450 rows=100000 loops=1)
Planning Time: 0.180 ms
Execution Time: 246.120 ms`
  },
  {
    id: "pg-explain-indexed",
    category: "explain",
    title: "11. Chẩn đoán Index Scan với HNSW Index",
    summary: "Quan sát sự chuyển biến sang Index Scan: duyệt qua đồ thị vector chỉ mất dưới 5ms.",
    sql: `EXPLAIN ANALYZE
SELECT id, name, embedding <=> (SELECT embedding FROM query_vectors) AS distance
FROM products
ORDER BY embedding <=> (SELECT embedding FROM query_vectors)
LIMIT 10;`,
    parameters: [
      { name: "Index Scan", desc: "Nút kế hoạch sử dụng cấu trúc đồ thị HNSW để duyệt nhanh các đỉnh lân cận mà không cần đọc hết dữ liệu." }
    ],
    examTip: "Thời gian thực thi giảm từ ~246 ms (Seq Scan) xuống chỉ còn ~3.2 ms (Index Scan) — cải thiện hơn 70 lần!",
    simulatedOutput: `Limit  (cost=0.28..4.50 rows=10 width=48) (actual time=0.850..3.180 rows=10 loops=1)
  InitPlan 1 (returns $0)
    ->  Seq Scan on query_vectors  (cost=0.00..1.01 rows=1 width=1536) (actual time=0.010..0.011 rows=1 loops=1)
  ->  Index Scan using idx_products_embedding_hnsw on products  (cost=0.28..42200.00 rows=100000 width=48) (actual time=0.848..3.175 rows=10 loops=1)
        Order By: (embedding <=> $0)
Planning Time: 0.210 ms
Execution Time: 3.250 ms`
  },

  // ==========================================
  // 6. HYBRID SEARCH & METADATA FILTERING
  // ==========================================
  {
    id: "pg-hybrid-btree",
    category: "hybrid",
    title: "12. Hybrid Search: Kết hợp Lọc B-tree Metadata & Vector Search",
    summary: "Tạo chỉ mục B-tree trên trường phân loại (category_id, price) để tối ưu hóa truy vấn lọc kết hợp tìm kiếm tương đồng.",
    sql: `-- 1. Tạo B-tree index trên cột danh mục
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);

-- 2. Tạo Composite B-tree index cho nhiều điều kiện lọc
CREATE INDEX IF NOT EXISTS idx_products_category_price ON products (category_id, price);

-- 3. Thực thi Hybrid Query: Lọc trước theo phân loại và khoảng giá, sau đó xếp hạng tương đồng
EXPLAIN ANALYZE
SELECT id, name, category_id, price,
       embedding <=> (SELECT embedding FROM query_vectors) AS distance
FROM products
WHERE category_id = 5 AND price BETWEEN 100 AND 200
ORDER BY embedding <=> (SELECT embedding FROM query_vectors)
LIMIT 10;`,
    parameters: [
      { name: "Composite B-tree", desc: "Chỉ mục kết hợp trên (category_id, price) giúp thu hẹp tập ứng viên xuống trước khi tính khoảng cách vector." }
    ],
    examTip: "⭐ AI-200: PostgreSQL có khả năng kết hợp Bitmap Index Scan từ B-tree với Vector Distance Sort, hoặc áp dụng Filter trực tiếp trên Index Scan.",
    simulatedOutput: `CREATE INDEX
CREATE INDEX
Limit  (cost=120.40..120.43 rows=10 width=56) (actual time=1.420..1.425 rows=10 loops=1)
  ->  Sort ... (actual time=1.418..1.420 rows=10 loops=1)
        Sort Key: ((products.embedding <=> $0))
        ->  Bitmap Heap Scan on products  (cost=4.80..85.20 rows=480 width=56) (actual time=0.150..0.890 rows=512 loops=1)
              Recheck Cond: ((category_id = 5) AND (price >= 100) AND (price <= 200))
              ->  Bitmap Index Scan on idx_products_category_price  (cost=0.00..4.68 rows=480 width=0) (actual time=0.090..0.091 rows=512 loops=1)
Execution Time: 1.510 ms`
  },

  // ==========================================
  // 7. AI AGENT MEMORY & CHECKPOINTS
  // ==========================================
  {
    id: "pg-agent-schema",
    category: "agent",
    title: "13. Thiết kế Schema Bộ nhớ AI Agent (Conversations & Messages)",
    summary: "Cấu trúc cơ sở dữ liệu quan hệ cho phép AI Agent lưu trữ phiên hội thoại dài hạn, lịch sử tin nhắn và metadata dạng JSON.",
    sql: `-- 1. Bảng lưu trữ phiên hội thoại
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    session_id UUID NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Bảng lưu trữ chi tiết các tin nhắn trong hội thoại
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant', 'tool')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Tạo index tìm kiếm nhanh lịch sử hội thoại
CREATE INDEX IF NOT EXISTS idx_messages_conv_created ON messages (conversation_id, created_at DESC);`,
    parameters: [
      { name: "JSONB", desc: "Định dạng JSON nhị phân hiệu năng cao của PostgreSQL, cho phép lưu trữ siêu dữ liệu linh hoạt (model, tokens, tool_calls)." },
      { name: "ON DELETE CASCADE", desc: "Tự động xóa sạch tin nhắn khi phiên hội thoại bị hủy." }
    ],
    examTip: "Kiến trúc Agent Memory chuẩn mực: Tách biệt session, tin nhắn có thứ tự thời gian và lưu vết tool invocation trong metadata.",
    simulatedOutput: `CREATE TABLE
CREATE TABLE
CREATE INDEX`
  },
  {
    id: "pg-agent-checkpoints",
    category: "agent",
    title: "14. Bảng Checkpoint Trạng thái Tác vụ với Atomic Upsert",
    summary: "Cơ chế lưu vết trạng thái tác vụ của Agent với cú pháp Idempotent ON CONFLICT DO UPDATE.",
    sql: `-- Bảng lưu trữ checkpoint của các tác vụ dài hạn
CREATE TABLE IF NOT EXISTS task_checkpoints (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    checkpoint_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_conv_task UNIQUE (conversation_id, task_name)
);

-- Cú pháp Upsert nguyên tử (Atomic Checkpoint Save):
INSERT INTO task_checkpoints (conversation_id, task_name, status, checkpoint_data)
VALUES (1, 'research_postgresql', 'in_progress', '{"step": 2, "sources_found": 3, "next": "summarize"}'::jsonb)
ON CONFLICT (conversation_id, task_name)
DO UPDATE SET
    status = EXCLUDED.status,
    checkpoint_data = EXCLUDED.checkpoint_data,
    updated_at = CURRENT_TIMESTAMP
RETURNING id, updated_at;`,
    parameters: [
      { name: "ON CONFLICT ... DO UPDATE", desc: "Nếu cặp (conversation_id, task_name) đã tồn tại thì cập nhật nội dung checkpoint mới; nếu chưa có thì chèn mới." },
      { name: "EXCLUDED", desc: "Bảng ảo chứa dữ liệu mới được truyền vào mệnh đề VALUES." }
    ],
    examTip: "⭐ Checkpoint giúp Agent phục hồi chính xác điểm dừng sau sự cố hoặc tiếp tục tác vụ mà không bị lặp lại các bước tốn token.",
    simulatedOutput: `CREATE TABLE
 id |          updated_at           
----+-------------------------------
  1 | 2026-10-30 20:30:15.123456+00
(1 row)
INSERT 0 1`
  },

  // ==========================================
  // 8. PSQL & ENTRA ID CONNECTION
  // ==========================================
  {
    id: "pg-connect-psql-token",
    category: "connect",
    title: "15. Kết nối psql Sử dụng Microsoft Entra Token & SSL",
    summary: "Cách thức kết nối dòng lệnh psql bằng biến môi trường PGPASSWORD nhận token JWT từ Azure CLI.",
    sql: `-- Trong PowerShell:
# 1. Lấy access token ngắn hạn (thời hạn ~1 giờ):
$env:PGPASSWORD = az account get-access-token --resource-type oss-rdbms --query accessToken -o tsv

# 2. Kết nối bằng psql với cờ sslmode=require bắt buộc:
psql "host=$env:DB_HOST port=5432 dbname=$env:DB_NAME user=$env:DB_USER sslmode=require"

-- Kiểm tra người dùng hiện tại trong phiên psql:
SELECT current_user, session_user, current_database();`,
    parameters: [
      { name: "sslmode=require", desc: "Bắt buộc mã hóa đường truyền TLS/SSL, là yêu cầu an ninh mặc định của Azure PostgreSQL Flexible Server." },
      { name: "PGPASSWORD", desc: "Biến môi trường chuẩn của PostgreSQL chứa mật khẩu hoặc Entra ID Bearer token." }
    ],
    examTip: "⭐ AI-200: Không dùng user password tĩnh; token JWT từ Entra ID tự động hết hạn giúp loại bỏ rủi ro bảo mật dài hạn.",
    simulatedOutput: `psql (16.2)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384)
Type "help" for help.

postgres=> SELECT current_user, session_user, current_database();
    current_user     |    session_user    | current_database 
---------------------+--------------------+------------------
 dugle1605@gmail.com | dugle1605@gmail.com| postgres
(1 row)`
  }
];

export const POSTGRES_INDEX_COMPARISON = [
  {
    feature: "Thuật toán cốt lõi",
    seqScan: "Quét tuần tự & tính khoảng cách toàn bộ vector",
    ivfflat: "Phân cụm Voronoi k-means (Inverted Lists)",
    hnsw: "Đồ thị lân cận nhiều tầng (Navigable Graph)"
  },
  {
    feature: "Thời gian xây dựng (Build Time)",
    seqScan: "0s (Không cần tạo)",
    ivfflat: "Nhanh (~5-10s cho 100k vector)",
    hnsw: "Lâu hơn (~30-60s cho 100k vector)"
  },
  {
    feature: "Tốc độ truy vấn (Query Speed)",
    seqScan: "Rất chậm (~200-500ms)",
    ivfflat: "Nhanh (~10-25ms tùy probes)",
    hnsw: "Cực nhanh (< 5ms)"
  },
  {
    feature: "Dung lượng bộ nhớ RAM",
    seqScan: "Thấp nhất (Chỉ tốn lúc đọc bảng)",
    ivfflat: "Thấp (Lưu tâm cụm & index phẳng)",
    hnsw: "Cao hơn (Lưu trữ đồ thị nhiều tầng)"
  },
  {
    feature: "Độ chính xác (Recall out-of-box)",
    seqScan: "100% (Exact k-NN tuyệt đối)",
    ivfflat: "Khá (Cần tinh chỉnh ivfflat.probes)",
    hnsw: "Rất cao (95-99%+ với cấu hình mặc định)"
  },
  {
    feature: "Cập nhật dữ liệu mới (Incremental)",
    seqScan: "Tự động hỗ trợ",
    ivfflat: "Kém (Cần REINDEX khi dữ liệu thay đổi nhiều)",
    hnsw: "Tuyệt vời (Hỗ trợ chèn tăng dần liên tục)"
  },
  {
    feature: "Khuyến nghị ứng dụng AI-200",
    seqScan: "Chỉ dùng cho bảng cực nhỏ (< 1,000 dòng)",
    ivfflat: "Bộ nhớ hạn chế, dữ liệu ít thay đổi",
    hnsw: "Chuẩn Production cho ứng dụng AI, RAG, Chatbot"
  }
];

export const POSTGRES_OPERATOR_MATRIX = [
  {
    operator: "<=>",
    name: "Cosine Distance (Khoảng cách Cosine)",
    formula: "1 - (u . v) / (||u|| * ||v||)",
    range: "[0, 2] (0: đồng nhất, 2: đối cực)",
    opClass: "vector_cosine_ops",
    bestFor: "Tìm kiếm ngữ nghĩa (Semantic Search), RAG, văn bản dài ngắn khác nhau."
  },
  {
    operator: "<->",
    name: "L2 Euclidean Distance (Khoảng cách Ơ-clit)",
    formula: "sqrt(sum((u_i - v_i)^2))",
    range: "[0, +∞)",
    opClass: "vector_l2_ops",
    bestFor: "Thị giác máy tính, phân tích cụm khi độ lớn vector mang ý nghĩa."
  },
  {
    operator: "<#>",
    name: "Negative Inner Product (Tích vô hướng âm)",
    formula: "- (u . v)",
    range: "(-∞, +∞)",
    opClass: "vector_ip_ops",
    bestFor: "Vector đã chuẩn hóa L2 (Normalized vectors); tính toán nhanh nhất trên CPU."
  }
];


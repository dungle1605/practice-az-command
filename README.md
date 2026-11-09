# AZ-COMMAND MASTER ⚡

> Nền tảng webapp tương tác luyện tập Azure CLI (`az`) thực chiến dành cho chứng chỉ **Microsoft AI-200** và **Azure DevOps**, xây dựng hoàn toàn từ tài liệu thực hành cốt lõi qua các bài lab: ACR Tasks, App Service Container, Sidecar Containers, Azure Container Apps (ACA), AKS, Cosmos DB Vector Search, Azure Database for PostgreSQL Flexible Server with pgvector, Azure Managed Redis (AMR) with RediSearch, Backend Services Integration (Azure Service Bus, Event Grid, Durable Functions & MCP Server), và Azure Key Vault & App Configuration (Secrets Management, RBAC Data Plane, Label Stacking, Key Vault References & Sentinel Dynamic Refresh).

---

> [!IMPORTANT]
> **CAM KẾT AN TOÀN TUYỆT ĐỐI (100% CLIENT-SIDE SANDBOX SIMULATION)**:
> - Ứng dụng này là môi trường **GIẢ LẬP ĐÀO TẠO THUẦN TÚY TRÊN TRÌNH DUYỆT (OFFLINE FRONTEND)**.
> - **HOÀN TOÀN KHÔNG thực thi lệnh** lên hệ điều hành hay terminal thật trên máy tính của bạn.
> - **HOÀN TOÀN KHÔNG kết nối hay gửi lệnh** đến tài khoản Microsoft Azure thật (không tạo tài nguyên, không phát sinh chi phí, không cần đăng nhập tài khoản thực).
> - Mọi thao tác gõ lệnh chỉ được phân tích cú pháp bằng Javascript (`commandValidator.js`) để chấm điểm và hiển thị dữ liệu kết quả mô phỏng (Mock Data).

---

## 🌟 Điểm nổi bật của Ứng dụng

1. **Lộ trình phân cấp độ tăng dần (12 Levels Progression - 153 bài thực hành CLI)**:
   - **Level 1: Nhập môn & Môi trường (6 bài)**: Đăng nhập Headless (`az login --use-device-code`), đăng ký Resource Provider (`Microsoft.ContainerRegistry`, `Microsoft.Web`), nạp biến môi trường tự động (`. .\.env.ps1`), gán biến thủ công (`$env:ACR_NAME="..."`), cấu hình Resource Group mặc định (`az config set defaults.group`).
   - **Level 2: Azure Container Registry (7 bài)**: Build Image trên Cloud qua ACR Tasks (`az acr build`), chạy thử container Smoke Test (`az acr run`), liệt kê Repository & Tags, kiểm tra Digest SHA256 (`az acr manifest list-metadata`), khóa Image Bất biến (`--write-enabled false`), xem lịch sử build (`az acr task list-runs`).
   - **Level 3: App Service & Container Web App (5 bài)**: Tạo App Service Plan Linux gói `P0v3`, tạo Web App từ container image, cập nhật Container Settings (`az webapp config container set`), trích xuất URL sạch (`--query defaultHostName -o tsv`), xem Log trực tiếp thời gian thực (`az webapp log tail`).
   - **Level 4: Bảo mật RBAC & App Settings (9 bài)**: Bật System-Assigned Managed Identity, lấy Principal ID & Scope ID bằng JMESPath (`-o tsv`), phân quyền đặc quyền tối thiểu `AcrPull`, cấu hình Web App xác thực kéo image bằng Managed Identity, cấu hình cổng runtime `WEBSITES_PORT=8000` & Storage, bật Always-On, bật Container Logging ra filesystem, lọc bảng dữ liệu bằng JMESPath Multi-hash Projection `[].{Setting:name, Value:value}`.
   - **Level 5: Sidecar Containers (Bài Lab 3 Nâng cao - 4 bài)**: Mô hình Multi-container Pod, áp dụng cấu hình Sidecar từ file JSON `sitecontainers-spec.json`, liệt kê các container trong Pod, xem luồng log độc lập của Sidecar container (`model-server`), kiểm tra trạng thái sức khỏe (Health Status).
   - **Level 6: Azure Container Apps (ACA) - Quản lý, Giám sát & Chẩn đoán lỗi (32 bài)**:
     - *Phần A (6 bài)*: Quản lý Revisions & Cập nhật Image mới bằng Digest SHA256 (`az containerapp update --image ...@sha256:...`), xác minh cấu hình containers sau update, liệt kê Revisions (`revision list -o table`), xem chi tiết Revision (`revision show`), vô hiệu hóa Revision lỗi (`revision deactivate` để giữ lại bằng chứng), lọc nhanh Active & Health State bằng JMESPath Projection `[].{name:name,active:properties.active,health:properties.healthState}`.
     - *Phần B (3 bài)*: Quản lý Vòng đời (Lifecycle) gồm Dừng App (`stop`), Khởi động App (`start`), và Restart App (`restart` để dọn dẹp lỗi tạm thời mà không tạo revision mới).
     - *Phần C (6 bài)*: Chẩn đoán & Sửa lỗi (Troubleshooting) gồm Log Streaming thời gian thực (`logs show --follow`), chẩn đoán thiếu biến môi trường (`--query properties.template.containers[0].env -o table`), mô phỏng sự cố xóa biến môi trường (`--remove-env-vars`), sửa lỗi thêm lại biến môi trường (`--set-env-vars`), chẩn đoán sai cổng Ingress (`--query properties.configuration.ingress -o yaml`), sửa lỗi Target Port (`az containerapp ingress update --target-port`).
     - *Phần D (3 bài)*: Truy vấn Log Analytics gồm trích xuất Workspace ID (`customerId`) với `-o tsv`, truy vấn 20 log gần nhất qua ngôn ngữ KQL từ bảng `ContainerAppConsoleLogs_CL`, và lọc log chứa lỗi với toán tử KQL `contains 'error'`.
     - *Phần E (1 bài)*: Cấu hình Health Probes từ lý thuyết Module (`--query properties.template.containers[0].probes -o yaml`), hiểu rõ sự khác biệt giữa Liveness Probe và Readiness Probe.
     - *Phần F (3 bài - Bổ sung Lab 1 ACA)*: Khởi tạo Container App với Managed Identity & Secrets gồm tạo Container App với System Managed Identity & tự động gán quyền AcrPull (`--registry-identity system`), tạo secret mã hóa trong kho (`az containerapp secret set`), và tham chiếu secret qua biến môi trường (`--set-env-vars ENV=secretref:<secret-name>`).
     - *Phần G (4 bài - Bổ sung Lab 1 ACA)*: Xác minh Deployment gồm trích xuất FQDN sạch (`$FQDN = az containerapp show ... -o tsv`), gọi health endpoint (`Invoke-RestMethod -Uri "https://$FQDN/health"`), gọi root endpoint kiểm tra secret (`Invoke-RestMethod -Uri "https://$FQDN/"`), và test document processing endpoint (`Invoke-RestMethod ... -Body (Get-Content -Raw document.txt)`).
     - *Phần H (3 bài - Bổ sung Lab 1 ACA)*: Troubleshooting chuyên sâu gồm kiểm tra System Managed Identity đã bật (`az containerapp identity show`), liệt kê xác nhận secrets đã tạo (`az containerapp secret list -o table`), và stream logs real-time chẩn đoán lỗi khởi động (`az containerapp logs show -n <app-name> -g <rg> --follow`).
     - *Phần I (3 bài - Bổ sung Lab Dynamic Sessions)*: AI Code Interpreter & Sandboxing gồm cài đặt extension preview (`az extension add --name containerapp --upgrade --allow-preview true --yes`), khởi tạo Session Pool cô lập mạng (`az containerapp sessionpool create ... --network-status EgressDisabled`), và phân quyền thực thi sandbox cho AI Agent (`az role assignment create --role "Azure ContainerApps Session Executor"`).
   - **Level 7: Azure Kubernetes Service (AKS) - Cấu hình nâng cao (15 bài)**:
     - *Phần A (5 bài - kubectl cơ bản)*: Lấy credentials AKS (`az aks get-credentials`), kiểm tra Deployment & Service (`kubectl get deploy,svc`), kiểm tra rollout (`kubectl rollout status`), liệt kê pods (`kubectl get pods`), xem log pod (`kubectl logs <pod-name>`).
     - *Phần B (4 bài - ConfigMap)*: Tạo ConfigMap từ YAML (`kubectl apply -f k8s/configmap.yaml`), xem ConfigMap (`kubectl get configmap`), mô tả chi tiết (`kubectl describe configmap`), rolling restart để nạp lại cấu hình (`kubectl rollout restart deployment`).
     - *Phần C (3 bài - Secrets)*: Tạo Secret từ YAML (`kubectl apply -f k8s/secrets.yaml`), xem Secret (`kubectl get secrets`), decode Secret base64 (`kubectl get secret -o jsonpath`).
     - *Phần D (3 bài - PersistentVolumeClaim)*: Tạo PVC từ YAML (`kubectl apply -f k8s/pvc.yaml`), kiểm tra trạng thái PVC (`kubectl get pvc`), xem chi tiết PVC (`kubectl describe pvc`).
   - **Level 8: Azure Cosmos DB Vector Search, RAG Store & Index Optimization (15 bài)**:
     - *Phần A (3 bài - Pre-flight & Khởi tạo)*: Kiểm tra tính duy nhất toàn cầu của tên tài khoản (`az cosmosdb check-name-exists`), tạo tài khoản Cosmos DB NoSQL Serverless kích hoạt Vector Search (`--capabilities EnableServerless EnableNoSQLVectorSearch --default-consistency-level Session`), xác minh capabilities đã kích hoạt (`--query "capabilities[].name" -o tsv`).
     - *Phần B (7 bài - Database, Vector, RAG & Optimized Index Containers)*: Tạo Database NoSQL (`az cosmosdb sql database create --name vectorstore`), tạo Container với Partition Key `/documentId`, chính sách DiskANN Indexing loại trừ `/embedding/*` khỏi B-tree và Vector Embedding Policy 256 chiều Cosine (`az cosmosdb sql container create ... --idx @indexing-policy.json --vector-embeddings @embedding-policy.json`), tạo RAG Chunks Container tối ưu Single-Partition Query (`az cosmosdb sql container create --database-name ragstore --name chunks --partition-key-path /documentId`), liệt kê các container trong Database (`az cosmosdb sql container list -o table`), kiểm tra cấu hình throughput RU/s của container (`az cosmosdb sql container throughput show`), tạo container với vector index `quantizedFlat` nén bộ nhớ (`az cosmosdb sql container create --database-name indexoptimize --name vectors-quantized ...`), và trích xuất cấu hình vectorIndexes bằng JMESPath (`az cosmosdb sql container show --query "indexingPolicy.vectorIndexes"`).
     - *Phần C (4 bài - Bảo mật RBAC Hai Lớp & SDK)*: Trích xuất Resource ID sạch (`$COSMOS_ID = ...`), phân quyền ARM Contributor tầng Control Plane (`az role assignment create --role Contributor`), phân quyền Data Plane tầng NoSQL (`az cosmosdb sql role assignment create --role-definition-name "Cosmos DB Built-in Data Contributor"`), lấy Document Endpoint sạch (`$COSMOS_ENDPOINT = ...`).
     - *Phần D (1 bài - Dọn dẹp tài nguyên)*: Xóa tài khoản Cosmos DB với cờ xác nhận tự động (`az cosmosdb delete --yes`).
   - **Level 9: Azure Database for PostgreSQL Flexible Server & pgvector (15 bài)**:
     - *Phần A (3 bài - Khởi tạo & Provider)*: Đăng ký resource provider `Microsoft.DBforPostgreSQL`, tạo Flexible Server Burstable B1ms PostgreSQL 16 kích hoạt Microsoft Entra auth (`az postgres flexible-server create ...`), kiểm tra trạng thái máy chủ (`properties.state` -o tsv).
     - *Phần B (5 bài - Bảo mật Zero-Trust & Network)*: Thiết lập Microsoft Entra Administrator (`az postgres flexible-server microsoft-entra-admin create`), liệt kê Entra admins, vô hiệu hóa mật khẩu tĩnh Enforce Entra-only (`--password-auth Disabled`), cấu hình Firewall Rule `AllowAll` cho kết nối lab, liệt kê firewall rules.
     - *Phần C (3 bài - Tiện ích pgvector & Token)*: Cho phép extension `vector` trong tham số server `azure.extensions` (`az postgres flexible-server parameter set --name azure.extensions --value vector`), xác minh tham số bằng JMESPath, lấy temporary Bearer Access Token cho database OSS RDBMS (`az account get-access-token --resource-type oss-rdbms`).
     - *Phần D (4 bài - Database, Bảo trì & Dọn dẹp)*: Tạo database chuyên biệt `agent_memory`, liệt kê databases trên máy chủ, khởi động lại server áp dụng cấu hình (`restart`), xóa máy chủ giải phóng tài nguyên (`delete --yes`).
   - **Level 10: Azure Managed Redis (AMR) & RediSearch Vector (15 bài)**:
     - *Phần A (3 bài - Resource Provider & Enterprise Cluster)*: Đăng ký `Microsoft.Cache`, tạo Azure Managed Redis Cluster SKU `Enterprise_E10` với cờ `--no-database` (quy trình 2 bước chuẩn Enterprise), kiểm tra trạng thái cluster (`provisioningState` -o tsv).
     - *Phần B (4 bài - Database Cổng 10000 TLS & Phân Quyền Entra ID)*: Tạo Database mặc định `default` với `--client-protocol Encrypted`, cổng `10000`, chính sách `EnterpriseCluster` và `VolatileLRU`, kiểm tra trạng thái database, tạo `access-policy-assignment` gán quyền `default` cho User/Principal Object ID, xác minh trạng thái assignment.
     - *Phần C (3 bài - Lấy Endpoint & Quản Trị Khóa)*: Lấy FQDN Hostname sạch (`<name>.<region>.redisenterprise.cache.azure.net`), liệt kê access policy assignments dạng table, cập nhật chính sách giải phóng bộ nhớ (`--eviction-policy AllKeysLRU`).
     - *Phần D (5 bài - Bảo Trì, Projection & Dọn Dẹp)*: Xóa sạch dữ liệu cache bằng `database flush --yes`, cưỡng chế hủy liên kết phân mảnh nút với `database force-unlink`, trích xuất tóm tắt cluster bằng Multi-hash Projection `"{sku:sku.name, host:hostName, status:provisioningState, redisVersion:redisVersion}"`, xóa database mặc định, và xóa cluster giải phóng tài nguyên.
   - **Level 11: Backend Services Integration (Service Bus, Event Grid & Functions) (15 bài)**:
     - *Phần A (4 bài - Providers, Service Bus Namespace & Queue DLQ)*: Đăng ký `Microsoft.ServiceBus` và `Microsoft.EventGrid`, tạo Service Bus Namespace Standard (`az servicebus namespace create`), tạo Queue `inference-requests` với `--max-delivery-count 5` và tự động chuyển tin nhắn hết hạn vào Dead-Letter Queue (`--enable-dead-lettering-on-message-expiration true`).
     - *Phần B (5 bài - Topic Pub/Sub, SQL Filters & Phân Quyền Entra ID)*: Tạo Topic `inference-results`, tạo Subscription `high-priority`, xóa quy tắc mặc định `$Default` (`rule delete`), tạo bộ lọc SQL `high-priority-filter` với `--filter-sql-expression "priority = 'high'"`, và phân quyền vai trò Data Plane `Azure Service Bus Data Owner` cho User OID.
     - *Phần C (4 bài - Event Grid Namespaces, CloudEvents & Pull Delivery)*: Khởi tạo Event Grid Namespace thế hệ mới (`--sku "{name:standard,capacity:1}"`), tạo Namespace Topic với định dạng CNCF CloudEvents (`--input-schema CloudEventSchemaV1_0`), tạo Subscription chế độ Queue Pull Delivery kết hợp bộ lọc (`--delivery-configuration "{deliveryMode:Queue,...}"` và `--filters-configuration "{includedEventTypes:['com.contoso.ai.ContentFlagged']}"`), phân quyền `EventGrid Data Receiver`.
     - *Phần D (2 bài - Serverless Compute & MCP Server Host)*: Khởi tạo Azure Function App Python 3.11 v4 trên Linux (`az functionapp create ... --os-type Linux`), và trích xuất FQDN Hostname sạch (`defaultHostName` -o tsv) để cấu hình endpoint SSE cho AI Assistants.
   - **Level 12: Azure Key Vault & App Configuration (Secrets, Labels & Sentinel Refresh) (15 bài)**:
     - *Phần A (4 bài - Providers, Key Vault RBAC & Secret Set)*: Đăng ký `Microsoft.AppConfiguration` & `Microsoft.KeyVault`, tạo Azure Key Vault với cờ `--enable-rbac-authorization true`, phân quyền vai trò `Key Vault Secrets Officer`, lưu trữ secret OpenAI API Key kèm `--content-type application/x-api-key`.
     - *Phần B (4 bài - Connection String Secret, URIs & Versioning)*: Lưu trữ chuỗi kết nối Cosmos DB, trích xuất URI Secret Identifier sạch (`--query id -o tsv`), liệt kê các phiên bản lịch sử của secret (`az keyvault secret list-versions`), và tạo App Configuration Store SKU Standard (`az appconfig create --sku Standard`).
     - *Phần C (4 bài - App Config Data Owner, Label Stacking & References)*: Phân quyền `App Configuration Data Owner`, thiết lập khóa cấu hình mặc định không nhãn (`OpenAI:Endpoint`), thiết lập khóa ghi đè cho Production với `--label Production`, tạo liên kết Key Vault Reference (`az appconfig kv set-keyvault --secret-identifier $SECRET_URI`).
     - *Phần D (3 bài - Dynamic Refresh, Sentinel Key & Purge)*: Khởi tạo khóa canh gác `Sentinel = 1` kích hoạt reload động không cần restart container, gọi `provider.refresh()` nguyên tử, và xóa vĩnh viễn (purge) Key Vault đã soft-deleted để giải phóng tên DNS toàn cầu.

2. **Bốn Tab Chuyên Biệt Về Dữ Liệu, Vector, Backend & Bảo Mật**:
   - **`🐘 PostgreSQL & pgvector`**: Cẩm nang SQL tương tác 15 câu lệnh chuyên sâu, ma trận so sánh HNSW vs IVFFlat, và SQL Simulator đo đạc độ trễ và Recall.
   - **`🔴 Azure Managed Redis & RediSearch`**: Cẩm nang 15 câu lệnh RediSearch HNSW, TLS cổng 10000, 6 chính sách Maxmemory Eviction, và Redis Terminal Simulator.
   - **`⚡ Backend & AI Workflows`**: Cẩm nang Tích Hợp 15 kỹ thuật (Service Bus Peek-Lock vs DLQ, CloudEvents Pull Delivery, Durable Functions HITL & MCP Server), ma trận 3 hạ tầng, và Workflow Simulator.
   - **`🔐 Key Vault & App Config`**: Cẩm nang 15 thao tác CLI & SDK, ma trận đối chiếu 4 phương pháp quản lý bí mật & cấu hình, cẩm nang 5 vai trò Entra ID RBAC chuẩn, cùng **Interactive Sentinel Dynamic Refresh & Label Stacking Simulator**.

3. **Bộ lọc Chống nuốt dấu UniKey/EVKey (IME Anti-Ghosting Shield)**:
   - Tự động phát hiện và khôi phục dấu `--` trong thời gian thực khi gõ phím trên bộ gõ tiếng Việt.
   - Tự động mở rộng cờ nhiều ký tự (ví dụ `-use` ➔ `--use`).
   - Tự động khử dấu tiếng Việt trong tên cờ lệnh (ví dụ `--úse` ➔ `--use`).
   - Dropdown gợi ý thông minh IntelliSense ngay tại vị trí con trỏ (nhấn <kbd>Tab ↹</kbd> hoặc click để tự động điền).

4. **Chế độ Trắc nghiệm Toàn diện (78 Câu hỏi tình huống AI-200)**:
   - 78 câu hỏi tình huống thực tế bám sát chuẩn đề thi Microsoft AI-200: ACA, Dynamic Sessions, KQL, AKS, Cosmos DB Vector Search, PostgreSQL pgvector, Azure Managed Redis, Backend Integration (Service Bus, Event Grid, Durable Functions, MCP Server), và Azure Key Vault & App Configuration (Label Stacking, Sentinel Pattern, Key Vault References, RBAC Data Plane vs Access Policies, Soft-delete recovery, Purge protection, và in-memory TTL caching chống lỗi 429).
   - Phản hồi giải thích chi tiết ngay lập tức cho từng lựa chọn.

5. **Kho Python Snippets Sản xuất (20 Snippets hoàn chỉnh)**:
   - Đầy đủ 20 module script độc lập: Dynamic Sessions Client, Tool Calling, Managed Identity Token, Event Hubs, Cosmos DB Vector Container Setup, Vector Search Engine, Cosmos RAG Query Engine, Vector Index Benchmarking, Azure PostgreSQL pgvector & Entra ID Auth, PostgreSQL Vector Benchmark Engine, PostgreSQL AI Agent Memory Backend, Azure Managed Redis Caching & Entra ID, Real-Time Pub/Sub Event Streaming, RediSearch HNSW Vector Similarity Search, Azure Functions MCP Server, Durable Functions AI Workflow Orchestrator, Event Grid Namespaces CloudEvents Pipeline, Service Bus AI Messaging Pipeline, **Azure App Configuration Provider with Label Stacking & Sentinel Refresh**, và **Azure Key Vault SecretClient with In-Memory TTL Caching**.

6. **Cẩm nang tra cứu tích hợp theo Chủ đề (Categorized Live Cheatsheet - 13 Sections / 148 lệnh)**:
   - **Phân loại thành 7 Tab Chủ đề bên trong**:
     - `🌟 Tất cả chủ đề`: Toàn bộ 13 phần cẩm nang tra cứu và tìm kiếm toàn diện.
     - `⭐ Mẹo Thi AI-200`: 4 nguyên tắc vàng và các mẹo phòng thi thực chiến.
     - `🐳 Container & Nền Tảng`: Level 1 đến Level 5 (Azure CLI, ACR, Web App, RBAC, Sidecar).
     - `☁️ Container Apps & AKS`: Level 6 & Level 7 (ACA microservices, Dynamic Sessions sandbox, KQL, Kubernetes AKS).
     - `🧠 CSDL & Vector Search`: Level 8 đến Level 10 (Cosmos DB Vector, PostgreSQL pgvector, Managed Redis RediSearch).
     - `⚡ Backend & AI Workflows`: Level 11 (Service Bus, Event Grid CloudEvents Pull, Durable Functions & MCP Server).
     - `🔐 Bảo Mật & App Config`: Level 12 (Key Vault Secrets, RBAC Data Plane, App Config Label Stacking & Sentinel Dynamic Refresh).
   - **Thanh Sticky Header Cố Định Ở Đỉnh**: Luôn ghim ở đầu màn hình khi cuộn chuột qua danh sách dài, hỗ trợ chuyển đổi chủ đề bất kỳ lúc nào.
   - **Thanh Sub-Level Pills**: Lọc nhanh chính xác từng Level cụ thể trong chủ đề đang chọn.
   - **Thu gọn / Mở rộng (Accordion)**: Tùy biến mở/đóng từng section hoặc toàn bộ để giao diện gọn gàng.
   - **Tìm kiếm thời gian thực (Scoped Live Search)** & Nút sao chép 1 chạm cho mọi đoạn mã.

---

## 🚀 Cách khởi chạy ứng dụng

Ứng dụng hiện đang chạy trên máy của bạn tại:
👉 **[http://localhost:5173/](http://localhost:5173/)**

Để khởi động lại dev server trong các phiên làm việc sau, chỉ cần mở terminal tại thư mục dự án và chạy:

```powershell
npm run dev
```

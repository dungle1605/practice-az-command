# TỔNG HỢP CÂU LỆNH AZURE CLI THỰC CHIẾN (MICROSOFT AI-200)

> Tài liệu tra cứu toàn diện các câu lệnh Azure CLI (`az`) thực hành qua 8 cấp độ (ACR, App Service, RBAC, Sidecar, Container Apps, Dynamic Sessions, AKS & Azure Cosmos DB Vector Search).

---

## 🌟 4 Mẹo Phòng Thi AI-200 Cốt Lõi

1. **Dùng `-o tsv` khi cần chuỗi sạch (Clean String Extraction)**:
   ```powershell
   $PRINCIPAL_ID = az webapp identity show --name $env:APP_NAME --query principalId -o tsv
   $ACR_ID = az acr show --name $env:ACR_NAME --query id -o tsv
   $FQDN = az containerapp show -n <app-name> -g <rg> --query properties.configuration.ingress.fqdn -o tsv
   ```
   *Tránh lỗi cú pháp do thừa hai dấu ngoặc kép khi gán vào biến hoặc endpoint.*

2. **`--write-enabled false`: Khóa Image Bất Biến (Immutability)**:
   ```powershell
   az acr repository update --name $env:ACR_NAME --image inference-api:v1.0.0 --write-enabled false
   ```
   *Lệnh 'một đi không trở lại' bảo vệ các bản build Production chống bị ghi đè hoặc xóa nhầm.*

3. **JMESPath Multi-hash Projection: Lọc Bảng Gọn Gàng**:
   ```powershell
   az webapp config appsettings list --name $env:APP_NAME --query "[].{Setting:name, Value:value}" -o table
   az containerapp revision list -n <app-name> -g <rg> --query "[].{name:name,active:properties.active,health:properties.healthState}" -o table
   ```

4. **Nguyên Tắc Đặc Quyền Tối Thiểu (Least Privilege) với Managed Identity**:
   - Web App pull image từ ACR: gán vai trò `AcrPull`.
   - AI Agent gọi Dynamic Sessions: gán vai trò `Azure ContainerApps Session Executor`.
   - Tuyệt đối không dùng admin user tĩnh (`--admin-enabled false`).

---

## Level 1: Nhập Môn & Môi Trường (Setup)

| Câu lệnh | Giải thích | Mục đích |
|---|---|---|
| `az login --use-device-code` | Đăng nhập qua mã 8 ký tự | Dùng cho môi trường headless/Cloud Shell |
| `az provider register --namespace Microsoft.ContainerRegistry` | Đăng ký Resource Provider ACR | Kích hoạt dịch vụ registry |
| `az provider register --namespace Microsoft.Web` | Đăng ký Resource Provider Web App | Kích hoạt dịch vụ App Service |
| `. .\.env.ps1` | Dot-sourcing nạp biến môi trường | Giữ biến trong phiên shell hiện tại |
| `$env:ACR_NAME = "acr9e9994d6"` | Gán biến môi trường thủ công | Định nghĩa biến tái sử dụng trong PowerShell |
| `az config set defaults.group=rg-ai200-acr-lab` | Đặt Resource Group mặc định | Bỏ qua cờ `--resource-group` ở các lệnh sau |

---

## Level 2: Azure Container Registry (ACR & Tasks)

| Câu lệnh | Giải thích | Mục đích |
|---|---|---|
| `az acr build --registry $env:ACR_NAME --image inference-api:v1.0.0 .` | Build image trực tiếp trên Cloud | Không cần cài đặt Docker local |
| `az acr run --registry $env:ACR_NAME --cmd "$env:ACR_NAME.azurecr.io/inference-api:v1.0.0 python -c 'import app; print(\"OK\")'" /dev/null` | Smoke Test container độc lập | Kiểm tra logic code trước khi deploy |
| `az acr repository list --name $env:ACR_NAME -o table` | Liệt kê danh sách repositories | Kiểm tra kho ảnh |
| `az acr repository show-tags --name $env:ACR_NAME --repository inference-api -o table` | Liệt kê các tags của repository | Kiểm tra các phiên bản tag |
| `az acr manifest list-metadata --registry $env:ACR_NAME --name inference-api -o table` | Xem Digest SHA256 và kích thước image | Xác minh tính toàn vẹn nhị phân |
| `az acr repository update --name $env:ACR_NAME --image inference-api:v1.0.0 --write-enabled false` | Đóng băng tag image (Bất biến) | Chống push đè và xóa nhầm |
| `az acr task list-runs --registry $env:ACR_NAME -o table` | Xem lịch sử thực thi ACR Tasks | Kiểm tra log và trạng thái build |

---

## Level 3: App Service & Container Web App

| Câu lệnh | Giải thích | Mục đích |
|---|---|---|
| `az appservice plan create --name $env:APP_PLAN --resource-group $env:RESOURCE_GROUP --sku P0v3 --is-linux` | Tạo App Service Plan Linux | Cung cấp tài nguyên compute Premium |
| `az webapp create --name $env:APP_NAME --plan $env:APP_PLAN --resource-group $env:RESOURCE_GROUP --deployment-container-image-name "$env:ACR_NAME.azurecr.io/inference-api:v1.0.0"` | Tạo Web App từ Container Image | Khởi tạo web app chạy image |
| `az webapp config container set --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --docker-custom-image-name "$env:ACR_NAME.azurecr.io/inference-api:v1.0.0"` | Cập nhật image cho container | Đổi phiên bản hoặc sửa cấu hình |
| `$APP_URL = az webapp show --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --query defaultHostName -o tsv` | Lấy URL sạch của Web App | Gán vào biến kiểm thử |
| `az webapp log tail --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP` | Luồng nhật ký thời gian thực | Theo dõi stdout/stderr của app |

---

## Level 4: Bảo Mật RBAC & App Settings

| Câu lệnh | Giải thích | Mục đích |
|---|---|---|
| `az webapp identity assign --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP` | Bật System-Assigned Managed Identity | Cấp danh tính Entra ID cho Web App |
| `$PRINCIPAL_ID = az webapp identity show --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --query principalId -o tsv` | Trích xuất Principal ID sạch | Lấy ID định danh của app |
| `$ACR_ID = az acr show --name $env:ACR_NAME --resource-group $env:RESOURCE_GROUP --query id -o tsv` | Lấy Resource ID đầy đủ của ACR | Xác định phạm vi (scope) RBAC |
| `az role assignment create --assignee $PRINCIPAL_ID --scope $ACR_ID --role AcrPull` | Phân quyền tối thiểu AcrPull | Cho phép Web App kéo image từ ACR |
| `az webapp config set --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --acr-use-identity true --acr-identity "[system]"` | Bật xác thực qua Managed Identity | Kéo image không cần username/password |
| `az webapp config appsettings set --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --settings WEBSITES_PORT="8000" WEBSITES_ENABLE_APP_SERVICE_STORAGE=false` | Cấu hình cổng và tắt storage chia sẻ | Điều hướng traffic tới cổng 8000 |
| `az webapp config set --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --always-on true` | Bật chế độ Always-On | Triệt tiêu Cold Start cho AI API |
| `az webapp log config --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --docker-container-logging filesystem` | Bật lưu log container ra filesystem | Ghi nhận log để chẩn đoán |
| `az webapp config appsettings list --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --query "[].{Setting:name, Value:value}" -o table` | Lọc bảng cài đặt bằng JMESPath | Hiển thị 2 cột Setting và Value |

---

## Level 5: Sidecar Containers (Lab 3)

| Câu lệnh | Giải thích | Mục đích |
|---|---|---|
| `az webapp sitecontainers create --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --sitecontainers-spec-file ./sitecontainers-spec.json` | Nạp cấu hình Sidecar từ file JSON | Triển khai mô hình Multi-container Pod |
| `az webapp sitecontainers list --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP -o table` | Liệt kê danh sách containers trong Pod | Xem container chính và phụ |
| `az webapp log tail --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --container model-server` | Xem log riêng của container Sidecar | Cô lập log của engine ONNX/AI |
| `az webapp sitecontainers status --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP` | Kiểm tra trạng thái sức khỏe Pod | Đảm bảo tất cả containers đều Ready |

---

## Level 6: Azure Container Apps (ACA)

### Phần A: Quản lý Revisions & Cập nhật Image
- Cập nhật image với Digest SHA256:
  `az containerapp update --name <app-name> --resource-group <rg> --image <registry>/<repo>@sha256:<digest>`
- Xác minh cấu hình container:
  `az containerapp show --name <app-name> --resource-group <rg> --query properties.template.containers`
- Liệt kê Revisions dạng bảng:
  `az containerapp revision list --name <app-name> --resource-group <rg> -o table`
- Xem chi tiết Revision:
  `az containerapp revision show --name <app-name> --resource-group <rg> --revision <revision-name>`
- Vô hiệu hóa Revision lỗi (giữ bằng chứng):
  `az containerapp revision deactivate --name <app-name> --resource-group <rg> --revision <revision-name>`
- Lọc Active & Health State bằng JMESPath:
  `az containerapp revision list --name <app-name> --resource-group <rg> --query "[].{name:name,active:properties.active,health:properties.healthState}" -o table`

### Phần B: Quản lý Vòng đời (Lifecycle)
- Dừng app (Scale về 0):
  `az containerapp stop --name <app-name> --resource-group <rg>`
- Khởi động app:
  `az containerapp start --name <app-name> --resource-group <rg>`
- Restart app (không tạo revision mới):
  `az containerapp restart --name <app-name> --resource-group <rg>`

### Phần C: Chẩn đoán & Sửa lỗi (Troubleshooting)
- Log streaming thời gian thực:
  `az containerapp logs show --name <app-name> --resource-group <rg> --follow`
- Kiểm tra danh sách biến môi trường hiện tại:
  `az containerapp show --name <app-name> --resource-group <rg> --query "properties.template.containers[0].env" -o table`
- Xóa biến môi trường để test sự cố:
  `az containerapp update --name <app-name> --resource-group <rg> --remove-env-vars <VAR_NAME>`
- Thêm/cập nhật lại biến môi trường:
  `az containerapp update --name <app-name> --resource-group <rg> --set-env-vars <VAR_NAME>=<value>`
- Kiểm tra cấu hình Ingress targetPort:
  `az containerapp show --name <app-name> --resource-group <rg> --query "properties.configuration.ingress" -o yaml`
- Sửa lại targetPort của Ingress:
  `az containerapp ingress update --name <app-name> --resource-group <rg> --target-port <port>`

### Phần D: Truy vấn Log Analytics (KQL)
- Lấy Workspace ID sạch:
  `az containerapp env show --name <env-name> --resource-group <rg> --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId -o tsv`
- Truy vấn 20 log gần nhất qua KQL:
  `az monitor log-analytics query -w $WORKSPACE_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == '<app-name>' | project TimeGenerated, Log_s | order by TimeGenerated desc | take 20" -o table`
- Lọc log chứa lỗi:
  `az monitor log-analytics query -w $WORKSPACE_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == '<app-name>' and Log_s contains 'error' | order by TimeGenerated desc | take 20" -o table`

### Phần E: Cấu hình Health Probes
- Kiểm tra Liveness & Readiness Probes:
  `az containerapp show --name <app-name> --resource-group <rg> --query "properties.template.containers[0].probes" -o yaml`

### Phần F: Khởi tạo với Managed Identity & Secrets (Lab 1 ACA)
- Tạo Container App với Managed Identity & AcrPull tự động:
  `az containerapp create --name <app-name> --resource-group <rg> --environment <env-name> --image <registry>/<image> --ingress external --target-port <port> --env-vars MODEL_NAME=$MODEL_NAME --registry-server <registry> --registry-identity system`
- Tạo secret mã hóa trong kho ACA:
  `az containerapp secret set -n <app-name> -g <rg> --secrets <secret-name>=<secret-value>`
- Tham chiếu secret vào biến môi trường:
  `az containerapp update -n <app-name> -g <rg> --set-env-vars <ENV_VAR>=secretref:<secret-name>`

### Phần G: Xác minh Deployment (Lab 1 ACA)
- Lấy FQDN sạch:
  `$FQDN = az containerapp show -n <app-name> -g <rg> --query properties.configuration.ingress.fqdn -o tsv`
- Gọi Health Endpoint:
  `Invoke-RestMethod -Uri "https://$FQDN/health"`
- Gọi Root Endpoint:
  `Invoke-RestMethod -Uri "https://$FQDN/"`
- Test Document Processing Endpoint:
  `Invoke-RestMethod -Uri "https://$FQDN/process" -Method Post -ContentType "text/plain" -Body (Get-Content -Raw document.txt)`

### Phần H: Troubleshooting Bổ sung (Lab 1 ACA)
- Kiểm tra trạng thái Managed Identity:
  `az containerapp identity show -n <app-name> -g <rg>`
- Liệt kê secrets đã tạo:
  `az containerapp secret list -n <app-name> -g <rg> -o table`
- Stream logs thời gian thực:
  `az containerapp logs show -n <app-name> -g <rg> --follow`

### Phần I: Azure Container Apps Dynamic Sessions (Lab Dynamic Sessions)
- Cài đặt/nâng cấp extension Container App với cờ preview:
  `az extension add --name containerapp --upgrade --allow-preview true --yes`
- Khởi tạo Session Pool cho Python code interpreter (cô lập mạng hoàn toàn):
  `az containerapp sessionpool create --name <pool-name> --resource-group <rg> --location <region> --container-type PythonLTS --max-sessions 5 --cooldown-period 300 --network-status EgressDisabled`
- Gán vai trò Azure ContainerApps Session Executor cho AI Agent:
  `az role assignment create --assignee <principal-id> --role "Azure ContainerApps Session Executor" --scope <session-pool-id>`

---

## Level 8: Azure Cosmos DB Vector Search & NoSQL

| Câu lệnh | Giải thích | Mục đích |
|---|---|---|
| `az cosmosdb check-name-exists --name $env:COSMOS_ACCOUNT` | Kiểm tra tên tài khoản khả dụng toàn cầu | Tránh lỗi trùng tên endpoint *.documents.azure.com |
| `az cosmosdb create --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --locations regionName=southeastasia --capabilities EnableServerless EnableNoSQLVectorSearch --default-consistency-level Session` | Tạo tài khoản Cosmos DB NoSQL Serverless | Kích hoạt tính năng tìm kiếm Vector và hàm VectorDistance |
| `az cosmosdb show --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --query "capabilities[].name" -o tsv` | Xác minh các capability đã kích hoạt | Đảm bảo tính năng EnableNoSQLVectorSearch đã bật |
| `az cosmosdb sql database create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --name vectorstore` | Tạo Database NoSQL | Vùng chứa logic gom nhóm các container |
| `az cosmosdb sql container create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name vectorstore --name vectors --partition-key-path /documentId --idx @indexing-policy.json --vector-embeddings @embedding-policy.json` | Tạo Container với Vector Embedding & DiskANN Indexing | Lưu trữ embedding và tối ưu tìm kiếm tương đồng trên SSD |
| `az cosmosdb sql container create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name ragstore --name chunks --partition-key-path /documentId` | Tạo Container Chunks cho RAG với Partition Key /documentId | Gom nhóm chunks của 1 document vào 1 partition vật lý |
| `az cosmosdb sql container list --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name ragstore -o table` | Liệt kê các container trong Database NoSQL | Kiểm tra danh sách container và partition key tương ứng |
| `az cosmosdb sql container throughput show --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name ragstore --name chunks` | Kiểm tra cấu hình Throughput (RU/s) của container | Xác minh chế độ Serverless hoặc mức RU được cấp phát |
| `az cosmosdb sql container create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name indexoptimize --name vectors-quantized --partition-key-path /documentId --idx @indexing-policy-quantized.json --vector-embeddings @embedding-policy.json` | Tạo Container với Vector Index quantizedFlat (Nén) | Tiết kiệm RAM cho tập dữ liệu trung bình 10K-100K |
| `az cosmosdb sql container show --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name indexoptimize --name vectors-quantized --query "indexingPolicy.vectorIndexes"` | Trích xuất cấu hình Vector Index bằng JMESPath | Xác minh loại chỉ mục đang hoạt động của container |
| `$COSMOS_ID = az cosmosdb show --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --query id -o tsv` | Trích xuất Resource ID sạch của Cosmos DB | Làm scope cho phân quyền RBAC Control Plane & Data Plane |
| `az role assignment create --assignee $USER_ID --scope $COSMOS_ID --role Contributor` | Phân quyền ARM Contributor (Control Plane) | Cho phép quản lý tài nguyên (tạo/xóa database, container) |
| `az cosmosdb sql role assignment create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --role-definition-name "Cosmos DB Built-in Data Contributor" --principal-id $USER_ID --scope $COSMOS_ID` | Phân quyền Data Plane cho Cosmos DB NoSQL | Cho phép CRUD documents và truy vấn VectorDistance qua Entra ID |
| `$COSMOS_ENDPOINT = az cosmosdb show --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --query documentEndpoint -o tsv` | Lấy Document Endpoint sạch | Cấu hình biến môi trường kết nối SDK Python |
| `az cosmosdb delete --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --yes` | Xóa tài khoản Cosmos DB tự động xác nhận | Dọn dẹp tài nguyên sau khi hoàn thành lab |

---

## Level 9: Azure Database for PostgreSQL Flexible Server & pgvector

| Câu lệnh | Giải thích | Mục đích |
|---|---|---|
| `az provider register --namespace Microsoft.DBforPostgreSQL` | Đăng ký Resource Provider PostgreSQL | Kích hoạt quyền tạo PostgreSQL Flexible Server trên subscription |
| `az postgres flexible-server create --resource-group $env:RG --name $env:PG_SERVER --location $env:LOCATION --sku-name Standard_B1ms --tier Burstable --storage-size 32 --version 16 --public-access Enabled --microsoft-entra-auth Enabled --password-auth Enabled --admin-user pgadmin --admin-password $env:ADMIN_PASSWORD --yes` | Tạo máy chủ PostgreSQL Flexible Server | Cấp phát server phiên bản 16, SKU Burstable B1ms, bật xác thực kép |
| `az postgres flexible-server show --resource-group $env:RG --name $env:PG_SERVER --query properties.state -o tsv` | Kiểm tra trạng thái máy chủ (State) qua JMESPath | Xác nhận server đã sẵn sàng nhận kết nối (Ready) |
| `az postgres flexible-server microsoft-entra-admin create --resource-group $env:RG --server-name $env:PG_SERVER --display-name $env:USER_UPN --object-id $env:USER_OBJECT_ID --type User` | Gán quản trị viên Microsoft Entra ID | Thiết lập quyền superuser cho tài khoản Entra ID |
| `az postgres flexible-server microsoft-entra-admin list --resource-group $env:RG --server-name $env:PG_SERVER -o table` | Liệt kê các quản trị viên Microsoft Entra | Xác thực danh sách admin định danh trên máy chủ |
| `az postgres flexible-server update --resource-group $env:RG --name $env:PG_SERVER --microsoft-entra-auth Enabled --password-auth Disabled --yes` | Vô hiệu hóa xác thực mật khẩu tĩnh (Zero-Trust) | Chỉ cho phép kết nối bằng token Entra ID ngắn hạn |
| `az postgres flexible-server firewall-rule create --resource-group $env:RG --server-name $env:PG_SERVER --name AllowAll --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255` | Tạo quy tắc tường lửa Firewall Rule | Mở cổng kết nối 5432 cho môi trường lab / máy trạm |
| `az postgres flexible-server firewall-rule list --resource-group $env:RG --server-name $env:PG_SERVER -o table` | Liệt kê các quy tắc tường lửa đang hoạt động | Kiểm tra các dải IP được phép kết nối |
| `az postgres flexible-server parameter set --resource-group $env:RG --server-name $env:PG_SERVER --name azure.extensions --value vector` | Cấp phép extension pgvector (azure.extensions) | Bắt buộc để có thể chạy 'CREATE EXTENSION vector;' |
| `az postgres flexible-server parameter show --resource-group $env:RG --server-name $env:PG_SERVER --name azure.extensions --query value -o tsv` | Kiểm tra giá trị tham số azure.extensions | Xác nhận tiện ích 'vector' đã được đưa vào allow-list |
| `az account get-access-token --resource-type oss-rdbms --query accessToken -o tsv` | Lấy Bearer Token từ Microsoft Entra ID | Sử dụng làm mật khẩu kết nối cơ sở dữ liệu (PGPASSWORD) |
| `az postgres flexible-server db create --resource-group $env:RG --server-name $env:PG_SERVER --database-name agent_memory` | Tạo Database mới (agent_memory) | Lưu trữ lịch sử hội thoại và checkpoint của AI Agent |
| `az postgres flexible-server db list --resource-group $env:RG --server-name $env:PG_SERVER -o table` | Liệt kê danh sách database trên server | Kiểm tra các cơ sở dữ liệu đã tạo |
| `az postgres flexible-server restart --resource-group $env:RG --name $env:PG_SERVER` | Khởi động lại máy chủ Flexible Server | Áp dụng triệt để các tham số hệ thống vừa cấu hình |
| `az postgres flexible-server delete --resource-group $env:RG --name $env:PG_SERVER --yes` | Xóa máy chủ PostgreSQL Flexible Server | Giải phóng tài nguyên cloud sau khi hoàn thành |

---

## Level 10: Azure Managed Redis & RediSearch Vector

| Câu lệnh | Giải thích | Mục đích |
|---|---|---|
| `az provider register --namespace Microsoft.Cache` | Đăng ký Resource Provider Microsoft.Cache | Kích hoạt dịch vụ Azure Managed Redis trên subscription |
| `az redisenterprise create --resource-group $env:RG --name $env:REDIS_NAME --location eastus --sku Enterprise_E10 --no-database` | Tạo Azure Managed Redis Enterprise Cluster | Cấp phát cụm Enterprise E10 với cờ --no-database (quy trình 2 bước) |
| `az redisenterprise show --resource-group $env:RG --name $env:REDIS_NAME --query provisioningState -o tsv` | Kiểm tra trạng thái cấp phát của Cluster | Xác nhận trạng thái Succeeded |
| `az redisenterprise database create --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default --client-protocol Encrypted --port 10000 --clustering-policy EnterpriseCluster --eviction-policy VolatileLRU` | Khởi tạo Cơ sở dữ liệu mặc định (default) | Cấu hình cổng 10000 TLS, EnterpriseCluster và VolatileLRU |
| `az redisenterprise database show --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default --query provisioningState -o tsv` | Kiểm tra trạng thái cấp phát của Database | Đảm bảo database đã hoàn tất cấu hình và sẵn sàng |
| `az redisenterprise database access-policy-assignment create --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default --access-policy-name default --name entra-assignment --object-id $env:USER_OID` | Gán quyền truy cập Microsoft Entra ID | Phân quyền xác thực không dùng mật khẩu cho User/Principal OID |
| `az redisenterprise database access-policy-assignment show --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default --name entra-assignment --query provisioningState -o tsv` | Xác minh trạng thái của Access Policy Assignment | Đảm bảo chính sách phân quyền đã có hiệu lực |
| `az redisenterprise show --resource-group $env:RG --name $env:REDIS_NAME --query hostName -o tsv` | Trích xuất FQDN Hostname của cụm Redis | Lấy địa chỉ FQDN sạch để cấu hình biến môi trường ứng dụng |
| `az redisenterprise database access-policy-assignment list --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default -o table` | Liệt kê toàn bộ các phân quyền Entra ID | Kiểm tra danh sách người dùng và ứng dụng được phép truy cập |
| `az redisenterprise database update --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default --eviction-policy AllKeysLRU` | Cập nhật chính sách Eviction thành AllKeysLRU | Tối ưu hóa cho hệ thống cache thuần túy đệm trước Database |
| `az redisenterprise database flush --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default --yes` | Xóa sạch toàn bộ dữ liệu cache trong Database | Dọn dẹp nhanh keyspace mà không cần xóa database |
| `az redisenterprise database force-unlink --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default --unlink-ids 1 --yes` | Cưỡng chế ngắt liên kết replication bị cô lập | Khôi phục trạng thái ổn định khi gặp sự cố phân mảnh nút |
| `az redisenterprise show --resource-group $env:RG --name $env:REDIS_NAME --query "{sku:sku.name, host:hostName, status:provisioningState, redisVersion:redisVersion}" -o json` | Multi-hash Projection trích xuất tóm tắt thông số | Tái cấu trúc JSON phản hồi thành thông tin cô đọng |
| `az redisenterprise database delete --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default --yes` | Xóa Cơ sở dữ liệu mặc định | Dọn dẹp database trước khi hủy cụm phần cứng |
| `az redisenterprise delete --resource-group $env:RG --name $env:REDIS_NAME --yes` | Xóa Cụm Azure Managed Redis Cluster | Giải phóng hoàn toàn chi phí tài nguyên cloud |

---

## Level 11: Backend Services Integration (Service Bus, Event Grid & Functions)

| Câu lệnh | Giải thích | Mục đích |
|---|---|---|
| `az provider register --namespace Microsoft.ServiceBus` | Đăng ký Resource Provider Microsoft.ServiceBus | Kích hoạt dịch vụ Message Queues & Topics trên subscription |
| `az provider register --namespace Microsoft.EventGrid` | Đăng ký Resource Provider Microsoft.EventGrid | Kích hoạt hệ thống định tuyến sự kiện phản ứng trên subscription |
| `az servicebus namespace create --resource-group $env:RG --name $env:SB_NAMESPACE --location eastus --sku Standard` | Tạo Service Bus Namespace gói Standard | Cung cấp tài nguyên Enterprise cho Queues, Topics & Subscriptions |
| `az servicebus queue create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --name inference-requests --max-delivery-count 5 --enable-dead-lettering-on-message-expiration true` | Tạo Hàng đợi Queue với DLQ | Xử lý yêu cầu suy luận AI, cô lập poison message vào Dead-Letter |
| `az servicebus topic create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --name inference-results` | Tạo Topic phát tán kết quả suy luận | Phân phối kết quả 1-nhiều tới nhiều hệ thống backend cùng lúc |
| `az servicebus topic subscription create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --name high-priority` | Tạo Subscription nhận tin ưu tiên cao | Đăng ký nhận bản sao tin nhắn từ Topic |
| `az servicebus topic subscription rule delete --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --subscription-name high-priority --name "$Default"` | Xóa quy tắc lọc mặc định $Default | Ngăn subscription nhận toàn bộ tin nhắn để bộ lọc SQL có hiệu lực |
| `az servicebus topic subscription rule create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --subscription-name high-priority --name high-priority-filter --filter-sql-expression "priority = 'high'"` | Tạo bộ lọc SQL Filter theo thuộc tính metadata | Chỉ tiếp nhận các tin nhắn có priority='high' trong header |
| `az role assignment create --assignee $env:USER_OID --scope $SB_ID --role "Azure Service Bus Data Owner"` | Phân quyền Data Plane Service Bus Data Owner | Gửi và nhận tin nhắn không cần Shared Access Key connection string |
| `az eventgrid namespace create --resource-group $env:RG --name $env:EG_NAMESPACE --location eastus --sku "{name:standard,capacity:1}"` | Tạo Event Grid Namespace thế hệ mới | Cung cấp hạ tầng MQTT broker và Pull Delivery cho sự kiện |
| `az eventgrid namespace topic create --resource-group $env:RG --namespace-name $env:EG_NAMESPACE --name moderation-events --event-retention-in-days 1 --publisher-type Custom --input-schema CloudEventSchemaV1_0` | Tạo Namespace Topic chuẩn CloudEvents v1.0 | Định dạng sự kiện CNCF chuẩn quốc tế với thời gian lưu đệm 1 ngày |
| `az eventgrid namespace topic event-subscription create --resource-group $env:RG --namespace-name $env:EG_NAMESPACE --topic-name moderation-events --name sub-flagged --delivery-configuration "{deliveryMode:Queue,queue:{receiveLockDurationInSeconds:60,maxDeliveryCount:10,eventTimeToLive:P1D}}" --event-delivery-schema CloudEventSchemaV1_0 --filters-configuration "{includedEventTypes:['com.contoso.ai.ContentFlagged']}"` | Tạo Event Subscription chế độ Queue Pull Delivery & Filter | Cho phép worker trong mạng nội bộ kéo sự kiện kiểm duyệt bị gắn cờ |
| `az role assignment create --assignee $env:USER_OID --scope $EG_TOPIC_ID --role "EventGrid Data Receiver"` | Phân quyền Data Plane EventGrid Data Receiver | Cấp quyền kéo sự kiện từ subscription cho tài khoản người dùng |
| `az functionapp create --resource-group $env:RG --consumption-plan-location eastus --runtime python --runtime-version 3.11 --functions-version 4 --name $env:FUNC_NAME --storage-account $env:STORAGE_ACCOUNT --os-type Linux` | Tạo Azure Function App Linux host MCP Server | Chạy serverless compute cho các công cụ AI Model Context Protocol |
| `az functionapp show --resource-group $env:RG --name $env:FUNC_NAME --query defaultHostName -o tsv` | Trích xuất FQDN Hostname Function App | Cung cấp endpoint SSE URL cho các AI Client (Copilot, Cursor) |

---

## Level 12: Azure Key Vault & App Configuration

| Câu lệnh | Giải thích | Mục đích |
|---|---|---|
| `az provider register --namespace Microsoft.AppConfiguration` | Đăng ký Resource Provider Microsoft.AppConfiguration | Kích hoạt dịch vụ quản lý cấu hình tập trung phân tán |
| `az provider register --namespace Microsoft.KeyVault` | Đăng ký Resource Provider Microsoft.KeyVault | Kích hoạt dịch vụ lưu trữ bí mật và khóa mã hóa |
| `az keyvault create --resource-group $env:RG --name $env:KV_NAME --location eastus --enable-rbac-authorization true` | Khởi tạo Key Vault với mô hình xác thực RBAC | Quản lý kiểm soát truy cập dữ liệu qua Microsoft Entra ID RBAC |
| `az role assignment create --role "Key Vault Secrets Officer" --assignee $env:USER_OID --scope $KV_ID` | Phân quyền vai trò Key Vault Secrets Officer | Toàn quyền CRUD trên secrets cho kỹ sư vận hành/CI-CD |
| `az keyvault secret set --vault-name $env:KV_NAME --name openai-api-key --value "sk-proj-prod123456" --content-type "application/x-api-key"` | Lưu trữ khóa bí mật kèm định dạng Content-Type | Bảo vệ an toàn OpenAI API key với nhãn nhận dạng loại dữ liệu |
| `az keyvault secret set --vault-name $env:KV_NAME --name cosmosdb-connection-string --value "AccountEndpoint=https://mycosmos.documents.azure.com:443/;AccountKey=abc123==" --content-type "application/x-connection-string"` | Lưu trữ chuỗi kết nối nhạy cảm của CSDL | Cách ly chuỗi kết nối khỏi mã nguồn và cấu hình bản rõ |
| `az keyvault secret show --vault-name $env:KV_NAME --name openai-api-key --query id -o tsv` | Trích xuất URI Secret Identifier duy nhất | Lấy đường dẫn URI sạch để liên kết Key Vault Reference |
| `az keyvault secret list-versions --vault-name $env:KV_NAME --name openai-api-key --query "[].{id:id, enabled:attributes.enabled}" -o table` | Liệt kê toàn bộ các phiên bản lịch sử của Secret | Kiểm toán xoay vòng khóa (key rotation) và trạng thái kích hoạt |
| `az appconfig create --resource-group $env:RG --name $env:APPCONFIG_NAME --location eastus --sku Standard` | Khởi tạo Azure App Configuration SKU Standard | Cung cấp SLA 99.9% và hỗ trợ Dynamic Refresh không giới hạn |
| `az role assignment create --role "App Configuration Data Owner" --assignee $env:USER_OID --scope $APPCONFIG_ID` | Phân quyền App Configuration Data Owner | Quản trị toàn diện key-values, nhãn và Key Vault references |
| `az appconfig kv set --name $env:APPCONFIG_NAME --key "OpenAI:Endpoint" --value "https://my-openai.openai.azure.com/" --yes` | Thiết lập khóa cấu hình mặc định (không nhãn) | Cung cấp cấu hình fallback chung cho mọi môi trường |
| `az appconfig kv set --name $env:APPCONFIG_NAME --key "Pipeline:BatchSize" --value "200" --label "Production" --yes` | Kỹ thuật Label Stacking: Ghi đè khóa cho Production | Tái sử dụng cấu hình cơ sở và chỉ ghi đè tham số môi trường Prod |
| `az appconfig kv set-keyvault --name $env:APPCONFIG_NAME --key "OpenAI:ApiKey" --secret-identifier $SECRET_URI --yes` | Tạo liên kết Key Vault Reference | Tự động phân giải secret từ Key Vault qua App Config Provider |
| `az appconfig kv set --name $env:APPCONFIG_NAME --key "Sentinel" --value "1" --yes` | Khởi tạo Sentinel Key cho Dynamic Refresh | Khóa canh gác kích hoạt nạp lại cấu hình tức thì không restart app |
| `az keyvault purge --name $env:KV_NAME --no-wait` | Xóa vĩnh viễn Key Vault khỏi trạng thái Soft-Delete | Giải phóng hoàn toàn tên miền DNS *.vault.azure.net toàn cầu |

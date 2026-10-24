# TỔNG HỢP CÂU LỆNH AZURE CLI THỰC CHIẾN (MICROSOFT AI-200)

> Tài liệu tra cứu toàn diện 63 câu lệnh Azure CLI (`az`) thực hành qua 6 cấp độ (ACR, App Service, RBAC, Sidecar, Container Apps & Dynamic Sessions).

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

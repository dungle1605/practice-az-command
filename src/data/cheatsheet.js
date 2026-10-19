/**
 * Interactive Cheatsheet & Reference Guide
 * Direct interactive version of Useful_Command.md with copyable snippets and deep dives.
 */

export const CHEATSHEET_SECTIONS = [
  {
    id: "mental-model",
    title: "💡 Tư duy cấu trúc lệnh & Cách tự tra cứu (Mental Model)",
    badge: "Nguyên lý",
    summary: "Không cần học vẹt! Nắm vững quy tắc ngữ pháp Azure CLI và 3 công cụ tra cứu tích hợp sẵn trong Terminal.",
    items: [
      {
        title: "Quy tắc ngữ pháp chuẩn của Azure CLI",
        desc: "Mọi câu lệnh Azure CLI đều tuân thủ công thức nhất quán:",
        syntax: "az  <Dịch vụ / Nhóm>  [Nhóm con (nếu có)]  <Hành động (Action)>  [Các tham số]",
        table: [
          { verb: "list", meaning: "Liệt kê danh sách tài nguyên", example: "az group list, az acr repository list" },
          { verb: "show", meaning: "Xem chi tiết 1 tài nguyên cụ thể", example: "az webapp show, az acr show" },
          { verb: "create", meaning: "Tạo mới tài nguyên", example: "az group create, az webapp create" },
          { verb: "update", meaning: "Cập nhật cấu hình tài nguyên", example: "az acr repository update" },
          { verb: "delete", meaning: "Xóa tài nguyên", example: "az group delete, az webapp delete" },
          { verb: "exists", meaning: "Kiểm tra tài nguyên đã tồn tại chưa (true/false)", example: "az group exists" }
        ]
      },
      {
        title: "4 Công cụ tra cứu tức thì ngay trong Terminal",
        desc: "Không cần rời khỏi màn hình terminal để tra cứu Google hay tài liệu web:",
        bullets: [
          "① Dùng cờ `-h` hoặc `--help` ở mọi cấp độ (ví dụ: `az -h`, `az webapp -h`, `az webapp create -h`).",
          "② Chế độ tương tác thông minh `az interactive`: Tự động gợi ý từ khóa (Auto-completion), tham số khi bạn đang gõ và xem ví dụ lệnh ngay tức thì.",
          "③ Tìm kiếm lệnh bằng ngôn ngữ tự nhiên `az find \"create container webapp\"` hoặc `az find \"assign identity to web app\"`.",
          "④ Tận dụng phím Tab: Gõ một phần lệnh và nhấn Tab để terminal tự hoàn thành tên dịch vụ, hành động hoặc danh sách cờ tham số."
        ]
      }
    ]
  },
  {
    id: "setup-login",
    title: "1. Khởi tạo & Đăng nhập",
    badge: "Khởi tạo",
    summary: "Đăng nhập môi trường không có GUI và kích hoạt các dịch vụ lõi trên Azure Subscription.",
    items: [
      {
        title: "Đăng nhập với Device Code",
        desc: "Sử dụng khi làm việc trên môi trường terminal/remote không mở được trình duyệt tự động:",
        code: "az login --use-device-code",
        note: "Mở URL https://microsoft.com/devicelogin trên điện thoại hoặc máy tính và nhập mã được cung cấp."
      },
      {
        title: "Đăng ký các Resource Provider cần thiết",
        desc: "Cần đăng ký dịch vụ Container Registry và Web App nếu subscription mới hoặc chưa kích hoạt:",
        code: `az provider register --namespace Microsoft.ContainerRegistry\naz provider register --namespace Microsoft.Web`,
        note: "Tránh lỗi 'Namespace not registered' khi gọi các lệnh tạo tài nguyên."
      }
    ]
  },
  {
    id: "env-vars",
    title: "2. Cấu hình biến môi trường & az config defaults",
    badge: "Môi trường",
    summary: "Nạp và quản lý các biến môi trường để dùng lại xuyên suốt, tránh gõ thủ công và sai sót.",
    items: [
      {
        title: "Nạp tự động từ file .env.ps1 (Dot-sourcing trong PowerShell)",
        desc: "Khi chạy script bài lab, file cấu hình .env.ps1 được sinh ra. Dùng 1 dòng lệnh để nạp toàn bộ biến vào phiên hiện tại:",
        code: ". .\\.env.ps1",
        note: "Lưu ý có dấu chấm và khoảng trắng ở đầu (. .\\.env.ps1) để biến giữ nguyên trong phiên làm việc hiện tại."
      },
      {
        title: "Gán thủ công trong PowerShell Session",
        desc: "Nếu muốn tự định nghĩa biến môi trường cho bài lab:",
        code: `$env:RESOURCE_GROUP = "rg-ai200-appsvc-lab"
$env:LOCATION       = "southeastasia"
$env:ACR_NAME       = "acr9e9994d6"
$env:APP_PLAN       = "plan-docprocessor-9e9994d6"
$env:APP_NAME       = "app-docprocessor-9e9994d6"`
      },
      {
        title: "Kiểm tra biến môi trường đã nạp",
        desc: "Liệt kê tất cả các biến của bài lab dưới dạng bảng:",
        code: "Get-ChildItem env:RESOURCE_GROUP, env:LOCATION, env:ACR_NAME, env:APP_PLAN, env:APP_NAME"
      },
      {
        title: "Đặt cấu hình mặc định cho Azure CLI (az config defaults)",
        desc: "Sau khi thiết lập, các câu lệnh az sẽ tự động nhận Resource Group mà bạn không cần phải gõ cờ --resource-group hay --location:",
        code: `# 1. Đặt Resource Group và Location mặc định cho Azure CLI:
az config set defaults.group=$env:RESOURCE_GROUP
az config set defaults.location=$env:LOCATION

# 2. Xem cấu hình mặc định hiện tại:
az config get defaults

# 3. Lợi ích: Các câu lệnh sau có thể gọi trực tiếp, không cần cờ --resource-group:
az acr show --name $env:ACR_NAME --query name -o tsv
az webapp show --name $env:APP_NAME --query state -o tsv

# 4. Khi hoàn thành bài lab, nếu muốn xóa cấu hình mặc định:
az config unset defaults.group
az config unset defaults.location`
      }
    ]
  },
  {
    id: "acr-section",
    title: "4. Quản lý Azure Container Registry (ACR)",
    badge: "Container Registry",
    summary: "Tạo Registry chuẩn RBAC, Build Docker Image trên Cloud qua ACR Task và thiết lập Immutability.",
    items: [
      {
        title: "Tạo mới ACR (Gói Basic, tắt tài khoản admin)",
        desc: "Tạo ACR bảo mật vô hiệu hóa admin credentials:",
        code: `az acr create \`
    --resource-group $env:RESOURCE_GROUP \`
    --name $env:ACR_NAME \`
    --sku Basic \`
    --admin-enabled false`
      },
      {
        title: "Kiểm tra trạng thái khởi tạo (provisioningState)",
        desc: "Trích xuất giá trị text thuần với JMESPath và TSV:",
        code: "az acr show --resource-group $env:RESOURCE_GROUP --name $env:ACR_NAME --query provisioningState -o tsv"
      },
      {
        title: "Build Docker Image trực tiếp trên Cloud qua ACR Task",
        desc: "Không cần cài đặt Docker ở máy cục bộ, Azure sẽ tự đóng gói và lưu vào Registry:",
        code: `# Cách 1: Build với đường dẫn file Dockerfile cụ thể
az acr build \`
    --resource-group $env:RESOURCE_GROUP \`
    --registry $env:ACR_NAME \`
    --image docprocessor:v1 \`
    --file api/Dockerfile \`
    --no-logs api/

# Cách 2: Build image từ thư mục nguồn ./api
az acr build --registry $env:ACR_NAME --image inference-api:v1.1.0 ./api`
      },
      {
        title: "Liệt kê lịch sử các tác vụ build (Task Runs)",
        desc: "Kiểm tra kết quả và ID các lần build trước:",
        code: "az acr task list-runs --registry $env:ACR_NAME --output table"
      },
      {
        title: "Liệt kê repositories và tags",
        desc: "Xem các image và phiên bản hiện có:",
        code: `# Liệt kê danh sách các repository trong ACR:
az acr repository list --name $env:ACR_NAME --output table

# Liệt kê các tag của một repository:
az acr repository show-tags --name $env:ACR_NAME --repository inference-api --output table`
      },
      {
        title: "Khóa Image chống ghi đè / xóa (Immutability)",
        desc: "Đảm bảo an toàn triển khai production, biến tag v1.0.0 thành bất biến:",
        code: "az acr repository update --name $env:ACR_NAME --image inference-api:v1.0.0 --write-enable false"
      }
    ]
  },
  {
    id: "appservice-section",
    title: "5 & 6. App Service Plan & Container Web App",
    badge: "PaaS Hosting",
    summary: "Hạ tầng tính toán Linux và triển khai Web App chạy từ image container ACR.",
    items: [
      {
        title: "Tạo mới App Service Plan (Linux, P0v3)",
        desc: "Khởi tạo máy chủ Linux hỗ trợ container:",
        code: `az appservice plan create \`
    --resource-group $env:RESOURCE_GROUP \`
    --name $env:APP_PLAN \`
    --location $env:LOCATION \`
    --sku P0v3 \`
    --is-linux`
      },
      {
        title: "Tạo Web App trỏ đến Container Image từ ACR",
        desc: "Triển khai ứng dụng container lên App Service:",
        code: `az webapp create \`
    --resource-group $env:RESOURCE_GROUP \`
    --plan $env:APP_PLAN \`
    --name $env:APP_NAME \`
    --container-image-name "$($env:ACR_NAME).azurecr.io/docprocessor:v1"`
      },
      {
        title: "Kiểm tra trạng thái hoạt động của Web App",
        desc: "Xác nhận ứng dụng ở trạng thái Running:",
        code: "az webapp show --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query state -o tsv"
      }
    ]
  },
  {
    id: "identity-rbac-section",
    title: "6.2. Cấu hình Managed Identity & Phân quyền RBAC (AcrPull)",
    badge: "Bảo mật Nâng cao",
    summary: "Kỹ thuật cấp quyền không dùng mật khẩu giữa Web App và ACR qua Entra ID Managed Identity.",
    items: [
      {
        title: "Quy trình 4 bước chuẩn phân quyền Managed Identity",
        desc: "Thực hiện lần lượt 4 bước sau để Web App tự động kéo image từ ACR bảo mật:",
        code: `# Bước 1: Cung cấp System-Assigned Managed Identity cho Web App
az webapp identity assign \`
    --resource-group $env:RESOURCE_GROUP \`
    --name $env:APP_NAME

# Bước 2: Lấy principalId và lưu vào biến $PRINCIPAL_ID dạng chuỗi sạch (tsv)
$PRINCIPAL_ID = az webapp identity show \`
    --resource-group $env:RESOURCE_GROUP \`
    --name $env:APP_NAME \`
    --query principalId \`
    --output tsv

# Bước 3: Lấy Resource ID của ACR và cấp quyền AcrPull qua RBAC
$ACR_ID = az acr show --name $env:ACR_NAME --query id --output tsv

az role assignment create \`
    --assignee $PRINCIPAL_ID \`
    --role AcrPull \`
    --scope $ACR_ID

# Bước 4: Cấu hình Web App sử dụng Managed Identity để kéo Image từ ACR
az webapp config set \`
    --resource-group $env:RESOURCE_GROUP \`
    --name $env:APP_NAME \`
    --acr-use-identity true \`
    --acr-identity "[system]"`
      },
      {
        title: "Kiểm tra cấu hình xác thực ACR vừa gán",
        desc: "Định dạng bảng xác nhận trạng thái Managed Identity:",
        code: `az webapp config show \`
    --resource-group $env:RESOURCE_GROUP \`
    --name $env:APP_NAME \`
    --query "{acrUseManagedIdentityCreds:acrUseManagedIdentityCreds, acrIdentity:acrUserManagedIdentityId}" \`
    --output table`
      }
    ]
  },
  {
    id: "appsettings-section",
    title: "6.3. Cấu hình biến môi trường (App Settings)",
    badge: "Runtime Config",
    summary: "Truyền các tham số cấu hình runtime vào container trong Web App.",
    items: [
      {
        title: "Thêm hoặc cập nhật biến môi trường cho Web App",
        desc: "Thiết lập biến cổng WEBSITES_PORT và cấu hình ứng dụng:",
        code: `az webapp config appsettings set \`
    --resource-group $env:RESOURCE_GROUP \`
    --name $env:APP_NAME \`
    --settings \`
        ENVIRONMENT="production" \`
        LOG_LEVEL="INFO" \`
        WEBSITES_PORT="8000" \`
        MAX_DOCUMENT_SIZE_MB="50" \`
        PROCESSING_TIMEOUT_SECONDS="30"`
      },
      {
        title: "Liệt kê danh sách biến môi trường (bảng đẹp qua JMESPath)",
        desc: "Chỉ lấy tên và giá trị gọn gàng:",
        code: `az webapp config appsettings list \`
    --resource-group $env:RESOURCE_GROUP \`
    --name $env:APP_NAME \`
    --query "[].{Setting:name, Value:value}" \`
    --output table`
      },
      {
        title: "Nạp biến môi trường từ file JSON hoặc xóa biến",
        desc: "Thao tác hàng loạt:",
        code: `# Nạp từ file JSON:
az webapp config appsettings set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --settings @settings.json

# Xóa một hoặc nhiều biến:
az webapp config appsettings delete --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --setting-names LOG_LEVEL ENVIRONMENT`
      }
    ]
  }
];

/**
 * Interactive Cheatsheet & Reference Guide for AI-200 (AZ-COMMAND MASTER)
 * Comprehensive reference matching all 5 levels and Exam Tips.
 */

export const CHEATSHEET_SECTIONS = [
  {
    id: "exam-tips-spotlight",
    title: "⭐ 4 Mẹo phòng thi AI-200 & Thực chiến Cốt lõi",
    badge: "Mẹo AI-200",
    summary: "Bốn nguyên tắc vàng giúp bạn vượt qua các câu hỏi tình huống thực tế và tối ưu hóa câu lệnh trong kỳ thi Microsoft AI-200.",
    items: [
      {
        title: "1. Dùng `-o tsv` khi cần chuỗi sạch (Clean String Extraction)",
        desc: "Khi cần lấy giá trị thuần túy (không chứa dấu ngoặc kép JSON bao quanh) để gán trực tiếp vào biến shell hoặc URL, hãy luôn dùng `--output tsv` (hoặc `-o tsv`) thay vì json hay table.",
        code: `# Ví dụ lấy URL hoặc ID sạch:
$PRINCIPAL_ID = az webapp identity show --name $env:APP_NAME --query principalId --output tsv
$ACR_ID = az acr show --name $env:ACR_NAME --query id --output tsv
$APP_URL = az webapp show --name $env:APP_NAME --query defaultHostName --output tsv`,
        note: "Tránh lỗi syntax do chuỗi bị thừa hai dấu nháy kép `\"...\"` khi truyền vào các tham số tiếp theo."
      },
      {
        title: "2. `--write-enabled false`: Khóa Image Bất biến (Immutability)",
        desc: "Đây là lệnh 'một đi không trở lại' đối với image tag được chỉ định (không thể mở khóa lại tag đó). Chỉ áp dụng cho các phiên bản Production quan trọng cần đóng băng.",
        code: "az acr repository update --name $env:ACR_NAME --image inference-api:v1.0.0 --write-enabled false",
        note: "Ngăn chặn triệt để nguy cơ ai đó vô tình push đè mã nguồn lỗi hoặc xóa nhầm tag đang phục vụ khách hàng."
      },
      {
        title: "3. JMESPath Multi-hash Projection: Lọc dữ liệu bảng gọn gàng",
        desc: "Dùng cú pháp `--query \"[].{Setting:name, Value:value}\"` để định dạng lại các trường dữ liệu JSON thành bảng 2 cột trực quan khi danh sách quá dài.",
        code: `az webapp config appsettings list \\
    --name $env:APP_NAME \\
    --query "[].{Setting:name, Value:value}" \\
    --output table`,
        note: "Cú pháp Multi-hash Projection xuất hiện thường xuyên trong đề thi khi hỏi về lọc dữ liệu Azure CLI."
      },
      {
        title: "4. Nguyên tắc Đặc quyền Tối thiểu (Least Privilege) với AcrPull",
        desc: "Luôn ưu tiên cấp System-Assigned Managed Identity kết hợp vai trò chuyên biệt `AcrPull` thay vì bật Admin Credentials tĩnh (`--admin-enabled false`).",
        code: `# 1. Cấp System Managed Identity:
az webapp identity assign --name $env:APP_NAME

# 2. Gán quyền tối thiểu AcrPull:
az role assignment create --assignee $PRINCIPAL_ID --scope $ACR_ID --role AcrPull

# 3. Kích hoạt Identity trên Web App:
az webapp config set --name $env:APP_NAME --acr-use-identity true --acr-identity "[system]"`,
        note: "Loại bỏ hoàn toàn rủi ro lộ lọt mật khẩu trong tệp cấu hình hoặc mã nguồn."
      }
    ]
  },
  {
    id: "level-1-setup",
    title: "Level 1: Nhập môn & Môi trường (Environment Setup)",
    badge: "Level 1",
    summary: "Các câu lệnh thiết lập phiên làm việc, kích hoạt Resource Provider và nạp biến môi trường.",
    items: [
      {
        title: "Đăng nhập Headless với Device Code",
        desc: "Dùng khi làm việc trên terminal từ xa không có trình duyệt hoặc cần bảo mật xác thực 2 bước:",
        code: "az login --use-device-code",
        note: "Mở URL https://microsoft.com/devicelogin trên điện thoại hoặc trình duyệt khác và nhập mã 8 ký tự."
      },
      {
        title: "Đăng ký Resource Provider cho ACR và Web App",
        desc: "Kích hoạt dịch vụ cấp Subscription trước khi tạo tài nguyên (bắt buộc):",
        code: `# Đăng ký cho Container Registry:
az provider register --namespace Microsoft.ContainerRegistry

# Đăng ký cho App Service:
az provider register --namespace Microsoft.Web`,
        note: "Tránh lỗi 'Namespace not registered' khi gọi các lệnh tạo tài nguyên."
      },
      {
        title: "Nạp biến môi trường từ file script .env.ps1 (Dot-sourcing)",
        desc: "Nạp toàn bộ biến vào phiên làm việc hiện tại thay vì chạy trong subshell:",
        code: ". .\\.env.ps1",
        note: "Lưu ý có dấu chấm và khoảng trắng ở đầu: `. .\\.env.ps1`."
      },
      {
        title: "Gán biến thủ công trong PowerShell",
        desc: "Định nghĩa biến môi trường tái sử dụng cho bài lab:",
        code: `$env:ACR_NAME = "acr9e9994d6"
$env:RESOURCE_GROUP = "rg-ai200-acr-lab"
$env:LOCATION = "southeastasia"
$env:APP_PLAN = "plan-docprocessor-9e9994d6"
$env:APP_NAME = "app-docprocessor-9e9994d6"`
      },
      {
        title: "Cấu hình Resource Group mặc định (az config defaults)",
        desc: "Thiết lập cấu hình mặc định để câu lệnh ngắn hơn, không cần lặp lại cờ --resource-group:",
        code: "az config set defaults.group=rg-ai200-acr-lab"
      }
    ]
  },
  {
    id: "level-2-acr",
    title: "Level 2: Azure Container Registry (ACR) & ACR Tasks",
    badge: "Level 2",
    summary: "Đóng gói image trên Cloud, Smoke Test, kiểm tra Manifest và khóa Immutability.",
    items: [
      {
        title: "Build Image trên Cloud (Quick Task)",
        desc: "Tải ngữ cảnh thư mục ./api lên Azure và build container image trực tiếp mà không cần cài Docker local:",
        code: "az acr build --registry $env:ACR_NAME --image inference-api:v1.0.0 ./api"
      },
      {
        title: "Chạy thử Image trên Cloud (Smoke Test)",
        desc: "Chạy container độc lập kiểm tra cú pháp và import module trước khi deploy Web App:",
        code: "az acr run --registry $env:ACR_NAME --cmd \"$env:ACR_NAME.azurecr.io/inference-api:v1.0.0 python -c 'from app import app'\" /dev/null"
      },
      {
        title: "Liệt kê Repositories & Tags",
        desc: "Tra cứu danh sách kho chứa và các tag phiên bản trong ACR dưới dạng bảng:",
        code: `# Liệt kê tất cả Repository:
az acr repository list --name $env:ACR_NAME --output table

# Liệt kê các Tag của một Repository:
az acr repository show-tags --name $env:ACR_NAME --repository inference-api --output table`
      },
      {
        title: "Xem chi tiết Manifest & Digest SHA256",
        desc: "Xem định danh bất biến (Digest) và ngày giờ tạo của image:",
        code: "az acr manifest list-metadata --registry $env:ACR_NAME --name inference-api --output table"
      },
      {
        title: "Khóa Image Bất biến (Immutability)",
        desc: "Bảo vệ Production chống ghi đè hoặc xóa nhầm tag:",
        code: "az acr repository update --name $env:ACR_NAME --image inference-api:v1.0.0 --write-enabled false"
      },
      {
        title: "Xem lịch sử Build trên Cloud (Audit Trail)",
        desc: "Kiểm tra toàn bộ lịch sử các tác vụ ACR Task đã chạy:",
        code: "az acr task list-runs --registry $env:ACR_NAME --output table"
      }
    ]
  },
  {
    id: "level-3-appservice",
    title: "Level 3: App Service & Container Web App",
    badge: "Level 3",
    summary: "Khởi tạo hạ tầng tính toán Linux, Web App chạy từ Container, trích xuất URL và theo dõi luồng Log.",
    items: [
      {
        title: "Tạo App Service Plan (Linux, P0v3)",
        desc: "Cụm máy chủ chuyên dụng cho container với gói hiệu năng cao Premium V3:",
        code: "az appservice plan create --name $env:APP_PLAN --resource-group $env:RESOURCE_GROUP --is-linux --sku P0v3"
      },
      {
        title: "Tạo Web App từ Container Image trong ACR",
        desc: "Khởi tạo Web App trỏ trực tiếp đến image container trong registry:",
        code: "az webapp create --resource-group $env:RESOURCE_GROUP --plan $env:APP_PLAN --name $env:APP_NAME --container-image-name \"$($env:ACR_NAME).azurecr.io/docprocessor:v1\""
      },
      {
        title: "Cập nhật Container Settings (Image & Registry URL)",
        desc: "Thay đổi phiên bản image hoặc cấu hình registry cho ứng dụng:",
        code: "az webapp config container set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --container-image-name \"$($env:ACR_NAME).azurecr.io/docprocessor:v1\" --container-registry-url \"https://$($env:ACR_NAME).azurecr.io\""
      },
      {
        title: "Lấy URL của ứng dụng Web App",
        desc: "Trích xuất tên miền mặc định dạng chuỗi sạch không ngoặc kép:",
        code: "az webapp show --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query defaultHostName --output tsv"
      },
      {
        title: "Xem Log trực tiếp (Log Stream)",
        desc: "Lắng nghe luồng nhật ký runtime thời gian thực của container:",
        code: "az webapp log tail --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME"
      }
    ]
  },
  {
    id: "level-4-rbac",
    title: "Level 4: Bảo mật RBAC & App Settings",
    badge: "Level 4",
    summary: "Cấp quyền System Managed Identity không mật khẩu, cấu hình WEBSITES_PORT, Always-On và Container Logging.",
    items: [
      {
        title: "Chu trình 4 bước phân quyền Managed Identity (AcrPull)",
        desc: "Quy trình thiết lập bảo mật chuẩn AI-200 giữa Web App và ACR:",
        code: `# Bước 1: Cung cấp System-Assigned Managed Identity
az webapp identity assign --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME

# Bước 2: Lấy principalId sạch lưu vào biến
$PRINCIPAL_ID = az webapp identity show --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query principalId --output tsv

# Bước 3: Lấy Scope ID của ACR và gán vai trò AcrPull
$ACR_ID = az acr show --resource-group $env:RESOURCE_GROUP --name $env:ACR_NAME --query id --output tsv
az role assignment create --assignee $PRINCIPAL_ID --scope $ACR_ID --role AcrPull

# Bước 4: Cấu hình Web App kéo image bằng Managed Identity
az webapp config set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --acr-use-identity true --acr-identity "[system]"`
      },
      {
        title: "Cấu hình biến App Settings (Port & Storage)",
        desc: "Thiết lập cổng lắng nghe và ổ đĩa lưu trữ bền vững cho container:",
        code: "az webapp config appsettings set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --settings WEBSITES_PORT=8000 WEBSITES_ENABLE_APP_SERVICE_STORAGE=true"
      },
      {
        title: "Bật Always-On để giảm thiểu Cold Start",
        desc: "Giữ container luôn nạp sẵn trong RAM, sẵn sàng phản hồi tức thì cho ứng dụng AI:",
        code: "az webapp config set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --always-on true"
      },
      {
        title: "Bật Container Logging ra hệ thống tệp",
        desc: "Ghi nhận nhật ký stdout/stderr của Docker container ra filesystem:",
        code: "az webapp log config --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --docker-container-logging filesystem"
      },
      {
        title: "Lọc danh sách App Settings bằng JMESPath",
        desc: "Hiển thị bảng trực quan gồm 2 cột Setting và Value:",
        code: "az webapp config appsettings list --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query \"[].{Setting:name, Value:value}\" --output table"
      }
    ]
  },
  {
    id: "level-5-sidecar",
    title: "Level 5: Sidecar Containers (Bài Lab 3 Nâng cao)",
    badge: "Level 5",
    summary: "Kiến trúc Multi-container Pod, triển khai file đặc tả sitecontainers-spec.json và cô lập nhật ký Sidecar.",
    items: [
      {
        title: "Áp dụng cấu hình Sidecar từ file JSON",
        desc: "Triển khai cụm Multi-container Pod (Main Web App + Model Server sidecar) từ file cấu hình:",
        code: "az webapp sitecontainers create --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --sitecontainers-spec-file ./sitecontainers-spec.json"
      },
      {
        title: "Liệt kê các Container trong Pod",
        desc: "Kiểm tra danh sách container chính và container phụ kèm thông tin cổng kết nối:",
        code: "az webapp sitecontainers list --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --output table"
      },
      {
        title: "Xem Log riêng biệt của Sidecar Container",
        desc: "Trích xuất độc lập nhật ký của riêng container model-server để chẩn đoán lỗi:",
        code: "az webapp sitecontainers log --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --container-name model-server"
      },
      {
        title: "Kiểm tra trạng thái sức khỏe tổng quát (Health Check)",
        desc: "Xem trạng thái hoạt động của toàn bộ cụm container trong Web App:",
        code: "az webapp sitecontainers status --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP"
      }
    ]
  },
  {
    id: "level-6-containerapps",
    title: "Level 6: Azure Container Apps (ACA) - Quản lý và Chẩn đoán",
    badge: "Level 6",
    summary: "Quản lý Revisions, cập nhật Image Digest, điều khiển vòng đời, chẩn đoán Ingress & Biến môi trường, truy vấn Log Analytics KQL và xác minh Health Probes.",
    items: [
      {
        title: "Cập nhật Image mới với Digest SHA256 (Tự động tạo Revision)",
        desc: "Cập nhật image mới (nên dùng Digest thay vì tag để bất biến) → Tự động tạo Revision mới:",
        code: "az containerapp update --name <app-name> --resource-group <rg> --image <registry>/<repo>@sha256:<digest>",
        note: "Lab 4: Bất kỳ thay đổi nào trong template (image, env, scale) đều kích hoạt sinh một Revision mới."
      },
      {
        title: "Xác minh cấu hình Container sau khi Update",
        desc: "Trích xuất mảng cấu hình container từ template để kiểm tra image và tài nguyên:",
        code: "az containerapp show --name <app-name> --resource-group <rg> --query properties.template.containers",
        note: "Lab 4: Xác nhận container đã nhận đúng image digest vừa cập nhật."
      },
      {
        title: "Liệt kê tất cả Revisions (Kiểm tra trạng thái Active)",
        desc: "Liệt kê toàn bộ lịch sử revision, traffic weight và trạng thái kích hoạt:",
        code: "az containerapp revision list --name <app-name> --resource-group <rg> -o table",
        note: "Lab 4: Giúp theo dõi revision nào đang hoạt động và nhận lưu lượng người dùng."
      },
      {
        title: "Xem chi tiết một Revision cụ thể",
        desc: "Tra cứu thông tin chi tiết và URL FQDN riêng biệt của một revision:",
        code: "az containerapp revision show --name <app-name> --resource-group <rg> --revision <revision-name>",
        note: "Lab 4: Cho phép kiểm thử revision độc lập trước khi chuyển toàn bộ traffic sang."
      },
      {
        title: "Vô hiệu hóa một Revision lỗi (Deactivate bảo lưu bằng chứng)",
        desc: "Dừng phục vụ một revision lỗi nhưng vẫn giữ lại snapshot cấu hình trong lịch sử (không xóa):",
        code: "az containerapp revision deactivate --name <app-name> --resource-group <rg> --revision <revision-name>",
        note: "Lab 4: Mẹo phòng thi: Deactivate an toàn hơn xóa vì vẫn giữ log và cấu hình để post-mortem."
      },
      {
        title: "JMESPath nâng cao: Lọc nhanh Active & Health State của Revisions",
        desc: "Dùng Multi-hash Projection để lọc nhanh danh sách 3 cột name, active, healthState:",
        code: `az containerapp revision list \\
    --name <app-name> \\
    --resource-group <rg> \\
    --query "[].{name:name,active:properties.active,health:properties.healthState}" \\
    -o table`,
        note: "Lab 4: Cú pháp trích xuất bảng chuyên nghiệp dành cho kỹ sư SRE và DevOps."
      },
      {
        title: "Dừng Container App (Stop)",
        desc: "Dừng toàn bộ App (đảm bảo không khởi động replica trong lúc xử lý sự cố):",
        code: "az containerapp stop --name <app-name> --resource-group <rg>",
        note: "Lab 4: Scale ứng dụng về 0 và tạm ngưng xử lý request ngoài Internet."
      },
      {
        title: "Khởi động lại Container App (Start)",
        desc: "Khởi động lại ứng dụng sau khi đã khắc phục sự cố hoặc hoàn tất bảo trì:",
        code: "az containerapp start --name <app-name> --resource-group <rg>",
        note: "Lab 4: KEDA autoscaler sẽ tự động kích hoạt số replica tương ứng."
      },
      {
        title: "Restart Container App (Khởi động lại vòng đời)",
        desc: "Tái khởi động tất cả replicas hiện tại để xóa trạng thái lỗi tạm thời (không tạo revision mới):",
        code: "az containerapp restart --name <app-name> --resource-group <rg>",
        note: "Lab 4: Hữu ích khi ứng dụng bị memory leak hoặc dead-lock tạm thời."
      },
      {
        title: "Log Streaming thời gian thực (như tail -f)",
        desc: "Theo dõi luồng log trực tiếp thời gian thực từ container:",
        code: "az containerapp logs show --name <app-name> --resource-group <rg> --follow",
        note: "Lab 4: Cờ --follow (hoặc -f) duy trì kết nối stream liên tục cho đến khi nhấn Ctrl+C."
      },
      {
        title: "Chẩn đoán thiếu biến môi trường: Kiểm tra env vars hiện có",
        desc: "Trích xuất danh sách biến môi trường trong container đầu tiên dưới dạng bảng:",
        code: 'az containerapp show --name <app-name> --resource-group <rg> --query "properties.template.containers[0].env" -o table',
        note: "Lab 4: Chẩn đoán nhanh khi ứng dụng báo lỗi KeyError hoặc Missing Config lúc startup."
      },
      {
        title: "Gây lỗi (mô phỏng): Xóa biến môi trường để test",
        desc: "Gỡ bỏ biến môi trường khỏi Container App (tạo ra Revision mới):",
        code: "az containerapp update --name <app-name> --resource-group <rg> --remove-env-vars <VAR_NAME>",
        note: "Lab 4: Sử dụng trong kịch bản lab mô phỏng lỗi ứng dụng thiếu cấu hình."
      },
      {
        title: "Sửa lỗi: Thêm hoặc cập nhật lại biến môi trường",
        desc: "Thiết lập lại giá trị cho biến môi trường cấu hình:",
        code: "az containerapp update --name <app-name> --resource-group <rg> --set-env-vars <VAR_NAME>=<value>",
        note: "Lab 4: Tự động kích hoạt rolling update sang một Revision mới đã được bổ sung env var."
      },
      {
        title: "Chẩn đoán sai Port: Kiểm tra cấu hình Ingress (targetPort)",
        desc: "Xem toàn bộ cấu hình Ingress bao gồm targetPort dưới định dạng YAML:",
        code: 'az containerapp show --name <app-name> --resource-group <rg> --query "properties.configuration.ingress" -o yaml',
        note: "Lab 4: Nguyên nhân phổ biến gây lỗi 502 Bad Gateway khi Ingress trỏ sai port lắng nghe của app."
      },
      {
        title: "Sửa lỗi Port: Cập nhật lại Target Port cho Ingress",
        desc: "Điều chỉnh lại cổng đích (target-port) mà Ingress router chuyển tiếp lưu lượng vào container:",
        code: "az containerapp ingress update --name <app-name> --resource-group <rg> --target-port <port>",
        note: "Lab 4: Cập nhật cấu hình router ingress tức thì mà không cần rebuild image."
      },
      {
        title: "Lấy Workspace ID của Log Analytics gắn liền với ACA Environment",
        desc: "Trích xuất định danh customerId sạch (-o tsv) để gán vào biến chạy KQL:",
        code: "az containerapp env show --name <env-name> --resource-group <rg> --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId -o tsv",
        note: "Lab 4: Định danh Workspace ID là tham số bắt buộc cho cờ -w trong lệnh az monitor log-analytics query."
      },
      {
        title: "Truy vấn 20 log gần nhất qua KQL (Log Analytics)",
        desc: "Truy vấn log lịch sử từ bảng ContainerAppConsoleLogs_CL ngay cả khi replica đã tắt:",
        code: `az monitor log-analytics query -w $WORKSPACE_ID \\
    --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == '<app-name>' | project TimeGenerated, Log_s | order by TimeGenerated desc | take 20" \\
    -o table`,
        note: "Lab 4: Bảng ContainerAppConsoleLogs_CL lưu trữ toàn bộ stdout/stderr của Azure Container Apps."
      },
      {
        title: "Truy vấn log lỗi qua KQL (Error Filter)",
        desc: "Lọc nhanh các dòng nhật ký có chứa chuỗi 'error' trong 20 bản ghi mới nhất:",
        code: `az monitor log-analytics query -w $WORKSPACE_ID \\
    --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == '<app-name>' and Log_s contains 'error' | order by TimeGenerated desc | take 20" \\
    -o table`,
        note: "Lab 4: Toán tử contains trong KQL không phân biệt chữ hoa chữ thường."
      },
      {
        title: "Xem cấu hình Health Probes hiện tại (Readiness / Liveness)",
        desc: "Kiểm tra cấu hình probe thăm dò sức khỏe của container dưới dạng YAML:",
        code: 'az containerapp show --name <app-name> --resource-group <rg> --query "properties.template.containers[0].probes" -o yaml',
        note: "Lý thuyết: Liveness probe xác định khi nào cần restart container; Readiness probe xác định khi nào container sẵn sàng nhận traffic."
      },
      {
        title: "Khởi tạo Container App với System Managed Identity & Secrets (Lab 1 ACA)",
        desc: "Tạo Container App với System-assigned Managed Identity. Cờ --registry-identity system tự động gán quyền AcrPull cho identity:",
        code: `az containerapp create \\
    --name <app-name> \\
    --resource-group <rg> \\
    --environment <env-name> \\
    --image <registry>/<image> \\
    --ingress external \\
    --target-port <port> \\
    --env-vars MODEL_NAME=$MODEL_NAME \\
    --registry-server <registry> \\
    --registry-identity system`,
        note: "Lab 1 (ACA): Cờ --registry-identity system tự động gán quyền AcrPull cho identity mà không cần cấu hình admin user."
      },
      {
        title: "Tạo secret trong kho secrets của ACA (Lab 1 ACA)",
        desc: "Tạo secret trong kho secrets của ACA (được mã hóa khi lưu trữ):",
        code: "az containerapp secret set -n <app-name> -g <rg> --secrets <secret-name>=<secret-value>",
        note: "Lab 1 (ACA): Secrets được mã hóa an toàn ở tầng ứng dụng, không xuất hiện ở dạng plain text."
      },
      {
        title: "Tham chiếu secret từ biến môi trường (secretref:)",
        desc: "Tham chiếu secret từ biến môi trường bằng cú pháp secretref: (tự động tạo revision mới):",
        code: "az containerapp update -n <app-name> -g <rg> --set-env-vars <ENV_VAR>=secretref:<secret-name>",
        note: "Lab 1 (ACA): Cú pháp secretref:<secret-name> liên kết biến môi trường trực tiếp với secret trong kho."
      },
      {
        title: "Lấy FQDN tên miền đầy đủ của Container App",
        desc: "Lấy FQDN (tên miền đầy đủ) của Container App gán vào biến PowerShell:",
        code: "$FQDN = az containerapp show -n <app-name> -g <rg> --query properties.configuration.ingress.fqdn -o tsv",
        note: "Lab 1 (ACA): Dùng -o tsv để trích xuất chuỗi thô sạch, không có dấu ngoặc kép."
      },
      {
        title: "Kiểm tra Health Endpoint bằng Invoke-RestMethod",
        desc: "Gọi health endpoint để kiểm tra ứng dụng backend API đã chạy hay chưa:",
        code: 'Invoke-RestMethod -Uri "https://$FQDN/health"',
        note: "Lab 1 (ACA): Kiểm tra sức khỏe dịch vụ trước khi gửi traffic chính thức."
      },
      {
        title: "Kiểm tra Root Endpoint & Cấu hình Secret",
        desc: "Gọi root endpoint để kiểm tra secret và app đã được cấu hình hoàn chỉnh chưa:",
        code: 'Invoke-RestMethod -Uri "https://$FQDN/"',
        note: "Lab 1 (ACA): Xác minh secret đã được ứng dụng đọc thành công."
      },
      {
        title: "Test Document Processing Endpoint (Gửi file lên xử lý)",
        desc: "Gửi request HTTP POST kèm nội dung file văn bản qua Get-Content -Raw:",
        code: 'Invoke-RestMethod -Uri "https://$FQDN/process" -Method Post -ContentType "text/plain" -Body (Get-Content -Raw document.txt)',
        note: "Lab 1 (ACA): Biểu thức (Get-Content -Raw document.txt) nạp toàn bộ file thành chuỗi duy nhất gửi qua body."
      },
      {
        title: "Kiểm tra Managed Identity đã được bật chưa",
        desc: "Kiểm tra xem System-Assigned Managed Identity của app đã được kích hoạt chưa:",
        code: "az containerapp identity show -n <app-name> -g <rg>",
        note: "Lab 1 (ACA): Xác minh principalId và tenantId khi gặp lỗi 401 Unauthorized kéo image từ ACR."
      },
      {
        title: "Liệt kê secrets để xác nhận secret đã được tạo",
        desc: "Liệt kê danh sách tên secrets trong kho của ACA dưới dạng bảng:",
        code: "az containerapp secret list -n <app-name> -g <rg> -o table",
        note: "Lab 1 (ACA): Xác nhận tên secret tồn tại và khớp với tên trong secretref:."
      },
      {
        title: "Stream logs real-time chẩn đoán lỗi khởi động",
        desc: "Stream logs real-time để chẩn đoán lỗi khởi động ứng dụng container:",
        code: "az containerapp logs show -n <app-name> -g <rg> --follow",
        note: "Lab 1 (ACA): Luồng log thời gian thực giúp phát hiện ngay các lỗi thiếu secret hoặc crash ứng dụng."
      },
      {
        title: "Cài đặt extension Container App hỗ trợ Preview (Lab Dynamic Sessions)",
        desc: "Cài đặt/cập nhật extension Container App (cần cho Dynamic Sessions preview):",
        code: "az extension add --name containerapp --upgrade --allow-preview true --yes",
        note: "Lab Dynamic Sessions: Module containerapp bản preview hỗ trợ các nhóm lệnh sessionpool."
      },
      {
        title: "Khởi tạo Session Pool cho Python Code Interpreter (Lab Dynamic Sessions)",
        desc: "Tạo Session Pool cho Python code interpreter với sandbox cô lập mạng:",
        code: `az containerapp sessionpool create \\
    --name <pool-name> \\
    --resource-group <rg> \\
    --location <region> \\
    --container-type PythonLTS \\
    --max-sessions 5 \\
    --cooldown-period 300 \\
    --network-status EgressDisabled`,
        note: "Lab Dynamic Sessions: --network-status EgressDisabled chặn toàn bộ egress ra Internet, bảo vệ an toàn khi chạy mã do LLM sinh ra."
      },
      {
        title: "Gán role Azure ContainerApps Session Executor cho AI Agent (Lab Dynamic Sessions)",
        desc: "Gán role cho phép thực thi code trong session pool:",
        code: 'az role assignment create --assignee <principal-id> --role "Azure ContainerApps Session Executor" --scope <session-pool-id>',
        note: "Lab Dynamic Sessions: Cấp quyền tối thiểu cho phép agent tạo phiên và thực thi code trong sandbox."
      }
    ]
  }
];

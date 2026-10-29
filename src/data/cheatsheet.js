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
  },
  {
    id: "level-7-aks",
    title: "Level 7: Azure Kubernetes Service (AKS) - Cấu hình nâng cao (Bài Lab AKS Configure - 15 bài)",
    badge: "Level 7",
    summary: "Thực hành cấu hình Kubernetes chuyên sâu: Quản trị workload kubectl cơ bản, ConfigMap lưu cấu hình, Secrets bảo mật credentials và PersistentVolumeClaim lưu trữ log bền vững.",
    items: [
      // --- Phần A: kubectl cơ bản (5 bài) ---
      {
        title: "1. Lấy Credentials AKS & Cấu hình kubectl",
        desc: "Tải chứng thực cluster về máy và tự động merge vào ~/.kube/config để giao tiếp với AKS API Server:",
        code: "az aks get-credentials --resource-group <rg> --name <cluster-name>",
        note: "Lab AKS (Phần A): Sau lệnh này, kubectl sẽ tự động trỏ đến cụm AKS vừa tạo. Thêm cờ --overwrite-existing nếu bị xung đột context cũ."
      },
      {
        title: "2. Kiểm tra trạng thái Deployment & Service",
        desc: "Liệt kê nhanh tất cả Deployment và Service đang chạy trong namespace hiện tại:",
        code: "kubectl get deploy,svc",
        note: "Lab AKS (Phần A): Cột READY (1/1) cho biết số replica sẵn sàng. Cột EXTERNAL-IP của Service LoadBalancer sẽ cung cấp IP công khai."
      },
      {
        title: "3. Kiểm tra tiến trình Rollout Deployment",
        desc: "Theo dõi tiến trình rolling update của Deployment aks-config-api cho đến khi hoàn tất:",
        code: "kubectl rollout status deploy/aks-config-api",
        note: "Lab AKS (Phần A): Lệnh này chặn terminal cho đến khi các replica cập nhật hoàn tất hoặc báo lỗi nếu timeout/crash."
      },
      {
        title: "4. Liệt kê tất cả Pod đang chạy",
        desc: "Xem danh sách pod, trạng thái thực thi (Running/Pending/CrashLoopBackOff) và số lần restart:",
        code: "kubectl get pods",
        note: "Lab AKS (Phần A): Thêm cờ -o wide để xem thêm địa chỉ IP nội bộ và tên Node k8s mà Pod đang được phân bổ."
      },
      {
        title: "5. Xem Log của Pod (stdout/stderr)",
        desc: "Đọc nhật ký xuất chuẩn từ container bên trong Pod:",
        code: "kubectl logs <pod-name>",
        note: "Lab AKS (Phần A): Thêm cờ -f để stream log theo thời gian thực (real-time stream). Thêm --previous để đọc log trước khi Pod bị restart."
      },

      // --- Phần B: ConfigMap (4 bài) ---
      {
        title: "6. Tạo ConfigMap từ file YAML",
        desc: "Khởi tạo tài nguyên ConfigMap từ file manifest k8s/configmap.yaml:",
        code: "kubectl apply -f k8s/configmap.yaml",
        note: "Lab AKS (Phần B): Chứa các biến cấu hình không nhạy cảm như STUDENT_NAME, API_VERSION và LOG_PATH."
      },
      {
        title: "7. Xem danh sách ConfigMap trong Cluster",
        desc: "Liệt kê tất cả ConfigMap đang có trong namespace:",
        code: "kubectl get configmap",
        note: "Lab AKS (Phần B): Có thể viết tắt là 'kubectl get cm'. Cột DATA cho biết số lượng cặp key-value được lưu trữ."
      },
      {
        title: "8. Xem chi tiết cấu hình ConfigMap",
        desc: "Hiển thị toàn bộ dữ liệu key-value và metadata của ConfigMap api-config:",
        code: "kubectl describe configmap api-config",
        note: "Lab AKS (Phần B): Dùng để xác minh các giá trị cấu hình STUDENT_NAME và LOG_PATH đã nạp đúng định dạng."
      },
      {
        title: "9. Rolling Restart Deployment nạp lại cấu hình",
        desc: "Khởi động lại tuần tự các replica của Deployment để nạp lại biến từ ConfigMap vừa sửa:",
        code: "kubectl rollout restart deployment aks-config-api",
        note: "Lab AKS (Phần B): Khi cập nhật ConfigMap, Pod không tự động cập nhật biến môi trường, lệnh này kích hoạt rolling update an toàn zero-downtime."
      },

      // --- Phần C: Secrets (3 bài) ---
      {
        title: "10. Tạo Secret từ file YAML",
        desc: "Khởi tạo tài nguyên Secret từ manifest k8s/secrets.yaml:",
        code: "kubectl apply -f k8s/secrets.yaml",
        note: "Lab AKS (Phần C): Sử dụng trường stringData để k8s tự động mã hóa chuỗi nhạy cảm sang định dạng base64 trong cluster."
      },
      {
        title: "11. Xem danh sách Secrets trong Cluster",
        desc: "Liệt kê các Secret đang hoạt động trong namespace:",
        code: "kubectl get secrets",
        note: "Lab AKS (Phần C): Cột TYPE (Opaque) và DATA (số lượng key bí mật đã lưu như secret-endpoint, secret-access-key)."
      },
      {
        title: "12. Trích xuất và Decode Secret Base64",
        desc: "Lấy giá trị mã hóa base64 của key bí mật bằng JSONPath:",
        code: "kubectl get secret api-secrets -o jsonpath=\"{.data.secret-endpoint}\"",
        note: "Lab AKS (Phần C): Trên terminal Linux/macOS có thể pipe tiếp `| base64 --decode` hoặc PowerShell `[System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String(...))` để giải mã."
      },

      // --- Phần D: PersistentVolumeClaim (3 bài) ---
      {
        title: "13. Tạo PersistentVolumeClaim từ file YAML",
        desc: "Yêu cầu cấp phát vùng lưu trữ đĩa Azure Disk bền vững từ manifest k8s/pvc.yaml:",
        code: "kubectl apply -f k8s/pvc.yaml",
        note: "Lab AKS (Phần D): Yêu cầu volume 1Gi với storageClassName: managed-csi và accessModes: ReadWriteOnce."
      },
      {
        title: "14. Kiểm tra trạng thái PersistentVolumeClaim",
        desc: "Xem danh sách và trạng thái gắn kết (Bound / Pending) của các PVC:",
        code: "kubectl get pvc",
        note: "Lab AKS (Phần D): Trạng thái 'Bound' xác nhận Azure Disk CSI driver đã cấp phát thành công Volume và gắn kết với PVC."
      },
      {
        title: "15. Xem chi tiết thông số PVC & Azure Disk Storage",
        desc: "Kiểm tra chi tiết volume capacity, access modes, storage class và events của PVC api-logs-pvc:",
        code: "kubectl describe pvc api-logs-pvc",
        note: "Lab AKS (Phần D): Dùng để xác minh volume đã sẵn sàng được mount vào đường dẫn /var/log/api bên trong Pod container."
      }
    ]
  },
  {
    id: "level-8-cosmosdb-vector",
    title: "Level 8: Azure Cosmos DB Vector Search & NoSQL",
    badge: "Level 8",
    summary: "Toàn bộ câu lệnh Azure CLI quản trị Cosmos DB NoSQL Serverless, cấu hình Vector Search, DiskANN Indexing, Policies JSON và phân quyền Data Plane Entra ID.",
    items: [
      {
        title: "1. Kiểm tra tính duy nhất toàn cầu của tên tài khoản",
        desc: "Tên tài khoản Cosmos DB dùng để tạo DNS public (*.documents.azure.com) nên phải kiểm tra xem có bị trùng hay chưa:",
        code: "az cosmosdb check-name-exists --name $env:COSMOS_ACCOUNT",
        note: "Kết quả trả về 'false' nghĩa là tên khả dụng, 'true' nghĩa là tên đã bị sử dụng."
      },
      {
        title: "2. Tạo tài khoản Cosmos DB NoSQL với Serverless & Vector Search",
        desc: "Khởi tạo tài khoản NoSQL tối ưu chi phí (Serverless), hỗ trợ tìm kiếm vector và mức nhất quán Session:",
        code: `az cosmosdb create \\
  --resource-group $env:RESOURCE_GROUP \\
  --name $env:COSMOS_ACCOUNT \\
  --locations regionName=southeastasia \\
  --capabilities EnableServerless EnableNoSQLVectorSearch \\
  --default-consistency-level Session`,
        note: "Bắt buộc cờ `--capabilities EnableNoSQLVectorSearch` để mở khóa DiskANN và hàm VectorDistance."
      },
      {
        title: "3. Xác minh tính năng Vector Search đã kích hoạt",
        desc: "Trích xuất danh sách các capabilities đã bật dưới dạng text thuần:",
        code: `az cosmosdb show \\
  --resource-group $env:RESOURCE_GROUP \\
  --name $env:COSMOS_ACCOUNT \\
  --query "capabilities[].name" \\
  -o tsv`,
        note: "Phải xuất hiện cả `EnableServerless` và `EnableNoSQLVectorSearch`."
      },
      {
        title: "4. Tạo Database NoSQL (vectorstore)",
        desc: "Tạo database quản lý logic bên trong tài khoản Cosmos DB:",
        code: `az cosmosdb sql database create \\
  --resource-group $env:RESOURCE_GROUP \\
  --account-name $env:COSMOS_ACCOUNT \\
  --name vectorstore`,
        note: "Dùng để gom nhóm các container chứa dữ liệu vector và metadata."
      },
      {
        title: "5. Tạo Container với Vector Embedding & DiskANN Indexing Policies",
        desc: "Tạo container có partition key /documentId kèm chính sách vector DiskANN và cấu hình embedding:",
        code: `az cosmosdb sql container create \\
  --resource-group $env:RESOURCE_GROUP \\
  --account-name $env:COSMOS_ACCOUNT \\
  --database-name vectorstore \\
  --name vectors \\
  --partition-key-path /documentId \\
  --idx @indexing-policy.json \\
  --vector-embeddings @embedding-policy.json`,
        note: "Điểm thi AI-200 then chốt: Mảng /embedding/* bắt buộc phải loại trừ trong excludedPaths của indexing policy để tránh chỉ mục B-tree tiêu tốn RU/s."
      },
      {
        title: "6. Lấy Resource ID làm Scope cho RBAC",
        desc: "Lấy Resource ID đầy đủ sạch (không chứa dấu nháy kép) để làm scope phân quyền:",
        code: `$COSMOS_ID = az cosmosdb show --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --query id -o tsv`,
        note: "Resource ID này được sử dụng chung cho cả Azure ARM RBAC và Cosmos DB SQL RBAC."
      },
      {
        title: "7. Phân quyền Control Plane (Azure RBAC Contributor)",
        desc: "Cấp quyền cho người dùng/app quản lý tài nguyên (tạo/sửa/xóa database, container):",
        code: `az role assignment create \\
  --assignee $USER_ID \\
  --scope $COSMOS_ID \\
  --role Contributor`,
        note: "⚠️ Lưu ý thi AI-200: Quyền Contributor này KHÔNG cấp quyền đọc/ghi dữ liệu hay chạy câu lệnh Vector Search bên trong container."
      },
      {
        title: "8. Phân quyền Data Plane (Cosmos DB Built-in Data Contributor)",
        desc: "Cấp quyền đọc/ghi dữ liệu và thực thi Vector Search truy vấn SQL không cần dùng master key:",
        code: `az cosmosdb sql role assignment create \\
  --resource-group $env:RESOURCE_GROUP \\
  --account-name $env:COSMOS_ACCOUNT \\
  --role-definition-name "Cosmos DB Built-in Data Contributor" \\
  --principal-id $USER_ID \\
  --scope $COSMOS_ID`,
        note: "Chuẩn thiết kế Zero Trust: Cho phép DefaultAzureCredential() trong Python SDK tương tác trực tiếp với dữ liệu."
      },
      {
        title: "9. Lấy Document Endpoint sạch cấu hình SDK",
        desc: "Trích xuất URL documentEndpoint để nạp vào biến môi trường COSMOS_ENDPOINT:",
        code: `$COSMOS_ENDPOINT = az cosmosdb show --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --query documentEndpoint -o tsv`,
        note: "URL có dạng: https://<account-name>.documents.azure.com:443/."
      },
      {
        title: "10. Xóa tài khoản Cosmos DB giải phóng chi phí",
        desc: "Xóa tài khoản Cosmos DB cùng mọi cơ sở dữ liệu và container với cờ xác nhận tự động:",
        code: `az cosmosdb delete --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --yes`,
        note: "Sau khi xóa, tên tài khoản sẽ được hệ thống Azure giải phóng trong vài phút."
      },
      {
        title: "11. Tạo Container Chunks cho RAG với Partition Key /documentId",
        desc: "Tạo container NoSQL tối ưu hóa cho ứng dụng RAG (Retrieval-Augmented Generation):",
        code: `az cosmosdb sql container create \\
  --resource-group $env:RESOURCE_GROUP \\
  --account-name $env:COSMOS_ACCOUNT \\
  --database-name ragstore \\
  --name chunks \\
  --partition-key-path /documentId`,
        note: "Chọn /documentId làm partition key giúp toàn bộ chunks của 1 tài liệu nằm chung 1 phân vùng vật lý, tối ưu chi phí truy vấn xuống chỉ ~2.5 RU."
      },
      {
        title: "12. Liệt kê các Container trong Database NoSQL",
        desc: "Hiển thị danh sách các container trong database dưới dạng bảng:",
        code: `az cosmosdb sql container list \\
  --resource-group $env:RESOURCE_GROUP \\
  --account-name $env:COSMOS_ACCOUNT \\
  --database-name ragstore \\
  -o table`,
        note: "Dùng để kiểm tra nhanh các container đã tạo và đường dẫn partition key của từng container."
      },
      {
        title: "13. Xem cấu hình Throughput (RU/s) của Container",
        desc: "Kiểm tra số lượng Request Units được cấp phát hoặc trạng thái Serverless của container:",
        code: `az cosmosdb sql container throughput show \\
  --resource-group $env:RESOURCE_GROUP \\
  --account-name $env:COSMOS_ACCOUNT \\
  --database-name ragstore \\
  --name chunks`,
        note: "Nếu tài khoản ở chế độ Serverless (EnableServerless), lệnh này sẽ báo tài nguyên không áp dụng throughput cố định."
      },
      {
        title: "14. Chiến lược tối ưu hóa RU cho RAG & AI Queries (Point Read vs Query)",
        desc: "So sánh 3 mô hình truy xuất dữ liệu trong Cosmos DB NoSQL:",
        code: `# 1. Point Read (Đọc trực tiếp qua ID + Partition Key):
item = container.read_item(item="chunk-0", partition_key="doc-001") # Đúng 1.0 RU (< 5ms)

# 2. In-Partition Query (Lọc theo Partition Key, không Fan-out):
SELECT * FROM c WHERE c.documentId = 'doc-001' # ~2.5 - 3.5 RU

# 3. Cross-Partition Search (Lọc theo mảng tags hoặc category toàn cục):
SELECT * FROM c WHERE ARRAY_CONTAINS(c.metadata.tags, 'nosql') # 10 - 20+ RU (Fan-out)`,
        note: "💡 Điểm thi AI-200: Point Read luôn là phương pháp truy xuất rẻ nhất và nhanh nhất (1.0 RU cho item <= 1KB)."
      },
      {
        title: "15. So sánh 3 Chiến lược Vector Index trong Cosmos DB NoSQL",
        desc: "Lựa chọn loại chỉ mục vector phù hợp dựa trên quy mô dữ liệu và yêu cầu độ chính xác:",
        code: `# 1. 'flat':
# - Thuật toán: Exact Nearest Neighbor (k-NN, so khớp vét cạn toàn bộ vector).
# - Độ chính xác: 100% recall.
# - Phù hợp: Tập dữ liệu nhỏ (< 5,000 vectors). Chi phí RU tăng tuyến tính theo số lượng vector.

# 2. 'quantizedFlat':
# - Thuật toán: Nén vector bằng Scalar Quantization, giảm kích thước bộ nhớ.
# - Độ chính xác: Cao (xấp xỉ gần như tuyệt đối).
# - Phù hợp: Tập dữ liệu trung bình (10,000 - 100,000 vectors), tiết kiệm RAM.

# 3. 'diskANN':
# - Thuật toán: Graph-based Approximate Nearest Neighbor (ANN) của Microsoft Research.
# - Độ chính xác: 95%+ recall, độ trễ cực thấp trên ổ SSD.
# - Phù hợp: Chuẩn Production, tập dữ liệu lớn (> 100,000 vectors). Chi phí RU thấp nhất.`,
        note: "Các hàm khoảng cách hỗ trợ: `cosine` (mặc định), `dotproduct`, `euclidean`. Chiều tối đa: 4096 dimensions."
      },
      {
        title: "16. Tạo Container với Chỉ mục quantizedFlat (Nén Vector)",
        desc: "Khởi tạo container sử dụng loại chỉ mục quantizedFlat tối ưu bộ nhớ:",
        code: `az cosmosdb sql container create \\
  --resource-group $env:RESOURCE_GROUP \\
  --account-name $env:COSMOS_ACCOUNT \\
  --database-name indexoptimize \\
  --name vectors-quantized \\
  --partition-key-path /documentId \\
  --idx @indexing-policy-quantized.json \\
  --vector-embeddings @embedding-policy.json`,
        note: "Tệp indexing policy JSON cấu hình type là 'quantizedFlat' và loại trừ /embedding/* khỏi B-tree."
      },
      {
        title: "17. Kiểm tra Cấu hình Vector Index Policy bằng JMESPath",
        desc: "Trích xuất mảng vectorIndexes của container để xác minh loại chỉ mục đang hoạt động:",
        code: `az cosmosdb sql container show \\
  --resource-group $env:RESOURCE_GROUP \\
  --account-name $env:COSMOS_ACCOUNT \\
  --database-name indexoptimize \\
  --name vectors-quantized \\
  --query "indexingPolicy.vectorIndexes"`,
        note: "Trả về: [{\"path\": \"/embedding\", \"type\": \"quantizedFlat\"}]."
      }
    ]
  }
];

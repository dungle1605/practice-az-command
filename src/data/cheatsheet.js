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
  },
  {
    id: "level-9-postgresql",
    title: "🐘 Level 9: Azure Database for PostgreSQL Flexible Server & pgvector",
    badge: "Level 9: PostgreSQL",
    summary: "Cẩm nang toàn diện triển khai máy chủ PostgreSQL Flexible Server, cấu hình tiện ích pgvector, xác thực Microsoft Entra ID không mật khẩu, tinh chỉnh chỉ mục HNSW vs IVFFlat và quản lý bộ nhớ AI Agent.",
    items: [
      {
        title: "1. Đăng ký Resource Provider Microsoft.DBforPostgreSQL",
        desc: "Kích hoạt quyền tạo tài nguyên PostgreSQL trên subscription:",
        code: "az provider register --namespace Microsoft.DBforPostgreSQL",
        note: "Tránh lỗi ProviderNotRegistered khi chạy lệnh tạo Flexible Server."
      },
      {
        title: "2. Tạo PostgreSQL Flexible Server với Entra Authentication",
        desc: "Khởi tạo máy chủ với SKU Burstable B1ms, PostgreSQL 16 và bật xác thực kép:",
        code: `az postgres flexible-server create \\
  --resource-group $env:RG \\
  --name $env:PG_SERVER \\
  --location $env:LOCATION \\
  --sku-name Standard_B1ms \\
  --tier Burstable \\
  --storage-size 32 \\
  --version 16 \\
  --public-access Enabled \\
  --microsoft-entra-auth Enabled \\
  --password-auth Enabled \\
  --admin-user pgadmin \\
  --admin-password $env:ADMIN_PASSWORD \\
  --yes`,
        note: "Khởi tạo ban đầu với password-auth Enabled để hoàn tất bootstrap, sau đó cấu hình Entra Admin và vô hiệu hóa mật khẩu tĩnh."
      },
      {
        title: "3. Cấu hình Microsoft Entra Administrator (User / Managed Identity)",
        desc: "Gán quyền quản trị viên cấp cao Entra ID cho tài khoản hiện tại:",
        code: `az postgres flexible-server microsoft-entra-admin create \\
  --resource-group $env:RG \\
  --server-name $env:PG_SERVER \\
  --display-name $env:USER_UPN \\
  --object-id $env:USER_OBJECT_ID \\
  --type User`,
        note: "Tài khoản Entra Admin có quyền tương đương superuser trong PostgreSQL và đăng nhập qua token."
      },
      {
        title: "4. Vô hiệu hóa Xác thực Mật khẩu (Zero-Trust Enforced)",
        desc: "Khóa cổng đăng nhập bằng mật khẩu tĩnh, chỉ chấp nhận Entra ID Token:",
        code: `az postgres flexible-server update \\
  --resource-group $env:RG \\
  --name $env:PG_SERVER \\
  --microsoft-entra-auth Enabled \\
  --password-auth Disabled \\
  --yes`,
        note: "💡 Điểm thi AI-200: Loại bỏ hoàn toàn nguy cơ lộ lọt credential trong code hoặc configuration."
      },
      {
        title: "5. Tạo Firewall Rule Cho phép Kết nối Mạng (AllowAll / Client IP)",
        desc: "Mở cổng 5432 cho kết nối từ máy trạm hoặc ứng dụng:",
        code: `az postgres flexible-server firewall-rule create \\
  --resource-group $env:RG \\
  --server-name $env:PG_SERVER \\
  --name AllowAll \\
  --start-ip-address 0.0.0.0 \\
  --end-ip-address 255.255.255.255`,
        note: "Trong môi trường Production thực tế, chỉ cho phép dải IP cụ thể hoặc dùng Private Endpoint."
      },
      {
        title: "6. Allow-list Tiện ích pgvector trong tham số azure.extensions",
        desc: "Cấp phép tiện ích vector ở cấp độ máy chủ trước khi kích hoạt trong SQL:",
        code: `az postgres flexible-server parameter set \\
  --resource-group $env:RG \\
  --server-name $env:PG_SERVER \\
  --name azure.extensions \\
  --value vector`,
        note: "Bắt buộc thực hiện trước khi chạy 'CREATE EXTENSION vector;'. Máy chủ có thể cần khởi động lại để áp dụng."
      },
      {
        title: "7. Lấy Access Token Entra ID cho PostgreSQL (--resource-type oss-rdbms)",
        desc: "Trích xuất Bearer token ngắn hạn để đăng nhập psql hoặc ứng dụng Python:",
        code: `$env:PGPASSWORD = az account get-access-token \\
  --resource-type oss-rdbms \\
  --query accessToken -o tsv`,
        note: "Token có thời hạn khoảng 60 phút. Scope chuẩn: https://ossrdbms-aad.database.windows.net/.default."
      },
      {
        title: "8. Tạo Cơ sở Dữ liệu Mới trên Flexible Server (agent_memory)",
        desc: "Khởi tạo database độc lập dành riêng cho AI Agent:",
        code: `az postgres flexible-server db create \\
  --resource-group $env:RG \\
  --server-name $env:PG_SERVER \\
  --database-name agent_memory`,
        note: "Database mới thừa hưởng toàn bộ thiết lập bảo mật và extension allow-list từ server."
      },
      {
        title: "9. Kết nối bằng psql với Entra ID & SSL Mode Bắt buộc",
        desc: "Chuỗi kết nối dòng lệnh chuẩn sử dụng biến môi trường:",
        code: `psql "host=$env:DB_HOST port=5432 dbname=postgres user=$env:DB_USER sslmode=require"`,
        note: "psql tự động sử dụng giá trị trong $env:PGPASSWORD làm mật khẩu xác thực."
      },
      {
        title: "10. Bật Extension pgvector & Tạo Cột vector(n)",
        desc: "Cú pháp SQL định nghĩa bảng với cột vector embedding:",
        code: `CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    embedding vector(384) -- 384 dimensions
);`,
        note: "Kiểu vector(384) tương thích hoàn hảo với mô hình Sentence Transformers all-MiniLM-L6-v2."
      },
      {
        title: "11. Tạo Chỉ mục HNSW & Tinh chỉnh hnsw.ef_search",
        desc: "Chỉ mục đồ thị phân tầng cho hiệu năng tìm kiếm cao nhất:",
        code: `-- 1. Tăng RAM bảo trì tạo index:
SET maintenance_work_mem = '256MB';

-- 2. Tạo chỉ mục HNSW (m=16 liên kết, ef_construction=64 ứng viên build):
CREATE INDEX idx_products_embedding_hnsw
ON products USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 3. Tinh chỉnh độ chính xác truy vấn (mặc định 40, tăng lên 100):
SET hnsw.ef_search = 100;`,
        note: "💡 Điểm thi AI-200: HNSW hỗ trợ cập nhật dữ liệu tăng dần mà không cần REINDEX, truy vấn < 5ms."
      },
      {
        title: "12. Tạo Chỉ mục IVFFlat & Tinh chỉnh ivfflat.probes",
        desc: "Chỉ mục phân cụm Inverted File tiết kiệm bộ nhớ:",
        code: `-- 1. Tạo chỉ mục IVFFlat (lists = rows / 1000):
CREATE INDEX idx_products_embedding_ivfflat
ON products USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 2. Tinh chỉnh số cụm quét lúc truy vấn (mặc định 1):
SET ivfflat.probes = 10;`,
        note: "Chỉ nên tạo IVFFlat khi bảng đã có sẵn dữ liệu để thuật toán k-means phân cụm chính xác."
      },
      {
        title: "13. Ba Toán tử Khoảng cách Vector trong pgvector",
        desc: "Bảng tra cứu cú pháp và lớp toán tử tương ứng:",
        code: `# 1. Cosine Distance: <=> (toán tử lớp: vector_cosine_ops)
SELECT * FROM products ORDER BY embedding <=> $query_vector LIMIT 5;

# 2. L2 Euclidean Distance: <-> (toán tử lớp: vector_l2_ops)
SELECT * FROM products ORDER BY embedding <-> $query_vector LIMIT 5;

# 3. Negative Inner Product: <#> (toán tử lớp: vector_ip_ops)
SELECT * FROM products ORDER BY embedding <#> $query_vector LIMIT 5;`,
        note: "Cosine Distance (<=>) là chuẩn mực cho tìm kiếm tương đồng văn bản vì không phụ thuộc độ dài vector."
      },
      {
        title: "14. Chẩn đoán Kế hoạch Thực thi với EXPLAIN ANALYZE",
        desc: "Kiểm tra chi tiết nút kế hoạch thực thi và thời gian chạy thực tế:",
        code: `EXPLAIN ANALYZE
SELECT id, name, embedding <=> (SELECT embedding FROM query_vectors) AS distance
FROM products
ORDER BY embedding <=> (SELECT embedding FROM query_vectors)
LIMIT 10;`,
        note: "Seq Scan: ~246ms (100k hàng) -> Index Scan (HNSW): ~3.2ms (cải thiện hơn 70 lần)."
      },
      {
        title: "15. Hybrid Search: Kết hợp Chỉ mục B-tree với Vector Distance",
        desc: "Lọc thuộc tính metadata trước khi xếp hạng tương đồng ngữ nghĩa:",
        code: `CREATE INDEX idx_products_category_price ON products (category_id, price);

EXPLAIN ANALYZE
SELECT id, name, price, embedding <=> $query_vector AS distance
FROM products
WHERE category_id = 5 AND price BETWEEN 100 AND 200
ORDER BY embedding <=> $query_vector
LIMIT 10;`,
        note: "Planner sử dụng Bitmap Index Scan từ B-tree để thu hẹp tập ứng viên rồi tính toán khoảng cách vector."
      },
      {
        title: "16. AI Agent Memory: Lưu Checkpoint với Idempotent ON CONFLICT",
        desc: "Cú pháp atomic upsert lưu vết trạng thái tác vụ của mô hình AI:",
        code: `INSERT INTO task_checkpoints (conversation_id, task_name, status, checkpoint_data)
VALUES (1, 'research_postgresql', 'in_progress', '{"step": 2, "sources": 3}'::jsonb)
ON CONFLICT (conversation_id, task_name)
DO UPDATE SET
    status = EXCLUDED.status,
    checkpoint_data = EXCLUDED.checkpoint_data,
    updated_at = CURRENT_TIMESTAMP
RETURNING id, updated_at;`,
        note: "Đảm bảo Agent có thể tiếp tục công việc ngay tại điểm dừng khi hệ thống khởi động lại."
      }
    ]
  }
,
  {
    id: "level-10",
    title: "Level 10: Azure Managed Redis & RediSearch Vector",
    badge: "Level 10",
    summary: "Cẩm nang toàn diện: Azure CLI az redisenterprise, bảo mật Microsoft Entra ID, Hash Caching, Pub/Sub thời gian thực, RediSearch HNSW Vector KNN và Hybrid Search.",
    items: [
      {
        title: "1. Đăng ký Microsoft.Cache Resource Provider",
        desc: "Kích hoạt nhà cung cấp dịch vụ Redis trên Azure Subscription:",
        code: "az provider register --namespace Microsoft.Cache",
        note: "Bắt buộc thực hiện trước khi tạo bất kỳ cụm Azure Managed Redis nào."
      },
      {
        title: "2. Tạo Cluster Cấp Enterprise (Two-Phase Provisioning)",
        desc: "Khởi tạo cụm cluster rỗng với cờ --no-database:",
        code: `az redisenterprise create \
  --resource-group $env:RG \
  --name $env:REDIS_NAME \
  --location eastus \
  --sku Enterprise_E10 \
  --no-database`,
        note: "Enterprise tier tách biệt giai đoạn tạo cụm phần cứng (cluster) và cấu hình cơ sở dữ liệu (database)."
      },
      {
        title: "3. Khởi tạo Database Mặc định với Cổng 10000 TLS",
        desc: "Tạo database tên 'default' với chính sách EnterpriseCluster và Eviction:",
        code: `az redisenterprise database create \
  --resource-group $env:RG \
  --cluster-name $env:REDIS_NAME \
  --database-name default \
  --client-protocol Encrypted \
  --port 10000 \
  --clustering-policy EnterpriseCluster \
  --eviction-policy VolatileLRU`,
        note: "AMR Enterprise bắt buộc client-protocol Encrypted (TLS) và sử dụng cổng 10000 thay vì 6379."
      },
      {
        title: "4. Gán Quyền Microsoft Entra ID Không Dùng Mật Khẩu",
        desc: "Cấp quyền cho Service Principal hoặc User Object ID truy cập Redis:",
        code: `az redisenterprise database access-policy-assignment create \
  --resource-group $env:RG \
  --cluster-name $env:REDIS_NAME \
  --database-name default \
  --access-policy-name default \
  --name entra-assignment \
  --object-id $USER_OID`,
        note: "Loại bỏ hoàn toàn rủi ro lộ lọt Access Keys tĩnh; tự động xác thực qua token OAuth Bearer."
      },
      {
        title: "5. Lấy Hostname FQDN Để Kết Nối Ứng Dụng",
        desc: "Trích xuất chuỗi kết nối sạch bằng -o tsv:",
        code: `az redisenterprise show \
  --resource-group $env:RG \
  --name $env:REDIS_NAME \
  --query hostName -o tsv`,
        note: "FQDN có dạng: <name>.<region>.redisenterprise.cache.azure.net"
      },
      {
        title: "6. Cập Nhật Chính Sách Eviction Khi Đầy RAM",
        desc: "Thay đổi chính sách giải phóng bộ nhớ (ví dụ: AllKeysLRU):",
        code: `az redisenterprise database update \
  --resource-group $env:RG \
  --cluster-name $env:REDIS_NAME \
  --database-name default \
  --eviction-policy AllKeysLRU`,
        note: "AllKeysLRU phù hợp nhất cho kịch bản hệ thống thuần túy làm cache tầng trước DB."
      },
      {
        title: "7. Xóa Toàn Bộ Dữ Liệu Cache Bằng Flush",
        desc: "Dọn dẹp sạch sẽ toàn bộ keyspace mà không cần xóa database:",
        code: `az redisenterprise database flush \
  --resource-group $env:RG \
  --cluster-name $env:REDIS_NAME \
  --database-name default --yes`,
        note: "Dùng cờ --yes để bỏ qua yêu cầu xác nhận dòng lệnh khi chạy tự động hóa CI/CD."
      },
      {
        title: "8. Caching Dạng Hash & Thời Gian Sống (TTL)",
        desc: "Lưu trữ đối tượng sản phẩm và thiết lập tự động hết hạn:",
        code: `# Lưu trữ Hash sản phẩm:
HSET product:101 name "Azure AI Studio" price 49.99

# Đọc toàn bộ hoặc đọc từng trường (Projection):
HGETALL product:101
HMGET product:101 name price

# Thiết lập TTL 3600 giây (1 giờ):
EXPIRE product:101 3600
TTL product:101`,
        note: "Dùng UNLINK thay vì DEL khi xóa khóa lớn để tránh làm đơ luồng xử lý chính của Redis."
      },
      {
        title: "9. Real-Time Pub/Sub & Pattern Matching",
        desc: "Phát tán thông điệp và lắng nghe theo ký tự đại diện wildcard (*):",
        code: `# Phát sự kiện:
PUBLISH orders:europe '{"order_id": 9901, "status": "paid"}'

# Lắng nghe đa kênh:
PSUBSCRIBE orders:*`,
        note: "Pub/Sub là cơ chế At-most-once (Fire-and-Forget), cực nhanh cho thông báo trạng thái tức thời."
      },
      {
        title: "10. RediSearch HNSW Vector Indexing & Raw Float32",
        desc: "Cấu hình chỉ mục Vector Cosine trên tiền tố 'product:':",
        code: `FT.CREATE idx:products ON HASH PREFIX 1 product: \
SCHEMA name TEXT category TAG embedding VECTOR HNSW 6 \
TYPE FLOAT32 DIM 8 DISTANCE_METRIC COSINE`,
        note: "Trong Python, vector bắt buộc phải chuyển thành chuỗi byte: np.array(vec, dtype=np.float32).tobytes()."
      },
      {
        title: "11. Truy Vấn KNN Vector Search với Dialect 2",
        desc: "Tìm kiếm K phần tử lân cận có khoảng cách Cosine nhỏ nhất:",
        code: `FT.SEARCH idx:products "*=>[KNN 3 @embedding $query_vec AS score]" \
PARAMS 2 query_vec <binary_bytes> SORTBY score DIALECT 2`,
        note: "Bắt buộc sử dụng DIALECT 2 để hỗ trợ cú pháp Vector Search và ánh xạ tham số PARAMS."
      },
      {
        title: "12. Hybrid Search (Metadata Tag Filter + Vector KNN)",
        desc: "Lọc thuộc tính trước (Pre-filtering) rồi mới tính khoảng cách vector:",
        code: `FT.SEARCH idx:products "(@category:{Cloud})=>[KNN 3 @embedding $query_vec AS score]" \
PARAMS 2 query_vec <binary_bytes> SORTBY score DIALECT 2`,
        note: "Pre-filtering thu hẹp không gian tìm kiếm đồ thị HNSW, mang lại độ trễ dưới 1 mili-giây."
      }
    ]
  }
,
  {
    id: "level-11",
    title: "Level 11: Backend Services Integration (Service Bus, Event Grid & Functions)",
    badge: "Level 11",
    summary: "Cẩm nang toàn diện: Azure Service Bus Queues/Topics/SQL Filters, Event Grid Namespaces CloudEvents Pull Delivery, Durable Functions Fan-out & HITL, và Azure Functions MCP Server.",
    items: [
      {
        title: "1. Đăng ký Providers: Microsoft.ServiceBus & Microsoft.EventGrid",
        desc: "Kích hoạt dịch vụ Message Queues và Event Broker trên subscription:",
        code: `az provider register --namespace Microsoft.ServiceBus
az provider register --namespace Microsoft.EventGrid`,
        note: "Bắt buộc thực hiện trước khi tạo bất kỳ hàng đợi hoặc chủ đề sự kiện nào."
      },
      {
        title: "2. Tạo Service Bus Namespace Standard & Queue với DLQ",
        desc: "Cấp phát hàng đợi tin nhắn với số lần retry tối đa 5 và bật Dead-Lettering khi quá hạn:",
        code: `az servicebus namespace create \
  --resource-group $env:RG \
  --name $env:SB_NAMESPACE \
  --location eastus \
  --sku Standard

az servicebus queue create \
  --resource-group $env:RG \
  --namespace-name $env:SB_NAMESPACE \
  --name inference-requests \
  --max-delivery-count 5 \
  --enable-dead-lettering-on-message-expiration true`,
        note: "Queue với cơ chế Peek-Lock đảm bảo không bị mất prompt suy luận khi worker AI gặp sự cố."
      },
      {
        title: "3. Topic Pub/Sub & Bộ Lọc SQL (priority = 'high')",
        desc: "Tạo Topic, Subscription và quy tắc lọc thuộc tính metadata:",
        code: `# 1. Tạo Topic & Subscription:
az servicebus topic create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --name inference-results
az servicebus topic subscription create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --name high-priority

# 2. Xóa quy tắc $Default và gán SQL Filter:
az servicebus topic subscription rule delete --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --subscription-name high-priority --name "$Default"
az servicebus topic subscription rule create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --subscription-name high-priority --name high-priority-filter --filter-sql-expression "priority = 'high'"`,
        note: "Xóa $Default là bắt buộc để subscription không nhận toàn bộ tin nhắn mà chỉ nhận tin khớp điều kiện SQL."
      },
      {
        title: "4. Phân Quyền Data Plane Cho Service Bus",
        desc: "Gán quyền Azure Service Bus Data Owner cho người dùng qua Entra ID:",
        code: `az role assignment create \
  --assignee $env:USER_OID \
  --scope $SB_ID \
  --role "Azure Service Bus Data Owner"`,
        note: "Loại bỏ hoàn toàn nhu cầu sử dụng Connection String Shared Access Key."
      },
      {
        title: "5. Event Grid Namespace & Topic Chuẩn CloudEvents v1.0",
        desc: "Khởi tạo Event Grid thế hệ mới với Schema CloudEvents và thời gian lưu đệm 1 ngày:",
        code: `az eventgrid namespace create \
  --resource-group $env:RG \
  --name $env:EG_NAMESPACE \
  --location eastus \
  --sku "{name:standard,capacity:1}"

az eventgrid namespace topic create \
  --resource-group $env:RG \
  --namespace-name $env:EG_NAMESPACE \
  --name moderation-events \
  --event-retention-in-days 1 \
  --publisher-type Custom \
  --input-schema CloudEventSchemaV1_0`,
        note: "Event Grid Namespace chỉ hỗ trợ định dạng sự kiện tiêu chuẩn CloudEventSchemaV1_0."
      },
      {
        title: "6. Event Subscription Chế Độ Queue Pull Delivery & Filter",
        desc: "Cấu hình hàng đợi kéo tin và lọc theo loại sự kiện ContentFlagged:",
        code: `az eventgrid namespace topic event-subscription create \
  --resource-group $env:RG \
  --namespace-name $env:EG_NAMESPACE \
  --topic-name moderation-events \
  --name sub-flagged \
  --delivery-configuration "{deliveryMode:Queue,queue:{receiveLockDurationInSeconds:60,maxDeliveryCount:10,eventTimeToLive:P1D}}" \
  --event-delivery-schema CloudEventSchemaV1_0 \
  --filters-configuration "{includedEventTypes:['com.contoso.ai.ContentFlagged']}"`,
        note: "Pull Delivery cho phép AI worker trong mạng nội bộ tự kéo sự kiện về mà không cần mở inbound webhook."
      },
      {
        title: "7. Phân Quyền EventGrid Data Receiver",
        desc: "Cấp quyền kéo sự kiện từ subscription cho tài khoản người dùng:",
        code: `az role assignment create \
  --assignee $env:USER_OID \
  --scope $EG_TOPIC_ID \
  --role "EventGrid Data Receiver"`,
        note: "Tương ứng với quyền Data Sender để publish và Data Receiver để consume."
      },
      {
        title: "8. Tạo Azure Function App Linux Host MCP Server",
        desc: "Khởi tạo Function App chạy runtime Python 3.11 v4 trên Linux:",
        code: `az functionapp create \
  --resource-group $env:RG \
  --consumption-plan-location eastus \
  --runtime python \
  --runtime-version 3.11 \
  --functions-version 4 \
  --name $env:FUNC_NAME \
  --storage-account $env:STORAGE_ACCOUNT \
  --os-type Linux`,
        note: "Python Functions trên Azure bắt buộc sử dụng hệ điều hành Linux (--os-type Linux)."
      },
      {
        title: "9. Trích Xuất FQDN Hostname Function App",
        desc: "Lấy chuỗi tên miền sạch để làm endpoint cho MCP Client:",
        code: `az functionapp show \
  --resource-group $env:RG \
  --name $env:FUNC_NAME \
  --query defaultHostName -o tsv`,
        note: "Endpoint SSE của MCP server: https://<hostname>/runtime/webhooks/mcp/sse"
      },
      {
        title: "10. Durable Functions Fan-Out / Fan-In Cho Batch Documents",
        desc: "Lên lịch sub-orchestrators song song và gom kết quả đồng thời:",
        code: `# Fan-out:
for doc in documents:
    tasks.append(context.call_sub_orchestrator("document_orchestrator", doc))

# Fan-in:
results = yield context.task_all(tasks)`,
        note: "Xử lý hàng trăm file embedding song song tự động co giãn serverless."
      },
      {
        title: "11. Human-in-the-Loop: Đua External Event & Timer 30s",
        desc: "Ngủ đông chờ quyết định duyệt hoặc timeout mà không block CPU:",
        code: `approval = context.wait_for_external_event("ApprovalResponse")
deadline = context.current_utc_datetime + timedelta(seconds=30)
timeout = context.create_timer(deadline)

winner = yield context.task_any([approval, timeout])`,
        note: "Bắt buộc dùng context.current_utc_datetime thay vì datetime.now() để bảo toàn tính tất định."
      },
      {
        title: "12. Azure Functions Model Context Protocol (mcpToolTrigger)",
        desc: "Khai báo trigger MCP để công khai công cụ cho AI Assistants:",
        code: `@app.generic_trigger(
    arg_name="context",
    type="mcpToolTrigger",
    toolName="summarize_text",
    description="Summarize a block of text",
    toolProperties='[{"propertyName": "text", "propertyType": "string"}]'
)
def summarize_text(context: str) -> str:
    # Trả về JSON có trường 'content'
    return json.dumps({"content": "Summary text..."})`,
        note: "Tương thích với VS Code .vscode/mcp.json, GitHub Copilot, Cursor và Claude Desktop."
      }
    ]
  },
  {
  "id": "level-12",
  "title": "Level 12: Azure Key Vault & App Configuration",
  "badge": "Level 12",
  "summary": "Quản lý bí mật bảo mật an toàn với Azure Key Vault RBAC Data Plane và cấu hình tập trung phân tầng (Label Stacking) trong Azure App Configuration kèm Sentinel Dynamic Refresh không cần restart ứng dụng.",
  "items": [
    {
      "title": "1. Đăng ký Resource Providers cho App Config & Key Vault",
      "desc": "Kích hoạt các dịch vụ App Configuration và Key Vault trên Azure subscription trước khi khởi tạo tài nguyên.",
      "code": "az provider register --namespace Microsoft.AppConfiguration\naz provider register --namespace Microsoft.KeyVault",
      "note": "Kiểm tra tiến độ đăng ký bằng cờ: az provider show -n Microsoft.AppConfiguration --query registrationState."
    },
    {
      "title": "2. Khởi tạo Key Vault với mô hình xác thực hiện đại Azure RBAC",
      "desc": "Bật cờ --enable-rbac-authorization true để quản lý quyền truy cập dữ liệu bí mật qua Entra ID RBAC thay cho Vault Access Policies cổ điển.",
      "code": "az keyvault create `\n  --resource-group $env:RG `\n  --name $env:KV_NAME `\n  --location eastus `\n  --enable-rbac-authorization true",
      "note": "Khuyến nghị chuẩn AI-200: Hỗ trợ kiểm soát truy cập hạt mịn tới từng secret và tích hợp Entra ID PIM."
    },
    {
      "title": "3. Phân quyền RBAC Data Plane cho Key Vault (Secrets Officer vs Secrets User)",
      "desc": "Gán quyền Key Vault Secrets Officer cho kỹ sư vận hành/CI-CD và Key Vault Secrets User cho Managed Identity của ứng dụng runtime.",
      "code": "# Gán cho kỹ sư/admin quản lý bí mật:\naz role assignment create `\n  --role \"Key Vault Secrets Officer\" `\n  --assignee $env:USER_OID `\n  --scope $KV_ID\n\n# Gán cho Managed Identity của Web App/Functions (chỉ đọc):\naz role assignment create `\n  --role \"Key Vault Secrets User\" `\n  --assignee $APP_PRINCIPAL_ID `\n  --scope $KV_ID",
      "note": "Tuân thủ nguyên tắc Least Privilege (Đặc quyền tối thiểu) trong kiến trúc đám mây an toàn."
    },
    {
      "title": "4. Lưu trữ Secret kèm Content-Type và Tags nhận diện",
      "desc": "Lưu API Key hoặc chuỗi kết nối vào Key Vault, gắn nhãn content-type để client nhận diện và tags để phân loại môi trường.",
      "code": "az keyvault secret set `\n  --vault-name $env:KV_NAME `\n  --name openai-api-key `\n  --value \"sk-proj-prod123456\" `\n  --content-type \"application/x-api-key\" `\n  --tags environment=production service=openai",
      "note": "Mỗi lần chạy secret set, Key Vault tự động sinh ra một version GUID mới mà vẫn giữ nguyên tên secret."
    },
    {
      "title": "5. Khởi tạo Azure App Configuration Store (SKU Standard)",
      "desc": "Tạo kho cấu hình tập trung phân tán hỗ trợ Dynamic Refresh, snapshot và lưu giữ lịch sử cấu hình lên đến 30 ngày.",
      "code": "az appconfig create `\n  --resource-group $env:RG `\n  --name $env:APPCONFIG_NAME `\n  --location eastus `\n  --sku Standard",
      "note": "Gói Standard hỗ trợ SLA 99.9% và không giới hạn số lượng request cấu hình so với gói Free."
    },
    {
      "title": "6. Phân quyền App Configuration Data Owner",
      "desc": "Cấp quyền thao tác toàn diện trên các khóa cấu hình và Key Vault references cho quản trị viên cấu hình.",
      "code": "az role assignment create `\n  --role \"App Configuration Data Owner\" `\n  --assignee $env:USER_OID `\n  --scope $APPCONFIG_ID",
      "note": "Ứng dụng tiêu thụ lúc runtime chỉ cần vai trò App Configuration Data Reader."
    },
    {
      "title": "7. Kỹ thuật Label Stacking: Khóa mặc định (\\0) và Khóa Production",
      "desc": "Thiết lập khóa không nhãn làm fallback chung, sau đó xếp đè cấu hình gắn nhãn Production lên trên.",
      "code": "# Thiết lập cấu hình mặc định (unlabeled):\naz appconfig kv set --name $env:APPCONFIG_NAME --key \"OpenAI:Endpoint\" --value \"https://my-openai.openai.azure.com/\" --yes\n\n# Thiết lập cấu hình ghi đè môi trường Production:\naz appconfig kv set --name $env:APPCONFIG_NAME --key \"Pipeline:BatchSize\" --value \"200\" --label \"Production\" --yes",
      "note": "Trong Python SDK, sử dụng: SettingSelector(key_filter='*', label_filter='\\0') tiếp theo là label_filter='Production'."
    },
    {
      "title": "8. Liên kết Key Vault Reference trong App Configuration",
      "desc": "Tạo cấu hình trỏ thẳng tới Secret Identifier trong Key Vault. App Configuration SDK sẽ tự động phân giải qua DefaultAzureCredential.",
      "code": "az appconfig kv set-keyvault `\n  --name $env:APPCONFIG_NAME `\n  --key \"OpenAI:ApiKey\" `\n  --secret-identifier $SECRET_URI `\n  --yes",
      "note": "Ứng dụng chỉ cần đọc một endpoint App Config duy nhất mà vẫn lấy được toàn bộ cấu hình thường lẫn bí mật Key Vault."
    },
    {
      "title": "9. Mô hình Sentinel Key kích hoạt Dynamic Refresh tức thì",
      "desc": "Khởi tạo khóa canh gác Sentinel = 1. Khi có bất kỳ thay đổi cấu hình nào, ta tăng Sentinel lên 2 để kích hoạt client reload mà không cần restart.",
      "code": "# Thiết lập Sentinel Key ban đầu:\naz appconfig kv set --name $env:APPCONFIG_NAME --key \"Sentinel\" --value \"1\" --yes\n\n# Khi cập nhật cấu hình mới trong tương lai, chỉ cần tăng giá trị:\naz appconfig kv set --name $env:APPCONFIG_NAME --key \"Sentinel\" --value \"2\" --yes",
      "note": "Tiết kiệm 99% request kiểm tra cấu hình và đảm bảo tính nguyên tử (atomic refresh) trên toàn hệ thống."
    },
    {
      "title": "10. Khôi phục (Recover) và Xóa vĩnh viễn (Purge) Key Vault",
      "desc": "Key Vault mặc định bật Soft-Delete (90 ngày). Sử dụng lệnh recover để khôi phục hoặc purge để giải phóng tên DNS toàn cầu.",
      "code": "# Khôi phục kho đã xóa tạm thời:\naz keyvault recover --name $env:KV_NAME\n\n# Xóa vĩnh viễn kho đã soft-delete (nếu không bật purge protection):\naz keyvault purge --name $env:KV_NAME --no-wait",
      "note": "Trong môi trường Production, luôn bật Purge Protection để chống tấn công Ransomware xóa sổ dữ liệu."
    }
  ]
}
];

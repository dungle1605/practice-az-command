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
  }
];

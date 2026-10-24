/**
 * Challenge & Quiz Dataset based on Useful_Command.md
 * Designed for Microsoft AI-200 and Azure DevOps practical mastery.
 * Covers all 5 Levels: Environment Setup, ACR & Tasks, App Service Container, RBAC & App Settings, and Sidecar Containers.
 */

export const LEVELS = [
  {
    id: 1,
    name: "Level 1: Nhập môn & Môi trường",
    tagline: "Đăng nhập Headless, Đăng ký Resource Provider và Quản lý Biến môi trường",
    badge: "Cloud Rookie",
    color: "#00d2ff",
    icon: "🌱"
  },
  {
    id: 2,
    name: "Level 2: Azure Container Registry",
    tagline: "Build Image trên Cloud (ACR Task), Smoke Test & Thiết lập Immutability",
    badge: "Registry Operator",
    color: "#0078d4",
    icon: "🐳"
  },
  {
    id: 3,
    name: "Level 3: App Service & Container Web App",
    tagline: "App Service Plan Linux, Web App Container, URL Discovery & Log Stream",
    badge: "App Specialist",
    color: "#7928ca",
    icon: "🚀"
  },
  {
    id: 4,
    name: "Level 4: Bảo mật RBAC & App Settings",
    tagline: "Managed Identity, Phân quyền AcrPull không mật khẩu, WEBSITES_PORT & JMESPath",
    badge: "Security Engineer",
    color: "#ff007a",
    icon: "🛡️"
  },
  {
    id: 5,
    name: "Level 5: Sidecar Containers (Lab 3)",
    tagline: "Mô hình Multi-container Pod, Sidecar Spec JSON & Log Stream chuyên sâu",
    badge: "AI-200 Master",
    color: "#10b981",
    icon: "🧩"
  },
  {
    id: 6,
    name: "Level 6: Azure Container Apps (ACA)",
    tagline: "Deploy Backend API, Managed Identity & Secrets, Revisions, Chẩn đoán & Log Analytics",
    badge: "ACA Specialist",
    color: "#f59e0b",
    icon: "⚡"
  },
  {
    id: 7,
    name: "Level 7: Azure Kubernetes Service (AKS)",
    tagline: "Cấu hình nâng cao: kubectl cơ bản, ConfigMap, Secrets & PersistentVolumeClaim (15 bài)",
    badge: "AKS & K8s Master",
    color: "#326ce5",
    icon: "☸️"
  }
];

export const CHALLENGES = [
  // ==========================================
  // LEVEL 1: NHẬP MÔN & MÔI TRƯỜNG (SETUP)
  // ==========================================
  {
    id: "l1-login-device",
    level: 1,
    title: "Đăng nhập Headless với Device Code",
    difficulty: "Cơ bản",
    category: "Setup",
    mission: "Bạn đang làm việc trên máy chủ Linux từ xa, Cloud Shell hoặc terminal không thể tự động mở trình duyệt web. Hãy sử dụng Azure CLI để đăng nhập bằng mã thiết bị (Device Code).",
    expectedCommand: "az login --use-device-code",
    aliases: [
      "az login --use-device-code"
    ],
    tokens: ["az", "login", "--use-device-code", "--username"],
    hints: [
      "Bắt đầu bằng `az login`.",
      "Thêm cờ `--use-device-code` để Azure CLI sinh mã số và link microsoft.com/devicelogin."
    ],
    mentalModel: {
      rule: "az  <Dịch vụ / Core>  <Hành động>  [Các tham số]",
      breakdown: [
        { part: "az", role: "CLI Tool", desc: "Azure CLI gốc" },
        { part: "login", role: "Action", desc: "Xác thực danh tính với Microsoft Entra ID (Azure AD)" },
        { part: "--use-device-code", role: "Flag", desc: "Chỉ định hình thức xác thực thông qua mã 8 ký tự trên thiết bị khác" }
      ]
    },
    parametersExplanation: [
      { param: "--use-device-code", meaning: "Không mở pop-up trình duyệt cục bộ, thay vào đó hiển thị mã code và URL xác thực." }
    ],
    examNotes: "💡 Rất thường gặp khi thao tác từ GitHub Codespaces, Cloud Shell, hoặc remote VPS.",
    simulatedOutput: `To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code C84KL92B to authenticate.
[
  {
    "cloudName": "AzureCloud",
    "id": "7820a1bc-341e-42ef-a841-f42f38d12345",
    "isDefault": true,
    "name": "Azure AI-200 Student Subscription",
    "state": "Enabled"
  }
]`
  },
  {
    id: "l1-provider-acr",
    level: 1,
    title: "Đăng ký Resource Provider cho ACR",
    difficulty: "Cơ bản",
    category: "Setup",
    mission: "Một subscription mới có thể chưa kích hoạt dịch vụ Container Registry. Hãy dùng lệnh Azure CLI để đăng ký Resource Provider namespace `Microsoft.ContainerRegistry`.",
    expectedCommand: "az provider register --namespace Microsoft.ContainerRegistry",
    aliases: [
      "az provider register -n Microsoft.ContainerRegistry",
      "az provider register --namespace Microsoft.ContainerRegistry"
    ],
    tokens: ["az", "provider", "register", "--namespace", "Microsoft.ContainerRegistry"],
    hints: [
      "Dịch vụ quản lý nhà cung cấp là `provider`.",
      "Hành động là `register`.",
      "Cờ định danh dịch vụ là `--namespace` với giá trị `Microsoft.ContainerRegistry`."
    ],
    mentalModel: {
      rule: "az provider register --namespace <Namespace>",
      breakdown: [
        { part: "provider", role: "Management Scope", desc: "Quản lý các Resource Provider cấp Subscription" },
        { part: "register", role: "Action", desc: "Kích hoạt namespace tài nguyên cho subscription" },
        { part: "--namespace", role: "Flag", desc: "Tên định danh nhà cung cấp dịch vụ Azure" }
      ]
    },
    parametersExplanation: [
      { param: "--namespace", meaning: "Tên không gian định danh dịch vụ (ví dụ: Microsoft.ContainerRegistry, Microsoft.Web)." }
    ],
    examNotes: "Bắt buộc đăng ký trước khi tạo tài nguyên, nếu không Azure CLI sẽ báo lỗi 'Namespace not registered'.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/providers/Microsoft.ContainerRegistry",
  "namespace": "Microsoft.ContainerRegistry",
  "registrationPolicy": "RegistrationRequired",
  "registrationState": "Registering"
}`
  },
  {
    id: "l1-provider-web",
    level: 1,
    title: "Đăng ký Resource Provider cho App Service",
    difficulty: "Cơ bản",
    category: "Setup",
    mission: "Để triển khai các ứng dụng Web App và Container Hosting, subscription cần được đăng ký namespace `Microsoft.Web`. Hãy thực thi lệnh đăng ký này.",
    expectedCommand: "az provider register --namespace Microsoft.Web",
    aliases: [
      "az provider register -n Microsoft.Web",
      "az provider register --namespace Microsoft.Web"
    ],
    tokens: ["az", "provider", "register", "--namespace", "Microsoft.Web"],
    hints: [
      "Cú pháp tương tự đăng ký ACR, chỉ đổi tên namespace thành `Microsoft.Web`."
    ],
    mentalModel: {
      rule: "az provider register --namespace Microsoft.Web",
      breakdown: [
        { part: "az provider", role: "Scope", desc: "Quản lý Provider cấp Subscription" },
        { part: "register", role: "Action", desc: "Kích hoạt provider" },
        { part: "Microsoft.Web", role: "Service Namespace", desc: "Dịch vụ App Service & Function App của Azure" }
      ]
    },
    parametersExplanation: [
      { param: "--namespace Microsoft.Web", meaning: "Kích hoạt dịch vụ Web Hosting và PaaS container cho toàn bộ subscription." }
    ],
    examNotes: "Chuẩn bị sẵn sàng cho bài Lab 2 và Lab 3 khi dựng App Service Plan.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/providers/Microsoft.Web",
  "namespace": "Microsoft.Web",
  "registrationPolicy": "RegistrationRequired",
  "registrationState": "Registered"
}`
  },
  {
    id: "l1-env-dotsource",
    level: 1,
    title: "Nạp biến môi trường từ file script .env.ps1",
    difficulty: "Cơ bản",
    category: "PowerShell & CLI",
    mission: "Khi bắt đầu bài lab, script khởi tạo đã sinh file cấu hình `.env.ps1`. Hãy dùng kỹ thuật Dot-Sourcing trong PowerShell để nạp toàn bộ biến vào phiên terminal hiện hành.",
    expectedCommand: ". .\\.env.ps1",
    aliases: [
      ". .\\.env.ps1",
      ". ./.env.ps1",
      "source .env",
      ".\\.env.ps1"
    ],
    tokens: [".", ".\\.env.ps1", "source", ".env"],
    hints: [
      "Kỹ thuật Dot-sourcing gồm dấu chấm `.`, một dấu cách, rồi đến đường dẫn `.\\.env.ps1`.",
      "Nếu chỉ gõ `.\\.env.ps1`, biến sẽ chạy trong subshell và biến mất ngay sau khi script hoàn thành."
    ],
    mentalModel: {
      rule: ". <Path-to-script>",
      breakdown: [
        { part: ".", role: "Dot-Source Operator", desc: "Thực thi script trong current scope thay vì child scope" },
        { part: ".\\.env.ps1", role: "File Path", desc: "Đường dẫn file cấu hình biến môi trường của bài lab" }
      ]
    },
    parametersExplanation: [
      { param: ". .\\.env.ps1", meaning: "Giữ lại toàn bộ biến như $env:ACR_NAME, $env:RESOURCE_GROUP trong cửa sổ terminal hiện tại." }
    ],
    examNotes: "💡 Điểm thi thực hành quan trọng: luôn dùng dot-source `. .\\script.ps1` để tránh mất biến môi trường.",
    simulatedOutput: `[+] Loading environment variables from .env.ps1...
[+] Loaded: $env:RESOURCE_GROUP = "rg-ai200-acr-lab"
[+] Loaded: $env:ACR_NAME       = "acr9e9994d6"
[+] Loaded: $env:LOCATION       = "southeastasia"`
  },
  {
    id: "l1-env-assign-acr",
    level: 1,
    title: "Gán biến môi trường thủ công trong PowerShell",
    difficulty: "Cơ bản",
    category: "PowerShell & CLI",
    mission: "Trong trường hợp không dùng file `.env`, bạn cần gán biến môi trường `$env:ACR_NAME` với giá trị `\"acr9e9994d6\"` để tái sử dụng trong các câu lệnh tiếp theo.",
    expectedCommand: "$env:ACR_NAME = \"acr9e9994d6\"",
    aliases: [
      "$env:ACR_NAME = \"acr9e9994d6\"",
      "$env:ACR_NAME=\"acr9e9994d6\"",
      "export ACR_NAME=\"acr9e9994d6\""
    ],
    tokens: ["$env:ACR_NAME", "=", "\"acr9e9994d6\""],
    hints: [
      "Trong PowerShell, biến môi trường bắt đầu bằng cú pháp `$env:TÊN_BIẾN`.",
      "Gán giá trị bằng dấu `=` và bọc chuỗi trong dấu ngoặc kép `\"acr9e9994d6\"`."
    ],
    mentalModel: {
      rule: "$env:<VAR_NAME> = \"<VALUE>\"",
      breakdown: [
        { part: "$env:", role: "PowerShell Drive", desc: "Truy cập hệ thống biến môi trường của phiên làm việc" },
        { part: "ACR_NAME", role: "Variable Identifier", desc: "Tên biến định danh Container Registry" },
        { part: "\"acr9e9994d6\"", role: "Literal String", desc: "Giá trị tên ACR duy nhất trên toàn cầu" }
      ]
    },
    parametersExplanation: [
      { param: "$env:ACR_NAME", meaning: "Biến môi trường lưu tên ACR để tham chiếu ở mọi lệnh az acr tiếp theo." }
    ],
    examNotes: "Giúp tránh gõ sai chính tả tên ACR qua các câu lệnh phức tạp.",
    simulatedOutput: `PS H:\\azure-lab> $env:ACR_NAME = "acr9e9994d6"
PS H:\\azure-lab> $env:ACR_NAME
acr9e9994d6`
  },
  {
    id: "l1-config-defaults",
    level: 1,
    title: "Cấu hình Resource Group mặc định (az config defaults)",
    difficulty: "Cơ bản",
    category: "Best Practice",
    mission: "Để không phải lặp lại cờ `--resource-group rg-ai200-acr-lab` trong mọi câu lệnh, hãy cấu hình giá trị mặc định cho Azure CLI với nhóm tài nguyên `rg-ai200-acr-lab`.",
    expectedCommand: "az config set defaults.group=rg-ai200-acr-lab",
    aliases: [
      "az config set defaults.group=rg-ai200-acr-lab",
      "az config set defaults.group=\"rg-ai200-acr-lab\""
    ],
    tokens: ["az", "config", "set", "defaults.group=rg-ai200-acr-lab", "defaults.location=southeastasia"],
    hints: [
      "Lệnh bắt đầu bằng `az config set`.",
      "Tham số là cặp key=value: `defaults.group=rg-ai200-acr-lab`."
    ],
    mentalModel: {
      rule: "az config set defaults.group=<RG_NAME>",
      breakdown: [
        { part: "config set", role: "Action", desc: "Ghi cấu hình vào tệp config cục bộ của Azure CLI" },
        { part: "defaults.group", role: "Config Key", desc: "Quy định Resource Group ngầm định" }
      ]
    },
    parametersExplanation: [
      { param: "defaults.group", meaning: "Khi thiết lập, mọi lệnh az sẽ tự động áp dụng Resource Group này mà không cần gõ thêm -g." }
    ],
    examNotes: "💡 Best Practice phòng thi: giúp câu lệnh ngắn gọn hơn và tránh nhầm lẫn giữa nhiều Resource Group.",
    simulatedOutput: `[
  {
    "name": "defaults.group",
    "source": "H:\\azure-lab\\.azure\\config",
    "value": "rg-ai200-acr-lab"
  }
]`
  },

  // ==========================================
  // LEVEL 2: AZURE CONTAINER REGISTRY & ACR TASKS
  // ==========================================
  {
    id: "l2-acr-build",
    level: 2,
    title: "Build Image trên Cloud (Quick Task)",
    difficulty: "Trung bình",
    category: "ACR Tasks",
    mission: "Máy bạn không cài Docker daemon. Hãy dùng tính năng ACR Quick Task của Azure để đóng gói mã nguồn trong thư mục `./api` thành Docker Image `inference-api:v1.0.0` ngay trên Cloud.",
    expectedCommand: "az acr build --registry $env:ACR_NAME --image inference-api:v1.0.0 ./api",
    aliases: [
      "az acr build -r $env:ACR_NAME --image inference-api:v1.0.0 ./api",
      "az acr build --registry $env:ACR_NAME -t inference-api:v1.0.0 ./api",
      "az acr build -r $env:ACR_NAME -t inference-api:v1.0.0 ./api"
    ],
    tokens: ["az", "acr", "build", "--registry", "$env:ACR_NAME", "--image", "inference-api:v1.0.0", "./api"],
    hints: [
      "Lệnh chính là `az acr build`.",
      "Chỉ định tên registry bằng `--registry $env:ACR_NAME`.",
      "Đặt tên và tag cho image bằng `--image inference-api:v1.0.0`.",
      "Truyền thư mục chứa mã nguồn và Dockerfile ở cuối: `./api`."
    ],
    mentalModel: {
      rule: "az acr build --registry <ACR> --image <Repo:Tag> <ContextPath>",
      breakdown: [
        { part: "az acr build", role: "Command", desc: "Nén context mã nguồn, tải lên Azure và build container image trên Cloud" },
        { part: "--registry", role: "Target", desc: "Tên của Azure Container Registry" },
        { part: "--image", role: "Image & Tag", desc: "Tên repository và phiên bản tag" },
        { part: "./api", role: "Build Context", desc: "Thư mục chứa Dockerfile và source code" }
      ]
    },
    parametersExplanation: [
      { param: "--registry", meaning: "Chỉ định Container Registry lưu trữ image sau khi build xong." },
      { param: "--image", meaning: "Tên repository và tag phiên bản (ví dụ: inference-api:v1.0.0)." },
      { param: "./api", meaning: "Thư mục ngữ cảnh nguồn gửi lên Cloud builder." }
    ],
    examNotes: "ACR Tasks giải phóng bạn khỏi việc cần Docker Desktop/Daemon cục bộ - câu hỏi xuất hiện liên tục trong bài thi AI-200.",
    simulatedOutput: `Packaging source code from directory: ./api...
Uploading source code to storage...
Uploading done
Run ID: ca1 was successful after 42s
- Step 1/5 : FROM python:3.11-slim
- Step 2/5 : WORKDIR /app
- Step 3/5 : COPY requirements.txt . && pip install -r requirements.txt
- Step 4/5 : COPY . .
- Step 5/5 : CMD ["python", "app.py"]
Successfully tagged inference-api:v1.0.0
Pushed acr9e9994d6.azurecr.io/inference-api:v1.0.0 (Digest: sha256:d8a9f4...)`
  },
  {
    id: "l2-acr-run",
    level: 2,
    title: "Chạy thử Image trên Cloud (Smoke Test)",
    difficulty: "Trung bình",
    category: "ACR Tasks",
    mission: "Trước khi triển khai lên App Service, bạn muốn chạy thử container ngay trên Cloud để kiểm tra xem module `app` có import thành công không mà không cần tạo Web App thật.",
    expectedCommand: "az acr run --registry $env:ACR_NAME --cmd \"$env:ACR_NAME.azurecr.io/inference-api:v1.0.0 python -c 'from app import app'\" /dev/null",
    aliases: [
      "az acr run -r $env:ACR_NAME --cmd \"$env:ACR_NAME.azurecr.io/inference-api:v1.0.0 python -c 'from app import app'\" /dev/null",
      "az acr run --registry $env:ACR_NAME --cmd \"$env:ACR_NAME.azurecr.io/inference-api:v1.0.0 python -c 'from app import app'\" /dev/null"
    ],
    tokens: ["az", "acr", "run", "--registry", "$env:ACR_NAME", "--cmd", "\"$env:ACR_NAME.azurecr.io/inference-api:v1.0.0 python -c 'from app import app'\"", "/dev/null"],
    hints: [
      "Lệnh là `az acr run`.",
      "Chỉ định registry bằng `--registry $env:ACR_NAME`.",
      "Dùng cờ `--cmd` bọc đường dẫn full image cùng câu lệnh python kiểm tra.",
      "Tham số vị trí cuối cùng là `/dev/null` (không cần source context)."
    ],
    mentalModel: {
      rule: "az acr run --registry <ACR> --cmd \"<Full-Image-URL> <Command>\" /dev/null",
      breakdown: [
        { part: "az acr run", role: "Cloud Runner", desc: "Khởi tạo một container tạm thời chạy độc lập trên compute của ACR" },
        { part: "--cmd", role: "Execution Spec", desc: "Image cần pull và câu lệnh thực thi kiểm tra" },
        { part: "/dev/null", role: "Context", desc: "Không gửi thêm context mã nguồn vì image đã có sẵn trong registry" }
      ]
    },
    parametersExplanation: [
      { param: "--cmd", meaning: "Lệnh chạy trong container mẫu để test nhanh logic trước khi deploy." },
      { param: "/dev/null", meaning: "Không cần tải lên source code mới." }
    ],
    examNotes: "💡 Kỹ thuật Smoke Test qua ACR Run giúp phát hiện lỗi thiếu thư viện / syntax error ngay trong CI/CD pipeline.",
    simulatedOutput: `Queued a run with ID: ca2
Waiting for an agent...
2026/10/19 12:00:00 Pulling image: acr9e9994d6.azurecr.io/inference-api:v1.0.0
2026/10/19 12:00:04 Digest: sha256:d8a9f4...
2026/10/19 12:00:05 Executing: python -c "from app import app"
2026/10/19 12:00:06 [+] App imported successfully. No syntax or import errors.
Run ID: ca2 was successful after 9s`
  },
  {
    id: "l2-repo-list",
    level: 2,
    title: "Liệt kê tất cả Repository trong Registry",
    difficulty: "Cơ bản",
    category: "ACR Management",
    mission: "Hãy liệt kê toàn bộ các repository (kho lưu trữ container image) đang có trong Container Registry `$env:ACR_NAME` dưới dạng bảng.",
    expectedCommand: "az acr repository list --name $env:ACR_NAME --output table",
    aliases: [
      "az acr repository list -n $env:ACR_NAME --output table",
      "az acr repository list --name $env:ACR_NAME -o table",
      "az acr repository list -n $env:ACR_NAME -o table"
    ],
    tokens: ["az", "acr", "repository", "list", "--name", "$env:ACR_NAME", "--output", "table"],
    hints: [
      "Nhóm dịch vụ là `acr repository`.",
      "Hành động là `list`.",
      "Chỉ định tên registry bằng `--name $env:ACR_NAME` và định dạng `--output table`."
    ],
    mentalModel: {
      rule: "az acr repository list --name <Registry> --output table",
      breakdown: [
        { part: "az acr repository", role: "Resource Group", desc: "Quản lý tầng Repository trong ACR" },
        { part: "list", role: "Verb", desc: "Liệt kê danh sách" },
        { part: "--output table", role: "Formatter", desc: "Hiển thị dạng bảng trực quan" }
      ]
    },
    parametersExplanation: [
      { param: "--output table", meaning: "Định dạng kết quả trả về dạng bảng ASCII dễ đọc trên màn hình dòng lệnh." }
    ],
    examNotes: "Repository trong ACR đóng vai trò như một kệ sách chứa nhiều tag phiên bản khác nhau của cùng một ứng dụng.",
    simulatedOutput: `Result
-------------
docprocessor
inference-api`
  },
  {
    id: "l2-repo-show-tags",
    level: 2,
    title: "Liệt kê các Tag của một Repository",
    difficulty: "Cơ bản",
    category: "ACR Management",
    mission: "Kiểm tra xem repository `inference-api` trong registry `$env:ACR_NAME` đang có những phiên bản tag nào dưới dạng bảng.",
    expectedCommand: "az acr repository show-tags --name $env:ACR_NAME --repository inference-api --output table",
    aliases: [
      "az acr repository show-tags -n $env:ACR_NAME --repository inference-api -o table",
      "az acr repository show-tags --name $env:ACR_NAME --repository inference-api -o table"
    ],
    tokens: ["az", "acr", "repository", "show-tags", "--name", "$env:ACR_NAME", "--repository", "inference-api", "--output", "table"],
    hints: [
      "Hành động xem tag là `show-tags`.",
      "Cờ tên repository là `--repository inference-api`."
    ],
    mentalModel: {
      rule: "az acr repository show-tags --name <Registry> --repository <RepoName> --output table",
      breakdown: [
        { part: "show-tags", role: "Action", desc: "Xem danh sách các tag thuộc repository" },
        { part: "--repository", role: "Target Repo", desc: "Tên repository cần kiểm tra" }
      ]
    },
    parametersExplanation: [
      { param: "--repository", meaning: "Tên repository cụ thể cần tra cứu danh sách các phiên bản tag." }
    ],
    examNotes: "Tag giúp phân biệt các phiên bản build: v1.0.0, v1.1.0, latest.",
    simulatedOutput: `Result
--------
latest
v1.0.0
v1.1.0`
  },
  {
    id: "l2-manifest-metadata",
    level: 2,
    title: "Xem chi tiết Manifest & Digest SHA256",
    difficulty: "Trung bình",
    category: "Audit & Security",
    mission: "Để kiểm tra tính toàn vẹn (SHA256 digest) và ngày tạo của các image trong repository `inference-api`, hãy sử dụng lệnh `manifest list-metadata`.",
    expectedCommand: "az acr manifest list-metadata --registry $env:ACR_NAME --name inference-api --output table",
    aliases: [
      "az acr manifest list-metadata -r $env:ACR_NAME --name inference-api -o table",
      "az acr manifest list-metadata --registry $env:ACR_NAME -n inference-api -o table"
    ],
    tokens: ["az", "acr", "manifest", "list-metadata", "--registry", "$env:ACR_NAME", "--name", "inference-api", "--output", "table"],
    hints: [
      "Nhóm con là `manifest`.",
      "Hành động là `list-metadata`.",
      "Tham số gồm `--registry $env:ACR_NAME`, `--name inference-api` và `--output table`."
    ],
    mentalModel: {
      rule: "az acr manifest list-metadata --registry <ACR> --name <Repo> --output table",
      breakdown: [
        { part: "manifest list-metadata", role: "Action", desc: "Truy vấn danh mục manifest, digest SHA256 và dung lượng image" },
        { part: "--name", role: "Target", desc: "Tên repository cần xem manifest" }
      ]
    },
    parametersExplanation: [
      { param: "--name", meaning: "Trong lệnh manifest, cờ --name quy định tên repository." }
    ],
    examNotes: "💡 Digest (SHA256) là định danh bất biến thực sự của image, an toàn hơn nhiều so với việc chỉ trỏ vào tag mutable như 'latest'.",
    simulatedOutput: `Digest                                                            Tags    CreatedTime               Signed
----------------------------------------------------------------  ------  ------------------------  --------
sha256:d8a9f4e2c91b58a36c841bb92a013f9942a17720914bf1102f5a01bc  v1.0.0  2026-10-19T11:45:12.301Z  False`
  },
  {
    id: "l2-repo-immutability",
    level: 2,
    title: "Khóa Image Bất biến (Immutability)",
    difficulty: "Trung bình",
    category: "Security & Compliance",
    mission: "Để bảo vệ phiên bản Production quan trọng `inference-api:v1.0.0` khỏi bị ai đó vô tình push đè hoặc xóa nhầm, hãy khóa quyền ghi (write-enabled) của image này.",
    expectedCommand: "az acr repository update --name $env:ACR_NAME --image inference-api:v1.0.0 --write-enabled false",
    aliases: [
      "az acr repository update -n $env:ACR_NAME --image inference-api:v1.0.0 --write-enabled false",
      "az acr repository update --name $env:ACR_NAME --image inference-api:v1.0.0 --write-enable false"
    ],
    tokens: ["az", "acr", "repository", "update", "--name", "$env:ACR_NAME", "--image", "inference-api:v1.0.0", "--write-enabled", "false"],
    hints: [
      "Dùng lệnh `az acr repository update`.",
      "Chỉ định image bằng cờ `--image inference-api:v1.0.0`.",
      "Vô hiệu hóa quyền ghi bằng `--write-enabled false`."
    ],
    mentalModel: {
      rule: "az acr repository update --name <ACR> --image <Repo:Tag> --write-enabled false",
      breakdown: [
        { part: "repository update", role: "Action", desc: "Cập nhật chính sách thuộc tính của image" },
        { part: "--write-enabled false", role: "Security Rule", desc: "Chuyển image sang chế độ Read-Only, ngăn chặn ghi đè (Tamper-proofing)" }
      ]
    },
    parametersExplanation: [
      { param: "--write-enabled false", meaning: "Khóa hoàn toàn quyền sửa đổi và xóa tag image đã đóng dấu production." }
    ],
    examNotes: "⭐ Mẹo phòng thi AI-200: Đây là lệnh 'một đi không trở lại' đối với tag đó, bảo đảm tính bất biến (Immutability) chuẩn Production.",
    simulatedOutput: `{
  "changeableAttributes": {
    "deleteEnabled": false,
    "listEnabled": true,
    "readEnabled": true,
    "writeEnabled": false
  },
  "createdTime": "2026-10-19T11:45:12.301Z",
  "digest": "sha256:d8a9f4e2c91b58a36c841bb92a013f9942a17720914bf1102f5a01bc",
  "imageName": "inference-api:v1.0.0"
}`
  },
  {
    id: "l2-task-list-runs",
    level: 2,
    title: "Xem lịch sử Build trên Cloud (Audit Trail)",
    difficulty: "Cơ bản",
    category: "ACR Tasks",
    mission: "Kiểm tra danh sách lịch sử tất cả các tác vụ build đã chạy trên ACR để phục vụ việc kiểm toán (Audit Trail) và theo dõi trạng thái.",
    expectedCommand: "az acr task list-runs --registry $env:ACR_NAME --output table",
    aliases: [
      "az acr task list-runs -r $env:ACR_NAME -o table",
      "az acr task list-runs --registry $env:ACR_NAME -o table"
    ],
    tokens: ["az", "acr", "task", "list-runs", "--registry", "$env:ACR_NAME", "--output", "table"],
    hints: [
      "Nhóm con là `task`.",
      "Hành động là `list-runs`.",
      "Chỉ định registry bằng `--registry $env:ACR_NAME` và định dạng `--output table`."
    ],
    mentalModel: {
      rule: "az acr task list-runs --registry <ACR> --output table",
      breakdown: [
        { part: "task list-runs", role: "Audit Action", desc: "Liệt kê lịch sử chạy của các tác vụ build/run" },
        { part: "--registry", role: "Target", desc: "Tên Registry" }
      ]
    },
    parametersExplanation: [
      { param: "list-runs", meaning: "Hiển thị danh sách các lần build, thời gian chạy và trạng thái Succeeded / Failed." }
    ],
    examNotes: "Cực kỳ hữu ích khi cần lấy Run ID để xem lại log chi tiết với `az acr task logs`.",
    simulatedOutput: `RUN ID    TASK    PLATFORM    STATUS     TRIGGER    STARTED               DURATION
--------  ------  ----------  ---------  ---------  --------------------  ----------
ca2               linux       Succeeded  Manual     2026-10-19T12:00:00Z  00:00:09
ca1               linux       Succeeded  Manual     2026-10-19T11:44:30Z  00:00:42`
  },

  // ==========================================
  // LEVEL 3: APP SERVICE & CONTAINER WEB APP
  // ==========================================
  {
    id: "l3-plan-create",
    level: 3,
    title: "Tạo App Service Plan (Linux, P0v3)",
    difficulty: "Trung bình",
    category: "Compute & Hosting",
    mission: "Tạo một máy chủ App Service Plan chạy Linux với tên `$env:APP_PLAN`, thuộc nhóm tài nguyên `$env:RESOURCE_GROUP`, sử dụng gói tính toán Premium V3 (`P0v3`).",
    expectedCommand: "az appservice plan create --name $env:APP_PLAN --resource-group $env:RESOURCE_GROUP --is-linux --sku P0v3",
    aliases: [
      "az appservice plan create -n $env:APP_PLAN -g $env:RESOURCE_GROUP --is-linux --sku P0v3",
      "az appservice plan create --resource-group $env:RESOURCE_GROUP --name $env:APP_PLAN --is-linux --sku P0v3"
    ],
    tokens: ["az", "appservice", "plan", "create", "--name", "$env:APP_PLAN", "--resource-group", "$env:RESOURCE_GROUP", "--is-linux", "--sku", "P0v3"],
    hints: [
      "Lệnh là `az appservice plan create`.",
      "Cờ `--name $env:APP_PLAN`, `--resource-group $env:RESOURCE_GROUP`.",
      "Quan trọng: thêm cờ `--is-linux` và `--sku P0v3`."
    ],
    mentalModel: {
      rule: "az appservice plan create --name <Plan> --resource-group <RG> --is-linux --sku <SKU>",
      breakdown: [
        { part: "appservice plan create", role: "Compute Provisioning", desc: "Tạo cụm máy chủ ảo chịu tải bên dưới cho Web App" },
        { part: "--is-linux", role: "OS Selection", desc: "Bắt buộc đối với hosting Docker Containers" },
        { part: "--sku P0v3", role: "Pricing Tier", desc: "Gói Premium V3 (hỗ trợ Memory tối ưu cho AI workloads)" }
      ]
    },
    parametersExplanation: [
      { param: "--is-linux", meaning: "Bắt buộc khi chạy container Linux trên Azure App Service." },
      { param: "--sku P0v3", meaning: "Gói cước Premium v3 có hiệu năng cao, hỗ trợ Managed Identity và Sidecars." }
    ],
    examNotes: "💡 Container trên Azure App Service yêu cầu Plan phải được gắn cờ `--is-linux`.",
    simulatedOutput: `{
  "id": "/subscriptions/.../resourceGroups/rg-ai200-acr-lab/providers/Microsoft.Web/serverfarms/plan-docprocessor-9e9994d6",
  "name": "plan-docprocessor-9e9994d6",
  "os": "Linux",
  "reserved": true,
  "sku": {
    "name": "P0v3",
    "tier": "PremiumV3"
  },
  "status": "Ready"
}`
  },
  {
    id: "l3-webapp-create",
    level: 3,
    title: "Tạo Web App từ Container Image trong ACR",
    difficulty: "Trung bình",
    category: "PaaS Hosting",
    mission: "Khởi tạo Web App `$env:APP_NAME` chạy trên Plan `$env:APP_PLAN` và chỉ định container image khởi điểm là `\"$($env:ACR_NAME).azurecr.io/docprocessor:v1\"`.",
    expectedCommand: "az webapp create --resource-group $env:RESOURCE_GROUP --plan $env:APP_PLAN --name $env:APP_NAME --container-image-name \"$($env:ACR_NAME).azurecr.io/docprocessor:v1\"",
    aliases: [
      "az webapp create -g $env:RESOURCE_GROUP --plan $env:APP_PLAN -n $env:APP_NAME --container-image-name \"$($env:ACR_NAME).azurecr.io/docprocessor:v1\"",
      "az webapp create --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --plan $env:APP_PLAN --container-image-name \"$($env:ACR_NAME).azurecr.io/docprocessor:v1\""
    ],
    tokens: ["az", "webapp", "create", "--resource-group", "$env:RESOURCE_GROUP", "--plan", "$env:APP_PLAN", "--name", "$env:APP_NAME", "--container-image-name", "\"$($env:ACR_NAME).azurecr.io/docprocessor:v1\""],
    hints: [
      "Lệnh là `az webapp create`.",
      "Truyền Resource Group, Plan và Name.",
      "Cờ trỏ image là `--container-image-name`."
    ],
    mentalModel: {
      rule: "az webapp create --resource-group <RG> --plan <Plan> --name <App> --container-image-name <Image>",
      breakdown: [
        { part: "az webapp create", role: "PaaS Deployment", desc: "Tạo ứng dụng Web App" },
        { part: "--container-image-name", role: "Image Target", desc: "URL đầy đủ của image trong ACR" }
      ]
    },
    parametersExplanation: [
      { param: "--container-image-name", meaning: "URL đầy đủ của image bao gồm tên miền login server ACR (ví dụ: acr9e9994d6.azurecr.io/docprocessor:v1)." }
    ],
    examNotes: "Lúc này Web App chưa thể kéo image nếu ACR tắt admin và chưa cấp Managed Identity (bước ở Level 4).",
    simulatedOutput: `{
  "defaultHostName": "app-docprocessor-9e9994d6.azurewebsites.net",
  "id": "/subscriptions/.../resourceGroups/rg-ai200-acr-lab/providers/Microsoft.Web/sites/app-docprocessor-9e9994d6",
  "name": "app-docprocessor-9e9994d6",
  "state": "Running"
}`
  },
  {
    id: "l3-webapp-config-container",
    level: 3,
    title: "Cập nhật Container Settings (Image & Registry URL)",
    difficulty: "Trung bình",
    category: "PaaS Hosting",
    mission: "Cập nhật cấu hình container cho Web App `$env:APP_NAME`, chỉ định lại image `\"$($env:ACR_NAME).azurecr.io/docprocessor:v1\"` và Registry URL `\"https://$($env:ACR_NAME).azurecr.io\"`.",
    expectedCommand: "az webapp config container set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --container-image-name \"$($env:ACR_NAME).azurecr.io/docprocessor:v1\" --container-registry-url \"https://$($env:ACR_NAME).azurecr.io\"",
    aliases: [
      "az webapp config container set -g $env:RESOURCE_GROUP -n $env:APP_NAME --container-image-name \"$($env:ACR_NAME).azurecr.io/docprocessor:v1\" --container-registry-url \"https://$($env:ACR_NAME).azurecr.io\""
    ],
    tokens: ["az", "webapp", "config", "container", "set", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--container-image-name", "--container-registry-url"],
    hints: [
      "Lệnh con là `az webapp config container set`.",
      "Tham số gồm `--container-image-name` và `--container-registry-url`."
    ],
    mentalModel: {
      rule: "az webapp config container set --resource-group <RG> --name <App> --container-image-name <Image> --container-registry-url <URL>",
      breakdown: [
        { part: "config container set", role: "Action", desc: "Cập nhật thông tin Registry và Image cho App Service" },
        { part: "--container-registry-url", role: "Endpoint", desc: "URL giao thức HTTPS của Container Registry" }
      ]
    },
    parametersExplanation: [
      { param: "--container-registry-url", meaning: "Địa chỉ HTTPS của ACR (ví dụ: https://acr9e9994d6.azurecr.io)." }
    ],
    examNotes: "Dùng khi bạn muốn đổi phiên bản tag image hoặc đổi sang một registry khác mà không cần dựng lại Web App từ đầu.",
    simulatedOutput: `[
  {
    "name": "DOCKER_REGISTRY_SERVER_URL",
    "value": "https://acr9e9994d6.azurecr.io"
  }
]`
  },
  {
    id: "l3-webapp-show-url",
    level: 3,
    title: "Lấy URL của ứng dụng Web App (Clean TSV)",
    difficulty: "Cơ bản",
    category: "Inspection",
    mission: "Sử dụng truy vấn JMESPath để trích xuất trường `defaultHostName` của Web App `$env:APP_NAME` dưới dạng text thuần (TSV - không ngoặc kép) để kiểm tra endpoint.",
    expectedCommand: "az webapp show --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query defaultHostName --output tsv",
    aliases: [
      "az webapp show -g $env:RESOURCE_GROUP -n $env:APP_NAME --query defaultHostName -o tsv",
      "az webapp show --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query defaultHostName -o tsv"
    ],
    tokens: ["az", "webapp", "show", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--query", "defaultHostName", "--output", "tsv"],
    hints: [
      "Lệnh truy vấn là `az webapp show`.",
      "Trích xuất trường bằng `--query defaultHostName`.",
      "Định dạng chuỗi sạch bằng `--output tsv` (hoặc `-o tsv`)."
    ],
    mentalModel: {
      rule: "az webapp show --resource-group <RG> --name <App> --query defaultHostName --output tsv",
      breakdown: [
        { part: "--query defaultHostName", role: "JMESPath Filter", desc: "Lọc trường tên miền mặc định của app" },
        { part: "--output tsv", role: "Raw Formatter", desc: "Xuất chuỗi thuần túy không dấu ngoặc kép, lý tưởng để gán biến" }
      ]
    },
    parametersExplanation: [
      { param: "--output tsv", meaning: "Tab-Separated Values, loại bỏ toàn bộ dấu nháy kép JSON bao quanh kết quả." }
    ],
    examNotes: "⭐ Mẹo thi AI-200: Khi cần lấy URL hoặc ID để truyền vào curl hoặc gán biến shell, LUÔN dùng `--output tsv`.",
    simulatedOutput: `app-docprocessor-9e9994d6.azurewebsites.net`
  },
  {
    id: "l3-webapp-log-tail",
    level: 3,
    title: "Xem Log trực tiếp thời gian thực (Log Stream)",
    difficulty: "Cơ bản",
    category: "Monitoring & Debug",
    mission: "Để theo dõi quá trình container khởi động và xem thông báo runtime trực tiếp, hãy kết nối vào luồng Log Stream (log tail) của Web App.",
    expectedCommand: "az webapp log tail --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME",
    aliases: [
      "az webapp log tail -g $env:RESOURCE_GROUP -n $env:APP_NAME"
    ],
    tokens: ["az", "webapp", "log", "tail", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME"],
    hints: [
      "Nhóm con là `log`.",
      "Hành động lắng nghe log trực tiếp là `tail`.",
      "Chỉ định resource-group và name."
    ],
    mentalModel: {
      rule: "az webapp log tail --resource-group <RG> --name <App>",
      breakdown: [
        { part: "az webapp log tail", role: "Streamer", desc: "Mở kết nối WebSocket streaming log trực tiếp từ container ra terminal" }
      ]
    },
    parametersExplanation: [
      { param: "tail", meaning: "Xem log thời gian thực, tương đương với `docker logs -f`." }
    ],
    examNotes: "Công cụ hàng đầu khi debug lỗi 'Container failed to start' hoặc 'Site temporarily unavailable'.",
    simulatedOutput: `2026-10-19T12:10:00.123Z INFO  - Initiating warmup request...
2026-10-19T12:10:02.456Z INFO  - Container started successfully.
2026-10-19T12:10:03.789Z INFO  - Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)`
  },

  // ==========================================
  // LEVEL 4: BẢO MẬT RBAC & APP SETTINGS
  // ==========================================
  {
    id: "l4-identity-assign",
    level: 4,
    title: "Bật System-Assigned Managed Identity",
    difficulty: "Trung bình",
    category: "Security & Identity",
    mission: "Bật danh tính tự quản lý cấp hệ thống (System-Assigned Managed Identity) cho Web App `$env:APP_NAME` để ứng dụng có một Identity riêng biệt trên Microsoft Entra ID mà không cần tạo Service Principal thủ công.",
    expectedCommand: "az webapp identity assign --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME",
    aliases: [
      "az webapp identity assign -g $env:RESOURCE_GROUP -n $env:APP_NAME"
    ],
    tokens: ["az", "webapp", "identity", "assign", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME"],
    hints: [
      "Lệnh bắt đầu bằng `az webapp identity`.",
      "Hành động là `assign`."
    ],
    mentalModel: {
      rule: "az webapp identity assign --resource-group <RG> --name <App>",
      breakdown: [
        { part: "identity assign", role: "IAM Provisioning", desc: "Đăng ký Web App thành một Service Principal tự quản lý trong Entra ID" }
      ]
    },
    parametersExplanation: [
      { param: "identity assign", meaning: "Tạo identity gắn liền với vòng đời của Web App (xóa webapp thì identity tự động mất)." }
    ],
    examNotes: "⭐ AI-200 Best Practice: Luôn dùng Managed Identity thay vì lưu trữ Admin credentials hay mật khẩu tĩnh.",
    simulatedOutput: `{
  "principalId": "e1f2a3b4-5678-4321-abcd-9876543210ef",
  "tenantId": "87654321-4321-4321-4321-210987654321",
  "type": "SystemAssigned"
}`
  },
  {
    id: "l4-principal-id",
    level: 4,
    title: "Lấy Principal ID lưu vào biến PowerShell",
    difficulty: "Trung bình",
    category: "Security & Identity",
    mission: "Lấy giá trị `principalId` của Web App và lưu vào biến `$PRINCIPAL_ID` dạng chuỗi sạch (TSV) để chuẩn bị cho bước phân quyền RBAC.",
    expectedCommand: "$PRINCIPAL_ID = az webapp identity show --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query principalId --output tsv",
    aliases: [
      "$PRINCIPAL_ID = az webapp identity show -g $env:RESOURCE_GROUP -n $env:APP_NAME --query principalId -o tsv",
      "$PRINCIPAL_ID = az webapp identity show --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query principalId -o tsv"
    ],
    tokens: ["$PRINCIPAL_ID", "=", "az", "webapp", "identity", "show", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--query", "principalId", "--output", "tsv"],
    hints: [
      "Bắt đầu bằng gán biến `$PRINCIPAL_ID = ...`.",
      "Lệnh truy vấn là `az webapp identity show`.",
      "Lọc bằng `--query principalId` và xuất `--output tsv`."
    ],
    mentalModel: {
      rule: "$VAR = az webapp identity show ... --query principalId --output tsv",
      breakdown: [
        { part: "$PRINCIPAL_ID =", role: "Shell Variable", desc: "Lưu trữ định danh Object ID của Identity" },
        { part: "identity show", role: "IAM Query", desc: "Đọc thông tin Identity của ứng dụng" },
        { part: "--output tsv", role: "Cleaner", desc: "Trả về GUID thuần không có dấu ngoặc kép" }
      ]
    },
    parametersExplanation: [
      { param: "--query principalId", meaning: "Trích xuất mã GUID duy nhất đại diện cho danh tính Web App trên Entra ID." }
    ],
    examNotes: "Dùng `-o tsv` là bắt buộc để biến PowerShell nhận chuỗi sạch không bị dính ký tự `\"`.",
    simulatedOutput: `PS H:\\azure-lab> $PRINCIPAL_ID = az webapp identity show ...
PS H:\\azure-lab> $PRINCIPAL_ID
e1f2a3b4-5678-4321-abcd-9876543210ef`
  },
  {
    id: "l4-acr-id",
    level: 4,
    title: "Lấy Scope ID của Container Registry",
    difficulty: "Trung bình",
    category: "Security & RBAC",
    mission: "Để phân quyền RBAC theo phạm vi hẹp nhất (Least Privilege), hãy lấy Resource ID của ACR `$env:ACR_NAME` và lưu vào biến `$ACR_ID`.",
    expectedCommand: "$ACR_ID = az acr show --resource-group $env:RESOURCE_GROUP --name $env:ACR_NAME --query id --output tsv",
    aliases: [
      "$ACR_ID = az acr show --name $env:ACR_NAME --query id --output tsv",
      "$ACR_ID = az acr show -g $env:RESOURCE_GROUP -n $env:ACR_NAME --query id -o tsv"
    ],
    tokens: ["$ACR_ID", "=", "az", "acr", "show", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:ACR_NAME", "--query", "id", "--output", "tsv"],
    hints: [
      "Gán vào biến `$ACR_ID = ...`.",
      "Lệnh truy vấn là `az acr show`.",
      "Lọc thuộc tính `--query id --output tsv`."
    ],
    mentalModel: {
      rule: "$ACR_ID = az acr show --name <ACR> --query id --output tsv",
      breakdown: [
        { part: "$ACR_ID =", role: "Variable", desc: "Lưu Azure Resource Manager (ARM) Resource ID" },
        { part: "--query id", role: "Scope Identifier", desc: "Đường dẫn định danh tài nguyên cấp ARM để làm Scope cho RBAC" }
      ]
    },
    parametersExplanation: [
      { param: "--query id", meaning: "Lấy đường dẫn đầy đủ dạng: /subscriptions/.../providers/Microsoft.ContainerRegistry/registries/..." }
    ],
    examNotes: "Phân quyền theo Resource Scope bảo đảm chỉ cấp quyền trên duy nhất Registry này, không lan sang các tài nguyên khác.",
    simulatedOutput: `PS H:\\azure-lab> $ACR_ID = az acr show ...
PS H:\\azure-lab> $ACR_ID
/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-acr-lab/providers/Microsoft.ContainerRegistry/registries/acr9e9994d6`
  },
  {
    id: "l4-role-assign",
    level: 4,
    title: "Gán quyền AcrPull (Least Privilege RBAC)",
    difficulty: "Trung bình",
    category: "Security & RBAC",
    mission: "Thực hiện gán vai trò RBAC `AcrPull` cho danh tính `$PRINCIPAL_ID` trên phạm vi tài nguyên `$ACR_ID` để Web App có thể kéo image an toàn mà không cần mật khẩu.",
    expectedCommand: "az role assignment create --assignee $PRINCIPAL_ID --scope $ACR_ID --role AcrPull",
    aliases: [
      "az role assignment create --assignee $PRINCIPAL_ID --role AcrPull --scope $ACR_ID",
      "az role assignment create --scope $ACR_ID --assignee $PRINCIPAL_ID --role AcrPull"
    ],
    tokens: ["az", "role", "assignment", "create", "--assignee", "$PRINCIPAL_ID", "--scope", "$ACR_ID", "--role", "AcrPull"],
    hints: [
      "Lệnh là `az role assignment create`.",
      "Người được cấp quyền là `--assignee $PRINCIPAL_ID`.",
      "Phạm vi tài nguyên là `--scope $ACR_ID`.",
      "Tên vai trò tối thiểu là `--role AcrPull`."
    ],
    mentalModel: {
      rule: "az role assignment create --assignee <Principal> --scope <Scope> --role AcrPull",
      breakdown: [
        { part: "--assignee", role: "Who", desc: "Managed Identity của Web App" },
        { part: "--scope", role: "Where", desc: "Tài nguyên ACR được bảo vệ" },
        { part: "--role AcrPull", role: "What", desc: "Quyền tối thiểu chỉ đọc/kéo container image" }
      ]
    },
    parametersExplanation: [
      { param: "--role AcrPull", meaning: "Vai trò đặc quyền tối thiểu (Least Privilege), chỉ cho phép pull, cấm push/delete." }
    ],
    examNotes: "⭐ Câu hỏi kinh điển trong bài thi AI-200: Không gán Contributor hay Owner, chỉ gán `AcrPull`.",
    simulatedOutput: `{
  "id": "/subscriptions/.../providers/Microsoft.Authorization/roleAssignments/role-assignment-id-12345",
  "principalId": "e1f2a3b4-5678-4321-abcd-9876543210ef",
  "roleDefinitionName": "AcrPull",
  "scope": "/subscriptions/.../providers/Microsoft.ContainerRegistry/registries/acr9e9994d6"
}`
  },
  {
    id: "l4-config-identity-pull",
    level: 4,
    title: "Cấu hình Web App kéo image bằng Managed Identity",
    difficulty: "Trung bình",
    category: "PaaS Configuration",
    mission: "Sau khi đã gán quyền RBAC, hãy cấu hình Web App `$env:APP_NAME` kích hoạt tính năng kéo image bằng Managed Identity hệ thống (`--acr-use-identity true --acr-identity \"[system]\"`).",
    expectedCommand: "az webapp config set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --acr-use-identity true --acr-identity \"[system]\"",
    aliases: [
      "az webapp config set -g $env:RESOURCE_GROUP -n $env:APP_NAME --acr-use-identity true --acr-identity \"[system]\""
    ],
    tokens: ["az", "webapp", "config", "set", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--acr-use-identity", "true", "--acr-identity", "\"[system]\""],
    hints: [
      "Lệnh cấu hình là `az webapp config set`.",
      "Bật sử dụng identity bằng `--acr-use-identity true`.",
      "Chỉ định danh tính hệ thống bằng `--acr-identity \"[system]\"`."
    ],
    mentalModel: {
      rule: "az webapp config set --resource-group <RG> --name <App> --acr-use-identity true --acr-identity \"[system]\"",
      breakdown: [
        { part: "--acr-use-identity true", role: "Switch", desc: "Bật cơ chế xác thực OAuth không mật khẩu cho Docker pull" },
        { part: "--acr-identity \"[system]\"", role: "Identity Type", desc: "Chỉ định dùng System-Assigned Identity" }
      ]
    },
    parametersExplanation: [
      { param: "--acr-use-identity true", meaning: "Ra lệnh cho App Service dùng token của Managed Identity để authenticate với ACR." },
      { param: "--acr-identity \"[system]\"", meaning: "Dùng System-Assigned Identity của chính Web App." }
    ],
    examNotes: "Hoàn tất chu trình bảo mật khép kín: Web App tự động kéo image từ ACR bảo mật mà không lưu bất kỳ password nào trong cấu hình.",
    simulatedOutput: `{
  "acrIdentity": "[system]",
  "acrUseManagedIdentityCreds": true
}`
  },
  {
    id: "l4-appsettings-set",
    level: 4,
    title: "Cấu hình biến App Settings (Port & Storage)",
    difficulty: "Trung bình",
    category: "Runtime Configuration",
    mission: "Cấu hình biến môi trường runtime cho container Web App: đặt cổng lắng nghe `WEBSITES_PORT=8000` và kích hoạt tính năng lưu trữ bền vững `WEBSITES_ENABLE_APP_SERVICE_STORAGE=true`.",
    expectedCommand: "az webapp config appsettings set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --settings WEBSITES_PORT=8000 WEBSITES_ENABLE_APP_SERVICE_STORAGE=true",
    aliases: [
      "az webapp config appsettings set -g $env:RESOURCE_GROUP -n $env:APP_NAME --settings WEBSITES_PORT=8000 WEBSITES_ENABLE_APP_SERVICE_STORAGE=true"
    ],
    tokens: ["az", "webapp", "config", "appsettings", "set", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--settings", "WEBSITES_PORT=8000", "WEBSITES_ENABLE_APP_SERVICE_STORAGE=true"],
    hints: [
      "Lệnh quản lý settings là `az webapp config appsettings set`.",
      "Dùng cờ `--settings` theo sau là các cặp `KEY=VALUE` cách nhau bằng khoảng trắng."
    ],
    mentalModel: {
      rule: "az webapp config appsettings set --resource-group <RG> --name <App> --settings KEY1=VAL1 KEY2=VAL2",
      breakdown: [
        { part: "appsettings set", role: "Config Action", desc: "Thiết lập biến môi trường nạp vào container khi chạy" },
        { part: "WEBSITES_PORT=8000", role: "Port Mapping", desc: "Báo cho router của Azure biết container mở cổng 8000" },
        { part: "WEBSITES_ENABLE_APP_SERVICE_STORAGE=true", role: "Mount Storage", desc: "Mount thư mục /home để lưu log hoặc dữ liệu lâu dài" }
      ]
    },
    parametersExplanation: [
      { param: "WEBSITES_PORT=8000", meaning: "Cổng nội bộ mà tiến trình container (FastAPI, Flask, Node) đang lắng nghe." },
      { param: "WEBSITES_ENABLE_APP_SERVICE_STORAGE=true", meaning: "Duy trì dữ liệu ghi vào /home ngay cả khi container bị restart." }
    ],
    examNotes: "⭐ Cực kỳ quan trọng: Nếu thiếu `WEBSITES_PORT`, App Service sẽ thử dò cổng 80/8080 và báo lỗi Container Timeout sau 230 giây.",
    simulatedOutput: `[
  {
    "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
    "value": "true"
  },
  {
    "name": "WEBSITES_PORT",
    "value": "8000"
  }
]`
  },
  {
    id: "l4-config-always-on",
    level: 4,
    title: "Bật Always-On để tránh Cold Start",
    difficulty: "Cơ bản",
    category: "PaaS Performance",
    mission: "Đối với các ứng dụng AI inference cần phản hồi nhanh, việc container bị ngủ đông (sleep) sau thời gian không có traffic gây ra độ trễ Cold Start rất lớn. Hãy bật tính năng Always-On cho Web App.",
    expectedCommand: "az webapp config set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --always-on true",
    aliases: [
      "az webapp config set -g $env:RESOURCE_GROUP -n $env:APP_NAME --always-on true"
    ],
    tokens: ["az", "webapp", "config", "set", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--always-on", "true"],
    hints: [
      "Lệnh cấu hình chung là `az webapp config set`.",
      "Tham số kích hoạt là `--always-on true`."
    ],
    mentalModel: {
      rule: "az webapp config set --resource-group <RG> --name <App> --always-on true",
      breakdown: [
        { part: "--always-on true", role: "Keep-Alive Policy", desc: "Azure tự động gửi ping định kỳ giữ container luôn chạy trong RAM" }
      ]
    },
    parametersExplanation: [
      { param: "--always-on true", meaning: "Giữ container luôn nạp sẵn trong bộ nhớ, sẵn sàng xử lý request AI ngay lập tức." }
    ],
    examNotes: "Tính năng Always-On được hỗ trợ từ gói Basic/Standard/Premium, không có trên gói Free/Shared.",
    simulatedOutput: `{
  "alwaysOn": true,
  "appCommandLine": "",
  "autoHealEnabled": false
}`
  },
  {
    id: "l4-log-config-fs",
    level: 4,
    title: "Bật Container Logging ra hệ thống tệp",
    difficulty: "Trung bình",
    category: "Monitoring & Logging",
    mission: "Để hệ thống tự động ghi nhận và lưu lại log stdout/stderr từ Docker container vào filesystem nhằm phục vụ phân tích sự cố, hãy cấu hình docker container logging sang `filesystem`.",
    expectedCommand: "az webapp log config --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --docker-container-logging filesystem",
    aliases: [
      "az webapp log config -g $env:RESOURCE_GROUP -n $env:APP_NAME --docker-container-logging filesystem"
    ],
    tokens: ["az", "webapp", "log", "config", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--docker-container-logging", "filesystem"],
    hints: [
      "Nhóm con là `az webapp log config`.",
      "Cờ cấu hình ghi log là `--docker-container-logging filesystem`."
    ],
    mentalModel: {
      rule: "az webapp log config --resource-group <RG> --name <App> --docker-container-logging filesystem",
      breakdown: [
        { part: "log config", role: "Audit Setup", desc: "Cấu hình cơ chế thu thập log" },
        { part: "--docker-container-logging filesystem", role: "Storage Sink", desc: "Lưu log vào ổ đĩa ảo /home/LogFiles" }
      ]
    },
    parametersExplanation: [
      { param: "--docker-container-logging filesystem", meaning: "Ghi log của Docker container vào file hệ thống để tải về hoặc xem qua log tail." }
    ],
    examNotes: "Bắt buộc phải bật lệnh này thì tính năng `az webapp log tail` mới có thể hiển thị chi tiết log từ bên trong container.",
    simulatedOutput: `{
  "applicationLogs": { "fileSystem": { "level": "Off" } },
  "httpLogs": { "fileSystem": { "enabled": false } },
  "detailedErrorMessages": { "enabled": false },
  "failedRequestsTracing": { "enabled": false }
}`
  },
  {
    id: "l4-appsettings-list-jmespath",
    level: 4,
    title: "Lọc App Settings bằng JMESPath Projection",
    difficulty: "Nâng cao",
    category: "CLI & JMESPath",
    mission: "Danh sách cấu hình trả về thường có rất nhiều trường không cần thiết. Hãy dùng bộ lọc JMESPath Projection `--query \"[].{Setting:name, Value:value}\"` kết hợp định dạng bảng để xem tóm tắt Setting và Value.",
    expectedCommand: "az webapp config appsettings list --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query \"[].{Setting:name, Value:value}\" --output table",
    aliases: [
      "az webapp config appsettings list -g $env:RESOURCE_GROUP -n $env:APP_NAME --query \"[].{Setting:name, Value:value}\" -o table",
      "az webapp config appsettings list --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query \"[].{Setting:name, Value:value}\" -o table"
    ],
    tokens: ["az", "webapp", "config", "appsettings", "list", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--query", "\"[].{Setting:name, Value:value}\"", "--output", "table"],
    hints: [
      "Lệnh xem danh sách là `az webapp config appsettings list`.",
      "Bộ lọc Multi-hash: `--query \"[].{Setting:name, Value:value}\"`.",
      "Định dạng bảng: `--output table`."
    ],
    mentalModel: {
      rule: "az ... --query \"[].{NewKey1:oldField1, NewKey2:oldField2}\" --output table",
      breakdown: [
        { part: "[].", role: "Iterator", desc: "Duyệt qua từng phần tử trong danh sách kết quả" },
        { part: "{Setting:name, Value:value}", role: "Multi-hash", desc: "Tạo bảng mới với cột Setting (lấy từ name) và cột Value (lấy từ value)" }
      ]
    },
    parametersExplanation: [
      { param: "--query \"[].{Setting:name, Value:value}\"", meaning: "Trích xuất và đổi tên hiển thị các trường dữ liệu JSON thành bảng 2 cột rõ ràng." }
    ],
    examNotes: "⭐ Kỹ năng JMESPath Projection xuất hiện thường xuyên trong bài thi AI-200 khi được hỏi về cách trích xuất dữ liệu JSON phức tạp.",
    simulatedOutput: `Setting                                Value
-------------------------------------  --------------------
WEBSITES_ENABLE_APP_SERVICE_STORAGE   true
WEBSITES_PORT                          8000`
  },

  // ==========================================
  // LEVEL 5: SIDECAR CONTAINERS (BÀI LAB 3)
  // ==========================================
  {
    id: "l5-sitecontainers-create",
    level: 5,
    title: "Áp dụng cấu hình Sidecar từ file JSON",
    difficulty: "Nâng cao",
    category: "Sidecar Pattern",
    mission: "Trong kiến trúc Microservices & AI Inference (Lab 3), Web App sử dụng mô hình Multi-container Pod (Main App + Sidecar Model Server). Hãy dùng lệnh `az webapp sitecontainers create` để nạp cấu hình từ file `./sitecontainers-spec.json`.",
    expectedCommand: "az webapp sitecontainers create --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --sitecontainers-spec-file ./sitecontainers-spec.json",
    aliases: [
      "az webapp sitecontainers create -n $env:APP_NAME -g $env:RESOURCE_GROUP --sitecontainers-spec-file ./sitecontainers-spec.json",
      "az webapp sitecontainers create --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --sitecontainers-spec-file ./sitecontainers-spec.json"
    ],
    tokens: ["az", "webapp", "sitecontainers", "create", "--name", "$env:APP_NAME", "--resource-group", "$env:RESOURCE_GROUP", "--sitecontainers-spec-file", "./sitecontainers-spec.json"],
    hints: [
      "Lệnh quản lý sidecar là `az webapp sitecontainers create`.",
      "Tham số tên ứng dụng `--name $env:APP_NAME`, nhóm `--resource-group $env:RESOURCE_GROUP`.",
      "File đặc tả cấu hình là `--sitecontainers-spec-file ./sitecontainers-spec.json`."
    ],
    mentalModel: {
      rule: "az webapp sitecontainers create --name <App> --resource-group <RG> --sitecontainers-spec-file <JSON>",
      breakdown: [
        { part: "webapp sitecontainers create", role: "Pod Orchestration", desc: "Tạo cụm multi-container gắn kết cùng chia sẻ localhost và network namespace" },
        { part: "--sitecontainers-spec-file", role: "Manifest Path", desc: "Tệp JSON định nghĩa danh sách các container, volume mounts, port và resource limits" }
      ]
    },
    parametersExplanation: [
      { param: "--sitecontainers-spec-file", meaning: "Đường dẫn file JSON mô tả các container phụ (sidecar) như logging agent, model inference server." }
    ],
    examNotes: "💡 Sidecar Pattern cho phép main app giao tiếp với model server cục bộ qua `http://localhost:<port>` với độ trễ cực thấp.",
    simulatedOutput: `{
  "id": "/subscriptions/.../sites/app-docprocessor-9e9994d6/sitecontainers",
  "name": "app-docprocessor-9e9994d6",
  "status": "Configured",
  "totalContainers": 2
}`
  },
  {
    id: "l5-sitecontainers-list",
    level: 5,
    title: "Liệt kê các Container (Main App & Sidecar)",
    difficulty: "Trung bình",
    category: "Sidecar Pattern",
    mission: "Hãy liệt kê toàn bộ các container (bao gồm Main container và Sidecar container) đang chạy bên trong Web App `$env:APP_NAME` dưới dạng bảng.",
    expectedCommand: "az webapp sitecontainers list --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --output table",
    aliases: [
      "az webapp sitecontainers list -n $env:APP_NAME -g $env:RESOURCE_GROUP -o table",
      "az webapp sitecontainers list --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --output table"
    ],
    tokens: ["az", "webapp", "sitecontainers", "list", "--name", "$env:APP_NAME", "--resource-group", "$env:RESOURCE_GROUP", "--output", "table"],
    hints: [
      "Lệnh là `az webapp sitecontainers list`.",
      "Chỉ định name, resource-group và `--output table`."
    ],
    mentalModel: {
      rule: "az webapp sitecontainers list --name <App> --resource-group <RG> --output table",
      breakdown: [
        { part: "sitecontainers list", role: "Query Action", desc: "Hiển thị danh sách tất cả containers đang hoạt động trong pod" }
      ]
    },
    parametersExplanation: [
      { param: "list", meaning: "Xem tên container, image và cổng tương ứng của từng container." }
    ],
    examNotes: "Giúp xác nhận container chính và container phụ đều đã được nạp thành công vào pod.",
    simulatedOutput: `Name          Image                                              IsMain    Port
------------  -------------------------------------------------  --------  ------
app-service   acr9e9994d6.azurecr.io/docprocessor:v1             True      8000
model-server  acr9e9994d6.azurecr.io/inference-api:v1.0.0       False     8501`
  },
  {
    id: "l5-sitecontainers-log",
    level: 5,
    title: "Xem Log riêng biệt của Sidecar Container",
    difficulty: "Trung bình",
    category: "Monitoring & Debug",
    mission: "Để chẩn đoán sự cố riêng của Sidecar container `model-server` mà không bị lẫn lộn với log của container chính, hãy xem log của riêng container này.",
    expectedCommand: "az webapp sitecontainers log --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --container-name model-server",
    aliases: [
      "az webapp sitecontainers log -n $env:APP_NAME -g $env:RESOURCE_GROUP --container-name model-server",
      "az webapp sitecontainers log --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --container-name model-server"
    ],
    tokens: ["az", "webapp", "sitecontainers", "log", "--name", "$env:APP_NAME", "--resource-group", "$env:RESOURCE_GROUP", "--container-name", "model-server"],
    hints: [
      "Lệnh xem log container phụ là `az webapp sitecontainers log`.",
      "Chỉ định tên container bằng `--container-name model-server`."
    ],
    mentalModel: {
      rule: "az webapp sitecontainers log --name <App> --resource-group <RG> --container-name <Sidecar>",
      breakdown: [
        { part: "sitecontainers log", role: "Targeted Logger", desc: "Trích xuất luồng log độc lập của từng container trong multi-container pod" },
        { part: "--container-name", role: "Filter", desc: "Tên định danh của sidecar container (ví dụ: model-server)" }
      ]
    },
    parametersExplanation: [
      { param: "--container-name", meaning: "Tên của container phụ cần trích xuất nhật ký." }
    ],
    examNotes: "💡 Cô lập nhật ký lỗi giúp xử lý nhanh các tình huống model server bị Out-Of-Memory (OOM) hoặc crash mà app chính không nhận diện được.",
    simulatedOutput: `2026-10-19T12:20:00.100Z [model-server] Initializing ONNX runtime engine...
2026-10-19T12:20:03.250Z [model-server] Model loaded: document-classifier-v1 (FP16)
2026-10-19T12:20:04.000Z [model-server] Server listening at 0.0.0.0:8501`
  },
  {
    id: "l5-sitecontainers-status",
    level: 5,
    title: "Kiểm tra trạng thái Container (Health Check)",
    difficulty: "Cơ bản",
    category: "Health & Monitoring",
    mission: "Kiểm tra trạng thái sức khỏe tổng quát (Health Status) của các container trong Web App `$env:APP_NAME`.",
    expectedCommand: "az webapp sitecontainers status --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP",
    aliases: [
      "az webapp sitecontainers status -n $env:APP_NAME -g $env:RESOURCE_GROUP",
      "az webapp sitecontainers status --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME"
    ],
    tokens: ["az", "webapp", "sitecontainers", "status", "--name", "$env:APP_NAME", "--resource-group", "$env:RESOURCE_GROUP"],
    hints: [
      "Lệnh kiểm tra trạng thái là `az webapp sitecontainers status`.",
      "Truyền tham số `--name $env:APP_NAME` và `--resource-group $env:RESOURCE_GROUP`."
    ],
    mentalModel: {
      rule: "az webapp sitecontainers status --name <App> --resource-group <RG>",
      breakdown: [
        { part: "sitecontainers status", role: "Status Prober", desc: "Đọc trạng thái running, memory usage và restart count của các container" }
      ]
    },
    parametersExplanation: [
      { param: "status", meaning: "Kiểm tra xem tất cả các container trong pod có đang ở trạng thái 'Ready' hay không." }
    ],
    examNotes: "Hoàn tất toàn bộ chu trình thực hành từ Nhập môn, ACR, App Service, RBAC tới Sidecar Containers chuyên sâu!",
    simulatedOutput: `{
  "appServicePlan": "plan-docprocessor-9e9994d6",
  "containers": [
    { "name": "app-service", "status": "Running", "restartCount": 0 },
    { "name": "model-server", "status": "Running", "restartCount": 0 }
  ],
  "overallStatus": "Healthy"
}`
  },

  // ==========================================
  // LEVEL 6: AZURE CONTAINER APPS (ACA)
  // ==========================================
  // --- Phần A: Quản lý Revisions & Cập nhật Image ---
  {
    id: "l6-update-image-digest",
    level: 6,
    title: "Cập nhật Image với Digest SHA256 (Tạo Revision mới)",
    difficulty: "Trung bình",
    category: "Revisions & Images",
    mission: "Để đảm bảo tính bất biến (Immutability) và tránh lỗi kéo nhầm tag cũ trong môi trường Production, hãy cập nhật Container App `<app-name>` trong Resource Group `<rg>` bằng Image kèm mã băm SHA256 (`<registry>/<repo>@sha256:<digest>`). Thao tác này sẽ tự động tạo một Revision mới.",
    expectedCommand: "az containerapp update --name <app-name> --resource-group <rg> --image <registry>/<repo>@sha256:<digest>",
    aliases: [
      "az containerapp update -n <app-name> -g <rg> --image <registry>/<repo>@sha256:<digest>",
      "az containerapp update --resource-group <rg> --name <app-name> --image <registry>/<repo>@sha256:<digest>",
      "az containerapp update -g <rg> -n <app-name> --image <registry>/<repo>@sha256:<digest>"
    ],
    tokens: ["az", "containerapp", "update", "--name", "<app-name>", "--resource-group", "<rg>", "--image", "<registry>/<repo>@sha256:<digest>"],
    hints: [
      "Bắt đầu bằng nhóm lệnh `az containerapp update`.",
      "Cung cấp cờ `--name <app-name>` và `--resource-group <rg>`.",
      "Chỉ định image định dạng digest qua cờ `--image <registry>/<repo>@sha256:<digest>`."
    ],
    mentalModel: {
      rule: "az containerapp update --name <App> --resource-group <RG> --image <Repo@sha256:Digest>",
      breakdown: [
        { part: "az containerapp update", role: "Updater", desc: "Cập nhật thông số template của Container App" },
        { part: "--image", role: "Target Artifact", desc: "Đường dẫn image đầy đủ kèm mã băm SHA256 để đảm bảo tính bất biến" }
      ]
    },
    parametersExplanation: [
      { param: "--image", meaning: "Tên image kèm tag hoặc digest (@sha256:...). Khuyến nghị dùng digest cho Production để chống ghi đè." },
      { param: "update", meaning: "Mọi thay đổi cấu hình template sẽ tự động kích hoạt Azure tạo một Revision mới." }
    ],
    examNotes: "💡 Dùng Digest (`@sha256:...`) thay vì tag động (như `latest`) giúp đảm bảo 100% tất cả replicas khởi tạo đều tải chính xác bản build nhị phân không bị sai lệch.",
    simulatedOutput: `{
  "id": "/subscriptions/.../resourceGroups/rg-lab4/providers/Microsoft.App/containerApps/ca-processor",
  "location": "southeastasia",
  "name": "ca-processor",
  "properties": {
    "latestRevisionName": "ca-processor--20261021-01",
    "provisioningState": "Succeeded",
    "template": {
      "containers": [
        {
          "image": "myacr.azurecr.io/docprocessor@sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
          "name": "ca-processor"
        }
      ]
    }
  }
}`
  },
  {
    id: "l6-verify-containers",
    level: 6,
    title: "Xác minh cấu hình Containers sau khi Update",
    difficulty: "Cơ bản",
    category: "Inspection & Query",
    mission: "Sau khi cập nhật image, hãy dùng lệnh `az containerapp show` kết hợp bộ lọc JMESPath `properties.template.containers` để xác minh cấu hình container trong app `<app-name>` thuộc `<rg>`.",
    expectedCommand: "az containerapp show --name <app-name> --resource-group <rg> --query properties.template.containers",
    aliases: [
      "az containerapp show -n <app-name> -g <rg> --query properties.template.containers",
      "az containerapp show --resource-group <rg> --name <app-name> --query properties.template.containers",
      'az containerapp show --name <app-name> --resource-group <rg> --query "properties.template.containers"',
      'az containerapp show -n <app-name> -g <rg> --query "properties.template.containers"'
    ],
    tokens: ["az", "containerapp", "show", "--name", "<app-name>", "--resource-group", "<rg>", "--query", "properties.template.containers"],
    hints: [
      "Lệnh kiểm tra thông tin chi tiết là `az containerapp show`.",
      "Sử dụng cờ `--query properties.template.containers` để trích xuất mảng container."
    ],
    mentalModel: {
      rule: "az containerapp show --name <App> --resource-group <RG> --query properties.template.containers",
      breakdown: [
        { part: "az containerapp show", role: "Inspector", desc: "Đọc cấu hình JSON chi tiết của ứng dụng Container App" },
        { part: "--query", role: "JMESPath Filter", desc: "Trích xuất đúng nhánh thuộc tính template.containers" }
      ]
    },
    parametersExplanation: [
      { param: "--query", meaning: "Bộ lọc JMESPath giúp chỉ hiển thị các trường cần quan sát mà không cần cuộn qua JSON khổng lồ." }
    ],
    examNotes: "Kiểm tra thuộc tính `image` bên trong `properties.template.containers` để chắc chắn revision mới đang nạp đúng digest mong muốn.",
    simulatedOutput: `[
  {
    "image": "myacr.azurecr.io/docprocessor@sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    "name": "ca-processor",
    "resources": {
      "cpu": 0.5,
      "memory": "1Gi"
    }
  }
]`
  },
  {
    id: "l6-revision-list",
    level: 6,
    title: "Liệt kê tất cả Revisions (Kiểm tra trạng thái Active)",
    difficulty: "Cơ bản",
    category: "Revisions Management",
    mission: "Trong Azure Container Apps, các phiên bản triển khai được quản lý dưới dạng Revisions. Hãy liệt kê tất cả các Revisions của `<app-name>` trong `<rg>` dưới dạng bảng (`-o table`) để kiểm tra revision nào đang active.",
    expectedCommand: "az containerapp revision list --name <app-name> --resource-group <rg> -o table",
    aliases: [
      "az containerapp revision list --name <app-name> --resource-group <rg> --output table",
      "az containerapp revision list -n <app-name> -g <rg> -o table",
      "az containerapp revision list -n <app-name> -g <rg> --output table",
      "az containerapp revision list --resource-group <rg> --name <app-name> -o table",
      "az containerapp revision list --resource-group <rg> --name <app-name> --output table"
    ],
    tokens: ["az", "containerapp", "revision", "list", "--name", "<app-name>", "--resource-group", "<rg>", "-o", "table"],
    hints: [
      "Nhóm lệnh quản lý phiên bản là `az containerapp revision`.",
      "Hành động là `list` và định dạng bảng là `-o table` (hoặc `--output table`)."
    ],
    mentalModel: {
      rule: "az containerapp revision list --name <App> --resource-group <RG> -o table",
      breakdown: [
        { part: "containerapp revision list", role: "Revision Inspector", desc: "Xem toàn bộ lịch sử các revisions của container app" },
        { part: "-o table", role: "Table Output", desc: "Định dạng kết quả dạng bảng gồm tên, active, healthState" }
      ]
    },
    parametersExplanation: [
      { param: "revision list", meaning: "Liệt kê tất cả các bản snapshot cấu hình (revisions) đã từng được sinh ra." }
    ],
    examNotes: "Cột `Active` cho biết revision nào đang được phép chạy replica; cột `TrafficWeight` cho biết tỷ lệ % lưu lượng được điều hướng tới revision đó.",
    simulatedOutput: `Name                       Active    TrafficWeight    HealthState    ProvisioningState
-------------------------  --------  ---------------  -------------  -------------------
ca-processor--20261021-01  True      100              Healthy        Provisioned
ca-processor--20261020-02  False     0                None           Deprovisioned`
  },
  {
    id: "l6-revision-show",
    level: 6,
    title: "Xem chi tiết một Revision cụ thể",
    difficulty: "Cơ bản",
    category: "Revisions Management",
    mission: "Hãy xem toàn bộ thông tin chi tiết và URL kiểm thử độc lập của revision `<revision-name>` thuộc app `<app-name>` trong `<rg>`.",
    expectedCommand: "az containerapp revision show --name <app-name> --resource-group <rg> --revision <revision-name>",
    aliases: [
      "az containerapp revision show -n <app-name> -g <rg> --revision <revision-name>",
      "az containerapp revision show --resource-group <rg> --name <app-name> --revision <revision-name>",
      "az containerapp revision show -g <rg> -n <app-name> --revision <revision-name>"
    ],
    tokens: ["az", "containerapp", "revision", "show", "--name", "<app-name>", "--resource-group", "<rg>", "--revision", "<revision-name>"],
    hints: [
      "Lệnh xem chi tiết revision là `az containerapp revision show`.",
      "Chỉ định tên revision cụ thể bằng cờ `--revision <revision-name>`."
    ],
    mentalModel: {
      rule: "az containerapp revision show --name <App> --resource-group <RG> --revision <RevName>",
      breakdown: [
        { part: "revision show", role: "Revision Detail", desc: "Xem chi tiết một revision cụ thể" },
        { part: "--revision", role: "Revision Identifier", desc: "Tên định danh của revision (thường có hậu tố timestamp)" }
      ]
    },
    parametersExplanation: [
      { param: "--revision", meaning: "Tên duy nhất của revision trong container app (ví dụ: ca-processor--rev1)." }
    ],
    examNotes: "Trường `properties.fqdn` trong kết quả show trả về URL trực tiếp của riêng revision đó, cực kỳ tiện lợi để smoke test trước khi cut-over traffic.",
    simulatedOutput: `{
  "id": "/subscriptions/.../revisions/ca-processor--20261021-01",
  "name": "ca-processor--20261021-01",
  "properties": {
    "active": true,
    "createdTime": "2026-10-21T10:15:30Z",
    "fqdn": "ca-processor--20261021-01.bravecliff-123456.southeastasia.azurecontainerapps.io",
    "healthState": "Healthy",
    "replicas": 1
  }
}`
  },
  {
    id: "l6-revision-deactivate",
    level: 6,
    title: "Vô hiệu hóa Revision lỗi (Deactivate bảo lưu bằng chứng)",
    difficulty: "Trung bình",
    category: "Troubleshooting & Safety",
    mission: "Khi phát hiện một revision bị lỗi, thay vì xóa làm mất dấu vết điều tra, hãy vô hiệu hóa (deactivate) revision `<revision-name>` của app `<app-name>` trong `<rg>` để dừng replica ngay lập tức.",
    expectedCommand: "az containerapp revision deactivate --name <app-name> --resource-group <rg> --revision <revision-name>",
    aliases: [
      "az containerapp revision deactivate -n <app-name> -g <rg> --revision <revision-name>",
      "az containerapp revision deactivate --resource-group <rg> --name <app-name> --revision <revision-name>",
      "az containerapp revision deactivate -g <rg> -n <app-name> --revision <revision-name>"
    ],
    tokens: ["az", "containerapp", "revision", "deactivate", "--name", "<app-name>", "--resource-group", "<rg>", "--revision", "<revision-name>"],
    hints: [
      "Lệnh vô hiệu hóa là `az containerapp revision deactivate`.",
      "Truyền tên app, resource-group và cờ `--revision <revision-name>`."
    ],
    mentalModel: {
      rule: "az containerapp revision deactivate --name <App> --resource-group <RG> --revision <RevName>",
      breakdown: [
        { part: "revision deactivate", role: "Safe Shutdown", desc: "Chuyển trạng thái revision sang Inactive, dừng mọi container của revision đó" },
        { part: "--revision", role: "Target Revision", desc: "Tên revision cần ngừng hoạt động" }
      ]
    },
    parametersExplanation: [
      { param: "deactivate", meaning: "Dừng phân bổ tài nguyên và ngừng cấp traffic cho revision nhưng bảo lưu lịch sử để rollback khi cần." }
    ],
    examNotes: "💡 Best Practice: Không xóa revision lỗi ngay lập tức. Hãy `deactivate` để bảo lưu log và cấu hình cho buổi họp rút kinh nghiệm (Post-mortem Analysis).",
    simulatedOutput: `{
  "name": "ca-processor--20261021-01",
  "properties": {
    "active": false,
    "healthState": "None",
    "provisioningState": "Deprovisioned"
  }
}`
  },
  {
    id: "l6-revision-jmespath",
    level: 6,
    title: "Lọc nhanh Active & Health State của Revisions bằng JMESPath",
    difficulty: "Nâng cao",
    category: "JMESPath & Monitoring",
    mission: "Sử dụng kỹ thuật JMESPath Multi-hash Projection để lọc danh sách tất cả các revisions của app `<app-name>` trong `<rg>` thành bảng 3 cột: `name`, `active` (từ `properties.active`) và `health` (từ `properties.healthState`).",
    expectedCommand: 'az containerapp revision list --name <app-name> --resource-group <rg> --query "[].{name:name,active:properties.active,health:properties.healthState}" -o table',
    aliases: [
      'az containerapp revision list --name <app-name> --resource-group <rg> --query "[].{name:name,active:properties.active,health:properties.healthState}" --output table',
      'az containerapp revision list -n <app-name> -g <rg> --query "[].{name:name,active:properties.active,health:properties.healthState}" -o table',
      'az containerapp revision list -n <app-name> -g <rg> --query "[].{name:name,active:properties.active,health:properties.healthState}" --output table',
      'az containerapp revision list --resource-group <rg> --name <app-name> --query "[].{name:name,active:properties.active,health:properties.healthState}" -o table'
    ],
    tokens: ["az", "containerapp", "revision", "list", "--name", "<app-name>", "--resource-group", "<rg>", "--query", '"[].{name:name,active:properties.active,health:properties.healthState}"', "-o", "table"],
    hints: [
      "Lệnh bắt đầu bằng `az containerapp revision list`.",
      "Cú pháp query là `--query \"[].{name:name,active:properties.active,health:properties.healthState}\"`.",
      "Kết thúc bằng `-o table`."
    ],
    mentalModel: {
      rule: 'az containerapp revision list ... --query "[].{name:name,active:properties.active,health:properties.healthState}" -o table',
      breakdown: [
        { part: "--query", role: "Multi-hash Projection", desc: "Chuyển đổi từng phần tử trong mảng revisions thành đối tượng mới có 3 thuộc tính" },
        { part: "-o table", role: "Formatter", desc: "Hiển thị 3 thuộc tính dưới dạng 3 cột bảng" }
      ]
    },
    parametersExplanation: [
      { param: "--query", meaning: "Cú pháp `[].{Alias:property}` định dạng lại cấu trúc JSON trước khi xuất ra bảng." }
    ],
    examNotes: "Câu hỏi lọc JMESPath xuất hiện rất phổ biến trong đề thi AI-200 và DevOps Engineer để đánh giá kỹ năng trích xuất dữ liệu nhanh.",
    simulatedOutput: `name                       active    health
-------------------------  --------  ---------
ca-processor--20261021-01  True      Healthy
ca-processor--20261020-02  False     None`
  },

  // --- Phần B: Quản lý Vòng đời (Lifecycle) ---
  {
    id: "l6-lifecycle-stop",
    level: 6,
    title: "Dừng Container App (Stop để xử lý sự cố)",
    difficulty: "Cơ bản",
    category: "Lifecycle Management",
    mission: "Để đảm bảo an toàn trong lúc xử lý sự cố nghiêm trọng hoặc bảo trì, hãy dừng hoàn toàn Container App `<app-name>` trong `<rg>` để không có replica nào khởi động.",
    expectedCommand: "az containerapp stop --name <app-name> --resource-group <rg>",
    aliases: [
      "az containerapp stop -n <app-name> -g <rg>",
      "az containerapp stop --resource-group <rg> --name <app-name>",
      "az containerapp stop -g <rg> -n <app-name>"
    ],
    tokens: ["az", "containerapp", "stop", "--name", "<app-name>", "--resource-group", "<rg>"],
    hints: [
      "Lệnh dừng là `az containerapp stop`.",
      "Truyền tham số `--name <app-name>` và `--resource-group <rg>`."
    ],
    mentalModel: {
      rule: "az containerapp stop --name <App> --resource-group <RG>",
      breakdown: [
        { part: "containerapp stop", role: "Lifecycle Action", desc: "Đình chỉ toàn bộ hoạt động của ứng dụng, scale về 0" }
      ]
    },
    parametersExplanation: [
      { param: "stop", meaning: "Hạ số lượng replica về 0, ngưng tiếp nhận traffic ngoài Internet." }
    ],
    examNotes: "Khác với xóa tài nguyên, lệnh `stop` vẫn bảo toàn toàn bộ cấu hình, ingress domains và revision history.",
    simulatedOutput: `{
  "name": "ca-processor",
  "properties": {
    "provisioningState": "Succeeded",
    "runningStatus": "Stopped"
  }
}`
  },
  {
    id: "l6-lifecycle-start",
    level: 6,
    title: "Khởi động lại Container App (Start)",
    difficulty: "Cơ bản",
    category: "Lifecycle Management",
    mission: "Sau khi khắc phục xong sự cố, hãy khởi động lại Container App `<app-name>` trong `<rg>` để tiếp tục phục vụ người dùng.",
    expectedCommand: "az containerapp start --name <app-name> --resource-group <rg>",
    aliases: [
      "az containerapp start -n <app-name> -g <rg>",
      "az containerapp start --resource-group <rg> --name <app-name>",
      "az containerapp start -g <rg> -n <app-name>"
    ],
    tokens: ["az", "containerapp", "start", "--name", "<app-name>", "--resource-group", "<rg>"],
    hints: [
      "Lệnh khởi động là `az containerapp start`.",
      "Truyền tham số `--name <app-name>` và `--resource-group <rg>`."
    ],
    mentalModel: {
      rule: "az containerapp start --name <App> --resource-group <RG>",
      breakdown: [
        { part: "containerapp start", role: "Lifecycle Action", desc: "Kích hoạt ứng dụng chuyển sang trạng thái Running" }
      ]
    },
    parametersExplanation: [
      { param: "start", meaning: "Đưa ứng dụng trở lại trạng thái Running và bắt đầu tiếp nhận request." }
    ],
    examNotes: "Khi start, hệ thống sẽ tự động kích hoạt số lượng replicas tối thiểu dựa trên quy tắc scaling đã cấu hình.",
    simulatedOutput: `{
  "name": "ca-processor",
  "properties": {
    "provisioningState": "Succeeded",
    "runningStatus": "Running"
  }
}`
  },
  {
    id: "l6-lifecycle-restart",
    level: 6,
    title: "Restart Container App (Khởi động lại chu kỳ)",
    difficulty: "Cơ bản",
    category: "Lifecycle Management",
    mission: "Khi ứng dụng bị treo hoặc gặp lỗi rò rỉ bộ nhớ tạm thời mà không thay đổi cấu hình mã nguồn, hãy khởi động lại toàn bộ replicas của app `<app-name>` trong `<rg>`.",
    expectedCommand: "az containerapp restart --name <app-name> --resource-group <rg>",
    aliases: [
      "az containerapp restart -n <app-name> -g <rg>",
      "az containerapp restart --resource-group <rg> --name <app-name>",
      "az containerapp restart -g <rg> -n <app-name>"
    ],
    tokens: ["az", "containerapp", "restart", "--name", "<app-name>", "--resource-group", "<rg>"],
    hints: [
      "Lệnh restart là `az containerapp restart`.",
      "Truyền tham số `--name <app-name>` và `--resource-group <rg>`."
    ],
    mentalModel: {
      rule: "az containerapp restart --name <App> --resource-group <RG>",
      breakdown: [
        { part: "containerapp restart", role: "Lifecycle Action", desc: "Tái khởi động tất cả pods/replicas hiện có" }
      ]
    },
    parametersExplanation: [
      { param: "restart", meaning: "Tạo mới lại các container instance mà không làm thay đổi template hay sinh revision mới." }
    ],
    examNotes: "Dùng `restart` khi chỉ cần dọn dẹp bộ nhớ RAM tạm thời của tiến trình mà không làm đổi phiên bản cấu hình.",
    simulatedOutput: `{
  "name": "ca-processor",
  "properties": {
    "provisioningState": "Succeeded",
    "runningStatus": "Running"
  }
}`
  },

  // --- Phần C: Chẩn đoán & Sửa lỗi (Troubleshooting) ---
  {
    id: "l6-troubleshoot-logs-tail",
    level: 6,
    title: "Log Streaming thời gian thực với cờ --follow",
    difficulty: "Cơ bản",
    category: "Troubleshooting",
    mission: "Để bắt các sự kiện và lỗi stdout/stderr ngay khi chúng xảy ra (tương tự `tail -f`), hãy mở luồng truyền trực tiếp log (streaming) cho Container App `<app-name>` trong `<rg>`.",
    expectedCommand: "az containerapp logs show --name <app-name> --resource-group <rg> --follow",
    aliases: [
      "az containerapp logs show -n <app-name> -g <rg> --follow",
      "az containerapp logs show --name <app-name> --resource-group <rg> -f",
      "az containerapp logs show -n <app-name> -g <rg> -f",
      "az containerapp logs show --resource-group <rg> --name <app-name> --follow"
    ],
    tokens: ["az", "containerapp", "logs", "show", "--name", "<app-name>", "--resource-group", "<rg>", "--follow"],
    hints: [
      "Lệnh xem log là `az containerapp logs show`.",
      "Thêm cờ `--follow` (hoặc `-f`) để xem log liên tục thời gian thực."
    ],
    mentalModel: {
      rule: "az containerapp logs show --name <App> --resource-group <RG> --follow",
      breakdown: [
        { part: "containerapp logs show", role: "Log Prober", desc: "Đọc log stdout/stderr của container" },
        { part: "--follow", role: "Streaming Flag", desc: "Giữ kết nối mở để nhận log mới nhất theo thời gian thực" }
      ]
    },
    parametersExplanation: [
      { param: "--follow", meaning: "Giữ kết nối streaming mở liên tục (tương đương lệnh tail -f trong Linux)." }
    ],
    examNotes: "Đây là lệnh đầu tiên bạn cần chạy khi container gặp tình trạng crash ngay khi vừa khởi động (CrashLoopBackOff).",
    simulatedOutput: `Connecting to the container logs...
[2026-10-21 13:20:01] [INFO] Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
[2026-10-21 13:20:05] [INFO] Application startup complete.
[2026-10-21 13:20:10] [INFO] 10.0.0.4:52310 - "GET /health HTTP/1.1" 200 OK`
  },
  {
    id: "l6-troubleshoot-env-check",
    level: 6,
    title: "Chẩn đoán thiếu Biến môi trường (Env Vars Inspection)",
    difficulty: "Trung bình",
    category: "Troubleshooting",
    mission: "Khi nghi ngờ ứng dụng bị crash do thiếu biến cấu hình hoặc secret, hãy trích xuất danh sách các biến môi trường của container đầu tiên trong app `<app-name>` (thuộc `<rg>`) dưới dạng bảng.",
    expectedCommand: 'az containerapp show --name <app-name> --resource-group <rg> --query "properties.template.containers[0].env" -o table',
    aliases: [
      'az containerapp show --name <app-name> --resource-group <rg> --query "properties.template.containers[0].env" --output table',
      'az containerapp show -n <app-name> -g <rg> --query "properties.template.containers[0].env" -o table',
      'az containerapp show -n <app-name> -g <rg> --query "properties.template.containers[0].env" --output table',
      'az containerapp show --name <app-name> --resource-group <rg> --query properties.template.containers[0].env -o table'
    ],
    tokens: ["az", "containerapp", "show", "--name", "<app-name>", "--resource-group", "<rg>", "--query", '"properties.template.containers[0].env"', "-o", "table"],
    hints: [
      "Lệnh kiểm tra thông tin là `az containerapp show`.",
      "Cờ lọc JMESPath là `--query \"properties.template.containers[0].env\"`.",
      "Xuất kết quả dạng bảng với `-o table`."
    ],
    mentalModel: {
      rule: 'az containerapp show ... --query "properties.template.containers[0].env" -o table',
      breakdown: [
        { part: "--query", role: "Path Extractor", desc: "Trỏ thẳng vào thuộc tính env của container đầu tiên" },
        { part: "-o table", role: "Table Formatter", desc: "Hiển thị 2 cột name và value rõ ràng" }
      ]
    },
    parametersExplanation: [
      { param: "containers[0].env", meaning: "Mảng danh sách các cặp key-value biến môi trường được inject vào container." }
    ],
    examNotes: "Kiểm tra nhanh xem các biến nhạy cảm hoặc endpoint API đã được cấu hình đúng tên hay chưa.",
    simulatedOutput: `Name               Value
-----------------  -----------------
PORT               8000
AI_MODEL_NAME      gpt-4o-mini
LOG_LEVEL          DEBUG`
  },
  {
    id: "l6-troubleshoot-env-remove",
    level: 6,
    title: "Gây lỗi (Mô phỏng): Xóa biến môi trường để test",
    difficulty: "Trung bình",
    category: "Troubleshooting",
    mission: "Trong bài lab mô phỏng tình huống sự cố (hoặc dọn dẹp cấu hình cũ), hãy sử dụng lệnh `az containerapp update` với cờ `--remove-env-vars` để xóa biến môi trường `<VAR_NAME>` khỏi app `<app-name>` trong `<rg>`.",
    expectedCommand: "az containerapp update --name <app-name> --resource-group <rg> --remove-env-vars <VAR_NAME>",
    aliases: [
      "az containerapp update -n <app-name> -g <rg> --remove-env-vars <VAR_NAME>",
      "az containerapp update --resource-group <rg> --name <app-name> --remove-env-vars <VAR_NAME>",
      "az containerapp update -g <rg> -n <app-name> --remove-env-vars <VAR_NAME>"
    ],
    tokens: ["az", "containerapp", "update", "--name", "<app-name>", "--resource-group", "<rg>", "--remove-env-vars", "<VAR_NAME>"],
    hints: [
      "Lệnh cập nhật là `az containerapp update`.",
      "Cờ xóa biến môi trường là `--remove-env-vars <VAR_NAME>`."
    ],
    mentalModel: {
      rule: "az containerapp update --name <App> --resource-group <RG> --remove-env-vars <VarName>",
      breakdown: [
        { part: "containerapp update", role: "App Config Modifier", desc: "Cập nhật lại cấu hình runtime của container app" },
        { part: "--remove-env-vars", role: "Env Cleaner", desc: "Xóa một hoặc nhiều biến môi trường đã gán trước đó" }
      ]
    },
    parametersExplanation: [
      { param: "--remove-env-vars", meaning: "Danh sách tên các biến môi trường cần gỡ bỏ khỏi template của container." }
    ],
    examNotes: "Lưu ý rằng thao tác này sẽ kích hoạt tạo ra một Revision mới mà không còn biến môi trường này nữa.",
    simulatedOutput: `{
  "name": "ca-processor",
  "properties": {
    "latestRevisionName": "ca-processor--remove-env-01",
    "provisioningState": "Succeeded"
  }
}`
  },
  {
    id: "l6-troubleshoot-env-set",
    level: 6,
    title: "Sửa lỗi: Thêm hoặc Cập nhật lại Biến môi trường",
    difficulty: "Trung bình",
    category: "Troubleshooting",
    mission: "Để sửa lỗi ứng dụng bị thiếu cấu hình, hãy bổ sung lại biến môi trường bằng cờ `--set-env-vars <VAR_NAME>=<value>` cho app `<app-name>` trong `<rg>`.",
    expectedCommand: "az containerapp update --name <app-name> --resource-group <rg> --set-env-vars <VAR_NAME>=<value>",
    aliases: [
      "az containerapp update -n <app-name> -g <rg> --set-env-vars <VAR_NAME>=<value>",
      "az containerapp update --resource-group <rg> --name <app-name> --set-env-vars <VAR_NAME>=<value>",
      "az containerapp update -g <rg> -n <app-name> --set-env-vars <VAR_NAME>=<value>"
    ],
    tokens: ["az", "containerapp", "update", "--name", "<app-name>", "--resource-group", "<rg>", "--set-env-vars", "<VAR_NAME>=<value>"],
    hints: [
      "Lệnh là `az containerapp update`.",
      "Cờ thiết lập biến môi trường là `--set-env-vars <VAR_NAME>=<value>`."
    ],
    mentalModel: {
      rule: "az containerapp update --name <App> --resource-group <RG> --set-env-vars <Key>=<Val>",
      breakdown: [
        { part: "--set-env-vars", role: "Env Injector", desc: "Thêm hoặc ghi đè cặp key=value vào biến môi trường" }
      ]
    },
    parametersExplanation: [
      { param: "--set-env-vars", meaning: "Cung cấp danh sách các biến theo cú pháp KEY=VALUE (hoặc KEY=secretref:SECRET_NAME)." }
    ],
    examNotes: "Khi thêm biến môi trường qua `--set-env-vars`, ACA sẽ tiến hành Zero-Downtime rolling update sang revision mới.",
    simulatedOutput: `{
  "name": "ca-processor",
  "properties": {
    "latestRevisionName": "ca-processor--set-env-02",
    "provisioningState": "Succeeded"
  }
}`
  },
  {
    id: "l6-troubleshoot-ingress-check",
    level: 6,
    title: "Chẩn đoán sai Port: Kiểm tra cấu hình Ingress (targetPort)",
    difficulty: "Trung bình",
    category: "Troubleshooting",
    mission: "Nếu ứng dụng trả về mã lỗi 502 Bad Gateway khi truy cập domain, nguyên nhân thường do router Ingress trỏ sai cổng nội bộ. Hãy trích xuất cấu hình Ingress của app `<app-name>` (thuộc `<rg>`) dưới dạng YAML.",
    expectedCommand: 'az containerapp show --name <app-name> --resource-group <rg> --query "properties.configuration.ingress" -o yaml',
    aliases: [
      'az containerapp show --name <app-name> --resource-group <rg> --query "properties.configuration.ingress" --output yaml',
      'az containerapp show -n <app-name> -g <rg> --query "properties.configuration.ingress" -o yaml',
      'az containerapp show -n <app-name> -g <rg> --query "properties.configuration.ingress" --output yaml',
      'az containerapp show --name <app-name> --resource-group <rg> --query properties.configuration.ingress -o yaml'
    ],
    tokens: ["az", "containerapp", "show", "--name", "<app-name>", "--resource-group", "<rg>", "--query", '"properties.configuration.ingress"', "-o", "yaml"],
    hints: [
      "Lệnh là `az containerapp show`.",
      "Cờ trích xuất là `--query \"properties.configuration.ingress\"`.",
      "Định dạng xuất là `-o yaml`."
    ],
    mentalModel: {
      rule: 'az containerapp show ... --query "properties.configuration.ingress" -o yaml',
      breakdown: [
        { part: "--query properties.configuration.ingress", role: "Ingress Subtree", desc: "Trích xuất khối cấu hình định tuyến ingress" },
        { part: "-o yaml", role: "YAML Formatter", desc: "Xuất cấu hình phân cấp dạng YAML dễ đọc" }
      ]
    },
    parametersExplanation: [
      { param: "targetPort", meaning: "Cổng nội bộ mà container web server (như FastAPI, Node, Nginx) đang lắng nghe." }
    ],
    examNotes: "Cần đảm bảo `targetPort` trong Ingress khớp chính xác với cổng EXPOSE trong Dockerfile hoặc cổng mà ứng dụng bind.",
    simulatedOutput: `allowInsecure: false
external: true
fqdn: ca-processor.bravecliff-123456.southeastasia.azurecontainerapps.io
targetPort: 8080
transport: auto`
  },
  {
    id: "l6-troubleshoot-ingress-port",
    level: 6,
    title: "Sửa lỗi Port: Cập nhật lại Target Port cho Ingress",
    difficulty: "Trung bình",
    category: "Troubleshooting",
    mission: "Sau khi phát hiện Ingress trỏ nhầm cổng, hãy cập nhật lại `--target-port <port>` cho Container App `<app-name>` trong `<rg>` bằng lệnh `az containerapp ingress update`.",
    expectedCommand: "az containerapp ingress update --name <app-name> --resource-group <rg> --target-port <port>",
    aliases: [
      "az containerapp ingress update -n <app-name> -g <rg> --target-port <port>",
      "az containerapp ingress update --resource-group <rg> --name <app-name> --target-port <port>",
      "az containerapp ingress update -g <rg> -n <app-name> --target-port <port>"
    ],
    tokens: ["az", "containerapp", "ingress", "update", "--name", "<app-name>", "--resource-group", "<rg>", "--target-port", "<port>"],
    hints: [
      "Nhóm lệnh cấu hình router là `az containerapp ingress update`.",
      "Chỉ định tham số `--target-port <port>`."
    ],
    mentalModel: {
      rule: "az containerapp ingress update --name <App> --resource-group <RG> --target-port <Port>",
      breakdown: [
        { part: "containerapp ingress update", role: "Ingress Controller", desc: "Cập nhật cấu hình router Envoy ingress" },
        { part: "--target-port", role: "Port Mapping", desc: "Cổng đích mà container lắng nghe lưu lượng" }
      ]
    },
    parametersExplanation: [
      { param: "--target-port", meaning: "Cổng đích mà traffic mạng từ Internet/VNet sẽ được chuyển tiếp vào trong container." }
    ],
    examNotes: "Lệnh `az containerapp ingress update` có hiệu lực ngay lập tức mà không cần build lại hay push lại container image.",
    simulatedOutput: `{
  "allowInsecure": false,
  "external": true,
  "fqdn": "ca-processor.bravecliff-123456.southeastasia.azurecontainerapps.io",
  "targetPort": 8000,
  "transport": "Auto"
}`
  },

  // --- Phần D: Truy vấn Log Analytics (Log Lịch sử) ---
  {
    id: "l6-logs-workspace-id",
    level: 6,
    title: "Lấy Workspace ID của Log Analytics (customerId) dạng sạch",
    difficulty: "Trung bình",
    category: "Log Analytics",
    mission: "Để truy vấn log lịch sử bằng KQL, bạn cần Workspace ID. Hãy trích xuất trường `customerId` từ Container App Environment `<env-name>` trong `<rg>` dưới dạng chuỗi sạch `-o tsv`.",
    expectedCommand: "az containerapp env show --name <env-name> --resource-group <rg> --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId -o tsv",
    aliases: [
      "az containerapp env show --name <env-name> --resource-group <rg> --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --output tsv",
      "az containerapp env show -n <env-name> -g <rg> --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId -o tsv",
      "az containerapp env show -n <env-name> -g <rg> --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --output tsv",
      "$WORKSPACE_ID = az containerapp env show --name <env-name> --resource-group <rg> --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId -o tsv",
      "az containerapp env show --resource-group <rg> --name <env-name> --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId -o tsv"
    ],
    tokens: ["az", "containerapp", "env", "show", "--name", "<env-name>", "--resource-group", "<rg>", "--query", "properties.appLogsConfiguration.logAnalyticsConfiguration.customerId", "-o", "tsv"],
    hints: [
      "Lệnh xem môi trường là `az containerapp env show`.",
      "Truy vấn sâu vào `properties.appLogsConfiguration.logAnalyticsConfiguration.customerId`.",
      "Dùng `-o tsv` để lấy chuỗi ID thuần túy không ngoặc kép."
    ],
    mentalModel: {
      rule: "az containerapp env show ... --query properties.appLogsConfiguration...customerId -o tsv",
      breakdown: [
        { part: "containerapp env show", role: "Environment Inspector", desc: "Xem cấu hình ACA Environment" },
        { part: "--query ...customerId -o tsv", role: "Clean String Extraction", desc: "Lấy đúng Workspace GUID sạch không dấu ngoặc kép" }
      ]
    },
    parametersExplanation: [
      { param: "customerId", meaning: "Định danh định dạng GUID đại diện cho Log Analytics Workspace gắn liền với môi trường ACA." },
      { param: "-o tsv", meaning: "Trích xuất giá trị thô, không chứa nháy kép, sẵn sàng gán vào biến $WORKSPACE_ID." }
    ],
    examNotes: "Lưu Workspace ID vào biến môi trường `$WORKSPACE_ID` trong PowerShell hoặc Bash để tái sử dụng cho các câu truy vấn KQL tiếp theo.",
    simulatedOutput: "4a8f9b20-1234-4abc-9def-0123456789ab"
  },
  {
    id: "l6-logs-kql-recent",
    level: 6,
    title: "Truy vấn 20 Log gần nhất qua KQL (Log Analytics)",
    difficulty: "Nâng cao",
    category: "KQL & Log Analytics",
    mission: "Khi ứng dụng đã tắt hoặc gặp sự cố ngắt quãng trong quá khứ, hãy dùng lệnh `az monitor log-analytics query` cùng ngôn ngữ KQL để truy xuất 20 dòng log mới nhất của app `<app-name>` từ bảng `ContainerAppConsoleLogs_CL`.",
    expectedCommand: 'az monitor log-analytics query -w $WORKSPACE_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == \'<app-name>\' | project TimeGenerated, Log_s | order by TimeGenerated desc | take 20" -o table',
    aliases: [
      'az monitor log-analytics query --workspace $WORKSPACE_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == \'<app-name>\' | project TimeGenerated, Log_s | order by TimeGenerated desc | take 20" -o table',
      'az monitor log-analytics query -w $WORKSPACE_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == \'<app-name>\' | project TimeGenerated, Log_s | order by TimeGenerated desc | take 20" --output table',
      'az monitor log-analytics query --workspace $WORKSPACE_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == \'<app-name>\' | project TimeGenerated, Log_s | order by TimeGenerated desc | take 20" --output table'
    ],
    tokens: ["az", "monitor", "log-analytics", "query", "-w", "$WORKSPACE_ID", "--analytics-query", '"ContainerAppConsoleLogs_CL | where ContainerAppName_s == \'<app-name>\' | project TimeGenerated, Log_s | order by TimeGenerated desc | take 20"', "-o", "table"],
    hints: [
      "Nhóm lệnh truy vấn nhật ký là `az monitor log-analytics query`.",
      "Tham số workspace là `-w $WORKSPACE_ID` (hoặc `--workspace $WORKSPACE_ID`).",
      "Truy vấn KQL lọc theo `where ContainerAppName_s == '<app-name>'` và lấy 2 cột `TimeGenerated, Log_s`."
    ],
    mentalModel: {
      rule: 'az monitor log-analytics query -w <WorkspaceID> --analytics-query "<KQL>" -o table',
      breakdown: [
        { part: "az monitor log-analytics query", role: "Log Engine", desc: "Thực thi truy vấn KQL trên Azure Monitor" },
        { part: "ContainerAppConsoleLogs_CL", role: "Table", desc: "Bảng lưu toàn bộ stdout/stderr của Azure Container Apps" },
        { part: "where ContainerAppName_s", role: "KQL Filter", desc: "Lọc chính xác theo tên ứng dụng" },
        { part: "project TimeGenerated, Log_s", role: "Projection", desc: "Chỉ chọn thời gian và nội dung log" }
      ]
    },
    parametersExplanation: [
      { param: "ContainerAppConsoleLogs_CL", meaning: "Bảng Custom Log chuẩn của ACA chứa nhật ký giao diện dòng lệnh." },
      { param: "Log_s", meaning: "Cột chứa chuỗi văn bản dòng nhật ký (message) được in ra từ container." }
    ],
    examNotes: "💡 KQL là kỹ năng cốt lõi trong đề thi Microsoft AI-200 khi hỏi về giám sát và chẩn đoán sự cố ứng dụng đám mây.",
    simulatedOutput: `TimeGenerated             Log_s
------------------------  -------------------------------------------------
2026-10-21T13:45:10.123Z  [INFO] Processing document batch #42 completed.
2026-10-21T13:45:09.987Z  [INFO] Received POST /v1/infer request from 10.0.0.5
2026-10-21T13:45:05.456Z  [INFO] Health check probe succeeded.`
  },
  {
    id: "l6-logs-kql-errors",
    level: 6,
    title: "Lọc nhanh các Log chứa lỗi (Error Filter KQL)",
    difficulty: "Nâng cao",
    category: "KQL & Troubleshooting",
    mission: "Để khoanh vùng nhanh nguyên nhân gây lỗi giữa hàng ngàn dòng log, hãy viết truy vấn KQL lấy 20 log gần nhất của `<app-name>` trong đó cột `Log_s` có chứa chuỗi `'error'`.",
    expectedCommand: 'az monitor log-analytics query -w $WORKSPACE_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == \'<app-name>\' and Log_s contains \'error\' | order by TimeGenerated desc | take 20" -o table',
    aliases: [
      'az monitor log-analytics query --workspace $WORKSPACE_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == \'<app-name>\' and Log_s contains \'error\' | order by TimeGenerated desc | take 20" -o table',
      'az monitor log-analytics query -w $WORKSPACE_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == \'<app-name>\' and Log_s contains \'error\' | order by TimeGenerated desc | take 20" --output table',
      'az monitor log-analytics query --workspace $WORKSPACE_ID --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == \'<app-name>\' and Log_s contains \'error\' | order by TimeGenerated desc | take 20" --output table'
    ],
    tokens: ["az", "monitor", "log-analytics", "query", "-w", "$WORKSPACE_ID", "--analytics-query", '"ContainerAppConsoleLogs_CL | where ContainerAppName_s == \'<app-name>\' and Log_s contains \'error\' | order by TimeGenerated desc | take 20"', "-o", "table"],
    hints: [
      "Sử dụng lệnh `az monitor log-analytics query -w $WORKSPACE_ID`.",
      "Trong mệnh đề KQL, kết hợp điều kiện `and Log_s contains 'error'`.",
      "Sắp xếp giảm dần theo thời gian `order by TimeGenerated desc | take 20`."
    ],
    mentalModel: {
      rule: 'az monitor log-analytics query -w <WorkspaceID> --analytics-query "... and Log_s contains \'error\' ..." -o table',
      breakdown: [
        { part: "and Log_s contains 'error'", role: "Text Matcher", desc: "Tìm kiếm chuỗi 'error' không phân biệt hoa thường trong nội dung log" },
        { part: "take 20", role: "Limit", desc: "Giới hạn 20 dòng mới nhất để tăng tốc độ truy vấn" }
      ]
    },
    parametersExplanation: [
      { param: "contains", meaning: "Toán tử KQL tìm kiếm chuỗi con (case-insensitive substring match)." }
    ],
    examNotes: "Đây là câu lệnh thực chiến số 1 giúp DevOps / AI Engineer phát hiện ngay các lỗi như Out Of Memory (OOM), Unhandled Exception hay Connection Refused.",
    simulatedOutput: `TimeGenerated             Log_s
------------------------  -------------------------------------------------
2026-10-21T13:40:22.789Z  [ERROR] ConnectionRefusedError: Unable to reach database host:5432
2026-10-21T13:40:20.102Z  [ERROR] Failed to load configuration model: Key 'AI_MODEL_KEY' not found.`
  },

  // --- Phần E: Cấu hình Health Probes (Từ lý thuyết Module) ---
  {
    id: "l6-health-probes-inspect",
    level: 6,
    title: "Kiểm tra cấu hình Health Probes (Liveness & Readiness)",
    difficulty: "Trung bình",
    category: "Health Probes",
    mission: "Cấu hình Health Probes thường được định nghĩa trong file YAML lúc deploy. Hãy dùng `az containerapp show` để kiểm tra các probes hiện có của container đầu tiên trong app `<app-name>` (thuộc `<rg>`) dưới dạng YAML.",
    expectedCommand: 'az containerapp show --name <app-name> --resource-group <rg> --query "properties.template.containers[0].probes" -o yaml',
    aliases: [
      'az containerapp show --name <app-name> --resource-group <rg> --query "properties.template.containers[0].probes" --output yaml',
      'az containerapp show -n <app-name> -g <rg> --query "properties.template.containers[0].probes" -o yaml',
      'az containerapp show -n <app-name> -g <rg> --query "properties.template.containers[0].probes" --output yaml',
      'az containerapp show --name <app-name> --resource-group <rg> --query properties.template.containers[0].probes -o yaml'
    ],
    tokens: ["az", "containerapp", "show", "--name", "<app-name>", "--resource-group", "<rg>", "--query", '"properties.template.containers[0].probes"', "-o", "yaml"],
    hints: [
      "Lệnh kiểm tra là `az containerapp show`.",
      "Cờ truy vấn JMESPath là `--query \"properties.template.containers[0].probes\"`.",
      "Định dạng xuất là `-o yaml`."
    ],
    mentalModel: {
      rule: 'az containerapp show ... --query "properties.template.containers[0].probes" -o yaml',
      breakdown: [
        { part: "--query ...containers[0].probes", role: "Probe Subtree", desc: "Trích xuất danh sách cấu hình kiểm tra sức khỏe của container" },
        { part: "-o yaml", role: "YAML Formatter", desc: "Hiển thị type, path, port, periodSeconds rõ ràng" }
      ]
    },
    parametersExplanation: [
      { param: "probes", meaning: "Danh sách các cơ chế thăm dò sức khỏe định kỳ gồm Liveness, Readiness và Startup probes." }
    ],
    examNotes: "💡 Điểm thi AI-200: Liveness probe dùng để tự động khởi động lại container khi bị treo/deadlock; Readiness probe dùng để xác định container đã sẵn sàng tiếp nhận traffic định tuyến từ ingress hay chưa.",
    simulatedOutput: `- failureThreshold: 3
  httpGet:
    path: /health/liveness
    port: 8000
    scheme: HTTP
  initialDelaySeconds: 10
  periodSeconds: 15
  type: Liveness
- failureThreshold: 3
  httpGet:
    path: /health/readiness
    port: 8000
    scheme: HTTP
  initialDelaySeconds: 5
  periodSeconds: 10
  type: Readiness`
  },

  // =========================================================================
  // BỔ SUNG TỪ BÀI LAB "DEPLOY A CONTAINERIZED BACKEND API" (LAB 1 ACA)
  // =========================================================================

  // --- Phần F: Khởi tạo Container App với Managed Identity & Secrets ---
  {
    id: "l6-create-managed-identity",
    level: 6,
    title: "Khởi tạo Container App với System Managed Identity & ACR Auth",
    difficulty: "Nâng cao",
    category: "Deployment & Identity",
    mission: "Trong bài lab 'Deploy a containerized backend API', hãy khởi tạo một Container App tên `<app-name>` trong Resource Group `<rg>`, Environment `<env-name>` với Image `<registry>/<image>`. Mở Ingress external với `--target-port <port>`, nạp biến môi trường `MODEL_NAME=$MODEL_NAME`, trỏ registry server `<registry>` và kích hoạt System-assigned Managed Identity tự động gán quyền AcrPull bằng cờ `--registry-identity system`.",
    expectedCommand: "az containerapp create --name <app-name> --resource-group <rg> --environment <env-name> --image <registry>/<image> --ingress external --target-port <port> --env-vars MODEL_NAME=$MODEL_NAME --registry-server <registry> --registry-identity system",
    aliases: [
      "az containerapp create -n <app-name> -g <rg> --environment <env-name> --image <registry>/<image> --ingress external --target-port <port> --env-vars MODEL_NAME=$MODEL_NAME --registry-server <registry> --registry-identity system",
      "az containerapp create --name <app-name> --resource-group <rg> --environment <env-name> --image <registry>/<image> --target-port <port> --ingress external --env-vars MODEL_NAME=$MODEL_NAME --registry-server <registry> --registry-identity system"
    ],
    tokens: ["az", "containerapp", "create", "--name", "<app-name>", "--resource-group", "<rg>", "--environment", "<env-name>", "--image", "<registry>/<image>", "--ingress", "external", "--target-port", "<port>", "--env-vars", "MODEL_NAME=$MODEL_NAME", "--registry-server", "<registry>", "--registry-identity", "system"],
    hints: [
      "Nhóm lệnh khởi tạo ứng dụng là `az containerapp create`.",
      "Chỉ định `--ingress external` và `--target-port <port>` để mở cổng router.",
      "Khai báo `--registry-server <registry>` và bật nhận dạng không mật khẩu bằng `--registry-identity system`."
    ],
    mentalModel: {
      rule: "az containerapp create --name <App> --resource-group <RG> --environment <Env> --image <Img> ... --registry-identity system",
      breakdown: [
        { part: "containerapp create", role: "Resource Provisioner", desc: "Khởi tạo ứng dụng Container App mới trong ACA Environment" },
        { part: "--ingress external", role: "Network Routing", desc: "Cấp phát IP công khai và định tuyến tên miền FQDN từ Internet" },
        { part: "--registry-identity system", role: "Passwordless Auth", desc: "Tự động kích hoạt System Managed Identity và gán quyền AcrPull vào Registry" }
      ]
    },
    parametersExplanation: [
      { param: "--registry-identity system", meaning: "Sử dụng System-Assigned Managed Identity để xác thực kéo image từ ACR, không cần username/password tĩnh." },
      { param: "--registry-server", meaning: "Địa chỉ FQDN của Azure Container Registry lưu trữ image." },
      { param: "--env-vars", meaning: "Thiết lập biến môi trường khởi tạo runtime cho container." }
    ],
    examNotes: "💡 Điểm thi cốt lõi: Cờ `--registry-identity system` tự động gán vai trò AcrPull cho Managed Identity của app trên ACR chỉ định.",
    simulatedOutput: `{
  "id": "/subscriptions/.../resourceGroups/rg-ai200/providers/Microsoft.App/containerApps/ca-backend-api",
  "location": "southeastasia",
  "name": "ca-backend-api",
  "properties": {
    "configuration": {
      "ingress": {
        "external": true,
        "fqdn": "ca-backend-api.bravecliff-123456.southeastasia.azurecontainerapps.io",
        "targetPort": 8000
      },
      "registries": [
        {
          "identity": "system",
          "server": "myacr.azurecr.io"
        }
      ]
    },
    "provisioningState": "Succeeded"
  }
}`
  },
  {
    id: "l6-secret-set",
    level: 6,
    title: "Tạo Secret mã hóa trong Kho Secrets của ACA",
    difficulty: "Cơ bản",
    category: "Secrets & Security",
    mission: "Để bảo vệ các chuỗi nhạy cảm (như API key, mật khẩu kết nối), hãy dùng lệnh `az containerapp secret set` để thêm secret `<secret-name>=<secret-value>` vào kho lưu trữ bí mật của app `<app-name>` trong `<rg>`.",
    expectedCommand: "az containerapp secret set -n <app-name> -g <rg> --secrets <secret-name>=<secret-value>",
    aliases: [
      "az containerapp secret set --name <app-name> --resource-group <rg> --secrets <secret-name>=<secret-value>",
      "az containerapp secret set -g <rg> -n <app-name> --secrets <secret-name>=<secret-value>",
      "az containerapp secret set --resource-group <rg> --name <app-name> --secrets <secret-name>=<secret-value>"
    ],
    tokens: ["az", "containerapp", "secret", "set", "-n", "<app-name>", "-g", "<rg>", "--secrets", "<secret-name>=<secret-value>"],
    hints: [
      "Nhóm lệnh quản lý secret là `az containerapp secret set`.",
      "Chỉ định tham số `--secrets <secret-name>=<secret-value>`."
    ],
    mentalModel: {
      rule: "az containerapp secret set -n <App> -g <RG> --secrets <Key>=<Val>",
      breakdown: [
        { part: "containerapp secret set", role: "Secret Vault Action", desc: "Lưu trữ dữ liệu nhạy cảm được mã hóa tại tầng ứng dụng ACA" },
        { part: "--secrets", role: "Secret Payload", desc: "Cặp tên bí mật và giá trị tương ứng" }
      ]
    },
    parametersExplanation: [
      { param: "--secrets", meaning: "Cung cấp danh sách các cặp name=value cần mã hóa và lưu trữ an toàn." }
    ],
    examNotes: "Secrets trong Azure Container Apps được mã hóa khi lưu trữ (encrypted at rest) và chỉ nạp vào bộ nhớ khi container chạy.",
    simulatedOutput: `[
  {
    "name": "ai-api-key"
  }
]`
  },
  {
    id: "l6-secretref-env",
    level: 6,
    title: "Tham chiếu Secret vào Biến môi trường (secretref:)",
    difficulty: "Trung bình",
    category: "Secrets & Config",
    mission: "Sau khi đã lưu secret an toàn trong kho, hãy cập nhật Container App `<app-name>` (thuộc `<rg>`) để đưa secret vào container dưới dạng biến môi trường bằng cú pháp `--set-env-vars <ENV_VAR>=secretref:<secret-name>`. Thao tác này sẽ tự động tạo revision mới.",
    expectedCommand: "az containerapp update -n <app-name> -g <rg> --set-env-vars <ENV_VAR>=secretref:<secret-name>",
    aliases: [
      "az containerapp update --name <app-name> --resource-group <rg> --set-env-vars <ENV_VAR>=secretref:<secret-name>",
      "az containerapp update -g <rg> -n <app-name> --set-env-vars <ENV_VAR>=secretref:<secret-name>",
      "az containerapp update --resource-group <rg> --name <app-name> --set-env-vars <ENV_VAR>=secretref:<secret-name>"
    ],
    tokens: ["az", "containerapp", "update", "-n", "<app-name>", "-g", "<rg>", "--set-env-vars", "<ENV_VAR>=secretref:<secret-name>"],
    hints: [
      "Lệnh cập nhật ứng dụng là `az containerapp update`.",
      "Dùng cờ `--set-env-vars` kết hợp tiền tố `secretref:<secret-name>`."
    ],
    mentalModel: {
      rule: "az containerapp update -n <App> -g <RG> --set-env-vars <Env>=secretref:<Secret>",
      breakdown: [
        { part: "--set-env-vars", role: "Env Var Setter", desc: "Gán biến môi trường cho container" },
        { part: "secretref:", role: "Secret Reference", desc: "Cú pháp liên kết biến môi trường với secret trong kho thay vì giá trị thô" }
      ]
    },
    parametersExplanation: [
      { param: "secretref:<name>", meaning: "Cơ chế liên kết động giữa biến môi trường và secret name, tránh lộ mật khẩu dạng plain text." }
    ],
    examNotes: "💡 Điểm thi AI-200: Không bao giờ gán khóa API dạng plain text qua `--set-env-vars API_KEY=xyz`. Luôn dùng `secret set` kết hợp `secretref:`.",
    simulatedOutput: `{
  "name": "ca-backend-api",
  "properties": {
    "latestRevisionName": "ca-backend-api--sec-01",
    "provisioningState": "Succeeded"
  }
}`
  },

  // --- Phần G: Xác minh Deployment (Bổ sung) ---
  {
    id: "l6-verify-fqdn",
    level: 6,
    title: "Trích xuất FQDN của Container App vào biến $FQDN",
    difficulty: "Cơ bản",
    category: "Verification",
    mission: "Để chuẩn bị gửi request kiểm thử, hãy truy vấn tên miền đầy đủ FQDN từ Ingress của Container App `<app-name>` trong `<rg>` và gán vào biến PowerShell `$FQDN` bằng cờ `-o tsv`.",
    expectedCommand: "$FQDN = az containerapp show -n <app-name> -g <rg> --query properties.configuration.ingress.fqdn -o tsv",
    aliases: [
      "$FQDN = az containerapp show --name <app-name> --resource-group <rg> --query properties.configuration.ingress.fqdn -o tsv",
      "$FQDN = az containerapp show -n <app-name> -g <rg> --query properties.configuration.ingress.fqdn --output tsv",
      "$FQDN = az containerapp show --resource-group <rg> --name <app-name> --query properties.configuration.ingress.fqdn -o tsv"
    ],
    tokens: ["$FQDN", "=", "az", "containerapp", "show", "-n", "<app-name>", "-g", "<rg>", "--query", "properties.configuration.ingress.fqdn", "-o", "tsv"],
    hints: [
      "Bắt đầu bằng phép gán biến `$FQDN = az containerapp show`.",
      "Đường dẫn JMESPath là `--query properties.configuration.ingress.fqdn`.",
      "Kết thúc bằng `-o tsv` để trích xuất chuỗi sạch."
    ],
    mentalModel: {
      rule: "$FQDN = az containerapp show -n <App> -g <RG> --query ...ingress.fqdn -o tsv",
      breakdown: [
        { part: "$FQDN =", role: "Variable Binding", desc: "Lưu tên miền vào biến môi trường shell" },
        { part: "properties.configuration.ingress.fqdn", role: "JMESPath Query", desc: "Trích xuất tên miền đủ điều kiện của Ingress" },
        { part: "-o tsv", role: "Clean String", desc: "Loại bỏ ngoặc kép JSON để URL hợp lệ" }
      ]
    },
    parametersExplanation: [
      { param: "ingress.fqdn", meaning: "Fully Qualified Domain Name do Azure Container Apps cấp phát tự động." }
    ],
    examNotes: "Sử dụng biến $FQDN giúp các script kiểm thử tự động linh hoạt, không phụ thuộc vào chuỗi URL cố định.",
    simulatedOutput: "ca-backend-api.bravecliff-123456.southeastasia.azurecontainerapps.io"
  },
  {
    id: "l6-verify-health",
    level: 6,
    title: "Kiểm tra Health Endpoint bằng Invoke-RestMethod",
    difficulty: "Cơ bản",
    category: "Verification",
    mission: "Trong PowerShell, hãy dùng lệnh `Invoke-RestMethod` để gọi health endpoint `https://$FQDN/health` nhằm kiểm tra ứng dụng backend API đã chạy thành công hay chưa.",
    expectedCommand: 'Invoke-RestMethod -Uri "https://$FQDN/health"',
    aliases: [
      'Invoke-RestMethod -Uri "https://$FQDN/health"',
      'Invoke-RestMethod -Uri https://$FQDN/health',
      'Invoke-RestMethod "https://$FQDN/health"',
      'irm "https://$FQDN/health"',
      'irm -Uri "https://$FQDN/health"'
    ],
    tokens: ["Invoke-RestMethod", "-Uri", '"https://$FQDN/health"'],
    hints: [
      "Cmdlet gửi HTTP request trong PowerShell là `Invoke-RestMethod`.",
      "Tham số URL là `-Uri \"https://$FQDN/health\"`."
    ],
    mentalModel: {
      rule: 'Invoke-RestMethod -Uri "https://$FQDN/health"',
      breakdown: [
        { part: "Invoke-RestMethod", role: "PowerShell HTTP Client", desc: "Gửi REST request và tự động giải mã JSON kết quả trả về" },
        { part: "-Uri", role: "Target Endpoint", desc: "Địa chỉ URL đầy đủ tới endpoint /health" }
      ]
    },
    parametersExplanation: [
      { param: "-Uri", meaning: "Địa chỉ đường dẫn web endpoint cần gửi truy vấn HTTP." }
    ],
    examNotes: "Health probe endpoint thường trả về HTTP status 200 kèm trạng thái Healthy để xác nhận app sẵn sàng nhận traffic.",
    simulatedOutput: `{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": "00:05:12"
}`
  },
  {
    id: "l6-verify-root",
    level: 6,
    title: "Kiểm tra Root Endpoint & Cấu hình Secret",
    difficulty: "Cơ bản",
    category: "Verification",
    mission: "Hãy gọi root endpoint `https://$FQDN/` bằng `Invoke-RestMethod` để kiểm tra secret và thông tin chào mừng đã được cấu hình chuẩn xác hay chưa.",
    expectedCommand: 'Invoke-RestMethod -Uri "https://$FQDN/"',
    aliases: [
      'Invoke-RestMethod -Uri "https://$FQDN/"',
      'Invoke-RestMethod -Uri https://$FQDN/',
      'Invoke-RestMethod "https://$FQDN/"',
      'irm "https://$FQDN/"',
      'irm -Uri "https://$FQDN/"'
    ],
    tokens: ["Invoke-RestMethod", "-Uri", '"https://$FQDN/"'],
    hints: [
      "Dùng `Invoke-RestMethod` với tham số `-Uri \"https://$FQDN/\"`."
    ],
    mentalModel: {
      rule: 'Invoke-RestMethod -Uri "https://$FQDN/"',
      breakdown: [
        { part: "https://$FQDN/", role: "Root Endpoint", desc: "Endpoint gốc hiển thị thông tin metadata hoặc trạng thái ứng dụng" }
      ]
    },
    parametersExplanation: [
      { param: "-Uri", meaning: "URL trỏ vào gốc của domain backend API." }
    ],
    examNotes: "Kiểm tra root endpoint giúp xác minh nhanh ứng dụng không bị lỗi 500 do thiếu cấu hình secret khởi tạo.",
    simulatedOutput: `{
  "message": "Backend API is running",
  "model": "gpt-4o-mini",
  "secretConfigured": true
}`
  },
  {
    id: "l6-verify-process",
    level: 6,
    title: "Test Endpoint Xử lý Tài liệu (POST File Content)",
    difficulty: "Nâng cao",
    category: "Verification",
    mission: "Để kiểm tra tính năng xử lý tài liệu AI của backend API, hãy dùng `Invoke-RestMethod` gửi HTTP POST tới `https://$FQDN/process`, ContentType là `text/plain` và Body lấy từ nội dung file cục bộ qua biểu thức PowerShell `(Get-Content -Raw document.txt)`.",
    expectedCommand: 'Invoke-RestMethod -Uri "https://$FQDN/process" -Method Post -ContentType "text/plain" -Body (Get-Content -Raw document.txt)',
    aliases: [
      'Invoke-RestMethod -Uri "https://$FQDN/process" -Method Post -ContentType "text/plain" -Body (Get-Content -Raw document.txt)',
      'Invoke-RestMethod -Uri https://$FQDN/process -Method Post -ContentType "text/plain" -Body (Get-Content -Raw document.txt)',
      'irm -Uri "https://$FQDN/process" -Method Post -ContentType "text/plain" -Body (Get-Content -Raw document.txt)',
      'Invoke-RestMethod -Method Post -Uri "https://$FQDN/process" -ContentType "text/plain" -Body (Get-Content -Raw document.txt)'
    ],
    tokens: ["Invoke-RestMethod", "-Uri", '"https://$FQDN/process"', "-Method", "Post", "-ContentType", '"text/plain"', "-Body", "(Get-Content -Raw document.txt)"],
    hints: [
      "Dùng `Invoke-RestMethod -Uri \"https://$FQDN/process\"`.",
      "Chỉ định `-Method Post` và `-ContentType \"text/plain\"`.",
      "Đọc nội dung văn bản thô vào body bằng `-Body (Get-Content -Raw document.txt)`."
    ],
    mentalModel: {
      rule: 'Invoke-RestMethod -Uri "https://$FQDN/process" -Method Post -ContentType "text/plain" -Body (Get-Content -Raw document.txt)',
      breakdown: [
        { part: "-Method Post", role: "HTTP Method", desc: "Gửi dữ liệu lên API để xử lý" },
        { part: "-ContentType \"text/plain\"", role: "MIME Type", desc: "Báo cho server định dạng dữ liệu là văn bản thuần" },
        { part: "(Get-Content -Raw ...)", role: "PowerShell Subexpression", desc: "Đọc toàn bộ file tài liệu dưới dạng một chuỗi văn bản duy nhất" }
      ]
    },
    parametersExplanation: [
      { param: "Get-Content -Raw", meaning: "Đọc toàn bộ nội dung file thành một chuỗi văn bản hoàn chỉnh thay vì mảng các dòng." },
      { param: "-Body", meaning: "Dữ liệu payload được gửi kèm trong phần thân của HTTP POST request." }
    ],
    examNotes: "💡 Thao tác test thực tế mô phỏng hoàn chỉnh luồng xử lý tài liệu AI: gửi document lên backend inference API.",
    simulatedOutput: `{
  "documentId": "doc-9812-af",
  "entitiesCount": 14,
  "summary": "Document successfully processed and vectorized.",
  "status": "Completed"
}`
  },

  // --- Phần H: Troubleshooting (Bổ sung) ---
  {
    id: "l6-troubleshoot-identity",
    level: 6,
    title: "Kiểm tra trạng thái Managed Identity đã được bật",
    difficulty: "Cơ bản",
    category: "Troubleshooting",
    mission: "Khi container không thể kéo image từ ACR hoặc báo lỗi xác thực 401, hãy kiểm tra xem System-Assigned Managed Identity của app `<app-name>` trong `<rg>` đã được kích hoạt hay chưa bằng lệnh `az containerapp identity show`.",
    expectedCommand: "az containerapp identity show -n <app-name> -g <rg>",
    aliases: [
      "az containerapp identity show --name <app-name> --resource-group <rg>",
      "az containerapp identity show -g <rg> -n <app-name>",
      "az containerapp identity show --resource-group <rg> --name <app-name>"
    ],
    tokens: ["az", "containerapp", "identity", "show", "-n", "<app-name>", "-g", "<rg>"],
    hints: [
      "Nhóm lệnh kiểm tra định danh là `az containerapp identity show`.",
      "Truyền tham số `-n <app-name>` và `-g <rg>`."
    ],
    mentalModel: {
      rule: "az containerapp identity show -n <App> -g <RG>",
      breakdown: [
        { part: "containerapp identity show", role: "Identity Prober", desc: "Đọc thông tin principalId, tenantId và loại Managed Identity" }
      ]
    },
    parametersExplanation: [
      { param: "identity show", meaning: "Hiển thị chi tiết cấu hình Managed Identity đang được gán cho Container App." }
    ],
    examNotes: "Nếu trường type không phải là SystemAssigned hoặc UserAssigned, app sẽ không có danh tính Entra ID để kéo image an toàn.",
    simulatedOutput: `{
  "principalId": "e1f2a3b4-5678-90ab-cdef-1234567890ab",
  "tenantId": "7820a1bc-341e-42ef-a841-f42f38d12345",
  "type": "SystemAssigned"
}`
  },
  {
    id: "l6-troubleshoot-secret-list",
    level: 6,
    title: "Liệt kê và Xác nhận Secrets đã được tạo",
    difficulty: "Cơ bản",
    category: "Troubleshooting",
    mission: "Để chẩn đoán xem lỗi 'Secret not found' có phải do đặt sai tên bí mật lúc cấu hình hay không, hãy liệt kê danh sách tất cả secrets hiện có của app `<app-name>` trong `<rg>` dưới dạng bảng (`-o table`).",
    expectedCommand: "az containerapp secret list -n <app-name> -g <rg> -o table",
    aliases: [
      "az containerapp secret list --name <app-name> --resource-group <rg> -o table",
      "az containerapp secret list -n <app-name> -g <rg> --output table",
      "az containerapp secret list --name <app-name> --resource-group <rg> --output table",
      "az containerapp secret list --resource-group <rg> --name <app-name> -o table"
    ],
    tokens: ["az", "containerapp", "secret", "list", "-n", "<app-name>", "-g", "<rg>", "-o", "table"],
    hints: [
      "Lệnh liệt kê secret là `az containerapp secret list`.",
      "Dùng cờ `-o table` để xem dạng bảng trực quan."
    ],
    mentalModel: {
      rule: "az containerapp secret list -n <App> -g <RG> -o table",
      breakdown: [
        { part: "secret list", role: "Secret Enumerator", desc: "Liệt kê danh sách tên các secret (giá trị thực tế luôn được giấu để bảo mật)" },
        { part: "-o table", role: "Formatter", desc: "Xuất bảng danh sách rõ ràng" }
      ]
    },
    parametersExplanation: [
      { param: "secret list", meaning: "Chỉ hiển thị tên secret, Azure tuyệt đối không bao giờ hiển thị giá trị secret ra màn hình." }
    ],
    examNotes: "Xác nhận tên secret khớp chính xác từng ký tự với tên đặt sau `secretref:`.",
    simulatedOutput: `Name         Identity
-----------  ----------
ai-api-key
db-password`
  },
  {
    id: "l6-troubleshoot-logs-stream",
    level: 6,
    title: "Stream Logs Real-time chẩn đoán lỗi khởi động Lab 1",
    difficulty: "Cơ bản",
    category: "Troubleshooting",
    mission: "Khi triển khai container backend API gặp sự cố khởi động hoặc crash lúc nạp cấu hình, hãy mở luồng trực tiếp nhật ký container theo thời gian thực cho app `<app-name>` trong `<rg>` bằng cờ `--follow`.",
    expectedCommand: "az containerapp logs show -n <app-name> -g <rg> --follow",
    aliases: [
      "az containerapp logs show --name <app-name> --resource-group <rg> --follow",
      "az containerapp logs show -n <app-name> -g <rg> -f",
      "az containerapp logs show --name <app-name> --resource-group <rg> -f",
      "az containerapp logs show --resource-group <rg> --name <app-name> --follow"
    ],
    tokens: ["az", "containerapp", "logs", "show", "-n", "<app-name>", "-g", "<rg>", "--follow"],
    hints: [
      "Lệnh xem nhật ký là `az containerapp logs show`.",
      "Truyền tham số `-n <app-name> -g <rg>`.",
      "Thêm cờ `--follow` để stream log trực tiếp liên tục."
    ],
    mentalModel: {
      rule: "az containerapp logs show -n <App> -g <RG> --follow",
      breakdown: [
        { part: "logs show", role: "Log Streamer", desc: "Đọc log stdout/stderr từ các container replica đang chạy" },
        { part: "--follow", role: "Continuous Connection", desc: "Duy trì kết nối streaming cho đến khi ngắt kết nối" }
      ]
    },
    parametersExplanation: [
      { param: "--follow", meaning: "Truyền trực tiếp log mới nhất theo thời gian thực (tương tự tail -f)." }
    ],
    examNotes: "Bước chẩn đoán đầu tiên khi ứng dụng không phản hồi yêu cầu kiểm tra health endpoint.",
    simulatedOutput: `Connecting to the container logs...
[2026-10-24 10:00:01] [INFO] Loading AI model engine from $MODEL_NAME...
[2026-10-24 10:00:03] [INFO] Reading secret reference from environment variable...
[2026-10-24 10:00:04] [INFO] Secret loaded successfully.
[2026-10-24 10:00:05] [INFO] Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
[2026-10-24 10:00:15] [INFO] 10.0.0.4:58210 - "GET /health HTTP/1.1" 200 OK`
  },

  // =========================================================================
  // BỔ SUNG TỪ BÀI LAB "DYNAMIC SESSIONS" (AI CODE INTERPRETER & SANDBOX)
  // =========================================================================

  // --- Phần I: Azure Container Apps Dynamic Sessions (Lab Dynamic Sessions) ---
  {
    id: "l6-extension-containerapp-preview",
    level: 6,
    title: "Cài đặt extension Container App hỗ trợ Preview",
    difficulty: "Cơ bản",
    category: "Dynamic Sessions & Extension",
    mission: "Để sử dụng các tính năng mới nhất như Dynamic Sessions (Code Interpreter cho AI Agent), hãy cài đặt hoặc cập nhật Azure CLI extension `containerapp` với cờ phiên bản thử nghiệm `--allow-preview true` và tự động đồng ý cài đặt `--yes`.",
    expectedCommand: "az extension add --name containerapp --upgrade --allow-preview true --yes",
    aliases: [
      "az extension add -n containerapp --upgrade --allow-preview true --yes",
      "az extension add -n containerapp --upgrade --allow-preview true -y",
      "az extension add --name containerapp --upgrade --allow-preview true -y",
      "az extension add --upgrade --allow-preview true --name containerapp --yes",
      "az extension add -n containerapp --allow-preview true --upgrade -y"
    ],
    tokens: ["az", "extension", "add", "--name", "containerapp", "--upgrade", "--allow-preview", "true", "--yes"],
    hints: [
      "Lệnh quản lý extension là `az extension add`.",
      "Tên extension là `containerapp`.",
      "Kết hợp cờ `--upgrade`, `--allow-preview true` và `--yes`."
    ],
    mentalModel: {
      rule: "az extension add --name containerapp --upgrade --allow-preview true --yes",
      breakdown: [
        { part: "extension add", role: "CLI Module Manager", desc: "Cài đặt hoặc cập nhật gói mở rộng cho Azure CLI" },
        { part: "--upgrade", role: "Upgrade Flag", desc: "Tự động cập nhật lên bản mới nhất nếu extension đã cài" },
        { part: "--allow-preview true", role: "Preview Enabler", desc: "Cho phép cài đặt phiên bản tính năng thử nghiệm như Dynamic Sessions" },
        { part: "--yes", role: "Auto Confirm", desc: "Tự động chấp nhận cài đặt mà không cần xác nhận thủ công" }
      ]
    },
    parametersExplanation: [
      { param: "--allow-preview", meaning: "Kích hoạt quyền cài đặt các bản preview tính năng mới chưa phát hành GA." },
      { param: "--upgrade", meaning: "Nâng cấp gói extension nếu đã tồn tại bản cũ trên máy." }
    ],
    examNotes: "💡 Điểm thi AI-200: Tính năng Dynamic Sessions của Azure Container Apps yêu cầu phiên bản extension containerapp hỗ trợ preview.",
    simulatedOutput: `The installed extension 'containerapp' is in preview.
Extension 'containerapp' 1.1.0b1 successfully installed.`
  },
  {
    id: "l6-dynamic-sessionpool-create",
    level: 6,
    title: "Khởi tạo Session Pool cho Python Code Interpreter",
    difficulty: "Nâng cao",
    category: "Dynamic Sessions",
    mission: "Trong bài lab Dynamic Sessions, hãy tạo một Session Pool mới tên `<pool-name>` trong Resource Group `<rg>`, vị trí `<region>`. Cấu hình loại container `--container-type PythonLTS`, số session tối đa `--max-sessions 5`, thời gian làm nguội `--cooldown-period 300` và cô lập mạng bằng cờ `--network-status EgressDisabled`.",
    expectedCommand: "az containerapp sessionpool create --name <pool-name> --resource-group <rg> --location <region> --container-type PythonLTS --max-sessions 5 --cooldown-period 300 --network-status EgressDisabled",
    aliases: [
      "az containerapp sessionpool create -n <pool-name> -g <rg> -l <region> --container-type PythonLTS --max-sessions 5 --cooldown-period 300 --network-status EgressDisabled",
      "az containerapp sessionpool create --name <pool-name> --resource-group <rg> -l <region> --container-type PythonLTS --max-sessions 5 --cooldown-period 300 --network-status EgressDisabled",
      "az containerapp sessionpool create -n <pool-name> -g <rg> --location <region> --container-type PythonLTS --max-sessions 5 --cooldown-period 300 --network-status EgressDisabled"
    ],
    tokens: ["az", "containerapp", "sessionpool", "create", "--name", "<pool-name>", "--resource-group", "<rg>", "--location", "<region>", "--container-type", "PythonLTS", "--max-sessions", "5", "--cooldown-period", "300", "--network-status", "EgressDisabled"],
    hints: [
      "Nhóm lệnh tạo hồ chứa phiên là `az containerapp sessionpool create`.",
      "Chỉ định `--container-type PythonLTS` cho môi trường thực thi mã Python.",
      "Thiết lập `--max-sessions 5`, `--cooldown-period 300` và cô lập mạng bằng `--network-status EgressDisabled`."
    ],
    mentalModel: {
      rule: "az containerapp sessionpool create --name <Pool> --resource-group <RG> --location <Loc> --container-type PythonLTS ...",
      breakdown: [
        { part: "sessionpool create", role: "AI Sandbox Provisioner", desc: "Tạo cụm sandbox an toàn chuyên chạy mã do LLM sinh ra" },
        { part: "--container-type PythonLTS", role: "Runtime Environment", desc: "Môi trường thực thi Python dài hạn sẵn sàng nạp các thư viện AI" },
        { part: "--network-status EgressDisabled", role: "Security Isolation", desc: "Chặn hoàn toàn lưu lượng ra ngoài để ngăn code không tin cậy rò rỉ dữ liệu" }
      ]
    },
    parametersExplanation: [
      { param: "--container-type PythonLTS", meaning: "Hình ảnh container chuẩn chứa sẵn Python LTS và các thư viện khoa học dữ liệu (numpy, pandas, matplotlib)." },
      { param: "--cooldown-period", meaning: "Thời gian (giây) giữ session sống sau request cuối cùng trước khi tự động hủy dọn tài nguyên (300s = 5 phút)." },
      { param: "--network-status EgressDisabled", meaning: "Ngăn chặn container truy cập Internet công cộng (sandboxing tuyệt đối cho AI Agent)." }
    ],
    examNotes: "💡 Điểm thi AI-200: Session Pool là giải pháp tiêu chuẩn của Azure để tích hợp 'Code Interpreter' an toàn vào các mô hình LLM như GPT-4 qua LangChain hoặc Semantic Kernel.",
    simulatedOutput: `{
  "id": "/subscriptions/.../resourceGroups/rg-ai200/providers/Microsoft.App/sessionPools/pool-python-sandbox",
  "location": "eastus",
  "name": "pool-python-sandbox",
  "properties": {
    "containerType": "PythonLTS",
    "cooldownPeriodInSeconds": 300,
    "maxConcurrentSessions": 5,
    "networkStatus": "EgressDisabled",
    "nodeCount": 1,
    "poolManagementType": "Dynamic",
    "provisioningState": "Succeeded"
  }
}`
  },
  {
    id: "l6-dynamic-session-executor-role",
    level: 6,
    title: "Phân quyền Azure ContainerApps Session Executor cho AI Agent",
    difficulty: "Trung bình",
    category: "Dynamic Sessions & RBAC",
    mission: "Để ứng dụng backend AI hoặc Managed Identity của AI Agent có thể gửi lệnh thực thi code vào Session Pool vừa tạo, hãy gán vai trò RBAC 'Azure ContainerApps Session Executor' cho định danh `<principal-id>` tại phạm vi `<session-pool-id>`.",
    expectedCommand: 'az role assignment create --assignee <principal-id> --role "Azure ContainerApps Session Executor" --scope <session-pool-id>',
    aliases: [
      'az role assignment create --assignee <principal-id> --role "Azure ContainerApps Session Executor" --scope <session-pool-id>',
      "az role assignment create --assignee <principal-id> --role 'Azure ContainerApps Session Executor' --scope <session-pool-id>",
      'az role assignment create --assignee <principal-id> --role Azure ContainerApps Session Executor --scope <session-pool-id>'
    ],
    tokens: ["az", "role", "assignment", "create", "--assignee", "<principal-id>", "--role", '"Azure ContainerApps Session Executor"', "--scope", "<session-pool-id>"],
    hints: [
      "Lệnh gán quyền là `az role assignment create`.",
      "Tên role bảo mật là `\"Azure ContainerApps Session Executor\"`.",
      "Truyền phạm vi tài nguyên `--scope <session-pool-id>` và người nhận quyền `--assignee <principal-id>`."
    ],
    mentalModel: {
      rule: 'az role assignment create --assignee <PrincipalID> --role "Azure ContainerApps Session Executor" --scope <PoolID>',
      breakdown: [
        { part: "role assignment create", role: "RBAC Grantor", desc: "Cấp quyền truy cập dựa trên vai trò cho danh tính Entra ID" },
        { part: "Azure ContainerApps Session Executor", role: "Built-in Role", desc: "Vai trò đặc thù cấp quyền tạo phiên và thực thi mã trong Session Pool" }
      ]
    },
    parametersExplanation: [
      { param: "Azure ContainerApps Session Executor", meaning: "Vai trò dựng sẵn (built-in) tối thiểu cho phép gọi API thực thi code trong sandbox mà không có quyền xóa hay cấu hình lại pool." },
      { param: "--scope", meaning: "Định danh tài nguyên đầy đủ của Session Pool (/subscriptions/.../sessionPools/<pool>)." }
    ],
    examNotes: "💡 Nguyên tắc Least Privilege: Chỉ gán role 'Session Executor' cho AI Agent, không gán Contributor hay Owner.",
    simulatedOutput: `{
  "id": "/subscriptions/.../providers/Microsoft.Authorization/roleAssignments/fa4891b2-...",
  "principalId": "e1f2a3b4-5678-90ab-cdef-1234567890ab",
  "roleDefinitionName": "Azure ContainerApps Session Executor",
  "scope": "/subscriptions/.../resourceGroups/rg-ai200/providers/Microsoft.App/sessionPools/pool-python-sandbox"
}`
  },

  // ==========================================
  // LEVEL 7: AZURE KUBERNETES SERVICE (AKS)
  // BÀI LAB AKS CONFIGURE - 15 BÀI THỰC HÀNH
  // ==========================================

  // --- PHẦN A: KUBECTL CƠ BẢN (5 BÀI) ---
  {
    id: "l7-aks-credentials",
    level: 7,
    title: "1. Lấy Credentials AKS & Cấu hình kubectl",
    difficulty: "Cơ bản",
    category: "kubectl Cơ bản",
    mission: "Tải chứng thực cluster về máy và tự động merge vào ~/.kube/config để công cụ kubectl có thể kết nối và điều khiển cụm AKS `<cluster-name>` trong resource group `<rg>`.",
    expectedCommand: "az aks get-credentials --resource-group <rg> --name <cluster-name>",
    aliases: [
      "az aks get-credentials --resource-group <rg> --name <cluster-name>",
      "az aks get-credentials -g <rg> -n <cluster-name>",
      "az aks get-credentials --name <cluster-name> --resource-group <rg>",
      "az aks get-credentials -n <cluster-name> -g <rg>"
    ],
    tokens: ["az", "aks", "get-credentials", "--resource-group", "<rg>", "--name", "<cluster-name>"],
    hints: [
      "Sử dụng nhóm lệnh `az aks get-credentials`.",
      "Chỉ định resource group `--resource-group <rg>` và tên cluster `--name <cluster-name>`."
    ],
    mentalModel: {
      rule: "az aks get-credentials --resource-group <RG> --name <ClusterName>",
      breakdown: [
        { part: "get-credentials", role: "Kubeconfig Syncer", desc: "Tải cert và access token của cluster merge vào file cấu hình kubectl cục bộ" }
      ]
    },
    parametersExplanation: [
      { param: "get-credentials", meaning: "Tải cert x509 và context k8s về ~/.kube/config để kết nối CLI kubectl." },
      { param: "--overwrite-existing", meaning: "Ghi đè entry cũ nếu context cluster trùng tên trong kubeconfig." }
    ],
    examNotes: "💡 Sau lệnh này, ngữ cảnh hiện tại (current context) của kubectl sẽ tự động chuyển sang trỏ vào cluster AKS được chỉ định.",
    simulatedOutput: `Merged "<cluster-name>" as current context in C:\\Users\\user\\.kube\\config`
  },
  {
    id: "l7-kubectl-get-deploy-svc",
    level: 7,
    title: "2. Kiểm tra trạng thái Deployment & Service",
    difficulty: "Cơ bản",
    category: "kubectl Cơ bản",
    mission: "Sử dụng lệnh `kubectl` để liệt kê nhanh đồng thời tất cả Deployment và Service đang chạy trong namespace hiện tại nhằm kiểm tra IP công khai (EXTERNAL-IP).",
    expectedCommand: "kubectl get deploy,svc",
    aliases: [
      "kubectl get deploy,svc",
      "kubectl get deploy, svc",
      "kubectl get deployments,services",
      "kubectl get deployment,service"
    ],
    tokens: ["kubectl", "get", "deploy,svc"],
    hints: [
      "Bắt đầu bằng `kubectl get`.",
      "Ghép hai tài nguyên ngăn cách bằng dấu phẩy: `deploy,svc`."
    ],
    mentalModel: {
      rule: "kubectl get deploy,svc",
      breakdown: [
        { part: "deploy,svc", role: "Multi-resource query", desc: "Liệt kê song song cả Deployment pods controller và Service load balancer" }
      ]
    },
    parametersExplanation: [
      { param: "deploy", meaning: "Viết tắt của Deployments (bộ điều khiển replica pods)." },
      { param: "svc", meaning: "Viết tắt của Services (cung cấp IP nội bộ hoặc External LoadBalancer)." }
    ],
    examNotes: "💡 Kiểm tra cột EXTERNAL-IP của Service để lấy địa chỉ IP công cộng dùng test API endpoints.",
    simulatedOutput: `NAME                             READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/aks-config-api   1/1     1            1           5m22s

NAME                             TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)        AGE
service/aks-config-api-service   LoadBalancer   10.0.142.88    20.240.85.120    80:31456/TCP   5m22s`
  },
  {
    id: "l7-kubectl-rollout-status",
    level: 7,
    title: "3. Kiểm tra tiến trình Rollout Deployment",
    difficulty: "Trung bình",
    category: "kubectl Cơ bản",
    mission: "Theo dõi tiến trình triển khai cập nhật của Deployment `aks-config-api` cho đến khi tất cả các Pod hoàn tất khởi động và sẵn sàng nhận traffic.",
    expectedCommand: "kubectl rollout status deploy/aks-config-api",
    aliases: [
      "kubectl rollout status deploy/aks-config-api",
      "kubectl rollout status deployment/aks-config-api",
      "kubectl rollout status deploy aks-config-api",
      "kubectl rollout status deployment aks-config-api"
    ],
    tokens: ["kubectl", "rollout", "status", "deploy/aks-config-api"],
    hints: [
      "Dùng nhóm lệnh `kubectl rollout status`.",
      "Chỉ định resource target `deploy/aks-config-api`."
    ],
    mentalModel: {
      rule: "kubectl rollout status deploy/<name>",
      breakdown: [
        { part: "rollout status", role: "Watcher", desc: "Chặn dòng lệnh và theo dõi quá trình rolling update cho tới khi 100% replicas healthy" }
      ]
    },
    parametersExplanation: [
      { param: "rollout status", meaning: "Trả về exit code 0 khi rollout hoàn tất hoặc exit code khác 0 nếu timeout/thất bại." }
    ],
    examNotes: "💡 Thường dùng trong CI/CD pipeline ngay sau lệnh kubectl apply để đảm bảo deployment không bị crash trước khi chạy tiếp test.",
    simulatedOutput: `Waiting for deployment "aks-config-api" rollout to finish: 0 of 1 updated replicas are available...
deployment "aks-config-api" successfully rolled out`
  },
  {
    id: "l7-kubectl-get-pods",
    level: 7,
    title: "4. Liệt kê danh sách Pods đang chạy",
    difficulty: "Cơ bản",
    category: "kubectl Cơ bản",
    mission: "Kiểm tra danh sách các Pod trong cluster, xem số container sẵn sàng (READY), trạng thái (STATUS) và số lần khởi động lại (RESTARTS).",
    expectedCommand: "kubectl get pods",
    aliases: [
      "kubectl get pods",
      "kubectl get pod",
      "kubectl get po"
    ],
    tokens: ["kubectl", "get", "pods"],
    hints: [
      "Lệnh liệt kê pods cơ bản: `kubectl get pods`."
    ],
    mentalModel: {
      rule: "kubectl get pods",
      breakdown: [
        { part: "get pods", role: "Pod Lister", desc: "Xem nhanh trạng thái sức khỏe của các đơn vị thực thi nhỏ nhất trong K8s" }
      ]
    },
    parametersExplanation: [
      { param: "pods", meaning: "Có thể viết tắt là po hoặc pod." }
    ],
    examNotes: "💡 Thêm cờ `-o wide` để xem Node IP và Pod IP mà Pod đang được schedule chạy trên đó.",
    simulatedOutput: `NAME                              READY   STATUS    RESTARTS   AGE
aks-config-api-5bf686fbd7-q7k9m   1/1     Running   0          6m18s`
  },
  {
    id: "l7-kubectl-logs",
    level: 7,
    title: "5. Xem Log của Pod (stdout/stderr)",
    difficulty: "Cơ bản",
    category: "kubectl Cơ bản",
    mission: "Đọc nhật ký xuất chuẩn từ container bên trong pod `<pod-name>` để xác nhận ứng dụng FastAPI và cấu hình ConfigMap đã nạp thành công.",
    expectedCommand: "kubectl logs <pod-name>",
    aliases: [
      "kubectl logs <pod-name>",
      "kubectl log <pod-name>",
      "kubectl logs -f <pod-name>"
    ],
    tokens: ["kubectl", "logs", "<pod-name>", "-f"],
    hints: [
      "Sử dụng lệnh `kubectl logs`.",
      "Truyền tên pod mục tiêu `<pod-name>`."
    ],
    mentalModel: {
      rule: "kubectl logs <PodName>",
      breakdown: [
        { part: "kubectl logs", role: "Log Streamer", desc: "Đọc log trực tiếp từ runtime container trong pod" }
      ]
    },
    parametersExplanation: [
      { param: "-f", meaning: "Stream log liên tục theo thời gian thực (tương tự tail -f trong Linux)." },
      { param: "--previous", meaning: "Xem log của instance container trước đó nếu vừa bị crash/restart." }
    ],
    examNotes: "💡 Thêm cờ `--tail=50` nếu chỉ muốn đọc 50 dòng log gần nhất.",
    simulatedOutput: `INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     ConfigMap loaded: Student=AI200Student, Version=1.0.0
INFO:     Persistent storage initialized at: /var/log/api
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)`
  },

  // --- PHẦN B: CONFIGMAP (4 BÀI) ---
  {
    id: "l7-configmap-apply",
    level: 7,
    title: "6. Tạo ConfigMap từ file YAML",
    difficulty: "Cơ bản",
    category: "ConfigMap",
    mission: "Khởi tạo tài nguyên ConfigMap `api-config` từ file cấu hình `k8s/configmap.yaml` để nạp các thông số không nhạy cảm (STUDENT_NAME, API_VERSION, LOG_PATH).",
    expectedCommand: "kubectl apply -f k8s/configmap.yaml",
    aliases: [
      "kubectl apply -f k8s/configmap.yaml",
      "kubectl create -f k8s/configmap.yaml"
    ],
    tokens: ["kubectl", "apply", "-f", "k8s/configmap.yaml"],
    hints: [
      "Cú pháp áp dụng manifest: `kubectl apply -f <file>`.",
      "Đường dẫn file là `k8s/configmap.yaml`."
    ],
    mentalModel: {
      rule: "kubectl apply -f k8s/configmap.yaml",
      breakdown: [
        { part: "apply -f", role: "Declarative Applier", desc: "Tạo hoặc cập nhật tài nguyên k8s theo định nghĩa khai báo" },
        { part: "configmap.yaml", role: "Config Spec", desc: "Định nghĩa key-value cho các thông số ứng dụng" }
      ]
    },
    parametersExplanation: [
      { param: "-f", meaning: "Chỉ định đường dẫn file hoặc thư mục chứa manifest YAML." }
    ],
    examNotes: "💡 ConfigMap tách rời cấu hình khỏi container image, giúp thay đổi tham số mà không cần rebuild image.",
    simulatedOutput: `configmap/api-config created`
  },
  {
    id: "l7-configmap-get",
    level: 7,
    title: "7. Xem danh sách ConfigMap trong Cluster",
    difficulty: "Cơ bản",
    category: "ConfigMap",
    mission: "Liệt kê tất cả các ConfigMap đang hoạt động trong namespace hiện tại để kiểm tra số lượng key-value data.",
    expectedCommand: "kubectl get configmap",
    aliases: [
      "kubectl get configmap",
      "kubectl get configmaps",
      "kubectl get cm"
    ],
    tokens: ["kubectl", "get", "configmap"],
    hints: [
      "Dùng lệnh `kubectl get configmap` (hoặc viết tắt `kubectl get cm`)."
    ],
    mentalModel: {
      rule: "kubectl get configmap",
      breakdown: [
        { part: "get configmap", role: "Config Lister", desc: "Xem danh sách và số lượng key data của từng ConfigMap" }
      ]
    },
    parametersExplanation: [
      { param: "cm", meaning: "Tên viết tắt chuẩn của ConfigMap trong kubectl." }
    ],
    examNotes: "💡 Cột DATA hiển thị số lượng keys được định nghĩa trong ConfigMap.",
    simulatedOutput: `NAME               DATA   AGE
api-config         3      1m42s
kube-root-ca.crt   1      2d4h`
  },
  {
    id: "l7-configmap-describe",
    level: 7,
    title: "8. Xem chi tiết cấu hình ConfigMap",
    difficulty: "Cơ bản",
    category: "ConfigMap",
    mission: "Xem toàn bộ nội dung dữ liệu key-value (STUDENT_NAME, API_VERSION, LOG_PATH) và metadata của ConfigMap `api-config`.",
    expectedCommand: "kubectl describe configmap api-config",
    aliases: [
      "kubectl describe configmap api-config",
      "kubectl describe cm api-config"
    ],
    tokens: ["kubectl", "describe", "configmap", "api-config"],
    hints: [
      "Sử dụng `kubectl describe configmap`.",
      "Tên ConfigMap là `api-config`."
    ],
    mentalModel: {
      rule: "kubectl describe configmap <Name>",
      breakdown: [
        { part: "describe configmap", role: "Inspector", desc: "Hiển thị chi tiết từng cặp key-value lưu trong ConfigMap" }
      ]
    },
    parametersExplanation: [
      { param: "api-config", meaning: "Tên ConfigMap được khai báo trong metadata.name." }
    ],
    examNotes: "💡 Lệnh describe giúp bạn xác minh nhanh giá trị cấu hình đã ăn vào cluster trước khi Pod khởi chạy.",
    simulatedOutput: `Name:         api-config
Namespace:    default
Labels:       app=aks-config-api
Annotations:  <none>

Data
====
API_VERSION:
----
1.0.0
LOG_PATH:
----
/var/log/api
STUDENT_NAME:
----
AI200Student

BinaryData
====

Events:  <none>`
  },
  {
    id: "l7-deployment-rollout-restart",
    level: 7,
    title: "9. Rolling Restart Deployment nạp lại cấu hình",
    difficulty: "Trung bình",
    category: "ConfigMap",
    mission: "Sau khi cập nhật file ConfigMap, hãy kích hoạt khởi động lại luân phiên (rolling restart) Deployment `aks-config-api` để Pod nạp lại biến môi trường mới mà không làm gián đoạn dịch vụ (zero downtime).",
    expectedCommand: "kubectl rollout restart deployment aks-config-api",
    aliases: [
      "kubectl rollout restart deployment aks-config-api",
      "kubectl rollout restart deploy aks-config-api",
      "kubectl rollout restart deployment/aks-config-api",
      "kubectl rollout restart deploy/aks-config-api"
    ],
    tokens: ["kubectl", "rollout", "restart", "deployment", "aks-config-api"],
    hints: [
      "Dùng nhóm lệnh `kubectl rollout restart`.",
      "Resource type là `deployment` và tên là `aks-config-api`."
    ],
    mentalModel: {
      rule: "kubectl rollout restart deployment <Name>",
      breakdown: [
        { part: "rollout restart", role: "Safe Restarter", desc: "Tạo pod mới trước khi hủy pod cũ, reload biến môi trường không gây gián đoạn" }
      ]
    },
    parametersExplanation: [
      { param: "restart", meaning: "Tạo thế hệ ReplicaSet mới để nạp lại ConfigMap/Secret vào biến môi trường container." }
    ],
    examNotes: "💡 Điểm thi AI-200 quan trọng: Khi sửa ConfigMap ánh xạ qua `env` hoặc `envFrom`, Pod không tự động nhận biến mới cho đến khi Pod được restart. Dùng `rollout restart` thay vì xóa thủ công từng Pod.",
    simulatedOutput: `deployment.apps/aks-config-api restarted`
  },

  // --- PHẦN C: SECRETS (3 BÀI) ---
  {
    id: "l7-secret-apply",
    level: 7,
    title: "10. Tạo Secret từ file YAML",
    difficulty: "Cơ bản",
    category: "Secrets",
    mission: "Tạo tài nguyên Secret `api-secrets` từ manifest `k8s/secrets.yaml` để lưu trữ chuỗi bảo mật `secret-endpoint` và `secret-access-key`.",
    expectedCommand: "kubectl apply -f k8s/secrets.yaml",
    aliases: [
      "kubectl apply -f k8s/secrets.yaml",
      "kubectl create -f k8s/secrets.yaml"
    ],
    tokens: ["kubectl", "apply", "-f", "k8s/secrets.yaml"],
    hints: [
      "Sử dụng `kubectl apply -f`.",
      "Đường dẫn file là `k8s/secrets.yaml`."
    ],
    mentalModel: {
      rule: "kubectl apply -f k8s/secrets.yaml",
      breakdown: [
        { part: "secrets.yaml", role: "Secret Manifest", desc: "Chứa các thông tin bảo mật nhạy cảm dưới dạng stringData" }
      ]
    },
    parametersExplanation: [
      { param: "stringData", meaning: "Cho phép nhập chuỗi plain-text trong YAML, k8s tự động encode sang base64 khi lưu vào etcd." }
    ],
    examNotes: "💡 Secrets loại `Opaque` là loại mặc định cho key-value tự định nghĩa của ứng dụng.",
    simulatedOutput: `secret/api-secrets created`
  },
  {
    id: "l7-secret-get",
    level: 7,
    title: "11. Xem danh sách Secrets trong Cluster",
    difficulty: "Cơ bản",
    category: "Secrets",
    mission: "Liệt kê danh sách các Secret trong cluster để kiểm tra loại bảo mật (Type: Opaque) và số lượng trường dữ liệu (Data: 2).",
    expectedCommand: "kubectl get secrets",
    aliases: [
      "kubectl get secrets",
      "kubectl get secret"
    ],
    tokens: ["kubectl", "get", "secrets"],
    hints: [
      "Dùng lệnh `kubectl get secrets`."
    ],
    mentalModel: {
      rule: "kubectl get secrets",
      breakdown: [
        { part: "get secrets", role: "Secret Lister", desc: "Xem danh sách và số lượng key bí mật trong namespace" }
      ]
    },
    parametersExplanation: [
      { param: "Opaque", meaning: "Loại secret chuẩn dùng cho arbitrary user-defined data." }
    ],
    examNotes: "💡 Lệnh `get secrets` không hiển thị nội dung giải mã để bảo vệ an toàn thông tin.",
    simulatedOutput: `NAME          TYPE     DATA   AGE
api-secrets   Opaque   2      45s`
  },
  {
    id: "l7-secret-decode",
    level: 7,
    title: "12. Trích xuất giá trị Secret Base64 bằng JSONPath",
    difficulty: "Nâng cao",
    category: "Secrets",
    mission: "Sử dụng cú pháp JSONPath để trích xuất trường dữ liệu mã hóa base64 `secret-endpoint` từ Secret `api-secrets`.",
    expectedCommand: 'kubectl get secret api-secrets -o jsonpath="{.data.secret-endpoint}"',
    aliases: [
      'kubectl get secret api-secrets -o jsonpath="{.data.secret-endpoint}"',
      "kubectl get secret api-secrets -o jsonpath='{.data.secret-endpoint}'",
      'kubectl get secrets api-secrets -o jsonpath="{.data.secret-endpoint}"',
      "kubectl get secrets api-secrets -o jsonpath='{.data.secret-endpoint}'"
    ],
    tokens: ["kubectl", "get", "secret", "api-secrets", "-o", 'jsonpath="{.data.secret-endpoint}"'],
    hints: [
      "Sử dụng `kubectl get secret api-secrets`.",
      'Thêm cờ định dạng: `-o jsonpath="{.data.secret-endpoint}"`.'
    ],
    mentalModel: {
      rule: 'kubectl get secret api-secrets -o jsonpath="{.data.<key>}"',
      breakdown: [
        { part: "jsonpath", role: "Data Extractor", desc: "Lọc trực tiếp trường dữ liệu nhị phân đã encode base64" }
      ]
    },
    parametersExplanation: [
      { param: ".data.secret-endpoint", meaning: "Đường dẫn JSON trỏ vào giá trị base64 của key secret-endpoint." }
    ],
    examNotes: "💡 Chuỗi output trả về là base64 (ví dụ `U2VjcmV0RW5kcG9pbnRWYWx1ZQ==`), có thể giải mã bằng `base64 -d` ra chuỗi gốc `SecretEndpointValue`.",
    simulatedOutput: `U2VjcmV0RW5kcG9pbnRWYWx1ZQ==`
  },

  // --- PHẦN D: PERSISTENTVOLUMECLAIM (3 BÀI) ---
  {
    id: "l7-pvc-apply",
    level: 7,
    title: "13. Tạo PersistentVolumeClaim từ file YAML",
    difficulty: "Cơ bản",
    category: "PersistentVolumeClaim",
    mission: "Yêu cầu cấp phát vùng lưu trữ Azure Disk 1Gi (driver managed-csi) từ manifest `k8s/pvc.yaml` để gắn kết thư mục lưu log bền vững cho API.",
    expectedCommand: "kubectl apply -f k8s/pvc.yaml",
    aliases: [
      "kubectl apply -f k8s/pvc.yaml",
      "kubectl create -f k8s/pvc.yaml"
    ],
    tokens: ["kubectl", "apply", "-f", "k8s/pvc.yaml"],
    hints: [
      "Sử dụng `kubectl apply -f`.",
      "Đường dẫn file là `k8s/pvc.yaml`."
    ],
    mentalModel: {
      rule: "kubectl apply -f k8s/pvc.yaml",
      breakdown: [
        { part: "pvc.yaml", role: "Storage Claim", desc: "Yêu cầu k8s cấp phát tài nguyên lưu trữ bền bỉ từ hạ tầng cloud Azure" }
      ]
    },
    parametersExplanation: [
      { param: "managed-csi", meaning: "Azure Disk Container Storage Interface driver cung cấp đĩa SSD/HDD gắn vào Node." }
    ],
    examNotes: "💡 `ReadWriteOnce` (RWO) nghĩa là đĩa lưu trữ chỉ có thể được mount bởi một Node duy nhất tại một thời điểm.",
    simulatedOutput: `persistentvolumeclaim/api-logs-pvc created`
  },
  {
    id: "l7-pvc-get",
    level: 7,
    title: "14. Kiểm tra trạng thái PersistentVolumeClaim (PVC)",
    difficulty: "Cơ bản",
    category: "PersistentVolumeClaim",
    mission: "Kiểm tra trạng thái của các PVC trong namespace để xác nhận PVC đã chuyển sang trạng thái `Bound` (đã được liên kết thành công với đĩa Azure Disk).",
    expectedCommand: "kubectl get pvc",
    aliases: [
      "kubectl get pvc",
      "kubectl get persistentvolumeclaim",
      "kubectl get persistentvolumeclaims"
    ],
    tokens: ["kubectl", "get", "pvc"],
    hints: [
      "Dùng lệnh `kubectl get pvc`."
    ],
    mentalModel: {
      rule: "kubectl get pvc",
      breakdown: [
        { part: "get pvc", role: "Volume Inspector", desc: "Kiểm tra trạng thái liên kết (Pending vs Bound) và dung lượng được cấp phát" }
      ]
    },
    parametersExplanation: [
      { param: "Bound", meaning: "Trạng thái PVC đã được gắn thành công với một PersistentVolume (PV) thực tế." }
    ],
    examNotes: "💡 Nếu PVC ở trạng thái `Pending` kéo dài, kiểm tra quota dung lượng đĩa Azure Disk hoặc StorageClass trong cụm.",
    simulatedOutput: `NAME           STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   VOLUMEATTRIBUTESCLASS   AGE
api-logs-pvc   Bound    pvc-8f2c3109-1a42-4f86-9db8-5089304e9c71   1Gi        RWO            managed-csi    <unset>                 2m15s`
  },
  {
    id: "l7-pvc-describe",
    level: 7,
    title: "15. Xem chi tiết thông số PVC & Azure Disk CSI",
    difficulty: "Trung bình",
    category: "PersistentVolumeClaim",
    mission: "Kiểm tra toàn diện thông tin chi tiết của `api-logs-pvc`: Volume ID, Capacity, Access Modes (ReadWriteOnce) và các Events cấp phát đĩa từ driver `managed-csi`.",
    expectedCommand: "kubectl describe pvc api-logs-pvc",
    aliases: [
      "kubectl describe pvc api-logs-pvc",
      "kubectl describe persistentvolumeclaim api-logs-pvc"
    ],
    tokens: ["kubectl", "describe", "pvc", "api-logs-pvc"],
    hints: [
      "Dùng `kubectl describe pvc`.",
      "Tên PVC là `api-logs-pvc`."
    ],
    mentalModel: {
      rule: "kubectl describe pvc <Name>",
      breakdown: [
        { part: "describe pvc", role: "Storage Debugger", desc: "Xem chi tiết mount path, pod đang gắn kết (Used By) và log provisioning" }
      ]
    },
    parametersExplanation: [
      { param: "Used By", meaning: "Tên Pod đang gắn volume này (ví dụ aks-config-api-...)." }
    ],
    examNotes: "💡 Sự kiện `ProvisioningSucceeded` từ `disk.csi.azure.com` xác nhận volume Azure Disk đã sẵn sàng.",
    simulatedOutput: `Name:          api-logs-pvc
Namespace:     default
StorageClass:  managed-csi
Status:        Bound
Volume:        pvc-8f2c3109-1a42-4f86-9db8-5089304e9c71
Labels:        app=aks-config-api
Annotations:   pv.kubernetes.io/bind-completed: yes
               pv.kubernetes.io/bound-by-controller: yes
               volume.beta.kubernetes.io/storage-provisioner: disk.csi.azure.com
Finalizers:    [kubernetes.io/pvc-protection]
Capacity:      1Gi
Access Modes:  RWO
VolumeMode:    Filesystem
Used By:       aks-config-api-5bf686fbd7-q7k9m
Events:
  Type    Reason                 Age    From                                                                     Message
  ----    ------                 ----   ----                                                                     -------
  Normal  Provisioning           2m30s  disk.csi.azure.com_aks-nodepool1-12345678-vmss000000_...                 External provisioner is provisioning volume for claim "default/api-logs-pvc"
  Normal  ProvisioningSucceeded  2m16s  disk.csi.azure.com_aks-nodepool1-12345678-vmss000000_...                 Successfully provisioned volume pvc-8f2c3109-1a42-4f86-9db8-5089304e9c71`
  }
];

// ==========================================
// QUIZ QUESTIONS (TRẮC NGHIỆM AI-200)
// ==========================================
export const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "Khi nào bạn NÊN sử dụng cờ `--use-device-code` trong lệnh `az login`?",
    options: [
      "Khi bạn muốn đăng nhập nhanh bằng tài khoản mạng xã hội Facebook hoặc Google.",
      "Khi làm việc trong môi trường dòng lệnh không có giao diện đồ họa (Headless, SSH, Cloud Shell, Codespaces) hoặc máy tính không tự bật được trình duyệt web.",
      "Khi bạn đã quên mật khẩu tài khoản Azure và muốn xin mã đặt lại.",
      "Khi bạn muốn đăng ký một subscription Azure hoàn toàn mới."
    ],
    correctIndex: 1,
    explanation: "Cờ `--use-device-code` được thiết kế cho các môi trường Headless (không có trình duyệt cục bộ). Azure CLI sẽ sinh ra một liên kết web và một mã số 8 ký tự để bạn có thể xác thực từ bất kỳ thiết bị nào khác (như máy tính xách tay hoặc điện thoại)."
  },
  {
    id: "q2",
    question: "Tại sao trong kỳ thi AI-200 và thực tế triển khai bảo mật, bạn nên tắt admin user khi tạo ACR (`--admin-enabled false`)?",
    options: [
      "Để giảm cước phí thanh toán dịch vụ ACR mỗi tháng.",
      "Để ngăn việc chia sẻ và rò rỉ một bộ mật khẩu admin tĩnh duy nhất, thay vào đó ép buộc ứng dụng sử dụng Managed Identity hoặc RBAC phân quyền tối thiểu (Least Privilege).",
      "Vì tài khoản admin chỉ hỗ trợ trên hệ điều hành Windows.",
      "Vì gói SKU Basic không hỗ trợ admin user."
    ],
    correctIndex: 1,
    explanation: "Tài khoản admin tĩnh của ACR có toàn quyền đọc/ghi và không thể phân quyền chi tiết. Khi lộ mật khẩu admin, toàn bộ registry bị xâm phạm. Việc vô hiệu hóa `--admin-enabled false` và dùng Managed Identity là chuẩn thiết kế bảo mật của Microsoft."
  },
  {
    id: "q3",
    question: "Để Web App chỉ có quyền KÉO (Pull) image từ Azure Container Registry mà không thể đẩy hay xóa image, bạn nên gán vai trò (role) RBAC nào?",
    options: [
      "Contributor (Người đóng góp)",
      "Owner (Chủ sở hữu)",
      "AcrPull",
      "AcrPush"
    ],
    correctIndex: 2,
    explanation: "Vai trò `AcrPull` là vai trò dựng sẵn (built-in role) cấp quyền tối thiểu chỉ cho phép đọc và kéo image. Gán Contributor hoặc Owner là vi phạm nghiêm trọng nguyên tắc đặc quyền tối thiểu (Principle of Least Privilege)."
  },
  {
    id: "q4",
    question: "Cờ nào trong lệnh `az acr repository update` giúp bảo vệ image container trong ACR chống việc bị push đè hoặc xóa nhầm trong Production (Immutability)?",
    options: [
      "--lock true",
      "--write-enabled false (hoặc --write-enable false)",
      "--read-only true",
      "--protect-image"
    ],
    correctIndex: 1,
    explanation: "Lệnh `az acr repository update --name <ACR> --image <Repo:Tag> --write-enabled false` thiết lập tính bất biến (Immutability) cho image tag, chặn mọi thao tác ghi đè và xóa nhầm."
  },
  {
    id: "q5",
    question: "Lợi ích lớn nhất của việc chạy `az config set defaults.group=rg-ai200-acr-lab` là gì?",
    options: [
      "Tự động xóa Resource Group khi tắt máy.",
      "Cho phép bỏ qua cờ `--resource-group` (hoặc `-g`) trong các câu lệnh `az` tiếp theo, CLI sẽ tự động nạp Resource Group mặc định này.",
      "Chuyển toàn bộ tài nguyên vào vùng dữ liệu miễn phí.",
      "Tăng tốc độ mạng tải image lên gấp đôi."
    ],
    correctIndex: 1,
    explanation: "Khi thiết lập defaults trong Azure CLI, CLI sẽ tự động nạp Resource Group đó cho mọi lệnh tương tác tài nguyên, giúp lập trình viên không cần gõ lặp lại `--resource-group`."
  },
  {
    id: "q6",
    question: "Khi triển khai container Linux chạy web server lắng nghe ở cổng 8000 lên Azure App Service, bạn phải cấu hình biến App Setting nào?",
    options: [
      "PORT=8000",
      "SERVER_PORT=8000",
      "WEBSITES_PORT=\"8000\"",
      "HTTP_PORT=\"8000\""
    ],
    correctIndex: 2,
    explanation: "Azure App Service Container trên Linux sử dụng biến đặc thù `WEBSITES_PORT` để biết container đang bind vào port nào nhằm định tuyến traffic từ Internet vào chính xác port đó."
  },
  {
    id: "q7",
    question: "Sự khác biệt cốt lõi giữa chạy `. .\\.env.ps1` (dot-sourcing) và `.\\.env.ps1` trong PowerShell là gì?",
    options: [
      "Không có sự khác biệt nào.",
      "Dot-sourcing (`. ` ở đầu) nạp biến trực tiếp vào phiên terminal hiện tại; nếu không có dấu chấm, script sẽ chạy trong sub-shell và các biến sẽ biến mất ngay khi script kết thúc.",
      "Dot-sourcing chỉ chạy được với quyền Administrator.",
      "Dot-sourcing mã hóa các biến môi trường thành mật khẩu."
    ],
    correctIndex: 1,
    explanation: "Dot-sourcing (`. <path>`) là kỹ thuật thực thi file mã nguồn ngay trong phạm vi phiên làm việc hiện hành (current scope), giữ lại toàn bộ biến môi trường sau khi file chạy xong."
  },
  {
    id: "q8",
    question: "Bộ lọc JMESPath nào dưới đây sẽ trích xuất danh sách gồm 2 cột 'Setting' (lấy từ trường name) và 'Value' (lấy từ trường value)?",
    options: [
      "--query \"[name, value]\"",
      "--query \"[].{Setting:name, Value:value}\"",
      "--query \"select Setting=name, Value=value\"",
      "--query \"table.name.value\""
    ],
    correctIndex: 1,
    explanation: "Cú pháp `[].{Alias:original_property, ...}` là cú pháp Multi-hash Projection chuẩn của JMESPath dùng để định dạng lại các trường thành object với key mới."
  },
  {
    id: "q9",
    question: "Lệnh nào cho phép chạy thử (Smoke Test) một container image ngay trên nền tảng Cloud của ACR mà không cần cài đặt Docker local hay tạo Web App thật?",
    options: [
      "az acr test",
      "az acr run --registry <ACR> --cmd \"<image> <command>\" /dev/null",
      "az docker run",
      "az webapp smoke-test"
    ],
    correctIndex: 1,
    explanation: "Lệnh `az acr run --registry <ACR> --cmd \"...\" /dev/null` cho phép chạy tác vụ container độc lập trên compute của ACR Tasks để kiểm tra nhanh (Smoke Test) logic ứng dụng."
  },
  {
    id: "q10",
    question: "Để lấy giá trị chuỗi thuần túy (không chứa dấu ngoặc kép JSON bao quanh) nhằm gán trực tiếp vào biến shell hoặc URL, bạn nên dùng định dạng output nào?",
    options: [
      "--output json",
      "--output yaml",
      "--output tsv (hoặc -o tsv)",
      "--output table"
    ],
    correctIndex: 2,
    explanation: "Định dạng `--output tsv` (Tab-Separated Values) trả về giá trị chuỗi thô (raw string) không có dấu ngoặc kép, lý tưởng để gán vào biến môi trường hoặc script."
  },
  {
    id: "q11",
    question: "Mục đích của việc bật cấu hình `--always-on true` trên Web App là gì?",
    options: [
      "Bắt buộc người dùng phải đăng nhập liên tục không được logout.",
      "Ngăn container bị đưa vào trạng thái ngủ đông (idle/sleep) khi không có request, từ đó loại bỏ hiện tượng Cold Start cho ứng dụng AI.",
      "Tự động tăng gấp đôi CPU khi có nhiều người truy cập.",
      "Tự động sao lưu dữ liệu mỗi giờ."
    ],
    correctIndex: 1,
    explanation: "Cấu hình `--always-on true` duy trì việc ping định kỳ từ hệ thống Azure, giữ cho container luôn được tải sẵn trong bộ nhớ RAM, giảm thiểu độ trễ Cold Start."
  },
  {
    id: "q12",
    question: "Trong kiến trúc Sidecar Containers trên Azure App Service (Lab 3), lệnh nào được dùng để nạp danh sách container phụ từ file JSON cấu hình?",
    options: [
      "az webapp multi-container set --file spec.json",
      "az webapp sitecontainers create --name <App> --resource-group <RG> --sitecontainers-spec-file ./sitecontainers-spec.json",
      "az docker-compose up --file spec.json",
      "az container create --sidecar"
    ],
    correctIndex: 1,
    explanation: "Tính năng Sidecar Containers trên Azure App Service sử dụng nhóm lệnh `az webapp sitecontainers create` với cờ `--sitecontainers-spec-file` để triển khai multi-container pod."
  },
  {
    id: "q13",
    question: "Tại sao khi cập nhật Container App trong môi trường Production, bạn NÊN sử dụng cú pháp Image Digest (`@sha256:...`) thay vì tag thông thường (`:latest` hoặc `:v1`)?",
    options: [
      "Vì Azure CLI không hỗ trợ cờ --image với tên tag.",
      "Vì digest đại diện cho mã băm SHA256 bất biến của nội dung image, đảm bảo 100% tất cả replicas khởi tạo đều chạy chính xác cùng một phiên bản mã nguồn, loại bỏ hoàn toàn rủi ro tag bị đẩy đè (tampering) hoặc không đồng bộ.",
      "Vì cú pháp digest giúp tải image nhanh gấp đôi so với dùng tag.",
      "Vì digest giúp miễn phí dung lượng lưu trữ trên Azure Container Registry."
    ],
    correctIndex: 1,
    explanation: "Một tag image (như `latest` hoặc `v1`) là một con trỏ có thể bị ghi đè nội dung bất kỳ lúc nào. Sử dụng SHA256 digest tạo ra tính bất biến tuyệt đối (Immutability), đảm bảo mọi container instance trong cụm ACA luôn chạy đúng bản build đã được kiểm thử."
  },
  {
    id: "q14",
    question: "Khi một Revision trong Azure Container Apps phát sinh sự cố nghiêm trọng, tại sao giải pháp chuẩn của Microsoft là chạy lệnh `az containerapp revision deactivate` thay vì xóa bỏ revision đó?",
    options: [
      "Vì Azure Container Apps không cho phép xóa bất kỳ revision nào.",
      "Vì thao tác `deactivate` sẽ lập tức dừng tất cả replicas và ngắt traffic của revision lỗi, đồng thời bảo lưu cấu hình trong lịch sử để phục vụ phân tích nguyên nhân gốc rễ (Post-mortem) hoặc rollback an toàn.",
      "Vì lệnh deactivate giúp giảm 50% chi phí đăng ký Azure.",
      "Vì xóa revision sẽ làm mất toàn bộ Resource Group."
    ],
    correctIndex: 1,
    explanation: "Vô hiệu hóa (`deactivate`) dừng việc tiêu tốn tài nguyên và ngắt traffic của revision lỗi ngay lập tức, nhưng vẫn bảo tồn các thông tin snapshot cấu hình và dữ liệu log lịch sử để kỹ sư điều tra nguyên nhân sự cố."
  },
  {
    id: "q15",
    question: "Trong Azure Log Analytics, bảng dữ liệu nào lưu trữ các luồng nhật ký bảng điều khiển (stdout / stderr) của các container đang hoạt động trong Azure Container Apps?",
    options: [
      "AppServiceConsoleLogs",
      "ContainerAppConsoleLogs_CL",
      "AzureDiagnostics",
      "Syslog"
    ],
    correctIndex: 1,
    explanation: "Bảng `ContainerAppConsoleLogs_CL` là bảng Custom Log chuyên dụng lưu trữ toàn bộ luồng xuất chuẩn (stdout/stderr) của các container trong môi trường Azure Container Apps."
  },
  {
    id: "q16",
    question: "Sự khác biệt bản chất giữa Liveness Probe và Readiness Probe trong cấu hình Health Probes của Azure Container Apps là gì?",
    options: [
      "Không có sự khác biệt nào giữa hai probe.",
      "Liveness probe chỉ kiểm tra cổng CPU; Readiness probe chỉ kiểm tra bộ nhớ RAM.",
      "Liveness probe kiểm tra xem ứng dụng có còn sống hay bị treo/deadlock để tự động khởi động lại container; trong khi Readiness probe kiểm tra xem ứng dụng đã sẵn sàng xử lý yêu cầu mạng hay chưa để cho phép Ingress chuyển tiếp traffic.",
      "Liveness probe chỉ chạy trên hệ điều hành Windows; Readiness probe chỉ chạy trên Linux."
    ],
    correctIndex: 2,
    explanation: "Liveness probe phát hiện tình trạng ứng dụng bị treo để restart container; Readiness probe phát hiện khi ứng dụng đã nạp xong mô hình/dữ liệu để bắt đầu nhận traffic từ Ingress router."
  },
  {
    id: "q17",
    question: "Trong lệnh `az containerapp create`, cờ `--registry-identity system` mang lại lợi ích bảo mật gì khi kéo image từ Azure Container Registry (ACR)?",
    options: [
      "Bắt buộc người dùng phải gõ mật khẩu tài khoản root của ACR mỗi lần chạy.",
      "Tự động cấu hình System-assigned Managed Identity cho Container App và tự động gán quyền AcrPull vào ACR mà không cần lưu trữ hay quản lý tài khoản admin và mật khẩu tĩnh.",
      "Mã hóa toàn bộ source code của ứng dụng bằng thuật toán RSA-4096.",
      "Tự động xóa ACR sau khi khởi tạo Container App xong."
    ],
    correctIndex: 1,
    explanation: "Cờ `--registry-identity system` tự động gán quyền AcrPull cho System-assigned Managed Identity của Container App, hiện thực hóa kiến trúc Zero-Trust không mật khẩu (passwordless authentication) chuẩn Microsoft."
  },
  {
    id: "q18",
    question: "Trong Azure Container Apps, khi đã lưu một khóa API bí mật trong kho secrets bằng lệnh `az containerapp secret set`, cú pháp chuẩn để tham chiếu secret này vào biến môi trường của container là gì?",
    options: [
      "--set-env-vars ENV_VAR=@vault:secret-name",
      "--set-env-vars ENV_VAR=secretref:<secret-name>",
      "--set-env-vars ENV_VAR=password:<secret-name>",
      "--set-env-vars ENV_VAR=$env:secret-name"
    ],
    correctIndex: 1,
    explanation: "Azure Container Apps sử dụng tiền tố chuẩn `secretref:<secret-name>` trong tham số `--set-env-vars` để liên kết biến môi trường tới giá trị bí mật được mã hóa trong secret vault."
  },
  {
    id: "q19",
    question: "Trong tính năng Azure Container Apps Dynamic Sessions (Code Interpreter cho AI Agent), tùy chọn cấu hình nào giúp bảo vệ an toàn tuyệt đối cho hệ thống bằng cách ngăn chặn mã độc thực thi trong sandbox gửi dữ liệu ra mạng Internet?",
    options: [
      "--network-status EgressDisabled",
      "--firewall block-all",
      "--internet false",
      "--isolate-cpu true"
    ],
    correctIndex: 0,
    explanation: "Cấu hình `--network-status EgressDisabled` sẽ vô hiệu hóa hoàn toàn lưu lượng gửi ra ngoài (egress) của container sandbox, ngăn chặn triệt để mã do LLM sinh ra thực hiện các hành vi rò rỉ dữ liệu hoặc tấn công mạng bên ngoài."
  },
  {
    id: "q20",
    question: "Để tải tệp kubeconfig của cụm Azure Kubernetes Service (AKS) về máy và tự động hợp nhất với cấu hình kubectl cục bộ, câu lệnh Azure CLI nào được sử dụng?",
    options: [
      "az aks connect --name <cluster>",
      "az aks get-credentials --resource-group <rg> --name <cluster-name>",
      "az aks download-config --cluster <cluster>",
      "az k8s kubeconfig pull --name <cluster>"
    ],
    correctIndex: 1,
    explanation: "Lệnh `az aks get-credentials` tải chứng thực cluster và tự động cấu hình ngữ cảnh (context) trong tệp `~/.kube/config`, cho phép công cụ `kubectl` giao tiếp trực tiếp với AKS API server."
  },
  {
    id: "q21",
    question: "Khi một Pod triển khai API suy luận AI trên AKS gặp sự cố CrashLoopBackOff hoặc ImagePullBackOff, lệnh kubectl nào cung cấp thông tin chi tiết nhất về các sự kiện lỗi (Events) để chẩn đoán nguyên nhân?",
    options: [
      "kubectl top pod <pod-name>",
      "kubectl get pods -w",
      "kubectl describe pod <pod-name>",
      "kubectl delete pod <pod-name>"
    ],
    correctIndex: 2,
    explanation: "Lệnh `kubectl describe pod <pod-name>` hiển thị chi tiết toàn bộ thông số kỹ thuật, biến môi trường, mount volume, trạng thái probe và đặc biệt là phần 'Events' ở cuối liệt kê chi tiết mã lỗi từ Kubelet."
  }
];



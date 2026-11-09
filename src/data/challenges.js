/**
 * Challenge & Quiz Dataset based on Useful_Command.md & Microsoft AI-200 Labs
 * Covers all 8 Levels: Environment Setup, ACR & Tasks, App Service Container, RBAC & App Settings,
 * Sidecar Containers, Azure Container Apps (ACA), Azure Kubernetes Service (AKS), and Azure Cosmos DB Vector Search.
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
  },
  {
    id: 8,
    name: "Level 8: Cosmos DB Vector Search & RAG Store",
    tagline: "NoSQL Serverless, Kích hoạt Vector Search, DiskANN Indexing, RAG Document Queries & RBAC Data Plane",
    badge: "Vector DB Architect",
    color: "#00b294",
    icon: "🪐"
  },
  {
    id: 9,
    name: "Level 9: PostgreSQL Flexible Server & pgvector",
    tagline: "Flexible Server, pgvector Extension Allow-listing, Entra ID Authentication, HNSW vs IVFFlat Indexing & Agent Memory",
    badge: "PostgreSQL & Vector Master",
    color: "#336791",
    icon: "🐘"
  },
  {
    id: 10,
    name: "Level 10: Azure Managed Redis & RediSearch Vector",
    tagline: "In-Memory Caching, Entra ID Auth Port 10000, Pub/Sub Event Streaming & RediSearch HNSW Vector Queries",
    badge: "Redis In-Memory Architect",
    color: "#dc382d",
    icon: "🔴"
  },
  {
    id: 11,
    name: "Level 11: Backend Services Integration (Service Bus, Event Grid & Functions)",
    tagline: "Enterprise Message Queues, CloudEvents Push/Pull, Durable Workflows & MCP Server",
    badge: "Enterprise Integration Master",
    color: "#8957e5",
    icon: "⚡"
  },
  {
    id: 12,
    name: "Level 12: Azure Key Vault & App Configuration",
    tagline: "Secrets Management, RBAC Data Plane, Label Stacking, Key Vault References & Sentinel Refresh",
    badge: "Security & Config Architect",
    color: "#059669",
    icon: "🔐"
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
  },

  // ==========================================
  // LEVEL 8: AZURE COSMOS DB VECTOR SEARCH
  // ==========================================
  {
    id: "l8-check-name",
    level: 8,
    title: "1. Kiểm tra Tên Tài khoản Cosmos DB Toàn cầu",
    difficulty: "Cơ bản",
    category: "Pre-flight & Validation",
    mission: "Tên tài khoản Cosmos DB dùng để sinh ra endpoint public `https://<account-name>.documents.azure.com:443/` nên phải duy nhất trên toàn cầu (Globally Unique). Hãy dùng Azure CLI kiểm tra xem tên tài khoản `$env:COSMOS_ACCOUNT` đã tồn tại hay chưa.",
    expectedCommand: "az cosmosdb check-name-exists --name $env:COSMOS_ACCOUNT",
    aliases: [
      "az cosmosdb check-name-exists -n $env:COSMOS_ACCOUNT",
      "az cosmosdb check-name-exists --name <account-name>"
    ],
    tokens: ["az", "cosmosdb", "check-name-exists", "--name", "$env:COSMOS_ACCOUNT"],
    hints: [
      "Lệnh thuộc nhóm `az cosmosdb`.",
      "Hành động kiểm tra tên là `check-name-exists`.",
      "Truyền cờ `--name` với giá trị `$env:COSMOS_ACCOUNT`."
    ],
    mentalModel: {
      rule: "az cosmosdb check-name-exists --name <AccountName>",
      breakdown: [
        { part: "az cosmosdb", role: "Service Group", desc: "Quản lý dịch vụ cơ sở dữ liệu phân tán toàn cầu Azure Cosmos DB" },
        { part: "check-name-exists", role: "Action", desc: "Kiểm tra tính khả dụng toàn cầu của tên tài khoản" },
        { part: "--name", role: "Target Name", desc: "Tên định danh tài khoản cần kiểm tra" }
      ]
    },
    parametersExplanation: [
      { param: "--name", meaning: "Tên tài khoản Cosmos DB (chỉ gồm chữ thường, số, dấu gạch ngang, 3-44 ký tự)." }
    ],
    examNotes: "Nếu kết quả trả về `false`, tên tài khoản hoàn toàn sẵn sàng và chưa bị ai chiếm dụng.",
    simulatedOutput: "false"
  },
  {
    id: "l8-create-account",
    level: 8,
    title: "2. Tạo Tài khoản Cosmos DB NoSQL với Vector Search & Serverless",
    difficulty: "Trung bình",
    category: "Resource Provisioning",
    mission: "Khởi tạo tài khoản Azure Cosmos DB for NoSQL trong Resource Group `$env:RESOURCE_GROUP` với tên `$env:COSMOS_ACCOUNT`, vị trí `southeastasia`. Cấu hình khả năng Serverless và Vector Search (`EnableServerless EnableNoSQLVectorSearch`), mức nhất quán mặc định là `Session`.",
    expectedCommand: "az cosmosdb create --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --locations regionName=southeastasia --capabilities EnableServerless EnableNoSQLVectorSearch --default-consistency-level Session",
    aliases: [
      "az cosmosdb create -g $env:RESOURCE_GROUP -n $env:COSMOS_ACCOUNT --locations regionName=southeastasia --capabilities EnableServerless EnableNoSQLVectorSearch --default-consistency-level Session",
      "az cosmosdb create --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --locations regionName=southeastasia --capabilities EnableNoSQLVectorSearch EnableServerless --default-consistency-level Session"
    ],
    tokens: ["az", "cosmosdb", "create", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:COSMOS_ACCOUNT", "--locations", "regionName=southeastasia", "--capabilities", "EnableServerless", "EnableNoSQLVectorSearch", "--default-consistency-level", "Session"],
    hints: [
      "Dùng lệnh `az cosmosdb create`.",
      "Cờ `--locations regionName=southeastasia` chỉ định khu vực triển khai.",
      "Cờ `--capabilities` truyền 2 tính năng: `EnableServerless EnableNoSQLVectorSearch`.",
      "Mức nhất quán chỉ định qua `--default-consistency-level Session`."
    ],
    mentalModel: {
      rule: "az cosmosdb create --resource-group <RG> --name <Name> --locations regionName=<Region> --capabilities EnableServerless EnableNoSQLVectorSearch --default-consistency-level Session",
      breakdown: [
        { part: "az cosmosdb create", role: "Provisioning", desc: "Tạo tài khoản Azure Cosmos DB mới" },
        { part: "--capabilities EnableNoSQLVectorSearch", role: "AI Vector Feature", desc: "Kích hoạt tính năng tìm kiếm vector và hàm VectorDistance" },
        { part: "--capabilities EnableServerless", role: "Capacity Mode", desc: "Chế độ tính cước theo lượng RU thực dùng, tối ưu chi phí cho lab" },
        { part: "--default-consistency-level Session", role: "Consistency", desc: "Mức nhất quán tối ưu và phổ biến nhất cho ứng dụng web (Read-your-writes)" }
      ]
    },
    parametersExplanation: [
      { param: "--capabilities", meaning: "Kích hoạt các tính năng đặc thù như EnableServerless và EnableNoSQLVectorSearch." },
      { param: "--default-consistency-level", meaning: "Mức nhất quán mặc định: Strong, BoundedStaleness, Session, ConsistentPrefix, Eventual." }
    ],
    examNotes: "💡 Điểm quan trọng AI-200: Tính năng Vector Search trong Cosmos DB NoSQL phải được bật ở cấp độ tài khoản bằng capability `EnableNoSQLVectorSearch`.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-cosmos-vector-lab/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-vector-9e9994d6",
  "name": "cosmos-vector-9e9994d6",
  "provisioningState": "Succeeded",
  "documentEndpoint": "https://cosmos-vector-9e9994d6.documents.azure.com:443/",
  "capabilities": [
    { "name": "EnableServerless" },
    { "name": "EnableNoSQLVectorSearch" }
  ]
}`
  },
  {
    id: "l8-show-capabilities",
    level: 8,
    title: "3. Xác minh Capability EnableNoSQLVectorSearch",
    difficulty: "Cơ bản",
    category: "Inspection",
    mission: "Sau khi tạo tài khoản, hãy kiểm tra xem tính năng Vector Search đã thực sự được kích hoạt trên tài khoản `$env:COSMOS_ACCOUNT` hay chưa bằng cách truy vấn danh sách capabilities và xuất ra dạng văn bản sạch (tsv).",
    expectedCommand: 'az cosmosdb show --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --query "capabilities[].name" -o tsv',
    aliases: [
      "az cosmosdb show -g $env:RESOURCE_GROUP -n $env:COSMOS_ACCOUNT --query \"capabilities[].name\" -o tsv",
      "az cosmosdb show --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --query 'capabilities[].name' -o tsv"
    ],
    tokens: ["az", "cosmosdb", "show", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:COSMOS_ACCOUNT", "--query", "capabilities[].name", "-o", "tsv"],
    hints: [
      "Dùng lệnh `az cosmosdb show`.",
      "Dùng JMESPath `--query \"capabilities[].name\"` để lấy mảng tên capabilities.",
      "Thêm `-o tsv` để nhận chuỗi text sạch không có dấu ngoặc kép."
    ],
    mentalModel: {
      rule: 'az cosmosdb show --resource-group <RG> --name <Account> --query "capabilities[].name" -o tsv',
      breakdown: [
        { part: "az cosmosdb show", role: "Inspection", desc: "Lấy metadata cấu hình của tài khoản Cosmos DB" },
        { part: '--query "capabilities[].name"', role: "JMESPath Projection", desc: "Trích xuất danh sách tên các tính năng đã bật" },
        { part: "-o tsv", role: "Output Format", desc: "Định dạng dạng text phân tách bằng tab/dòng" }
      ]
    },
    parametersExplanation: [
      { param: '--query "capabilities[].name"', meaning: "Bộ lọc JMESPath duyệt qua từng phần tử mảng capabilities và lấy thuộc tính name." }
    ],
    examNotes: "Kết quả hiển thị `EnableNoSQLVectorSearch` đảm bảo các hàm VectorDistance và DiskANN index được chấp thuận.",
    simulatedOutput: `EnableServerless\nEnableNoSQLVectorSearch`
  },
  {
    id: "l8-create-database",
    level: 8,
    title: "4. Tạo Database NoSQL trong Cosmos DB",
    difficulty: "Cơ bản",
    category: "Data Structure",
    mission: "Tạo một database NoSQL mới có tên là `vectorstore` bên trong tài khoản Cosmos DB `$env:COSMOS_ACCOUNT` thuộc Resource Group `$env:RESOURCE_GROUP`.",
    expectedCommand: "az cosmosdb sql database create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --name vectorstore",
    aliases: [
      "az cosmosdb sql database create -g $env:RESOURCE_GROUP -a $env:COSMOS_ACCOUNT -n vectorstore",
      "az cosmosdb sql database create -g $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --name vectorstore"
    ],
    tokens: ["az", "cosmosdb", "sql", "database", "create", "--resource-group", "$env:RESOURCE_GROUP", "--account-name", "$env:COSMOS_ACCOUNT", "--name", "vectorstore"],
    hints: [
      "Nhóm lệnh quản lý NoSQL database là `az cosmosdb sql database create`.",
      "Chỉ định tên tài khoản qua `--account-name $env:COSMOS_ACCOUNT`.",
      "Chỉ định tên database qua `--name vectorstore`."
    ],
    mentalModel: {
      rule: "az cosmosdb sql database create --resource-group <RG> --account-name <Account> --name <Database>",
      breakdown: [
        { part: "az cosmosdb sql database create", role: "Data Structure", desc: "Tạo vùng chứa logic (Database) trong tài khoản Cosmos DB API for NoSQL" },
        { part: "--account-name", role: "Target Server", desc: "Tên tài khoản Cosmos DB lưu trữ database" },
        { part: "--name vectorstore", role: "Database ID", desc: "Tên của database mới" }
      ]
    },
    parametersExplanation: [
      { param: "--account-name", meaning: "Tên của Cosmos DB account." },
      { param: "--name", meaning: "Tên định danh của Database (id)." }
    ],
    examNotes: "Database là đơn vị logic chứa các Containers lưu trữ tài liệu JSON.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-cosmos-vector-lab/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-vector-9e9994d6/sqlDatabases/vectorstore",
  "name": "vectorstore",
  "resource": {
    "id": "vectorstore"
  }
}`
  },
  {
    id: "l8-create-container-vector",
    level: 8,
    title: "5. Tạo Container với Vector Policy & DiskANN Indexing",
    difficulty: "Nâng cao",
    category: "Vector Indexing Policy",
    mission: "Tạo container `vectors` trong database `vectorstore` của tài khoản `$env:COSMOS_ACCOUNT`. Đặt partition key là `/documentId`, truyền chính sách index từ `@indexing-policy.json` và chính sách vector embedding từ `@embedding-policy.json`.",
    expectedCommand: "az cosmosdb sql container create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name vectorstore --name vectors --partition-key-path /documentId --idx @indexing-policy.json --vector-embeddings @embedding-policy.json",
    aliases: [
      "az cosmosdb sql container create -g $env:RESOURCE_GROUP -a $env:COSMOS_ACCOUNT -d vectorstore -n vectors --partition-key-path /documentId --idx @indexing-policy.json --vector-embeddings @embedding-policy.json",
      "az cosmosdb sql container create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name vectorstore --name vectors --partition-key-path /documentId --idx @indexing-policy.json --vector-embeddings @embedding-policy.json"
    ],
    tokens: ["az", "cosmosdb", "sql", "container", "create", "--resource-group", "$env:RESOURCE_GROUP", "--account-name", "$env:COSMOS_ACCOUNT", "--database-name", "vectorstore", "--name", "vectors", "--partition-key-path", "/documentId", "--idx", "@indexing-policy.json", "--vector-embeddings", "@embedding-policy.json"],
    hints: [
      "Lệnh tạo container NoSQL là `az cosmosdb sql container create`.",
      "Partition key chỉ định qua `--partition-key-path /documentId`.",
      "Chính sách index truyền qua cờ `--idx @indexing-policy.json`.",
      "Chính sách vector embedding truyền qua cờ `--vector-embeddings @embedding-policy.json`."
    ],
    mentalModel: {
      rule: "az cosmosdb sql container create --resource-group <RG> --account-name <Account> --database-name <DB> --name <Container> --partition-key-path <Path> --idx <IndexPolicy> --vector-embeddings <EmbeddingPolicy>",
      breakdown: [
        { part: "--partition-key-path /documentId", role: "Partition Key", desc: "Định nghĩa khóa phân vùng vật lý phân bổ dữ liệu" },
        { part: "--idx @indexing-policy.json", role: "DiskANN Index", desc: "Cấu hình vectorIndexes kiểu DiskANN và loại trừ /embedding/* khỏi B-tree index" },
        { part: "--vector-embeddings @embedding-policy.json", role: "Embedding Spec", desc: "Định nghĩa đường dẫn /embedding, kiểu dữ liệu float32, khoảng cách cosine, kích thước 256 chiều" }
      ]
    },
    parametersExplanation: [
      { param: "--partition-key-path", meaning: "Đường dẫn thuộc tính JSON dùng làm partition key." },
      { param: "--idx", meaning: "Chính sách đánh chỉ mục JSON hoặc đường dẫn tệp JSON (@path)." },
      { param: "--vector-embeddings", meaning: "Chính sách định nghĩa mảng vector (dataType, distanceFunction, dimensions)." }
    ],
    examNotes: "💡 Điểm thi AI-200 then chốt: Đường dẫn vector `/embedding/*` bắt buộc phải đưa vào `excludedPaths` của indexing policy để tránh chỉ mục B-tree mặc định làm tăng đột biến chi phí RU/s và dung lượng.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-cosmos-vector-lab/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-vector-9e9994d6/sqlDatabases/vectorstore/containers/vectors",
  "name": "vectors",
  "resource": {
    "id": "vectors",
    "partitionKey": {
      "paths": ["/documentId"],
      "kind": "Hash"
    },
    "indexingPolicy": {
      "indexingMode": "consistent",
      "automatic": true,
      "includedPaths": [{ "path": "/*" }],
      "excludedPaths": [{ "path": "/embedding/*" }],
      "vectorIndexes": [{ "path": "/embedding", "type": "diskANN" }]
    },
    "vectorEmbeddingPolicy": {
      "vectorEmbeddings": [
        { "path": "/embedding", "dataType": "float32", "distanceFunction": "cosine", "dimensions": 256 }
      ]
    }
  }
}`
  },
  {
    id: "l8-create-rag-container",
    level: 8,
    title: "6. Tạo Container Chunks cho RAG với Partition Key /documentId",
    difficulty: "Trung bình",
    category: "RAG Data Storage",
    mission: "Tạo một container NoSQL mới tên `chunks` trong database `ragstore` của tài khoản `$env:COSMOS_ACCOUNT`. Đặt partition key là `/documentId` để gom nhóm toàn bộ các đoạn văn bản (chunks) của cùng một tài liệu vào chung một phân vùng vật lý.",
    expectedCommand: "az cosmosdb sql container create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name ragstore --name chunks --partition-key-path /documentId",
    aliases: [
      "az cosmosdb sql container create -g $env:RESOURCE_GROUP -a $env:COSMOS_ACCOUNT -d ragstore -n chunks --partition-key-path /documentId",
      "az cosmosdb sql container create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name ragstore --name chunks --partition-key-path /documentId"
    ],
    tokens: ["az", "cosmosdb", "sql", "container", "create", "--resource-group", "$env:RESOURCE_GROUP", "--account-name", "$env:COSMOS_ACCOUNT", "--database-name", "ragstore", "--name", "chunks", "--partition-key-path", "/documentId"],
    hints: [
      "Lệnh tạo container NoSQL là `az cosmosdb sql container create`.",
      "Chỉ định database qua `--database-name ragstore`.",
      "Chỉ định tên container qua `--name chunks`.",
      "Khóa phân vùng được đặt qua cờ `--partition-key-path /documentId`."
    ],
    mentalModel: {
      rule: "az cosmosdb sql container create --resource-group <RG> --account-name <Account> --database-name <DB> --name <Container> --partition-key-path /documentId",
      breakdown: [
        { part: "az cosmosdb sql container create", role: "Container Provisioning", desc: "Tạo container lưu trữ các chunks văn bản phục vụ RAG" },
        { part: "--partition-key-path /documentId", role: "Partition Strategy", desc: "Đảm bảo truy vấn lấy toàn bộ chunks của 1 document luôn là Single-Partition Query" }
      ]
    },
    parametersExplanation: [
      { param: "--partition-key-path", meaning: "Đường dẫn JSON xác định khóa phân vùng cho container." }
    ],
    examNotes: "💡 Điểm thi AI-200 then chốt: Sử dụng `/documentId` làm Partition Key giúp tránh triệt để tình trạng Cross-Partition Query tốn kém RU khi LLM cần nạp toàn bộ ngữ cảnh của 1 tài liệu.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-cosmos-vector-lab/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-vector-9e9994d6/sqlDatabases/ragstore/containers/chunks",
  "name": "chunks",
  "resource": {
    "id": "chunks",
    "partitionKey": {
      "paths": ["/documentId"],
      "kind": "Hash"
    }
  }
}`
  },
  {
    id: "l8-list-containers",
    level: 8,
    title: "7. Liệt kê các Container trong Database NoSQL",
    difficulty: "Cơ bản",
    category: "Inspection",
    mission: "Hiển thị danh sách toàn bộ các container đang có bên trong database `ragstore` của tài khoản Cosmos DB `$env:COSMOS_ACCOUNT` dưới dạng bảng trực quan.",
    expectedCommand: "az cosmosdb sql container list --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name ragstore -o table",
    aliases: [
      "az cosmosdb sql container list -g $env:RESOURCE_GROUP -a $env:COSMOS_ACCOUNT -d ragstore -o table",
      "az cosmosdb sql container list --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name ragstore --output table"
    ],
    tokens: ["az", "cosmosdb", "sql", "container", "list", "--resource-group", "$env:RESOURCE_GROUP", "--account-name", "$env:COSMOS_ACCOUNT", "--database-name", "ragstore", "-o", "table"],
    hints: [
      "Lệnh liệt kê container là `az cosmosdb sql container list`.",
      "Chỉ định `--database-name ragstore`.",
      "Định dạng bảng với `-o table`."
    ],
    mentalModel: {
      rule: "az cosmosdb sql container list --resource-group <RG> --account-name <Account> --database-name <DB> -o table",
      breakdown: [
        { part: "az cosmosdb sql container list", role: "List Action", desc: "Liệt kê các containers bên trong một NoSQL database cụ thể" },
        { part: "-o table", role: "Output Format", desc: "Hiển thị kết quả dạng bảng 2 chiều" }
      ]
    },
    parametersExplanation: [
      { param: "--database-name", meaning: "Tên database cần tra cứu danh sách container." }
    ],
    examNotes: "Cho phép nhanh chóng xác minh danh sách container và partition key tương ứng.",
    simulatedOutput: `Name    PartitionKey    DefaultTtl
------  --------------  ------------
chunks  /documentId`
  },
  {
    id: "l8-show-throughput",
    level: 8,
    title: "8. Kiểm tra Cấu hình Throughput RU/s của Container",
    difficulty: "Trung bình",
    category: "Performance & Cost",
    mission: "Kiểm tra thông số Throughput (mức RU/s được cấp phát) của container `chunks` trong database `ragstore` của tài khoản Cosmos DB `$env:COSMOS_ACCOUNT`.",
    expectedCommand: "az cosmosdb sql container throughput show --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name ragstore --name chunks",
    aliases: [
      "az cosmosdb sql container throughput show -g $env:RESOURCE_GROUP -a $env:COSMOS_ACCOUNT -d ragstore -n chunks",
      "az cosmosdb sql container throughput show --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name ragstore --name chunks"
    ],
    tokens: ["az", "cosmosdb", "sql", "container", "throughput", "show", "--resource-group", "$env:RESOURCE_GROUP", "--account-name", "$env:COSMOS_ACCOUNT", "--database-name", "ragstore", "--name", "chunks"],
    hints: [
      "Lệnh kiểm tra throughput là `az cosmosdb sql container throughput show`.",
      "Chỉ định database qua `--database-name ragstore`.",
      "Chỉ định container qua `--name chunks`."
    ],
    mentalModel: {
      rule: "az cosmosdb sql container throughput show --resource-group <RG> --account-name <Account> --database-name <DB> --name <Container>",
      breakdown: [
        { part: "az cosmosdb sql container throughput show", role: "Throughput Inspection", desc: "Xem chi tiết dung lượng Request Units (RU/s) hoặc trạng thái Serverless" }
      ]
    },
    parametersExplanation: [
      { param: "throughput show", meaning: "Xem cấu hình thông lượng tính phí (Provisioned throughput hoặc Serverless)." }
    ],
    examNotes: "Nếu tài khoản ở chế độ Serverless (`EnableServerless`), container sẽ không thiết lập throughput cố định mà tự động scale theo tải thực tế.",
    simulatedOutput: `{
  "resource": {
    "throughput": null,
    "minimumThroughput": null,
    "offerReplacePending": "false"
  }
}`
  },
  {
    id: "l8-get-cosmos-id",
    level: 8,
    title: "9. Lấy Resource ID của Cosmos DB cho RBAC",
    difficulty: "Cơ bản",
    category: "Identity & RBAC",
    mission: "Lấy chuỗi Resource ID đầy đủ (ARM ID) của tài khoản Cosmos DB `$env:COSMOS_ACCOUNT` dưới định dạng text sạch và gán vào biến PowerShell `$COSMOS_ID` để sử dụng làm phạm vi (scope) phân quyền RBAC.",
    expectedCommand: "$COSMOS_ID = az cosmosdb show --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --query id -o tsv",
    aliases: [
      "$COSMOS_ID = az cosmosdb show -g $env:RESOURCE_GROUP -n $env:COSMOS_ACCOUNT --query id -o tsv",
      "$COSMOS_ID = az cosmosdb show --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --query id --output tsv"
    ],
    tokens: ["$COSMOS_ID", "=", "az", "cosmosdb", "show", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:COSMOS_ACCOUNT", "--query", "id", "-o", "tsv"],
    hints: [
      "Bắt đầu bằng `$COSMOS_ID = `.",
      "Dùng lệnh `az cosmosdb show`.",
      "Dùng `--query id -o tsv` để nhận Resource ID không có dấu ngoặc kép."
    ],
    mentalModel: {
      rule: "$COSMOS_ID = az cosmosdb show --resource-group <RG> --name <Account> --query id -o tsv",
      breakdown: [
        { part: "$COSMOS_ID =", role: "Variable Assignment", desc: "Lưu ARM Scope ID vào biến shell" },
        { part: "--query id", role: "JMESPath", desc: "Lọc lấy chuỗi /subscriptions/.../databaseAccounts/..." },
        { part: "-o tsv", role: "Clean String", desc: "Bỏ ngoặc kép bao quanh chuỗi ID" }
      ]
    },
    parametersExplanation: [
      { param: "-o tsv", meaning: "Xuất dữ liệu text thuần không có dấu ngoặc kép JSON." }
    ],
    examNotes: "Resource ID này được dùng làm `--scope` cho cả Control Plane RBAC và Data Plane RBAC.",
    simulatedOutput: "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-cosmos-vector-lab/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-vector-9e9994d6"
  },
  {
    id: "l8-rbac-control-plane",
    level: 8,
    title: "10. Gán quyền ARM Contributor (Control Plane)",
    difficulty: "Trung bình",
    category: "Identity & RBAC",
    mission: "Gán vai trò Azure RBAC `Contributor` cho người dùng `$USER_ID` trên phạm vi tài khoản Cosmos DB `$COSMOS_ID` để cho phép tạo/quản lý database và container thông qua Azure Resource Manager.",
    expectedCommand: "az role assignment create --assignee $USER_ID --scope $COSMOS_ID --role Contributor",
    aliases: [
      "az role assignment create --assignee $USER_ID --role Contributor --scope $COSMOS_ID"
    ],
    tokens: ["az", "role", "assignment", "create", "--assignee", "$USER_ID", "--scope", "$COSMOS_ID", "--role", "Contributor"],
    hints: [
      "Lệnh gán quyền RBAC cấp Azure là `az role assignment create`.",
      "Truyền danh tính qua `--assignee $USER_ID`.",
      "Truyền phạm vi tài khoản qua `--scope $COSMOS_ID`.",
      "Vai trò là `--role Contributor`."
    ],
    mentalModel: {
      rule: "az role assignment create --assignee <User/App> --scope <Scope> --role Contributor",
      breakdown: [
        { part: "az role assignment create", role: "Azure RBAC", desc: "Quản trị quyền truy cập tầng điều khiển (Control Plane / ARM)" },
        { part: "--role Contributor", role: "Management Role", desc: "Quyền quản lý cấu hình hạ tầng tài nguyên (tạo container, đổi vùng, scale RU)" }
      ]
    },
    parametersExplanation: [
      { param: "--assignee", meaning: "Object ID hoặc User Principal Name của người dùng/Managed Identity." },
      { param: "--scope", meaning: "Phạm vi áp dụng quyền (Resource ID của tài khoản Cosmos DB)." }
    ],
    examNotes: "⚠️ Lưu ý thi AI-200: Quyền Contributor ở tầng ARM chỉ quản lý cấu hình, KHÔNG tự động cấp quyền truy vấn hay ghi dữ liệu documents trong container!",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-cosmos-vector-lab/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-vector-9e9994d6/providers/Microsoft.Authorization/roleAssignments/role-contrib-12345",
  "principalId": "00000000-0000-0000-0000-000000000001",
  "roleDefinitionName": "Contributor",
  "scope": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-cosmos-vector-lab/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-vector-9e9994d6"
}`
  },
  {
    id: "l8-rbac-data-plane",
    level: 8,
    title: "11. Gán quyền Data Plane 'Cosmos DB Built-in Data Contributor'",
    difficulty: "Nâng cao",
    category: "Identity & RBAC",
    mission: "Để ứng dụng Python hoặc người dùng có thể thực hiện truy vấn Vector Search và lưu document vào container mà không cần dùng Access Key tĩnh (Zero Trust), hãy gán quyền Data Plane `Cosmos DB Built-in Data Contributor` cho `$USER_ID`.",
    expectedCommand: 'az cosmosdb sql role assignment create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --role-definition-name "Cosmos DB Built-in Data Contributor" --principal-id $USER_ID --scope $COSMOS_ID',
    aliases: [
      "az cosmosdb sql role assignment create -g $env:RESOURCE_GROUP -a $env:COSMOS_ACCOUNT --role-definition-name \"Cosmos DB Built-in Data Contributor\" --principal-id $USER_ID --scope $COSMOS_ID",
      "az cosmosdb sql role assignment create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --role-definition-name 'Cosmos DB Built-in Data Contributor' --principal-id $USER_ID --scope $COSMOS_ID"
    ],
    tokens: ["az", "cosmosdb", "sql", "role", "assignment", "create", "--resource-group", "$env:RESOURCE_GROUP", "--account-name", "$env:COSMOS_ACCOUNT", "--role-definition-name", "Cosmos DB Built-in Data Contributor", "--principal-id", "$USER_ID", "--scope", "$COSMOS_ID"],
    hints: [
      "Lệnh phân quyền Data Plane riêng của Cosmos DB là `az cosmosdb sql role assignment create`.",
      'Tên định nghĩa vai trò là `--role-definition-name "Cosmos DB Built-in Data Contributor"`.',
      "Định danh người nhận quyền truyền qua cờ `--principal-id $USER_ID`.",
      "Phạm vi áp dụng truyền qua `--scope $COSMOS_ID`."
    ],
    mentalModel: {
      rule: 'az cosmosdb sql role assignment create --resource-group <RG> --account-name <Account> --role-definition-name "Cosmos DB Built-in Data Contributor" --principal-id <ID> --scope <Scope>',
      breakdown: [
        { part: "az cosmosdb sql role assignment create", role: "Data Plane RBAC", desc: "Hệ thống RBAC nội bộ cấp dữ liệu của Cosmos DB NoSQL" },
        { part: '--role-definition-name "Cosmos DB Built-in Data Contributor"', role: "Data Role", desc: "Cấp quyền đọc, ghi, truy vấn VectorDistance trên tất cả containers" },
        { part: "--principal-id", role: "Identity", desc: "Object ID của Entra ID User hoặc Managed Identity của App" }
      ]
    },
    parametersExplanation: [
      { param: "--role-definition-name", meaning: "Tên vai trò dữ liệu dựng sẵn: 'Cosmos DB Built-in Data Reader' hoặc 'Cosmos DB Built-in Data Contributor'." },
      { param: "--principal-id", meaning: "Object ID của danh tính Entra ID." }
    ],
    examNotes: "Đây là cách duy nhất để sử dụng `DefaultAzureCredential()` từ SDK mà không cần lưu trữ chuỗi kết nối chứa master key (AccountKey).",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-cosmos-vector-lab/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-vector-9e9994d6/sqlRoleAssignments/data-contrib-67890",
  "principalId": "00000000-0000-0000-0000-000000000001",
  "roleDefinitionId": "/subscriptions/.../sqlRoleDefinitions/00000000-0000-0000-0000-000000000002",
  "scope": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-cosmos-vector-lab/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-vector-9e9994d6"
}`
  },
  {
    id: "l8-get-endpoint",
    level: 8,
    title: "12. Lấy Document Endpoint sạch để cấu hình SDK",
    difficulty: "Cơ bản",
    category: "SDK Configuration",
    mission: "Trích xuất URL `documentEndpoint` của tài khoản Cosmos DB `$env:COSMOS_ACCOUNT` dạng chuỗi sạch không có dấu ngoặc kép và lưu vào biến `$COSMOS_ENDPOINT` để chuẩn bị cho tệp cấu hình `.env`.",
    expectedCommand: "$COSMOS_ENDPOINT = az cosmosdb show --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --query documentEndpoint -o tsv",
    aliases: [
      "$COSMOS_ENDPOINT = az cosmosdb show -g $env:RESOURCE_GROUP -n $env:COSMOS_ACCOUNT --query documentEndpoint -o tsv",
      "$COSMOS_ENDPOINT = az cosmosdb show --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --query documentEndpoint --output tsv"
    ],
    tokens: ["$COSMOS_ENDPOINT", "=", "az", "cosmosdb", "show", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:COSMOS_ACCOUNT", "--query", "documentEndpoint", "-o", "tsv"],
    hints: [
      "Bắt đầu bằng `$COSMOS_ENDPOINT = `.",
      "Dùng lệnh `az cosmosdb show`.",
      "Thuộc tính endpoint là `--query documentEndpoint`.",
      "Kết thúc bằng `-o tsv`."
    ],
    mentalModel: {
      rule: "$COSMOS_ENDPOINT = az cosmosdb show --resource-group <RG> --name <Account> --query documentEndpoint -o tsv",
      breakdown: [
        { part: "--query documentEndpoint", role: "JMESPath Property", desc: "Trích xuất trường HTTPS URL của tài khoản Cosmos DB" },
        { part: "-o tsv", role: "Clean String", desc: "Loại bỏ ngoặc kép bao quanh URL" }
      ]
    },
    parametersExplanation: [
      { param: "--query documentEndpoint", meaning: "Địa chỉ HTTPS dùng cho CosmosClient trong Python SDK." }
    ],
    examNotes: "Endpoint trả về có cấu trúc: `https://<account-name>.documents.azure.com:443/`.",
    simulatedOutput: "https://cosmos-vector-9e9994d6.documents.azure.com:443/"
  },
  {
    id: "l8-create-container-quantized",
    level: 8,
    title: "13. Tạo Container với Vector Index 'quantizedFlat'",
    difficulty: "Nâng cao",
    category: "Vector Index Optimization",
    mission: "Tạo container `vectors-quantized` trong database `indexoptimize` của tài khoản `$env:COSMOS_ACCOUNT`. Đặt partition key là `/documentId`, nạp chính sách index nén scalar quantization từ `@indexing-policy-quantized.json` và chính sách embedding từ `@embedding-policy.json`.",
    expectedCommand: "az cosmosdb sql container create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name indexoptimize --name vectors-quantized --partition-key-path /documentId --idx @indexing-policy-quantized.json --vector-embeddings @embedding-policy.json",
    aliases: [
      "az cosmosdb sql container create -g $env:RESOURCE_GROUP -a $env:COSMOS_ACCOUNT -d indexoptimize -n vectors-quantized --partition-key-path /documentId --idx @indexing-policy-quantized.json --vector-embeddings @embedding-policy.json",
      "az cosmosdb sql container create --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name indexoptimize --name vectors-quantized --partition-key-path /documentId --idx @indexing-policy-quantized.json --vector-embeddings @embedding-policy.json"
    ],
    tokens: ["az", "cosmosdb", "sql", "container", "create", "--resource-group", "$env:RESOURCE_GROUP", "--account-name", "$env:COSMOS_ACCOUNT", "--database-name", "indexoptimize", "--name", "vectors-quantized", "--partition-key-path", "/documentId", "--idx", "@indexing-policy-quantized.json", "--vector-embeddings", "@embedding-policy.json"],
    hints: [
      "Lệnh tạo container là `az cosmosdb sql container create`.",
      "Chỉ định database qua `--database-name indexoptimize`.",
      "Chỉ định tên container qua `--name vectors-quantized`.",
      "Cờ `--idx @indexing-policy-quantized.json` chứa cấu hình type 'quantizedFlat'."
    ],
    mentalModel: {
      rule: "az cosmosdb sql container create --resource-group <RG> --account-name <Account> --database-name indexoptimize --name vectors-quantized --partition-key-path /documentId --idx <Policy> --vector-embeddings <Embedding>",
      breakdown: [
        { part: "vectors-quantized", role: "Target Container", desc: "Container tối ưu hóa bộ nhớ RAM thông qua nén scalar quantization" },
        { part: "--idx @indexing-policy-quantized.json", role: "Quantized Index", desc: "Chính sách index kiểu quantizedFlat" }
      ]
    },
    parametersExplanation: [
      { param: "--idx", meaning: "Tệp JSON chứa vectorIndexes kiểu quantizedFlat." }
    ],
    examNotes: "💡 Điểm thi AI-200: quantizedFlat phù hợp cho các tập dữ liệu từ 10,000 đến 100,000 vectors cần cân bằng giữa độ chính xác và mức tiết kiệm RAM.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-cosmos-vector-lab/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-vector-9e9994d6/sqlDatabases/indexoptimize/containers/vectors-quantized",
  "name": "vectors-quantized",
  "resource": {
    "id": "vectors-quantized",
    "partitionKey": { "paths": ["/documentId"], "kind": "Hash" },
    "indexingPolicy": {
      "vectorIndexes": [{ "path": "/embedding", "type": "quantizedFlat" }]
    }
  }
}`
  },
  {
    id: "l8-show-vector-indexes",
    level: 8,
    title: "14. Kiểm tra Cấu hình Vector Index Policy bằng JMESPath",
    difficulty: "Trung bình",
    category: "Inspection",
    mission: "Sử dụng Azure CLI và bộ lọc JMESPath để trích xuất mảng `vectorIndexes` của container `vectors-quantized` trong database `indexoptimize` nhằm xác nhận loại chỉ mục `quantizedFlat` đã được thiết lập chính xác.",
    expectedCommand: 'az cosmosdb sql container show --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name indexoptimize --name vectors-quantized --query "indexingPolicy.vectorIndexes"',
    aliases: [
      "az cosmosdb sql container show -g $env:RESOURCE_GROUP -a $env:COSMOS_ACCOUNT -d indexoptimize -n vectors-quantized --query \"indexingPolicy.vectorIndexes\"",
      "az cosmosdb sql container show --resource-group $env:RESOURCE_GROUP --account-name $env:COSMOS_ACCOUNT --database-name indexoptimize --name vectors-quantized --query 'indexingPolicy.vectorIndexes'"
    ],
    tokens: ["az", "cosmosdb", "sql", "container", "show", "--resource-group", "$env:RESOURCE_GROUP", "--account-name", "$env:COSMOS_ACCOUNT", "--database-name", "indexoptimize", "--name", "vectors-quantized", "--query", "indexingPolicy.vectorIndexes"],
    hints: [
      "Lệnh xem thông tin container là `az cosmosdb sql container show`.",
      "Bộ lọc JMESPath là `--query \"indexingPolicy.vectorIndexes\"`."
    ],
    mentalModel: {
      rule: 'az cosmosdb sql container show --resource-group <RG> --account-name <Account> --database-name <DB> --name <Container> --query "indexingPolicy.vectorIndexes"',
      breakdown: [
        { part: '--query "indexingPolicy.vectorIndexes"', role: "JMESPath Projection", desc: "Trích xuất danh sách cấu hình các vector index đang áp dụng" }
      ]
    },
    parametersExplanation: [
      { param: '--query "indexingPolicy.vectorIndexes"', meaning: "Chỉ lấy thông số cấu hình mảng vectorIndexes của container." }
    ],
    examNotes: "Giúp xác minh cấu hình loại vector index (flat, quantizedFlat, hoặc diskANN) mà không cần xem toàn bộ tài liệu cấu hình JSON khổng lồ.",
    simulatedOutput: `[
  {
    "path": "/embedding",
    "type": "quantizedFlat"
  }
]`
  },
  {
    id: "l8-delete-account",
    level: 8,
    title: "15. Dọn dẹp và Xóa Tài khoản Cosmos DB",
    difficulty: "Cơ bản",
    category: "Cleanup",
    mission: "Sau khi hoàn thành thử nghiệm lab và đánh giá mô hình vector, hãy dùng lệnh Azure CLI xóa tài khoản Cosmos DB `$env:COSMOS_ACCOUNT` trong Resource Group `$env:RESOURCE_GROUP` kèm cờ xác nhận tự động (`--yes`).",
    expectedCommand: "az cosmosdb delete --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT --yes",
    aliases: [
      "az cosmosdb delete -g $env:RESOURCE_GROUP -n $env:COSMOS_ACCOUNT --yes",
      "az cosmosdb delete -g $env:RESOURCE_GROUP -n $env:COSMOS_ACCOUNT -y",
      "az cosmosdb delete --resource-group $env:RESOURCE_GROUP --name $env:COSMOS_ACCOUNT -y"
    ],
    tokens: ["az", "cosmosdb", "delete", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:COSMOS_ACCOUNT", "--yes"],
    hints: [
      "Lệnh xóa là `az cosmosdb delete`.",
      "Thêm cờ `--yes` (hoặc `-y`) để bỏ qua bước prompt hỏi xác nhận `y/n`."
    ],
    mentalModel: {
      rule: "az cosmosdb delete --resource-group <RG> --name <Account> --yes",
      breakdown: [
        { part: "az cosmosdb delete", role: "Destruction Action", desc: "Xóa toàn bộ tài khoản Cosmos DB cùng mọi cơ sở dữ liệu và containers bên trong" },
        { part: "--yes", role: "Auto Confirmation", desc: "Bỏ qua hộp thoại xác nhận trong kịch bản tự động hóa CI/CD" }
      ]
    },
    parametersExplanation: [
      { param: "--yes", meaning: "Không hiển thị câu hỏi xác nhận Do you want to continue?." }
    ],
    examNotes: "Tên tài khoản sau khi xóa sẽ được Azure giải phóng trong vòng vài phút để có thể tái sử dụng.",
    simulatedOutput: ""
  }
,
  // ==========================================
  // LEVEL 9: AZURE DATABASE FOR POSTGRESQL & PGVECTOR
  // ==========================================
  {
    id: "l9-register-provider",
    level: 9,
    title: "1. Đăng ký Resource Provider Microsoft.DBforPostgreSQL",
    difficulty: "Cơ bản",
    category: "Pre-flight & Provider Setup",
    mission: "Trước khi tạo Azure Database for PostgreSQL Flexible Server, Azure Subscription cần phải đăng ký Resource Provider `Microsoft.DBforPostgreSQL`. Hãy sử dụng Azure CLI để kích hoạt việc đăng ký provider này.",
    expectedCommand: "az provider register --namespace Microsoft.DBforPostgreSQL",
    aliases: [
      "az provider register -n Microsoft.DBforPostgreSQL"
    ],
    tokens: ["az", "provider", "register", "--namespace", "Microsoft.DBforPostgreSQL"],
    hints: [
      "Dùng nhóm lệnh `az provider`.",
      "Hành động là `register`.",
      "Cờ `--namespace` nhận giá trị `Microsoft.DBforPostgreSQL`."
    ],
    mentalModel: {
      rule: "az provider register --namespace <Namespace>",
      breakdown: [
        { part: "az provider register", role: "Registration Action", desc: "Đăng ký resource provider cần thiết cho subscription" },
        { part: "--namespace Microsoft.DBforPostgreSQL", role: "Target Service", desc: "Namespace cung cấp dịch vụ Azure Database for PostgreSQL" }
      ]
    },
    parametersExplanation: [
      { param: "--namespace", meaning: "Namespace của nhà cung cấp tài nguyên Azure (Resource Provider)." }
    ],
    examNotes: "💡 Điểm thi AI-200: Nếu subscription chưa đăng ký Microsoft.DBforPostgreSQL, lệnh tạo Flexible Server sẽ báo lỗi ProviderNotRegistered.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/providers/Microsoft.DBforPostgreSQL",
  "namespace": "Microsoft.DBforPostgreSQL",
  "registrationPolicy": "RegistrationRequired",
  "registrationState": "Registering"
}`
  },
  {
    id: "l9-create-flexible-server",
    level: 9,
    title: "2. Khởi tạo PostgreSQL Flexible Server với Entra Authentication",
    difficulty: "Nâng cao",
    category: "Resource Provisioning",
    mission: "Tạo Azure Database for PostgreSQL Flexible Server với tên `$env:PG_SERVER` trong RG `$env:RG`, vị trí `$env:LOCATION`. Sử dụng SKU `Standard_B1ms`, tầng `Burstable`, dung lượng lưu trữ `32` GB, phiên bản PostgreSQL `16`. Kích hoạt truy cập công khai (`--public-access Enabled`), bật xác thực Microsoft Entra (`--microsoft-entra-auth Enabled`) và xác thực mật khẩu (`--password-auth Enabled`), chỉ định admin ban đầu là `pgadmin` với mật khẩu `$env:ADMIN_PASSWORD` và cờ `--yes`.",
    expectedCommand: "az postgres flexible-server create --resource-group $env:RG --name $env:PG_SERVER --location $env:LOCATION --sku-name Standard_B1ms --tier Burstable --storage-size 32 --version 16 --public-access Enabled --microsoft-entra-auth Enabled --password-auth Enabled --admin-user pgadmin --admin-password $env:ADMIN_PASSWORD --yes",
    aliases: [
      "az postgres flexible-server create -g $env:RG -n $env:PG_SERVER -l $env:LOCATION --sku-name Standard_B1ms --tier Burstable --storage-size 32 --version 16 --public-access Enabled --microsoft-entra-auth Enabled --password-auth Enabled --admin-user pgadmin --admin-password $env:ADMIN_PASSWORD --yes",
      "az postgres flexible-server create --resource-group $env:RG --name $env:PG_SERVER --location $env:LOCATION --sku-name Standard_B1ms --tier Burstable --storage-size 32 --version 16 --microsoft-entra-auth Enabled --password-auth Enabled --public-access Enabled --admin-user pgadmin --admin-password $env:ADMIN_PASSWORD --yes"
    ],
    tokens: ["az", "postgres", "flexible-server", "create", "--resource-group", "$env:RG", "--name", "$env:PG_SERVER", "--location", "$env:LOCATION", "--sku-name", "Standard_B1ms", "--tier", "Burstable", "--storage-size", "32", "--version", "16", "--public-access", "Enabled", "--microsoft-entra-auth", "Enabled", "--password-auth", "Enabled", "--admin-user", "pgadmin", "--admin-password", "$env:ADMIN_PASSWORD", "--yes"],
    hints: [
      "Nhóm lệnh là `az postgres flexible-server create`.",
      "Chỉ định SKU và tier: `--sku-name Standard_B1ms --tier Burstable --storage-size 32`.",
      "Chỉ định phiên bản và mạng: `--version 16 --public-access Enabled`.",
      "Kích hoạt xác thực kép ban đầu: `--microsoft-entra-auth Enabled --password-auth Enabled`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server create --resource-group <RG> --name <Server> --sku-name Standard_B1ms --tier Burstable --version 16 --microsoft-entra-auth Enabled --password-auth Enabled --admin-user <Admin> --admin-password <Password> --yes",
      breakdown: [
        { part: "az postgres flexible-server create", role: "Provisioning Action", desc: "Tạo máy chủ PostgreSQL Flexible Server mới" },
        { part: "--sku-name Standard_B1ms --tier Burstable", role: "Compute Tier", desc: "SKU tiết kiệm chi phí tối ưu cho môi trường Dev/Lab" },
        { part: "--version 16", role: "PostgreSQL Engine", desc: "Phiên bản PostgreSQL 16 hiện đại hỗ trợ đầy đủ pgvector" },
        { part: "--microsoft-entra-auth Enabled", role: "Modern Identity", desc: "Kích hoạt xác thực định danh Microsoft Entra ID không cần mật khẩu tĩnh" }
      ]
    },
    parametersExplanation: [
      { param: "--sku-name", meaning: "Tên mã máy ảo (SKU) cho PostgreSQL, ví dụ Standard_B1ms." },
      { param: "--tier", meaning: "Tầng định giá: Burstable, GeneralPurpose, hoặc MemoryOptimized." },
      { param: "--microsoft-entra-auth", meaning: "Bật hoặc tắt tính năng đăng nhập bằng tài khoản Microsoft Entra (Azure AD)." },
      { param: "--password-auth", meaning: "Bật hoặc tắt phương thức đăng nhập bằng tên người dùng và mật khẩu cục bộ." }
    ],
    examNotes: "💡 Điểm thi AI-200: Microsoft khuyến nghị sử dụng mô hình Entra ID Authentication để loại bỏ hoàn toàn mật khẩu lưu trong code hoặc tệp cấu hình.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-postgresql-lab/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-vector-9e9994d6",
  "name": "psql-vector-9e9994d6",
  "location": "southeastasia",
  "sku": {
    "name": "Standard_B1ms",
    "tier": "Burstable"
  },
  "version": "16",
  "state": "Ready",
  "fullyQualifiedDomainName": "psql-vector-9e9994d6.postgres.database.azure.com",
  "authConfig": {
    "activeDirectoryAuth": "Enabled",
    "passwordAuth": "Enabled"
  }
}`
  },
  {
    id: "l9-show-server-state",
    level: 9,
    title: "3. Kiểm tra Trạng thái Sẵn sàng của PostgreSQL Server",
    difficulty: "Cơ bản",
    category: "Monitoring & Health Check",
    mission: "Truy vấn thuộc tính trạng thái `properties.state` của máy chủ PostgreSQL `$env:PG_SERVER` trong RG `$env:RG` và trả về dưới dạng chuỗi sạch (TSV) để kiểm tra xem máy chủ đã đạt trạng thái 'Ready' hay chưa.",
    expectedCommand: "az postgres flexible-server show --resource-group $env:RG --name $env:PG_SERVER --query properties.state -o tsv",
    aliases: [
      "az postgres flexible-server show -g $env:RG -n $env:PG_SERVER --query properties.state -o tsv",
      "az postgres flexible-server show --resource-group $env:RG --name $env:PG_SERVER --query \"properties.state\" -o tsv"
    ],
    tokens: ["az", "postgres", "flexible-server", "show", "--resource-group", "$env:RG", "--name", "$env:PG_SERVER", "--query", "properties.state", "-o", "tsv"],
    hints: [
      "Lệnh xem thông tin là `az postgres flexible-server show`.",
      "Trích xuất trường trạng thái: `--query properties.state`.",
      "Định dạng chuỗi sạch: `-o tsv`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server show --resource-group <RG> --name <Server> --query properties.state -o tsv",
      breakdown: [
        { part: "az postgres flexible-server show", role: "Inspection", desc: "Xem chi tiết cấu hình máy chủ PostgreSQL" },
        { part: "--query properties.state", role: "JMESPath Filter", desc: "Trích xuất giá trị trường state trong properties" },
        { part: "-o tsv", role: "Clean String", desc: "Loại bỏ ngoặc kép JSON để so khớp trực tiếp trong script" }
      ]
    },
    parametersExplanation: [
      { param: "--query", meaning: "Biểu thức JMESPath để lọc thuộc tính JSON mong muốn." },
      { param: "-o tsv", meaning: "Định dạng ngõ ra dạng chuỗi thô Tab-Separated Values." }
    ],
    examNotes: "Khi trạng thái trả về là 'Ready', máy chủ đã hoàn tất quá trình cấp phát và sẵn sàng nhận kết nối mạng.",
    simulatedOutput: "Ready"
  },
  {
    id: "l9-create-entra-admin",
    level: 9,
    title: "4. Cấu hình Microsoft Entra Administrator cho Server",
    difficulty: "Trung bình",
    category: "Identity & RBAC",
    mission: "Thiết lập tài khoản người dùng hiện tại làm Microsoft Entra Administrator cho máy chủ PostgreSQL `$env:PG_SERVER` trong RG `$env:RG`. Sử dụng tên hiển thị `$env:USER_UPN`, Object ID `$env:USER_OBJECT_ID` và loại đối tượng là `User`.",
    expectedCommand: "az postgres flexible-server microsoft-entra-admin create --resource-group $env:RG --server-name $env:PG_SERVER --display-name $env:USER_UPN --object-id $env:USER_OBJECT_ID --type User",
    aliases: [
      "az postgres flexible-server microsoft-entra-admin create -g $env:RG --server-name $env:PG_SERVER --display-name $env:USER_UPN --object-id $env:USER_OBJECT_ID --type User",
      "az postgres flexible-server microsoft-entra-admin create --resource-group $env:RG -s $env:PG_SERVER --display-name $env:USER_UPN --object-id $env:USER_OBJECT_ID --type User"
    ],
    tokens: ["az", "postgres", "flexible-server", "microsoft-entra-admin", "create", "--resource-group", "$env:RG", "--server-name", "$env:PG_SERVER", "--display-name", "$env:USER_UPN", "--object-id", "$env:USER_OBJECT_ID", "--type", "User"],
    hints: [
      "Nhóm lệnh quản trị Entra: `az postgres flexible-server microsoft-entra-admin create`.",
      "Chỉ định tên máy chủ bằng cờ `--server-name $env:PG_SERVER`.",
      "Truyền UPN, Object ID và Type: `--display-name $env:USER_UPN --object-id $env:USER_OBJECT_ID --type User`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server microsoft-entra-admin create --resource-group <RG> --server-name <Server> --display-name <UPN> --object-id <OID> --type User",
      breakdown: [
        { part: "az postgres flexible-server microsoft-entra-admin create", role: "Entra Config", desc: "Gán quản trị viên Microsoft Entra ID cấp cao cho máy chủ PostgreSQL" },
        { part: "--server-name", role: "Target Server", desc: "Tên máy chủ Flexible Server nhận cấu hình" },
        { part: "--display-name", role: "User Identity", desc: "Tên đăng nhập UPN của người dùng (email tài khoản Azure)" },
        { part: "--object-id", role: "Security ID", desc: "Định danh duy nhất GUID của đối tượng trong Microsoft Entra ID" }
      ]
    },
    parametersExplanation: [
      { param: "--display-name", meaning: "Tên hiển thị hoặc User Principal Name (UPN) của quản trị viên." },
      { param: "--object-id", meaning: "Mã Object ID (GUID) trong Microsoft Entra tenant." },
      { param: "--type", meaning: "Loại định danh Entra: User hoặc Group hoặc ServicePrincipal." }
    ],
    examNotes: "💡 Điểm thi AI-200: Người dùng được cấu hình làm Entra Administrator sẽ có toàn quyền superuser trong PostgreSQL và có thể đăng nhập bằng access token lấy qua Azure CLI.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-postgresql-lab/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-vector-9e9994d6/administrators/e82b79a1-871d-40a2-b91c-198273645012",
  "name": "e82b79a1-871d-40a2-b91c-198273645012",
  "objectId": "e82b79a1-871d-40a2-b91c-198273645012",
  "principalName": "dugle1605@gmail.com",
  "principalType": "User"
}`
  },
  {
    id: "l9-list-entra-admins",
    level: 9,
    title: "5. Liệt kê Danh sách Microsoft Entra Admins",
    difficulty: "Cơ bản",
    category: "Identity & RBAC",
    mission: "Liệt kê danh sách các quản trị viên Microsoft Entra đã được cấu hình trên máy chủ PostgreSQL `$env:PG_SERVER` trong RG `$env:RG` dưới dạng bảng (table).",
    expectedCommand: "az postgres flexible-server microsoft-entra-admin list --resource-group $env:RG --server-name $env:PG_SERVER -o table",
    aliases: [
      "az postgres flexible-server microsoft-entra-admin list -g $env:RG --server-name $env:PG_SERVER -o table",
      "az postgres flexible-server microsoft-entra-admin list --resource-group $env:RG -s $env:PG_SERVER -o table"
    ],
    tokens: ["az", "postgres", "flexible-server", "microsoft-entra-admin", "list", "--resource-group", "$env:RG", "--server-name", "$env:PG_SERVER", "-o", "table"],
    hints: [
      "Lệnh liệt kê là `az postgres flexible-server microsoft-entra-admin list`.",
      "Chỉ định cờ `--server-name $env:PG_SERVER`.",
      "Định dạng bảng với `-o table`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server microsoft-entra-admin list --resource-group <RG> --server-name <Server> -o table",
      breakdown: [
        { part: "microsoft-entra-admin list", role: "Auditing", desc: "Xem toàn bộ các tài khoản Entra ID đang giữ quyền quản trị viên" },
        { part: "-o table", role: "Presentation", desc: "Xuất dữ liệu dạng bảng dễ đọc" }
      ]
    },
    parametersExplanation: [
      { param: "-o table", meaning: "Hiển thị ngõ ra dưới dạng bảng định dạng trực quan." }
    ],
    examNotes: "Xác thực cấu hình trước khi chuyển sang bước vô hiệu hóa xác thực mật khẩu truyền thống.",
    simulatedOutput: `PrincipalName          ObjectId                              PrincipalType
---------------------  ------------------------------------  ---------------
dugle1605@gmail.com    e82b79a1-871d-40a2-b91c-198273645012  User`
  },
  {
    id: "l9-disable-password-auth",
    level: 9,
    title: "6. Vô hiệu hóa Xác thực Mật khẩu (Zero-Trust Entra Only)",
    difficulty: "Trung bình",
    category: "Security Hardening",
    mission: "Để đảm bảo an toàn tuyệt đối theo mô hình Zero-Trust và loại bỏ hoàn toàn nguy cơ lộ mật khẩu tĩnh, hãy cập nhật máy chủ `$env:PG_SERVER` để giữ bật `--microsoft-entra-auth Enabled` đồng thời vô hiệu hóa xác thực mật khẩu tĩnh (`--password-auth Disabled`) với cờ `--yes`.",
    expectedCommand: "az postgres flexible-server update --resource-group $env:RG --name $env:PG_SERVER --microsoft-entra-auth Enabled --password-auth Disabled --yes",
    aliases: [
      "az postgres flexible-server update -g $env:RG -n $env:PG_SERVER --microsoft-entra-auth Enabled --password-auth Disabled --yes",
      "az postgres flexible-server update --resource-group $env:RG --name $env:PG_SERVER --password-auth Disabled --microsoft-entra-auth Enabled --yes"
    ],
    tokens: ["az", "postgres", "flexible-server", "update", "--resource-group", "$env:RG", "--name", "$env:PG_SERVER", "--microsoft-entra-auth", "Enabled", "--password-auth", "Disabled", "--yes"],
    hints: [
      "Dùng lệnh `az postgres flexible-server update`.",
      "Cờ cấu hình xác thực: `--microsoft-entra-auth Enabled --password-auth Disabled`.",
      "Bỏ qua xác nhận với `--yes`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server update --resource-group <RG> --name <Server> --microsoft-entra-auth Enabled --password-auth Disabled --yes",
      breakdown: [
        { part: "az postgres flexible-server update", role: "Update Configuration", desc: "Cập nhật cấu hình bảo mật máy chủ" },
        { part: "--password-auth Disabled", role: "Zero-Trust Enforcement", desc: "Khóa hoàn toàn cổng đăng nhập bằng username/password cục bộ" },
        { part: "--microsoft-entra-auth Enabled", role: "Identity Access", desc: "Chỉ cho phép đăng nhập qua token định danh Entra ID ngắn hạn" }
      ]
    },
    parametersExplanation: [
      { param: "--password-auth Disabled", meaning: "Ngắt phương thức xác thực bằng mật khẩu tĩnh, ngăn chặn brute-force và rò rỉ credential." }
    ],
    examNotes: "💡 Điểm thi AI-200: Trong môi trường doanh nghiệp an toàn, Azure Database for PostgreSQL nên cấu hình Entra-only authentication.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-postgresql-lab/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-vector-9e9994d6",
  "name": "psql-vector-9e9994d6",
  "state": "Ready",
  "authConfig": {
    "activeDirectoryAuth": "Enabled",
    "passwordAuth": "Disabled"
  }
}`
  },
  {
    id: "l9-create-firewall-rule",
    level: 9,
    title: "7. Tạo Quy tắc Firewall Cho phép Kết nối Mạng",
    difficulty: "Cơ bản",
    category: "Network Security",
    mission: "Tạo quy tắc tường lửa (firewall rule) có tên `AllowAll` trên máy chủ PostgreSQL `$env:PG_SERVER` trong RG `$env:RG` với dải IP từ `0.0.0.0` đến `255.255.255.255` để cho phép môi trường lab và máy trạm lập trình kết nối vào cơ sở dữ liệu.",
    expectedCommand: "az postgres flexible-server firewall-rule create --resource-group $env:RG --server-name $env:PG_SERVER --name AllowAll --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255",
    aliases: [
      "az postgres flexible-server firewall-rule create -g $env:RG --server-name $env:PG_SERVER --name AllowAll --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255",
      "az postgres flexible-server firewall-rule create --resource-group $env:RG -s $env:PG_SERVER --name AllowAll --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255"
    ],
    tokens: ["az", "postgres", "flexible-server", "firewall-rule", "create", "--resource-group", "$env:RG", "--server-name", "$env:PG_SERVER", "--name", "AllowAll", "--start-ip-address", "0.0.0.0", "--end-ip-address", "255.255.255.255"],
    hints: [
      "Nhóm lệnh là `az postgres flexible-server firewall-rule create`.",
      "Tên rule là `--name AllowAll`.",
      "Dải IP chỉ định qua `--start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server firewall-rule create --resource-group <RG> --server-name <Server> --name <RuleName> --start-ip-address <StartIP> --end-ip-address <EndIP>",
      breakdown: [
        { part: "firewall-rule create", role: "Network Opening", desc: "Tạo luật định tuyến tường lửa cho phép dải IP kết nối qua cổng 5432" },
        { part: "--start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255", role: "IP Range", desc: "Cho phép toàn bộ IP kết nối cho môi trường học tập và lab demo" }
      ]
    },
    parametersExplanation: [
      { param: "--start-ip-address", meaning: "Địa chỉ IP bắt đầu của dải mạng được phép truy cập." },
      { param: "--end-ip-address", meaning: "Địa chỉ IP kết thúc của dải mạng." }
    ],
    examNotes: "Trong thực tế sản xuất, bạn nên giới hạn IP cụ thể của ứng dụng hoặc dùng Private Endpoint (VNet Integration).",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-postgresql-lab/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-vector-9e9994d6/firewallRules/AllowAll",
  "name": "AllowAll",
  "startIpAddress": "0.0.0.0",
  "endIpAddress": "255.255.255.255"
}`
  },
  {
    id: "l9-list-firewall-rules",
    level: 9,
    title: "8. Kiểm tra Danh sách Firewall Rules",
    difficulty: "Cơ bản",
    category: "Network Security",
    mission: "Liệt kê tất cả các quy tắc firewall đang hoạt động trên máy chủ PostgreSQL `$env:PG_SERVER` trong RG `$env:RG` dưới dạng bảng (table).",
    expectedCommand: "az postgres flexible-server firewall-rule list --resource-group $env:RG --server-name $env:PG_SERVER -o table",
    aliases: [
      "az postgres flexible-server firewall-rule list -g $env:RG --server-name $env:PG_SERVER -o table",
      "az postgres flexible-server firewall-rule list --resource-group $env:RG -s $env:PG_SERVER -o table"
    ],
    tokens: ["az", "postgres", "flexible-server", "firewall-rule", "list", "--resource-group", "$env:RG", "--server-name", "$env:PG_SERVER", "-o", "table"],
    hints: [
      "Lệnh xem danh sách là `az postgres flexible-server firewall-rule list`.",
      "Chỉ định cờ `--server-name $env:PG_SERVER`.",
      "Xuất bảng với `-o table`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server firewall-rule list --resource-group <RG> --server-name <Server> -o table",
      breakdown: [
        { part: "firewall-rule list", role: "Inspection", desc: "Liệt kê các quy tắc tường lửa hiện hành" },
        { part: "-o table", role: "Format", desc: "Xuất bảng thông tin dải IP được phép" }
      ]
    },
    parametersExplanation: [
      { param: "--server-name", meaning: "Tên máy chủ PostgreSQL Flexible Server cần kiểm tra." }
    ],
    examNotes: "Xác minh quy tắc AllowAll đã tồn tại để tránh lỗi 'Connection timed out' khi kết nối psql.",
    simulatedOutput: `Name      StartIpAddress    EndIpAddress
--------  ----------------  ----------------
AllowAll  0.0.0.0           255.255.255.255`
  },
  {
    id: "l9-allowlist-vector-extension",
    level: 9,
    title: "9. Cấu hình Tham số Cho phép Tiện ích pgvector (azure.extensions)",
    difficulty: "Trung bình",
    category: "Vector Extension Setup",
    mission: "Trong Azure Database for PostgreSQL, extension pgvector không thể bật tự do nếu chưa được cấp phép trong danh sách cho phép (allow-list) cấp server. Hãy cấu hình tham số server `azure.extensions` với giá trị `vector` trên máy chủ `$env:PG_SERVER` trong RG `$env:RG`.",
    expectedCommand: "az postgres flexible-server parameter set --resource-group $env:RG --server-name $env:PG_SERVER --name azure.extensions --value vector",
    aliases: [
      "az postgres flexible-server parameter set -g $env:RG --server-name $env:PG_SERVER --name azure.extensions --value vector",
      "az postgres flexible-server parameter set --resource-group $env:RG -s $env:PG_SERVER --name azure.extensions --value vector",
      "az postgres flexible-server parameter set --resource-group $env:RG --server-name $env:PG_SERVER --name azure.extensions --value \"vector\""
    ],
    tokens: ["az", "postgres", "flexible-server", "parameter", "set", "--resource-group", "$env:RG", "--server-name", "$env:PG_SERVER", "--name", "azure.extensions", "--value", "vector"],
    hints: [
      "Nhóm lệnh tham số: `az postgres flexible-server parameter set`.",
      "Tên tham số cần đặt là `--name azure.extensions`.",
      "Giá trị thiết lập là `--value vector`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server parameter set --resource-group <RG> --server-name <Server> --name azure.extensions --value vector",
      breakdown: [
        { part: "parameter set", role: "Configuration", desc: "Đặt giá trị tham số cấu hình cấp máy chủ PostgreSQL" },
        { part: "--name azure.extensions", role: "Target Parameter", desc: "Tham số kiểm soát danh sách tiện ích mở rộng được phép cài đặt trong Azure PostgreSQL" },
        { part: "--value vector", role: "Allow-list Item", desc: "Cấp quyền cho tiện ích pgvector (lưu trữ và tìm kiếm vector)" }
      ]
    },
    parametersExplanation: [
      { param: "--name azure.extensions", meaning: "Tham số đặc biệt của Azure PostgreSQL quản lý danh mục extension được phép cài đặt." },
      { param: "--value", meaning: "Danh sách extension cho phép, phân tách bằng dấu phẩy nếu có nhiều tiện ích (ví dụ: vector,azure_ai)." }
    ],
    examNotes: "💡 Điểm thi AI-200: Nếu không cấu hình azure.extensions=vector trước, lệnh 'CREATE EXTENSION vector;' trong psql sẽ thất bại với lỗi extension not in allow-list.",
    simulatedOutput: `{
  "name": "azure.extensions",
  "value": "vector",
  "source": "user-override",
  "defaultValue": "",
  "description": "List of extensions to be loaded by the server at startup"
}`
  },
  {
    id: "l9-show-parameter-extension",
    level: 9,
    title: "10. Xác thực Tham số azure.extensions bằng JMESPath",
    difficulty: "Cơ bản",
    category: "Verification",
    mission: "Truy vấn giá trị của tham số máy chủ `azure.extensions` trên `$env:PG_SERVER` trong RG `$env:RG` dưới dạng TSV để xác nhận tiện ích `vector` đã được cho phép thành công.",
    expectedCommand: "az postgres flexible-server parameter show --resource-group $env:RG --server-name $env:PG_SERVER --name azure.extensions --query value -o tsv",
    aliases: [
      "az postgres flexible-server parameter show -g $env:RG --server-name $env:PG_SERVER --name azure.extensions --query value -o tsv",
      "az postgres flexible-server parameter show --resource-group $env:RG -s $env:PG_SERVER --name azure.extensions --query value -o tsv"
    ],
    tokens: ["az", "postgres", "flexible-server", "parameter", "show", "--resource-group", "$env:RG", "--server-name", "$env:PG_SERVER", "--name", "azure.extensions", "--query", "value", "-o", "tsv"],
    hints: [
      "Dùng lệnh `az postgres flexible-server parameter show`.",
      "Chỉ định `--name azure.extensions`.",
      "Lọc trường giá trị bằng `--query value -o tsv`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server parameter show --resource-group <RG> --server-name <Server> --name azure.extensions --query value -o tsv",
      breakdown: [
        { part: "parameter show", role: "Inspection", desc: "Xem chi tiết một tham số cụ thể trên máy chủ" },
        { part: "--query value -o tsv", role: "Output Extraction", desc: "Trích xuất giá trị sạch để kiểm tra xem đã chứa 'vector' chưa" }
      ]
    },
    parametersExplanation: [
      { param: "--name", meaning: "Tên tham số cần kiểm tra (azure.extensions)." }
    ],
    examNotes: "Kết quả mong đợi trả về chuỗi 'vector', chứng minh pgvector đã được allow-list thành công.",
    simulatedOutput: "vector"
  },
  {
    id: "l9-get-access-token",
    level: 9,
    title: "11. Lấy Access Token Entra ID cho PostgreSQL (oss-rdbms)",
    difficulty: "Nâng cao",
    category: "Authentication & Security",
    mission: "Lấy Bearer Access Token từ Microsoft Entra ID dành cho dịch vụ cơ sở dữ liệu quan hệ mã nguồn mở (OSS RDBMS) bằng cách sử dụng cờ `--resource-type oss-rdbms`. Trích xuất trường `accessToken` dưới dạng chuỗi sạch (TSV) để gán làm mật khẩu kết nối `PGPASSWORD`.",
    expectedCommand: "az account get-access-token --resource-type oss-rdbms --query accessToken -o tsv",
    aliases: [
      "az account get-access-token --resource-type oss-rdbms --query \"accessToken\" -o tsv",
      "az account get-access-token --resource-type oss-rdbms -o tsv --query accessToken"
    ],
    tokens: ["az", "account", "get-access-token", "--resource-type", "oss-rdbms", "--query", "accessToken", "-o", "tsv"],
    hints: [
      "Lệnh tài khoản là `az account get-access-token`.",
      "Cờ loại tài nguyên là `--resource-type oss-rdbms`.",
      "Lọc token thô với `--query accessToken -o tsv`."
    ],
    mentalModel: {
      rule: "az account get-access-token --resource-type oss-rdbms --query accessToken -o tsv",
      breakdown: [
        { part: "az account get-access-token", role: "Token Retrieval", desc: "Yêu cầu Microsoft Entra ID phát hành access token" },
        { part: "--resource-type oss-rdbms", role: "Target Audience", desc: "Scope đối tượng dành riêng cho cơ sở dữ liệu OSS RDBMS của Azure (PostgreSQL / MySQL)" },
        { part: "--query accessToken -o tsv", role: "Secret Extraction", desc: "Lấy JWT token sạch để gán vào biến môi trường $env:PGPASSWORD" }
      ]
    },
    parametersExplanation: [
      { param: "--resource-type oss-rdbms", meaning: "Chỉ định scope đối tượng token là https://ossrdbms-aad.database.windows.net/.default." }
    ],
    examNotes: "💡 Điểm thi AI-200: Token này có thời hạn sống khoảng 1 giờ (~60 phút). Khi hết hạn, client ứng dụng hoặc script cần refresh token mới.",
    simulatedOutput: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJa..."
  },
  {
    id: "l9-create-agent-database",
    level: 9,
    title: "12. Tạo Database agent_memory cho Lưu trữ Trạng thái AI Agent",
    difficulty: "Trung bình",
    category: "Database Operations",
    mission: "Tạo một cơ sở dữ liệu mới có tên `agent_memory` trên máy chủ PostgreSQL `$env:PG_SERVER` trong RG `$env:RG` để phục vụ việc lưu trữ lịch sử hội thoại, ngữ cảnh và các điểm checkpoint tác vụ của AI Agent.",
    expectedCommand: "az postgres flexible-server db create --resource-group $env:RG --server-name $env:PG_SERVER --database-name agent_memory",
    aliases: [
      "az postgres flexible-server db create -g $env:RG --server-name $env:PG_SERVER --database-name agent_memory",
      "az postgres flexible-server db create --resource-group $env:RG -s $env:PG_SERVER -d agent_memory",
      "az postgres flexible-server db create --resource-group $env:RG --server-name $env:PG_SERVER -d agent_memory"
    ],
    tokens: ["az", "postgres", "flexible-server", "db", "create", "--resource-group", "$env:RG", "--server-name", "$env:PG_SERVER", "--database-name", "agent_memory"],
    hints: [
      "Nhóm lệnh quản lý database: `az postgres flexible-server db create`.",
      "Chỉ định `--server-name $env:PG_SERVER`.",
      "Tên cơ sở dữ liệu đặt qua `--database-name agent_memory`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server db create --resource-group <RG> --server-name <Server> --database-name <DbName>",
      breakdown: [
        { part: "az postgres flexible-server db create", role: "Database Provisioning", desc: "Tạo database mới bên trong Flexible Server" },
        { part: "--database-name agent_memory", role: "Database Name", desc: "Cơ sở dữ liệu dành riêng cho lưu trữ trí nhớ dài hạn và checkpoint của AI Agent" }
      ]
    },
    parametersExplanation: [
      { param: "--database-name", meaning: "Tên database cần tạo (hỗ trợ chữ thường, số, gạch dưới)." }
    ],
    examNotes: "Việc tách biệt database cho Agent Memory giúp cô lập dữ liệu nghiệp vụ với dữ liệu hội thoại và checkpoint trạng thái của mô hình AI.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-postgresql-lab/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-vector-9e9994d6/databases/agent_memory",
  "name": "agent_memory",
  "charset": "UTF8",
  "collation": "en_US.utf8"
}`
  },
  {
    id: "l9-list-databases",
    level: 9,
    title: "13. Liệt kê Danh sách Database trên Flexible Server",
    difficulty: "Cơ bản",
    category: "Database Operations",
    mission: "Liệt kê toàn bộ các cơ sở dữ liệu đang có trên máy chủ PostgreSQL `$env:PG_SERVER` trong RG `$env:RG` dưới dạng bảng (table).",
    expectedCommand: "az postgres flexible-server db list --resource-group $env:RG --server-name $env:PG_SERVER -o table",
    aliases: [
      "az postgres flexible-server db list -g $env:RG --server-name $env:PG_SERVER -o table",
      "az postgres flexible-server db list --resource-group $env:RG -s $env:PG_SERVER -o table"
    ],
    tokens: ["az", "postgres", "flexible-server", "db", "list", "--resource-group", "$env:RG", "--server-name", "$env:PG_SERVER", "-o", "table"],
    hints: [
      "Dùng lệnh `az postgres flexible-server db list`.",
      "Chỉ định cờ `--server-name $env:PG_SERVER`.",
      "Xuất bảng với `-o table`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server db list --resource-group <RG> --server-name <Server> -o table",
      breakdown: [
        { part: "az postgres flexible-server db list", role: "Inspection", desc: "Xem danh sách cơ sở dữ liệu hiện có" },
        { part: "-o table", role: "Table Format", desc: "Trình bày danh sách dạng bảng trực quan" }
      ]
    },
    parametersExplanation: [
      { param: "-o table", meaning: "Hiển thị ngõ ra dưới dạng bảng định dạng trực quan." }
    ],
    examNotes: "Danh sách bao gồm các database mặc định của hệ thống (postgres, azure_maintenance, azure_sys) và database người dùng vừa tạo (agent_memory).",
    simulatedOutput: `Name               Charset    Collation
-----------------  ---------  -----------
postgres           UTF8       en_US.utf8
azure_maintenance  UTF8       en_US.utf8
azure_sys          UTF8       en_US.utf8
agent_memory       UTF8       en_US.utf8`
  },
  {
    id: "l9-restart-server",
    level: 9,
    title: "14. Khởi động lại PostgreSQL Server để Áp dụng Cấu hình",
    difficulty: "Trung bình",
    category: "Maintenance & Operations",
    mission: "Khởi động lại máy chủ Azure Database for PostgreSQL Flexible Server `$env:PG_SERVER` trong RG `$env:RG` để áp dụng triệt để các tham số hệ thống và tiện ích mở rộng vừa thay đổi.",
    expectedCommand: "az postgres flexible-server restart --resource-group $env:RG --name $env:PG_SERVER",
    aliases: [
      "az postgres flexible-server restart -g $env:RG -n $env:PG_SERVER"
    ],
    tokens: ["az", "postgres", "flexible-server", "restart", "--resource-group", "$env:RG", "--name", "$env:PG_SERVER"],
    hints: [
      "Lệnh khởi động lại là `az postgres flexible-server restart`.",
      "Truyền tham số RG và tên server: `--resource-group $env:RG --name $env:PG_SERVER`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server restart --resource-group <RG> --name <Server>",
      breakdown: [
        { part: "az postgres flexible-server restart", role: "Server Action", desc: "Khởi động lại tiến trình PostgreSQL Flexible Server" }
      ]
    },
    parametersExplanation: [
      { param: "--name", meaning: "Tên máy chủ PostgreSQL Flexible Server cần khởi động lại." }
    ],
    examNotes: "Một số tham số cấp máy chủ yêu cầu khởi động lại (restart) máy chủ mới có hiệu lực hoàn toàn.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-postgresql-lab/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-vector-9e9994d6",
  "name": "psql-vector-9e9994d6",
  "state": "Ready"
}`
  },
  {
    id: "l9-cleanup-server",
    level: 9,
    title: "15. Dọn dẹp & Xóa Máy chủ PostgreSQL Flexible Server",
    difficulty: "Cơ bản",
    category: "Cleanup",
    mission: "Sau khi hoàn thành bài lab kiểm thử hiệu năng vector và AI agent memory, hãy xóa máy chủ PostgreSQL `$env:PG_SERVER` trong RG `$env:RG` với cờ `--yes` để giải phóng toàn bộ tài nguyên cloud.",
    expectedCommand: "az postgres flexible-server delete --resource-group $env:RG --name $env:PG_SERVER --yes",
    aliases: [
      "az postgres flexible-server delete -g $env:RG -n $env:PG_SERVER --yes",
      "az postgres flexible-server delete --resource-group $env:RG --name $env:PG_SERVER -y"
    ],
    tokens: ["az", "postgres", "flexible-server", "delete", "--resource-group", "$env:RG", "--name", "$env:PG_SERVER", "--yes"],
    hints: [
      "Dùng lệnh `az postgres flexible-server delete`.",
      "Truyền cờ tự động đồng ý: `--yes`."
    ],
    mentalModel: {
      rule: "az postgres flexible-server delete --resource-group <RG> --name <Server> --yes",
      breakdown: [
        { part: "az postgres flexible-server delete", role: "Destruction Action", desc: "Hủy bỏ và xóa hoàn toàn máy chủ PostgreSQL cùng toàn bộ dữ liệu" },
        { part: "--yes", role: "Auto Confirm", desc: "Bỏ qua yêu cầu gõ xác nhận để chạy mượt mà trong kịch bản CI/CD" }
      ]
    },
    parametersExplanation: [
      { param: "--yes", meaning: "Xác nhận xóa tài nguyên không cần hiển thị prompt cảnh báo." }
    ],
    examNotes: "Xóa tài nguyên sau khi hoàn thành thực hành giúp ngăn ngừa chi phí phát sinh không mong muốn.",
    simulatedOutput: ""
  }
,
  // ==========================================
  // LEVEL 10: AZURE MANAGED REDIS (AMR) & REDISEARCH
  // ==========================================
  {
    id: "l10-register-provider",
    level: 10,
    title: "1. Đăng ký Resource Provider Microsoft.Cache",
    difficulty: "Cơ bản",
    category: "Pre-flight & Provider Setup",
    mission: "Trước khi tạo cụm Azure Managed Redis (AMR) hoặc Redis Enterprise, subscription cần phải đăng ký Resource Provider `Microsoft.Cache`. Hãy chạy lệnh Azure CLI để kích hoạt việc đăng ký provider này.",
    expectedCommand: "az provider register --namespace Microsoft.Cache",
    aliases: [
      "az provider register -n Microsoft.Cache"
    ],
    tokens: ["az", "provider", "register", "--namespace", "Microsoft.Cache"],
    hints: [
      "Nhóm lệnh `az provider`.",
      "Hành động là `register`.",
      "Tham số `--namespace Microsoft.Cache`."
    ],
    mentalModel: {
      rule: "az provider register --namespace <Namespace>",
      breakdown: [
        { part: "az provider register", role: "Registration Action", desc: "Đăng ký resource provider dịch vụ bộ đệm in-memory trên Azure" },
        { part: "--namespace Microsoft.Cache", role: "Target Namespace", desc: "Namespace cung cấp Azure Managed Redis và Azure Cache for Redis" }
      ]
    },
    parametersExplanation: [
      { param: "--namespace", meaning: "Tên namespace nhà cung cấp tài nguyên đám mây Azure (Microsoft.Cache)." }
    ],
    examNotes: "💡 Điểm thi AI-200: Nếu subscription chưa đăng ký Microsoft.Cache, việc khởi tạo Redis Enterprise cluster sẽ trả về lỗi ProviderNotRegistered.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/providers/Microsoft.Cache",
  "namespace": "Microsoft.Cache",
  "registrationPolicy": "RegistrationRequired",
  "registrationState": "Registering"
}`
  },
  {
    id: "l10-create-redis-cluster",
    level: 10,
    title: "2. Khởi tạo Azure Managed Redis Enterprise Cluster",
    difficulty: "Nâng cao",
    category: "Resource Provisioning",
    mission: "Tạo cụm Azure Managed Redis mang tên `$env:REDIS_NAME` trong Resource Group `$env:RG`, vị trí `$env:LOCATION`. Sử dụng SKU `Balanced_B0`, cho phép truy cập mạng công cộng (`--public-network-access Enabled`) và hoãn tạo database ban đầu (`--no-database`) để cấu hình tùy chỉnh ở bước sau.",
    expectedCommand: "az redisenterprise create --resource-group $env:RG --name $env:REDIS_NAME --location $env:LOCATION --sku Balanced_B0 --public-network-access Enabled --no-database",
    aliases: [
      "az redisenterprise create -g $env:RG -n $env:REDIS_NAME -l $env:LOCATION --sku Balanced_B0 --public-network-access Enabled --no-database",
      "az redisenterprise create --resource-group $env:RG --name $env:REDIS_NAME --location $env:LOCATION --sku Balanced_B0 --no-database --public-network-access Enabled"
    ],
    tokens: ["az", "redisenterprise", "create", "--resource-group", "$env:RG", "--name", "$env:REDIS_NAME", "--location", "$env:LOCATION", "--sku", "Balanced_B0", "--public-network-access", "Enabled", "--no-database"],
    hints: [
      "Nhóm lệnh Azure Managed Redis là `az redisenterprise create`.",
      "Chỉ định SKU là `Balanced_B0` (dòng Balanced cho workloads AI/vector).",
      "Mở truy cập công cộng với `--public-network-access Enabled`.",
      "Thêm cờ `--no-database` để tạo cluster trước mà chưa khởi tạo DB mặc định."
    ],
    mentalModel: {
      rule: "az redisenterprise create --resource-group <RG> --name <Name> --location <Region> --sku Balanced_B0 --public-network-access Enabled --no-database",
      breakdown: [
        { part: "az redisenterprise create", role: "Cluster Provisioning", desc: "Tạo cụm hạ tầng phần cứng Azure Managed Redis Enterprise" },
        { part: "--sku Balanced_B0", role: "Compute Tier", desc: "Dòng SKU cân bằng bộ nhớ RAM và CPU, hỗ trợ đầy đủ RediSearch & Vector Search" },
        { part: "--no-database", role: "Two-step Setup", desc: "Tách biệt việc dựng cụm và cấu hình database chuyên sâu (port, protocol, eviction)" }
      ]
    },
    parametersExplanation: [
      { param: "--sku", meaning: "Tên SKU của Azure Managed Redis: Balanced (B0-B1000), MemoryOptimized, hoặc ComputeOptimized." },
      { param: "--no-database", meaning: "Tạo cụm rỗng không tạo cơ sở dữ liệu mặc định." }
    ],
    examNotes: "Azure Managed Redis (AMR) là phiên bản thế hệ mới thay thế Azure Cache for Redis truyền thống, tích hợp sẵn RediSearch và RedisJSON trong bộ nhớ RAM tốc độ cao.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-redis-lab/providers/Microsoft.Cache/redisEnterprise/amr-exercise-9e9994d6",
  "name": "amr-exercise-9e9994d6",
  "location": "southeastasia",
  "sku": {
    "name": "Balanced_B0",
    "capacity": 2
  },
  "provisioningState": "Creating",
  "resourceState": "Creating"
}`
  },
  {
    id: "l10-show-cluster-state",
    level: 10,
    title: "3. Kiểm tra Trạng thái Cụm AMR (provisioningState)",
    difficulty: "Cơ bản",
    category: "Health & Monitoring",
    mission: "Truy vấn thuộc tính `provisioningState` của cụm Azure Managed Redis `$env:REDIS_NAME` trong RG `$env:RG` dưới dạng chuỗi sạch (TSV) để kiểm tra xem cụm đã chuyển sang trạng thái 'Succeeded' hay chưa.",
    expectedCommand: "az redisenterprise show --resource-group $env:RG --name $env:REDIS_NAME --query provisioningState -o tsv",
    aliases: [
      "az redisenterprise show -g $env:RG -n $env:REDIS_NAME --query provisioningState -o tsv",
      "az redisenterprise show --resource-group $env:RG --name $env:REDIS_NAME --query \"provisioningState\" -o tsv"
    ],
    tokens: ["az", "redisenterprise", "show", "--resource-group", "$env:RG", "--name", "$env:REDIS_NAME", "--query", "provisioningState", "-o", "tsv"],
    hints: [
      "Lệnh xem thông tin cụm là `az redisenterprise show`.",
      "Trích xuất trường trạng thái: `--query provisioningState`.",
      "Định dạng chuỗi sạch: `-o tsv`."
    ],
    mentalModel: {
      rule: "az redisenterprise show --resource-group <RG> --name <Name> --query provisioningState -o tsv",
      breakdown: [
        { part: "az redisenterprise show", role: "Cluster Inspection", desc: "Xem chi tiết cụm Redis Enterprise" },
        { part: "--query provisioningState -o tsv", role: "JMESPath Filter", desc: "Lấy chuỗi trạng thái cấp phát (Succeeded/Creating/Failed)" }
      ]
    },
    parametersExplanation: [
      { param: "--query", meaning: "Trích xuất giá trị trường JSON mong muốn." },
      { param: "-o tsv", meaning: "Trả về giá trị thô không kèm dấu ngoặc kép." }
    ],
    examNotes: "Cụm AMR mất khoảng 5-10 phút để hoàn tất khởi tạo. Chỉ tiếp tục tạo database khi trạng thái đạt 'Succeeded'.",
    simulatedOutput: "Succeeded"
  },
  {
    id: "l10-create-database",
    level: 10,
    title: "4. Khởi tạo Database với Mã hóa TLS & Chính sách Eviction AllKeysLRU",
    difficulty: "Nâng cao",
    category: "Database Configuration",
    mission: "Khởi tạo database mặc định cho cụm `$env:REDIS_NAME` trong RG `$env:RG`. Cấu hình giao thức client mã hóa TLS (`--client-protocol Encrypted`), chính sách clustering `NoCluster`, chính sách giải phóng bộ nhớ LRU khi đầy (`--eviction-policy AllKeysLRU`) và cổng kết nối tiêu chuẩn `10000`.",
    expectedCommand: "az redisenterprise database create --resource-group $env:RG --cluster-name $env:REDIS_NAME --client-protocol Encrypted --clustering-policy NoCluster --eviction-policy AllKeysLRU --port 10000",
    aliases: [
      "az redisenterprise database create -g $env:RG --cluster-name $env:REDIS_NAME --client-protocol Encrypted --clustering-policy NoCluster --eviction-policy AllKeysLRU --port 10000",
      "az redisenterprise database create --resource-group $env:RG --cluster $env:REDIS_NAME --client-protocol Encrypted --clustering-policy NoCluster --eviction-policy AllKeysLRU --port 10000"
    ],
    tokens: ["az", "redisenterprise", "database", "create", "--resource-group", "$env:RG", "--cluster-name", "$env:REDIS_NAME", "--client-protocol", "Encrypted", "--clustering-policy", "NoCluster", "--eviction-policy", "AllKeysLRU", "--port", "10000"],
    hints: [
      "Nhóm lệnh tạo database: `az redisenterprise database create`.",
      "Chỉ định tên cụm bằng `--cluster-name $env:REDIS_NAME`.",
      "Mã hóa TLS: `--client-protocol Encrypted`.",
      "Chính sách LRU và cổng: `--eviction-policy AllKeysLRU --port 10000`."
    ],
    mentalModel: {
      rule: "az redisenterprise database create --resource-group <RG> --cluster-name <Cluster> --client-protocol Encrypted --clustering-policy NoCluster --eviction-policy AllKeysLRU --port 10000",
      breakdown: [
        { part: "database create", role: "Database Provisioning", desc: "Khởi tạo database trong cụm Redis Enterprise" },
        { part: "--client-protocol Encrypted", role: "Transport Security", desc: "Bắt buộc mã hóa toàn bộ dữ liệu truyền qua mạng bằng TLS/SSL" },
        { part: "--port 10000", role: "Standard AMR Port", desc: "Cổng TCP chuẩn của Azure Managed Redis (khác cổng 6379 của Redis mã nguồn mở)" },
        { part: "--eviction-policy AllKeysLRU", role: "Memory Management", desc: "Tự động thu hồi các key ít truy cập nhất khi bộ nhớ RAM đạt giới hạn" }
      ]
    },
    parametersExplanation: [
      { param: "--port 10000", meaning: "Cổng lắng nghe kết nối client của Azure Managed Redis." },
      { param: "--eviction-policy", meaning: "Chính sách giải phóng bộ nhớ khi cache bị đầy: AllKeysLRU, VolatileLRU, NoEviction, AllKeysLFU, v.v." }
    ],
    examNotes: "💡 Điểm thi AI-200: Azure Managed Redis luôn sử dụng cổng 10000 với kết nối mã hóa Encrypted TLS/SSL.",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-redis-lab/providers/Microsoft.Cache/redisEnterprise/amr-exercise-9e9994d6/databases/default",
  "name": "default",
  "clientProtocol": "Encrypted",
  "clusteringPolicy": "NoCluster",
  "evictionPolicy": "AllKeysLRU",
  "port": 10000,
  "provisioningState": "Creating"
}`
  },
  {
    id: "l10-show-database-state",
    level: 10,
    title: "5. Kiểm tra Trạng thái Khởi tạo Database",
    difficulty: "Cơ bản",
    category: "Health & Monitoring",
    mission: "Kiểm tra thuộc tính `provisioningState` của database trên cụm `$env:REDIS_NAME` trong RG `$env:RG` để đảm bảo cơ sở dữ liệu in-memory đã ở trạng thái 'Succeeded'.",
    expectedCommand: "az redisenterprise database show --resource-group $env:RG --cluster-name $env:REDIS_NAME --query provisioningState -o tsv",
    aliases: [
      "az redisenterprise database show -g $env:RG --cluster-name $env:REDIS_NAME --query provisioningState -o tsv",
      "az redisenterprise database show --resource-group $env:RG --cluster $env:REDIS_NAME --query provisioningState -o tsv"
    ],
    tokens: ["az", "redisenterprise", "database", "show", "--resource-group", "$env:RG", "--cluster-name", "$env:REDIS_NAME", "--query", "provisioningState", "-o", "tsv"],
    hints: [
      "Lệnh xem database: `az redisenterprise database show`.",
      "Chỉ định cờ `--cluster-name $env:REDIS_NAME`.",
      "Lọc thuộc tính: `--query provisioningState -o tsv`."
    ],
    mentalModel: {
      rule: "az redisenterprise database show --resource-group <RG> --cluster-name <Cluster> --query provisioningState -o tsv",
      breakdown: [
        { part: "database show", role: "Database Inspection", desc: "Xem thuộc tính của cơ sở dữ liệu mặc định trong cụm" },
        { part: "--query provisioningState -o tsv", role: "State Check", desc: "Xác minh trạng thái sẵn sàng nhận kết nối client" }
      ]
    },
    parametersExplanation: [
      { param: "--cluster-name", meaning: "Tên cụm Redis Enterprise chứa database cần kiểm tra." }
    ],
    examNotes: "Database ở trạng thái 'Succeeded' đồng nghĩa các module RediSearch và công cụ lưu trữ in-memory đã sẵn sàng.",
    simulatedOutput: "Succeeded"
  },
  {
    id: "l10-assign-access-policy",
    level: 10,
    title: "6. Gán Chính sách Truy cập Microsoft Entra ID cho Người dùng",
    difficulty: "Trung bình",
    category: "Identity & RBAC",
    mission: "Cấp quyền xác thực qua Microsoft Entra ID cho tài khoản người dùng hiện tại (`$env:USER_OBJECT_ID`) trên database `default` của cụm `$env:REDIS_NAME` trong RG `$env:RG`. Đặt tên phân quyền là `useraccess` với chính sách truy cập `default`.",
    expectedCommand: "az redisenterprise database access-policy-assignment create --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default --access-policy-assignment-name useraccess --access-policy-name default --object-id $env:USER_OBJECT_ID",
    aliases: [
      "az redisenterprise database access-policy-assignment create -g $env:RG --cluster-name $env:REDIS_NAME --database-name default --access-policy-assignment-name useraccess --access-policy-name default --object-id $env:USER_OBJECT_ID"
    ],
    tokens: ["az", "redisenterprise", "database", "access-policy-assignment", "create", "--resource-group", "$env:RG", "--cluster-name", "$env:REDIS_NAME", "--database-name", "default", "--access-policy-assignment-name", "useraccess", "--access-policy-name", "default", "--object-id", "$env:USER_OBJECT_ID"],
    hints: [
      "Lệnh gán quyền: `az redisenterprise database access-policy-assignment create`.",
      "Tên assignment: `--access-policy-assignment-name useraccess`.",
      "Chính sách truy cập: `--access-policy-name default`.",
      "Object ID người dùng: `--object-id $env:USER_OBJECT_ID`."
    ],
    mentalModel: {
      rule: "az redisenterprise database access-policy-assignment create --resource-group <RG> --cluster-name <Cluster> --database-name default --access-policy-assignment-name <Assignment> --access-policy-name default --object-id <OID>",
      breakdown: [
        { part: "access-policy-assignment create", role: "Identity Policy", desc: "Gán quyền truy cập dữ liệu Redis dựa trên định danh Microsoft Entra ID" },
        { part: "--access-policy-name default", role: "Built-in Policy", desc: "Chính sách quyền mặc định cho phép đầy đủ thao tác đọc/ghi dữ liệu" },
        { part: "--object-id", role: "Entra Principal", desc: "Mã GUID định danh của người dùng hoặc Managed Identity" }
      ]
    },
    parametersExplanation: [
      { param: "--access-policy-name", meaning: "Tên chính sách truy cập Redis ACL (Access Control List): default, read-only, v.v." },
      { param: "--object-id", meaning: "Object ID của thực thể Microsoft Entra ID (User, Group, Service Principal, Managed Identity)." }
    ],
    examNotes: "💡 Điểm thi AI-200: Microsoft khuyến nghị xác thực Entra ID cho Redis để loại bỏ hoàn toàn Access Keys tĩnh (Passwordless Security).",
    simulatedOutput: `{
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-redis-lab/providers/Microsoft.Cache/redisEnterprise/amr-exercise-9e9994d6/databases/default/accessPolicyAssignments/useraccess",
  "name": "useraccess",
  "accessPolicyName": "default",
  "objectId": "e82b79a1-871d-40a2-b91c-198273645012",
  "provisioningState": "Succeeded"
}`
  },
  {
    id: "l10-show-access-policy",
    level: 10,
    title: "7. Kiểm tra Chi tiết Phân quyền Access Policy Assignment",
    difficulty: "Cơ bản",
    category: "Identity & RBAC",
    mission: "Xem chi tiết cấu hình phân quyền Entra ID `useraccess` trên database `default` của cụm `$env:REDIS_NAME` trong RG `$env:RG` dưới dạng JSON.",
    expectedCommand: "az redisenterprise database access-policy-assignment show --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default --access-policy-assignment-name useraccess -o json",
    aliases: [
      "az redisenterprise database access-policy-assignment show -g $env:RG --cluster-name $env:REDIS_NAME --database-name default --access-policy-assignment-name useraccess -o json"
    ],
    tokens: ["az", "redisenterprise", "database", "access-policy-assignment", "show", "--resource-group", "$env:RG", "--cluster-name", "$env:REDIS_NAME", "--database-name", "default", "--access-policy-assignment-name", "useraccess", "-o", "json"],
    hints: [
      "Lệnh kiểm tra: `az redisenterprise database access-policy-assignment show`.",
      "Chỉ định cờ `--access-policy-assignment-name useraccess`.",
      "Định dạng JSON với `-o json`."
    ],
    mentalModel: {
      rule: "az redisenterprise database access-policy-assignment show --resource-group <RG> --cluster-name <Cluster> --database-name default --access-policy-assignment-name useraccess -o json",
      breakdown: [
        { part: "access-policy-assignment show", role: "Inspection", desc: "Xem chi tiết phân quyền ACL hiện tại" },
        { part: "-o json", role: "Output Format", desc: "Xuất cấu trúc phân quyền dạng JSON" }
      ]
    },
    parametersExplanation: [
      { param: "--access-policy-assignment-name", meaning: "Tên định danh của lượt gán quyền truy cập (useraccess)." }
    ],
    examNotes: "Xác nhận trạng thái provisioningState là Succeeded trước khi cho ứng dụng kết nối.",
    simulatedOutput: `{
  "accessPolicyName": "default",
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-redis-lab/providers/Microsoft.Cache/redisEnterprise/amr-exercise-9e9994d6/databases/default/accessPolicyAssignments/useraccess",
  "name": "useraccess",
  "objectId": "e82b79a1-871d-40a2-b91c-198273645012",
  "provisioningState": "Succeeded",
  "type": "Microsoft.Cache/redisEnterprise/databases/accessPolicyAssignments"
}`
  },
  {
    id: "l10-get-hostname",
    level: 10,
    title: "8. Lấy Endpoint Hostname Kết nối Redis",
    difficulty: "Cơ bản",
    category: "Connection Information",
    mission: "Trích xuất địa chỉ FQDN hostname kết nối của cụm Azure Managed Redis `$env:REDIS_NAME` trong RG `$env:RG` dưới dạng TSV để gán vào biến môi trường `$env:REDIS_HOST`.",
    expectedCommand: "az redisenterprise show --resource-group $env:RG --name $env:REDIS_NAME --query hostName -o tsv",
    aliases: [
      "az redisenterprise show -g $env:RG -n $env:REDIS_NAME --query hostName -o tsv",
      "az redisenterprise show --resource-group $env:RG --name $env:REDIS_NAME --query \"hostName\" -o tsv"
    ],
    tokens: ["az", "redisenterprise", "show", "--resource-group", "$env:RG", "--name", "$env:REDIS_NAME", "--query", "hostName", "-o", "tsv"],
    hints: [
      "Lệnh xem cụm: `az redisenterprise show`.",
      "Lọc thuộc tính: `--query hostName`.",
      "Xuất chuỗi sạch: `-o tsv`."
    ],
    mentalModel: {
      rule: "az redisenterprise show --resource-group <RG> --name <Name> --query hostName -o tsv",
      breakdown: [
        { part: "az redisenterprise show", role: "Cluster Details", desc: "Xem thông tin máy chủ cụm Redis" },
        { part: "--query hostName -o tsv", role: "Endpoint Extraction", desc: "Lấy chuỗi hostname FQDN không chứa dấu nháy kép để ứng dụng Python kết nối" }
      ]
    },
    parametersExplanation: [
      { param: "--query hostName", meaning: "Địa chỉ hostname miền FQDN dạng <cache-name>.<region>.redisenterprise.cache.azure.net." }
    ],
    examNotes: "💡 Điểm thi AI-200: FQDN của Azure Managed Redis có dạng `<name>.<region>.redisenterprise.cache.azure.net` (khác với `<name>.redis.cache.windows.net` của thế hệ cũ).",
    simulatedOutput: "amr-exercise-9e9994d6.southeastasia.redisenterprise.cache.azure.net"
  },
  {
    id: "l10-list-access-policies",
    level: 10,
    title: "9. Liệt kê Toàn bộ Access Policy Assignments trên Database",
    difficulty: "Cơ bản",
    category: "Identity & Auditing",
    mission: "Liệt kê danh sách tất cả các chính sách truy cập định danh Entra ID đã gán trên database `default` của cụm `$env:REDIS_NAME` trong RG `$env:RG` dưới dạng bảng.",
    expectedCommand: "az redisenterprise database access-policy-assignment list --resource-group $env:RG --cluster-name $env:REDIS_NAME --database-name default -o table",
    aliases: [
      "az redisenterprise database access-policy-assignment list -g $env:RG --cluster-name $env:REDIS_NAME --database-name default -o table"
    ],
    tokens: ["az", "redisenterprise", "database", "access-policy-assignment", "list", "--resource-group", "$env:RG", "--cluster-name", "$env:REDIS_NAME", "--database-name", "default", "-o", "table"],
    hints: [
      "Nhóm lệnh liệt kê: `az redisenterprise database access-policy-assignment list`.",
      "Chỉ định `--cluster-name $env:REDIS_NAME --database-name default`.",
      "Xuất dạng bảng: `-o table`."
    ],
    mentalModel: {
      rule: "az redisenterprise database access-policy-assignment list --resource-group <RG> --cluster-name <Cluster> --database-name default -o table",
      breakdown: [
        { part: "access-policy-assignment list", role: "Auditing", desc: "Kiểm tra toàn bộ phân quyền định danh đang có hiệu lực trên database" }
      ]
    },
    parametersExplanation: [
      { param: "-o table", meaning: "Trình bày danh sách định dạng bảng." }
    ],
    examNotes: "Giúp xác minh nhanh xem người dùng hoặc Managed Identity đã được cấp quyền thành công hay chưa.",
    simulatedOutput: `Name        AccessPolicyName  ObjectId                              ProvisioningState
----------  ----------------  ------------------------------------  -------------------
useraccess  default           e82b79a1-871d-40a2-b91c-198273645012  Succeeded`
  },
  {
    id: "l10-update-eviction-policy",
    level: 10,
    title: "10. Cập nhật Chính sách Eviction sang VolatileLRU",
    difficulty: "Trung bình",
    category: "Performance & Memory Tuning",
    mission: "Thay đổi chính sách giải phóng bộ nhớ của database trên cụm `$env:REDIS_NAME` trong RG `$env:RG` sang `VolatileLRU` để Redis chỉ thu hồi các key có thiết lập thời gian hết hạn (TTL).",
    expectedCommand: "az redisenterprise database update --resource-group $env:RG --cluster-name $env:REDIS_NAME --eviction-policy VolatileLRU",
    aliases: [
      "az redisenterprise database update -g $env:RG --cluster-name $env:REDIS_NAME --eviction-policy VolatileLRU"
    ],
    tokens: ["az", "redisenterprise", "database", "update", "--resource-group", "$env:RG", "--cluster-name", "$env:REDIS_NAME", "--eviction-policy", "VolatileLRU"],
    hints: [
      "Lệnh cập nhật database: `az redisenterprise database update`.",
      "Chỉ định cờ `--eviction-policy VolatileLRU`."
    ],
    mentalModel: {
      rule: "az redisenterprise database update --resource-group <RG> --cluster-name <Cluster> --eviction-policy VolatileLRU",
      breakdown: [
        { part: "database update", role: "Configuration Update", desc: "Cập nhật tham số động của database in-memory" },
        { part: "--eviction-policy VolatileLRU", role: "Eviction Rule", desc: "Chỉ giải phóng các key có TTL (expire) khi bộ nhớ đầy, bảo vệ các key vĩnh viễn" }
      ]
    },
    parametersExplanation: [
      { param: "--eviction-policy VolatileLRU", meaning: "LRU (Least Recently Used) chỉ áp dụng cho tập hợp các key có cài đặt thời gian sống TTL." }
    ],
    examNotes: "Sự khác biệt: `AllKeysLRU` loại bỏ bất kỳ key nào ít dùng; `VolatileLRU` chỉ loại bỏ key có TTL; `NoEviction` báo lỗi khi hết RAM.",
    simulatedOutput: `{
  "clientProtocol": "Encrypted",
  "clusteringPolicy": "NoCluster",
  "evictionPolicy": "VolatileLRU",
  "port": 10000,
  "provisioningState": "Succeeded"
}`
  },
  {
    id: "l10-flush-database",
    level: 10,
    title: "11. Xóa Sạch Dữ liệu Cache Database (Flush)",
    difficulty: "Cơ bản",
    category: "Maintenance & Operations",
    mission: "Dọn dẹp nhanh toàn bộ các key và dữ liệu in-memory trong database của cụm `$env:REDIS_NAME` trong RG `$env:RG` với cờ `--yes` để phục vụ chạy test suite mới.",
    expectedCommand: "az redisenterprise database flush --resource-group $env:RG --cluster-name $env:REDIS_NAME --yes",
    aliases: [
      "az redisenterprise database flush -g $env:RG --cluster-name $env:REDIS_NAME --yes",
      "az redisenterprise database flush --resource-group $env:RG --cluster $env:REDIS_NAME -y"
    ],
    tokens: ["az", "redisenterprise", "database", "flush", "--resource-group", "$env:RG", "--cluster-name", "$env:REDIS_NAME", "--yes"],
    hints: [
      "Lệnh flush database: `az redisenterprise database flush`.",
      "Chỉ định `--cluster-name $env:REDIS_NAME`.",
      "Bỏ qua xác nhận với cờ `--yes`."
    ],
    mentalModel: {
      rule: "az redisenterprise database flush --resource-group <RG> --cluster-name <Cluster> --yes",
      breakdown: [
        { part: "database flush", role: "Purge Action", desc: "Tương đương lệnh FLUSHDB của Redis, xóa sạch toàn bộ key trong RAM" },
        { part: "--yes", role: "Confirmation", desc: "Tự động đồng ý mà không hỏi lại" }
      ]
    },
    parametersExplanation: [
      { param: "--yes", meaning: "Tự động đồng ý xóa toàn bộ dữ liệu trong database." }
    ],
    examNotes: "Thao tác không thể hoàn tác; chỉ sử dụng trong môi trường dev/lab hoặc khi cần reset sạch cache.",
    simulatedOutput: ""
  },
  {
    id: "l10-force-unlink",
    level: 10,
    title: "12. Force-unlink Tái khởi động Nút Cơ sở Dữ liệu",
    difficulty: "Trung bình",
    category: "Troubleshooting & High Availability",
    mission: "Chủ động tách hoặc tái khởi động phân vùng database node với ID `0` trên cụm `$env:REDIS_NAME` trong RG `$env:RG` để giải phóng kết nối bị treo hoặc kiểm thử tính chịu lỗi (Failover) với cờ `--yes`.",
    expectedCommand: "az redisenterprise database force-unlink --resource-group $env:RG --cluster-name $env:REDIS_NAME --unlink-ids 0 --yes",
    aliases: [
      "az redisenterprise database force-unlink -g $env:RG --cluster-name $env:REDIS_NAME --unlink-ids 0 --yes"
    ],
    tokens: ["az", "redisenterprise", "database", "force-unlink", "--resource-group", "$env:RG", "--cluster-name", "$env:REDIS_NAME", "--unlink-ids", "0", "--yes"],
    hints: [
      "Lệnh xử lý sự cố node: `az redisenterprise database force-unlink`.",
      "Chỉ định ID phân vùng node cần unlink: `--unlink-ids 0`.",
      "Bỏ qua xác nhận: `--yes`."
    ],
    mentalModel: {
      rule: "az redisenterprise database force-unlink --resource-group <RG> --cluster-name <Cluster> --unlink-ids <IDs> --yes",
      breakdown: [
        { part: "database force-unlink", role: "Cluster Remediation", desc: "Ngắt kết nối cưỡng bức một shard/node đang gặp sự cố" },
        { part: "--unlink-ids 0", role: "Target Shard", desc: "Định danh shard/node cần thao tác" }
      ]
    },
    parametersExplanation: [
      { param: "--unlink-ids", meaning: "Danh sách các phân vùng database ID cần tách khỏi cụm." }
    ],
    examNotes: "Dùng để khôi phục cụm khi có một node bị treo hoặc mất đồng bộ trong mô hình Active-Active Geo-Replication.",
    simulatedOutput: ""
  },
  {
    id: "l10-show-cluster-summary",
    level: 10,
    title: "13. Lọc Tổng quan Cấu hình Cụm AMR bằng JMESPath Multi-hash",
    difficulty: "Trung bình",
    category: "Monitoring & Reporting",
    mission: "Trích xuất thông tin tổng hợp gồm SKU, hostname, trạng thái và phiên bản Redis của cụm `$env:REDIS_NAME` trong RG `$env:RG` dưới dạng JSON gọn gàng.",
    expectedCommand: "az redisenterprise show --resource-group $env:RG --name $env:REDIS_NAME --query \"{sku:sku.name, host:hostName, status:provisioningState, redisVersion:redisVersion}\" -o json",
    aliases: [
      "az redisenterprise show -g $env:RG -n $env:REDIS_NAME --query \"{sku:sku.name, host:hostName, status:provisioningState, redisVersion:redisVersion}\" -o json",
      "az redisenterprise show --resource-group $env:RG --name $env:REDIS_NAME --query '{sku:sku.name, host:hostName, status:provisioningState, redisVersion:redisVersion}' -o json"
    ],
    tokens: ["az", "redisenterprise", "show", "--resource-group", "$env:RG", "--name", "$env:REDIS_NAME", "--query", "{sku:sku.name, host:hostName, status:provisioningState, redisVersion:redisVersion}", "-o", "json"],
    hints: [
      "Dùng lệnh `az redisenterprise show`.",
      "Sử dụng cú pháp Multi-hash Projection: `--query \"{sku:sku.name, host:hostName, status:provisioningState, redisVersion:redisVersion}\"`.",
      "Định dạng ngõ ra là `-o json`."
    ],
    mentalModel: {
      rule: "az redisenterprise show --resource-group <RG> --name <Name> --query \"{field1:path1, field2:path2}\" -o json",
      breakdown: [
        { part: "JMESPath Multi-hash", role: "Projection", desc: "Tái cấu trúc phản hồi JSON phức tạp thành đối tượng đơn giản chỉ chứa các trường cần thiết" }
      ]
    },
    parametersExplanation: [
      { param: "--query {key:path}", meaning: "Cú pháp Multi-hash Projection trong JMESPath gom nhóm các trường tùy chọn." }
    ],
    examNotes: "Kỹ năng lọc dữ liệu JSON bằng JMESPath là câu hỏi thường xuyên xuất hiện trong bài thi thực hành AI-200.",
    simulatedOutput: `{
  "host": "amr-exercise-9e9994d6.southeastasia.redisenterprise.cache.azure.net",
  "redisVersion": "7.2",
  "sku": "Balanced_B0",
  "status": "Succeeded"
}`
  },
  {
    id: "l10-delete-database",
    level: 10,
    title: "14. Xóa Database trên Cụm Azure Managed Redis",
    difficulty: "Cơ bản",
    category: "Cleanup",
    mission: "Hủy bỏ cơ sở dữ liệu `default` trên cụm `$env:REDIS_NAME` trong RG `$env:RG` với cờ `--yes`.",
    expectedCommand: "az redisenterprise database delete --resource-group $env:RG --cluster-name $env:REDIS_NAME --yes",
    aliases: [
      "az redisenterprise database delete -g $env:RG --cluster-name $env:REDIS_NAME --yes",
      "az redisenterprise database delete --resource-group $env:RG --cluster $env:REDIS_NAME -y"
    ],
    tokens: ["az", "redisenterprise", "database", "delete", "--resource-group", "$env:RG", "--cluster-name", "$env:REDIS_NAME", "--yes"],
    hints: [
      "Lệnh xóa database: `az redisenterprise database delete`.",
      "Chỉ định `--cluster-name $env:REDIS_NAME`.",
      "Tự động xác nhận: `--yes`."
    ],
    mentalModel: {
      rule: "az redisenterprise database delete --resource-group <RG> --cluster-name <Cluster> --yes",
      breakdown: [
        { part: "database delete", role: "Teardown Action", desc: "Xóa cấu hình cơ sở dữ liệu và giải phóng bộ nhớ RAM" }
      ]
    },
    parametersExplanation: [
      { param: "--yes", meaning: "Xác nhận xóa không cần hiển thị prompt." }
    ],
    examNotes: "Xóa database trước khi xóa cụm đảm bảo toàn bộ tài nguyên con được giải phóng sạch sẽ.",
    simulatedOutput: ""
  },
  {
    id: "l10-delete-cluster",
    level: 10,
    title: "15. Xóa Cụm Azure Managed Redis Enterprise",
    difficulty: "Cơ bản",
    category: "Cleanup",
    mission: "Xóa toàn bộ cụm Azure Managed Redis Enterprise `$env:REDIS_NAME` trong RG `$env:RG` để dọn dẹp tài nguyên và dừng tính cước sau khi hoàn thành lab.",
    expectedCommand: "az redisenterprise delete --resource-group $env:RG --name $env:REDIS_NAME --yes",
    aliases: [
      "az redisenterprise delete -g $env:RG -n $env:REDIS_NAME --yes",
      "az redisenterprise delete --resource-group $env:RG --name $env:REDIS_NAME -y"
    ],
    tokens: ["az", "redisenterprise", "delete", "--resource-group", "$env:RG", "--name", "$env:REDIS_NAME", "--yes"],
    hints: [
      "Lệnh xóa cụm: `az redisenterprise delete`.",
      "Cờ đồng ý: `--yes`."
    ],
    mentalModel: {
      rule: "az redisenterprise delete --resource-group <RG> --name <Name> --yes",
      breakdown: [
        { part: "az redisenterprise delete", role: "Final Teardown", desc: "Hủy toàn bộ cụm máy chủ Redis Enterprise và dừng hoàn toàn chi phí phát sinh" }
      ]
    },
    parametersExplanation: [
      { param: "--yes", meaning: "Xác nhận xóa tài nguyên cloud không cần hộp thoại tương tác." }
    ],
    examNotes: "Sau khi xóa, hostname FQDN sẽ được Azure giải phóng.",
    simulatedOutput: ""
  },

  // ==========================================
  // LEVEL 11: BACKEND SERVICES INTEGRATION (SERVICE BUS, EVENT GRID, FUNCTIONS & MCP)
  // ==========================================
  {
    id: "l11-register-servicebus",
    level: 11,
    title: "1. Đăng ký Resource Provider Microsoft.ServiceBus",
    difficulty: "Cơ bản",
    category: "Service Bus",
    mission: "Trước khi tạo các hàng đợi (Queues) và chủ đề (Topics) phục vụ kiến trúc suy luận AI bất đồng bộ, hãy kích hoạt Resource Provider `Microsoft.ServiceBus` trên Azure subscription.",
    expectedCommand: "az provider register --namespace Microsoft.ServiceBus",
    aliases: [
      "az provider register -n Microsoft.ServiceBus"
    ],
    tokens: ["az", "provider", "register", "--namespace", "Microsoft.ServiceBus"],
    hints: [
      "Sử dụng lệnh `az provider register`.",
      "Truyền cờ `--namespace Microsoft.ServiceBus`."
    ],
    mentalModel: {
      rule: "az provider register --namespace <ProviderName>",
      breakdown: [
        { part: "az provider register", role: "Resource Provider", desc: "Đăng ký nhà cung cấp dịch vụ hạ tầng trên subscription" },
        { part: "--namespace Microsoft.ServiceBus", role: "Namespace", desc: "Không gian tài nguyên của Azure Service Bus" }
      ]
    },
    parametersExplanation: [
      { param: "--namespace Microsoft.ServiceBus", meaning: "Resource Provider quản lý Message Queues và Pub/Sub Topics chuẩn doanh nghiệp." }
    ],
    whyThisMatters: "Mọi yêu cầu tạo Service Bus Namespace sẽ bị từ chối nếu subscription chưa kích hoạt provider này.",
    examTip: "⭐ AI-200: Service Bus là giải pháp hàng đầu khi cần đảm bảo thứ tự nghiêm ngặt (FIFO Sessions), xử lý giao dịch ACID và Dead-Letter Queue."
  },
  {
    id: "l11-register-eventgrid",
    level: 11,
    title: "2. Đăng ký Resource Provider Microsoft.EventGrid",
    difficulty: "Cơ bản",
    category: "Event Grid",
    mission: "Tiếp tục kích hoạt nhà cung cấp dịch vụ định tuyến sự kiện phản ứng `Microsoft.EventGrid` trên Azure subscription.",
    expectedCommand: "az provider register --namespace Microsoft.EventGrid",
    aliases: [
      "az provider register -n Microsoft.EventGrid"
    ],
    tokens: ["az", "provider", "register", "--namespace", "Microsoft.EventGrid"],
    hints: [
      "Dùng lệnh `az provider register`.",
      "Chỉ định `--namespace Microsoft.EventGrid`."
    ],
    mentalModel: {
      rule: "az provider register --namespace <ProviderName>",
      breakdown: [
        { part: "az provider register", role: "Provider", desc: "Đăng ký dịch vụ Event Grid" }
      ]
    },
    parametersExplanation: [
      { param: "--namespace Microsoft.EventGrid", meaning: "Resource Provider phụ trách phân phối sự kiện phản ứng quy mô lớn và MQTT broker." }
    ],
    whyThisMatters: "Cần thiết trước khi tạo Event Grid Namespaces, Topics và Event Subscriptions.",
    examTip: "⭐ Event Grid chuyên xử lý kiến trúc Reactive Events (phản ứng tức thì khi có sự kiện xảy ra) với chi phí trên từng triệu sự kiện cực rẻ."
  },
  {
    id: "l11-create-servicebus-namespace",
    level: 11,
    title: "3. Tạo Azure Service Bus Namespace (Gói Standard)",
    difficulty: "Trung bình",
    category: "Service Bus",
    mission: "Khởi tạo Service Bus Namespace tên biến `$env:SB_NAMESPACE` trong Resource Group `$env:RG` tại vùng `eastus` với SKU `Standard` (gói hỗ trợ cả Queues và Topics/Subscriptions).",
    expectedCommand: "az servicebus namespace create --resource-group $env:RG --name $env:SB_NAMESPACE --location eastus --sku Standard",
    aliases: [
      "az servicebus namespace create -g $env:RG -n $env:SB_NAMESPACE -l eastus --sku Standard",
      "az servicebus namespace create --resource-group $env:RG --name $env:SB_NAMESPACE --location eastus --sku Standard"
    ],
    tokens: ["az", "servicebus", "namespace", "create", "--resource-group", "$env:RG", "--name", "$env:SB_NAMESPACE", "--location", "eastus", "--sku", "Standard"],
    hints: [
      "Dùng `az servicebus namespace create`.",
      "Truyền `--resource-group $env:RG`, `--name $env:SB_NAMESPACE`, `--location eastus` và `--sku Standard`."
    ],
    mentalModel: {
      rule: "az servicebus namespace create --resource-group <RG> --name <Name> --location <Loc> --sku Standard",
      breakdown: [
        { part: "az servicebus namespace create", role: "Resource", desc: "Tạo cụm chứa logic cho hàng đợi và chủ đề" },
        { part: "--sku Standard", role: "Tier", desc: "Cung cấp tính năng Pub/Sub Topics, message TTL và Dead-lettering (Basic chỉ có Queue)" }
      ]
    },
    parametersExplanation: [
      { param: "--sku Standard", meaning: "Bắt buộc từ gói Standard trở lên để sử dụng được Service Bus Topics & Subscriptions." }
    ],
    whyThisMatters: "Tạo vùng chứa ranh giới bảo mật và địa chỉ FQDN endpoint cho toàn bộ luồng tin nhắn.",
    examTip: "⭐ AI-200: Gói Basic không hỗ trợ Topics; luôn chọn Standard hoặc Premium cho bài toán phân tán AI đa hệ thống."
  },
  {
    id: "l11-create-servicebus-queue",
    level: 11,
    title: "4. Tạo Hàng Đợi Queue với Dead-Lettering (DLQ)",
    difficulty: "Trung bình",
    category: "Service Bus",
    mission: "Tạo hàng đợi `inference-requests` trong Service Bus Namespace `$env:SB_NAMESPACE`. Thiết lập số lần nhận tối đa `--max-delivery-count 5` và tự động chuyển tin nhắn hết hạn vào Dead-Letter Queue `--enable-dead-lettering-on-message-expiration true`.",
    expectedCommand: "az servicebus queue create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --name inference-requests --max-delivery-count 5 --enable-dead-lettering-on-message-expiration true",
    aliases: [
      "az servicebus queue create -g $env:RG --namespace-name $env:SB_NAMESPACE -n inference-requests --max-delivery-count 5 --enable-dead-lettering-on-message-expiration true",
      "az servicebus queue create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --name inference-requests --max-delivery-count 5 --enable-dead-lettering-on-message-expiration true"
    ],
    tokens: ["az", "servicebus", "queue", "create", "--resource-group", "$env:RG", "--namespace-name", "$env:SB_NAMESPACE", "--name", "inference-requests", "--max-delivery-count", "5", "--enable-dead-lettering-on-message-expiration", "true"],
    hints: [
      "Dùng lệnh `az servicebus queue create`.",
      "Chỉ định `--namespace-name $env:SB_NAMESPACE` và `--name inference-requests`.",
      "Thêm `--max-delivery-count 5` và `--enable-dead-lettering-on-message-expiration true`."
    ],
    mentalModel: {
      rule: "az servicebus queue create --resource-group <RG> --namespace-name <NS> --name <Queue> --max-delivery-count 5 --enable-dead-lettering-on-message-expiration true",
      breakdown: [
        { part: "queue create", role: "Entity", desc: "Tạo hàng đợi tin nhắn theo cơ chế FIFO" },
        { part: "--max-delivery-count 5", role: "Poison Threshold", desc: "Tự động cô lập tin nhắn độc hại sau 5 lần xử lý lỗi" },
        { part: "--enable-dead-lettering-on-message-expiration true", role: "DLQ Expiration", desc: "Lưu vết tin nhắn quá hạn thay vì xóa mất" }
      ]
    },
    parametersExplanation: [
      { param: "--max-delivery-count", meaning: "Số lần thử lại tối đa trước khi đưa tin nhắn vào dead-letter subqueue." },
      { param: "--enable-dead-lettering-on-message-expiration", meaning: "Đảm bảo tin nhắn hết thời gian sống (TTL) được lưu lại để kiểm toán." }
    ],
    whyThisMatters: "Bảo vệ các worker AI không bị lặp vô tận (infinite poison retry loop) khi gặp prompt lỗi.",
    examTip: "⭐ Dead-Letter Queue (DLQ) là cơ chế tiêu chuẩn để cô lập malformed JSON payload trong kiến trúc AI."
  },
  {
    id: "l11-create-servicebus-topic",
    level: 11,
    title: "5. Tạo Chủ Đề Topic Phát Tán Kết Quả Suy Luận",
    difficulty: "Cơ bản",
    category: "Service Bus",
    mission: "Khởi tạo Topic `inference-results` trong Service Bus Namespace `$env:SB_NAMESPACE` để phát tán kết quả xử lý từ mô hình AI tới nhiều subscriber cùng lúc.",
    expectedCommand: "az servicebus topic create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --name inference-results",
    aliases: [
      "az servicebus topic create -g $env:RG --namespace-name $env:SB_NAMESPACE -n inference-results"
    ],
    tokens: ["az", "servicebus", "topic", "create", "--resource-group", "$env:RG", "--namespace-name", "$env:SB_NAMESPACE", "--name", "inference-results"],
    hints: [
      "Sử dụng `az servicebus topic create`.",
      "Cung cấp `--resource-group $env:RG`, `--namespace-name $env:SB_NAMESPACE`, và `--name inference-results`."
    ],
    mentalModel: {
      rule: "az servicebus topic create --resource-group <RG> --namespace-name <NS> --name <Topic>",
      breakdown: [
        { part: "topic create", role: "Pub/Sub Channel", desc: "Kênh phát thông điệp 1-nhiều tới các subscription" }
      ]
    },
    parametersExplanation: [
      { param: "--name inference-results", meaning: "Tên topic phân phối kết quả đầu ra của mô hình." }
    ],
    whyThisMatters: "Cho phép tách rời (decouple) tiến trình sinh nội dung AI với các tiến trình lưu trữ và gửi thông báo.",
    examTip: "Topic hỗ trợ mô hình Publish-Subscribe: người gửi đẩy 1 tin, nhiều subscriber nhận bản sao độc lập."
  },
  {
    id: "l11-create-servicebus-subscription",
    level: 11,
    title: "6. Tạo Subscription Hứng Tin Nhắn Ưu Tiên Cao",
    difficulty: "Trung bình",
    category: "Service Bus",
    mission: "Tạo Subscription `high-priority` gắn vào Topic `inference-results` thuộc Service Bus Namespace `$env:SB_NAMESPACE`.",
    expectedCommand: "az servicebus topic subscription create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --name high-priority",
    aliases: [
      "az servicebus topic subscription create -g $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results -n high-priority"
    ],
    tokens: ["az", "servicebus", "topic", "subscription", "create", "--resource-group", "$env:RG", "--namespace-name", "$env:SB_NAMESPACE", "--topic-name", "inference-results", "--name", "high-priority"],
    hints: [
      "Dùng `az servicebus topic subscription create`.",
      "Gắn `--topic-name inference-results` và `--name high-priority`."
    ],
    mentalModel: {
      rule: "az servicebus topic subscription create --resource-group <RG> --namespace-name <NS> --topic-name <Topic> --name <SubName>",
      breakdown: [
        { part: "topic subscription create", role: "Consumer Queue", desc: "Hộp thư riêng biệt nhận tin nhắn từ topic" }
      ]
    },
    parametersExplanation: [
      { param: "--topic-name", meaning: "Topic cha mà subscription đăng ký nhận tin." }
    ],
    whyThisMatters: "Mỗi subscription đóng vai trò như một virtual queue độc lập, không ảnh hưởng đến các consumers khác.",
    examTip: "Mặc định mỗi subscription mới tạo sẽ đi kèm quy tắc `$Default` khớp với 100% tin nhắn."
  },
  {
    id: "l11-delete-default-rule",
    level: 11,
    title: "7. Xóa Quy Tắc Mặc Định $Default Trên Subscription",
    difficulty: "Trung bình",
    category: "Service Bus",
    mission: "Để chuẩn bị áp dụng bộ lọc tùy chỉnh chuyên biệt, hãy xóa quy tắc lọc mặc định `$Default` trên Subscription `high-priority` của Topic `inference-results`.",
    expectedCommand: "az servicebus topic subscription rule delete --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --subscription-name high-priority --name \"$Default\"",
    aliases: [
      "az servicebus topic subscription rule delete -g $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --subscription-name high-priority --name \"$Default\"",
      "az servicebus topic subscription rule delete --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --subscription-name high-priority --name '$Default'"
    ],
    tokens: ["az", "servicebus", "topic", "subscription", "rule", "delete", "--resource-group", "$env:RG", "--namespace-name", "$env:SB_NAMESPACE", "--topic-name", "inference-results", "--subscription-name", "high-priority", "--name", "$Default"],
    hints: [
      "Dùng `az servicebus topic subscription rule delete`.",
      "Chỉ định `--name \"$Default\"` và `--subscription-name high-priority`."
    ],
    mentalModel: {
      rule: "az servicebus topic subscription rule delete ... --name \"$Default\"",
      breakdown: [
        { part: "rule delete", role: "Clean Rule", desc: "Xóa bỏ quy tắc TrueFilter nhận mọi tin nhắn" }
      ]
    },
    parametersExplanation: [
      { param: "--name $Default", meaning: "Quy tắc lọc mặc định ban đầu do Service Bus tự sinh (1=1)." }
    ],
    whyThisMatters: "Nếu không xóa `$Default`, subscription sẽ nhận tất cả tin nhắn bất chấp các filter khác được tạo thêm.",
    examTip: "⭐ Bắt buộc xóa `$Default` trước khi thêm bộ lọc SQL hoặc Correlation Filter để chỉ nhận tin khớp điều kiện."
  },
  {
    id: "l11-create-sql-filter",
    level: 11,
    title: "8. Tạo Bộ Lọc SQL Filter Định Tuyến Thuộc Tính (priority='high')",
    difficulty: "Nâng cao",
    category: "Service Bus",
    mission: "Tạo quy tắc lọc SQL `high-priority-filter` trên Subscription `high-priority` với biểu thức `--filter-sql-expression \"priority = 'high'\"` để lọc tin dựa vào `application_properties`.",
    expectedCommand: "az servicebus topic subscription rule create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --subscription-name high-priority --name high-priority-filter --filter-sql-expression \"priority = 'high'\"",
    aliases: [
      "az servicebus topic subscription rule create -g $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --subscription-name high-priority -n high-priority-filter --filter-sql-expression \"priority = 'high'\"",
      "az servicebus topic subscription rule create --resource-group $env:RG --namespace-name $env:SB_NAMESPACE --topic-name inference-results --subscription-name high-priority --name high-priority-filter --filter-sql-expression 'priority = \'high\''"
    ],
    tokens: ["az", "servicebus", "topic", "subscription", "rule", "create", "--resource-group", "$env:RG", "--namespace-name", "$env:SB_NAMESPACE", "--topic-name", "inference-results", "--subscription-name", "high-priority", "--name", "high-priority-filter", "--filter-sql-expression", "priority = 'high'"],
    hints: [
      "Dùng `az servicebus topic subscription rule create`.",
      "Đặt `--name high-priority-filter`.",
      "Gán `--filter-sql-expression \"priority = 'high'\"`."
    ],
    mentalModel: {
      rule: "az servicebus topic subscription rule create ... --filter-sql-expression \"<Property> = '<Value>'\"",
      breakdown: [
        { part: "rule create", role: "Routing Rule", desc: "Tạo bộ lọc thuộc tính tin nhắn" },
        { part: "--filter-sql-expression", role: "SQL Query", desc: "Biểu thức SQL đánh giá trên application_properties của ServiceBusMessage" }
      ]
    },
    parametersExplanation: [
      { param: "--filter-sql-expression", meaning: "Cú pháp SQL-92 lọc các trường metadata do ứng dụng đính kèm trong tin nhắn." }
    ],
    whyThisMatters: "Định tuyến tự động tin nhắn khẩn cấp tới hàng đợi ưu tiên mà không cần code logic phân nhánh phức tạp.",
    examTip: "⭐ AI-200: Bộ lọc SQL đánh giá trên header metadata (application_properties), không cần giải mã nội dung body."
  },
  {
    id: "l11-assign-servicebus-role",
    level: 11,
    title: "9. Phân Quyền Data Plane: Azure Service Bus Data Owner",
    difficulty: "Trung bình",
    category: "Service Bus",
    mission: "Gán vai trò Data Plane `Azure Service Bus Data Owner` cho người dùng `$env:USER_OID` trên phạm vi Service Bus Namespace `$SB_ID` để gửi/nhận tin không cần Connection String.",
    expectedCommand: "az role assignment create --assignee $env:USER_OID --scope $SB_ID --role \"Azure Service Bus Data Owner\"",
    aliases: [
      "az role assignment create --assignee $env:USER_OID --scope $SB_ID --role 'Azure Service Bus Data Owner'"
    ],
    tokens: ["az", "role", "assignment", "create", "--assignee", "$env:USER_OID", "--scope", "$SB_ID", "--role", "Azure Service Bus Data Owner"],
    hints: [
      "Dùng `az role assignment create`.",
      "Truyền `--assignee $env:USER_OID`, `--scope $SB_ID`, và `--role \"Azure Service Bus Data Owner\"`."
    ],
    mentalModel: {
      rule: "az role assignment create --assignee <OID> --scope <ScopeID> --role \"Azure Service Bus Data Owner\"",
      breakdown: [
        { part: "role assignment create", role: "RBAC", desc: "Gán quyền truy cập dữ liệu tầng Data Plane" },
        { part: "--role \"Azure Service Bus Data Owner\"", role: "Built-in Role", desc: "Quyền toàn quyền gửi, nhận và quản lý tin nhắn trong queue/topic" }
      ]
    },
    parametersExplanation: [
      { param: "Azure Service Bus Data Owner", meaning: "Vai trò tích hợp của Azure cho phép gửi và nhận tin qua xác thực Microsoft Entra ID." }
    ],
    whyThisMatters: "Loại bỏ hoàn toàn rủi ro lộ lọt Shared Access Signatures (SAS) connection strings trong mã nguồn.",
    examTip: "⭐ Ba vai trò Service Bus chính trong đề thi: Data Owner (toàn quyền), Data Sender (chỉ gửi), Data Receiver (chỉ nhận)."
  },
  {
    id: "l11-create-eventgrid-namespace",
    level: 11,
    title: "10. Khởi Tạo Event Grid Namespace (Standard SKU)",
    difficulty: "Trung bình",
    category: "Event Grid",
    mission: "Tạo Event Grid Namespace mới tên `$env:EG_NAMESPACE` trong Resource Group `$env:RG` tại vùng `eastus` với SKU Standard dung lượng 1 (`--sku \"{name:standard,capacity:1}\"`).",
    expectedCommand: "az eventgrid namespace create --resource-group $env:RG --name $env:EG_NAMESPACE --location eastus --sku \"{name:standard,capacity:1}\"",
    aliases: [
      "az eventgrid namespace create -g $env:RG -n $env:EG_NAMESPACE -l eastus --sku \"{name:standard,capacity:1}\"",
      "az eventgrid namespace create --resource-group $env:RG --name $env:EG_NAMESPACE --location eastus --sku '{name:standard,capacity:1}'"
    ],
    tokens: ["az", "eventgrid", "namespace", "create", "--resource-group", "$env:RG", "--name", "$env:EG_NAMESPACE", "--location", "eastus", "--sku", "{name:standard,capacity:1}"],
    hints: [
      "Dùng `az eventgrid namespace create`.",
      "Chỉ định `--sku \"{name:standard,capacity:1}\"`."
    ],
    mentalModel: {
      rule: "az eventgrid namespace create --resource-group <RG> --name <Name> --location <Loc> --sku \"{name:standard,capacity:1}\"",
      breakdown: [
        { part: "eventgrid namespace create", role: "Namespace", desc: "Khởi tạo Event Grid thế hệ mới hỗ trợ MQTT broker và Pull Delivery" }
      ]
    },
    parametersExplanation: [
      { param: "--sku {name:standard,capacity:1}", meaning: "Cấu hình chuẩn hóa tài nguyên thông lượng cho Event Grid Namespace." }
    ],
    whyThisMatters: "Event Grid Namespace là nền tảng hiện đại hỗ trợ định dạng sự kiện chuẩn công nghiệp CloudEvents 1.0.",
    examTip: "⭐ Phân biệt Event Grid Basic (chỉ Push HTTP Webhook) với Event Grid Namespace (hỗ trợ Pull Delivery, MQTT và CloudEvents)."
  },
  {
    id: "l11-create-eventgrid-topic",
    level: 11,
    title: "11. Tạo Namespace Topic Schema CloudEvents v1.0",
    difficulty: "Nâng cao",
    category: "Event Grid",
    mission: "Tạo Namespace Topic `moderation-events` trong Event Grid Namespace `$env:EG_NAMESPACE` với thời gian lưu trữ 1 ngày (`--event-retention-in-days 1`), publisher `Custom` và định dạng `--input-schema CloudEventSchemaV1_0`.",
    expectedCommand: "az eventgrid namespace topic create --resource-group $env:RG --namespace-name $env:EG_NAMESPACE --name moderation-events --event-retention-in-days 1 --publisher-type Custom --input-schema CloudEventSchemaV1_0",
    aliases: [
      "az eventgrid namespace topic create -g $env:RG --namespace-name $env:EG_NAMESPACE -n moderation-events --event-retention-in-days 1 --publisher-type Custom --input-schema CloudEventSchemaV1_0"
    ],
    tokens: ["az", "eventgrid", "namespace", "topic", "create", "--resource-group", "$env:RG", "--namespace-name", "$env:EG_NAMESPACE", "--name", "moderation-events", "--event-retention-in-days", "1", "--publisher-type", "Custom", "--input-schema", "CloudEventSchemaV1_0"],
    hints: [
      "Dùng `az eventgrid namespace topic create`.",
      "Truyền `--event-retention-in-days 1`, `--publisher-type Custom`, và `--input-schema CloudEventSchemaV1_0`."
    ],
    mentalModel: {
      rule: "az eventgrid namespace topic create ... --input-schema CloudEventSchemaV1_0",
      breakdown: [
        { part: "namespace topic create", role: "Topic", desc: "Tạo kênh sự kiện bên trong Namespace" },
        { part: "--input-schema CloudEventSchemaV1_0", role: "Standard Schema", desc: "Bắt buộc tuân thủ đặc tả CloudEvents v1.0 của CNCF" }
      ]
    },
    parametersExplanation: [
      { param: "--input-schema CloudEventSchemaV1_0", meaning: "Cấu trúc bao bì sự kiện tiêu chuẩn gồm id, source, type, data." },
      { param: "--event-retention-in-days 1", meaning: "Thời gian lưu trữ sự kiện đệm trong hệ thống." }
    ],
    whyThisMatters: "Cho phép các dịch vụ đa nền tảng và AI agents giao tiếp bằng định dạng sự kiện trung lập.",
    examTip: "⭐ CloudEvents v1.0 là schema mặc định và duy nhất được hỗ trợ trên Event Grid Namespace Topics."
  },
  {
    id: "l11-create-eventgrid-subscription",
    level: 11,
    title: "12. Tạo Event Subscription Chế Độ Queue Pull Delivery & Filter",
    difficulty: "Nâng cao",
    category: "Event Grid",
    mission: "Tạo Subscription `sub-flagged` trên Topic `moderation-events` với cấu hình Queue pull delivery (khóa nhận 60s, max 10 lần gửi, TTL 1 ngày), schema CloudEvents và bộ lọc chỉ nhận sự kiện `--filters-configuration \"{includedEventTypes:['com.contoso.ai.ContentFlagged']}\"`.",
    expectedCommand: "az eventgrid namespace topic event-subscription create --resource-group $env:RG --namespace-name $env:EG_NAMESPACE --topic-name moderation-events --name sub-flagged --delivery-configuration \"{deliveryMode:Queue,queue:{receiveLockDurationInSeconds:60,maxDeliveryCount:10,eventTimeToLive:P1D}}\" --event-delivery-schema CloudEventSchemaV1_0 --filters-configuration \"{includedEventTypes:['com.contoso.ai.ContentFlagged']}\"",
    aliases: [
      "az eventgrid namespace topic event-subscription create -g $env:RG --namespace-name $env:EG_NAMESPACE --topic-name moderation-events -n sub-flagged --delivery-configuration \"{deliveryMode:Queue,queue:{receiveLockDurationInSeconds:60,maxDeliveryCount:10,eventTimeToLive:P1D}}\" --event-delivery-schema CloudEventSchemaV1_0 --filters-configuration \"{includedEventTypes:['com.contoso.ai.ContentFlagged']}\""
    ],
    tokens: ["az", "eventgrid", "namespace", "topic", "event-subscription", "create", "--resource-group", "$env:RG", "--namespace-name", "$env:EG_NAMESPACE", "--topic-name", "moderation-events", "--name", "sub-flagged", "--delivery-configuration", "{deliveryMode:Queue,queue:{receiveLockDurationInSeconds:60,maxDeliveryCount:10,eventTimeToLive:P1D}}", "--event-delivery-schema", "CloudEventSchemaV1_0", "--filters-configuration", "{includedEventTypes:['com.contoso.ai.ContentFlagged']}"],
    hints: [
      "Dùng `az eventgrid namespace topic event-subscription create`.",
      "Thiết lập `--delivery-configuration \"{deliveryMode:Queue,...}\"`.",
      "Thêm `--filters-configuration \"{includedEventTypes:['com.contoso.ai.ContentFlagged']}\"`."
    ],
    mentalModel: {
      rule: "az eventgrid namespace topic event-subscription create ... --delivery-configuration \"{deliveryMode:Queue,...}\" --filters-configuration \"{...}\"",
      breakdown: [
        { part: "event-subscription create", role: "Subscription", desc: "Tạo điểm tiếp nhận sự kiện" },
        { part: "deliveryMode:Queue", role: "Pull Delivery", desc: "Người nhận tự chủ động gọi receive() kéo tin nhắn về, không cần mở public endpoint" },
        { part: "includedEventTypes", role: "Type Filter", desc: "Chỉ chuyển giao các sự kiện AI kiểm duyệt bị gắn cờ" }
      ]
    },
    parametersExplanation: [
      { param: "--delivery-configuration", meaning: "Cấu hình hàng đợi pull delivery gồm thời gian khóa và số lần retry." },
      { param: "--filters-configuration", meaning: "Bộ lọc sự kiện nâng cao dựa theo thuộc tính CloudEvent type." }
    ],
    whyThisMatters: "Pull Delivery loại bỏ nhu cầu mở cổng mạng inbound webhook cho các agent AI chạy trong môi trường private.",
    examTip: "⭐ Pull Delivery trong Event Grid hoạt động tương tự như Service Bus Queue: Client gọi receive(), xử lý xong gọi acknowledge() hoặc reject()."
  },
  {
    id: "l11-assign-eventgrid-receiver",
    level: 11,
    title: "13. Phân Quyền EventGrid Data Receiver Cho User OID",
    difficulty: "Trung bình",
    category: "Event Grid",
    mission: "Gán vai trò Data Plane `EventGrid Data Receiver` cho tài khoản người dùng `$env:USER_OID` trên phạm vi Namespace Topic `$EG_TOPIC_ID` để thực hiện kéo sự kiện từ subscription.",
    expectedCommand: "az role assignment create --assignee $env:USER_OID --scope $EG_TOPIC_ID --role \"EventGrid Data Receiver\"",
    aliases: [
      "az role assignment create --assignee $env:USER_OID --scope $EG_TOPIC_ID --role 'EventGrid Data Receiver'"
    ],
    tokens: ["az", "role", "assignment", "create", "--assignee", "$env:USER_OID", "--scope", "$EG_TOPIC_ID", "--role", "EventGrid Data Receiver"],
    hints: [
      "Sử dụng `az role assignment create`.",
      "Truyền `--assignee $env:USER_OID`, `--scope $EG_TOPIC_ID` và `--role \"EventGrid Data Receiver\"`."
    ],
    mentalModel: {
      rule: "az role assignment create --assignee <OID> --scope <ScopeID> --role \"EventGrid Data Receiver\"",
      breakdown: [
        { part: "--role \"EventGrid Data Receiver\"", role: "Data Plane", desc: "Cho phép nhận, giải phóng hoặc từ chối sự kiện" }
      ]
    },
    parametersExplanation: [
      { param: "EventGrid Data Receiver", meaning: "Vai trò bảo mật tối thiểu để ứng dụng client đọc sự kiện từ Event Grid Namespace." }
    ],
    whyThisMatters: "Bảo mật Zero-Trust theo nguyên tắc đặc quyền tối thiểu (Least Privilege).",
    examTip: "⭐ Phân biệt: `EventGrid Data Sender` để publish sự kiện; `EventGrid Data Receiver` để consume sự kiện."
  },
  {
    id: "l11-create-functionapp-mcp",
    level: 11,
    title: "14. Tạo Azure Function App Linux Host MCP Server",
    difficulty: "Nâng cao",
    category: "Functions & MCP",
    mission: "Khởi tạo Azure Function App tên `$env:FUNC_NAME` trên Linux chạy runtime `python` 3.11, Functions version 4 kết hợp tài khoản storage `$env:STORAGE_ACCOUNT` tại vùng `eastus` để host MCP Server.",
    expectedCommand: "az functionapp create --resource-group $env:RG --consumption-plan-location eastus --runtime python --runtime-version 3.11 --functions-version 4 --name $env:FUNC_NAME --storage-account $env:STORAGE_ACCOUNT --os-type Linux",
    aliases: [
      "az functionapp create -g $env:RG --consumption-plan-location eastus --runtime python --runtime-version 3.11 --functions-version 4 -n $env:FUNC_NAME --storage-account $env:STORAGE_ACCOUNT --os-type Linux"
    ],
    tokens: ["az", "functionapp", "create", "--resource-group", "$env:RG", "--consumption-plan-location", "eastus", "--runtime", "python", "--runtime-version", "3.11", "--functions-version", "4", "--name", "$env:FUNC_NAME", "--storage-account", "$env:STORAGE_ACCOUNT", "--os-type", "Linux"],
    hints: [
      "Dùng `az functionapp create`.",
      "Cung cấp `--runtime python --runtime-version 3.11 --functions-version 4`.",
      "Chỉ định `--os-type Linux` và `--consumption-plan-location eastus`."
    ],
    mentalModel: {
      rule: "az functionapp create --resource-group <RG> --name <Name> --storage-account <Storage> --consumption-plan-location <Loc> --runtime python --runtime-version 3.11 --functions-version 4 --os-type Linux",
      breakdown: [
        { part: "az functionapp create", role: "Serverless Compute", desc: "Tạo ứng dụng Azure Functions serverless" },
        { part: "--os-type Linux", role: "OS", desc: "Hệ điều hành bắt buộc cho Python Functions trên Azure" }
      ]
    },
    parametersExplanation: [
      { param: "--consumption-plan-location", meaning: "Vùng triển khai gói Serverless tự động co giãn." },
      { param: "--functions-version 4", meaning: "Phiên bản runtime Functions v4 hỗ trợ Python v2 programming model." }
    ],
    whyThisMatters: "Cung cấp hạ tầng serverless chi phí tối ưu để triển khai các công cụ MCP Tool Triggers cho AI assistants.",
    examTip: "⭐ Python Azure Functions bắt buộc phải chạy trên Linux (`--os-type Linux`)."
  },
  {
    id: "l11-get-functionapp-hostname",
    level: 11,
    title: "15. Trích Xuất FQDN Hostname Của Function App",
    difficulty: "Cơ bản",
    category: "Functions & MCP",
    mission: "Lấy chuỗi FQDN sạch (`defaultHostName` với định dạng `-o tsv`) của Function App `$env:FUNC_NAME` để cấu hình URL webhook kết nối MCP Client (`https://<hostname>/runtime/webhooks/mcp/sse`).",
    expectedCommand: "az functionapp show --resource-group $env:RG --name $env:FUNC_NAME --query defaultHostName -o tsv",
    aliases: [
      "az functionapp show -g $env:RG -n $env:FUNC_NAME --query defaultHostName -o tsv"
    ],
    tokens: ["az", "functionapp", "show", "--resource-group", "$env:RG", "--name", "$env:FUNC_NAME", "--query", "defaultHostName", "-o", "tsv"],
    hints: [
      "Dùng lệnh `az functionapp show`.",
      "Lọc `--query defaultHostName` và xuất `-o tsv`."
    ],
    mentalModel: {
      rule: "az functionapp show --resource-group <RG> --name <Name> --query defaultHostName -o tsv",
      breakdown: [
        { part: "functionapp show", role: "Inspection", desc: "Đọc cấu hình chi tiết Function App" },
        { part: "--query defaultHostName -o tsv", role: "Clean String", desc: "Trích xuất tên miền *.azurewebsites.net sạch không nháy kép" }
      ]
    },
    parametersExplanation: [
      { param: "defaultHostName", meaning: "Tên miền FQDN chuẩn gán cho Function App." }
    ],
    whyThisMatters: "Sử dụng làm biến môi trường endpoint cho GitHub Copilot hoặc Cursor khi cấu hình MCP SSE transport.",
    examTip: "⭐ Luôn dùng `-o tsv` khi muốn gán kết quả đầu ra trực tiếp vào biến script mà không bị lỗi ngoặc kép."
  }
,
  // ==========================================
  // LEVEL 12: AZURE KEY VAULT & APP CONFIGURATION
  // ==========================================
  {
  "id": "l12-register-appconfig",
  "level": 12,
  "title": "1. Đăng Ký Resource Provider AppConfiguration",
  "difficulty": "Cơ bản",
  "category": "Azure App Configuration",
  "mission": "Đăng ký resource provider `Microsoft.AppConfiguration` cho Azure subscription để có thể khởi tạo và quản lý dịch vụ App Configuration Store.",
  "expectedCommand": "az provider register --namespace Microsoft.AppConfiguration",
  "aliases": [
    "az provider register -n Microsoft.AppConfiguration"
  ],
  "tokens": [
    "az",
    "provider",
    "register",
    "--namespace",
    "Microsoft.AppConfiguration"
  ],
  "hints": [
    "Sử dụng lệnh `az provider register`.",
    "Cờ chỉ định namespace là `--namespace` hoặc `-n` với giá trị `Microsoft.AppConfiguration`."
  ],
  "mentalModel": {
    "rule": "az provider register --namespace <ProviderNamespace>",
    "breakdown": [
      {
        "part": "provider register",
        "role": "Resource Provider",
        "desc": "Kích hoạt dịch vụ quản lý cấu hình tập trung"
      },
      {
        "part": "--namespace Microsoft.AppConfiguration",
        "role": "Service Namespace",
        "desc": "Không gian tên dịch vụ Azure App Configuration"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "--namespace",
      "meaning": "Định danh không gian tên dịch vụ Azure cần đăng ký (Microsoft.AppConfiguration)."
    }
  ],
  "whyThisMatters": "Mọi tài nguyên Azure đều cần provider tương ứng được đăng ký trong subscription trước khi có thể deploy qua CLI/Bicep/ARM.",
  "examTip": "⭐ Thao tác đăng ký provider chỉ cần thực hiện 1 lần duy nhất cho mỗi Azure Subscription."
},
  {
  "id": "l12-register-keyvault",
  "level": 12,
  "title": "2. Đăng Ký Resource Provider KeyVault",
  "difficulty": "Cơ bản",
  "category": "Azure Key Vault",
  "mission": "Đăng ký resource provider `Microsoft.KeyVault` để cấp phép khởi tạo kho quản lý bí mật bảo mật trong subscription.",
  "expectedCommand": "az provider register --namespace Microsoft.KeyVault",
  "aliases": [
    "az provider register -n Microsoft.KeyVault"
  ],
  "tokens": [
    "az",
    "provider",
    "register",
    "--namespace",
    "Microsoft.KeyVault"
  ],
  "hints": [
    "Dùng `az provider register`.",
    "Tham số `--namespace Microsoft.KeyVault`."
  ],
  "mentalModel": {
    "rule": "az provider register --namespace Microsoft.KeyVault",
    "breakdown": [
      {
        "part": "provider register",
        "role": "Provider Activation",
        "desc": "Đăng ký dịch vụ lưu trữ bí mật và khóa mã hóa"
      },
      {
        "part": "--namespace Microsoft.KeyVault",
        "role": "Namespace",
        "desc": "Azure Key Vault Provider Namespace"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "--namespace",
      "meaning": "Không gian tên nhà cung cấp dịch vụ Azure Key Vault."
    }
  ],
  "whyThisMatters": "Bắt buộc đăng ký trước khi tạo Key Vault lưu trữ khóa API, chuỗi kết nối và chứng chỉ cho giải pháp AI.",
  "examTip": "⭐ Có thể kiểm tra trạng thái đăng ký bằng `az provider show -n Microsoft.KeyVault --query registrationState`."
},
  {
  "id": "l12-create-keyvault-rbac",
  "level": 12,
  "title": "3. Khởi Tạo Key Vault Với RBAC Authorization",
  "difficulty": "Cơ bản",
  "category": "Azure Key Vault",
  "mission": "Khởi tạo một Azure Key Vault tên `$env:KV_NAME` trong Resource Group `$env:RG`, location `eastus`, và kích hoạt mô hình phân quyền hiện đại Azure RBAC (`--enable-rbac-authorization true`).",
  "expectedCommand": "az keyvault create --resource-group $env:RG --name $env:KV_NAME --location eastus --enable-rbac-authorization true",
  "aliases": [
    "az keyvault create -g $env:RG -n $env:KV_NAME -l eastus --enable-rbac-authorization true"
  ],
  "tokens": [
    "az",
    "keyvault",
    "create",
    "--resource-group",
    "$env:RG",
    "--name",
    "$env:KV_NAME",
    "--location",
    "eastus",
    "--enable-rbac-authorization",
    "true"
  ],
  "hints": [
    "Dùng `az keyvault create`.",
    "Chỉ định `--enable-rbac-authorization true` để dùng Azure RBAC thay cho access policy truyền thống."
  ],
  "mentalModel": {
    "rule": "az keyvault create --resource-group <RG> --name <Name> --location <Loc> --enable-rbac-authorization true",
    "breakdown": [
      {
        "part": "keyvault create",
        "role": "Resource Creation",
        "desc": "Tạo kho lưu trữ bí mật an toàn tiêu chuẩn FIPS 140"
      },
      {
        "part": "--enable-rbac-authorization true",
        "role": "Modern Security",
        "desc": "Bật xác thực phân quyền qua Azure Entra ID RBAC thay vì Vault Access Policies cổ điển"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "--enable-rbac-authorization",
      "meaning": "Khi đặt là true, áp dụng kiểm soát truy cập dữ liệu bí mật bằng các vai trò RBAC (Key Vault Secrets Officer/User)."
    }
  ],
  "whyThisMatters": "Azure khuyến nghị chuẩn bảo mật RBAC vì cho phép phân quyền chi tiết tới từng secret riêng lẻ và đồng bộ chính sách Entra ID PIM.",
  "examTip": "⭐ Mặc định Key Vault luôn bật tính năng Soft-Delete (lưu giữ 90 ngày) để chống xóa nhầm ngoài ý muốn."
},
  {
  "id": "l12-assign-kv-secrets-officer",
  "level": 12,
  "title": "4. Gán Quyền Key Vault Secrets Officer",
  "difficulty": "Trung bình",
  "category": "Azure Key Vault",
  "mission": "Gán quyền vai trò `Key Vault Secrets Officer` cho người dùng `$env:USER_OID` trên phạm vi kho `$KV_ID` để được phép thêm, sửa, xóa và đọc toàn bộ secret.",
  "expectedCommand": "az role assignment create --role \"Key Vault Secrets Officer\" --assignee $env:USER_OID --scope $KV_ID",
  "aliases": [],
  "tokens": [
    "az",
    "role",
    "assignment",
    "create",
    "--role",
    "\"Key Vault Secrets Officer\"",
    "--assignee",
    "$env:USER_OID",
    "--scope",
    "$KV_ID"
  ],
  "hints": [
    "Dùng `az role assignment create`.",
    "Tên vai trò `--role \"Key Vault Secrets Officer\"`.",
    "Phạm vi `--scope $KV_ID`."
  ],
  "mentalModel": {
    "rule": "az role assignment create --role <RoleName> --assignee <PrincipalId> --scope <ScopeId>",
    "breakdown": [
      {
        "part": "role assignment create",
        "role": "RBAC Data Plane",
        "desc": "Trao quyền thao tác dữ liệu"
      },
      {
        "part": "--role \"Key Vault Secrets Officer\"",
        "role": "Role",
        "desc": "Vai trò toàn quyền CRUD đối với Secrets trong Key Vault"
      },
      {
        "part": "--scope $KV_ID",
        "role": "Boundary",
        "desc": "Giới hạn phạm vi quyền trên đúng Key Vault này"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "--role",
      "meaning": "Tên vai trò Entra ID RBAC chuẩn: Key Vault Secrets Officer."
    },
    {
      "param": "--scope",
      "meaning": "Resource ID đầy đủ của Key Vault cần phân quyền."
    }
  ],
  "whyThisMatters": "Ngay cả Subscription Owner cũng không mặc định đọc hay ghi được Secrets trong Key Vault nếu bật RBAC mà chưa gán role này.",
  "examTip": "⭐ Phân biệt: `Key Vault Secrets Officer` (CRUD bí mật) vs `Key Vault Secrets User` (chỉ đọc bí mật ở runtime)."
},
  {
  "id": "l12-set-kv-secret-apikey",
  "level": 12,
  "title": "5. Lưu Trữ Secret OpenAI API Key",
  "difficulty": "Cơ bản",
  "category": "Azure Key Vault",
  "mission": "Lưu trữ khóa API bí mật `openai-api-key` có giá trị `\"sk-proj-prod123456\"` vào Key Vault `$env:KV_NAME`, định dạng loại nội dung `--content-type \"application/x-api-key\"`.",
  "expectedCommand": "az keyvault secret set --vault-name $env:KV_NAME --name openai-api-key --value \"sk-proj-prod123456\" --content-type \"application/x-api-key\"",
  "aliases": [
    "az keyvault secret set --vault-name $env:KV_NAME -n openai-api-key --value \"sk-proj-prod123456\" --content-type \"application/x-api-key\""
  ],
  "tokens": [
    "az",
    "keyvault",
    "secret",
    "set",
    "--vault-name",
    "$env:KV_NAME",
    "--name",
    "openai-api-key",
    "--value",
    "\"sk-proj-prod123456\"",
    "--content-type",
    "\"application/x-api-key\""
  ],
  "hints": [
    "Dùng `az keyvault secret set`.",
    "Cờ kho lưu trữ là `--vault-name`.",
    "Gắn nhãn định dạng dữ liệu bằng `--content-type \"application/x-api-key\"`."
  ],
  "mentalModel": {
    "rule": "az keyvault secret set --vault-name <Vault> --name <Name> --value <Value> --content-type <ContentType>",
    "breakdown": [
      {
        "part": "keyvault secret set",
        "role": "Secret Persistence",
        "desc": "Tạo hoặc cập nhật phiên bản mới của bí mật"
      },
      {
        "part": "--content-type application/x-api-key",
        "role": "Metadata",
        "desc": "Gắn nhãn nhận diện loại dữ liệu cho ứng dụng client"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "--vault-name",
      "meaning": "Tên Key Vault chứa secret."
    },
    {
      "param": "--content-type",
      "meaning": "Mô tả kiểu MIME hoặc loại chuỗi nhạy cảm để client nhận biết cách giải mã/sử dụng."
    }
  ],
  "whyThisMatters": "Bảo vệ các API key quan trọng khỏi việc bị commit lộ lên Git hoặc hiển thị dạng bản rõ trong cấu hình môi trường.",
  "examTip": "⭐ Mỗi lần chạy `secret set`, Key Vault tự động tạo ra một version GUID mới mà vẫn giữ nguyên tên secret."
},
  {
  "id": "l12-set-kv-secret-cosmosdb",
  "level": 12,
  "title": "6. Lưu Trữ Chuỗi Kết Nối Cosmos DB",
  "difficulty": "Cơ bản",
  "category": "Azure Key Vault",
  "mission": "Lưu trữ bí mật `cosmosdb-connection-string` vào Key Vault `$env:KV_NAME` với giá trị chuỗi kết nối và `--content-type \"application/x-connection-string\"`.",
  "expectedCommand": "az keyvault secret set --vault-name $env:KV_NAME --name cosmosdb-connection-string --value \"AccountEndpoint=https://mycosmos.documents.azure.com:443/;AccountKey=abc123==\" --content-type \"application/x-connection-string\"",
  "aliases": [],
  "tokens": [
    "az",
    "keyvault",
    "secret",
    "set",
    "--vault-name",
    "$env:KV_NAME",
    "--name",
    "cosmosdb-connection-string",
    "--value",
    "\"AccountEndpoint=https://mycosmos.documents.azure.com:443/;AccountKey=abc123==\"",
    "--content-type",
    "\"application/x-connection-string\""
  ],
  "hints": [
    "Dùng `az keyvault secret set`.",
    "Đảm bảo bọc giá trị chuỗi kết nối trong dấu ngoặc kép."
  ],
  "mentalModel": {
    "rule": "az keyvault secret set --vault-name <Vault> --name <Name> --value <Value> --content-type <ContentType>",
    "breakdown": [
      {
        "part": "keyvault secret set",
        "role": "Connection String Store",
        "desc": "Lưu trữ chuỗi kết nối cơ sở dữ liệu nhạy cảm"
      },
      {
        "part": "--content-type application/x-connection-string",
        "role": "Content Type",
        "desc": "Quy định kiểu dữ liệu kết nối"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "--name",
      "meaning": "Tên bí mật nhận dạng trong Key Vault."
    },
    {
      "param": "--value",
      "meaning": "Chuỗi kết nối hoàn chỉnh gồm Endpoint và AccountKey."
    }
  ],
  "whyThisMatters": "Chuỗi kết nối chứa master key của cơ sở dữ liệu nếu bị rò rỉ sẽ gây nguy cơ toàn bộ dữ liệu bị xâm nhập hoặc phá hủy.",
  "examTip": "⭐ Trong bài thi AI-200, luôn ưu tiên lưu connection string trong Key Vault thay vì ghi trực tiếp vào App Settings."
},
  {
  "id": "l12-show-kv-secret-id",
  "level": 12,
  "title": "7. Trích Xuất Secret Identifier URI",
  "difficulty": "Cơ bản",
  "category": "Azure Key Vault",
  "mission": "Lấy địa chỉ URI định danh đầy đủ (`id`) của secret `openai-api-key` từ Key Vault `$env:KV_NAME` dưới định dạng `-o tsv` để làm Secret Identifier tham chiếu.",
  "expectedCommand": "az keyvault secret show --vault-name $env:KV_NAME --name openai-api-key --query id -o tsv",
  "aliases": [
    "az keyvault secret show --vault-name $env:KV_NAME -n openai-api-key --query id -o tsv"
  ],
  "tokens": [
    "az",
    "keyvault",
    "secret",
    "show",
    "--vault-name",
    "$env:KV_NAME",
    "--name",
    "openai-api-key",
    "--query",
    "id",
    "-o",
    "tsv"
  ],
  "hints": [
    "Sử dụng lệnh `az keyvault secret show`.",
    "Lọc trường `--query id` và xuất `-o tsv`."
  ],
  "mentalModel": {
    "rule": "az keyvault secret show --vault-name <Vault> --name <SecretName> --query id -o tsv",
    "breakdown": [
      {
        "part": "keyvault secret show",
        "role": "Inspect Secret",
        "desc": "Xem thuộc tính bí mật"
      },
      {
        "part": "--query id -o tsv",
        "role": "URI Extractor",
        "desc": "Trích xuất URI định dạng https://<vault>.vault.azure.net/secrets/<name>/<version>"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "--query id",
      "meaning": "Lọc thuộc tính URI định danh duy nhất của phiên bản secret."
    },
    {
      "param": "-o tsv",
      "meaning": "Định dạng chuỗi thô không có dấu nháy kép, thích hợp gán biến script."
    }
  ],
  "whyThisMatters": "URI này là giá trị bắt buộc truyền vào cờ `--secret-identifier` khi tích hợp với Azure App Configuration.",
  "examTip": "⭐ Nếu bỏ qua phần version GUID ở cuối URI, tham chiếu sẽ luôn tự động trỏ tới phiên bản mới nhất của secret."
},
  {
  "id": "l12-list-kv-secret-versions",
  "level": 12,
  "title": "8. Liệt Kê Các Phiên Bản Của Secret",
  "difficulty": "Trung bình",
  "category": "Azure Key Vault",
  "mission": "Liệt kê lịch sử tất cả các phiên bản của secret `openai-api-key` trong Key Vault `$env:KV_NAME`, hiển thị trường `id` và trạng thái `attributes.enabled` dưới dạng bảng.",
  "expectedCommand": "az keyvault secret list-versions --vault-name $env:KV_NAME --name openai-api-key --query \"[].{id:id, enabled:attributes.enabled}\" -o table",
  "aliases": [],
  "tokens": [
    "az",
    "keyvault",
    "secret",
    "list-versions",
    "--vault-name",
    "$env:KV_NAME",
    "--name",
    "openai-api-key",
    "--query",
    "\"[].{id:id, enabled:attributes.enabled}\"",
    "-o",
    "table"
  ],
  "hints": [
    "Dùng lệnh `az keyvault secret list-versions`.",
    "Ánh xạ mảng với `--query \"[].{id:id, enabled:attributes.enabled}\"` và `-o table`."
  ],
  "mentalModel": {
    "rule": "az keyvault secret list-versions --vault-name <Vault> --name <Name> --query \"[].{...}\" -o table",
    "breakdown": [
      {
        "part": "keyvault secret list-versions",
        "role": "Version Audit",
        "desc": "Xem toàn bộ lịch sử thay đổi của secret"
      },
      {
        "part": "--query \"[].{id:id, enabled:attributes.enabled}\"",
        "role": "JMESPath Projection",
        "desc": "Hiển thị ID phiên bản và cờ kích hoạt"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "list-versions",
      "meaning": "Lệnh liệt kê tất cả các version GUID của một secret cụ thể."
    },
    {
      "param": "attributes.enabled",
      "meaning": "Trạng thái boolean cho biết phiên bản đó có đang được phép đọc hay bị vô hiệu hóa."
    }
  ],
  "whyThisMatters": "Kiểm toán secret versions giúp phát hiện việc xoay vòng khóa (key rotation) và hỗ trợ rollback nhanh về phiên bản trước nếu cần.",
  "examTip": "⭐ Secret cũ không bị ghi đè mất đi mà được lưu giữ dưới dạng các phiên bản lịch sử bất biến (immutable versions)."
},
  {
  "id": "l12-create-appconfig-store",
  "level": 12,
  "title": "9. Khởi Tạo Cửa Hàng Azure App Configuration",
  "difficulty": "Cơ bản",
  "category": "Azure App Configuration",
  "mission": "Tạo một cửa hàng cấu hình tập trung Azure App Configuration tên `$env:APPCONFIG_NAME` trong Resource Group `$env:RG`, location `eastus`, với SKU gói `Standard`.",
  "expectedCommand": "az appconfig create --resource-group $env:RG --name $env:APPCONFIG_NAME --location eastus --sku Standard",
  "aliases": [
    "az appconfig create -g $env:RG -n $env:APPCONFIG_NAME -l eastus --sku Standard"
  ],
  "tokens": [
    "az",
    "appconfig",
    "create",
    "--resource-group",
    "$env:RG",
    "--name",
    "$env:APPCONFIG_NAME",
    "--location",
    "eastus",
    "--sku",
    "Standard"
  ],
  "hints": [
    "Dùng `az appconfig create`.",
    "Chọn tầng dịch vụ `--sku Standard` để hỗ trợ dynamic refresh không giới hạn và SLA 99.9%."
  ],
  "mentalModel": {
    "rule": "az appconfig create --resource-group <RG> --name <Name> --location <Loc> --sku Standard",
    "breakdown": [
      {
        "part": "appconfig create",
        "role": "Store Creation",
        "desc": "Khởi tạo kho cấu hình tập trung phân tán"
      },
      {
        "part": "--sku Standard",
        "role": "Service Tier",
        "desc": "Gói tiêu chuẩn hỗ trợ phục hồi điểm thời gian, private endpoint và không giới hạn request"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "--sku Standard",
      "meaning": "Gói tính phí Standard hỗ trợ đầy đủ các tính năng doanh nghiệp so với gói Free."
    }
  ],
  "whyThisMatters": "Azure App Configuration cung cấp kho lưu trữ cấu hình tập trung độc lập với chu kỳ triển khai mã nguồn và container.",
  "examTip": "⭐ Gói Free chỉ cho phép 1 store duy nhất trên 1 subscription; trong môi trường doanh nghiệp luôn dùng SKU Standard."
},
  {
  "id": "l12-assign-appconfig-data-owner",
  "level": 12,
  "title": "10. Phân Quyền App Configuration Data Owner",
  "difficulty": "Trung bình",
  "category": "Azure App Configuration",
  "mission": "Gán quyền RBAC `App Configuration Data Owner` cho user `$env:USER_OID` trên phạm vi kho `$APPCONFIG_ID` để quản lý key-values và Key Vault references.",
  "expectedCommand": "az role assignment create --role \"App Configuration Data Owner\" --assignee $env:USER_OID --scope $APPCONFIG_ID",
  "aliases": [],
  "tokens": [
    "az",
    "role",
    "assignment",
    "create",
    "--role",
    "\"App Configuration Data Owner\"",
    "--assignee",
    "$env:USER_OID",
    "--scope",
    "$APPCONFIG_ID"
  ],
  "hints": [
    "Dùng `az role assignment create`.",
    "Chỉ định vai trò `--role \"App Configuration Data Owner\"` trên `--scope $APPCONFIG_ID`."
  ],
  "mentalModel": {
    "rule": "az role assignment create --role <Role> --assignee <OID> --scope <Scope>",
    "breakdown": [
      {
        "part": "role assignment create",
        "role": "Data Plane RBAC",
        "desc": "Cấp quyền thao tác các key-values"
      },
      {
        "part": "--role \"App Configuration Data Owner\"",
        "role": "Role",
        "desc": "Vai trò toàn quyền đọc ghi cấu hình và tính năng (Feature Flags)"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "App Configuration Data Owner",
      "meaning": "Vai trò dữ liệu đầy đủ nhất cho phép quản trị key-value, snapshot và nhãn."
    },
    {
      "param": "App Configuration Data Reader",
      "meaning": "Vai trò chỉ đọc thường cấp cho Managed Identity của ứng dụng tiêu thụ."
    }
  ],
  "whyThisMatters": "Sử dụng RBAC thay cho connection string truy cập App Configuration giúp loại bỏ hoàn toàn việc quản lý secret trong mã nguồn.",
  "examTip": "⭐ Phải mất từ 1-2 phút sau khi gán role RBAC để chính sách token AAD có hiệu lực trên App Configuration SDK."
},
  {
  "id": "l12-set-appconfig-default-kv",
  "level": 12,
  "title": "11. Thiết Lập Key-Value Mặc Định (Không Nhãn)",
  "difficulty": "Cơ bản",
  "category": "Azure App Configuration",
  "mission": "Thiết lập cấu hình mặc định (unlabeled / null label) `OpenAI:Endpoint` với giá trị `\"https://my-openai.openai.azure.com/\"` trong store `$env:APPCONFIG_NAME` mà không cần xác nhận (`--yes`).",
  "expectedCommand": "az appconfig kv set --name $env:APPCONFIG_NAME --key \"OpenAI:Endpoint\" --value \"https://my-openai.openai.azure.com/\" --yes",
  "aliases": [
    "az appconfig kv set -n $env:APPCONFIG_NAME --key \"OpenAI:Endpoint\" --value \"https://my-openai.openai.azure.com/\" --yes"
  ],
  "tokens": [
    "az",
    "appconfig",
    "kv",
    "set",
    "--name",
    "$env:APPCONFIG_NAME",
    "--key",
    "\"OpenAI:Endpoint\"",
    "--value",
    "\"https://my-openai.openai.azure.com/\"",
    "--yes"
  ],
  "hints": [
    "Dùng `az appconfig kv set`.",
    "Cờ `--name $env:APPCONFIG_NAME`.",
    "Thêm cờ `--yes` để bỏ qua bước xác nhận tương tác."
  ],
  "mentalModel": {
    "rule": "az appconfig kv set --name <Store> --key <Key> --value <Value> --yes",
    "breakdown": [
      {
        "part": "appconfig kv set",
        "role": "Write Key-Value",
        "desc": "Tạo hoặc cập nhật cấu hình"
      },
      {
        "part": "--key OpenAI:Endpoint",
        "role": "Hierarchical Key",
        "desc": "Khóa phân cấp ngăn cách bằng dấu hai chấm"
      },
      {
        "part": "--yes",
        "role": "Non-interactive",
        "desc": "Tự động chấp thuận thao tác ghi đè"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "--key",
      "meaning": "Tên khóa cấu hình, hỗ trợ cú pháp phân cấp như Section:Subsection:Setting."
    },
    {
      "param": "--yes",
      "meaning": "Bỏ qua nhắc nhở xác nhận ghi đè trong script tự động hóa."
    }
  ],
  "whyThisMatters": "Các cấu hình không gắn nhãn (unlabeled) hoạt động như các giá trị fallback mặc định cho tất cả môi trường triển khai.",
  "examTip": "⭐ Trong Python App Configuration SDK, khóa không nhãn được lọc bằng ký hiệu `label_filter=\"\\0\"`."
},
  {
  "id": "l12-set-appconfig-labeled-kv",
  "level": 12,
  "title": "12. Thiết Lập Cấu Hình Có Nhãn Môi Trường",
  "difficulty": "Cơ bản",
  "category": "Azure App Configuration",
  "mission": "Thiết lập cấu hình `Pipeline:BatchSize` có giá trị `\"200\"` kèm nhãn `--label \"Production\"` trong store `$env:APPCONFIG_NAME` để ghi đè thiết lập khi chạy môi trường Prod.",
  "expectedCommand": "az appconfig kv set --name $env:APPCONFIG_NAME --key \"Pipeline:BatchSize\" --value \"200\" --label \"Production\" --yes",
  "aliases": [
    "az appconfig kv set -n $env:APPCONFIG_NAME --key \"Pipeline:BatchSize\" --value \"200\" --label \"Production\" --yes"
  ],
  "tokens": [
    "az",
    "appconfig",
    "kv",
    "set",
    "--name",
    "$env:APPCONFIG_NAME",
    "--key",
    "\"Pipeline:BatchSize\"",
    "--value",
    "\"200\"",
    "--label",
    "\"Production\"",
    "--yes"
  ],
  "hints": [
    "Dùng `az appconfig kv set`.",
    "Bổ sung cờ `--label \"Production\"` để phân biệt môi trường."
  ],
  "mentalModel": {
    "rule": "az appconfig kv set --name <Store> --key <Key> --value <Val> --label <Label> --yes",
    "breakdown": [
      {
        "part": "appconfig kv set",
        "role": "Write Labeled Setting",
        "desc": "Ghi cấu hình chuyên biệt theo ngữ cảnh"
      },
      {
        "part": "--label Production",
        "role": "Environment Label",
        "desc": "Gắn nhãn định danh phiên bản môi trường"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "--label",
      "meaning": "Nhãn phân loại (e.g. Production, Staging, v1.0), cho phép cùng một tên key có nhiều giá trị theo ngữ cảnh."
    }
  ],
  "whyThisMatters": "Kỹ thuật Label Stacking cho phép nạp cấu hình mặc định rồi xếp đè cấu hình Prod lên trên mà không trùng lặp mã cấu hình.",
  "examTip": "⭐ Khóa có nhãn cùng tên sẽ đè lên khóa không nhãn nếu selector nạp theo thứ tự default -> environment."
},
  {
  "id": "l12-set-appconfig-keyvault-ref",
  "level": 12,
  "title": "13. Tạo Key Vault Reference Trong App Configuration",
  "difficulty": "Trung bình",
  "category": "Security Integration",
  "mission": "Tạo một Key Vault Reference trong `$env:APPCONFIG_NAME` với tên key `\"OpenAI:ApiKey\"`, trỏ tới bí mật qua định danh `--secret-identifier $SECRET_URI` và tự động chấp thuận (`--yes`).",
  "expectedCommand": "az appconfig kv set-keyvault --name $env:APPCONFIG_NAME --key \"OpenAI:ApiKey\" --secret-identifier $SECRET_URI --yes",
  "aliases": [
    "az appconfig kv set-keyvault -n $env:APPCONFIG_NAME --key \"OpenAI:ApiKey\" --secret-identifier $SECRET_URI --yes"
  ],
  "tokens": [
    "az",
    "appconfig",
    "kv",
    "set-keyvault",
    "--name",
    "$env:APPCONFIG_NAME",
    "--key",
    "\"OpenAI:ApiKey\"",
    "--secret-identifier",
    "$SECRET_URI",
    "--yes"
  ],
  "hints": [
    "Sử dụng lệnh `az appconfig kv set-keyvault`.",
    "Cờ chỉ định URI bí mật là `--secret-identifier`."
  ],
  "mentalModel": {
    "rule": "az appconfig kv set-keyvault --name <Store> --key <Key> --secret-identifier <Uri> --yes",
    "breakdown": [
      {
        "part": "appconfig kv set-keyvault",
        "role": "Reference Linker",
        "desc": "Tạo liên kết cấu hình tham chiếu tới Key Vault"
      },
      {
        "part": "--secret-identifier $SECRET_URI",
        "role": "Target Secret URI",
        "desc": "Đường dẫn URI của bí mật trong Key Vault"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "set-keyvault",
      "meaning": "Lệnh chuyên biệt của Azure CLI để thiết lập Key Vault Reference trong App Configuration."
    },
    {
      "param": "--secret-identifier",
      "meaning": "URI đầy đủ của secret trong Azure Key Vault (ví dụ: https://my-kv.vault.azure.net/secrets/my-secret)."
    }
  ],
  "whyThisMatters": "Ứng dụng chỉ cần đọc một nguồn duy nhất (App Configuration) mà vẫn lấy được cả thông số cấu hình thường lẫn dữ liệu bí mật được bảo vệ bởi Key Vault.",
  "examTip": "⭐ Kiểu nội dung của Key Vault reference là `application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8`."
},
  {
  "id": "l12-set-appconfig-sentinel",
  "level": 12,
  "title": "14. Thiết Lập Sentinel Key Cho Dynamic Refresh",
  "difficulty": "Cơ bản",
  "category": "Azure App Configuration",
  "mission": "Khởi tạo khóa canh gác `Sentinel` với giá trị ban đầu `\"1\"` trong store `$env:APPCONFIG_NAME` để dùng làm tín hiệu kích hoạt Dynamic Refresh cho ứng dụng mà không cần restart.",
  "expectedCommand": "az appconfig kv set --name $env:APPCONFIG_NAME --key \"Sentinel\" --value \"1\" --yes",
  "aliases": [
    "az appconfig kv set -n $env:APPCONFIG_NAME --key \"Sentinel\" --value \"1\" --yes"
  ],
  "tokens": [
    "az",
    "appconfig",
    "kv",
    "set",
    "--name",
    "$env:APPCONFIG_NAME",
    "--key",
    "\"Sentinel\"",
    "--value",
    "\"1\"",
    "--yes"
  ],
  "hints": [
    "Dùng `az appconfig kv set`.",
    "Khóa là `\"Sentinel\"` và giá trị `\"1\"`."
  ],
  "mentalModel": {
    "rule": "az appconfig kv set --name <Store> --key \"Sentinel\" --value <VersionNum> --yes",
    "breakdown": [
      {
        "part": "key \"Sentinel\"",
        "role": "Watchdog Key",
        "desc": "Khóa đóng vai trò kích hoạt cập nhật động"
      },
      {
        "part": "value \"1\"",
        "role": "Revision",
        "desc": "Tăng giá trị này mỗi khi có thay đổi cấu hình cần client reload"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "Sentinel",
      "meaning": "Mô hình thiết kế chuẩn: ứng dụng chỉ cần theo dõi một khóa duy nhất thay vì kiểm tra hàng trăm khóa riêng lẻ."
    }
  ],
  "whyThisMatters": "Giảm thiểu 99% số lượng request kiểm tra cấu hình gửi tới Azure App Configuration, tối ưu chi phí và tránh bị rate limiting.",
  "examTip": "⭐ Trong Python SDK, thiết lập `refresh_on=[\"Sentinel\"]` kết hợp với hàm gọi định kỳ `provider.refresh()`."
},
  {
  "id": "l12-keyvault-purge-deleted",
  "level": 12,
  "title": "15. Xóa Vĩnh Viễn Key Vault Đã Bị Soft-Delete",
  "difficulty": "Nâng cao",
  "category": "Lifecycle & Cleanup",
  "mission": "Xóa vĩnh viễn (purge) Key Vault `$env:KV_NAME` đang ở trạng thái soft-deleted mà không chờ lệnh hoàn tất (`--no-wait`) để giải phóng hoàn toàn tên vault trên toàn cầu.",
  "expectedCommand": "az keyvault purge --name $env:KV_NAME --no-wait",
  "aliases": [
    "az keyvault purge -n $env:KV_NAME --no-wait"
  ],
  "tokens": [
    "az",
    "keyvault",
    "purge",
    "--name",
    "$env:KV_NAME",
    "--no-wait"
  ],
  "hints": [
    "Sử dụng lệnh `az keyvault purge`.",
    "Cờ bất đồng bộ là `--no-wait`."
  ],
  "mentalModel": {
    "rule": "az keyvault purge --name <VaultName> --no-wait",
    "breakdown": [
      {
        "part": "keyvault purge",
        "role": "Permanent Destruction",
        "desc": "Tiêu hủy hoàn toàn kho bí mật khỏi trạng thái soft-deleted"
      },
      {
        "part": "--no-wait",
        "role": "Async Execution",
        "desc": "Trả quyền điều khiển terminal ngay mà không đợi thao tác dọn dẹp kết thúc"
      }
    ]
  },
  "parametersExplanation": [
    {
      "param": "purge",
      "meaning": "Xóa vĩnh viễn và không thể khôi phục được nữa. Chỉ thực hiện được nếu Vault KHÔNG kích hoạt Purge Protection."
    }
  ],
  "whyThisMatters": "Tên Key Vault có phạm vi duy nhất trên toàn cầu (DNS `*.vault.azure.net`). Khi test lab bị trùng tên cũ đã xóa, cần purge để có thể tạo lại.",
  "examTip": "⭐ Nếu một Key Vault đã được bật Purge Protection, lệnh purge sẽ thất bại cho đến khi hết hạn thời gian lưu giữ (thường là 90 ngày)."
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
  },
  {
    id: "q22",
    question: "Khi cấu hình tính năng Vector Search trên Azure Cosmos DB for NoSQL, loại chỉ mục vector nào (vector index type) sử dụng thuật toán đồ thị của Microsoft Research để tối ưu hóa truy vấn Nearest Neighbor (ANN) trên ổ đĩa SSD với độ trễ thấp?",
    options: [
      "flat (brute-force k-NN)",
      "diskANN",
      "inverted-index (IVF)",
      "hash-lsh"
    ],
    correctIndex: 1,
    explanation: "DiskANN là thuật toán tìm kiếm vector láng giềng gần nhất xấp xỉ (Approximate Nearest Neighbor - ANN) hiệu năng cao do Microsoft Research phát triển, được tối ưu hóa đặc biệt cho ổ đĩa SSD với chi phí RU thấp và độ chính xác cao vượt trội so với flat."
  },
  {
    id: "q23",
    question: "Tại sao trong chính sách đánh chỉ mục (Indexing Policy) của container Cosmos DB hỗ trợ vector search, trường chứa mảng vector như `/embedding/*` bắt buộc phải được đưa vào danh sách `excludedPaths`?",
    options: [
      "Để kích hoạt mã hóa dữ liệu đầu cuối cho mảng số thực.",
      "Để ngăn Cosmos DB đánh chỉ mục B-Tree chuẩn lên mảng số thực hàng trăm chiều, tránh gây phình to dung lượng lưu trữ và tiêu tốn RU/s đột biến khi nạp tài liệu.",
      "Vì hệ thống NoSQL không cho phép đọc mảng float32.",
      "Để cho phép sao lưu container lên Azure Blob Storage."
    ],
    correctIndex: 1,
    explanation: "Mặc định Cosmos DB sẽ tự động đánh chỉ mục B-Tree cho mọi thuộc tính JSON (`/*`). Việc loại trừ `/embedding/*` trong `excludedPaths` ngăn B-Tree index đánh chỉ mục từng số float trong vector, để toàn bộ việc tìm kiếm vector do chuyên biệt DiskANN index trong `vectorIndexes` đảm nhiệm."
  },
  {
    id: "q24",
    question: "Trong câu lệnh SQL của Azure Cosmos DB for NoSQL, hàm tích hợp sẵn nào được sử dụng để tính toán khoảng cách hoặc độ tương đồng giữa embedding lưu trong tài liệu và vector câu hỏi của người dùng?",
    options: [
      "VectorDistance(c.embedding, @query_embedding)",
      "CosineSimilarity(c.embedding, @query_embedding)",
      "DistanceTo(c.embedding, @query_embedding)",
      "VectorMatch(c.embedding, @query_embedding)"
    ],
    correctIndex: 0,
    explanation: "Hàm chuẩn được tích hợp sẵn trong Cosmos DB NoSQL là `VectorDistance(c.path, @vector)` và có thể dùng trong mệnh đề `ORDER BY VectorDistance(...)` để sắp xếp kết quả tương đồng nhất."
  },
  {
    id: "q25",
    question: "Trong kiến trúc bảo mật Azure Entra ID (Zero Trust) cho Cosmos DB, sự khác biệt then chốt giữa Azure RBAC Contributor và Data Plane Role 'Cosmos DB Built-in Data Contributor' là gì?",
    options: [
      "Không có sự khác biệt nào, hai vai trò có quyền hoàn toàn như nhau.",
      "Azure RBAC Contributor chỉ có quyền quản trị tài nguyên qua ARM (tạo/xóa database, container), còn để ứng dụng đọc/ghi dữ liệu và thực hiện truy vấn Vector Search qua DefaultAzureCredential thì bắt buộc phải gán quyền Data Plane 'Cosmos DB Built-in Data Contributor'.",
      "Azure RBAC Contributor chỉ áp dụng cho máy chủ Windows.",
      "Data Plane role chỉ dành riêng cho quản trị viên thanh toán cước phí."
    ],
    correctIndex: 1,
    explanation: "Azure Cosmos DB tách bạch rạch ròi giữa Control Plane (ARM RBAC) và Data Plane (Cosmos DB SQL RBAC). Gán Azure Contributor qua `az role assignment create` không cho phép đọc/ghi document; bạn bắt buộc phải dùng `az cosmosdb sql role assignment create` để cấp quyền Data Plane cho `DefaultAzureCredential()`."
  },
  {
    id: "q26",
    question: "Trong Azure Cosmos DB for NoSQL, phương thức truy xuất nào dưới đây có độ trễ thấp nhất (< 5ms) và tiêu tốn lượng Request Unit (RU) tối thiểu cố định chỉ 1.0 RU khi đọc tài liệu có kích thước dưới 1 KB?",
    options: [
      "Câu lệnh SQL SELECT * FROM c WHERE c.id = @id",
      "Point Read thông qua hàm container.read_item(item=id, partition_key=pk)",
      "Truy vấn SQL có phân trang OFFSET 0 LIMIT 1",
      "Đọc thông qua Azure Synapse Link"
    ],
    correctIndex: 1,
    explanation: "Point Read đọc trực tiếp dữ liệu từ phân vùng vật lý dựa trên cặp khóa (id, partitionKey) mà không cần đi qua bộ biên dịch và tối ưu hóa truy vấn SQL, đảm bảo chi phí thấp nhất (đúng 1.0 RU cho item <= 1KB) và độ trễ dưới 5ms."
  },
  {
    id: "q27",
    question: "Khi thiết kế cấu trúc lưu trữ các đoạn văn bản (chunks) cho kiến trúc RAG (Retrieval-Augmented Generation) trên Cosmos DB NoSQL, tại sao chọn `/documentId` làm Partition Key lại tối ưu hơn việc dùng trường `/id` ngẫu nhiên?",
    options: [
      "Vì Cosmos DB quy định mọi container lưu text bắt buộc phải có partition key là /documentId.",
      "Để gom toàn bộ các chunks thuộc cùng một tài liệu vào chung một phân vùng vật lý, giúp câu lệnh truy xuất toàn bộ ngữ cảnh tài liệu cho LLM luôn là Single-Partition Query (chỉ ~2.5 - 3.5 RU) thay vì phải Fan-out ra toàn bộ hệ thống.",
      "Để tự động xóa tài liệu sau 30 ngày.",
      "Để giảm kích thước vector embedding xuống một nửa."
    ],
    correctIndex: 1,
    explanation: "Bằng cách chọn `/documentId` làm Partition Key, tất cả các chunk sinh ra từ cùng một văn bản nguồn sẽ nằm chung một logical/physical partition. Khi LLM cần đọc toàn bộ tài liệu theo thứ tự chunkIndex, Cosmos DB chỉ cần truy vấn trên 1 phân vùng duy nhất, tối ưu chi phí RU và loại bỏ Cross-Partition Fan-out."
  },
  {
    id: "q28",
    question: "Trong câu lệnh truy vấn NoSQL SQL của Azure Cosmos DB, hàm tích hợp sẵn nào được dùng để kiểm tra xem một giá trị có nằm trong mảng JSON (ví dụ mảng tags: ['azure', 'nosql', 'rag']) hay không?",
    options: [
      "CONTAINS(c.metadata.tags, 'nosql')",
      "ARRAY_CONTAINS(c.metadata.tags, 'nosql')",
      "IN_ARRAY(c.metadata.tags, 'nosql')",
      "HAS_ITEM(c.metadata.tags, 'nosql')"
    ],
    correctIndex: 1,
    explanation: "Hàm chuẩn của Cosmos DB NoSQL là `ARRAY_CONTAINS(c.path.to.array, value)` để lọc các tài liệu có mảng chứa phần tử cần tìm."
  },
  {
    id: "q29",
    question: "Khi tương tác với Cosmos DB bằng Azure SDK (Python), thuộc tính HTTP header phản hồi nào cho phép lập trình viên đo lường chính xác lượng Request Units (RU) đã tiêu hao sau mỗi thao tác để phân tích và tối ưu hóa chi phí hệ thống?",
    options: [
      "x-ms-request-charge",
      "x-ms-ru-consumed",
      "x-ms-billing-rate",
      "x-ms-cost-metric"
    ],
    correctIndex: 0,
    explanation: "Mọi thao tác thành công trên Cosmos DB đều trả về header `x-ms-request-charge` thể hiện chính xác số RU đã tiêu tốn (ví dụ: `container.client_connection.last_response_headers['x-ms-request-charge']`)."
  },
  {
    id: "q30",
    question: "Trong 3 loại Vector Index của Azure Cosmos DB for NoSQL (flat, quantizedFlat, diskANN), loại chỉ mục nào sử dụng kỹ thuật nén Scalar Quantization để giảm dung lượng bộ nhớ RAM nhưng vẫn duy trì độ chính xác tìm kiếm cao trên tập dữ liệu trung bình (10,000 - 100,000 vectors)?",
    options: [
      "flat",
      "quantizedFlat",
      "diskANN",
      "inverted-index"
    ],
    correctIndex: 1,
    explanation: "Chỉ mục `quantizedFlat` nén các vector số thực 32-bit (float32) thành các giá trị biểu diễn nén kích thước nhỏ hơn thông qua kỹ thuật Scalar Quantization, giúp giảm đáng kể bộ nhớ tiêu thụ trong khi vẫn giữ được chất lượng tìm kiếm rất gần với exact search."
  },
  {
    id: "q31",
    question: "Trong chính sách Vector Embedding Policy của Azure Cosmos DB for NoSQL, dịch vụ hỗ trợ những hàm đo khoảng cách vector (distanceFunction) nào dưới đây?",
    options: [
      "cosine, dotproduct, euclidean",
      "manhattan, hamming, jaccard",
      "haversine, chebyshev, minkowski",
      "chỉ duy nhất hàm cosine"
    ],
    correctIndex: 0,
    explanation: "Azure Cosmos DB for NoSQL hỗ trợ 3 hàm khoảng cách vector chuẩn: `cosine` (khoảng cách cosin), `dotproduct` (tích vô hướng), và `euclidean` (khoảng cách Ơ-clit)."
  },
  {
    id: "q32",
    question: "Giới hạn số chiều (dimensions) tối đa cho một vector embedding được lưu trữ và đánh chỉ mục trong Azure Cosmos DB for NoSQL là bao nhiêu?",
    options: [
      "256 chiều",
      "1,536 chiều",
      "4,096 chiều",
      "8,192 chiều"
    ],
    correctIndex: 2,
    explanation: "Azure Cosmos DB for NoSQL hỗ trợ kích thước vector tối đa lên đến 4,096 chiều (dimensions), tương thích hoàn hảo với các mô hình embedding tiên tiến nhất như text-embedding-3-large (3,072 dims) của OpenAI hay Cohere Embed."
  }
,
  {
    id: "q33",
    question: "Để có thể chạy thành công câu lệnh `CREATE EXTENSION IF NOT EXISTS vector;` trên Azure Database for PostgreSQL Flexible Server, tham số cấu hình cấp máy chủ (Server Parameter) nào bắt buộc phải được thiết lập trước?",
    options: [
      "azure.extensions",
      "shared_preload_libraries",
      "wal_level",
      "custom_variable_classes"
    ],
    correctIndex: 0,
    explanation: "Azure Database for PostgreSQL kiểm soát nghiêm ngặt các tiện ích mở rộng qua tham số máy chủ `azure.extensions`. Bạn bắt buộc phải cấu hình đưa `vector` vào allow-list của tham số này trước khi có thể kích hoạt extension trong cơ sở dữ liệu."
  },
  {
    id: "q34",
    question: "Khi xác thực ứng dụng với Azure Database for PostgreSQL bằng Microsoft Entra ID Token (không dùng mật khẩu tĩnh), lệnh Azure CLI nào cung cấp Bearer Access Token chính xác cho loại tài nguyên này?",
    options: [
      "az account get-access-token --resource-type oss-rdbms",
      "az account get-access-token --resource https://graph.microsoft.com",
      "az postgres token generate --server <name>",
      "az keyvault secret show --name db-password"
    ],
    correctIndex: 0,
    explanation: "Cờ `--resource-type oss-rdbms` yêu cầu cấp token với audience scope là `https://ossrdbms-aad.database.windows.net/.default`, dành riêng cho dịch vụ cơ sở dữ liệu mã nguồn mở của Azure như PostgreSQL Flexible Server."
  },
  {
    id: "q35",
    question: "Trong tiện ích mở rộng pgvector của PostgreSQL, toán tử (operator) nào được sử dụng để tính toán khoảng cách Cosine (Cosine Distance) giữa hai vector embeddings?",
    options: [
      "<=>",
      "<->",
      "<#>",
      "<+>"
    ],
    correctIndex: 0,
    explanation: "Toán tử `<=>` trong pgvector đại diện cho Cosine Distance (khoảng cách cosin: 0 = trùng khớp, 2 = hoàn toàn đối nghịch). Trong khi đó, `<->` là khoảng cách L2 Euclidean, còn `<#>` là tích vô hướng âm (negative inner product)."
  },
  {
    id: "q36",
    question: "Khi tạo chỉ mục đồ thị phân tầng HNSW (`CREATE INDEX ... USING hnsw`) trong pgvector, tham số `m` và `ef_construction` có vai trò gì trong kiến trúc?",
    options: [
      "m là số kết nối tối đa cho mỗi node; ef_construction là kích thước danh sách ứng viên động trong quá trình xây dựng đồ thị.",
      "m là số lõi CPU song song; ef_construction là lượng bộ nhớ RAM gán cho index.",
      "m là số chiều vector; ef_construction là độ sâu tối đa của cây đồ thị.",
      "m là số cụm phân vùng; ef_construction là số probe quét khi truy vấn."
    ],
    correctIndex: 0,
    explanation: "Trong HNSW: `m` (mặc định 16) là số lượng liên kết tối đa giữa một node với các lân cận trên mỗi tầng đồ thị. `ef_construction` (mặc định 64) xác định kích thước danh sách lân cận tiềm năng được xem xét khi nạp vector vào chỉ mục; giá trị càng cao thì chất lượng đồ thị càng tốt nhưng tốn thời gian build lâu hơn."
  },
  {
    id: "q37",
    question: "Trong quá trình tìm kiếm vector thời điểm truy vấn (query-time) sử dụng chỉ mục HNSW, biến phiên làm việc nào có thể tăng lên để nâng cao độ chính xác thu hồi (Recall) nhưng đánh đổi làm tăng nhẹ độ trễ (latency)?",
    options: [
      "hnsw.ef_search",
      "ivfflat.probes",
      "work_mem",
      "shared_buffers"
    ],
    correctIndex: 0,
    explanation: "Thiết lập `SET hnsw.ef_search = 100;` (mặc định 40) mở rộng danh sách ứng viên được khám phá trong quá trình duyệt đồ thị lúc truy vấn, giúp tìm kiếm ra các lân cận gần nhất thực sự với Recall cao hơn."
  },
  {
    id: "q38",
    question: "Quy tắc kinh nghiệm (rule of thumb) chuẩn mực để xác định số lượng cụm phân vùng `lists` khi tạo chỉ mục IVFFlat (`WITH (lists = ... )`) cho tập dữ liệu có tối đa 1 triệu hàng là gì?",
    options: [
      "lists = rows / 1000",
      "lists = sqrt(rows)",
      "lists = 10 * rows",
      "lists = 16"
    ],
    correctIndex: 0,
    explanation: "Đối với bảng có đến 1 triệu hàng, khuyến nghị chuẩn là `lists = rows / 1000` (ví dụ: 100,000 hàng thì lists = 100). Với tập dữ liệu trên 1 triệu hàng, công thức thường dùng là `lists = sqrt(rows)`."
  },
  {
    id: "q39",
    question: "So sánh giữa hai loại chỉ mục vector phổ biến trong pgvector: HNSW và IVFFlat, nhận định nào sau đây là CHÍNH XÁC?",
    options: [
      "HNSW cho tốc độ truy vấn nhanh hơn, Recall cao hơn ngay từ đầu và hỗ trợ chèn dữ liệu tăng dần (incremental) mà không cần build lại toàn bộ, nhưng tốn nhiều RAM và thời gian build hơn IVFFlat.",
      "IVFFlat có tốc độ truy vấn nhanh hơn và Recall vượt trội hơn HNSW trong mọi tình huống.",
      "HNSW yêu cầu phải huấn luyện lại toàn bộ chỉ mục mỗi khi có vector mới được thêm vào.",
      "IVFFlat tốn dung lượng RAM cao hơn HNSW gấp nhiều lần."
    ],
    correctIndex: 0,
    explanation: "HNSW vượt trội về tốc độ truy vấn và độ chính xác out-of-the-box, đặc biệt hỗ trợ cập nhật tăng dần linh hoạt, bù lại đòi hỏi dung lượng bộ nhớ RAM lớn hơn và thời gian xây dựng đồ thị ban đầu lâu hơn IVFFlat."
  },
  {
    id: "q40",
    question: "Khi thực thi `EXPLAIN ANALYZE` cho câu lệnh tìm kiếm tương đồng vector trên bảng sản phẩm chưa được tạo bất kỳ chỉ mục vector nào, kế hoạch thực thi sẽ hiển thị nút (Plan Node) nào thể hiện việc quét toàn bộ cơ sở dữ liệu?",
    options: [
      "Seq Scan on products",
      "Index Scan using idx_products",
      "Bitmap Index Scan",
      "Index Only Scan"
    ],
    correctIndex: 0,
    explanation: "Khi không có chỉ mục vector, PostgreSQL buộc phải thực hiện quét tuần tự (`Seq Scan`), tính toán khoảng cách vector cho toàn bộ 100,000 dòng dữ liệu, dẫn đến độ trễ rất cao (thường từ vài trăm ms đến vài giây)."
  },
  {
    id: "q41",
    question: "Trước khi thực hiện tạo chỉ mục HNSW trên bảng dữ liệu lớn (như 100,000 vector 384 chiều), thiết lập bộ nhớ nào của PostgreSQL nên được tăng tạm thời trong phiên làm việc để tránh lỗi thiếu RAM và tối ưu tốc độ dựng đồ thị?",
    options: [
      "SET maintenance_work_mem = '256MB';",
      "SET max_connections = 1000;",
      "SET autovacuum = off;",
      "SET synchronous_commit = off;"
    ],
    correctIndex: 0,
    explanation: "Tham số `maintenance_work_mem` kiểm soát dung lượng bộ nhớ tối đa dành cho các tác vụ bảo trì như `CREATE INDEX`. Đặt lên 256MB hoặc 512MB giúp quá trình xây dựng đồ thị HNSW diễn ra hoàn toàn trong RAM và nhanh hơn đáng kể."
  },
  {
    id: "q42",
    question: "Trong kiến trúc bộ nhớ và checkpoint trạng thái của AI Agent (Agent Memory Backend) trên PostgreSQL, cú pháp SQL nào cho phép lưu vết hoặc cập nhật checkpoint một cách nguyên tử (atomic upsert) dựa trên cặp khóa (conversation_id, task_name)?",
    options: [
      "INSERT INTO task_checkpoints (...) VALUES (...) ON CONFLICT (conversation_id, task_name) DO UPDATE SET status = EXCLUDED.status, checkpoint_data = EXCLUDED.checkpoint_data, updated_at = CURRENT_TIMESTAMP",
      "UPDATE task_checkpoints SET ... WHERE NOT EXISTS (INSERT INTO ...)",
      "UPSERT INTO task_checkpoints VALUES (...)",
      "MERGE INTO task_checkpoints USING dual ON ..."
    ],
    correctIndex: 0,
    explanation: "Cú pháp `ON CONFLICT (conversation_id, task_name) DO UPDATE SET ...` của PostgreSQL là cơ chế Idempotent Upsert tiêu chuẩn, bảo đảm tiến trình AI Agent có thể cập nhật trạng thái nhiệm vụ an toàn ngay cả khi bị gián đoạn hay khởi động lại."
  }
,
  {
    id: "q43",
    question: "Cổng kết nối TCP tiêu chuẩn và yêu cầu mã hóa mạng bắt buộc khi kết nối ứng dụng với Azure Managed Redis (AMR / Redis Enterprise) là gì?",
    options: [
      "Cổng 10000 và bắt buộc bật SSL/TLS (ssl=True)",
      "Cổng 6379 và không cần SSL",
      "Cổng 443 HTTPS",
      "Cổng 5432 SSL"
    ],
    correctIndex: 0,
    explanation: "Azure Managed Redis (Enterprise tier) chuẩn hóa việc sử dụng cổng TCP 10000 (thay vì 6379 của Redis mã nguồn mở truyền thống) và bắt buộc bật mã hóa đường truyền TLS/SSL (Encrypted)."
  },
  {
    id: "q44",
    question: "Khi sử dụng thư viện `redis-entraid` để kết nối ứng dụng Python với Azure Managed Redis không dùng access keys tĩnh, scope định danh nào được dùng để phát hành token Microsoft Entra ID?",
    options: [
      "https://redis.azure.com/.default",
      "https://ossrdbms-aad.database.windows.net/.default",
      "https://management.azure.com/.default",
      "https://graph.microsoft.com/.default"
    ],
    correctIndex: 0,
    explanation: "Thư viện `redis-entraid` sử dụng hàm `create_from_default_azure_credential((\"https://redis.azure.com/.default\",))` để lấy và tự động refresh Bearer token của Microsoft Entra ID cấp riêng cho dịch vụ Azure Redis."
  },
  {
    id: "q45",
    question: "Trong Azure CLI, nhóm lệnh chuẩn mực nào được sử dụng để quản lý tài nguyên và cơ sở dữ liệu Azure Managed Redis (AMR)?",
    options: [
      "az redisenterprise",
      "az redis",
      "az cache",
      "az cosmosdb redis"
    ],
    correctIndex: 0,
    explanation: "Nhóm lệnh `az redisenterprise` quản lý các cụm Azure Managed Redis và Azure Cache for Redis Enterprise tier. Nhóm lệnh `az redis` chỉ dành cho các phiên bản Basic/Standard cũ."
  },
  {
    id: "q46",
    question: "Trong kiến trúc Pub/Sub của Redis, điểm khác biệt căn bản nhất giữa Redis Pub/Sub và các dịch vụ hàng đợi tin nhắn bền vững như Azure Event Hubs hay Azure Service Bus là gì?",
    options: [
      "Redis Pub/Sub là cơ chế gửi tin tạm thời 'Fire-and-Forget' (nếu subscriber không online lúc tin được phát, tin nhắn sẽ bị hủy ngay và không lưu trữ lại).",
      "Redis Pub/Sub lưu trữ tin nhắn vĩnh viễn trên ổ cứng SSD đến 90 ngày.",
      "Redis Pub/Sub chỉ cho phép tối đa 1 subscriber cho mỗi kênh.",
      "Redis Pub/Sub yêu cầu phải tạo schema JSON trước khi phát tin."
    ],
    correctIndex: 0,
    explanation: "Redis Pub/Sub phân phối thông điệp tức thời đến các subscriber đang kết nối trực tiếp ('at-most-once' / Fire-and-Forget). Nó không lưu trữ lịch sử tin nhắn như Redis Streams hay Azure Event Hubs."
  },
  {
    id: "q47",
    question: "Trong Redis Pub/Sub, cú pháp đăng ký nhận thông điệp nào cho phép lắng nghe đồng thời tất cả các kênh bắt đầu bằng tiền tố `orders:`, ví dụ `orders:created`, `orders:shipped`, `orders:cancelled`?",
    options: [
      "pubsub.psubscribe(\"orders:*\")",
      "pubsub.subscribe(\"orders:ALL\")",
      "pubsub.listen_all(\"orders\")",
      "pubsub.wildcard(\"orders\")"
    ],
    correctIndex: 0,
    explanation: "Phương thức `psubscribe()` (Pattern Subscribe) hỗ trợ ký tự đại diện wildcard `*` để đăng ký lắng nghe đồng thời tất cả các kênh thỏa mãn mẫu định dạng."
  },
  {
    id: "q48",
    question: "Khi định nghĩa chỉ mục vector RediSearch trong Azure Managed Redis bằng Python (`VectorField`), cấu hình nào sau đây là hợp lệ cho tìm kiếm ngữ nghĩa với HNSW?",
    options: [
      "VectorField(\"embedding\", \"HNSW\", {\"TYPE\": \"FLOAT32\", \"DIM\": 8, \"DISTANCE_METRIC\": \"COSINE\"})",
      "VectorField(\"embedding\", \"BTREE\", {\"TYPE\": \"INT64\"})",
      "VectorField(\"embedding\", \"FLAT\", {\"TYPE\": \"STRING\"})",
      "VectorField(\"embedding\", \"GRAPH\", {\"TYPE\": \"JSON\"})"
    ],
    correctIndex: 0,
    explanation: "Chỉ mục vector của RediSearch hỗ trợ thuật toán HNSW hoặc FLAT, với kiểu dữ liệu số thực `FLOAT32` hoặc `FLOAT64`, số chiều vector `DIM`, và khoảng cách `COSINE`, `L2`, hoặc `IP`."
  },
  {
    id: "q49",
    question: "Để lưu trữ vector embedding vào Redis Hash cho RediSearch đánh chỉ mục, mảng số thực (float list) bắt buộc phải được chuyển đổi sang định dạng nhị phân nào trước khi gọi `r.hset()`?",
    options: [
      "Dãy byte nhị phân thô (np.array(vector, dtype=np.float32).tobytes())",
      "Chuỗi JSON phân tách dấu phẩy (json.dumps(vector))",
      "Chuỗi Base64 có padding",
      "Mảng số nguyên Integer 16-bit"
    ],
    correctIndex: 0,
    explanation: "RediSearch yêu cầu dữ liệu vector trong Redis Hash phải ở dạng byte nhị phân thô (raw binary float bytes) thu được qua hàm `.tobytes()` của NumPy."
  },
  {
    id: "q50",
    question: "Trong RediSearch Dialect 2, cú pháp truy vấn K-Nearest Neighbors (KNN) nào được sử dụng để tìm 5 vector tương đồng nhất với vector tham số `$query_vec`?",
    options: [
      "*=>[KNN 5 @embedding $query_vec AS score]",
      "SELECT TOP 5 FROM embedding WHERE vector = $query_vec",
      "FIND NEAREST 5 TO $query_vec ON @embedding",
      "VECTOR_SEARCH(5, @embedding, $query_vec)"
    ],
    correctIndex: 0,
    explanation: "Cú pháp chuẩn của RediSearch KNN là `*=>[KNN <k> @<vector_field> $<param_name> AS <score_name>]` kết hợp với `.sort_by('score').dialect(2)`."
  },
  {
    id: "q51",
    question: "Trong cấu hình Azure Managed Redis Database, chính sách giải phóng bộ nhớ (Eviction Policy) `AllKeysLRU` hoạt động như thế nào khi bộ nhớ RAM đạt ngưỡng tối đa?",
    options: [
      "Tự động xóa các key ít được sử dụng gần đây nhất (Least Recently Used) trong toàn bộ cơ sở dữ liệu để nhường chỗ cho dữ liệu mới.",
      "Chỉ xóa các key đã được thiết lập thời gian hết hạn (TTL).",
      "Từ chối tất cả các lệnh ghi mới và trả về lỗi OOM (Out Of Memory).",
      "Tự động nén tất cả các key xuống 50% kích thước."
    ],
    correctIndex: 0,
    explanation: "`AllKeysLRU` giải phóng các key ít được truy cập gần đây nhất trên toàn bộ tập dữ liệu, đảm bảo Redis luôn duy trì bộ đệm nóng cho dữ liệu được truy cập thường xuyên nhất."
  },
  {
    id: "q52",
    question: "Khi gọi lệnh `r.ttl(key)` trong Redis, giá trị trả về `-1` và `-2` có ý nghĩa gì đối với vòng đời của key?",
    options: [
      "-1 có nghĩa key tồn tại vĩnh viễn (không cài đặt TTL); -2 có nghĩa key không tồn tại trong cơ sở dữ liệu.",
      "-1 có nghĩa key đã hết hạn; -2 có nghĩa database đang bị khóa.",
      "-1 có nghĩa lỗi mạng; -2 có nghĩa sai mật khẩu.",
      "Cả hai giá trị đều biểu thị key đã bị xóa."
    ],
    correctIndex: 0,
    explanation: "Theo chuẩn Redis: hàm `ttl(key)` trả về số giây còn lại của key; trả về `-1` nếu key không có hạn sử dụng (persists indefinitely); và trả về `-2` nếu key không tồn tại."
  }
,
  {
    id: "q53",
    question: "Trong Azure Service Bus, tại sao chế độ nhận tin 'Peek-Lock' (mặc định) lại được khuyến nghị cho các tác vụ suy luận AI thay vì 'Receive-and-Delete'?",
    options: [
      "Peek-Lock tạm khóa tin nhắn trong hàng đợi; nếu worker AI bị crash hoặc timeout, tin nhắn sẽ tự động được mở khóa để worker khác xử lý tiếp, đảm bảo tính At-least-once delivery.",
      "Peek-Lock xóa tin nhắn ngay lập tức khỏi queue để giải phóng dung lượng bộ nhớ.",
      "Peek-Lock yêu cầu mã hóa tin nhắn bằng chứng chỉ SSL hai chiều.",
      "Receive-and-Delete chỉ hoạt động trên Service Bus Topic chứ không hỗ trợ Queue."
    ],
    correctIndex: 0,
    explanation: "Chế độ Peek-Lock chỉ xóa tin nhắn khỏi hàng đợi sau khi consumer gọi `complete_message()`. Nếu có sự cố (crash, lỗi OOM), khóa lock hết hạn và tin nhắn sẽ được gửi lại, tránh mất mát dữ liệu suy luận quý giá."
  },
  {
    id: "q54",
    question: "Khi xử lý tin nhắn trong Azure Service Bus Queue, nếu nhận được một payload JSON bị lỗi cú pháp không thể parse, hành động nào là chuẩn thực hành an toàn nhất?",
    options: [
      "Gọi `dead_letter_message(msg, reason='MalformedPayload', error_description='...')` để chuyển tin nhắn vào hàng đợi Dead-Letter Queue (DLQ).",
      "Gọi `abandon_message(msg)` để tin nhắn được thử lại liên tục.",
      "Gọi `complete_message(msg)` để bỏ qua lỗi.",
      "Xóa toàn bộ hàng đợi và khởi tạo lại."
    ],
    correctIndex: 0,
    explanation: "Chuyển tin nhắn hỏng vào Dead-Letter Queue (DLQ) bằng `dead_letter_message()` kèm lý do rõ ràng giúp cô lập tin nhắn độc hại (poison message), ngăn không cho hệ thống rơi vào vòng lặp thử lại vô tận làm quá tải CPU."
  },
  {
    id: "q55",
    question: "Thuộc tính nào của `ServiceBusMessage` được sử dụng để truy vết mối liên hệ (End-to-End Tracing) giữa yêu cầu đầu vào của người dùng và các phản hồi suy luận do AI Agent sinh ra?",
    options: [
      "correlation_id",
      "message_id",
      "to",
      "content_type"
    ],
    correctIndex: 0,
    explanation: "`correlation_id` là trường metadata tiêu chuẩn dùng để liên kết các thông điệp có liên quan với nhau trong kiến trúc Request-Reply hoặc hệ thống AI đa tác tử phân tán."
  },
  {
    id: "q56",
    question: "Để Subscription chỉ nhận những tin nhắn có thuộc tính ứng dụng `priority = 'high'`, thao tác cấu hình nào là BẮT BUỘC trước khi tạo SQL Filter Rule mới?",
    options: [
      "Xóa quy tắc mặc định `$Default` (vốn tự động khớp 100% mọi tin nhắn).",
      "Nâng cấp Service Bus Namespace lên gói Premium.",
      "Khởi động lại Service Bus Namespace.",
      "Kích hoạt Partitioning trên Topic."
    ],
    correctIndex: 0,
    explanation: "Khi tạo Subscription mới, Service Bus luôn tự sinh một quy tắc `$Default` (`TrueFilter 1=1`). Nếu không xóa quy tắc này, subscription sẽ tiếp tục nhận toàn bộ tin nhắn bất kể có bộ lọc SQL hay không."
  },
  {
    id: "q57",
    question: "Vai trò phân quyền RBAC nào cấp quyền tối thiểu để một tiến trình chỉ có thể gửi tin nhắn vào Azure Service Bus Queue mà không được phép đọc hay xóa tin nhắn?",
    options: [
      "Azure Service Bus Data Sender",
      "Azure Service Bus Data Receiver",
      "Azure Service Bus Data Owner",
      "Contributor"
    ],
    correctIndex: 0,
    explanation: "`Azure Service Bus Data Sender` tuân thủ nguyên tắc đặc quyền tối thiểu (Least Privilege), chỉ cho phép đẩy tin nhắn vào hàng đợi/chủ đề mà không có quyền xem hay rút tin."
  },
  {
    id: "q58",
    question: "Điểm khác biệt kiến trúc CỐT LÕI giữa Azure Event Grid Namespace và Event Grid Basic Topics là gì?",
    options: [
      "Event Grid Namespace hỗ trợ cả mô hình Pull Delivery qua HTTP, giao thức MQTT Broker và chuẩn hóa schema CloudEvents v1.0.",
      "Event Grid Namespace chỉ hỗ trợ duy nhất Webhook Push.",
      "Event Grid Basic hỗ trợ dung lượng tin nhắn lên tới 50 MB.",
      "Event Grid Namespace không hỗ trợ lọc sự kiện theo Event Type."
    ],
    correctIndex: 0,
    explanation: "Event Grid Namespace là kiến trúc thế hệ mới, hỗ trợ Pull Delivery (consumer chủ động kéo sự kiện về không cần mở inbound endpoint), MQTT cho thiết bị IoT/edge và tiêu chuẩn CloudEvents v1.0 của CNCF."
  },
  {
    id: "q59",
    question: "Trong cơ chế Event Grid Pull Delivery, khi client gọi `consumer.reject(lock_tokens=[...])`, điều gì sẽ xảy ra với sự kiện đó?",
    options: [
      "Sự kiện được xác định là không thể xử lý (poison event); Event Grid sẽ đưa nó vào Dead-Letter container hoặc hủy bỏ nếu hết số lần gửi.",
      "Sự kiện được giải phóng ngay lập tức để gửi lại cho consumer khác (Release).",
      "Sự kiện được đánh dấu là xử lý thành công và xóa khỏi subscription (Acknowledge).",
      "Sự kiện được lưu vô thời hạn trong RAM."
    ],
    correctIndex: 0,
    explanation: "Trong Event Grid Pull: `acknowledge` = thành công; `release` = giải phóng khóa để gửi lại; `reject` = từ chối xử lý và đưa vào dead-letter."
  },
  {
    id: "q60",
    question: "Quy tắc quyết định (Determinism Constraint) quan trọng nhất trong thân hàm của một Azure Durable Functions Orchestrator là gì?",
    options: [
      "Hàm orchestrator phải mang tính đơn định tuyệt đối: KHÔNG được gọi trực tiếp `uuid.uuid4()`, `datetime.now()` hay I/O ngẫu nhiên; phải dùng `context.new_uuid()` và `context.current_utc_datetime`.",
      "Hàm orchestrator phải thực hiện tất cả các lệnh gọi API bên ngoài trực tiếp mà không thông qua Activity Functions.",
      "Hàm orchestrator không được phép nhận tham số đầu vào.",
      "Hàm orchestrator phải chạy vô hạn không bao giờ kết thúc."
    ],
    correctIndex: 0,
    explanation: "Vì Durable Functions sử dụng cơ chế Event Sourcing Replay để phục hồi trạng thái sau mỗi lượt `yield`, mã nguồn orchestrator bắt buộc phải mang tính tất định (deterministic). Mọi giá trị ngẫu nhiên phải được sinh qua đối tượng `context`."
  },
  {
    id: "q61",
    question: "Mô hình xử lý song song phân tán (Fan-Out / Fan-In) trong Azure Durable Functions được cài đặt bằng cú pháp nào trong Python v2?",
    options: [
      "Lặp qua danh sách tài liệu gọi `context.call_sub_orchestrator()` tích lũy vào mảng tasks, sau đó gọi `yield context.task_all(tasks)`.",
      "Sử dụng `threading.Thread` bên trong hàm orchestrator.",
      "Gọi `multiprocessing.Pool` để chia nhỏ dữ liệu trên CPU.",
      "Chạy vòng lặp for đồng bộ từng phần tử một."
    ],
    correctIndex: 0,
    explanation: "Trong Durable Functions: Fan-out được thực hiện bằng cách lên lịch hàng loạt sub-orchestrators hoặc activities vào mảng tasks, sau đó Fan-in gom kết quả đồng thời bằng `yield context.task_all(tasks)`."
  },
  {
    id: "q62",
    question: "Trong kịch bản duyệt tài liệu có con người can thiệp (Human-in-the-Loop), làm thế nào để Orchestrator chờ phản hồi từ người duyệt trong 30 giây mà KHÔNG gây nghẽn (block) luồng xử lý CPU?",
    options: [
      "Dùng `context.wait_for_external_event('ApprovalResponse')` và `context.create_timer(deadline)`, sau đó chạy đua bằng `yield context.task_any([approval, timeout])`.",
      "Sử dụng `time.sleep(30)` bên trong hàm orchestrator.",
      "Chạy một vòng lặp `while True` kiểm tra database liên tục.",
      "Yêu cầu người dùng gửi email trực tiếp cho máy chủ."
    ],
    correctIndex: 0,
    explanation: "`task_any([external_event, timer])` cho phép orchestrator ngủ đông (hibernates) giải phóng hoàn toàn tài nguyên CPU. Khi có sự kiện người duyệt gửi đến hoặc hết hạn 30s, Durable Functions runtime sẽ tự động đánh thức orchestrator."
  },
  {
    id: "q63",
    question: "Khi cần gửi quyết định duyệt (Approved / Rejected) từ một hệ thống bên ngoài vào một phiên Durable Functions đang chờ, phương thức HTTP client nào được sử dụng?",
    options: [
      "await client.raise_event(instance_id, 'ApprovalResponse', {'decision': 'Approved'})",
      "await client.restart(instance_id)",
      "await client.terminate(instance_id, 'Approved')",
      "client.send_message(instance_id, 'Approved')"
    ],
    correctIndex: 0,
    explanation: "Hàm `client.raise_event(instance_id, event_name, event_data)` kích hoạt và phân phối sự kiện đích danh đến đúng phiên làm việc đang chờ sự kiện đó."
  },
  {
    id: "q64",
    question: "Trong mô hình Model Context Protocol (MCP) Server trên Azure Functions, loại trigger nào được sử dụng để khai báo và công khai các công cụ cho AI client (Copilot, Cursor, Antigravity)?",
    options: [
      "@app.generic_trigger(type='mcpToolTrigger', toolName='...', toolProperties='...')",
      "@app.route(methods=['POST'])",
      "@app.service_bus_queue_trigger()",
      "@app.event_grid_trigger()"
    ],
    correctIndex: 0,
    explanation: "Extension `Microsoft.Azure.Functions.ExtensionBundle.Preview` cung cấp trigger `mcpToolTrigger`, tự động phơi bày các công cụ AI và phục vụ endpoint SSE tại `/runtime/webhooks/mcp/sse`."
  },
  {
    id: "q65",
    question: "Khi cấu hình `.vscode/mcp.json` để kết nối AI Assistant với một Azure Functions MCP Server chạy cục bộ, giao thức truyền tải (Transport) nào được sử dụng?",
    options: [
      "Server-Sent Events (SSE) trỏ vào endpoint http://localhost:7071/runtime/webhooks/mcp/sse",
      "Standard Input/Output (stdio) qua tệp thực thi .exe",
      "gRPC qua cổng 50051",
      "WebSocket qua cổng 8080"
    ],
    correctIndex: 0,
    explanation: "Azure Functions MCP Server hỗ trợ giao thức SSE (Server-Sent Events), cho phép các AI Client kết nối qua HTTP SSE endpoint `/runtime/webhooks/mcp/sse` để khám phá và gọi công cụ theo chuẩn MCP."
  }
,
  // LEVEL 12: KEY VAULT & APP CONFIGURATION QUIZ
  {
  "id": "q66",
  "question": "Trong Azure App Configuration, kỹ thuật 'Label Stacking' (xếp chồng nhãn) bằng `SettingSelector` hoạt động như thế nào khi nạp cấu hình ứng dụng?",
  "options": [
    "Nạp lần lượt các selector theo thứ tự: nhãn mặc định (\\0) làm nền, sau đó các nhãn môi trường (ví dụ Production) sẽ đè lên các khóa trùng tên.",
    "Gộp tất cả các giá trị của các nhãn thành một mảng danh sách cho mỗi khóa.",
    "Bắt buộc mỗi khóa chỉ được phép mang một nhãn duy nhất, nếu trùng tên sẽ xảy ra ngoại lệ ConfigurationException.",
    "Chỉ nạp các khóa thuộc nhãn Production và hoàn toàn bỏ qua các khóa không có nhãn."
  ],
  "correctIndex": 0,
  "explanation": "Kỹ thuật Label Stacking định nghĩa selector đầu tiên với `label_filter='\\0'` (không nhãn) làm cấu hình cơ sở, sau đó định nghĩa selector thứ hai với `label_filter='Production'`. Các giá trị có nhãn Production sẽ tự động ghi đè lên khóa cơ sở, giúp tái sử dụng cấu hình chung."
},
  {
  "id": "q67",
  "question": "Mục đích chính của mô hình 'Sentinel Key' trong Dynamic Refresh của Azure App Configuration là gì?",
  "options": [
    "Chỉ cần thăm dò (poll) một khóa duy nhất thay vì kiểm tra toàn bộ cấu hình, giảm thiểu chi phí request và tránh bị quá tải (throttling).",
    "Dùng làm khóa mã hóa cấp cao cho toàn bộ dữ liệu cấu hình trong kho.",
    "Tự động gửi thông báo qua SMS hoặc Email mỗi khi có ai đó sửa đổi cấu hình.",
    "Ngăn chặn không cho người dùng khác chỉnh sửa cấu hình khi ứng dụng đang chạy."
  ],
  "correctIndex": 0,
  "explanation": "Sentinel Key đóng vai trò là cờ hiệu phiên bản. Khi cấu hình có sự thay đổi, lập trình viên cập nhật giá trị của Sentinel Key. Ứng dụng client chỉ cần định kỳ thăm dò khóa này; nếu giá trị thay đổi thì mới kích hoạt reload toàn bộ cấu hình một cách đồng bộ và nguyên tử."
},
  {
  "id": "q68",
  "question": "Làm thế nào Azure App Configuration lưu trữ và xử lý một tham chiếu đến bí mật trong Azure Key Vault (Key Vault Reference)?",
  "options": [
    "Lưu giá trị JSON chứa Secret Identifier URI kèm Content-Type quy chuẩn và SDK tự động phân giải lấy giá trị thật qua Managed Identity.",
    "Sao chép bản rõ của bí mật từ Key Vault sang App Configuration mỗi giờ một lần.",
    "Tạo một SSH Tunnel bảo mật giữa máy chủ App Configuration và máy chủ Key Vault.",
    "Lưu hash SHA-256 của bí mật vào App Configuration để so sánh đối chiếu."
  ],
  "correctIndex": 0,
  "explanation": "App Configuration lưu trữ Secret Identifier URI (`https://<vault>.vault.azure.net/secrets/<name>`) với định dạng MIME `vnd.microsoft.appconfig.keyvaultref+json`. Khi ứng dụng nạp cấu hình với `AzureAppConfigurationKeyVaultOptions`, SDK sẽ dùng Entra ID credential để tự động truy vấn giá trị bí mật từ Key Vault."
},
  {
  "id": "q69",
  "question": "Tại sao Microsoft khuyến nghị bật cờ `--enable-rbac-authorization true` khi khởi tạo Azure Key Vault thay vì dùng Vault Access Policies cổ điển?",
  "options": [
    "Cung cấp mô hình quản trị quyền thống nhất của Azure Entra ID, cho phép phân quyền chi tiết tới từng Secret riêng lẻ và hỗ trợ Privileged Identity Management (PIM).",
    "Tự động miễn phí toàn bộ chi phí lưu trữ và request truy vấn Key Vault.",
    "Tăng tốc độ truy vấn bí mật lên gấp 10 lần nhờ cơ chế phần cứng chuyên dụng.",
    "Cho phép truy cập Key Vault công khai từ internet mà không cần mật khẩu hay chứng chỉ."
  ],
  "correctIndex": 0,
  "explanation": "Azure RBAC cho Key Vault loại bỏ giới hạn 1024 access policy entries, đồng bộ hóa quyền truy cập qua Azure Role Assignments chuẩn, cho phép giới hạn phạm vi quyền trên cấp độ Resource Group hoặc từng Secret/Key/Certificate cụ thể và tích hợp với Entra ID PIM."
},
  {
  "id": "q70",
  "question": "Để một kỹ sư vận hành có thể thêm, sửa, xem và xóa bí mật (Secrets) trong một Azure Key Vault sử dụng RBAC mà không được phép can thiệp vào Khóa mã hóa (Keys) hay Chứng chỉ (Certificates), vai trò nào là phù hợp nhất?",
  "options": [
    "Key Vault Secrets Officer",
    "Contributor",
    "Owner",
    "Key Vault Administrator"
  ],
  "correctIndex": 0,
  "explanation": "Vai trò `Key Vault Secrets Officer` cấp toàn quyền CRUD đối với Secrets trong Key Vault. Khác với `Key Vault Administrator` (quản trị toàn bộ Keys, Secrets, Certificates), vai trò này tuân thủ nguyên tắc đặc quyền tối thiểu (Least Privilege)."
},
  {
  "id": "q71",
  "question": "Một ứng dụng web AI chạy trên Azure App Service sử dụng Managed Identity chỉ cần đọc các bí mật cấu hình lúc runtime. Bạn nên gán vai trò RBAC nào cho Managed Identity của ứng dụng?",
  "options": [
    "Key Vault Secrets User",
    "Key Vault Secrets Officer",
    "Key Vault Reader",
    "Key Vault Crypto User"
  ],
  "correctIndex": 0,
  "explanation": "`Key Vault Secrets User` chỉ cấp quyền đọc nội dung bí mật (`Microsoft.KeyVault/vaults/secrets/getSecret/action`), tuân thủ chặt chẽ nguyên tắc Least Privilege cho ứng dụng lúc runtime."
},
  {
  "id": "q72",
  "question": "Khi xóa một Azure Key Vault, hành vi mặc định nào sau đây sẽ diễn ra nhờ tính năng Soft-Delete?",
  "options": [
    "Key Vault chuyển sang trạng thái đã xóa tạm thời (soft-deleted) và được lưu giữ trong 90 ngày, có thể khôi phục lại bằng lệnh `az keyvault recover`.",
    "Key Vault và toàn bộ bí mật bị tiêu hủy vĩnh viễn ngay lập tức không thể phục hồi.",
    "Key Vault được tự động chuyển sang một Azure Storage Account lưu trữ dạng cold archive.",
    "Key Vault bị khóa tạm thời 24 giờ rồi tự động hoạt động trở lại."
  ],
  "correctIndex": 0,
  "explanation": "Mặc định tất cả Key Vault mới tạo đều bật Soft-Delete với thời gian lưu giữ là 90 ngày. Người quản trị có thể xem các kho đã xóa bằng `az keyvault show-deleted` và phục hồi lại bằng `az keyvault recover`."
},
  {
  "id": "q73",
  "question": "Sự khác biệt quan trọng giữa việc tham chiếu Secret qua URI không có phiên bản (`https://.../secrets/mysecret`) và URI có phiên bản (`https://.../secrets/mysecret/43c...`) là gì?",
  "options": [
    "URI không có version luôn tự động trỏ tới phiên bản mới nhất của bí mật, trong khi URI có version cố định ứng dụng vào một phiên bản bất biến cụ thể.",
    "URI có version miễn phí cước truy vấn, trong khi URI không có version tính phí theo số lần request.",
    "URI không có version chỉ dùng được trong mạng nội bộ Virtual Network.",
    "URI có version cho phép sửa đổi nội dung bí mật, còn URI không có version là chỉ đọc."
  ],
  "correctIndex": 0,
  "explanation": "Khi cấu hình URI không gắn version GUID, mỗi khi ứng dụng truy vấn hoặc reload, Key Vault sẽ trả về phiên bản đang kích hoạt mới nhất, rất thuận tiện cho quá trình xoay vòng khóa tự động (secret rotation)."
},
  {
  "id": "q74",
  "question": "Trong thư viện `azure-keyvault-secrets` của Python, phương thức nào giúp liệt kê metadata của tất cả bí mật (tên, ngày tạo, trạng thái kích hoạt) mà KHÔNG làm lộ giá trị bí mật?",
  "options": [
    "client.list_properties_of_secrets()",
    "client.get_secret()",
    "client.list_secrets()",
    "client.read_all_values()"
  ],
  "correctIndex": 0,
  "explanation": "`client.list_properties_of_secrets()` trả về iterator các đối tượng `SecretProperties` chứa metadata (name, enabled, created_on, content_type) mà không tải giá trị thực tế của bí mật, tuân thủ nguyên tắc an toàn thông tin."
},
  {
  "id": "q75",
  "question": "Tại sao các ứng dụng backend AI tải cao nên triển khai cơ chế In-Memory Caching (với TTL ví dụ 30-300 giây) cho các bí mật lấy từ Azure Key Vault?",
  "options": [
    "Tránh kích hoạt giới hạn điều tiết dịch vụ (HTTP 429 Too Many Requests Throttling) của Key Vault và giảm độ trễ mạng cho mỗi request của người dùng.",
    "Key Vault bắt buộc client phải xóa kết nối sau mỗi 10 lần gọi API.",
    "Bộ nhớ RAM trên máy chủ tự động mã hóa bí mật với chuẩn AES-256.",
    "Để ngăn ngừa việc Key Vault tự động xóa các bí mật không được truy vấn thường xuyên."
  ],
  "correctIndex": 0,
  "explanation": "Azure Key Vault áp dụng giới hạn số lượng giao dịch trên mỗi khoảng thời gian (service limits/throttling). Việc cache tạm thời trong bộ nhớ ứng dụng giúp giảm tải số cuộc gọi mạng, tăng tốc độ xử lý và loại trừ hoàn toàn nguy cơ lỗi 429 Throttling."
},
  {
  "id": "q76",
  "question": "Để phân quyền cho nhóm DevOps có quyền quản lý toàn bộ cấu hình, Feature Flags và các Key Vault references trong Azure App Configuration mà không cần chia sẻ Connection String, vai trò Entra ID RBAC nào cần được gán?",
  "options": [
    "App Configuration Data Owner",
    "Key Vault Administrator",
    "Reader",
    "Security Admin"
  ],
  "correctIndex": 0,
  "explanation": "`App Configuration Data Owner` là vai trò RBAC dữ liệu cao nhất cho Azure App Configuration, cho phép quản lý toàn diện key-values, import/export và thiết lập dynamic refresh."
},
  {
  "id": "q77",
  "question": "Trong Python SDK `azure-appconfiguration-provider`, câu lệnh `provider.refresh()` hoạt động như thế nào khi được gọi định kỳ?",
  "options": [
    "Kiểm tra xem khoảng thời gian refresh_interval đã trôi qua chưa; nếu đã qua và giá trị Sentinel Key thay đổi, nó sẽ tải lại cấu hình và trả về True.",
    "Luôn luôn bắt buộc ứng dụng khởi động lại tiến trình Python từ đầu.",
    "Xóa sạch toàn bộ cấu hình trong bộ nhớ và tạm dừng ứng dụng cho đến khi người dùng nạp lại file .env.",
    "Gửi tín hiệu restart đến tất cả các Pods trong Kubernetes cluster."
  ],
  "correctIndex": 0,
  "explanation": "`provider.refresh()` thực hiện kiểm tra nhẹ (lightweight check) dựa trên khoảng thời gian `refresh_interval`. Nếu chưa đến hạn, phương thức lập tức trả về `False` mà không tốn request mạng. Nếu đã đến hạn và Sentinel Key thay đổi, SDK nạp lại cấu hình mới một cách trơn tru mà không làm gián đoạn ứng dụng."
},
  {
  "id": "q78",
  "question": "Khi bạn chạy lệnh xóa một Key Vault (`az keyvault delete`), sau đó muốn tạo lại ngay một Key Vault mới cùng tên nhưng bị báo lỗi tên đã tồn tại trong trạng thái đã xóa, lệnh nào cần thực hiện tiếp theo (với điều kiện vault không bật purge protection)?",
  "options": [
    "az keyvault purge --name <VaultName>",
    "az keyvault recover --name <VaultName>",
    "az keyvault force-delete --name <VaultName>",
    "az keyvault clean --name <VaultName>"
  ],
  "correctIndex": 0,
  "explanation": "Lệnh `az keyvault purge --name <VaultName>` sẽ xóa vĩnh viễn Key Vault khỏi danh sách soft-deleted vaults, giải phóng hoàn toàn tên miền DNS toàn cầu để có thể tái sử dụng ngay lập tức."
}
];

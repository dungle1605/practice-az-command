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
  }
];

/**
 * Challenge & Quiz Dataset based on Useful_Command.md
 * Designed for Microsoft AI-200 and Azure DevOps practical mastery.
 */

export const LEVELS = [
  {
    id: 1,
    name: "Level 1: Nhập môn & Môi trường",
    tagline: "Làm chủ cú pháp nền tảng, công cụ tra cứu và biến môi trường",
    badge: "Cloud Rookie",
    color: "#00d2ff",
    icon: "🌱"
  },
  {
    id: 2,
    name: "Level 2: Azure Container Registry",
    tagline: "Tạo Registry, Cloud Build qua ACR Task và quản lý Image Immutability",
    badge: "Registry Operator",
    color: "#0078d4",
    icon: "🐳"
  },
  {
    id: 3,
    name: "Level 3: App Service & Container Web App",
    tagline: "Khởi tạo App Service Plan Linux, Container App và cấp Managed Identity",
    badge: "App Specialist",
    color: "#7928ca",
    icon: "🚀"
  },
  {
    id: 4,
    name: "Level 4: Bảo mật RBAC & App Settings",
    tagline: "Phân quyền AcrPull không mật khẩu, cấu hình Runtime Container & JMESPath",
    badge: "AI-200 Master",
    color: "#ff007a",
    icon: "🛡️"
  }
];

export const CHALLENGES = [
  // ==========================================
  // LEVEL 1: NHẬP MÔN & MÔI TRƯỜNG
  // ==========================================
  {
    id: "l1-interactive",
    level: 1,
    title: "Chế độ tương tác thông minh",
    difficulty: "Cơ bản",
    category: "Mental Model",
    mission: "Bạn muốn mở chế độ dòng lệnh tương tác thông minh của Azure CLI để tự động gợi ý từ khóa, tham số và xem hướng dẫn trực tiếp mà không cần tra web.",
    expectedCommand: "az interactive",
    aliases: [
      "az interactive"
    ],
    tokens: ["az", "interactive", "--help", "-h"],
    hints: [
      "Gõ lệnh gồm 2 từ: `az` và một tính năng tương tác tự động gợi ý.",
      "Tính năng này là chế độ `interactive` (chú ý chính tả: interactive, không phải interative)."
    ],
    mentalModel: {
      rule: "az <Action/Mode>",
      breakdown: [
        { part: "az", role: "CLI Program", desc: "Trình thông dịch dòng lệnh của Azure" },
        { part: "interactive", role: "Command Shell", desc: "Kích hoạt interactive shell có auto-completion và doc lookup tức thì" }
      ]
    },
    parametersExplanation: [
      { param: "az interactive", meaning: "Kích hoạt chế độ gõ lệnh với gợi ý IntelliSense, phím Tab thông minh và xem ví dụ lệnh ngay trên terminal." }
    ],
    examNotes: "💡 Trong kỳ thi hoặc khi làm việc thực tế, `az interactive` và `az find <chuỗi>` là 2 công cụ tra cứu nhanh nhất khi bạn không nhớ chính xác cú pháp.",
    simulatedOutput: `Azure CLI Interactive Mode
Type "az" to see commands, or "help" for interactive guidance.
az?> `
  },
  {
    id: "l1-login-device",
    level: 1,
    title: "Đăng nhập với Device Code",
    difficulty: "Cơ bản",
    category: "Setup",
    mission: "Bạn đang làm việc trên máy chủ Linux từ xa hoặc terminal headless không thể tự động mở trình duyệt web. Hãy sử dụng Azure CLI để đăng nhập bằng mã thiết bị (Device Code).",
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
    examNotes: "Rất thường gặp khi thao tác từ GitHub Codespaces, Cloud Shell, hoặc remote VPS.",
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
    title: "Đăng ký Resource Provider cho Container Registry",
    difficulty: "Cơ bản",
    category: "Setup",
    mission: "Một subscription mới có thể chưa kích hoạt sẵn dịch vụ Container Registry. Hãy dùng lệnh Azure CLI để đăng ký Resource Provider namespace `Microsoft.ContainerRegistry`.",
    expectedCommand: "az provider register --namespace Microsoft.ContainerRegistry",
    aliases: [
      "az provider register -n Microsoft.ContainerRegistry",
      "az provider register --namespace Microsoft.ContainerRegistry"
    ],
    tokens: ["az", "provider", "register", "--namespace", "Microsoft.ContainerRegistry"],
    hints: [
      "Dịch vụ quản lý nhà cung cấp là `provider`.",
      "Hành động là `register`.",
      "Tham số chỉ định namespace là `--namespace Microsoft.ContainerRegistry` (hoặc `-n`)."
    ],
    mentalModel: {
      rule: "az provider register --namespace <Namespace>",
      breakdown: [
        { part: "az provider", role: "Resource", desc: "Quản lý các nhà cung cấp tài nguyên trên Azure Subscription" },
        { part: "register", role: "Action", desc: "Kích hoạt quyền sử dụng loại tài nguyên này" },
        { part: "--namespace", role: "Param", desc: "Tên định danh dịch vụ: Microsoft.ContainerRegistry" }
      ]
    },
    parametersExplanation: [
      { param: "--namespace", meaning: "Namespace chính thức của dịch vụ, ví dụ `Microsoft.ContainerRegistry` hoặc `Microsoft.Web`." }
    ],
    examNotes: "Nếu gặp lỗi `The subscription is not registered to use namespace 'Microsoft.ContainerRegistry'`, giải pháp chính là lệnh này.",
    simulatedOutput: `{
  "namespace": "Microsoft.ContainerRegistry",
  "registrationPolicy": "RegistrationRequired",
  "registrationState": "Registering"
}`
  },
  {
    id: "l1-env-source",
    level: 1,
    title: "Nạp biến môi trường tự động (Dot-sourcing)",
    difficulty: "Cơ bản",
    category: "Environment",
    mission: "Khi triển khai lab, script tự động sinh ra file cấu hình `.\.env.ps1`. Hãy dùng cú pháp dot-sourcing của PowerShell để nạp toàn bộ biến vào phiên làm việc hiện tại.",
    expectedCommand: ". .\\.env.ps1",
    aliases: [
      ". .\\.env.ps1",
      ". ./.env.ps1"
    ],
    tokens: [".", ".\\.env.ps1", "source", ".env"],
    hints: [
      "Trong PowerShell, dot-sourcing bắt đầu bằng một dấu chấm `.` và một khoảng trắng.",
      "Theo sau là đường dẫn tương đối đến file: `.\\.env.ps1`."
    ],
    mentalModel: {
      rule: ". <Path-to-Script>",
      breakdown: [
        { part: ".", role: "Dot Operator", desc: "Thực thi script trong phạm vi (scope) hiện tại thay vì tạo sub-scope" },
        { part: ".\\.env.ps1", role: "File Path", desc: "Đường dẫn file PowerShell script chứa các định nghĩa $env:" }
      ]
    },
    parametersExplanation: [
      { param: ". (dấu chấm)", meaning: "Toàn bộ biến được gán trong file sẽ tồn tại trực tiếp trong cửa sổ terminal hiện tại." }
    ],
    examNotes: "Nếu chạy `.\\.env.ps1` không có dấu chấm ở đầu, script chạy trong sub-shell và khi kết thúc, terminal của bạn sẽ không nhận được biến nào!",
    simulatedOutput: `[+] Loaded environment variables from .env.ps1:
    RESOURCE_GROUP = rg-ai200-appsvc-lab
    LOCATION       = southeastasia
    ACR_NAME       = acr9e9994d6
    APP_PLAN       = plan-docprocessor-9e9994d6
    APP_NAME       = app-docprocessor-9e9994d6`
  },
  {
    id: "l1-env-manual",
    level: 1,
    title: "Gán thủ công biến môi trường trong PowerShell",
    difficulty: "Cơ bản",
    category: "Environment",
    mission: "Hãy gán biến môi trường `RESOURCE_GROUP` mang giá trị `\"rg-ai200-appsvc-lab\"` trong PowerShell session.",
    expectedCommand: "$env:RESOURCE_GROUP = \"rg-ai200-appsvc-lab\"",
    aliases: [
      "$env:RESOURCE_GROUP = \"rg-ai200-appsvc-lab\"",
      "$env:RESOURCE_GROUP='rg-ai200-appsvc-lab'",
      "$env:RESOURCE_GROUP = 'rg-ai200-appsvc-lab'"
    ],
    tokens: ["$env:RESOURCE_GROUP", "=", "\"rg-ai200-appsvc-lab\""],
    hints: [
      "Cú pháp biến môi trường PowerShell có tiền tố `$env:`.",
      "Gán giá trị bằng toán tử `=` và chuỗi `\"rg-ai200-appsvc-lab\"`."
    ],
    mentalModel: {
      rule: "$env:<VarName> = \"<Value>\"",
      breakdown: [
        { part: "$env:", role: "PowerShell Drive", desc: "Ổ đĩa ảo ánh xạ trực tiếp đến Environment Variables của hệ điều hành" },
        { part: "RESOURCE_GROUP", role: "Key", desc: "Tên biến môi trường" },
        { part: "= \"...\"", role: "Value", desc: "Giá trị gán" }
      ]
    },
    parametersExplanation: [
      { param: "$env:", meaning: "Cung cấp quyền truy cập biến môi trường trong phiên PowerShell." }
    ],
    examNotes: "Khác với Bash dùng `export KEY=VAL`, PowerShell dùng `$env:KEY = \"VAL\"`.",
    simulatedOutput: `PS H:\\azure-lab> $env:RESOURCE_GROUP
rg-ai200-appsvc-lab`
  },
  {
    id: "l1-env-check",
    level: 1,
    title: "Kiểm tra danh sách biến môi trường đã nạp",
    difficulty: "Cơ bản",
    category: "Environment",
    mission: "Sử dụng lệnh PowerShell `Get-ChildItem` để kiểm tra 3 biến môi trường cùng lúc: `RESOURCE_GROUP`, `LOCATION`, `ACR_NAME`.",
    expectedCommand: "Get-ChildItem env:RESOURCE_GROUP, env:LOCATION, env:ACR_NAME",
    aliases: [
      "Get-ChildItem env:RESOURCE_GROUP, env:LOCATION, env:ACR_NAME",
      "Get-ChildItem env:RESOURCE_GROUP,env:LOCATION,env:ACR_NAME",
      "gci env:RESOURCE_GROUP, env:LOCATION, env:ACR_NAME"
    ],
    tokens: ["Get-ChildItem", "env:RESOURCE_GROUP,", "env:LOCATION,", "env:ACR_NAME"],
    hints: [
      "Lệnh liệt kê trong PowerShell là `Get-ChildItem`.",
      "Truyền danh sách các biến cách nhau bởi dấu phẩy: `env:RESOURCE_GROUP, env:LOCATION, env:ACR_NAME`."
    ],
    mentalModel: {
      rule: "Get-ChildItem env:<Var1>, env:<Var2>",
      breakdown: [
        { part: "Get-ChildItem", role: "Cmdlet", desc: "Truy vấn các phần tử trong ổ đĩa ảo (alias: gci, ls, dir)" },
        { part: "env:<Name>", role: "Items", desc: "Đường dẫn đến từng biến môi trường cụ thể" }
      ]
    },
    parametersExplanation: [
      { param: "env:", meaning: "Prefix ổ đĩa môi trường trong PowerShell." }
    ],
    examNotes: "Giúp xác thực các biến đã được nạp đầy đủ trước khi thực thi chuỗi lệnh dài.",
    simulatedOutput: `Name                           Value
----                           -----
RESOURCE_GROUP                 rg-ai200-appsvc-lab
LOCATION                       southeastasia
ACR_NAME                       acr9e9994d6`
  },
  {
    id: "l1-config-defaults",
    level: 1,
    title: "Thiết lập cấu hình mặc định (az config defaults)",
    difficulty: "Cơ bản",
    category: "Config",
    mission: "Để không phải gõ lại cờ `--resource-group` trong mọi câu lệnh tiếp theo, hãy đặt Resource Group mặc định cho Azure CLI bằng giá trị của biến `$env:RESOURCE_GROUP`.",
    expectedCommand: "az config set defaults.group=$env:RESOURCE_GROUP",
    aliases: [
      "az config set defaults.group=$env:RESOURCE_GROUP",
      "az config set defaults.group=\"$env:RESOURCE_GROUP\""
    ],
    tokens: ["az", "config", "set", "defaults.group=$env:RESOURCE_GROUP"],
    hints: [
      "Dùng nhóm lệnh `az config`.",
      "Hành động là `set`.",
      "Tham số là `defaults.group=$env:RESOURCE_GROUP`."
    ],
    mentalModel: {
      rule: "az config set defaults.<prop>=<value>",
      breakdown: [
        { part: "az config", role: "CLI Config", desc: "Quản lý thiết lập của Azure CLI lưu trong ~/.azure/config" },
        { part: "set", role: "Action", desc: "Ghi cấu hình mới" },
        { part: "defaults.group=...", role: "Key=Value", desc: "Resource group mặc định tự động áp dụng cho mọi lệnh az sau đó" }
      ]
    },
    parametersExplanation: [
      { param: "defaults.group", meaning: "Gán giá trị resource group mặc định cho CLI. Sau lệnh này, bạn có thể bỏ qua cờ `--resource-group`." },
      { param: "defaults.location", meaning: "Tương tự, có thể gán vị trí mặc định (`az config set defaults.location=$env:LOCATION`)." }
    ],
    examNotes: "Đây là bí quyết tăng tốc độ thao tác cực lớn khi làm bài lab AI-200 và tránh gõ nhầm tên RG.",
    simulatedOutput: `[OK] Set configuration defaults.group=rg-ai200-appsvc-lab`
  },
  {
    id: "l1-group-exists",
    level: 1,
    title: "Kiểm tra Resource Group đã tồn tại chưa",
    difficulty: "Cơ bản",
    category: "Resource Group",
    mission: "Trước khi tạo tài nguyên, hãy kiểm tra xem Resource Group có tên trong biến `$env:RESOURCE_GROUP` đã tồn tại trên Azure Subscription hay chưa.",
    expectedCommand: "az group exists --name $env:RESOURCE_GROUP",
    aliases: [
      "az group exists --name $env:RESOURCE_GROUP",
      "az group exists -n $env:RESOURCE_GROUP"
    ],
    tokens: ["az", "group", "exists", "--name", "$env:RESOURCE_GROUP"],
    hints: [
      "Dịch vụ là `az group`.",
      "Hành động kiểm tra sự tồn tại trả về boolean (true/false) là `exists`.",
      "Tham số tên nhóm là `--name $env:RESOURCE_GROUP` (hoặc `-n`)."
    ],
    mentalModel: {
      rule: "az group exists --name <Name>",
      breakdown: [
        { part: "az group", role: "Service", desc: "Nhóm tài nguyên Azure Resource Group" },
        { part: "exists", role: "Verb", desc: "Trả về duy nhất true hoặc false" },
        { part: "--name", role: "Flag", desc: "Tên của Resource Group cần kiểm tra" }
      ]
    },
    parametersExplanation: [
      { param: "exists", meaning: "Kiểm tra sự tồn tại (idempotency check), trả về true nếu đã có, false nếu chưa có." }
    ],
    examNotes: "Rất hay dùng trong CI/CD scripts để quyết định có cần tạo mới RG hay không.",
    simulatedOutput: `true`
  },

  // ==========================================
  // LEVEL 2: AZURE CONTAINER REGISTRY (ACR)
  // ==========================================
  {
    id: "l2-acr-create",
    level: 2,
    title: "Tạo Azure Container Registry bảo mật",
    difficulty: "Trung cấp",
    category: "ACR",
    mission: "Tạo một ACR mới với Resource Group `$env:RESOURCE_GROUP`, tên `$env:ACR_NAME`, gói SKU `Basic` và vô hiệu hóa tài khoản quản trị cục bộ (`--admin-enabled false`) theo chuẩn bảo mật RBAC.",
    expectedCommand: "az acr create --resource-group $env:RESOURCE_GROUP --name $env:ACR_NAME --sku Basic --admin-enabled false",
    aliases: [
      "az acr create -g $env:RESOURCE_GROUP -n $env:ACR_NAME --sku Basic --admin-enabled false",
      "az acr create --resource-group $env:RESOURCE_GROUP --name $env:ACR_NAME --admin-enabled false --sku Basic"
    ],
    tokens: ["az", "acr", "create", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:ACR_NAME", "--sku", "Basic", "--admin-enabled", "false"],
    hints: [
      "Lệnh bắt đầu với `az acr create`.",
      "Cần các tham số: `--resource-group`, `--name`, `--sku Basic`.",
      "Để bảo mật, thêm cờ `--admin-enabled false`."
    ],
    mentalModel: {
      rule: "az acr create --resource-group <RG> --name <Name> --sku <SKU> --admin-enabled false",
      breakdown: [
        { part: "az acr", role: "Service", desc: "Azure Container Registry" },
        { part: "create", role: "Action", desc: "Khởi tạo dịch vụ registry mới" },
        { part: "--sku Basic", role: "Tier", desc: "Gói giá: Basic, Standard, Premium" },
        { part: "--admin-enabled false", role: "Security Flag", desc: "Tắt user/password mặc định, bắt buộc dùng Managed Identity hoặc Service Principal" }
      ]
    },
    parametersExplanation: [
      { param: "--sku Basic", meaning: "Gói cơ bản, tiết kiệm chi phí, phù hợp môi trường dev/test và lab AI-200." },
      { param: "--admin-enabled false", meaning: "Best Practice bảo mật: Chặn việc lộ thông tin đăng nhập admin tĩnh, chỉ cho phép kéo/đẩy qua RBAC." }
    ],
    examNotes: "💡 Điểm thi AI-200: Microsoft luôn khuyến nghị `--admin-enabled false` và sử dụng Managed Identity thay vì bật admin user.",
    simulatedOutput: `{
  "adminUserEnabled": false,
  "creationDate": "2026-10-19T12:00:00Z",
  "id": "/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-appsvc-lab/providers/Microsoft.ContainerRegistry/registries/acr9e9994d6",
  "location": "southeastasia",
  "loginServer": "acr9e9994d6.azurecr.io",
  "name": "acr9e9994d6",
  "provisioningState": "Succeeded",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  }
}`
  },
  {
    id: "l2-acr-show-query",
    level: 2,
    title: "Kiểm tra trạng thái ACR với JMESPath & TSV",
    difficulty: "Trung cấp",
    category: "JMESPath",
    mission: "Xem chi tiết ACR và chỉ trích xuất duy nhất trường `provisioningState` dưới dạng text thuần (bỏ ngoặc kép) để sử dụng cho script tự động.",
    expectedCommand: "az acr show --resource-group $env:RESOURCE_GROUP --name $env:ACR_NAME --query provisioningState -o tsv",
    aliases: [
      "az acr show -g $env:RESOURCE_GROUP -n $env:ACR_NAME --query provisioningState -o tsv",
      "az acr show --resource-group $env:RESOURCE_GROUP --name $env:ACR_NAME --query provisioningState --output tsv"
    ],
    tokens: ["az", "acr", "show", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:ACR_NAME", "--query", "provisioningState", "-o", "tsv"],
    hints: [
      "Dùng lệnh xem chi tiết: `az acr show`.",
      "Chỉ định `--resource-group` và `--name`.",
      "Dùng lọc JMESPath `--query provisioningState` và xuất dạng text thuần `-o tsv`."
    ],
    mentalModel: {
      rule: "az <service> show ... --query <Field> --output tsv",
      breakdown: [
        { part: "az acr show", role: "Inspect", desc: "Xem toàn bộ thuộc tính của ACR dạng JSON" },
        { part: "--query provisioningState", role: "JMESPath Filter", desc: "Chỉ giữ lại thuộc tính provisioningState" },
        { part: "-o tsv", role: "Formatter", desc: "Xuất ra dạng Tab-Separated Values, loại bỏ dấu ngoặc kép string" }
      ]
    },
    parametersExplanation: [
      { param: "--query", meaning: "Bộ lọc cú pháp JMESPath trích xuất thuộc tính mong muốn từ output JSON." },
      { param: "-o tsv / --output tsv", meaning: "In ra chuỗi thuần không có ngoặc kép `\"\"`, cực kỳ lý tưởng để gán vào biến hoặc kiểm tra điều kiện." }
    ],
    examNotes: "Nếu không dùng `-o tsv` mà dùng `-o json`, PowerShell sẽ nhận chuỗi kèm dấu ngoặc kép `\"Succeeded\"` thay vì `Succeeded`.",
    simulatedOutput: `Succeeded`
  },
  {
    id: "l2-acr-build",
    level: 2,
    title: "Build Docker Image trên Cloud qua ACR Task",
    difficulty: "Trung cấp",
    category: "ACR Tasks",
    mission: "Build một container image có tên và tag là `docprocessor:v1` trực tiếp trên Azure (không cần Docker ở máy cục bộ), sử dụng Dockerfile tại `api/Dockerfile`, tắt streaming log (`--no-logs`) và lấy ngữ cảnh nguồn từ thư mục `api/`.",
    expectedCommand: "az acr build --resource-group $env:RESOURCE_GROUP --registry $env:ACR_NAME --image docprocessor:v1 --file api/Dockerfile --no-logs api/",
    aliases: [
      "az acr build -g $env:RESOURCE_GROUP -r $env:ACR_NAME --image docprocessor:v1 --file api/Dockerfile --no-logs api/",
      "az acr build --registry $env:ACR_NAME --resource-group $env:RESOURCE_GROUP --image docprocessor:v1 --file api/Dockerfile --no-logs api/"
    ],
    tokens: ["az", "acr", "build", "--resource-group", "$env:RESOURCE_GROUP", "--registry", "$env:ACR_NAME", "--image", "docprocessor:v1", "--file", "api/Dockerfile", "--no-logs", "api/"],
    hints: [
      "Lệnh là `az acr build`.",
      "Tham số gồm: `--resource-group`, `--registry`, `--image docprocessor:v1`.",
      "Chỉ định file qua `--file api/Dockerfile`, cờ `--no-logs` và đường dẫn thư mục `api/` ở cuối."
    ],
    mentalModel: {
      rule: "az acr build --resource-group <RG> --registry <ACR> --image <Tag> --file <Dockerfile> <ContextDir>",
      breakdown: [
        { part: "az acr build", role: "Cloud Build", desc: "Nén mã nguồn, gửi lên ACR Task để đóng gói Docker image trên hạ tầng Azure" },
        { part: "--image", role: "Tag", desc: "Tên repository và tag: docprocessor:v1" },
        { part: "--file", role: "Dockerfile Path", desc: "Đường dẫn file Dockerfile tương đối" },
        { part: "--no-logs", role: "Log control", desc: "Chạy ngầm không stream toàn bộ output dòng lệnh build về terminal" },
        { part: "api/", role: "Source Context", desc: "Thư mục chứa mã nguồn ngữ cảnh cần gửi lên" }
      ]
    },
    parametersExplanation: [
      { param: "--no-logs", meaning: "Giảm tắc nghẽn terminal khi chạy qua automation hoặc kết nối mạng yếu." },
      { param: "--file", meaning: "Chỉ định đường dẫn đến file Dockerfile cụ thể nếu không nằm ở root thư mục build." }
    ],
    examNotes: "ACR Build là giải pháp tuyệt vời khi máy lập trình viên là máy mỏng không cài được Docker Desktop hoặc trong pipeline CI/CD.",
    simulatedOutput: `Packing source code into tar to upload...
Uploading source code to storage...
Uploaded 2.34 MiB in 2 sec.
Queued a run with ID: cf1
Waiting for an agent...
Run ID: cf1 was successful after 45s`
  },
  {
    id: "l2-acr-task-runs",
    level: 2,
    title: "Liệt kê lịch sử các tác vụ Build (Task Runs)",
    difficulty: "Trung cấp",
    category: "ACR Tasks",
    mission: "Xem lịch sử tất cả các lượt build container image đã thực hiện trên ACR `$env:ACR_NAME`, xuất kết quả dưới dạng bảng (`--output table`).",
    expectedCommand: "az acr task list-runs --registry $env:ACR_NAME --output table",
    aliases: [
      "az acr task list-runs -r $env:ACR_NAME -o table",
      "az acr task list-runs --registry $env:ACR_NAME -o table"
    ],
    tokens: ["az", "acr", "task", "list-runs", "--registry", "$env:ACR_NAME", "--output", "table"],
    hints: [
      "Nhóm con là `az acr task`.",
      "Hành động liệt kê các lần chạy là `list-runs`.",
      "Chỉ định `--registry $env:ACR_NAME` và định dạng `--output table`."
    ],
    mentalModel: {
      rule: "az acr task list-runs --registry <Registry> --output table",
      breakdown: [
        { part: "az acr task", role: "Sub-service", desc: "Quản lý tác vụ tự động hóa đóng gói image của ACR" },
        { part: "list-runs", role: "Verb", desc: "Liệt kê tất cả các task runs đã thực thi" },
        { part: "--output table", role: "Format", desc: "Hiển thị dạng cột và hàng dễ đọc" }
      ]
    },
    parametersExplanation: [
      { param: "list-runs", meaning: "Xem trạng thái (Succeeded/Failed), thời gian chạy và ID của từng lần build." }
    ],
    examNotes: "Dùng để tra cứu Run ID khi cần debug một lần build thất bại (`az acr task logs --run-id <ID>`).",
    simulatedOutput: `QUEUED TIME                STATUS     CREATE TIME                FINISH TIME                RUN ID
-------------------------  ---------  -------------------------  -------------------------  --------
2026-10-19T12:05:12+00:00  Succeeded  2026-10-19T12:05:15+00:00  2026-10-19T12:06:00+00:00  cf1`
  },
  {
    id: "l2-acr-repo-list",
    level: 2,
    title: "Liệt kê danh sách Repositories trong ACR",
    difficulty: "Trung cấp",
    category: "ACR",
    mission: "Liệt kê tất cả các kho lưu trữ (repository) hiện có trong ACR `$env:ACR_NAME` dưới dạng bảng.",
    expectedCommand: "az acr repository list --name $env:ACR_NAME --output table",
    aliases: [
      "az acr repository list -n $env:ACR_NAME -o table",
      "az acr repository list --name $env:ACR_NAME -o table"
    ],
    tokens: ["az", "acr", "repository", "list", "--name", "$env:ACR_NAME", "--output", "table"],
    hints: [
      "Nhóm con là `repository`.",
      "Hành động là `list`.",
      "Chỉ định tên registry bằng `--name $env:ACR_NAME` và định dạng `--output table`."
    ],
    mentalModel: {
      rule: "az acr repository list --name <Registry> --output table",
      breakdown: [
        { part: "az acr repository", role: "Subgroup", desc: "Quản lý các image repositories trong ACR" },
        { part: "list", role: "Verb", desc: "Liệt kê toàn bộ tên image" }
      ]
    },
    parametersExplanation: [
      { param: "--name", meaning: "Tên của Azure Container Registry." }
    ],
    examNotes: "Repository trong ACR tương ứng với tên một ứng dụng container (ví dụ `docprocessor`, `inference-api`).",
    simulatedOutput: `Result
-------------
docprocessor
inference-api`
  },
  {
    id: "l2-acr-repo-tags",
    level: 2,
    title: "Xem danh sách Tags của Repository",
    difficulty: "Trung cấp",
    category: "ACR",
    mission: "Xem tất cả các tags của repository `inference-api` trong ACR `$env:ACR_NAME` dưới dạng bảng.",
    expectedCommand: "az acr repository show-tags --name $env:ACR_NAME --repository inference-api --output table",
    aliases: [
      "az acr repository show-tags -n $env:ACR_NAME --repository inference-api -o table",
      "az acr repository show-tags --name $env:ACR_NAME --repository inference-api -o table"
    ],
    tokens: ["az", "acr", "repository", "show-tags", "--name", "$env:ACR_NAME", "--repository", "inference-api", "--output", "table"],
    hints: [
      "Hành động xem danh sách tags là `show-tags`.",
      "Cần 2 tham số: `--name $env:ACR_NAME` và `--repository inference-api`."
    ],
    mentalModel: {
      rule: "az acr repository show-tags --name <ACR> --repository <Repo> --output table",
      breakdown: [
        { part: "show-tags", role: "Action", desc: "Trích xuất danh sách phiên bản/tag" },
        { part: "--repository", role: "Filter", desc: "Tên image cần xem phiên bản" }
      ]
    },
    parametersExplanation: [
      { param: "--repository", meaning: "Tên repository cụ thể cần liệt kê tags." }
    ],
    examNotes: "Quan trọng để xác định tag chính xác trước khi gán vào App Service hoặc Kubernetes manifest.",
    simulatedOutput: `Result
--------
v1.0.0
v1.1.0`
  },
  {
    id: "l2-acr-immutable",
    level: 2,
    title: "Khóa Image chống ghi đè (Immutability)",
    difficulty: "Trung cấp",
    category: "ACR Security",
    mission: "Để đảm bảo an toàn tuyệt đối cho môi trường Production, hãy khóa image `inference-api:v1.0.0` trong ACR `$env:ACR_NAME` bằng cách vô hiệu hóa quyền ghi/xóa (`--write-enable false`).",
    expectedCommand: "az acr repository update --name $env:ACR_NAME --image inference-api:v1.0.0 --write-enable false",
    aliases: [
      "az acr repository update -n $env:ACR_NAME --image inference-api:v1.0.0 --write-enable false"
    ],
    tokens: ["az", "acr", "repository", "update", "--name", "$env:ACR_NAME", "--image", "inference-api:v1.0.0", "--write-enable", "false"],
    hints: [
      "Lệnh cập nhật thuộc tính image là `az acr repository update`.",
      "Tham số chỉ định image là `--image inference-api:v1.0.0`.",
      "Tham số khóa quyền ghi là `--write-enable false`."
    ],
    mentalModel: {
      rule: "az acr repository update --name <ACR> --image <Image:Tag> --write-enable false",
      breakdown: [
        { part: "az acr repository update", role: "Update", desc: "Cập nhật metadata và quyền truy cập của repository hoặc tag cụ thể" },
        { part: "--image", role: "Target", desc: "Chỉ định tag cụ thể: inference-api:v1.0.0" },
        { part: "--write-enable false", role: "Immutability", desc: "Chặn hoàn toàn việc push đè image cùng tag hoặc xóa nhầm tag này" }
      ]
    },
    parametersExplanation: [
      { param: "--write-enable false", meaning: "Biến image thành bất biến (immutable), không ai có thể đẩy phiên bản khác ghi đè lên tag này." }
    ],
    examNotes: "Kiến trúc chuẩn DevOps/AI-200: Khóa image tag v1.0.0 sau khi release để tránh rủi ro supply chain attack hoặc ghi đè nhầm.",
    simulatedOutput: `{
  "changeableAttributes": {
    "deleteEnabled": false,
    "listEnabled": true,
    "readEnabled": true,
    "writeEnabled": false
  },
  "createdTime": "2026-10-19T12:10:00Z",
  "digest": "sha256:4a8e2b9c7d1e3f5a...",
  "imageName": "inference-api:v1.0.0"
}`
  },

  // ==========================================
  // LEVEL 3: APP SERVICE PLAN & WEB APP
  // ==========================================
  {
    id: "l3-plan-create",
    level: 3,
    title: "Tạo App Service Plan (Linux, P0v3)",
    difficulty: "Nâng cao",
    category: "App Service",
    mission: "Tạo một App Service Plan mới chạy hệ điều hành Linux (`--is-linux`) trong Resource Group `$env:RESOURCE_GROUP`, tên `$env:APP_PLAN`, vị trí `$env:LOCATION` với gói giá Premium V3 thấp nhất là `P0v3`.",
    expectedCommand: "az appservice plan create --resource-group $env:RESOURCE_GROUP --name $env:APP_PLAN --location $env:LOCATION --sku P0v3 --is-linux",
    aliases: [
      "az appservice plan create -g $env:RESOURCE_GROUP -n $env:APP_PLAN -l $env:LOCATION --sku P0v3 --is-linux",
      "az appservice plan create --resource-group $env:RESOURCE_GROUP --name $env:APP_PLAN --sku P0v3 --location $env:LOCATION --is-linux"
    ],
    tokens: ["az", "appservice", "plan", "create", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_PLAN", "--location", "$env:LOCATION", "--sku", "P0v3", "--is-linux"],
    hints: [
      "Nhóm lệnh là `az appservice plan create`.",
      "Truyền các tham số: `--resource-group`, `--name`, `--location`, `--sku P0v3`.",
      "Quan trọng: Thêm cờ `--is-linux` để tạo máy chủ nền tảng Linux hỗ trợ container."
    ],
    mentalModel: {
      rule: "az appservice plan create --resource-group <RG> --name <Plan> --location <Loc> --sku <SKU> --is-linux",
      breakdown: [
        { part: "az appservice plan", role: "Compute Pool", desc: "Hạ tầng tính toán (CPU, RAM) dùng chung cho các ứng dụng Web" },
        { part: "--sku P0v3", role: "Pricing Tier", desc: "Gói Premium V3 (P0v3) hỗ trợ các tính năng container nâng cao" },
        { part: "--is-linux", role: "OS Flag", desc: "Chỉ định host Linux (bắt buộc cho Linux Container App Service)" }
      ]
    },
    parametersExplanation: [
      { param: "--is-linux", meaning: "Bắt buộc khi chạy Linux Docker Containers trên App Service." },
      { param: "--sku P0v3", meaning: "Gói SKU tối ưu chi phí trong dòng Premium V3 cho lab và thử nghiệm AI." }
    ],
    examNotes: "Nếu quên cờ `--is-linux`, Azure sẽ tạo plan Windows mặc định và sau đó bạn không thể deploy container Linux vào đó được!",
    simulatedOutput: `{
  "id": "/subscriptions/.../resourceGroups/rg-ai200-appsvc-lab/providers/Microsoft.Web/serverfarms/plan-docprocessor-9e9994d6",
  "location": "southeastasia",
  "name": "plan-docprocessor-9e9994d6",
  "reserved": true,
  "sku": {
    "name": "P0v3",
    "tier": "PremiumV3"
  },
  "status": "Ready"
}`
  },
  {
    id: "l3-plan-sku-check",
    level: 3,
    title: "Kiểm tra gói SKU của App Service Plan bằng JMESPath",
    difficulty: "Nâng cao",
    category: "JMESPath",
    mission: "Truy vấn thuộc tính SKU của App Service Plan `$env:APP_PLAN` trong `$env:RESOURCE_GROUP`, trích xuất duy nhất trường `sku.name` dưới dạng text thuần.",
    expectedCommand: "az appservice plan show --resource-group $env:RESOURCE_GROUP --name $env:APP_PLAN --query sku.name -o tsv",
    aliases: [
      "az appservice plan show -g $env:RESOURCE_GROUP -n $env:APP_PLAN --query sku.name -o tsv",
      "az appservice plan show --resource-group $env:RESOURCE_GROUP --name $env:APP_PLAN --query sku.name --output tsv"
    ],
    tokens: ["az", "appservice", "plan", "show", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_PLAN", "--query", "sku.name", "-o", "tsv"],
    hints: [
      "Dùng `az appservice plan show`.",
      "Cung cấp `--resource-group` và `--name`.",
      "Truy vấn thuộc tính lồng nhau: `--query sku.name -o tsv`."
    ],
    mentalModel: {
      rule: "az appservice plan show ... --query sku.name -o tsv",
      breakdown: [
        { part: "sku.name", role: "Nested JMESPath", desc: "Đi từ object cha 'sku' vào thuộc tính con 'name'" },
        { part: "-o tsv", role: "Raw Text Output", desc: "Loại bỏ ngoặc kép, in ra chuỗi sạch P0v3" }
      ]
    },
    parametersExplanation: [
      { param: "sku.name", meaning: "Cú pháp dot-notation của JMESPath để truy cập object lồng nhau." }
    ],
    examNotes: "Thường xuyên xuất hiện trong kịch bản kiểm tra cấu hình tự động (compliance testing).",
    simulatedOutput: `P0v3`
  },
  {
    id: "l3-webapp-create",
    level: 3,
    title: "Tạo Web App từ Container Image ACR",
    difficulty: "Nâng cao",
    category: "Web App",
    mission: "Tạo một Web App tên `$env:APP_NAME` thuộc Resource Group `$env:RESOURCE_GROUP`, chạy trên Plan `$env:APP_PLAN` và trỏ trực tiếp đến image container `$($env:ACR_NAME).azurecr.io/docprocessor:v1`.",
    expectedCommand: "az webapp create --resource-group $env:RESOURCE_GROUP --plan $env:APP_PLAN --name $env:APP_NAME --container-image-name \"$($env:ACR_NAME).azurecr.io/docprocessor:v1\"",
    aliases: [
      "az webapp create -g $env:RESOURCE_GROUP -p $env:APP_PLAN -n $env:APP_NAME --container-image-name \"$($env:ACR_NAME).azurecr.io/docprocessor:v1\"",
      "az webapp create --resource-group $env:RESOURCE_GROUP --plan $env:APP_PLAN --name $env:APP_NAME --container-image-name $($env:ACR_NAME).azurecr.io/docprocessor:v1"
    ],
    tokens: ["az", "webapp", "create", "--resource-group", "$env:RESOURCE_GROUP", "--plan", "$env:APP_PLAN", "--name", "$env:APP_NAME", "--container-image-name", "\"$($env:ACR_NAME).azurecr.io/docprocessor:v1\""],
    hints: [
      "Lệnh là `az webapp create`.",
      "Cần các tham số: `--resource-group`, `--plan`, `--name`.",
      "Cờ trỏ đến image container là `--container-image-name \"$($env:ACR_NAME).azurecr.io/docprocessor:v1\"`."
    ],
    mentalModel: {
      rule: "az webapp create --resource-group <RG> --plan <Plan> --name <App> --container-image-name <Image>",
      breakdown: [
        { part: "az webapp create", role: "Web App Service", desc: "Tạo ứng dụng Web App" },
        { part: "--plan", role: "Hosting Plan", desc: "Chỉ định App Service Plan cung cấp compute" },
        { part: "--container-image-name", role: "Container Spec", desc: "URL đầy đủ của image trong ACR bao gồm domain azurecr.io và tag" }
      ]
    },
    parametersExplanation: [
      { param: "--container-image-name", meaning: "Định dạng đầy đủ: `<loginServer>/<repository>:<tag>`." },
      { param: "$($env:ACR_NAME)", meaning: "Cú pháp sub-expression của PowerShell để nội suy tên biến bên trong chuỗi." }
    ],
    examNotes: "Khi tạo Web App trỏ đến Private ACR lần đầu, Web App chưa có quyền pull image nên bạn cần cấu hình Managed Identity ở các bước tiếp theo.",
    simulatedOutput: `{
  "availabilityState": "Normal",
  "defaultHostName": "app-docprocessor-9e9994d6.azurewebsites.net",
  "id": "/subscriptions/.../resourceGroups/rg-ai200-appsvc-lab/providers/Microsoft.Web/sites/app-docprocessor-9e9994d6",
  "name": "app-docprocessor-9e9994d6",
  "state": "Running"
}`
  },
  {
    id: "l3-webapp-state",
    level: 3,
    title: "Kiểm tra trạng thái hoạt động của Web App",
    difficulty: "Nâng cao",
    category: "Web App",
    mission: "Truy vấn thuộc tính `state` của Web App `$env:APP_NAME` để kiểm tra ứng dụng có đang ở trạng thái `Running` hay không (định dạng tsv).",
    expectedCommand: "az webapp show --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query state -o tsv",
    aliases: [
      "az webapp show -g $env:RESOURCE_GROUP -n $env:APP_NAME --query state -o tsv",
      "az webapp show --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query state --output tsv"
    ],
    tokens: ["az", "webapp", "show", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--query", "state", "-o", "tsv"],
    hints: [
      "Dùng `az webapp show`.",
      "Chỉ định `--resource-group` và `--name`.",
      "Lọc trường `--query state -o tsv`."
    ],
    mentalModel: {
      rule: "az webapp show ... --query state -o tsv",
      breakdown: [
        { part: "state", role: "Attribute", desc: "Trạng thái của Web App: Running, Stopped" },
        { part: "-o tsv", role: "Formatter", desc: "In ra Running sạch" }
      ]
    },
    parametersExplanation: [
      { param: "--query state", meaning: "Trích xuất giá trị trường trạng thái hoạt động." }
    ],
    examNotes: "Dùng trong health-check polling loop để đợi Web App sẵn sàng.",
    simulatedOutput: `Running`
  },
  {
    id: "l3-identity-assign",
    level: 3,
    title: "Cung cấp System-Assigned Managed Identity cho Web App",
    difficulty: "Nâng cao",
    category: "Identity",
    mission: "Kích hoạt định danh quản lý hệ thống (System-Assigned Managed Identity) cho Web App `$env:APP_NAME` trong `$env:RESOURCE_GROUP`.",
    expectedCommand: "az webapp identity assign --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME",
    aliases: [
      "az webapp identity assign -g $env:RESOURCE_GROUP -n $env:APP_NAME",
      "az webapp identity assign --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP"
    ],
    tokens: ["az", "webapp", "identity", "assign", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME"],
    hints: [
      "Nhóm lệnh định danh của Web App là `az webapp identity`.",
      "Hành động cấp mới là `assign`.",
      "Chỉ định `--resource-group` và `--name`."
    ],
    mentalModel: {
      rule: "az webapp identity assign --resource-group <RG> --name <App>",
      breakdown: [
        { part: "az webapp identity", role: "Identity Module", desc: "Quản lý Managed Identity của Web App" },
        { part: "assign", role: "Action", desc: "Tự động đăng ký một Service Principal đại diện cho Web App này trong Microsoft Entra ID" }
      ]
    },
    parametersExplanation: [
      { param: "assign", meaning: "Mặc định tạo System-Assigned Identity gắn liền với vòng đời của Web App." }
    ],
    examNotes: "Khi Web App bị xóa, System-Assigned Identity cũng tự động bị xóa theo, đảm bảo không có định danh rác (orphaned identity).",
    simulatedOutput: `{
  "principalId": "e11727a5-6459-4eee-9141-37b761751a1f",
  "tenantId": "7820a1bc-341e-42ef-a841-f42f38d12345",
  "type": "SystemAssigned",
  "userAssignedIdentities": null
}`
  },
  {
    id: "l3-identity-get-principal",
    level: 3,
    title: "Lấy Principal ID và lưu vào biến $PRINCIPAL_ID",
    difficulty: "Nâng cao",
    category: "Identity",
    mission: "Xem định danh của Web App `$env:APP_NAME`, lọc duy nhất `principalId` dạng text thuần (bỏ ngoặc kép) và gán trực tiếp vào biến `$PRINCIPAL_ID` trong PowerShell.",
    expectedCommand: "$PRINCIPAL_ID = az webapp identity show --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query principalId --output tsv",
    aliases: [
      "$PRINCIPAL_ID = az webapp identity show -g $env:RESOURCE_GROUP -n $env:APP_NAME --query principalId -o tsv",
      "$PRINCIPAL_ID = az webapp identity show --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query principalId -o tsv"
    ],
    tokens: ["$PRINCIPAL_ID =", "az", "webapp", "identity", "show", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--query", "principalId", "--output", "tsv"],
    hints: [
      "Bắt đầu bằng biến nhận kết quả: `$PRINCIPAL_ID =`.",
      "Câu lệnh Azure CLI là `az webapp identity show`.",
      "Kèm theo `--resource-group`, `--name`, `--query principalId` và `--output tsv`."
    ],
    mentalModel: {
      rule: "$Var = az webapp identity show ... --query principalId --output tsv",
      breakdown: [
        { part: "$PRINCIPAL_ID =", role: "Variable Capture", desc: "Lưu GUID kết quả vào biến PowerShell để tái sử dụng" },
        { part: "identity show", role: "Inspect", desc: "Đọc cấu hình định danh" },
        { part: "--query principalId", role: "JMESPath", desc: "Chỉ lấy chuỗi Object ID của Service Principal" },
        { part: "--output tsv", role: "Clean String", desc: "Rất quan trọng: Bỏ dấu ngoặc kép để tránh lỗi định dạng khi truyền vào lệnh az role assignment sau" }
      ]
    },
    parametersExplanation: [
      { param: "--output tsv", meaning: "Bỏ dấu ngoặc kép \" bao quanh GUID, giúp biến nhận chuỗi GUID sạch." }
    ],
    examNotes: "💡 Điểm trừ phổ biến: Quên `--output tsv` khiến biến chứa `\"e1172...\"` có ngoặc kép, làm câu lệnh phân quyền RBAC phía sau bị lỗi cú pháp GUID!",
    simulatedOutput: `PS H:\\azure-lab> $PRINCIPAL_ID
e11727a5-6459-4eee-9141-37b761751a1f`
  },

  // ==========================================
  // LEVEL 4: BẢO MẬT RBAC & APP SETTINGS
  // ==========================================
  {
    id: "l4-acr-get-id",
    level: 4,
    title: "Lấy Resource ID của ACR và lưu vào biến $ACR_ID",
    difficulty: "Chuyên sâu",
    category: "RBAC",
    mission: "Truy vấn thuộc tính `id` (Resource ID đầy đủ của tài nguyên trên Azure) của ACR `$env:ACR_NAME` và gán vào biến `$ACR_ID` dạng chuỗi sạch (tsv).",
    expectedCommand: "$ACR_ID = az acr show --name $env:ACR_NAME --query id --output tsv",
    aliases: [
      "$ACR_ID = az acr show -n $env:ACR_NAME --query id -o tsv",
      "$ACR_ID = az acr show --name $env:ACR_NAME --query id -o tsv"
    ],
    tokens: ["$ACR_ID =", "az", "acr", "show", "--name", "$env:ACR_NAME", "--query", "id", "--output", "tsv"],
    hints: [
      "Bắt đầu với `$ACR_ID =`.",
      "Lệnh là `az acr show --name $env:ACR_NAME`.",
      "Bộ lọc là `--query id --output tsv`."
    ],
    mentalModel: {
      rule: "$ACR_ID = az acr show --name <ACR> --query id --output tsv",
      breakdown: [
        { part: "$ACR_ID =", role: "Target Variable", desc: "Biến lưu trữ Azure Resource Scope ID" },
        { part: "--query id", role: "JMESPath", desc: "Lấy đường dẫn tài nguyên dạng /subscriptions/.../providers/Microsoft.ContainerRegistry/registries/..." },
        { part: "--output tsv", role: "Format", desc: "Chuỗi sạch không ngoặc kép" }
      ]
    },
    parametersExplanation: [
      { param: "--query id", meaning: "Trích xuất Resource ID toàn cục của tài nguyên để làm phạm vi (Scope) phân quyền." }
    ],
    examNotes: "Mọi phân quyền RBAC trên Azure đều cần xác định chính xác Scope thông qua Resource ID này.",
    simulatedOutput: `PS H:\\azure-lab> $ACR_ID
/subscriptions/7820a1bc-341e-42ef-a841-f42f38d12345/resourceGroups/rg-ai200-appsvc-lab/providers/Microsoft.ContainerRegistry/registries/acr9e9994d6`
  },
  {
    id: "l4-rbac-assign",
    level: 4,
    title: "Cấp quyền AcrPull cho Web App qua RBAC",
    difficulty: "Chuyên sâu",
    category: "RBAC",
    mission: "Tạo một Role Assignment cấp quyền vai trò `AcrPull` cho Web App (sử dụng `$PRINCIPAL_ID`) trong phạm vi tài nguyên ACR (sử dụng `$ACR_ID`).",
    expectedCommand: "az role assignment create --assignee $PRINCIPAL_ID --role AcrPull --scope $ACR_ID",
    aliases: [
      "az role assignment create --role AcrPull --assignee $PRINCIPAL_ID --scope $ACR_ID",
      "az role assignment create --assignee $PRINCIPAL_ID --scope $ACR_ID --role AcrPull"
    ],
    tokens: ["az", "role", "assignment", "create", "--assignee", "$PRINCIPAL_ID", "--role", "AcrPull", "--scope", "$ACR_ID"],
    hints: [
      "Nhóm lệnh phân quyền là `az role assignment create`.",
      "Người được cấp quyền là `--assignee $PRINCIPAL_ID`.",
      "Tên vai trò là `--role AcrPull`.",
      "Phạm vi áp dụng là `--scope $ACR_ID`."
    ],
    mentalModel: {
      rule: "az role assignment create --assignee <PrincipalID> --role <RoleName> --scope <ResourceID>",
      breakdown: [
        { part: "az role assignment create", role: "RBAC Engine", desc: "Tạo liên kết phân quyền trên Azure Control Plane" },
        { part: "--assignee", role: "Who", desc: "Đối tượng nhận quyền: Principal ID của Web App" },
        { part: "--role AcrPull", role: "What", desc: "Quyền hạn tối thiểu: Chỉ được kéo image (Pull), không được đẩy (Push) hay xóa" },
        { part: "--scope", role: "Where", desc: "Phạm vi tài nguyên: Chỉ có hiệu lực trên Registry được chỉ định" }
      ]
    },
    parametersExplanation: [
      { param: "--assignee", meaning: "Object ID của Managed Identity cần trao quyền." },
      { param: "--role AcrPull", meaning: "Vai trò tích hợp sẵn (Built-in role) cho phép pull image từ ACR theo nguyên tắc đặc quyền tối thiểu (Principle of Least Privilege)." },
      { param: "--scope", meaning: "Giới hạn quyền hạn chỉ nằm trong duy nhất tài nguyên ACR này, không lan sang tài nguyên khác." }
    ],
    examNotes: "⭐ CÂU HỎI VÀNG AI-200: Không cấp quyền Contributor hay Owner cho ứng dụng kéo image! Luôn chọn vai trò hẹp nhất là `AcrPull`.",
    simulatedOutput: `{
  "id": "/subscriptions/.../providers/Microsoft.Authorization/roleAssignments/b32fa9...",
  "principalId": "e11727a5-6459-4eee-9141-37b761751a1f",
  "principalType": "ServicePrincipal",
  "roleDefinitionId": "/subscriptions/.../providers/Microsoft.Authorization/roleDefinitions/7f951dda-4ed3-4680-a7ca-43fe172d538d",
  "scope": "/subscriptions/.../resourceGroups/rg-ai200-appsvc-lab/providers/Microsoft.ContainerRegistry/registries/acr9e9994d6"
}`
  },
  {
    id: "l4-webapp-acr-identity-config",
    level: 4,
    title: "Cấu hình Web App dùng Managed Identity kéo image",
    difficulty: "Chuyên sâu",
    category: "Web App Security",
    mission: "Sau khi phân quyền RBAC, hãy cập nhật cấu hình Web App `$env:APP_NAME` để ra lệnh cho App Service sử dụng System Managed Identity (`--acr-use-identity true` và `--acr-identity \"[system]\"`) khi kéo image.",
    expectedCommand: "az webapp config set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --acr-use-identity true --acr-identity \"[system]\"",
    aliases: [
      "az webapp config set -g $env:RESOURCE_GROUP -n $env:APP_NAME --acr-use-identity true --acr-identity \"[system]\"",
      "az webapp config set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --acr-use-identity true --acr-identity '[system]'"
    ],
    tokens: ["az", "webapp", "config", "set", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--acr-use-identity", "true", "--acr-identity", "\"[system]\""],
    hints: [
      "Nhóm lệnh cập nhật cấu hình Web App là `az webapp config set`.",
      "Chỉ định `--resource-group` và `--name`.",
      "Bật cờ định danh: `--acr-use-identity true` và chỉ định loại identity: `--acr-identity \"[system]\"`."
    ],
    mentalModel: {
      rule: "az webapp config set ... --acr-use-identity true --acr-identity \"[system]\"",
      breakdown: [
        { part: "az webapp config set", role: "Config Setter", desc: "Thiết lập cấu hình lõi của Web App" },
        { part: "--acr-use-identity true", role: "Auth Toggle", desc: "Bật chế độ xác thực ACR bằng Managed Identity thay vì username/password" },
        { part: "--acr-identity \"[system]\"", role: "Identity Choice", desc: "Chỉ định dùng System-Assigned Identity (viết là \"[system]\")" }
      ]
    },
    parametersExplanation: [
      { param: "--acr-use-identity true", meaning: "Bật tính năng xác thực container registry qua Entra ID Managed Identity." },
      { param: "--acr-identity \"[system]\"", meaning: "Quy ước đặc biệt của Azure CLI để chọn System-Assigned Identity." }
    ],
    examNotes: "Sau bước này, Web App sẽ có thể tự động pull image từ Private ACR mà không cần bất kỳ mật khẩu nào lưu trong cấu hình!",
    simulatedOutput: `{
  "acrIdentity": "[system]",
  "acrUseManagedIdentityCreds": true
}`
  },
  {
    id: "l4-webapp-appsettings-set",
    level: 4,
    title: "Cấu hình biến môi trường (App Settings) cho Web App",
    difficulty: "Chuyên sâu",
    category: "App Settings",
    mission: "Cấu hình 3 biến môi trường runtime cho Web App `$env:APP_NAME`: `ENVIRONMENT=\"production\"`, `LOG_LEVEL=\"INFO\"`, `WEBSITES_PORT=\"8000\"`.",
    expectedCommand: "az webapp config appsettings set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --settings ENVIRONMENT=\"production\" LOG_LEVEL=\"INFO\" WEBSITES_PORT=\"8000\"",
    aliases: [
      "az webapp config appsettings set -g $env:RESOURCE_GROUP -n $env:APP_NAME --settings ENVIRONMENT=\"production\" LOG_LEVEL=\"INFO\" WEBSITES_PORT=\"8000\"",
      "az webapp config appsettings set --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --settings ENVIRONMENT='production' LOG_LEVEL='INFO' WEBSITES_PORT='8000'"
    ],
    tokens: ["az", "webapp", "config", "appsettings", "set", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--settings", "ENVIRONMENT=\"production\"", "LOG_LEVEL=\"INFO\"", "WEBSITES_PORT=\"8000\""],
    hints: [
      "Nhóm lệnh là `az webapp config appsettings set`.",
      "Chỉ định `--resource-group` và `--name`.",
      "Cờ thiết lập là `--settings` theo sau là các cặp KEY=\"VALUE\" cách nhau bởi khoảng trắng."
    ],
    mentalModel: {
      rule: "az webapp config appsettings set ... --settings KEY1=VAL1 KEY2=VAL2",
      breakdown: [
        { part: "az webapp config appsettings", role: "Env Management", desc: "Quản lý biến môi trường của container chạy trên Web App" },
        { part: "set", role: "Action", desc: "Tạo mới hoặc ghi đè giá trị biến" },
        { part: "--settings", role: "Key-Value pairs", desc: "Danh sách các biến môi trường được truyền vào container" }
      ]
    },
    parametersExplanation: [
      { param: "WEBSITES_PORT=\"8000\"", meaning: "Báo cho App Service biết cổng mà ứng dụng container đang lắng nghe (listen) bên trong Docker container." },
      { param: "--settings", meaning: "Cho phép truyền nhiều biến môi trường cùng lúc." }
    ],
    examNotes: "💡 Điểm thi AI-200: Nếu container chạy FastAPI/Flask trên port 8000, bắt buộc phải đặt `WEBSITES_PORT=\"8000\"` để Azure định tuyến traffic vào đúng port.",
    simulatedOutput: `[
  { "name": "ENVIRONMENT", "value": "production", "slotSetting": false },
  { "name": "LOG_LEVEL", "value": "INFO", "slotSetting": false },
  { "name": "WEBSITES_PORT", "value": "8000", "slotSetting": false }
]`
  },
  {
    id: "l4-webapp-appsettings-query-table",
    level: 4,
    title: "Lọc App Settings dạng bảng gọn gàng qua JMESPath",
    difficulty: "Chuyên sâu",
    category: "JMESPath",
    mission: "Liệt kê danh sách biến môi trường của Web App `$env:APP_NAME`, nhưng chỉ lọc lấy 2 cột `Setting` (từ trường `name`) và `Value` (từ trường `value`) hiển thị dạng bảng.",
    expectedCommand: "az webapp config appsettings list --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query \"[].{Setting:name, Value:value}\" --output table",
    aliases: [
      "az webapp config appsettings list -g $env:RESOURCE_GROUP -n $env:APP_NAME --query \"[].{Setting:name, Value:value}\" -o table",
      "az webapp config appsettings list --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query \"[].{Setting:name, Value:value}\" -o table",
      "az webapp config appsettings list --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --query '[].{Setting:name, Value:value}' --output table"
    ],
    tokens: ["az", "webapp", "config", "appsettings", "list", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--query", "\"[].{Setting:name, Value:value}\"", "--output", "table"],
    hints: [
      "Lệnh liệt kê là `az webapp config appsettings list`.",
      "Cú pháp chiếu đa trường trong JMESPath: `--query \"[].{Setting:name, Value:value}\"`.",
      "Định dạng bảng: `--output table`."
    ],
    mentalModel: {
      rule: "az ... list --query \"[].{NewCol:oldProp, ...}\" --output table",
      breakdown: [
        { part: "[]", role: "Array Wildcard", desc: "Duyệt qua tất cả các phần tử trong danh sách trả về" },
        { part: "{Setting:name, Value:value}", role: "Multi-hash projection", desc: "Tạo cấu trúc mới với tên cột 'Setting' lấy từ 'name' và 'Value' lấy từ 'value'" },
        { part: "--output table", role: "Table Renderer", desc: "Vẽ bảng với header là Setting và Value" }
      ]
    },
    parametersExplanation: [
      { param: "[].{Alias:property}", meaning: "Cú pháp tạo bảng tuỳ biến JMESPath cực mạnh của Azure CLI để lọc bỏ các metadata không cần thiết." }
    ],
    examNotes: "Cực kỳ hữu ích trong các bài thi thực hành hoặc báo cáo kiểm thử khi bạn cần chụp ảnh kết quả cấu hình gọn gàng.",
    simulatedOutput: `Setting        Value
-------------  ----------
ENVIRONMENT    production
LOG_LEVEL      INFO
WEBSITES_PORT  8000`
  },
  {
    id: "l4-webapp-appsettings-delete",
    level: 4,
    title: "Xóa biến môi trường khỏi Web App",
    difficulty: "Chuyên sâu",
    category: "App Settings",
    mission: "Xóa cùng lúc 2 biến môi trường `LOG_LEVEL` và `ENVIRONMENT` ra khỏi Web App `$env:APP_NAME`.",
    expectedCommand: "az webapp config appsettings delete --resource-group $env:RESOURCE_GROUP --name $env:APP_NAME --setting-names LOG_LEVEL ENVIRONMENT",
    aliases: [
      "az webapp config appsettings delete -g $env:RESOURCE_GROUP -n $env:APP_NAME --setting-names LOG_LEVEL ENVIRONMENT",
      "az webapp config appsettings delete --name $env:APP_NAME --resource-group $env:RESOURCE_GROUP --setting-names LOG_LEVEL ENVIRONMENT"
    ],
    tokens: ["az", "webapp", "config", "appsettings", "delete", "--resource-group", "$env:RESOURCE_GROUP", "--name", "$env:APP_NAME", "--setting-names", "LOG_LEVEL", "ENVIRONMENT"],
    hints: [
      "Hành động xóa là `delete` trong nhóm `az webapp config appsettings`.",
      "Chỉ định tham số `--setting-names` theo sau là danh sách tên biến cần xóa: `LOG_LEVEL ENVIRONMENT`."
    ],
    mentalModel: {
      rule: "az webapp config appsettings delete ... --setting-names <Name1> <Name2>",
      breakdown: [
        { part: "appsettings delete", role: "Action", desc: "Gỡ bỏ cấu hình biến môi trường" },
        { part: "--setting-names", role: "Target list", desc: "Tên các key cần xóa khỏi App Service" }
      ]
    },
    parametersExplanation: [
      { param: "--setting-names", meaning: "Cho phép liệt kê một hoặc nhiều biến cần xóa, cách nhau bởi khoảng trắng." }
    ],
    examNotes: "Sau khi xóa biến, Web App sẽ tự động khởi động lại (restart) để nạp lại môi trường mới.",
    simulatedOutput: `[
  { "name": "WEBSITES_PORT", "value": "8000", "slotSetting": false }
]`
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "Tại sao trong câu lệnh gán biến PowerShell `$PRINCIPAL_ID = az webapp identity show ...` ta PHẢI sử dụng cờ `--output tsv`?",
    options: [
      "Vì `--output tsv` chạy nhanh hơn `--output json` 10 lần.",
      "Vì cờ `tsv` sẽ loại bỏ dấu ngoặc kép `\"\"` bao quanh GUID, giúp biến nhận chuỗi ký tự sạch không bị lỗi cú pháp khi truyền vào lệnh sau.",
      "Vì Azure chỉ hỗ trợ giao thức TSV cho các lệnh Managed Identity.",
      "Vì nếu dùng json thì PowerShell sẽ bị crash."
    ],
    correctIndex: 1,
    explanation: "Cờ `--output tsv` (Tab-Separated Values) in ra text thô và quan trọng nhất là bỏ cặp ngoặc kép `\"\"`. Nếu dùng JSON, biến `$PRINCIPAL_ID` sẽ chứa cả dấu ngoặc kép dạng `\"e117...\"`, dẫn đến lỗi định dạng khi truyền vào tham số `--assignee` của lệnh `az role assignment create`."
  },
  {
    id: "q2",
    question: "Theo Best Practice về bảo mật trên Azure (AI-200), tại sao khi tạo ACR ta nên đặt `--admin-enabled false`?",
    options: [
      "Để tiết kiệm chi phí dịch vụ ACR hàng tháng.",
      "Để ngăn việc chia sẻ và lộ lọt một bộ username/password admin tĩnh duy nhất, thay vào đó ép buộc sử dụng Managed Identity hoặc RBAC phân quyền tối thiểu.",
      "Vì tài khoản admin chỉ dùng được trên hệ điều hành Windows.",
      "Vì gói SKU Basic không hỗ trợ admin user."
    ],
    correctIndex: 1,
    explanation: "Tài khoản admin tĩnh của ACR có toàn quyền đọc/ghi và không thể phân quyền chi tiết (không tuân thủ Least Privilege). Khi lộ mật khẩu admin, toàn bộ registry bị xâm phạm. Việc vô hiệu hóa `--admin-enabled false` và dùng Managed Identity là chuẩn thiết kế bảo mật của Microsoft."
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
    question: "Cờ nào trong lệnh `az acr repository update` giúp bảo vệ image container trong ACR chống việc bị push đè hoặc xóa nhầm trong Production?",
    options: [
      "--lock true",
      "--write-enable false",
      "--read-only true",
      "--protect-image"
    ],
    correctIndex: 1,
    explanation: "Lệnh `az acr repository update --name <ACR> --image <Repo:Tag> --write-enable false` thiết lập Immutability cho image tag, chặn mọi thao tác ghi đè và xóa nhầm."
  },
  {
    id: "q5",
    question: "Lợi ích lớn nhất của việc chạy `az config set defaults.group=$env:RESOURCE_GROUP` là gì?",
    options: [
      "Tự động xóa Resource Group khi tắt máy.",
      "Cho phép bỏ qua cờ `--resource-group` (hoặc `-g`) trong các câu lệnh `az` tiếp theo, CLI sẽ tự động lấy RG mặc định này.",
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
  }
];

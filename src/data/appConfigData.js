/**
 * Dataset for Azure Key Vault & Azure App Configuration Lab
 * Based on Microsoft AI-200 Lession 8:
 * - app-config-python (App Configuration Store, Label Stacking, Sentinel Refresh, Key Vault References)
 * - key-vault-python (Key Vault, RBAC Data Plane, Secret Versioning, In-memory TTL Caching)
 */

export const KEYVAULT_CATEGORIES = [
  { id: "all", label: "Tất cả dịch vụ", icon: "🌐" },
  { id: "keyvault", label: "Azure Key Vault (Secrets & RBAC)", icon: "🔐" },
  { id: "appconfig", label: "Azure App Configuration (Store & Labels)", icon: "⚙️" },
  { id: "references", label: "Key Vault References", icon: "🔗" },
  { id: "sentinel", label: "Sentinel & Dynamic Refresh", icon: "🔄" },
  { id: "caching", label: "Secret Caching & Resilience", icon: "⚡" }
];

export const KEYVAULT_OPERATIONS = [
  {
    id: "kv-create-rbac",
    title: "1. Khởi Tạo Key Vault Chuẩn RBAC Authorization",
    category: "keyvault",
    badge: "Key Vault",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    summary: "Tạo Azure Key Vault với cờ `--enable-rbac-authorization true` để áp dụng kiểm soát truy cập dữ liệu qua Azure RBAC hiện đại thay cho Access Policies truyền thống.",
    cliCommand: "az keyvault create --resource-group $env:RG --name $env:KV_NAME --location eastus --enable-rbac-authorization true",
    pythonEquivalent: `# Khởi tạo client kết nối Key Vault qua Microsoft Entra ID
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

vault_url = "https://<kv-name>.vault.azure.net"
credential = DefaultAzureCredential()
client = SecretClient(vault_url=vault_url, credential=credential)`,
    rbacRole: "Key Vault Administrator / Contributor (Control Plane)",
    bestPractice: "Bật RBAC để hỗ trợ Privileged Identity Management (PIM) và phân quyền chi tiết tới từng Secret riêng lẻ mà không bị giới hạn 1024 access policies.",
    simulatedOutput: `{
  "id": "/subscriptions/sub-123/resourceGroups/rg-ai200/providers/Microsoft.KeyVault/vaults/kv-ai200-prod",
  "location": "eastus",
  "name": "kv-ai200-prod",
  "properties": {
    "enableRbacAuthorization": true,
    "enableSoftDelete": true,
    "softDeleteRetentionInDays": 90,
    "provisioningState": "Succeeded",
    "vaultUri": "https://kv-ai200-prod.vault.azure.net/"
  }
}`
  },
  {
    id: "kv-assign-officer",
    title: "2. Gán Quyền Key Vault Secrets Officer",
    category: "keyvault",
    badge: "RBAC Security",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    summary: "Cấp vai trò Key Vault Secrets Officer cho quản trị viên hoặc pipeline deployment để có toàn quyền thêm, đọc, cập nhật và xóa bí mật (Data Plane).",
    cliCommand: "az role assignment create --role \"Key Vault Secrets Officer\" --assignee $env:USER_OID --scope $KV_ID",
    pythonEquivalent: `# Thao tác Data Plane yêu cầu quyền Key Vault Secrets Officer
client.set_secret("openai-api-key", "sk-proj-xyz...", content_type="application/x-api-key")`,
    rbacRole: "Key Vault Secrets Officer",
    bestPractice: "Không gán vai trò Owner hay Contributor cho việc đọc ghi Secret; các vai trò Control Plane không mặc định cấp quyền đọc giá trị bí mật khi bật RBAC.",
    simulatedOutput: `{
  "id": "/subscriptions/sub-123/resourceGroups/rg-ai200/providers/Microsoft.KeyVault/vaults/kv-ai200-prod/providers/Microsoft.Authorization/roleAssignments/ra-456",
  "principalId": "00000000-0000-0000-0000-000000000001",
  "roleDefinitionName": "Key Vault Secrets Officer",
  "scope": "/subscriptions/sub-123/resourceGroups/rg-ai200/providers/Microsoft.KeyVault/vaults/kv-ai200-prod"
}`
  },
  {
    id: "kv-set-secret",
    title: "3. Lưu Trữ Secret & Gắn Metadata Content-Type, Tags",
    category: "keyvault",
    badge: "Key Vault",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    summary: "Lưu API Key hoặc chuỗi kết nối vào Key Vault, kèm thuộc tính `--content-type` và `--tags` để phân loại môi trường.",
    cliCommand: "az keyvault secret set --vault-name $env:KV_NAME --name openai-api-key --value \"sk-proj-prod123456\" --content-type \"application/x-api-key\" --tags environment=production service=openai",
    pythonEquivalent: `client.set_secret(
    name="openai-api-key",
    value="sk-proj-prod123456",
    content_type="application/x-api-key",
    tags={"environment": "production", "service": "openai"}
)`,
    rbacRole: "Key Vault Secrets Officer",
    bestPractice: "Luôn gắn content-type để client phân biệt được loại dữ liệu (ví dụ JSON, token, connection string) và tags để lọc chi phí.",
    simulatedOutput: `{
  "attributes": {
    "created": "2026-10-31T09:00:00+00:00",
    "enabled": true,
    "recoveryLevel": "Recoverable+Purgeable",
    "updated": "2026-10-31T09:00:00+00:00"
  },
  "contentType": "application/x-api-key",
  "id": "https://kv-ai200-prod.vault.azure.net/secrets/openai-api-key/43c8d19a2b7e40a08e1",
  "name": "openai-api-key",
  "tags": {
    "environment": "production",
    "service": "openai"
  },
  "value": "sk-proj-prod123456"
}`
  },
  {
    id: "kv-get-secret-versions",
    title: "4. Lấy Bí Mật & Quản Lý Secret Versioning",
    category: "keyvault",
    badge: "Key Vault",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    summary: "Key Vault tự động tạo version GUID mới mỗi khi bí mật được cập nhật. Lệnh get không kèm version sẽ luôn lấy phiên bản mới nhất.",
    cliCommand: "az keyvault secret show --vault-name $env:KV_NAME --name openai-api-key --query \"{version:properties.version, value:value}\" -o json",
    pythonEquivalent: `# Lấy phiên bản mới nhất
secret = client.get_secret("openai-api-key")
print(f"Version: {secret.properties.version}, Value: {secret.value[:10]}...")

# Hoặc lấy phiên bản lịch sử cụ thể
old_secret = client.get_secret("openai-api-key", version="43c8d19a2b7e40a08e1")`,
    rbacRole: "Key Vault Secrets User",
    bestPractice: "Sử dụng URI không chứa version trong cấu hình ứng dụng để ứng dụng tự động nhận key mới sau khi xoay vòng khóa (key rotation).",
    simulatedOutput: `{
  "value": "sk-proj-prod123456",
  "version": "43c8d19a2b7e40a08e1"
}`
  },
  {
    id: "kv-list-metadata-only",
    title: "5. Liệt Kê Thuộc Tính Secret Không Làm Lộ Giá Trị",
    category: "keyvault",
    badge: "Least Privilege",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    summary: "Duyệt danh sách các bí mật để kiểm tra thời hạn hết hạn (expiry date) và cờ enabled mà không cần tải giá trị nhạy cảm vào bộ nhớ.",
    cliCommand: "az keyvault secret list --vault-name $env:KV_NAME --query \"[].{name:name, enabled:attributes.enabled, contentType:contentType}\" -o table",
    pythonEquivalent: `# Least Privilege: chỉ duyệt metadata
for prop in client.list_properties_of_secrets():
    print(f"Secret: {prop.name}, Enabled: {prop.enabled}, Type: {prop.content_type}")`,
    rbacRole: "Key Vault Secrets User / Key Vault Reader",
    bestPractice: "Dùng `list_properties_of_secrets()` cho các dashboard giám sát và kiểm toán bảo mật để tránh rò rỉ dữ liệu nhạy cảm qua log.",
    simulatedOutput: `Name                          Enabled    ContentType
----------------------------  ---------  -------------------------------
openai-api-key                True       application/x-api-key
cosmosdb-connection-string    True       application/x-connection-string`
  },
  {
    id: "appconfig-create-store",
    title: "6. Khởi Tạo Store Azure App Configuration SKU Standard",
    category: "appconfig",
    badge: "App Configuration",
    badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    summary: "Tạo kho cấu hình tập trung phân tán với SKU Standard, hỗ trợ lưu trữ không giới hạn key-values, snapshot và khả năng dynamic refresh tức thì.",
    cliCommand: "az appconfig create --resource-group $env:RG --name $env:APPCONFIG_NAME --location eastus --sku Standard",
    pythonEquivalent: `# Kết nối App Configuration Store bằng Python SDK
from azure.identity import DefaultAzureCredential
from azure.appconfiguration.provider import load, SettingSelector

endpoint = "https://<appconfig-name>.azconfig.io"
provider = load(endpoint=endpoint, credential=DefaultAzureCredential())`,
    rbacRole: "Contributor / App Configuration Data Owner",
    bestPractice: "Trong môi trường Enterprise, luôn dùng SKU Standard để có SLA 99.9%, hỗ trợ Private Link và lưu giữ lịch sử cấu hình lên đến 30 ngày.",
    simulatedOutput: `{
  "endpoint": "https://appconfig-ai200-prod.azconfig.io",
  "id": "/subscriptions/sub-123/resourceGroups/rg-ai200/providers/Microsoft.AppConfiguration/configurationStores/appconfig-ai200-prod",
  "location": "eastus",
  "name": "appconfig-ai200-prod",
  "sku": { "name": "Standard" }
}`
  },
  {
    id: "appconfig-assign-data-owner",
    title: "7. Gán Quyền App Configuration Data Owner",
    category: "appconfig",
    badge: "RBAC Security",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    summary: "Cấp quyền thao tác quản lý dữ liệu cấu hình trong App Configuration Store cho người dùng hoặc CI/CD pipeline.",
    cliCommand: "az role assignment create --role \"App Configuration Data Owner\" --assignee $env:USER_OID --scope $APPCONFIG_ID",
    pythonEquivalent: `# Ứng dụng runtime tiêu thụ chỉ cần vai trò "App Configuration Data Reader"
# Quản trị viên/CI-CD sử dụng vai trò "App Configuration Data Owner"`,
    rbacRole: "App Configuration Data Owner",
    bestPractice: "Áp dụng Managed Identity giữa App Service / Container App và App Configuration thay vì dùng Access Key chuỗi kết nối.",
    simulatedOutput: `{
  "principalId": "00000000-0000-0000-0000-000000000001",
  "roleDefinitionName": "App Configuration Data Owner",
  "scope": "/subscriptions/sub-123/resourceGroups/rg-ai200/providers/Microsoft.AppConfiguration/configurationStores/appconfig-ai200-prod"
}`
  },
  {
    id: "appconfig-set-default-kv",
    title: "8. Thiết Lập Khóa Cấu Hình Mặc Định (Unlabeled)",
    category: "appconfig",
    badge: "App Configuration",
    badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    summary: "Tạo cấu hình cơ sở (null label / label '\\0') áp dụng chung cho tất cả môi trường khi không có ghi đè chuyên biệt.",
    cliCommand: "az appconfig kv set --name $env:APPCONFIG_NAME --key \"OpenAI:Endpoint\" --value \"https://my-openai.openai.azure.com/\" --yes",
    pythonEquivalent: `# Selector nạp khóa không nhãn làm nền tảng
selects = [
    SettingSelector(key_filter="*", label_filter="\\0")
]`,
    rbacRole: "App Configuration Data Owner",
    bestPractice: "Dùng cú pháp phân cấp với dấu hai chấm ':' (ví dụ: Section:SubSection:Setting) để tương thích chuẩn Microsoft Configuration Providers.",
    simulatedOutput: `{
  "contentType": null,
  "etag": "aBcD1234EfGh",
  "key": "OpenAI:Endpoint",
  "label": null,
  "lastModified": "2026-10-31T09:05:00+00:00",
  "value": "https://my-openai.openai.azure.com/"
}`
  },
  {
    id: "appconfig-label-stacking",
    title: "9. Kỹ Thuật Label Stacking (Xếp Chồng Nhãn Môi Trường)",
    category: "appconfig",
    badge: "Label Stacking",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    summary: "Đặt cấu hình với nhãn `--label Production` để tự động ghi đè lên khóa cùng tên không có nhãn khi triển khai môi trường Prod.",
    cliCommand: "az appconfig kv set --name $env:APPCONFIG_NAME --key \"Pipeline:BatchSize\" --value \"200\" --label \"Production\" --yes",
    pythonEquivalent: `# Thứ tự xếp chồng: '\\0' (mặc định) -> 'Production' (ghi đè)
selects = [
    SettingSelector(key_filter="*", label_filter="\\0"),
    SettingSelector(key_filter="*", label_filter="Production")
]
config = load(endpoint=endpoint, credential=credential, selects=selects)`,
    rbacRole: "App Configuration Data Owner",
    bestPractice: "Kỹ thuật Label Stacking giúp giữ kho cấu hình DRY (Don't Repeat Yourself), chỉ khai báo phần khác biệt cho từng môi trường.",
    simulatedOutput: `{
  "key": "Pipeline:BatchSize",
  "label": "Production",
  "value": "200"
}`
  },
  {
    id: "appconfig-kv-reference",
    title: "10. Liên Kết Key Vault Reference Trong App Configuration",
    category: "references",
    badge: "Key Vault Ref",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    summary: "Tạo cấu hình trỏ thẳng tới Secret Identifier trong Key Vault. App Configuration SDK sẽ tự động giải mã lấy giá trị bí mật mà ứng dụng không cần viết thêm code kết nối Key Vault.",
    cliCommand: "az appconfig kv set-keyvault --name $env:APPCONFIG_NAME --key \"OpenAI:ApiKey\" --secret-identifier \"https://kv-ai200-prod.vault.azure.net/secrets/openai-api-key\" --yes",
    pythonEquivalent: `from azure.appconfiguration.provider import AzureAppConfigurationKeyVaultOptions

# Bật phân giải tự động Key Vault References
key_vault_options = AzureAppConfigurationKeyVaultOptions(
    credential=DefaultAzureCredential()
)

config = load(
    endpoint=endpoint,
    credential=credential,
    key_vault_options=key_vault_options
)
# Giá trị 'OpenAI:ApiKey' được tự động giải mã thành secret thật!
print(config["OpenAI:ApiKey"][:10])`,
    rbacRole: "App Configuration Data Owner + Key Vault Secrets User",
    bestPractice: "Tách bạch rõ ràng: App Configuration lưu cấu trúc cấu hình và tham chiếu, Key Vault lưu trữ an toàn các bí mật nhạy cảm.",
    simulatedOutput: `{
  "contentType": "application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8",
  "key": "OpenAI:ApiKey",
  "label": null,
  "value": "{\\"uri\\":\\"https://kv-ai200-prod.vault.azure.net/secrets/openai-api-key\\"}"
}`
  },
  {
    id: "appconfig-sentinel-key",
    title: "11. Khởi Tạo Sentinel Key Cho Dynamic Refresh",
    category: "sentinel",
    badge: "Sentinel Pattern",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    summary: "Tạo khóa canh gác 'Sentinel' (ví dụ giá trị ban đầu là 1). Khi có bất kỳ thay đổi cấu hình nào, ta tăng giá trị Sentinel lên 2 để kích hoạt reload toàn bộ ứng dụng.",
    cliCommand: "az appconfig kv set --name $env:APPCONFIG_NAME --key \"Sentinel\" --value \"1\" --yes",
    pythonEquivalent: `# Thiết lập Dynamic Refresh giám sát duy nhất khóa Sentinel
config = load(
    endpoint=endpoint,
    credential=credential,
    refresh_on=["Sentinel"],
    refresh_interval=30  # Chu kỳ kiểm tra 30 giây
)`,
    rbacRole: "App Configuration Data Owner",
    bestPractice: "Chỉ đặt cờ refresh_on cho Sentinel key thay vì tất cả các key để tiết kiệm số lượng request API và đảm bảo tính nguyên tử (atomic update).",
    simulatedOutput: `{
  "key": "Sentinel",
  "label": null,
  "value": "1"
}`
  },
  {
    id: "appconfig-trigger-refresh",
    title: "12. Kích Hoạt Refresh Động Không Cần Khởi Động Lại App",
    category: "sentinel",
    badge: "Dynamic Reload",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    summary: "Trong vòng lặp xử lý request (hoặc middleware), gọi `config.refresh()`. Hàm này sẽ kiểm tra Sentinel key; nếu thay đổi, nó lập tức cập nhật dictionary cấu hình.",
    cliCommand: "az appconfig kv set --name $env:APPCONFIG_NAME --key \"Sentinel\" --value \"2\" --yes",
    pythonEquivalent: `# Trong request handler của Flask / FastAPI / Django:
refreshed = config.refresh()
if refreshed:
    print(">> Đã cập nhật cấu hình mới vào runtime mà không cần restart container!")
batch_size = config["Pipeline:BatchSize"]`,
    rbacRole: "App Configuration Data Owner (khi sửa) / App Configuration Data Reader (khi đọc)",
    bestPractice: "Gọi `config.refresh()` định kỳ trong middleware web app; hàm có cơ chế kiểm tra nội bộ không tốn băng thông nếu chưa hết `refresh_interval`.",
    simulatedOutput: `[INFO] Sentinel changed: 1 -> 2
[INFO] Refreshing configuration snapshot...
[SUCCESS] 4 keys updated atomically. Zero downtime achieved.`
  },
  {
    id: "kv-caching-resilience",
    title: "13. In-Memory Caching & Chống Lỗi Throttling 429",
    category: "caching",
    badge: "Resilience",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    summary: "Triển khai bộ nhớ cache cục bộ (TTL = 30-300 giây) để giảm tải số cuộc gọi mạng tới Azure Key Vault và ngăn ngừa lỗi HTTP 429 Too Many Requests.",
    cliCommand: "az monitor metrics list --resource $KV_ID --metric \"ServiceApiHit\" --interval PT1M",
    pythonEquivalent: `import time

cache = {}
CACHE_TTL = 30  # Giây

def get_cached_secret(name):
    now = time.monotonic()
    if name in cache and (now - cache[name]["time"]) < CACHE_TTL:
        return cache[name]["val"]  # Cache Hit!
    
    # Cache Miss: Gọi API Key Vault
    secret = client.get_secret(name)
    cache[name] = {"val": secret.value, "time": now}
    return secret.value`,
    rbacRole: "Key Vault Secrets User",
    bestPractice: "Key Vault có giới hạn giao dịch (throttling limit). Luôn cache secret trong RAM của process hoặc dùng Azure App Configuration provider.",
    simulatedOutput: `Round 1: openai-api-key -> cache miss (gọi API Key Vault: 1)
Round 2: openai-api-key -> cache hit  (đọc từ RAM: 0ms)
Round 3: openai-api-key -> cache hit  (đọc từ RAM: 0ms)
Total API calls: 1 / 5 accesses (Tiết kiệm 80% request)`
  },
  {
    id: "kv-soft-delete-recovery",
    title: "14. Khôi Phục Key Vault Đã Bị Soft-Deleted",
    category: "keyvault",
    badge: "Disaster Recovery",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    summary: "Kiểm tra danh sách các Key Vault đã bị xóa tạm thời và thực hiện khôi phục nguyên vẹn trạng thái trước khi xóa.",
    cliCommand: "az keyvault recover --name $env:KV_NAME",
    pythonEquivalent: `# Kiểm tra trạng thái soft-delete bằng CLI hoặc SDK
# az keyvault show-deleted --name <vault-name>
# az keyvault recover --name <vault-name>`,
    rbacRole: "Key Vault Administrator / Owner",
    bestPractice: "Soft-delete được bật mặc định 90 ngày. Kết hợp với Purge Protection để ngăn ngừa việc nhân viên xóa vĩnh viễn dữ liệu bí mật.",
    simulatedOutput: `{
  "id": "/subscriptions/sub-123/resourceGroups/rg-ai200/providers/Microsoft.KeyVault/vaults/kv-ai200-prod",
  "name": "kv-ai200-prod",
  "properties": {
    "provisioningState": "Succeeded",
    "vaultUri": "https://kv-ai200-prod.vault.azure.net/"
  }
}`
  },
  {
    id: "kv-purge-vault",
    title: "15. Xóa Vĩnh Viễn Key Vault Khỏi Trạng Thái Soft-Delete",
    category: "keyvault",
    badge: "Lifecycle & Cleanup",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    summary: "Giải phóng hoàn toàn tên miền Key Vault toàn cầu bằng lệnh purge (chỉ thực hiện được nếu vault KHÔNG bật Purge Protection).",
    cliCommand: "az keyvault purge --name $env:KV_NAME --no-wait",
    pythonEquivalent: `# Purge giải phóng DNS *.vault.azure.net ngay lập tức
# Sau khi purge, tên vault có thể được đăng ký lại`,
    rbacRole: "Key Vault Purge operator (Subscription level)",
    bestPractice: "Chỉ purge trong môi trường dev/lab thực hành. Trong production, BẮT BUỘC bật Purge Protection để chống tấn công Ransomware.",
    simulatedOutput: `Key Vault 'kv-ai200-prod' purge operation initiated successfully.`
  }
];

export const ARCHITECTURE_MATRIX = [
  {
    feature: "Mục đích sử dụng chính",
    appConfig: "Quản lý cấu hình tập trung phân tán, Feature Flags, Label Stacking",
    keyVault: "Lưu trữ an toàn Secrets (API Keys, connection strings), Khóa mã hóa, Chứng chỉ số",
    appSettings: "Các biến môi trường tĩnh cục bộ cho từng Container App / App Service đơn lẻ",
    localEnv: "Chỉ dùng khi dev cục bộ trên máy lập trình viên (.env)"
  },
  {
    feature: "Cơ chế cập nhật khi thay đổi",
    appConfig: "Dynamic Refresh (Sentinel Pattern) tức thì, ZERO downtime, không restart app",
    keyVault: "Tự động phân giải qua Key Vault Reference hoặc đọc qua SecretClient có cache",
    appSettings: "Yêu cầu restart container / redeploy revision để nhận biến môi trường mới",
    localEnv: "Khởi động lại process server thủ công"
  },
  {
    feature: "Mô hình bảo mật truy cập",
    appConfig: "Microsoft Entra ID RBAC (App Configuration Data Owner / Reader)",
    keyVault: "Hardware Security Module (HSM), FIPS 140, Entra ID RBAC, Soft-Delete & Purge Protection",
    appSettings: "Kế thừa quyền quản trị App Service (Contributor có thể đọc bản rõ)",
    localEnv: "File bản rõ trên đĩa cứng (Dễ bị commit nhầm lên Git)"
  },
  {
    feature: "Hỗ trợ môi trường (Dev/Prod)",
    appConfig: "Rất mạnh với Label Stacking (\\0 -> Staging -> Production)",
    keyVault: "Qua tên Secret hoặc Vault riêng cho từng môi trường",
    appSettings: "Phải gán lại thủ công trên từng Deployment Slot",
    localEnv: ".env.development, .env.production"
  },
  {
    feature: "Khuyến nghị trong AI-200",
    appConfig: "⭐⭐⭐ Kết hợp làm điểm vào cấu hình duy nhất",
    keyVault: "⭐⭐⭐ Kho bảo mật chuyên dụng cho mọi chuỗi bí mật",
    appSettings: "Chỉ lưu trỏ tới App Config Endpoint hoặc Key Vault URI",
    localEnv: "❌ Tuyệt đối không commit hoặc mang lên cloud"
  }
];

export const RBAC_ROLES_GUIDE = [
  {
    role: "Key Vault Secrets Officer",
    scope: "Key Vault Data Plane",
    permissions: "Tạo, đọc, cập nhật, xóa, khôi phục bí mật (Secret CRUD)",
    target: "Kỹ sư vận hành, DevOps Pipeline, Quản trị viên Secret"
  },
  {
    role: "Key Vault Secrets User",
    scope: "Key Vault Data Plane",
    permissions: "Chỉ đọc nội dung và metadata bí mật (Secret Get / List)",
    target: "Managed Identity của App Service, Container App, Azure Functions"
  },
  {
    role: "Key Vault Crypto Officer",
    scope: "Key Vault Data Plane",
    permissions: "Quản lý Khóa mã hóa (Keys), tạo key, mã hóa/giải mã",
    target: "Chuyên gia bảo mật mật mã học"
  },
  {
    role: "App Configuration Data Owner",
    scope: "App Configuration Data Plane",
    permissions: "Toàn quyền đọc/ghi key-values, nhãn, snapshot, Key Vault refs",
    target: "Quản trị viên cấu hình, Lead Developer, CI/CD pipeline"
  },
  {
    role: "App Configuration Data Reader",
    scope: "App Configuration Data Plane",
    permissions: "Chỉ đọc key-values và đăng ký lắng nghe Dynamic Refresh",
    target: "Managed Identity của ứng dụng tiêu thụ cấu hình"
  }
];

export const INITIAL_SIMULATOR_CONFIG = {
  defaultSettings: {
    "OpenAI:Endpoint": "https://my-openai.openai.azure.com/",
    "OpenAI:Model": "gpt-4o-mini",
    "Pipeline:BatchSize": "50",
    "Features:EnableStreaming": "true",
    "OpenAI:ApiKey": "[KV Ref] https://kv-ai200-prod.vault.azure.net/secrets/openai-api-key",
    "Sentinel": "1"
  },
  productionOverrides: {
    "OpenAI:Model": "gpt-4o",
    "Pipeline:BatchSize": "200",
    "Features:EnableStreaming": "true"
  },
  stagingOverrides: {
    "OpenAI:Model": "gpt-4o-mini",
    "Pipeline:BatchSize": "20",
    "Features:EnableStreaming": "false"
  },
  resolvedKeyVaultSecrets: {
    "https://kv-ai200-prod.vault.azure.net/secrets/openai-api-key": "sk-proj-prod123456...a9f"
  }
};


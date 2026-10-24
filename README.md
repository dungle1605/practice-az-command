# AZ-COMMAND MASTER ⚡

> Nền tảng webapp tương tác luyện tập Azure CLI (`az`) thực chiến dành cho chứng chỉ **Microsoft AI-200** và **Azure DevOps**, xây dựng hoàn toàn từ tài liệu thực hành cốt lõi qua 4 bài lab: ACR Tasks, App Service Container, Sidecar Containers, và Azure Container Apps (ACA).

---

> [!IMPORTANT]
> **CAM KẾT AN TOÀN TUYỆT ĐỐI (100% CLIENT-SIDE SANDBOX SIMULATION)**:
> - Ứng dụng này là môi trường **GIẢ LẬP ĐÀO TẠO THUẦN TÚY TRÊN TRÌNH DUYỆT (OFFLINE FRONTEND)**.
> - **HOÀN TOÀN KHÔNG thực thi lệnh** lên hệ điều hành hay terminal thật trên máy tính của bạn.
> - **HOÀN TOÀN KHÔNG kết nối hay gửi lệnh** đến tài khoản Microsoft Azure thật (không tạo tài nguyên, không phát sinh chi phí, không cần đăng nhập tài khoản thực).
> - Mọi thao tác gõ lệnh chỉ được phân tích cú pháp bằng Javascript (`commandValidator.js`) để chấm điểm và hiển thị dữ liệu kết quả mô phỏng (Mock Data).

---

## 🌟 Điểm nổi bật của Ứng dụng

1. **Lộ trình phân cấp độ tăng dần (6 Levels Progression - 63 Bài Thực Hành)**:
   - **Level 1: Nhập môn & Môi trường (6 bài)**: Đăng nhập Headless (`az login --use-device-code`), đăng ký Resource Provider (`Microsoft.ContainerRegistry`, `Microsoft.Web`), nạp biến môi trường tự động (`. .\.env.ps1`), gán biến thủ công (`$env:ACR_NAME="..."`), cấu hình Resource Group mặc định (`az config set defaults.group`).
   - **Level 2: Azure Container Registry (7 bài)**: Build Image trên Cloud qua ACR Tasks (`az acr build`), chạy thử container Smoke Test (`az acr run`), liệt kê Repository & Tags, kiểm tra Digest SHA256 (`az acr manifest list-metadata`), khóa Image Bất biến (`--write-enabled false`), xem lịch sử build (`az acr task list-runs`).
   - **Level 3: App Service & Container Web App (5 bài)**: Tạo App Service Plan Linux gói `P0v3`, tạo Web App từ container image, cập nhật Container Settings (`az webapp config container set`), trích xuất URL sạch (`--query defaultHostName -o tsv`), xem Log trực tiếp thời gian thực (`az webapp log tail`).
   - **Level 4: Bảo mật RBAC & App Settings (9 bài)**: Bật System-Assigned Managed Identity, lấy Principal ID & Scope ID bằng JMESPath (`-o tsv`), phân quyền đặc quyền tối thiểu `AcrPull`, cấu hình Web App xác thực kéo image bằng Managed Identity, cấu hình cổng runtime `WEBSITES_PORT=8000` & Storage, bật Always-On, bật Container Logging ra filesystem, lọc bảng dữ liệu bằng JMESPath Multi-hash Projection `[].{Setting:name, Value:value}`.
   - **Level 5: Sidecar Containers (Bài Lab 3 Nâng cao - 4 bài)**: Mô hình Multi-container Pod, áp dụng cấu hình Sidecar từ file JSON `sitecontainers-spec.json`, liệt kê các container trong Pod, xem luồng log độc lập của Sidecar container (`model-server`), kiểm tra trạng thái sức khỏe (Health Status).
   - **Level 6: Azure Container Apps (ACA) - Quản lý, Giám sát & Chẩn đoán lỗi (32 bài)**:
     - *Phần A (6 bài)*: Quản lý Revisions & Cập nhật Image mới bằng Digest SHA256 (`az containerapp update --image ...@sha256:...`), xác minh cấu hình containers sau update, liệt kê Revisions (`revision list -o table`), xem chi tiết Revision (`revision show`), vô hiệu hóa Revision lỗi (`revision deactivate` để giữ lại bằng chứng), lọc nhanh Active & Health State bằng JMESPath Projection `[].{name:name,active:properties.active,health:properties.healthState}`.
     - *Phần B (3 bài)*: Quản lý Vòng đời (Lifecycle) gồm Dừng App (`stop`), Khởi động App (`start`), và Restart App (`restart` để dọn dẹp lỗi tạm thời mà không tạo revision mới).
     - *Phần C (6 bài)*: Chẩn đoán & Sửa lỗi (Troubleshooting) gồm Log Streaming thời gian thực (`logs show --follow`), chẩn đoán thiếu biến môi trường (`--query properties.template.containers[0].env -o table`), mô phỏng sự cố xóa biến môi trường (`--remove-env-vars`), sửa lỗi thêm lại biến môi trường (`--set-env-vars`), chẩn đoán sai cổng Ingress (`--query properties.configuration.ingress -o yaml`), sửa lỗi Target Port (`az containerapp ingress update --target-port`).
     - *Phần D (3 bài)*: Truy vấn Log Analytics gồm trích xuất Workspace ID (`customerId`) với `-o tsv`, truy vấn 20 log gần nhất qua ngôn ngữ KQL từ bảng `ContainerAppConsoleLogs_CL`, và lọc log chứa lỗi với toán tử KQL `contains 'error'`.
     - *Phần E (1 bài)*: Cấu hình Health Probes từ lý thuyết Module (`--query properties.template.containers[0].probes -o yaml`), hiểu rõ sự khác biệt giữa Liveness Probe và Readiness Probe.
     - *Phần F (3 bài - Bổ sung Lab 1 ACA)*: Khởi tạo Container App với Managed Identity & Secrets gồm tạo Container App với System Managed Identity & tự động gán quyền AcrPull (`--registry-identity system`), tạo secret mã hóa trong kho (`az containerapp secret set`), và tham chiếu secret qua biến môi trường (`--set-env-vars ENV=secretref:<secret-name>`).
     - *Phần G (4 bài - Bổ sung Lab 1 ACA)*: Xác minh Deployment gồm trích xuất FQDN sạch (`$FQDN = az containerapp show ... -o tsv`), gọi health endpoint (`Invoke-RestMethod -Uri "https://$FQDN/health"`), gọi root endpoint kiểm tra secret (`Invoke-RestMethod -Uri "https://$FQDN/"`), và test document processing endpoint (`Invoke-RestMethod ... -Body (Get-Content -Raw document.txt)`).
     - *Phần H (3 bài - Bổ sung Lab 1 ACA)*: Troubleshooting chuyên sâu gồm kiểm tra System Managed Identity đã bật (`az containerapp identity show`), liệt kê xác nhận secrets đã tạo (`az containerapp secret list -o table`), và stream logs real-time chẩn đoán lỗi khởi động (`az containerapp logs show -n <app-name> -g <rg> --follow`).
     - *Phần I (3 bài - Bổ sung Lab Dynamic Sessions)*: AI Code Interpreter & Sandboxing gồm cài đặt extension preview (`az extension add --name containerapp --upgrade --allow-preview true --yes`), khởi tạo Session Pool cô lập mạng (`az containerapp sessionpool create ... --network-status EgressDisabled`), và phân quyền thực thi sandbox cho AI Agent (`az role assignment create --role "Azure ContainerApps Session Executor"`).

2. **⭐ 4 Mẹo phòng thi AI-200 & Thực chiến Cốt lõi**:
   - **Dùng `-o tsv`:** Trích xuất giá trị chuỗi thuần (không chứa dấu ngoặc kép) để gán vào biến hoặc endpoint.
   - **`--write-enabled false`:** Lệnh bất biến 'một đi không trở lại', bảo vệ tag image Production chống ghi đè hoặc xóa nhầm.
   - **JMESPath Projection:** Lọc gọn dữ liệu bảng lớn với cú pháp `--query "[].{Setting:name, Value:value}"`.
   - **Managed Identity + `AcrPull`:** Tuân thủ nguyên tắc đặc quyền tối thiểu (Least Privilege), loại bỏ hoàn toàn mật khẩu admin tĩnh.

3. **Bộ lọc Chống nuốt dấu UniKey/EVKey (IME Anti-Ghosting Shield)**:
   - Tự động phát hiện và khôi phục dấu `--` trong thời gian thực khi gõ phím trên bộ gõ tiếng Việt.
   - Tự động mở rộng cờ nhiều ký tự (ví dụ `-use` ➔ `--use`).
   - Tự động khử dấu tiếng Việt trong tên cờ lệnh (ví dụ `--úse` ➔ `--use`).
   - Dropdown gợi ý thông minh IntelliSense ngay tại vị trí con trỏ (nhấn <kbd>Tab ↹</kbd> hoặc click để tự động điền).

4. **Chế độ Trắc nghiệm (19 Câu hỏi tình huống AI-200)**:
   - Các câu hỏi tình huống thực tế bám sát chuẩn đề thi Microsoft Certified: Azure AI Engineer Associate (AI-200) bao gồm cả chuyên đề Azure Container Apps và KQL.
   - Phản hồi giải thích chi tiết ngay lập tức cho từng lựa chọn.

5. **Cẩm nang tra cứu tích hợp (Live Cheatsheet)**:
   - Phân loại rõ ràng theo từng Level với bảng cú pháp, ví dụ thực tế và giải thích chi tiết.
   - Tìm kiếm thời gian thực (Live Search) theo từ khóa hoặc tên dịch vụ.
   - Nút sao chép 1 chạm cho mọi đoạn mã lệnh.

---

## 🚀 Cách khởi chạy ứng dụng

Ứng dụng hiện đang chạy trên máy của bạn tại:
👉 **[http://localhost:5173/](http://localhost:5173/)**

Để khởi động lại dev server trong các phiên làm việc sau, chỉ cần mở terminal tại thư mục dự án và chạy:

```powershell
npm run dev
```

Build production bundle:

```powershell
npm run build
```

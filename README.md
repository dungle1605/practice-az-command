# AZ-COMMAND MASTER ⚡

> Nền tảng webapp tương tác luyện tập Azure CLI (`az`) thực chiến dành cho chứng chỉ **Microsoft AI-200** và **Azure DevOps**, xây dựng hoàn toàn từ nội dung file [Useful_Command.md](file:///h:/Knowledge/Microsoft/AI-200/Useful_Command.md).

---

> [!IMPORTANT]
> **CAM KẾT AN TOÀN TUYỆT ĐỐI (100% CLIENT-SIDE SANDBOX SIMULATION)**:
> - Ứng dụng này là môi trường **GIẢ LẬP ĐÀO TẠO THUẦN TÚY TRÊN TRÌNH DUYỆT (OFFLINE FRONTEND)**.
> - **HOÀN TOÀN KHÔNG thực thi lệnh** lên hệ điều hành hay terminal thật trên máy tính của bạn.
> - **HOÀN TOÀN KHÔNG kết nối hay gửi lệnh** đến tài khoản Microsoft Azure thật (không tạo tài nguyên, không phát sinh chi phí, không cần đăng nhập tài khoản thực).
> - Mọi thao tác gõ lệnh chỉ được phân tích cú pháp bằng Javascript (`commandValidator.js`) để chấm điểm và hiển thị dữ liệu kết quả mô phỏng (Mock Data).

---

## 🌟 Điểm nổi bật của Ứng dụng

1. **Lộ trình phân cấp độ tăng dần (4 Levels Progression)**:
   - **Level 1: Nhập môn & Môi trường**: Cú pháp nền tảng, công cụ tra cứu (`az interactive`, `az find`, `-h`), đăng nhập Headless (`--use-device-code`), đăng ký Resource Provider, nạp biến môi trường tự động (`. .\.env.ps1`), gán biến thủ công `$env:...` và tối ưu cấu hình mặc định (`az config set defaults.group`).
   - **Level 2: Azure Container Registry (ACR)**: Khởi tạo ACR chuẩn bảo mật (`--admin-enabled false`), build Docker Image trực tiếp trên Cloud qua ACR Tasks (`az acr build`), kiểm tra lịch sử task runs, quản lý tags và thiết lập tính bất biến của image (`--write-enable false`).
   - **Level 3: App Service & Container Web App**: Tạo App Service Plan Linux gói `P0v3`, triển khai Web App chạy từ container image trong ACR, kiểm tra trạng thái hoạt động và cấp phát System-Assigned Managed Identity.
   - **Level 4: Bảo mật RBAC & App Settings**: Trích xuất Principal ID và Scope ID bằng JMESPath text thuần (`-o tsv`), gán quyền đặc quyền tối thiểu `AcrPull`, cấu hình Web App xác thực kéo image qua Managed Identity, quản lý cấu hình runtime container (`WEBSITES_PORT="8000"`, `ENVIRONMENT`) và lọc dữ liệu bằng JMESPath projection `[].{Setting:name, Value:value}`.

2. **Hướng dẫn chi tiết từng câu (Deep Dive & Mental Model)**:
   - **Tư duy ngữ pháp chuẩn**: Phân rã cấu trúc câu lệnh thành: `Dịch vụ` ➔ `Nhóm con` ➔ `Hành động` ➔ `Tham số cốt lõi`.
   - **Giải thích từng cờ (Parameters Explanation)**: Giải thích vì sao dùng `-o tsv` thay cho JSON, tại sao phải tắt admin user trong ACR, vì sao cần `WEBSITES_PORT="8000"`, v.v.
   - **Mẹo phòng thi AI-200 & DevOps Thực tế**: Các bẫy thường gặp và best practice từ Microsoft Learn.
   - **Gợi ý từng bước (Progressive Hints)**: Không làm mất hứng thú học tập, cung cấp gợi ý từ tư duy đến cờ lệnh cụ thể.

3. **Giả lập Cloud Terminal chân thực**:
   - Giao diện PowerShell / Bash hiện đại với hiệu ứng Glassmorphism và Neon Cyan/Azure.
   - Hỗ trợ phím <kbd>Tab</kbd> để tự động hoàn thành từ khóa/tham số (Auto-complete).
   - Kiểm tra cú pháp thông minh: Cho phép đảo thứ tự các cờ `--flag`, chấp nhận cờ viết tắt (`-g`, `-n`, `-o tsv`), tự động chuẩn hóa dấu xuống dòng (PowerShell backtick `` ` ``).
   - Mô phỏng đầu ra thực tế của Azure CLI: JSON, bảng Table và TSV có màu sắc sinh động.

4. **Chế độ Trắc nghiệm (Quiz Challenge)**:
   - 8 câu hỏi tình huống chuyên sâu về cơ chế Managed Identity, RBAC `AcrPull`, Image Immutability và bộ lọc JMESPath.
   - Phản hồi giải thích chi tiết ngay lập tức cho từng lựa chọn.

5. **Cẩm nang tra cứu tích hợp (Live Cheatsheet)**:
   - Toàn bộ nội dung trích xuất từ `Useful_Command.md`.
   - Tìm kiếm thời gian thực (Live Search) theo từ khóa hoặc tên dịch vụ.
   - Nút sao chép 1 chạm cho mọi đoạn mã lệnh.

6. **Hệ thống Gamification & Lưu trữ tiến trình**:
   - Tự động tích lũy điểm kinh nghiệm (**XP**), chuỗi ngày luyện tập (**Streak**), xếp hạng danh hiệu (*Cloud Rookie* ➔ *Container Operator* ➔ *AI-200 Master*).
   - Lưu trữ tự động vào `localStorage` của trình duyệt.
   - Hiệu ứng âm thanh chân thực tổng hợp trực tiếp qua Web Audio API (không phụ thuộc file âm thanh ngoài).

---

## 🚀 Cách khởi chạy ứng dụng

Ứng dụng hiện đang chạy trên máy của bạn tại:
👉 **[http://localhost:5173/](http://localhost:5173/)**

Nếu bạn muốn khởi động lại dev server trong các phiên làm việc sau, chỉ cần mở terminal tại thư mục này và gõ:

```powershell
npm run dev
```

Hoặc đóng gói bản phát hành:

```powershell
npm run build
npm run preview
```

---

## ⌨️ Phím tắt nhanh trong Terminal
- <kbd>Enter</kbd>: Thực thi câu lệnh
- <kbd>Tab</kbd>: Tự động hoàn thành tham số / từ khóa
- <kbd>Ctrl</kbd> + <kbd>L</kbd>: Xóa sạch màn hình terminal

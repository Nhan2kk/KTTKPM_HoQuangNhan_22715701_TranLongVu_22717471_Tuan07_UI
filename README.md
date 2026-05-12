# Movie Ticket System — Frontend (EDA Integration)

**Môn:** Kiến trúc và Thiết kế Phần mềm | **Tuần 07**

| Thành viên    | MSSV     |
| ------------- | -------- |
| Hồ Quang Nhân | 22715701 |
| Trần Long Vũ  | 22717471 |

---

## Tổng quan

Giao diện người dùng được thiết kế để tương tác mượt mà với hệ thống **Event-Driven Architecture**. Đặc biệt, các luồng đặt vé được xử lý bất đồng bộ (Asynchronous), giúp tối ưu hóa trải nghiệm người dùng và khả năng chịu tải của hệ thống.

---

## Phân công (Frontend)

### Hồ Quang Nhân — 22715701
- **Giao diện Movie & Auth:**
    - Trang chủ hiển thị danh sách phim được đồng bộ từ Movie Service.
    - Form Đăng nhập/Đăng ký tích hợp với User Service.
    - Xử lý các luồng dữ liệu đồng bộ (Synchronous) cho thông tin phim và người dùng.

### Trần Long Vũ — 22717471
- **Giao diện Booking & Async Status:**
    - Trang chọn ghế và thực hiện đặt vé (gửi yêu cầu đến Booking Service).
    - Xử lý trạng thái chờ (Loading/Pending) trên UI trong khi hệ thống xử lý sự kiện qua RabbitMQ.
    - Trang kết quả đặt vé và hiển thị thông báo trạng thái giao dịch từ Payment Notification Service.

---

## Trải nghiệm người dùng trong EDA

Trong hệ thống hướng sự kiện, trải nghiệm đặt vé diễn ra như sau:
1. **Gửi yêu cầu:** Người dùng nhấn "Xác nhận đặt vé".
2. **Xác nhận tức thì:** Frontend nhận phản hồi "Đã tiếp nhận yêu cầu" ngay lập tức từ `Booking Service`.
3. **Xử lý nền:** Backend xử lý logic thanh toán và thông báo qua hàng đợi sự kiện.
4. **Cập nhật trạng thái:** Giao diện hiển thị trạng thái xử lý bất đồng bộ, mang lại cảm giác hệ thống phản hồi cực nhanh ngay cả khi đang chịu tải cao.

---

## Cách chạy

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

3. **Truy cập:** `http://localhost:5173`

---

## Kết nối API

Frontend kết nối tập trung qua:
- **Base URL:** `http://localhost:8080` (API Gateway)
- **Kiểu giao tiếp:** REST API (Async for Booking)

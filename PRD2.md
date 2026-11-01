# PRD: Hệ Thống Quản Lý Căng Tin Sinh Viên (Hợp Nhất POS & Admin)

## 1. Tổng Quan Dự Án
- **Mục tiêu:** Xây dựng ứng dụng web bán hàng tại quầy (POS) cho Thu ngân kết hợp trang Quản trị (Admin) dành cho Căng tin Sinh viên.
- **Kiến trúc Giao diện:** Sử dụng một **Header Navigation chung** ở đầu trang. Các menu tính năng chuyển đổi linh hoạt dựa trên quyền (Role) của tài khoản đang đăng nhập.
- **Tech Stack:**
  - **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts (Biểu đồ), Lucide Icons, Axios.
  - **Backend:** NestJS, TypeScript, TypeORM, MySQL, JWT Authentication, class-validator.
  - **Database:** `canteen_db` trên MySQL (127.0.0.1:3306, user: `root`, pass: `123456`).

---

## 2. Phân Quyền & Vai Trò (Roles)
1. **Thu ngân (`CASHIER`):**
   - Chỉ được xem và thao tác ở tab **Bán hàng (POS)** (`/pos`).
   - Các tab Admin trên Header sẽ bị ẩn hoặc vô hiệu hóa.
2. **Quản trị viên (`ADMIN`):**
   - Toàn quyền truy cập tất cả 4 trang từ Header Navigation:
     1. `Bán hàng (POS)` (`/pos`)
     2. `Báo cáo Doanh thu` (`/admin/dashboard`)
     3. `Quản lý Menu Món` (`/admin/products`)
     4. `Quản lý Nhân viên` (`/admin/users`)

---

## 3. Luồng Nghiệp Vụ Cốt Lõi (Core Workflow)

### 3.1. Đăng nhập & Điều hướng Header
- Thu ngân / Admin đăng nhập tại `/login`.
- Nhận JWT Token và thông tin User (`role`, `full_name`).
- Header cố định trên cùng hiển thị Logo, thông tin tài khoản, nút Đăng xuất và các nút chuyển tab tương ứng theo vai trò.

### 3.2. Bán hàng tại Quầy (POS)
1. **Chọn món:** Thu ngân lọc danh mục ➔ Chọn món vào giỏ ➔ Nhập ghi chú từng món (nếu có).
2. **Thanh toán Tiền mặt:**
   - Ô nhập "Tiền khách đưa" kèm các nút chọn nhanh (20k, 50k, 100k, 200k, 500k).
   - Hệ thống tự động tính **Tiền thừa trả khách** (`Tiền khách đưa - Tổng tiền`).
3. **Thanh toán Chuyển khoản (VietQR Động):**
   - Tự sinh mã QR ngân hàng theo cấu trúc link:
     `https://vietqr.io/031204005543-Vietcombank-print.jpg?amount={TOTAL_AMOUNT}&addInfo=Don%20hang%20{ORDER_ID}&accountName=BUI%20VAN%20THIEN`
4. **Cấp Số Thứ Tự & In Hóa Đơn:**
   - Hệ thống cấp `order_number` (STT tự tăng trong ngày).
   - Hiển thị Modal thành công kèm nút **"In Hóa Đơn"**.
   - Thiết kế hóa đơn chuẩn khổ K80 (dùng CSS `@media print`) gồm: Tên căng tin, STT, Ngày giờ, Chi tiết món, Tổng tiền, Tiền khách đưa/Tiền thừa, Lời cảm ơn.

### 3.3. Báo cáo & Quản trị
- **Dashboard:** Thống kê doanh thu hôm nay, tổng đơn, biểu đồ Recharts (doanh thu theo danh mục & tỷ lệ PTTT).
- **Quản lý Menu:** Thêm, sửa, xóa món ăn, bật/tắt nhanh trạng thái `is_available` (còn/hết hàng).
- **Quản lý Nhân viên:** Tạo mới tài khoản Thu ngân/Admin, đổi mật khẩu, kích hoạt/xóa tài khoản.

---

## 4. Cơ Sở Dữ Liệu MySQL (`canteen_db`)
1. **`users`:** `id`, `username`, `password_hash`, `full_name`, `role` (`CASHIER` | `ADMIN`), `created_at`.
2. **`categories`:** `id`, `name`.
3. **`products`:** `id`, `category_id`, `name`, `price`, `image_url`, `is_available`.
4. **`orders`:** `id`, `cashier_id`, `order_number`, `total_amount`, `payment_method` (`CASH` | `TRANSFER`), `status` (`PENDING` | `COMPLETED` | `CANCELLED`), `order_type` (`EAT_IN` | `TAKE_AWAY`), `created_at`.
5. **`order_items`:** `id`, `order_id`, `product_id`, `quantity`, `price`, `note`.
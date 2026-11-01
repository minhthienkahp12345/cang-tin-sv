# PRD: Hệ Thống Quản Lý Căng Tin Sinh Viên (Mô hình POS Thu Ngân Độc Lập)

## 1. Tổng Quan Dự Án
- **Mục tiêu:** Xây dựng phần mềm bán hàng tại quầy (POS) gọn nhẹ cho thu ngân căng tin sinh viên.
- **Phạm vi MVP:** Thu ngân chọn món, ghi chú, tính tiền, thu tiền, xuất số thứ tự (STT) và tự theo dõi/hoàn thành đơn hàng tại quầy.
- **Tech Stack:**
  - **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide Icons, Axios.
  - **Backend:** NestJS, TypeScript, TypeORM, MySQL.

---

## 2. Phân Quyền & Vai Trò (Roles)
1. **Thu ngân (`CASHIER`):** Nhập đơn, thu tiền, theo dõi danh sách đơn chờ trả và bấm hoàn thành khi giao món cho sinh viên.
2. **Quản trị viên (`ADMIN`):** Quản lý danh mục, danh sách món ăn và xem lịch sử đơn hàng/doanh thu.

---

## 3. Luồng Nghiệp Vụ Cốt Lõi (Core Workflow)
1. **Thu ngân nhập đơn:** Chọn danh mục ➔ Bấm chọn món ➔ Tăng/giảm số lượng ➔ Nhập ghi chú món (ví dụ: ít đường, không hành).
2. **Thanh toán:** Chọn hình thức `Ăn tại chỗ` hoặc `Mang đi` ➔ Chọn `Tiền mặt` hoặc `Chuyển khoản` ➔ Bấm **Thanh toán**.
3. **Cấp số thứ tự:** Hệ thống lưu đơn hàng và tự động cấp **Số Thứ Tự (STT)** tăng dần trong ngày.
4. **Giao món & Hoàn thành:** Thu ngân xem danh sách đơn đang chờ trên màn hình POS, khi soạn xong món và giao cho sinh viên thì bấm **Hoàn thành**.

---

## 4. Cấu Trúc Dữ Liệu (Database Entities)
- **User:** `id`, `username`, `password_hash`, `full_name`, `role` (CASHIER | ADMIN).
- **Category:** `id`, `name`.
- **Product:** `id`, `category_id`, `name`, `price`, `image_url`, `is_available`.
- **Order:** `id`, `cashier_id`, `order_number` (STT theo ngày), `total_amount`, `payment_method` (CASH | TRANSFER), `status` (PENDING | COMPLETED | CANCELLED), `order_type` (EAT_IN | TAKE_AWAY), `created_at`.
- **OrderItem:** `id`, `order_id`, `product_id`, `quantity`, `price`, `note`.

---

## 5. Danh Sách Màn Hình Frontend
1. **`/pos` (Giao diện Thu ngân Cốt lõi):**
   - Bên trái: Grid danh mục & danh sách món ăn (ảnh + giá + nút chọn).
   - Bên phải: Chi tiết giỏ hàng, bảng tính tiền, nút Thanh toán.
   - Tab phụ/Modal: Danh sách đơn hàng trong ngày để xem STT và bấm "Hoàn thành" / "Hủy đơn".
2. **`/admin/products` (Quản lý Menu):**
   - Bảng danh sách món ăn, modal thêm/sửa món, nút gạt Bật/Tắt trạng thái "Còn hàng".
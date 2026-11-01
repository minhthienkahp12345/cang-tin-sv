# Báo cáo thay đổi dự án Canteen POS

> Ngày lập báo cáo: 31/10/2026  
> Phạm vi: Backend NestJS và Frontend React/Vite hiện có trong dự án.

## 1. Tổng quan

Hệ thống đã được phát triển từ nền tảng POS cơ bản thành ứng dụng quản lý căng tin gồm:

- Bán hàng tại quầy.
- Xác thực và phân quyền người dùng.
- Quản lý danh mục và món ăn.
- Quản lý đơn hàng.
- Báo cáo doanh thu.
- Quản lý tài khoản nhân viên.
- Lịch sử và chỉnh sửa đơn hàng.
- Thanh toán tiền mặt/chuyển khoản và in hóa đơn.

## 2. Thay đổi Backend

### 2.1. Kết nối cơ sở dữ liệu

- Kết nối MySQL database `canteen_db`.
- Sử dụng TypeORM với `synchronize: false`.
- Ánh xạ các bảng:
  - `users`
  - `categories`
  - `products`
  - `orders`
  - `order_items`
- Bổ sung ánh xạ ngày tạo tài khoản `created_at` thông qua property `createdAt`.

### 2.2. Xác thực và phân quyền

- Thêm đăng nhập bằng JWT.
- Mật khẩu được kiểm tra bằng bcrypt.
- Tạo `JwtAuthGuard`.
- Tạo `Roles` decorator và `RolesGuard`.
- Phân quyền:
  - `CASHIER`: bán hàng, tạo đơn, cập nhật trạng thái đơn.
  - `ADMIN`: truy cập các chức năng quản trị.

### 2.3. Module danh mục

API:

```http
GET /api/categories
```

Chức năng:

- Lấy danh sách toàn bộ danh mục món ăn.

### 2.4. Module sản phẩm

API:

```http
GET    /api/products
GET    /api/products?category_id=1
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
PATCH  /api/products/:id/toggle-status
POST   /api/products/:id/image
```

Chức năng:

- Lọc món theo danh mục.
- Thêm, sửa, xóa món ăn.
- Bật/tắt trạng thái còn hàng.
- Validation DTO cho danh mục, tên món, giá và trạng thái.
- Chỉ Admin được thao tác CRUD.
- Cho phép tải ảnh từ máy.
- File ảnh được lưu ở `backend-nestjs/uploads/products`.
- Backend phục vụ ảnh thông qua đường dẫn `/uploads`.
- Đã loại bỏ nhập ảnh bằng URL trên giao diện quản trị.

### 2.5. Module đơn hàng

API:

```http
POST  /api/orders
GET   /api/orders/today
GET   /api/orders/history?period=day
GET   /api/orders/history?period=week
GET   /api/orders/history?period=month
GET   /api/orders/history?period=day&status=COMPLETED
PUT   /api/orders/:id
PATCH /api/orders/:id/status
```

Chức năng:

- Tạo đơn bằng transaction.
- Tự động tính tổng tiền từ giá thực tế trong database.
- Tự động cấp số thứ tự theo ngày.
- Lưu dữ liệu vào `orders` và `order_items`.
- Lọc lịch sử theo ngày, tuần, tháng và trạng thái.
- Hiển thị ngày giờ tạo đơn.
- Admin có thể sửa:
  - Loại đơn.
  - Phương thức thanh toán.
  - Món ăn.
  - Số lượng.
  - Ghi chú món.
- Tự động tính lại tổng tiền sau khi sửa đơn.
- Admin có thể hoàn thành hoặc hủy đơn đang chờ.

### 2.6. Module báo cáo

API:

```http
GET /api/reports/dashboard?period=day
GET /api/reports/dashboard?period=week
GET /api/reports/dashboard?period=month
GET /api/reports/dashboard?period=day&date=2026-10-30
```

Chức năng:

- Tổng doanh thu các đơn đã hoàn thành.
- Số lượng hóa đơn thành công.
- Giá trị trung bình mỗi đơn.
- Top 5 món bán chạy theo số lượng.
- Doanh thu theo danh mục.
- 10 giao dịch gần nhất.
- Thống kê theo ngày, tuần, tháng.
- Cho phép chọn một ngày cụ thể theo định dạng `YYYY-MM-DD`.
- Chỉ Admin được truy cập.

### 2.7. Module tài khoản người dùng

API:

```http
GET    /api/users
POST   /api/users
PUT    /api/users/:id
PATCH  /api/users/:id/reset-password
DELETE /api/users/:id
```

Chức năng:

- Danh sách tài khoản.
- Tạo nhân viên/thu ngân mới.
- Mã hóa mật khẩu bằng bcrypt.
- Sửa họ tên và vai trò.
- Đặt lại mật khẩu.
- Xóa tài khoản.
- Chỉ Admin được truy cập.

## 3. Thay đổi Frontend

### 3.1. Layout chung

Tạo:

```text
frontent-react/src/components/MainLayout.tsx
```

Header chung gồm:

- Bán hàng POS.
- Báo cáo doanh thu.
- Quản lý Menu Món.
- Quản lý Nhân viên.
- Lịch sử đơn hàng.
- Tài khoản hiện tại.
- Đăng xuất.

Các menu quản trị chỉ hiển thị với tài khoản có role `ADMIN`.

### 3.2. Trang POS

File:

```text
frontent-react/src/pages/POSPage.tsx
```

Chức năng:

- Hiển thị danh mục và món ăn từ API.
- Thêm món vào giỏ.
- Tăng/giảm số lượng.
- Xóa món.
- Ghi chú từng món.
- Chọn ăn tại chỗ hoặc mang đi.
- Thanh toán tiền mặt.
- Nhập tiền khách đưa.
- Nút chọn nhanh 20.000đ, 50.000đ, 100.000đ, 200.000đ, 500.000đ.
- Tự động tính tiền thừa.
- Chặn thanh toán khi tiền khách đưa chưa đủ.
- Thanh toán bằng VietQR động.
- Hiển thị danh sách đơn trong ngày.
- Hoàn thành đơn đang chờ.

### 3.3. VietQR

- Sử dụng endpoint VietQR hợp lệ.
- Tự động thay thế:
  - Số tiền.
  - Nội dung đơn hàng.
  - Tên tài khoản ngân hàng.
- Mã hóa query parameters bằng `URLSearchParams`.

### 3.4. In hóa đơn K80

- Hiển thị modal thanh toán thành công.
- Có nút `In Hóa Đơn`.
- Hỗ trợ CSS `@media print`.
- Chỉ in nội dung hóa đơn, ẩn giao diện còn lại.
- Hỗ trợ khổ giấy 80mm.
- Hóa đơn gồm:
  - Tên căng tin.
  - Số thứ tự.
  - Ngày giờ.
  - Danh sách món.
  - Số lượng.
  - Đơn giá.
  - Thành tiền.
  - Tổng tiền.
  - Phương thức thanh toán.
  - Tiền khách đưa.
  - Tiền thừa.
  - Lời cảm ơn.

### 3.5. Trang quản trị menu

URL:

```text
http://localhost:5174/admin/products
```

File:

```text
frontent-react/src/pages/AdminProductsPage.tsx
```

Chức năng:

- Danh sách món ăn.
- Hiển thị hình ảnh, danh mục, giá và trạng thái.
- Thêm món mới.
- Sửa món.
- Xóa món.
- Bật/tắt trạng thái còn hàng.
- Tải ảnh từ máy.
- Giới hạn ảnh tối đa 5MB.
- Chỉ chấp nhận file hình ảnh.

### 3.6. Dashboard doanh thu

URL:

```text
http://localhost:5174/admin/dashboard
```

File:

```text
frontent-react/src/pages/AdminDashboardPage.tsx
```

Chức năng:

- Card tổng doanh thu.
- Card số hóa đơn.
- Card trung bình mỗi đơn.
- Top món bán chạy.
- Doanh thu theo danh mục.
- Danh sách giao dịch gần nhất.
- Chọn ngày/tuần/tháng.
- Chọn ngày cụ thể.

### 3.7. Quản lý tài khoản

URL:

```text
http://localhost:5174/admin/users
```

File:

```text
frontent-react/src/pages/AdminUsersPage.tsx
```

Chức năng:

- Danh sách tài khoản.
- Badge phân biệt `ADMIN` và `CASHIER`.
- Thêm tài khoản.
- Sửa họ tên và vai trò.
- Đổi mật khẩu.
- Xóa tài khoản.

### 3.8. Lịch sử đơn hàng

URL:

```text
http://localhost:5174/admin/orders
```

File:

```text
frontent-react/src/pages/AdminOrderHistoryPage.tsx
```

Chức năng:

- Lọc theo hôm nay, tuần này hoặc tháng này.
- Lọc theo trạng thái.
- Hiển thị ngày giờ đầy đủ.
- Hiển thị thu ngân, loại đơn và phương thức thanh toán.
- Hoàn thành đơn.
- Hủy đơn.
- Sửa đơn.
- Sửa món, số lượng, ghi chú, loại đơn và phương thức thanh toán.

## 4. Cấu trúc route frontend

| Route | Màn hình |
|---|---|
| `/pos` | Bán hàng tại quầy |
| `/admin/dashboard` | Báo cáo doanh thu |
| `/admin/products` | Quản lý menu |
| `/admin/users` | Quản lý nhân viên |
| `/admin/orders` | Lịch sử đơn hàng |

## 5. Công nghệ và thư viện chính

### Backend

- NestJS.
- TypeORM.
- MySQL2.
- JWT/Passport.
- bcrypt.
- class-validator.
- class-transformer.
- Multer thông qua NestJS `FileInterceptor`.

### Frontend

- React.
- TypeScript.
- Vite.
- Axios.
- Tailwind CSS.

## 6. Kiểm tra đã thực hiện

Backend:

```bash
npm run build
npx tsc --noEmit -p tsconfig.json
```

Frontend:

```bash
npm run build
npm run lint
```

Các lệnh kiểm tra đã hoàn tất thành công sau những thay đổi gần nhất.

## 7. Lưu ý vận hành

- Backend chạy mặc định tại `http://127.0.0.1:3000`.
- Frontend chạy tại `http://localhost:5174`.
- Các API quản trị yêu cầu JWT và role `ADMIN`.
- Thư mục upload ảnh cần có quyền ghi.
- Database phải có cột `users.created_at` nếu muốn hiển thị ngày tạo tài khoản.
- File upload hiện được lưu trên máy chạy backend; khi triển khai nhiều máy nên chuyển sang object storage hoặc dịch vụ lưu trữ tập trung.

## 8. CI/CD

- GitHub Actions chạy CI khi push hoặc pull request vào các nhánh `main`, `master` và `develop`.
- CI cài dependencies bằng `npm ci`, build backend và chạy lint/build frontend.
- Workflow chỉ có CI; chưa cấu hình CD/deploy tự động vì dự án chưa chọn nền tảng triển khai.

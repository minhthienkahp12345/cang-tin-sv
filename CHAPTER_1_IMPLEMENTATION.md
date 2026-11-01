# Chương 1. Tổ chức mã nguồn, cài đặt CSDL và các chức năng chính

## 1.1. Tổ chức và quản lý mã nguồn

### 1.1.1. Cấu trúc thư mục mã nguồn dự án

Mã nguồn dự án được tổ chức theo kiến trúc Modular. Frontend và Backend được
tách thành hai ứng dụng độc lập, giao tiếp qua HTTP API. Backend chịu trách
nhiệm xác thực, kiểm tra nghiệp vụ, xử lý transaction và truy vấn MySQL.
Frontend chịu trách nhiệm hiển thị giao diện POS, khu vực quản trị và gửi
request đến Backend.

```text
cangtinsv/
├── PRD.md
├── PROJECT_CHANGE_REPORT.md
├── backend-nestjs/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── categories/
│   │   ├── products/
│   │   │   └── dto/
│   │   ├── orders/
│   │   │   └── dto/
│   │   ├── reports/
│   │   │   └── dto/
│   │   ├── users/
│   │   │   └── dto/
│   │   ├── entities/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── uploads/products/
│   ├── package.json
│   └── tsconfig.json
└── frontent-react/
    ├── src/
    │   ├── components/
    │   │   └── MainLayout.tsx
    │   ├── pages/
    │   │   ├── POSPage.tsx
    │   │   ├── AdminDashboardPage.tsx
    │   │   ├── AdminProductsPage.tsx
    │   │   ├── AdminUsersPage.tsx
    │   │   └── AdminOrderHistoryPage.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── App.tsx
    │   └── index.css
    ├── package.json
    └── vite.config.ts
```

#### Backend

Backend sử dụng NestJS và được chia theo module nghiệp vụ:

- `auth`: đăng nhập JWT, bcrypt, guard xác thực và guard phân quyền.
- `categories`: truy vấn danh mục món ăn.
- `products`: CRUD món ăn, bật/tắt trạng thái và upload ảnh.
- `orders`: tạo đơn, cập nhật trạng thái, lịch sử và chỉnh sửa đơn.
- `reports`: tổng hợp doanh thu, hóa đơn và món bán chạy.
- `users`: quản lý tài khoản và vai trò nhân viên.
- `entities`: ánh xạ bảng MySQL bằng TypeORM.

Mỗi module thường gồm `module`, `controller`, `service` và các DTO. Controller
tiếp nhận HTTP request, DTO kiểm tra dữ liệu đầu vào, còn Service chứa logic
nghiệp vụ và truy vấn dữ liệu.

#### Frontend

Frontend sử dụng React, TypeScript, Vite, Tailwind CSS và Axios:

- `MainLayout.tsx` cung cấp Header dùng chung và kiểm soát menu Admin.
- `POSPage.tsx` là màn hình bán hàng tại quầy.
- `AdminDashboardPage.tsx` là màn hình báo cáo doanh thu.
- `AdminProductsPage.tsx` quản lý món ăn và ảnh món.
- `AdminUsersPage.tsx` quản lý tài khoản nhân viên.
- `AdminOrderHistoryPage.tsx` hiển thị và chỉnh sửa lịch sử đơn.
- `services/api.ts` cấu hình Axios và tự gắn JWT vào request.
- `App.tsx` điều hướng các màn hình theo URL hiện tại.

Tên file POS thực tế là `POSPage.tsx`; dự án không sử dụng file `pos.js`.

#### Luồng request chính

```text
React Page
    │
    ▼
Axios (src/services/api.ts)
    │  Authorization: Bearer <JWT>
    ▼
NestJS Controller
    │
    ├── ValidationPipe + DTO
    ├── JwtAuthGuard / RolesGuard
    ▼
NestJS Service
    │
    ▼
TypeORM QueryBuilder / Repository
    │
    ▼
MySQL canteen_db
```

### 1.1.2. Quy ước Git Flow và Lịch sử phiên bản

Để quản lý mã nguồn theo nhóm, dự án áp dụng quy ước Git Flow đề xuất sau:

| Nhánh | Mục đích |
|---|---|
| `main` | Phiên bản ổn định, sẵn sàng triển khai |
| `develop` | Tích hợp các thay đổi đã hoàn tất |
| `feature/<ten-tinh-nang>` | Phát triển một tính năng mới |
| `fix/<ten-loi>` | Sửa lỗi cụ thể |
| `release/<phien-ban>` | Chuẩn bị phát hành |
| `hotfix/<ten-loi>` | Sửa lỗi khẩn cấp trên `main` |

Quy trình đề xuất:

```bash
git checkout develop
git pull
git checkout -b feature/order-report

# chỉnh sửa, kiểm tra và commit
git add .
git commit -m "feat: add order revenue report"
git push -u origin feature/order-report
```

Quy ước commit:

- `feat:` thêm tính năng.
- `fix:` sửa lỗi.
- `refactor:` tái cấu trúc nhưng không đổi nghiệp vụ.
- `docs:` cập nhật tài liệu.
- `test:` thêm hoặc sửa kiểm thử.
- `chore:` cập nhật cấu hình hoặc dependency.

Mỗi commit nên tập trung vào một thay đổi có ý nghĩa. Trước khi tạo Pull
Request cần chạy kiểm tra tối thiểu:

```bash
# Backend
npm run build
npx tsc --noEmit -p tsconfig.json

# Frontend
npm run build
npm run lint
```

Lịch sử chức năng của dự án được tổng hợp trong
[PROJECT_CHANGE_REPORT.md](./PROJECT_CHANGE_REPORT.md). Tài liệu này mô tả
trạng thái mã nguồn hiện tại, còn lịch sử commit cụ thể phụ thuộc repository
Git được cấu hình trên máy triển khai.

## 1.2. Cài đặt Cơ sở dữ liệu

Hệ thống sử dụng MySQL với database `canteen_db`. Backend kết nối qua TypeORM
và đặt `synchronize: false`, do đó cấu trúc bảng được quản lý bằng SQL/MySQL
Workbench thay vì để TypeORM tự thay đổi schema.

Các bảng chính:

- `users`: tài khoản, mật khẩu đã mã hóa và vai trò.
- `categories`: danh mục món ăn.
- `products`: món ăn, giá và trạng thái còn hàng.
- `orders`: thông tin hóa đơn/đơn hàng.
- `order_items`: các món thuộc từng đơn.

### Quan hệ dữ liệu

```text
users (1) ──────── (N) orders
categories (1) ── (N) products
orders (1) ─────── (N) order_items
products (1) ───── (N) order_items
```

### Tập lệnh SQL tham khảo

Đoạn SQL dưới đây thể hiện cấu trúc tương ứng với các Entity hiện có. Khi
triển khai thực tế, cần kiểm tra tên database và điều chỉnh kiểu dữ liệu theo
phiên bản MySQL đang sử dụng.

```sql
CREATE DATABASE IF NOT EXISTS canteen_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE canteen_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('CASHIER', 'ADMIN') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  image_url VARCHAR(255) NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cashier_id INT NOT NULL,
  order_number INT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  payment_method ENUM('CASH', 'TRANSFER') NOT NULL,
  status ENUM('PENDING', 'COMPLETED', 'CANCELLED')
    NOT NULL DEFAULT 'PENDING',
  order_type ENUM('EAT_IN', 'TAKE_AWAY') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_cashier
    FOREIGN KEY (cashier_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  note VARCHAR(255) NULL,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

Trong bảng `order_items`, trường `price` lưu lại giá tại thời điểm bán. Vì
vậy, khi giá món trong `products` thay đổi, hóa đơn cũ vẫn giữ đúng giá đã
giao dịch.

Mật khẩu trong `users.password_hash` phải là bcrypt hash, không được lưu mật
khẩu dạng plain text. Backend sử dụng các Entity:

- [user.entity.ts](./backend-nestjs/src/entities/user.entity.ts)
- [category.entity.ts](./backend-nestjs/src/entities/category.entity.ts)
- [product.entity.ts](./backend-nestjs/src/entities/product.entity.ts)
- [order.entity.ts](./backend-nestjs/src/entities/order.entity.ts)
- [order-item.entity.ts](./backend-nestjs/src/entities/order-item.entity.ts)

## 1.3. Cài đặt các chức năng chính của hệ thống

### 1.3.1. Lập trình Backend API xử lý Bán hàng & Lập Hóa đơn

Phân hệ bán hàng nhận dữ liệu từ POS thông qua:

```http
POST /api/orders
Authorization: Bearer <JWT>
Content-Type: application/json
```

Payload mẫu:

```json
{
  "order_type": "TAKE_AWAY",
  "payment_method": "CASH",
  "items": [
    {
      "product_id": 3,
      "quantity": 2,
      "note": "Không hành"
    }
  ]
}
```

DTO `CreateOrderDto` kiểm tra:

- `order_type` phải là `EAT_IN` hoặc `TAKE_AWAY`.
- `payment_method` phải là `CASH` hoặc `TRANSFER`.
- `items` phải là mảng có ít nhất một phần tử.
- `product_id` và `quantity` là số nguyên dương.
- `note` là chuỗi không rỗng nếu được truyền vào.

Controller lấy `id` của thu ngân từ JWT:

```ts
@Post()
create(
  @Req() request: AuthenticatedRequest,
  @Body() createOrderDto: CreateOrderDto,
) {
  return this.ordersService.create(request.user.id, createOrderDto);
}
```

#### Quy trình xử lý trong Service

Phương thức `OrdersService.create()` sử dụng transaction của TypeORM:

```ts
return this.dataSource.transaction(async (manager) => {
  // đọc sản phẩm, tính tiền và lưu orders/order_items
});
```

Các bước nghiệp vụ:

1. Lấy danh sách `product_id` từ request.
2. Truy vấn giá và trạng thái món ăn từ database.
3. Báo lỗi nếu món không tồn tại.
4. Báo lỗi nếu món đang hết hàng.
5. Tính tổng tiền bằng giá thực tế trong database nhân với số lượng.
6. Tính `order_number` tiếp theo trong ngày.
7. Tạo bản ghi trong `orders` với trạng thái ban đầu `PENDING`.
8. Tạo các bản ghi tương ứng trong `order_items`.
9. Gán danh sách item vào kết quả trả về.
10. Commit transaction nếu mọi bước thành công; rollback nếu có lỗi.

Tổng tiền được tính theo đơn vị cent để hạn chế sai số số thực:

```ts
const totalCents = orderItems.reduce(
  (total, { item, product }) =>
    total + this.toCents(product.price) * item.quantity,
  0,
);
```

Kết quả thành công có dạng đơn hàng chứa:

```json
{
  "id": 15,
  "orderNumber": 4,
  "totalAmount": "30000.00",
  "paymentMethod": "CASH",
  "orderType": "TAKE_AWAY",
  "status": "PENDING",
  "createdAt": "2026-11-01T04:20:00.000Z"
}
```

Các API liên quan:

```http
GET   /api/orders/today
GET   /api/orders/history?period=day
PUT   /api/orders/:id
PATCH /api/orders/:id/status
```

`PUT /api/orders/:id` dành cho Admin chỉnh sửa loại đơn, phương thức thanh
toán, món, số lượng và ghi chú. Tổng tiền được tính lại trong transaction.

`PATCH /api/orders/:id/status` cho phép chuyển đơn đang `PENDING` sang
`COMPLETED` hoặc `CANCELLED`.

### 1.3.2. Lập trình Frontend Client xử lý bán hàng POS (`POSPage.tsx`)

Trong dự án hiện tại, file tương ứng với `pos.js` là:

```text
frontent-react/src/pages/POSPage.tsx
```

Đây là React component viết bằng TypeScript. Component tải danh mục và món ăn
qua Axios:

```ts
const [categoryResponse, productResponse] = await Promise.all([
  api.get<Category[]>('/categories'),
  api.get<Product[]>('/products'),
])
```

Axios client đặt `baseURL` là:

```ts
http://127.0.0.1:3000/api
```

và tự gắn JWT từ `localStorage`:

```ts
const token = localStorage.getItem('accessToken')
if (token) {
  config.headers.Authorization = `Bearer ${token}`
}
```

#### Quản lý giỏ hàng

Khi người dùng chọn món, component kiểm tra món đã có trong giỏ hay chưa:

```ts
const addProduct = (product: Product) => {
  setCart((current) => {
    const found = current.find((item) => item.id === product.id)
    return found
      ? current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...current, { ...product, quantity: 1, note: '' }]
  })
}
```

Nếu món đã tồn tại, số lượng tăng lên. Nếu chưa tồn tại, món được thêm mới
vào giỏ cùng số lượng mặc định là `1`.

Số tiền được tính trực tiếp từ state giỏ hàng:

```ts
const total = cart.reduce(
  (sum, item) => sum + Number(item.price) * item.quantity,
  0,
)

const itemCount = cart.reduce(
  (sum, item) => sum + item.quantity,
  0,
)
```

Người dùng có thể:

- Tăng hoặc giảm số lượng.
- Xóa món.
- Xóa toàn bộ giỏ hàng.
- Nhập ghi chú cho từng món.
- Lọc món theo danh mục.

#### Gửi đơn hàng

Khi nhấn nút thanh toán, frontend gửi các trường cần thiết:

```ts
await api.post('/orders', {
  order_type: orderType,
  payment_method: paymentMethod,
  items: cart.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
    ...(item.note ? { note: item.note } : {}),
  })),
})
```

Frontend không tự quyết định giá cuối cùng. Giá được Backend đọc lại từ
database để tránh việc client thay đổi giá trong request.

#### Thanh toán tiền mặt

Frontend nhận tiền khách đưa và tính tiền thừa:

```ts
const received = Number(cashReceived) || 0
const change = Math.max(0, received - total)
const canPay = paymentMethod === 'TRANSFER' || received >= total
```

Nút thanh toán bị vô hiệu hóa khi tiền khách đưa nhỏ hơn tổng đơn.

#### Thanh toán chuyển khoản

Khi chọn `TRANSFER`, giao diện tạo URL VietQR động bằng tổng tiền và nội dung
đơn hàng. Tham số URL được mã hóa bằng `URLSearchParams` để bảo đảm ký tự
tiếng Việt hoặc khoảng trắng không làm hỏng URL.

#### Kết quả sau thanh toán

Sau khi Backend trả về thành công, POS:

1. Hiển thị số thứ tự đơn.
2. Xóa giỏ hàng.
3. Tải lại danh sách đơn trong ngày.
4. Lưu dữ liệu cần thiết để in hóa đơn.
5. Cho phép in hóa đơn nhiệt K80 bằng `window.print()`.

Hóa đơn gồm tên căng tin, số đơn, ngày giờ, danh sách món, số lượng, đơn giá,
thành tiền, tổng tiền, phương thức thanh toán, tiền khách đưa và tiền thừa.
CSS `@media print` ẩn giao diện POS và chỉ giữ lại nội dung phiếu in.

## 1.4. Các chức năng bổ trợ đã cài đặt

Ngoài luồng bán hàng cốt lõi, hệ thống còn có:

- Dashboard doanh thu theo ngày, tuần, tháng hoặc khoảng ngày tùy chọn.
- Top món bán chạy và doanh thu theo danh mục.
- Lịch sử đơn hàng có lọc thời gian và trạng thái.
- Admin sửa đơn và tự động tính lại tổng tiền.
- Quản lý sản phẩm và tải ảnh từ máy.
- Quản lý tài khoản, vai trò và reset mật khẩu.
- Header dùng chung với kiểm soát quyền Admin.

## 1.5. Kiểm tra hệ thống

Các lệnh kiểm tra được sử dụng:

```bash
# Backend
cd backend-nestjs
npm run build
npx tsc --noEmit -p tsconfig.json

# Frontend
cd frontent-react
npm run build
npm run lint
```

Backend mặc định chạy tại `http://127.0.0.1:3000`, frontend chạy tại
`http://localhost:5174`.

## 4.5. Tự động hóa quá trình xây dựng và tích hợp phần mềm

### 4.5.1. Công cụ quản lý thư viện và phụ thuộc

Dự án sử dụng **npm (Node Package Manager)** để quản lý thư viện và các
phụ thuộc của cả Backend NestJS và Frontend React. Mỗi ứng dụng có một file
`package.json` mô tả tên dự án, phiên bản, scripts và các nhóm
`dependencies`/`devDependencies`. File `package-lock.json` được lưu cùng mã
nguồn để khóa chính xác phiên bản của toàn bộ cây phụ thuộc, giúp môi trường
phát triển và môi trường CI cài đặt cùng một tập thư viện.

Khi cài đặt trong CI, workflow sử dụng `npm ci` thay vì `npm install`.
Lệnh này cài đặt theo lock file, bảo đảm quá trình có tính lặp lại và phát
hiện sớm trường hợp `package.json` không đồng bộ với
`package-lock.json`. Các thư mục ứng dụng thực tế của repository là
`backend-nestjs/` và `frontent-react/`.

### 4.5.2. Quy trình tự động biên dịch và đóng gói

Ở Backend, lệnh `npm run build` gọi NestJS CLI để biên dịch mã nguồn
TypeScript thành JavaScript trong thư mục đầu ra của ứng dụng. Quá trình này
kiểm tra cấu hình TypeScript, decorator, module và các entity trước khi tạo
artifact có thể chạy bằng Node.js.

Ở Frontend, lệnh `npm run build` thực hiện kiểm tra TypeScript thông qua
`tsc -b`, sau đó sử dụng Vite để bundle mã nguồn React, tối ưu tài nguyên
và tạo bản phân phối trong thư mục `dist/`. Việc chạy build cho cả hai ứng
dụng giúp phát hiện lỗi biên dịch trước khi mã nguồn được tích hợp vào nhánh
chính.

### 4.5.3. Công cụ kiểm tra định dạng và phân tích tĩnh mã nguồn

ESLint được sử dụng để kiểm tra các quy tắc chất lượng và phong cách mã
nguồn. Backend có script `npm run lint` áp dụng cho các file TypeScript
trong các thư mục mã nguồn, kiểm tra các lỗi phổ biến trước khi đóng gói.
Frontend cũng cung cấp script `npm run lint` để kiểm tra mã React,
TypeScript và các quy tắc liên quan đến hooks.

Ngoài ESLint, TypeScript Compiler (`tsc`) thực hiện kiểm tra kiểu tĩnh.
Backend có thể kiểm tra độc lập bằng `npx tsc --noEmit -p tsconfig.json`,
còn lệnh build Frontend đã bao gồm `tsc -b`. Các bước này giúp phát hiện
những lỗi sai kiểu dữ liệu, import, cấu hình module và API ngay trong quá
trình phát triển thay vì chờ đến lúc chạy hệ thống.

### 4.5.4. Thiết lập quy trình tích hợp liên tục qua GitHub Actions

Quy trình CI được định nghĩa trong file
`.github/workflows/ci.yml` với tên **Continuous Integration (CI) Pipeline**.
Workflow được kích hoạt khi có sự kiện `push` hoặc `pull_request` hướng đến
một trong các nhánh `main`, `master` hoặc `develop`.

Workflow gồm hai job chạy song song trên môi trường `ubuntu-latest`:

1. `backend-ci` checkout mã nguồn, thiết lập Node.js 18, chạy `npm ci`
   trong `backend-nestjs/` và thực hiện `npm run build`.
2. `frontend-ci` checkout mã nguồn, thiết lập Node.js 18, chạy `npm ci`
   trong `frontent-react/` và thực hiện `npm run build`.

Hai job độc lập giúp rút ngắn thời gian phản hồi và xác định rõ lỗi thuộc
Backend hay Frontend. `actions/setup-node` đồng thời sử dụng cache npm dựa
trên lock file tương ứng, giúp các lần chạy sau nhanh hơn mà vẫn giữ tính
nhất quán của dependency.

### 4.5.5. Ghi nhận và đánh giá kết quả thực hiện

Sau khi workflow được kích hoạt, GitHub Actions hiển thị trạng thái của từng
job và từng step trong giao diện của repository. Một lần chạy chỉ được xem
là thành công khi cả `backend-ci` và `frontend-ci` đều hoàn thành bước build
với trạng thái `success`. Nếu `npm ci` thất bại, nguyên nhân thường liên
quan đến lock file hoặc môi trường Node.js; nếu build thất bại, log của job
tương ứng cho biết lỗi TypeScript, NestJS CLI hoặc Vite cần xử lý.

Kết quả CI tạo ra một tiêu chí kiểm soát chất lượng tự động trước khi hợp
nhất Pull Request. Nhờ đó, nhóm phát triển giảm nguy cơ đưa mã nguồn không
biên dịch được vào nhánh chính, đồng thời có lịch sử chạy và log để truy
vết. CI hiện tập trung vào khả năng cài đặt và build; các bước kiểm thử
đơn vị, lint hoặc triển khai lên máy chủ có thể được bổ sung ở các giai đoạn
tiếp theo khi dự án mở rộng.

# CHƯƠNG 5. KIỂM THỬ VÀ ĐÁNH GIÁ PHẦN MỀM

## 5.1. Tổng quan và chiến lược kiểm thử

### 5.1.1. Mục tiêu

Kiểm thử nhằm xác nhận hệ thống Canteen POS đáp ứng các nghiệp vụ chính:

- Đăng nhập và phân quyền thu ngân/quản trị viên.
- Hiển thị thực đơn và tạo đơn hàng.
- Tính tổng tiền, hỗ trợ tiền mặt/chuyển khoản và mã VietQR.
- Cấp mã đơn hàng tăng theo ngày.
- Hoàn thành đơn và ghi nhận doanh thu.
- Quản lý sản phẩm, người dùng, lịch sử đơn hàng và báo cáo doanh thu.

Kiểm thử cũng nhằm phát hiện lỗi sớm, bảo đảm các thay đổi ở backend NestJS
không làm hỏng giao diện React và dữ liệu MySQL.

### 5.1.2. Phạm vi

Phạm vi kiểm thử bao gồm:

- Frontend React/Vite trong `frontent-react/`.
- Backend NestJS/TypeORM trong `backend-nestjs/`.
- Cơ sở dữ liệu MySQL `canteen_db`.
- API có tiền tố `/api`.
- Luồng POS, đơn hàng, xác thực và báo cáo.

Các chức năng chưa nằm trong phạm vi gồm webhook xác nhận giao dịch ngân hàng,
triển khai cloud và kiểm thử tải quy mô lớn.

### 5.1.3. Ba mức kiểm thử

**Mức 1 - Unit Test (White-box):** kiểm tra các hàm nghiệp vụ nhỏ ở
`OrdersService`, gồm tính tổng tiền, tính tiền thối, kiểm tra giỏ trống và cấp
mã đơn. Các dependency TypeORM được mock để test chạy nhanh, độc lập với MySQL.

**Mức 2 - Integration/API Test:** dùng file
`backend-nestjs/test-api.http` để kiểm tra chuỗi đăng nhập, lấy sản phẩm, tạo
đơn, hoàn thành đơn và lấy đơn trong ngày. Đây là kiểm thử hợp đồng giữa
controller, guard, service, TypeORM và MySQL.

**Mức 3 - System/UI Test (Black-box):** kiểm thử qua giao diện POS theo phân
hoạch tương đương và giá trị biên: giỏ có/không có món, tiền khách đưa nhỏ hơn,
bằng hoặc lớn hơn tổng tiền, thanh toán tiền mặt/chuyển khoản, URL VietQR và
in hóa đơn K80. Kịch bản nằm tại
`frontent-react/test/pos-ui.test.md`.

## 5.2. Lập kế hoạch kiểm thử

### 5.2.1. Môi trường kiểm thử

| Thành phần | Cấu hình |
|---|---|
| Hệ điều hành phát triển | Windows |
| Runtime | Node.js 24 |
| Backend | NestJS, TypeORM, port 3000 |
| Frontend | React + Vite, port 5174 |
| CSDL | MySQL 8, `127.0.0.1:3306` |
| Database | `canteen_db` |
| Công cụ Unit Test | Jest + ts-jest |
| Công cụ API | VS Code REST Client hoặc công cụ HTTP tương đương |
| Trình duyệt | Chrome/Edge có DevTools và Print Preview |

### 5.2.2. Dữ liệu kiểm thử

Database mẫu được lưu tại `database/canteen_db_backup.sql`.

| Dữ liệu | Giá trị |
|---|---|
| Tài khoản thu ngân | `cashier1 / 123456` |
| Tài khoản quản trị | `admin / 123456` |
| Database | `canteen_db` |
| Host/port | `127.0.0.1:3306` |
| Sản phẩm mẫu | Bánh mì ốp la, Xôi xéo, Cơm sườn, Cơm gà, Cà phê |
| Giá trị biên tiền | Khách đưa nhỏ hơn, bằng và lớn hơn tổng tiền |

Mật khẩu trên chỉ dành cho database demo. Khi triển khai thật phải thay đổi
mật khẩu và secret.

### 5.2.3. Tiêu chí bắt đầu và kết thúc

**Tiêu chí bắt đầu:**

- Có Node.js 24, MySQL 8 và dependencies từ lockfile.
- Import thành công `canteen_db_backup.sql`.
- Có file `.env` cho backend và frontend.
- Backend phản hồi tại `http://127.0.0.1:3000/api`.
- Frontend mở được tại `http://localhost:5174`.

**Tiêu chí kết thúc:**

- Unit test chạy không lỗi.
- Các API trong kịch bản trả status và dữ liệu đúng.
- Các luồng UI quan trọng được kiểm tra.
- Build backend, lint frontend và build frontend thành công.
- Không còn lỗi mức nghiêm trọng chặn thanh toán hoặc ghi nhận doanh thu.

## 5.3. Thiết kế các trường hợp kiểm thử

### 5.3.1. Traceability Matrix

| Yêu cầu | Module | Test case |
|---|---|---|
| Xác thực tài khoản | Auth | TC_AUTH_01, TC_AUTH_02 |
| Hiển thị thực đơn | Products/POS | TC_MENU_01, TC_MENU_02 |
| Tạo và tính đơn | Orders/POS | TC_POS_01 đến TC_POS_06 |
| Quản lý người dùng | Users | TC_USER_01, TC_USER_02 |
| Báo cáo doanh thu | Reports | TC_REP_01, TC_REP_02, TC_REP_03 |

### 5.3.2. Bộ 15 test case

| ID | Nội dung | Dữ liệu/tiền điều kiện | Kết quả mong đợi |
|---|---|---|---|
| TC_AUTH_01 | Đăng nhập thu ngân đúng | `cashier1/123456` | Trả JWT và role `CASHIER` |
| TC_AUTH_02 | Đăng nhập sai mật khẩu | Mật khẩu sai | Trả lỗi 401, không cấp token |
| TC_MENU_01 | Lấy danh sách sản phẩm | Token hợp lệ | Trả danh sách sản phẩm khả dụng |
| TC_MENU_02 | Lọc sản phẩm theo danh mục | `category_id` hợp lệ | Chỉ trả sản phẩm thuộc danh mục |
| TC_POS_01 | Tạo đơn nhiều món | 2 món, số lượng khác nhau | Lưu order item và tổng tiền chính xác |
| TC_POS_02 | Tính tiền thối | Tổng 42.000, khách đưa 50.000 | Tiền thối 8.000 |
| TC_POS_03 | Không nhập tiền khách đưa | Giỏ có món, ô tiền trống | Nút thanh toán vẫn hoạt động |
| TC_POS_04 | Giỏ hàng trống | Không có item | Không tạo đơn, trả lỗi hợp lệ |
| TC_POS_05 | Cấp mã đơn | Đơn mới trong cùng ngày | `order_number` tăng liên tục |
| TC_POS_06 | Thanh toán chuyển khoản/VietQR | Chọn TRANSFER | QR có amount và addInfo theo đơn |
| TC_USER_01 | Admin xem quản trị | Token ADMIN | Truy cập được màn hình quản trị |
| TC_USER_02 | Thu ngân truy cập chức năng admin | Token CASHIER | Bị từ chối do phân quyền |
| TC_REP_01 | Tổng doanh thu | Có đơn COMPLETED | Tổng bằng tổng `total_amount` |
| TC_REP_02 | Doanh thu theo phương thức | Có CASH và TRANSFER | Tách đúng tiền mặt/chuyển khoản |
| TC_REP_03 | Lọc báo cáo theo ngày | Chọn từ ngày/đến ngày | Chỉ tính đơn trong khoảng đã chọn |

## 5.4. Thực thi và tự động hóa kiểm thử

### 5.4.1. Unit Test Jest

Mã nguồn tại:
`backend-nestjs/src/orders/orders.service.spec.ts`.

Các seam được kiểm tra là các hàm nghiệp vụ công khai
`calculateOrderTotal`, `calculateChange` và public method `create`. Repository
TypeORM được mock để không phụ thuộc dữ liệu ngoài trong Unit Test.

Lệnh chạy minh chứng:

```powershell
cd backend-nestjs
npm ci
npm test -- --runInBand orders.service.spec.ts
```

Kết quả đã chạy:

```text
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

Đây là minh chứng tự động đã xác nhận tại thời điểm lập báo cáo. Không ghi
`15/15` cho Unit Test vì bộ Jest hiện có 5 test; 15 là tổng số test case của
chương, trong đó API và UI cần chạy theo môi trường MySQL/trình duyệt.

### 5.4.2. API/Integration Test

Kịch bản tại `backend-nestjs/test-api.http` gồm:

1. `POST /api/auth/login`.
2. `GET /api/products`.
3. `POST /api/orders`.
4. `PATCH /api/orders/:id/status`.
5. `GET /api/orders/today`.

Sau khi chạy backend và MySQL, mở file bằng VS Code REST Client, chạy lần lượt
các request và chụp phần response làm minh chứng. Token đăng nhập phải được
đưa vào biến `accessToken`.

### 5.4.3. System/UI Test

Kịch bản tại `frontent-react/test/pos-ui.test.md` kiểm tra:

- Tiền thối theo công thức `tiền khách đưa - tổng tiền`.
- Thanh toán tiền mặt khi không nhập tiền khách đưa.
- URL QR động tại `img.vietqr.io`, có `amount` và `addInfo`.
- In hóa đơn K80 bằng nút in và CSS `@media print`.

Vị trí chèn ảnh minh chứng trong bài:

- Hình 5.1: kết quả Jest xanh.
- Hình 5.2: response đăng nhập và lấy sản phẩm.
- Hình 5.3: response tạo/hoàn thành đơn.
- Hình 5.4: POS hiển thị tiền thối.
- Hình 5.5: URL/ảnh VietQR.
- Hình 5.6: Print Preview khổ K80.
- Hình 5.7: báo cáo doanh thu.

### 5.4.4. CI

Workflow `.github/workflows/ci.yml` chạy trên push/pull request vào `main`,
`master` hoặc `develop`, sử dụng Node.js 24. Workflow cài dependencies bằng
`npm ci`, build backend, lint frontend và build frontend.

## 5.5. Quản lý và xử lý lỗi phần mềm

Các lỗi dưới đây là nhật ký lỗi theo mã dùng trong báo cáo. Repository chưa
được tạo GitHub Issue riêng cho từng mã, vì vậy không gắn số issue giả.

| Mã | Mô tả | Nguyên nhân | Giải pháp/trạng thái |
|---|---|---|---|
| BUG_01 | CI build đỏ trên GitHub Actions | Workflow dùng Node 18 trong khi dependency yêu cầu API/runtime mới hơn | Đổi workflow sang Node 24; backend/frontend build đạt |
| BUG_02 | Backend không khởi động | Thiếu biến môi trường `JWT_SECRET` | Thêm `.env.example`, hướng dẫn tạo `.env`, dùng `getOrThrow` để báo lỗi rõ |
| BUG_03 | Doanh thu không ghi nhận sau thanh toán | Đơn được tạo `PENDING`, báo cáo chỉ tính `COMPLETED` | POS tự cập nhật đơn sang `COMPLETED` sau tạo đơn; báo cáo tách CASH/TRANSFER |

Quy trình xử lý lỗi gồm tái hiện bằng log/test, xác định nguyên nhân, sửa
tối thiểu, chạy lại test/build và lưu kết quả vào báo cáo.

## 5.6. Đánh giá kết quả kiểm thử và chất lượng phần mềm

### 5.6.1. Kết quả đã xác minh

| Nhóm | Số lượng | Đã chạy | Kết quả |
|---|---:|---:|---|
| Unit Jest | 5 | 5 | 5/5 Passed |
| API/Integration | 5 | Cần MySQL + backend | Kịch bản đã chuẩn bị |
| System/UI | 4 | Cần trình duyệt | Kịch bản đã chuẩn bị |
| Tổng test case chương | 15 | 5 tự động tại máy phát triển | Không kết luận 15/15 nếu chưa chạy đủ môi trường |

Frontend lint/build và backend build đã được kiểm tra thành công trong quá trình
phát triển. API và UI phải được chạy trên máy trình diễn để hoàn thiện ảnh
minh chứng tương ứng.

### 5.6.2. Độ bao phủ yêu cầu

Traceability Matrix bao phủ các nhóm Auth, Menu, POS, User và Report. Các luồng
rủi ro cao gồm tạo đơn, cập nhật trạng thái, tính doanh thu và phân quyền đều
có test case tương ứng.

### 5.6.3. Đánh giá chất lượng

- Tính đúng đắn: các phép tính tiền dùng đơn vị cent trước khi định dạng tiền.
- Tính tin cậy: giỏ trống bị từ chối; lỗi cấu hình JWT được báo rõ.
- Tính bảo trì: Unit Test cô lập TypeORM; API test dùng file `.http` dễ chạy lại.
- Tính triển khai: CI xác nhận build backend và frontend trên Node.js 24.
- Hạn chế đo lường: chưa có báo cáo coverage mục tiêu và chưa có test tải.

## KẾT LUẬN

Chương 5 đã xây dựng chiến lược kiểm thử ba mức cho hệ thống React +
NestJS + MySQL `canteen_db`. Các hàm nghiệp vụ thanh toán và tạo đơn đã có Unit
Test Jest chạy tự động; API test và UI test có kịch bản tái hiện được để tạo
minh chứng trên môi trường demo. CI giúp kiểm tra build/lint tự động khi mã
nguồn thay đổi.

Hạn chế hiện tại là thanh toán chuyển khoản mới dừng ở QR tĩnh theo số tiền và
nội dung đơn, chưa có webhook ngân hàng để tự động xác nhận giao dịch. Ngoài ra
API/UI test cần người chạy với MySQL và trình duyệt thật để hoàn thiện ảnh
minh chứng.

Hướng phát triển gồm tích hợp webhook/đối soát ngân hàng, ứng dụng Zalo Mini
App, đặt món trước, kiểm thử E2E bằng Playwright và kiểm thử tải cho thời điểm
căng tin đông khách.

## TÀI LIỆU THAM KHẢO

1. ISO/IEC/IEEE 29119, *Software Testing*.
2. IEEE Std 829-2008, *Standard for Software and System Test Documentation*.
3. ISTQB, *Foundation Level Syllabus*, phiên bản hiện hành.
4. Ian Sommerville, *Software Engineering*, Pearson.

# Canteen POS

Ứng dụng quản lý và bán hàng cho căng tin sinh viên.

## Công nghệ

- Backend: NestJS, TypeORM, MySQL, JWT.
- Frontend: React, TypeScript, Vite.
- CI: GitHub Actions tại [.github/workflows/ci.yml](./.github/workflows/ci.yml).

## Yêu cầu

- Node.js 24.
- MySQL 8.
- Git.

## Cài đặt và khôi phục database

```powershell
git clone https://github.com/minhthienkahp12345/cang-tin-sv.git
cd cang-tin-sv
mysql -u root -p -e "CREATE DATABASE canteen_db"
cmd /c "mysql -u root -p canteen_db < database\canteen_db_backup.sql"
```

File [database/canteen_db_backup.sql](./database/canteen_db_backup.sql) chứa schema,
danh mục, sản phẩm, tài khoản và một số đơn hàng mẫu.

## Chạy backend

Mở terminal tại `backend-nestjs`:

```powershell
Copy-Item .env.example .env
npm ci
npm run start:dev
```

Cập nhật `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` và
`JWT_SECRET` trong `.env` nếu cần. Backend chạy tại
`http://127.0.0.1:3000`.

## Chạy frontend

Mở terminal thứ hai tại `frontent-react`:

```powershell
Copy-Item .env.example .env
npm ci
npm run dev
```

Frontend chạy tại `http://localhost:5174`. Địa chỉ backend có thể đổi bằng
`VITE_API_URL` trong `frontent-react/.env`.

## Tài khoản demo

| Tài khoản | Mật khẩu | Quyền |
|---|---|---|
| `admin` | `123456` | Quản trị viên |
| `cashier1` | `123456` | Thu ngân |

Đây là tài khoản của database demo, cần đổi mật khẩu khi triển khai thật.

## Chức năng chính

- Bán hàng tại quầy và thanh toán tiền mặt/chuyển khoản.
- Mã đơn hàng tự tăng theo ngày.
- Quản lý sản phẩm, danh mục và người dùng.
- Lịch sử đơn hàng và cập nhật trạng thái.
- Báo cáo doanh thu tổng, tiền mặt và chuyển khoản.
- Upload ảnh sản phẩm.

## Kiểm tra

```powershell
cd backend-nestjs
npm run build

cd ..\frontent-react
npm run lint
npm run build
```

CI tự động chạy khi push hoặc tạo pull request vào `main`, `master` hoặc
`develop`.

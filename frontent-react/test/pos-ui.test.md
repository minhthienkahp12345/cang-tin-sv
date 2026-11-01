# Kịch bản kiểm thử giao diện POS

Các bước này chạy trên trình duyệt với backend và database demo đang hoạt động.
Có thể dùng DevTools để chụp ảnh minh chứng DOM, Network và Print Preview.

## POS-UI-01: Tính tiền thối

1. Mở `http://localhost:5174` và đăng nhập `cashier1 / 123456`.
2. Thêm một món giá `15.000đ` vào giỏ.
3. Chọn **Tiền mặt**, nhập `50.000`.
4. Kiểm tra hiển thị tiền thừa là `35.000đ`.
5. Chụp màn hình vùng giỏ hàng làm minh chứng.

## POS-UI-02: Thanh toán không nhập tiền khách đưa

1. Xóa giá trị trong ô **Tiền khách đưa**.
2. Kiểm tra nút **Thanh toán** vẫn sáng khi giỏ có món.
3. Bấm thanh toán và kiểm tra đơn chuyển sang `COMPLETED`.

## POS-UI-03: VietQR động

1. Chọn **Chuyển khoản**.
2. Mở DevTools và kiểm tra `src` ảnh có host `img.vietqr.io`.
3. Kiểm tra URL có `amount` bằng tổng đơn và `addInfo` chứa mã đơn.
4. Chụp màn hình QR và Network làm minh chứng.

## POS-UI-04: In hóa đơn K80

1. Hoàn thành một đơn hàng.
2. Bấm **In Hóa Đơn**.
3. Trong Print Preview chọn khổ giấy cuộn 80mm/K80 nếu driver máy in hỗ trợ.
4. Kiểm tra chỉ có `.receipt-print` hiển thị khi in theo `@media print`.
5. Kiểm tra hóa đơn có mã đơn, món, số lượng, tổng tiền và phương thức thanh toán.

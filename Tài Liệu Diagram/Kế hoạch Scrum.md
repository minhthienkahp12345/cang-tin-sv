# Kế hoạch Scrum Sprint: Ứng dụng Quản lý Bán hàng Căng-tin Sinh viên ĐH Hải Phòng
## Mục tiêu
Phát triển hệ thống web quản lý bán hàng căng-tin theo từng increment có thể kiểm thử và trình diễn. Kế hoạch gồm 2 Sprint, mỗi Sprint 3 tuần, tiếp theo là 2 tuần kiểm thử tổng thể và đóng gói. Chưa gán ngày lịch vì báo cáo chưa nêu ngày bắt đầu.
## Nhóm và vai trò dự kiến
*   **Product Owner (PO): Chu Đỗ Hải Nguyên** — đại diện nhu cầu sản phẩm, quản lý và ưu tiên Product Backlog, làm rõ tiêu chí nghiệm thu. Kiêm Backend Lead theo phân công kỹ thuật trong báo cáo.
*   **Scrum Master (SM): Bùi Văn Thiên** — hỗ trợ nhóm áp dụng Scrum, điều phối các sự kiện Scrum và giúp tháo gỡ trở ngại. Kiêm Frontend Lead theo phân công kỹ thuật trong báo cáo.
*   **Developers: Chu Đỗ Hải Nguyên, Bùi Văn Thiên và Bùi Văn Thăng** — cùng chịu trách nhiệm tạo Increment đạt Definition of Done; tự tổ chức công việc và phối hợp xuyên suốt Sprint. Bùi Văn Thăng phụ trách kiểm thử/QA Lead theo phân công kỹ thuật trong báo cáo.

Đây là phân công vai trò được ghi nhận trong tài liệu theo báo cáo dự án. Các thành viên Chu Đỗ Hải Nguyên và Bùi Văn Thăng chưa được xác minh là tài khoản ClickUp, nên chưa được gán vào ClickUp hoặc task.
## Nhịp Scrum
*   Sprint Planning đầu mỗi Sprint: thống nhất Sprint Goal, chọn backlog và làm rõ tiêu chí nghiệm thu.
*   Daily Scrum: 15 phút mỗi ngày làm việc, chia sẻ tiến độ, kế hoạch trong ngày và trở ngại.
*   Sprint Review cuối Sprint: demo increment chạy được, lấy phản hồi PO.
*   Sprint Retrospective cuối Sprint: xác định điều phối nhóm/quy trình cần cải thiện.
*   Backlog Refinement: làm rõ yêu cầu và tiêu chí nghiệm thu trước khi kéo vào Sprint.
## Product Backlog và phân kỳ
### Sprint 1: Nền tảng, thực đơn và tài khoản (Tuần 1-3)
**Sprint Goal:** Xây dựng nền tảng NestJS + React + MySQL, JWT và phân quyền, CRUD thực đơn/tài khoản.
*   US-01: Đăng nhập và phân quyền ADMIN/CASHIER (BR\_04).
*   US-02: Quản lý danh mục món ăn và trạng thái (BR\_01/02).
*   US-03: Quản lý tài khoản nhân viên (BR\_04).
*   Tech task: Khởi tạo CSDL canteen\_db, Git Flow và CI.
### Sprint 2: POS, thanh toán và báo cáo (Tuần 4-6)
**Sprint Goal:** Hoàn thiện bán hàng tại quầy, thanh toán tiền mặt/VietQR, tạo đơn/in hóa đơn và báo cáo doanh thu.
*   US-04: POS chọn món và giỏ hàng (BR\_03).
*   US-05: Thanh toán tiền mặt hoặc VietQR (BR\_03).
*   US-06: Tạo đơn, số thứ tự trong ngày và in hóa đơn K80 (BR\_03).
*   US-07: Dashboard doanh thu và lịch sử (BR\_05).
### Kiểm thử và đóng gói (Tuần 7-8)
*   Unit test Jest: mục tiêu 5 test cases trong orders.service.spec.ts, pass 5/5.
*   API integration: 5 kịch bản qua test-api.http, pass 5/5.
*   System/UI: bộ kiểm thử POS theo [pos-ui.test.md](http://pos-ui.test.md), pass.
*   CI/CD: pipeline GitHub Actions xanh trên môi trường Node 24.
## Definition of Done (DoD)
Một hạng mục chỉ được xem là hoàn thành khi đáp ứng tiêu chí nghiệm thu của task, code build thành công, có kiểm thử phù hợp, giao diện đáp ứng và dễ dùng trên kích thước màn hình mục tiêu, thay đổi được review, không còn lỗi nghiêm trọng đã biết, và CI chạy xanh. PO xác nhận kết quả tại Sprint Review.
## Cách dùng list
Mỗi task đại diện một user story hoặc work item; giữ nội dung thực thi, tiêu chí nghiệm thu, mã BR và người phụ trách dự kiến trong mô tả task. Cập nhật tiến độ trên board/backlog và rà soát các trở ngại trong Daily Scrum.
## Rủi ro và điểm cần xác nhận
*   VietQR phụ thuộc tích hợp dịch vụ ngoài: xác nhận API, dữ liệu thanh toán và phương án lỗi trước khi chốt nghiệm thu.
*   Sprint 1/2 mỗi sprint kéo dài 3 tuần, nên cần kiểm tra năng lực và phạm vi ở Sprint Planning.
*   Các tên file/endpoint/chi tiết kỹ thuật trong báo cáo được giữ làm mục tiêu triển khai, cần đối chiếu với repo thực tế trước khi phát triển.

# TIÊU CHUẨN KỸ THUẬT, AN TOÀN DỮ LIỆU & TUÂN THỦ PHÁP LÝ (v4.0)

## 1. Chuẩn Hóa Xử Lý Lỗi & Giao Thức API
- **Chuẩn lỗi RFC 9457 (Problem Details for HTTP APIs - thay thế RFC 7807):** Mọi phản hồi lỗi HTTP (`>= 400`) bắt buộc trả về `application/problem+json` gồm: `type`, `title`, `status`, `detail`, `instance`, `traceId`, và `errors` (mảng chi tiết trường lỗi Zod).
- **Idempotency-Key Đúng Chỗ:** Chỉ bắt buộc header `Idempotency-Key` đối với các phương thức tạo mới hoặc giao dịch không tự lũy đẳng (`POST /orders`, `POST /payments`). Không ép dùng trên `GET`, `PUT`, `DELETE` vốn đã có tính lũy đẳng tự nhiên.

## 2. An Toàn Di Trú Cơ Sở Dữ Liệu (True Expand-and-Contract)
- **Pha 1 (Expand):** Thêm cột/bảng mới (cho phép `nullable` hoặc có `DEFAULT`), tạo Index bằng `CREATE INDEX CONCURRENTLY` để không khóa bảng.
- **Pha 2 (Contract có kiểm soát):** Trình quét `scripts/harness/sql-migration-guard.mjs` chặn mọi lệnh `DROP TABLE`, `DROP SCHEMA`, `TRUNCATE`, `DELETE` không có `WHERE`, hoặc `ALTER COLUMN TYPE` gây mất dữ liệu. Trường hợp đổi tên cột hoặc dọn dẹp pha Contract hợp lệ, bắt buộc phải có tệp `down.sql` (Rollback script) đi kèm và chú thích xác nhận `-- @migration-contract-approved: <ticket_id>`.
- **RLS Thực Thi Thật Với Prisma:** Khi dùng PostgreSQL RLS trong hồ sơ `enterprise-saas`, bắt buộc bọc truy vấn trong Prisma Client Extension thiết lập `SELECT set_config('app.current_tenant_id', $1, true)` theo từng transaction request.

## 3. Tiêu Chuẩn Giao Diện, Tiếp Cận & Pháp Lý Việt Nam
- **Đủ 4 Trạng Thái Giao Diện:** `Skeleton Loading`, `Empty State`, `Error State (RFC 9457 + Retry)`, và `Data State`.
- **Kiểm Đo Thực Tế:** Tự động kiểm tra khả năng tiếp cận WCAG 2.1 AA qua `@axe-core/playwright`, ngân sách hiệu năng Lighthouse, cấu hình đa ngôn ngữ (i18n Việt/Anh) và Metadata SEO.
- **Tuân Thủ Nghị Định 13/2023/NĐ-CP (Bảo vệ dữ liệu cá nhân tại Việt Nam):** Mọi biểu mẫu thu thập thông tin cá nhân (SĐT, Email, CCCD, Tài chính) phải có hộp kiểm đồng ý rõ ràng (Explicit Consent), mã hóa trường nhạy cảm và hỗ trợ xuất/xóa dữ liệu người dùng.

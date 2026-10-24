---
description: Phân tích báo cáo nâng cấp có chống Prompt Injection, tính Blast-Radius bằng code và nâng cấp an toàn
---
# WORKFLOW: SAFE UPGRADE FROM REPORT (`/upgrade-from-report`)

1. **Làm Sạch Đầu Vào & Khảo Sát (`99-inquisitor-qa`):**
   - Chạy `node scripts/harness/sanitize-inbox.mjs` để quét độc hại trên `inbox/AUDIT_OR_UPGRADE_REPORT.md`.
   - Viết bộ kiểm thử hồi quy vào `inquisitor-vault/regression-suite/` để bảo vệ 100% tính năng cũ.
2. **Định Lượng Bán Kính Ảnh Hưởng Bằng Code (`calc-blast-radius.mjs`):**
   - Chạy `node scripts/harness/calc-blast-radius.mjs`.
   - Nếu kết quả là `LOW` hoặc `MEDIUM` (không chạm bảng dữ liệu lõi/Auth/Prod): Tự động kích hoạt luồng nâng cấp qua `00` -> `01` -> `02` -> `03` -> `99` -> `04`.
   - Nếu kết quả là `HIGH` hoặc `CRITICAL`: Bắt buộc dừng lại yêu cầu Chủ dự án ký xác nhận vào `contracts/HUMAN_SIGN_OFF.json` trước khi thực thi.

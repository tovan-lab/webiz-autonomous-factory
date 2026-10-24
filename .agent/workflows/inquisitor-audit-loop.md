---
description: Chạy toàn bộ công cụ cưỡng chế code, kiểm tra ma trận truy vết và cấp biên nhận mật mã
---
# WORKFLOW: DETERMINISTIC INQUISITOR AUDIT (`/inquisitor-audit-loop`)

1. Thực thi `node scripts/harness/verify-pipeline.mjs --attest`.
2. Nếu lệnh trả về mã lỗi khác `0`, đọc báo cáo lỗi và phiếu phạt trong `.git/webiz-state/rejection-log.json`, gọi đúng Agent vi phạm sửa lỗi (nếu bộ đếm fingerprint trong `.git/webiz-state/circuit-breaker.json` chưa vượt quá 3).

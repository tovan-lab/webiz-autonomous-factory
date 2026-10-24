# CƠ CHẾ CƯỠNG CHẾ BẰNG CODE, THANG ĐO RUBRIC & CẦU CHÌ (v4.0)

## 1. 6 Chốt Chặn Thực Thi Tự Động (`node scripts/harness/verify-pipeline.mjs`)
1. `sanitize-inbox.mjs`: Quét chống Prompt Injection trên toàn bộ tài liệu đầu vào tại `inbox/`.
2. `enforce-scope.mjs`: Đối chiếu `git diff` với `CODEOWNERS.json`. Sửa trái phép ngoài phạm vi sẽ bị từ chối tức thì.
3. `contract-lock.mjs`: Kiểm tra chữ ký `SHA-256` của `contracts/`. Nếu kỹ sư cần đổi hợp đồng, bắt buộc tạo **Contract Change Request (`contracts/ccr/CCR-XXX.json`)** để `00-chief-architect` duyệt và ký lại.
4. `ast-audit.mjs`: Phân tích cú pháp loại bỏ comment/string hợp lệ, chặn đứng `: any`, `Array<any>`, `Record<..., any>`, `as unknown as`, `@ts-ignore`, `eslint-disable`, `it.todo`, `xit`, `.skip(`, và **bài test rỗng không có `expect()`**.
5. `sql-migration-guard.mjs` & `secops-scan.mjs`: Chặn lệnh SQL hủy diệt không có kịch bản `down.sql` và quét rò rỉ khóa bí mật (AWS `AKIA`, Stripe `sk_live_`, OpenAI `sk-`, Google `AIza`, GitHub `ghp_`, JWT, chuỗi kết nối DB chứa mật khẩu, file `.env.*`).
6. `verify-traceability.mjs`: Đảm bảo số lượng yêu cầu `>= min_requirements`, mọi `REQ-ID` đều gắn với bài test thực tế và đã chạy `VERIFIED`.

## 2. Thang Đo Mức Độ Nghiêm Trọng (Auditor Severity Rubric) & Defect Fingerprint
Để tránh việc `99-inquisitor-qa` bắt bẻ chủ quan vô tận hoặc LLM diễn đạt lại lỗi làm trôi bộ đếm:
- Mỗi lỗi phát hiện bắt buộc tính mã định danh bất biến: `fingerprint = SHA256(target_agent + ":" + rule_id + ":" + normalized_file_path)`.
- **Phân loại 3 cấp độ:**
  - `BLOCKER` (Hỏng luồng chính, lỗi bảo mật, rớt test, vi phạm hợp đồng): Bắt buộc trả hồ sơ làm lại (`REJECTED`).
  - `MAJOR` (Thiếu xử lý trạng thái lỗi/rỗng, thiếu test biên): Bắt buộc trả hồ sơ làm lại (`REJECTED`).
  - `MINOR` (Góp ý thẩm mỹ nhỏ, tối ưu tên biến nội bộ): **KHÔNG chặn pipeline**, tự động ghi vào `BACKLOG.md`.
- **Cầu chì (`circuit-breaker.json` lưu trong `.git/webiz-state/`):** Khi 1 `fingerprint` chạm ngưỡng `retry_count >= 3`, dừng lặp tức thì và chuyển trạng thái sang `ESCALATED_TO_ARCHITECT_AND_HUMAN`.

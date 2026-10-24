---
description: Khởi chạy dự án mới từ A-Z với cơ chế cưỡng chế bằng code và cổng duyệt an toàn
---
# WORKFLOW: BUILD FROM ZERO (`/build-from-zero`)

1. **Stage 00 — Làm Rõ Yêu Cầu & Niêm Phong Hợp Đồng (`00-chief-architect`):**
   - Chạy `node scripts/harness/sanitize-inbox.mjs`.
   - Phân tích `inbox/PROJECT_BRIEF.md`, chọn hồ sơ trong `contracts/project-profile.json`, xuất `PRD_SPEC.md`, `schema.prisma`, `openapi.yaml`, `ui-design-tokens.json`, và `traceability-spec.json`.
   - Kiểm tra xác nhận `contracts/HUMAN_SIGN_OFF.json` và chạy `node scripts/harness/contract-lock.mjs --seal`.
   - Đóng dấu mốc Git: `node scripts/harness/checkpoint.mjs stage-00-contracts-sealed 00-chief-architect`.

2. **Stage 01 — Dựng Hạ Tầng Kiểm Thử, Database & Backend (`01-backend-data-engineer`):**
   - Tạo `infra/docker-compose.test.yml`, migrations (`up.sql` + `down.sql`), seeds, và toàn bộ Backend API chuẩn RFC 9457.
   - Đóng dấu mốc Git: `node scripts/harness/checkpoint.mjs stage-01-backend-ready 01-backend-data-engineer`.

3. **Stage 02 — Xây Dựng Giao Diện & Kiểm Thử Tiếp Cận (`02-frontend-artisan`):**
   - Xây dựng giao diện Next.js đủ 4 trạng thái, tích hợp API thật, kiểm tra WCAG AA (`axe-core`), i18n, SEO và Nghị định 13/2023/NĐ-CP.
   - Đóng dấu mốc Git: `node scripts/harness/checkpoint.mjs stage-02-frontend-ready 02-frontend-artisan`.

4. **Stage 03 — Kiểm Toán An Ninh Độc Lập (`03-secops-auditor`):**
   - Chạy `node scripts/harness/secops-scan.mjs` và bổ sung bài test bảo mật vào `inquisitor-vault/security-tests/`.
   - Đóng dấu mốc Git: `node scripts/harness/checkpoint.mjs stage-03-secops-audited 03-secops-auditor`.

5. **Stage 99 — Nghiệm Thu Đối Kháng & Ký Biên Nhận Mật Mã (`99-inquisitor-qa`):**
   - Chạy bộ E2E hộp đen trên `docker-compose.test.yml`, cập nhật `inquisitor-vault/traceability-status.json`.
   - Chạy `node scripts/harness/verify-pipeline.mjs --attest`. Nếu phát hiện lỗi `BLOCKER`/`MAJOR`, ghi phiếu phạt và trả về đúng kỹ sư phụ trách (tối đa 3 vòng/fingerprint).

6. **Stage 04 — Đóng Gói Phát Hành & Chờ Lệnh Production (`04-release-sre`):**
   - Kiểm tra biên nhận mật mã, hoàn thiện cấu hình Production trong `infra/` và `.github/workflows/ci-cd.yml` (Tự động lên Staging, chờ con người bấm nút duyệt lên Production).

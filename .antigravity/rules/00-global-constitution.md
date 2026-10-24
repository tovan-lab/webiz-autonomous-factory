# HIẾN PHÁP VẬN HÀNH: WEBIZ DETERMINISTIC SOFTWARE FACTORY (v4.0)

## 1. Nguyên Lý Cốt Lõi: "Code Enforcement Over Textual Advice"
1. **Không Tin Lời Khai Của LLM (Zero-Trust Verification):** Mọi tuyên bố "đã hoàn thành" của Agent đều vô giá trị nếu `node scripts/harness/verify-pipeline.mjs` trả về mã thoát khác `0`.
2. **Một Nguồn Sự Thật Duy Nhất (Single Source of Truth):**
   - **Database:** `contracts/schema.prisma` là hợp đồng dữ liệu duy nhất (cấm duy trì song song file SQL thủ công rời rạc gây trôi schema).
   - **API:** `contracts/openapi.yaml` (OpenAPI 3.1.0) là hợp đồng giao tiếp duy nhất giữa Backend và Frontend.
   - **Truy vết Nghiệm thu:** Tách bạch giữa `contracts/traceability-spec.json` (Bản gốc do `00-chief-architect` niêm phong SHA-256) và `inquisitor-vault/traceability-status.json` (Bản ghi kết quả kiểm thử do `99-inquisitor-qa` cập nhật).
3. **3 Hồ Sơ Kiến Trúc Linh Hoạt (Project Profiles):**
   Tránh over-engineering, `00-chief-architect` bắt buộc chọn 1 trong 3 profile trong `contracts/project-profile.json`:
   - `static-marketing`: Website giới thiệu doanh nghiệp, Landing Page chuẩn SEO/i18n (Next.js App Router, không ép dùng Redis/Idempotency-Key thừa thãi).
   - `crud-webapp`: Ứng dụng quản trị/thương mại (Next.js + API + Prisma PostgreSQL + Zod + RFC 9457).
   - `enterprise-saas`: Hệ thống đa thuê bao/tài chính (Full stack + Row-Level Security qua `SET LOCAL app.current_tenant_id` + Idempotency-Key cho `POST` + Audit Trail).

# PROJECT BRIEF: WEBIZ AUTONOMOUS AI WORKFORCE & 3D SPATIAL COMMAND CENTER (v5.0)

## 1. MỤC TIÊU HỆ THỐNG & HỒ SƠ DỰ ÁN (PROJECT PROFILE)
- **Project Profile:** `enterprise-saas` (kết hợp `3d-spatial-ui` tại tầng Frontend)
- **Mục tiêu cốt lõi:** Xây dựng nền tảng điều hành "Công ty Nhân sự AI Webiz" cho Chủ tịch Phạm Trọng, kết nối trực tiếp trạng thái thực thi của nhà máy `webiz-autonomous-factory` lên không gian **Trụ sở 3D (3D Virtual Office)** kèm **Hộp Duyệt 1-Chạm (30-Minute Approval Deck)**, hệ thống **CRM Lọc Khách & Cổng Đặt Cọc 50%**, **Sổ Kế Toán Tất Định & Kiểm Soát Hạn Mức Chatbot**, và **Bộ Live Sandbox 3D Ngành Gym/Fitness**.

## 2. DANH SÁCH THỰC THỂ DỮ LIỆU BẮT BUỘC (`contracts/schema.prisma`)
Kỹ sư `00-chief-architect` thiết kế `schema.prisma` bao gồm đầy đủ 6 nhóm bảng (Models) sau:

1. **`AgentEmployee` & `AgentTelemetryLog` (Quản trị 10 Nhân sự AI):**
   - Lưu danh sách 10 nhân sự AI chia làm 2 khối:
     - *Khối Kỹ thuật (Tech Factory):* `00-chief-architect`, `01-backend-data-engineer`, `02-frontend-artisan`, `03-secops-auditor`, `04-release-sre`, `99-inquisitor-qa`.
     - *Khối Vận hành & Thương mại (BizOps):* `B01-growth-director` (Marketing & Video Remotion), `B02-lead-concierge` (Tiếp nhận & Tạo Sandbox 5 phút), `B03-legal-counsel` (Hợp đồng & Tuân thủ NĐ 13/2023), `B04-ledger-controller` (Kế toán & Khóa thanh toán).
   - Trường dữ liệu: `agentCode` (unique), `displayName`, `division` (`TECH_FACTORY` | `BIZ_OPS`), `roleTitle`, `accentColorHex`, `deskZone` (`ARCHITECT_DESK`, `ENGINEERING_BAY`, `QA_PODIUM`, `GROWTH_STUDIO`, `CONCIERGE_LOBBY`, `GOVERNANCE_VAULT`), `currentStatus` (`IDLE`, `WORKING`, `WAITING_CHAIRMAN_APPROVAL`, `IN_MEETING`, `BLOCKED_BY_HARNESS`), `currentTaskSummary`, `positionX`, `positionY`, `positionZ`.

2. **`Lead` & `ClientProject` (Luồng Khách hàng 9 Bước & Cổng Cọc 50%):**
   - Nguồn tiếp nhận (`sourceChannel`): `FACEBOOK_MESSENGER`, `ZALO_OA`, `WEB_FORM`, `SCHEDULED_CALL`.
   - Ngành nghề (`industry`): `GYM_FITNESS`, `SPA_BEAUTY`, `HOMESTAY_TRAVEL`, `FNB_RESTAURANT`.
   - Gói dịch vụ (`packageTier`):
     - `STARTER_3D` (3.900.000 VNĐ - phí duy trì 390.000đ/tháng)
     - `GROWTH_AI` (5.900.000 VNĐ - phí duy trì 490.000đ/tháng kèm 3.000 tin nhắn AI)
     - `PRO_AUTOMATION` (7.900.000 VNĐ - phí duy trì 490.000đ/tháng kèm 3.000 tin nhắn AI & VietQR/CRM)
   - Trạng thái luồng (`pipelineStage`): `NEW` -> `CONTACTED` -> `QUALIFIED` -> `SANDBOX_READY` -> `QUOTED` -> `CONTRACT_SENT` -> `DEPOSIT_50_PAID` -> `IN_PRODUCTION` -> `DELIVERED_PAID_100` -> `LOST`.
   - Cấu hình tiêm thương hiệu (`sandboxBrandConfig` JSON): `brandName`, `primaryColor`, `secondaryColor`, `logoUrl`, `heroTagline`, `hotlineOrZalo`, `samplePackages`.
   - **Quy tắc Cưỡng chế (`Ledger Gate`):** Hệ thống Backend chặn mọi request chuyển `pipelineStage` sang `IN_PRODUCTION` nếu `deposit50PaidAt == null`, và chặn chuyển sang `DELIVERED_PAID_100` (bàn giao hạ tầng) nếu `final50PaidAt == null`.

3. **`ChairmanApprovalItem` (Hộp Duyệt 1-Chạm 4 Cổng + Duyệt Nội dung Marketing):**
   - Phân loại cổng duyệt (`gateType`):
     - `GATE_1_QUOTE` (Duyệt báo giá & phương án gói)
     - `GATE_2_SANDBOX_DEMO` (Duyệt bản Live Sandbox trước khi gửi khách)
     - `GATE_3_CONTRACT_INVOICE` (Duyệt hợp đồng, phụ lục & xác nhận cọc 50%)
     - `GATE_4_HANDOVER_RELEASE` (Duyệt bàn giao bản thật sau khi thu đủ 100%)
     - `DAILY_MARKETING_VIDEO` (Duyệt kịch bản/video TikTok, Reels, Shorts hằng ngày)
   - Trường dữ liệu: `title`, `threeLineSummary`, `previewUrl`, `payloadJson`, `riskWarning` (cảnh báo từ Pháp lý/Kế toán), `submittedByAgent`, `status` (`PENDING`, `APPROVED`, `REVISION_REQUESTED`), `chairmanNote`, `signedHash`, `decidedAt`.

4. **`LedgerTransaction` & `MonthlyBudgetMonitor` (Sổ Kế toán Thật & Trần Chi phí 1 Triệu/Tháng):**
   - Phân loại (`entryType`): `REVENUE_SETUP_DEPOSIT_50`, `REVENUE_SETUP_FINAL_50`, `REVENUE_MONTHLY_RETAINER`, `REVENUE_CHATBOT_TOPUP`, `EXPENSE_AI_API`, `EXPENSE_INFRA_HOSTING`.
   - Theo dõi lũy kế doanh thu năm (`annualCumulativeRevenueVnd`) đối chiếu ngưỡng 1.000.000.000 VNĐ (Nghị định 141/2026/NĐ-CP) và cảnh báo đỏ khi tổng chi phí vận hành tháng (`EXPENSE_*`) vượt 700.000 VNĐ (trần cứng 1.000.000 VNĐ/tháng).

5. **`TenantChatbotQuota` (Kiểm soát Hạn mức Tin nhắn AI & Hard-Cap):**
   - Quản lý theo từng `ClientProject`: `monthlyMessageLimit` (mặc định 3.000 tin nhắn/tháng trong gói 490.000đ), `messagesUsed`, `topUpBalanceMessages` (gói nạp thêm 100.000đ = 5.000 tin nhắn), `hardCapReached` (boolean - tự động khóa gọi LLM khi chạm 100% hạn mức để bảo vệ ngân sách Webiz).

6. **`AnomalyAlert` (Hệ thống 5 Ngưỡng Cảnh báo Đỏ cho Chủ tịch):**
   - Tự động phát cảnh báo mức `CRITICAL` hoặc `WARNING` khi: (1) Chi phí AI/Cloud tháng > 700.000đ; (2) Khách dùng > 85% quota chatbot; (3) Phí duy trì trễ hạn > 5 ngày; (4) Khách nhắn từ khóa khiếu nại hoặc lỗi HTTP 5xx; (5) Doanh thu lũy kế năm chạm 800.000.000đ.

## 3. HỢP ĐỒNG API BẮT BUỘC (`contracts/openapi.yaml` - Chuẩn RFC 9457)
- `GET /api/v1/office/state`: Trả về trạng thái thời gian thực của 10 nhân sự AI, vị trí trong văn phòng 3D, trạng thái `.git/webiz-state/` và các chỉ số KPI trên tường điều khiển.
- `GET /api/v1/approvals/queue` & `POST /api/v1/approvals/{id}/decide`: Lấy danh sách Hộp Duyệt 1-Chạm và ghi quyết định `APPROVED` / `REVISION_REQUESTED` kèm tạo mã băm xác thực.
- `POST /api/v1/leads/intake`: Tiếp nhận khách mới (đã làm sạch chống prompt injection), tự động phân loại ngành, gợi ý gói giá (3.9tr / 5.9tr / 7.9tr) và sinh cấu hình `sandboxBrandConfig`.
- `POST /api/v1/projects/{id}/transition`: Chuyển trạng thái dự án có kiểm tra cưỡng chế `Ledger Gate` (trả lỗi `409 Conflict` chuẩn RFC 9457 nếu chưa thu cọc 50% mà đòi chuyển sang `IN_PRODUCTION`, hoặc chưa thu đủ 100% mà đòi chuyển sang `DELIVERED_PAID_100`).
- `GET /api/v1/ledger/summary` & `POST /api/v1/ledger/transactions`: Báo cáo doanh thu thật, chi phí tháng (< 1 triệu), lũy kế năm và nạp gói Top-up Chatbot.
- `GET /api/v1/sandbox/gym-preview`: Trả về cấu hình thương hiệu động (`?brand=...&color=...`) cho trang Live 3D Gym Sandbox.

## 4. YÊU CẦU GIAO DIỆN 3D & TRẢI NGHIỆM (`02-frontend-artisan`)
Sử dụng Next.js + React + Three.js (`@react-three/fiber`, `@react-three/drei`) tuân thủ chuẩn **Single-Canvas** và **WCAG AA (`axe-core`)**:
1. **Trang Chính (`/`) — Webiz 3D Virtual Office & Chairman Command Center:**
   - Mặt bằng 3D Isometric hiển thị 10 nhân vật AI (6 Kỹ sư + 4 BizOps) tại đúng bàn làm việc theo phòng ban, có hoạt ảnh làm việc, họp bàn giao, màn hình máy tính nhảy code/biểu đồ và chế độ **Cyberpunk "LIGHTS OFF" Mode** (để quay video TikTok/Reels hằng ngày).
   - Bảng điều khiển nổi Glassmorphism (**Hộp Duyệt 1-Chạm của Chủ tịch**): Hiển thị 4 Cổng duyệt + Duyệt Video Marketing, đồng hồ đếm ngược 30 phút duyệt việc mỗi ngày, bảng theo dõi Ngân sách < 1 triệu/tháng và Cổng kiểm soát Cọc 50%.
2. **Trang Live Sandbox Mũi nhọn (`/sandbox/gym`) — Gym & Fitness 3D Conversion Kit:**
   - Giao diện 3D tương tác cho phòng Gym/Fitness hỗ trợ đổi tên thương hiệu và màu chủ đạo ngay qua URL (`?brand=IronHouseGym&primaryColor=%230DEEF3`), tích hợp mô hình 3D khu tập luyện, công cụ tính BMI/TDEE, bảng giá 3 gói tập, đặt lịch tập thử và cửa sổ Chatbot AI tư vấn song ngữ Việt–Anh kèm hộp thoại chấp thuận dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.

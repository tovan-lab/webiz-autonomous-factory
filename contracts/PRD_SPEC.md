# ĐẶC TẢ YÊU CẦU SẢN PHẨM & QUY TRÌNH PHÁP LÝ (PRD SPECIFICATION v5.0)

- **Thương hiệu:** Webiz - Web For Your Biz
- **Chủ tịch Điều hành (Chairman):** Phạm Trọng (https://phamtrong.click)
- **Hồ sơ Dự án:** `enterprise-saas` (kết hợp `webiz-3d-spatial-ui` tại tầng Frontend)
- **Phiên bản Hợp đồng:** 5.0.0
- **Tuân thủ Bắt buộc:** 
  - Nghị định 13/2023/NĐ-CP (Bảo vệ Dữ liệu Cá nhân & Nhật ký Đồng ý Tường minh)
  - Nghị định 141/2026/NĐ-CP (Giám sát Ngưỡng Doanh thu Lũy kế 1 Tỷ VNĐ)
  - Tiêu chuẩn Báo lỗi RFC 9457 Problem Details (`application/problem+json`)
  - Tiêu chuẩn Tiếp cận WCAG 2.1 AA (`axe-core`) & Phục hồi Giảm Chuyển động (`prefers-reduced-motion`)

---

## 1. TỔNG QUAN HỆ THỐNG & ĐỘI NGŨ 10 NHÂN SỰ AI (AUTONOMOUS AI WORKFORCE)

Hệ thống vận hành "Công ty Nhân sự AI Webiz" độc lập dưới sự điều hành của Chủ tịch Phạm Trọng. Nền tảng kết nối trực tiếp trạng thái thực thi của nhà máy phần mềm tự trị `webiz-autonomous-factory` với không gian **Trụ sở 3D (3D Virtual Office)**, trang bị **Hộp Duyệt 1-Chạm 30 Phút (Chairman Approval Deck)**, hệ thống **CRM Lọc Khách 9 Bước & Cổng Cọc 50%**, **Sổ Kế toán Tất định & Quản lý Hạn mức Chatbot**, và **Bộ Live Sandbox 3D Mũi nhọn Ngành Gym/Fitness**.

### Đội ngũ 10 Nhân sự AI phân bổ 2 Khối:

1. **Khối Kỹ thuật (Tech Factory - 6 Nhân sự):**
   - `00-chief-architect`: Tổng công trình sư, phân tích PRD, thiết kế hợp đồng kỹ thuật và quản trị niêm phong SHA-256.
   - `01-backend-data-engineer`: Kỹ sư dữ liệu & Backend, dựng hạ tầng kiểm thử, migration, seed và API chuẩn RFC 9457.
   - `02-frontend-artisan`: Kỹ sư giao diện, xây dựng Webiz 3D Spatial UI, Next.js Single-Canvas, chuẩn WCAG AA và i18n.
   - `03-secops-auditor`: Kiểm toán viên an ninh, rà quét SQL Injection, bí mật rò rỉ, quyền ghi và viết bài test bảo mật.
   - `04-release-sre`: Kỹ sư phát hành & độ tin cậy, kiểm tra biên nhận mật mã, đóng gói Docker/K8s và cấu hình CI/CD Staging/Production.
   - `99-inquisitor-qa`: Quan tòa kiểm thử đối kháng hộp đen, nghiệm thu ma trận truy vết và ký biên nhận mật mã chứng thực.

2. **Khối Vận hành & Thương mại (BizOps - 4 Nhân sự):**
   - `B01-growth-director`: Giám đốc Tăng trưởng, sản xuất video tự động bằng Remotion (TikTok, Reels, YouTube Shorts) và điều phối chiến dịch quảng bá.
   - `B02-lead-concierge`: Lễ tân AI & Tiếp nhận Khách, phản hồi đa kênh trong 60 giây, tự động trích xuất thông tin và tạo Live Sandbox trong 5 phút.
   - `B03-legal-counsel`: Cố vấn Pháp lý AI, soạn thảo hợp đồng dịch vụ, phụ lục điều khoản và giám sát tuân thủ Nghị định 13/2023/NĐ-CP.
   - `B04-ledger-controller`: Kiểm soát viên Kế toán & Dòng tiền, giám sát doanh thu thực, khóa cổng sản xuất khi chưa cọc 50%, kiểm soát trần chi phí 1 triệu/tháng.

---

## 2. TRỤ SỞ ẢO 3D & BẢNG ĐIỀU KHIỂN CHỦ TỊCH (3D SPATIAL COMMAND CENTER)

### 2.1. Phân khu Không gian (Spatial Zoning)
Mặt bằng 3D Isometric chuẩn WebGL hiển thị trực quan 4 phân khu chức năng:
1. **Tech Factory Zone (Khu Kỹ thuật):** 6 vị trí bàn làm việc của các kỹ sư công nghệ với màn hình mô phỏng dòng code, trạng thái build và bục kiểm định của `99-inquisitor-qa`.
2. **Growth & Concierge Zone (Khu Kinh doanh & Tăng trưởng):** Bàn làm việc của `B01-growth-director` hiển thị lịch video truyền thông và quầy lễ tân của `B02-lead-concierge` kết nối luồng khách Messenger/Zalo.
3. **Governance Vault Zone (Khu Pháp lý & Tài chính):** Bàn làm việc của `B03-legal-counsel` và `B04-ledger-controller` với đồng hồ đo dòng tiền và cảnh báo pháp lý.
4. **Chairman's Approval Suite (Phòng Chủ tịch & Hộp Duyệt 1-Chạm):** Vị trí trung tâm kết nối trực tiếp với API duyệt quyết định của Chủ tịch.

### 2.2. Cyberpunk "LIGHTS OFF" Mode
Chế độ ánh sáng đặc biệt cho phép Chủ tịch chuyển đổi từ ánh sáng văn phòng công sở ban ngày sang không gian Cyberpunk tối huyền ảo (Deep Void `#05070E`, Hologram Cyan `#0DEEF3`, Neon Magenta `#FF007A`). Khi kích hoạt, đèn trần giảm 90%, các màn hình AI nhân sự phát quang neon, phục vụ trực tiếp việc quay video ngắn màn hình (Screen Recording) chia sẻ lên TikTok/Reels.

### 2.3. Hộp Duyệt 1-Chạm 30 Phút của Chủ tịch (Chairman 30-Minute Approval Deck)
Chủ tịch chỉ cần tối đa 30 phút mỗi ngày để điều hành toàn bộ công ty thông qua 4 Cổng Duyệt + 1 Luồng Video:
- **CỔNG 1 (`GATE_1_QUOTE`):** Duyệt phương án gói và báo giá do `B02-lead-concierge` đề xuất cho khách hàng tiềm năng.
- **CỔNG 2 (`GATE_2_SANDBOX_DEMO`):** Duyệt bản Live Sandbox động (tiêm logo, màu, tên thương hiệu) trước khi gửi cho khách trải nghiệm.
- **CỔNG 3 (`GATE_3_CONTRACT_INVOICE`):** Duyệt hợp đồng dịch vụ chuẩn Nghị định 13/2023/NĐ-CP và lệnh thu tiền cọc 50%.
- **CỔNG 4 (`GATE_4_HANDOVER_RELEASE`):** Duyệt bàn giao sản phẩm thực, trỏ tên miền chính thức sau khi kế toán xác nhận đã thu đủ 100% tiền gói.
- **LUỒNG PHỤ (`DAILY_MARKETING_VIDEO`):** Duyệt 1 kịch bản/video ngắn trong ngày do `B01-growth-director` tạo tự động.

Mỗi quyết định `APPROVED` hoặc `REVISION_REQUESTED` bắt buộc ghi nhận dấu thời gian, ghi chú chỉ đạo và tạo chữ ký băm mật mã SHA-256 (`signedHash`).

---

## 3. CRM 9 BƯỚC & QUY TẮC CƯỠNG CHẾ CỌC 50% (LEDGER GATE)

### 3.1. Kênh Tiếp Nhận & Ngành Mục Tiêu
- Kênh tiếp nhận: `FACEBOOK_MESSENGER`, `ZALO_OA`, `WEB_FORM`, `SCHEDULED_CALL`.
- Ngành SME mũi nhọn: `GYM_FITNESS` (chính), `SPA_BEAUTY`, `HOMESTAY_TRAVEL`, `FNB_RESTAURANT`.

### 3.2. Ba Gói Dịch Vụ Định Vị Webiz
1. **Gói STARTER 3D (3.900.000 VNĐ):**
   - Phí duy trì: 390.000 VNĐ/tháng.
   - Website 3D tương tác Single-Canvas, chuẩn Mobile-First, form đặt lịch hẹn, hosting tối ưu.
2. **Gói GROWTH AI (5.900.000 VNĐ):**
   - Phí duy trì: 490.000 VNĐ/tháng.
   - Toàn bộ tính năng Starter + Chatbot AI tư vấn thông minh (kèm hạn mức 3.000 tin nhắn/tháng).
3. **Gói PRO AUTOMATION (7.900.000 VNĐ):**
   - Phí duy trì: 490.000 VNĐ/tháng.
   - Toàn bộ tính năng Growth + Tích hợp thanh toán QR VietQR tự động, đồng bộ CRM và Webhook tiếp thị.

### 3.3. Luồng 9 Giai Đoạn (Pipeline Stages)
`NEW` -> `CONTACTED` -> `QUALIFIED` -> `SANDBOX_READY` -> `QUOTED` -> `CONTRACT_SENT` -> `DEPOSIT_50_PAID` -> `IN_PRODUCTION` -> `DELIVERED_PAID_100` -> `LOST`.

### 3.4. Cưỡng Chế Bằng Mã (Ledger Gate - Không Ngoại Lệ)
- **Quy tắc Cọc 50%:** Endpoint `POST /api/v1/projects/{id}/transition` khi nhận yêu cầu chuyển trạng thái sang `IN_PRODUCTION` bắt buộc kiểm tra `deposit50PaidAt != null`. Nếu chưa thanh toán, hệ thống cưỡng chế trả lỗi `409 Conflict` (RFC 9457 Problem Details) kèm thông điệp: *"Chặn sản xuất: Chưa xác nhận thanh toán cọc 50% vào sổ kế toán Webiz"*.
- **Quy tắc Bàn giao 100%:** Khi chuyển trạng thái sang `DELIVERED_PAID_100`, bắt buộc kiểm tra `final50PaidAt != null`. Nếu chưa thanh toán 50% còn lại, hệ thống trả lỗi `409 Conflict`: *"Chặn bàn giao: Chưa xác nhận thu đủ 100% giá trị hợp đồng"*.

---

## 4. SỔ KẾ TOÁN TẤT ĐỊNH & KIỂM SOÁT NGÂN SÁCH DƯỚI 1 TRIỆU/THÁNG

### 4.1. Sổ Kế Toán Thực (`LedgerTransaction`)
Ghi nhận chính xác 6 phân loại giao dịch:
- `REVENUE_SETUP_DEPOSIT_50`: Thu cọc triển khai 50% (1.95tr, 2.95tr, 3.95tr).
- `REVENUE_SETUP_FINAL_50`: Thu hoàn tất triển khai 50% còn lại.
- `REVENUE_MONTHLY_RETAINER`: Thu phí duy trì hằng tháng (390k hoặc 490k).
- `REVENUE_CHATBOT_TOPUP`: Thu nạp gói tin nhắn AI mở rộng (100k = 5.000 tin nhắn).
- `EXPENSE_AI_API`: Chi phí token API LLM thực tế (Gemini/DeepSeek/OpenAI).
- `EXPENSE_INFRA_HOSTING`: Chi phí hạ tầng điện toán đám mây.

### 4.2. Giám Sát Chi Phí Hoạt Động & Ngưỡng Doanh Thu Năm
- **Trần Chi phí Vận hành Tháng (Expense Hard-Cap):**
  - Mức cảnh báo vàng: Tổng chi phí tháng (`EXPENSE_*`) vượt **700.000 VNĐ** -> Kích hoạt cảnh báo tới Chủ tịch.
  - Mức trần cứng (Hard Limit): Không vượt quá **1.000.000 VNĐ/tháng**.
- **Ngưỡng Doanh thu Lũy kế Năm (Nghị định 141/2026/NĐ-CP):**
  - Giám sát tổng doanh thu năm (`annualCumulativeRevenueVnd`) đối chiếu ngưỡng trần **1.000.000.000 VNĐ**.
  - Kích hoạt cảnh báo đỏ khi doanh thu đạt **800.000.000 VNĐ** (80% ngưỡng).

---

## 5. HẠN MỨC CHATBOT KHÁCH HÀNG & CƠ CHẾ KHÓA CỨNG (HARD-CAP)

Mỗi dự án khách hàng có bản ghi `TenantChatbotQuota`:
- **Hạn mức Cơ sở:** 3.000 tin nhắn/tháng (nằm trong phí duy trì 490.000 VNĐ/tháng).
- **Gói Nạp Thêm (Top-up):** 100.000 VNĐ được cộng thêm 5.000 tin nhắn vào `topUpBalanceMessages`.
- **Cơ chế Khóa Cứng (Hard-Cap Cutoff):** Khi `messagesUsed >= monthlyMessageLimit + topUpBalanceMessages`, hệ thống tự động gán `hardCapReached = true` và ngắt ngay lập tức quyền gọi API LLM phía ngoài, trả lời tin nhắn mẫu: *"Kênh tư vấn tạm thời đạt giới hạn trong tháng, vui lòng liên hệ hotline hoặc nạp thêm gói để tiếp tục"*. Cơ chế này bảo đảm chi phí token API không bao giờ vượt ngân sách của Webiz.

---

## 6. HỆ THỐNG 5 NGƯỠNG CẢNH BÁO ĐỎ CỦA CHỦ TỊCH (ANOMALY ALERTS)

Hệ thống tự động quét và kích hoạt `AnomalyAlert` ở 2 mức độ `WARNING` hoặc `CRITICAL`:
1. `EXPENSE_EXCEEDED` (`WARNING` / `CRITICAL`): Chi phí AI/Cloud trong tháng vượt 700.000 VNĐ hoặc chạm trần 1.000.000 VNĐ.
2. `QUOTA_EXCEEDED` (`WARNING`): Dự án khách hàng sử dụng vượt 85% hạn mức tin nhắn tháng.
3. `RETAINER_OVERDUE` (`WARNING`): Khách hàng trễ hạn đóng phí duy trì quá 5 ngày.
4. `CUSTOMER_COMPLAINT_OR_5XX` (`CRITICAL`): Khách hàng gửi từ khóa khiếu nại (bồi hoàn, lừa đảo, lỗi) hoặc hệ thống phát sinh lỗi HTTP 5xx.
5. `ANNUAL_REVENUE_THRESHOLD` (`CRITICAL`): Doanh thu năm đạt 800.000.000 VNĐ (chuẩn bị chuyển đổi mô hình thuế theo NĐ 141/2026).

---

## 7. BỘ LIVE 3D SANDBOX NGÀNH GYM/FITNESS (`/sandbox/gym`)

### 7.1. Tiêm Thương Hiệu Động Qua URL (Dynamic URL Ingestion)
Khách hàng mở link demo dạng: `/sandbox/gym?brand=IronHouseGym&primaryColor=%230DEEF3&secondaryColor=%23FF007A`.
Hệ thống tự động cập nhật logo, màu sắc thương hiệu, câu định vị (hero tagline) và hotline Zalo tức thì không cần tải lại toàn bộ mã nguồn.

### 7.2. Trải Nghiệm Không Gian 3D Mobile-First
- Single-Canvas WebGL duy nhất toàn trang kết hợp `@react-three/drei` `<View>`.
- Hiển thị sa bàn 3D phòng tập với 3 khu vực:
  - *Cardio Zone:* Máy chạy bộ, xe đạp xoay.
  - *Free Weights Zone:* Tạ đòn, tạ đơn, ghế đẩy ngực.
  - *PT & Yoga Zone:* Thảm tập, bục huấn luyện cá nhân.
- Tương tác vuốt xoay mượt mà (`PresentationControls`), chạm/click vào từng khu vực để camera bay đến (`CameraControls.setLookAt`) và bật form đăng ký tập thử.
- Tích hợp công cụ tính chỉ số thể lực **BMI & TDEE** kèm gợi ý thực đơn và gói tập tương ứng.
- Cửa sổ Chatbot AI tư vấn thể hình 24/7 song ngữ Việt - Anh.
- Hộp thoại đồng ý xử lý dữ liệu cá nhân (tên, số điện thoại, chỉ số cân nặng/chiều cao) tuân thủ chặt chẽ **Nghị định 13/2023/NĐ-CP**, lưu vết vào bảng `ConsentAuditLog`.

---

## 8. TIÊU CHUẨN TIẾP CẬN & HIỆU NĂNG 3D

1. **Hiệu năng 3D Di động:**
   - Single WebGL Context duy nhất trên trang.
   - Nén Draco/Meshopt cho mô hình 3D, dung lượng tải ban đầu không vượt quá **1.8 MB**.
   - Cấu hình `<Canvas dpr={[1, 1.5]} frameloop="demand" shadows="soft">`.
2. **Tiếp cận & Thích nghi (WCAG 2.1 AA):**
   - Đạt 100% tiêu chí WCAG 2.1 AA kiểm tra qua `axe-core`.
   - Lắng nghe `prefers-reduced-motion` và đo kiểm GPU (FPS < 30) để tự động hạ cấp xuống ảnh tĩnh chất lượng cao hoặc sa bàn 2D Isometric mà không làm gián đoạn trải nghiệm của khách.
3. **Báo Lỗi Chuẩn RFC 9457:**
   - Toàn bộ phản hồi mã lỗi HTTP 4xx và 5xx bắt buộc trả về định dạng `application/problem+json` với các trường: `type`, `title`, `status`, `detail`, `instance`, `traceId`.

---

## 9. MA TRẬN YÊU CẦU TRUY VẾT CỐT LÕI (TRACEABILITY REQUIREMENTS)

| Mã Yêu Cầu | Tiêu Đề Nghiệp Vụ | Mức Độ Ưu Tiên | Phân Loại | Tiêu Chí Nghiệm Thu Chấp Nhận (Acceptance Criteria) |
|---|---|---|---|---|
| `REQ-001` | Liveness/Readiness Probe & Chuẩn Lỗi RFC 9457 | BLOCKER | core-reliability | `GET /api/v1/healthz` trả về `200 OK` `{status: "ok", version: "4.0.0"}`; Mọi lỗi hệ thống trả về schema Problem Details hợp lệ. |
| `REQ-002` | Trạng Thái Trụ Sở 3D & Telemetry 10 AI Agents | CRITICAL | spatial-office | `GET /api/v1/office/state` trả về danh sách 10 AI agents với đúng tọa độ không gian 3D, trạng thái làm việc, và KPI vận hành. |
| `REQ-003` | Hộp Duyệt 1-Chạm 30 Phút Của Chủ Tịch (4 Cổng + Video) | BLOCKER | governance-suite | `GET /api/v1/approvals/queue` & `POST /api/v1/approvals/{id}/decide` ghi nhận quyết định duyệt/yêu cầu sửa đổi kèm chữ ký băm SHA-256. |
| `REQ-004` | Tiếp Nhận Khách Đa Kênh & Sinh Cấu Hình Sandbox | CRITICAL | lead-crm | `POST /api/v1/leads/intake` lọc chống prompt injection, tự động phân loại ngành, đề xuất gói cước và sinh `sandboxBrandConfig`. |
| `REQ-005` | CRM 9 Bước & Khóa Cưỡng Chế Cọc 50% (Ledger Gate) | BLOCKER | ledger-gate | `POST /api/v1/projects/{id}/transition` chặn chuyển `IN_PRODUCTION` nếu thiếu cọc 50% và chặn `DELIVERED_PAID_100` nếu chưa thanh toán 100%, trả lỗi 409 RFC 9457. |
| `REQ-006` | Sổ Kế Toán Tất Định & Trần Chi Phí Hoạt Động Tháng | CRITICAL | accounting-ledger | `GET /api/v1/ledger/summary` phản ánh doanh thu thực, chi phí hoạt động tháng (< 1tr VNĐ) và cảnh báo đỏ khi chạm ngưỡng. |
| `REQ-007` | Hạn Mức Chatbot Khách Hàng & Khóa Cứng (Hard-Cap) | BLOCKER | chatbot-quota | Tự động kích hoạt `hardCapReached = true` và ngắt gọi API LLM khi chạm trần mức sử dụng bảo vệ ngân sách Webiz. |
| `REQ-008` | Hệ Thống 5 Ngưỡng Cảnh Báo Đỏ Bất Thường | MAJOR | anomaly-detection | Tự động phát sinh `AnomalyAlert` khi phát hiện vi phạm 1 trong 5 ngưỡng quy định (Chi phí, Quota, Nợ phí, Lỗi 5xx/Khiếu nại, Doanh thu năm). |
| `REQ-009` | Live 3D Gym Sandbox Tương Tác & Tiêm Thương Hiệu URL | CRITICAL | spatial-sandbox | Trang `/sandbox/gym` tải cấu hình động qua URL query `?brand=...&primaryColor=...`, hiển thị mô hình 3D tương tác, tính BMI/TDEE và form đặt lịch. |
| `REQ-010` | Tuân Thủ Nghị Định 13/2023/NĐ-CP & Nhật Ký Đồng Ý | BLOCKER | legal-compliance | Ghi nhận sự đồng ý tường minh của khách hàng trước khi thu thập dữ liệu cá nhân tại `/api/v1/compliance/consent` vào `ConsentAuditLog`. |
| `REQ-011` | Chuẩn WebGL Single-Canvas & Tối Ưu Tải 3D Mobile | MAJOR | spatial-performance | Đảm bảo duy nhất 1 `<Canvas>` WebGL cho toàn bộ trang, payload tài nguyên 3D ban đầu <= 1.8MB, nén Draco/Meshopt. |
| `REQ-012` | Tiêu Chuẩn Tiếp Cận WCAG 2.1 AA & Giảm Chuyển Động | MAJOR | accessibility | Vượt qua kiểm thử tiếp cận `axe-core` đạt chuẩn WCAG AA, tự động hạ cấp giao diện tĩnh khi người dùng bật `prefers-reduced-motion`. |

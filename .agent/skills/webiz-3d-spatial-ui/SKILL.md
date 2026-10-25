### 5.1. Bộ Skill Xây dựng Giao diện 3D cho Kỹ sư `02-frontend-artisan` (`.agent/skills/3d-spatial-ui/SKILL.md`)

Hãy lưu nội dung dưới đây vào `.agent/skills/3d-spatial-ui/SKILL.md` (hoặc tích hợp vào `.agent/agents/02-frontend-artisan.agent.md`) để trang bị năng lực thiết kế 3D chuyên nghiệp cho kỹ sư giao diện của bạn:

```markdown
---
name: webiz-3d-spatial-ui
description: Tiêu chuẩn kiến trúc và bộ quy tắc bắt buộc cho 02-frontend-artisan khi xây dựng giao diện 3D WebGL/WebGPU (React Three Fiber, Drei, Spline, Theatre.js) cho hệ thống Webiz Virtual Office và các gói Website 3D SME (Gym, Spa, Homestay, F&B).
---

# Webiz 3D Spatial UI Engineering Skill (Dành cho 02-frontend-artisan)

## 1. Nguyên tắc Hiệu năng Sống còn trên Thiết bị Di động (Mobile-First 3D Guardrails)
Khách hàng của chủ cơ sở nhỏ (Gym, Spa, Homestay, Quán ăn) truy cập 85% bằng điện thoại. Mọi giao diện 3D bắt buộc tuân thủ:
1. **Quy tắc Đơn Canvas (Single WebGL Context Rule):** Tuyệt đối KHÔNG khởi tạo nhiều thẻ `<Canvas>` trên cùng một trang web (trình duyệt di động sẽ xóa ngữ cảnh WebGL khi vượt quá 4–8 canvas). Bắt buộc sử dụng một `<Canvas>` toàn trang duy nhất kết hợp với `<View>` từ `@react-three/drei` để gắn các khung 3D vào đúng vị trí các thẻ DOM HTML.
2. **Adaptive DPR & Frameloop:** Luôn cấu hình `<Canvas dpr={[1, 1.5]} frameloop="demand" shadows="soft">` cho các trang thông tin sản phẩm để tiết kiệm pin điện thoại, chỉ bật `frameloop="always"` khi có tương tác cuộn hoặc hoạt cảnh nhân vật.
3. **Nén Tài nguyên 3D:** Mọi mô hình `.glb` / `.gltf` phải nén qua Draco/Meshopt, tổng dung lượng tải ban đầu (Initial 3D Payload) không vượt quá **1.8 MB**. Bắt buộc bọc trong `<Suspense fallback={<Skeleton3DLoader />}>`.
4. **Tuân thủ Tiếp cận (WCAG AA & Reduced Motion):** Kiểm tra `prefers-reduced-motion`; nếu người dùng bật chế độ giảm chuyển động hoặc GPU yếu (FPS < 30 đo qua `<PerformanceMonitor>` của Drei), tự động hạ cấp (Graceful Degradation) về chế độ ảnh tĩnh chất lượng cao hoặc 2D Isometric.

## 2. Bốn Mẫu Kiến trúc 3D Chuẩn theo Ngành Mũi nhọn của Webiz
Khi nhận kịch bản dự án từ `00-chief-architect`, `02-frontend-artisan` chọn đúng 1 trong 4 mẫu 3D sau:
- **Ngành 1 — Gym / Fitness (`gym-3d-showcase`):**
  - Hero Section: Mô hình 3D không gian phòng tập hoặc thiết bị tập/nhân vật 3D xoay theo góc vuốt (`<PresentationControls>`), bấm vào từng khu vực (Cardio, Free Weights, PT Zone) camera tự động bay đến (`CameraControls.setLookAt`) và mở thẻ đăng ký tập thử.
- **Ngành 2 — Spa / Thẩm mỹ (`spa-ambient-sanctuary`):**
  - Hero Section: Không gian ánh sáng dịu với hiệu ứng hạt nổi nhẹ (`<Sparkles>`), sản phẩm/liệu trình trưng bày trên bệ 3D nổi (`<Float>`), chuyển cảnh mượt khi cuộn trang kết hợp bảng đặt lịch nhanh.
- **Ngành 3 — Homestay / Du lịch (`homestay-virtual-tour`):**
  - Hero Section: Sa bàn 3D Isometric toàn khu Homestay (hồ bơi, các căn bungalow, khu BBQ). Khách bấm trực tiếp vào từng căn trên sa bàn 3D để xem trạng thái Trống/Đã đặt theo thời gian thực và giữ phòng.
- **Ngành 4 — Quán ăn / Cà phê (`fnb-interactive-menu`):**
  - Hero Section: Bàn tiệc/Món đặc trưng (Signature Dish / Ly cà phê) xoay 3D sắc nét kèm nhãn thành phần nổi trong không gian (`<Html distanceFactor={10}>`), nối thẳng với nút đặt bàn hoặc gọi món qua Chatbot.

## 3. Tiêu chuẩn Xây dựng Webiz 3D Virtual Office (Trụ sở Điều hành Đội ngũ AI)
Khi dựng hoặc nâng cấp giao diện điều hành nội bộ của Webiz (dựa trên kiến trúc `Claw3D` / `Gaurav2693/ai-office`):
1. **Phân khu Không gian (Spatial Zoning):** Chia mặt bằng 3D Isometric thành 4 khu rõ rệt:
   - *Khu Kỹ thuật (Tech Factory Zone):* 6 bàn làm việc của `00-chief-architect`, `01-backend-data-engineer`, `02-frontend-artisan`, `03-secops-auditor`, `04-release-sre`, và bục kiểm tra của `99-inquisitor-qa`.
   - *Khu Kinh doanh & Tiếp thị (Growth & Concierge Zone):* Bàn của `B01-growth-director` (màn hình hiển thị lịch video TikTok/Reels) và quầy lễ tân của `B02-lead-concierge` (hiển thị luồng khách từ Zalo/Messenger).
   - *Khu Kiểm soát Pháp lý & Tài chính (Governance Zone):* Bàn của `B03-legal-counsel` và `B04-ledger-controller` (hiển thị đồng hồ doanh thu thật và trạng thái cọc 50%).
   - *Phòng Chủ tịch & Hộp Duyệt 1-Chạm (Chairman's Approval Suite):* Trung tâm điều khiển hiển thị 4 Cổng duyệt gắn trực tiếp với API ghi file `HUMAN_SIGN_OFF.json`.
```
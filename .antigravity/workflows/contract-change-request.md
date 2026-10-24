---
description: Quy trình yêu cầu điều chỉnh Hợp đồng kỹ thuật có kiểm soát tương thích ngược
---
# WORKFLOW: CONTRACT CHANGE REQUEST (`/contract-change-request`)

1. Kỹ sư phát hiện điểm bất cập trong lúc code tạo tệp `contracts/ccr/CCR-XXX.json` nêu rõ lý do, thay đổi đề xuất và cam kết tương thích ngược.
2. `00-chief-architect` thẩm định CCR, cập nhật `contracts/openapi.yaml` hoặc `contracts/schema.prisma`, và chạy `node scripts/harness/contract-lock.mjs --seal` để niêm phong lại mã băm hợp pháp.

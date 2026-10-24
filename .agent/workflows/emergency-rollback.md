---
description: Khôi phục code về điểm neo bất biến gần nhất mà không làm mất lịch sử bộ đếm Circuit-Breaker
---
# WORKFLOW: NON-DESTRUCTIVE EMERGENCY ROLLBACK (`/emergency-rollback`)

1. Chạy `node scripts/harness/rollback.mjs` để lưu nhánh lỗi hiện tại sang nhánh điều tra `forensics/` và khôi phục cây thư mục về tag bất biến gần nhất.
2. Toàn bộ bộ đếm lỗi trong `.git/webiz-state/circuit-breaker.json` và `rejection-log.json` nằm ngoài Git worktree nên vẫn được bảo toàn nguyên vẹn 100%.

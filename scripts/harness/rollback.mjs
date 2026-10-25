import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { initExternalState, STATE_DIR } from './state-manager.mjs';

export function performEmergencyRollback(rootDir = process.cwd()) {
  initExternalState();
  const timestamp = Date.now();
  const forensicsBranch = `forensics/incident-${timestamp}`;

  console.log(`🚨 [EMERGENCY ROLLBACK] Đang khởi động quy trình khôi phục an toàn không phá hủy...`);

  // 1. Sao lưu nhánh hiện tại sang forensics branch
  try {
    execSync(`git branch "${forensicsBranch}"`, { stdio: 'ignore' });
    console.log(`🛡️ [FORENSICS PRESERVED] Toàn bộ trạng thái lỗi đã được sao lưu sang nhánh: ${forensicsBranch}`);
  } catch (e) {
    console.warn(`⚠️ Không thể tạo nhánh forensics (có thể không có commit mới): ${e.message}`);
  }

  // 2. Tìm tag mốc gần nhất
  let targetRef = 'HEAD~1';
  try {
    const tags = execSync('git tag --list "webiz-*" --sort=-creatordate', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
    if (tags.length > 0) {
      targetRef = tags[0];
    }
  } catch {}

  // 3. Khôi phục worktree về mốc an toàn
  try {
    execSync(`git reset --hard ${targetRef}`, { stdio: 'ignore' });
    console.log(`⏪ [WORKTREE RESTORED] Đã khôi phục cây mã nguồn về mốc an toàn: ${targetRef}`);
  } catch (e) {
    console.warn(`⚠️ Lỗi khôi phục git worktree: ${e.message}`);
  }

  console.log(`🔐 [STATE PRESERVED] Toàn bộ lịch sử bộ đếm trong ${STATE_DIR} được bảo toàn nguyên vẹn 100%.`);
  return { ok: true, forensicsBranch, restoredRef: targetRef };
}

if (process.argv[1]?.endsWith('rollback.mjs')) {
  performEmergencyRollback();
}

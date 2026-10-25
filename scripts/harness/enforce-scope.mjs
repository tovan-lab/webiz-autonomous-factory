import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

function globToRegex(glob) {
  const escaped = glob
    .replace(/\\/g, '/')
    .replace(/[.+^$${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '___DOUBLE_STAR___')
    .replace(/\*/g, '[^/]*')
    .replace(/___DOUBLE_STAR___/g, '.*');
  return new RegExp(`^${escaped}$`);
}

export const HUMAN_ONLY_FILES = new Set([
  'contracts/HUMAN_SIGN_OFF.json'
]);

export function checkAgentWriteScope(agentName, changedFiles, rootDir = process.cwd()) {
  const ownersPath = path.join(rootDir, '.agent/locks/CODEOWNERS.json');
  const owners = JSON.parse(fs.readFileSync(ownersPath, 'utf8'));
  const rule = owners.agents[agentName];
  if (!rule) {
    return { ok: false, violations: [`Agent không tồn tại trong CODEOWNERS.json: ${agentName}`] };
  }

  const allowRegexes = (rule.write_scope || []).map(globToRegex);
  const forbidRegexes = (rule.forbidden_scope || []).map(globToRegex);
  const violations = [];

  for (const rawFile of changedFiles) {
    const file = rawFile.replace(/\\/g, '/').trim();
    if (!file) continue;

    // Chốt chặn cứng: Tệp chỉ dành riêng cho Con người (Human Gate)
    if (HUMAN_ONLY_FILES.has(file)) {
      violations.push(`Agent [${agentName}] sửa trái phép tệp bảo vệ độc quyền của Con người: ${file} (Chỉ Con người mới được quyền ký duyệt file này!)`);
      continue;
    }

    const isForbidden = forbidRegexes.some((rx) => rx.test(file));
    const isAllowed = allowRegexes.some((rx) => rx.test(file));
    if (isForbidden || !isAllowed) {
      violations.push(`Agent [${agentName}] sửa trái phép tệp ngoài phạm vi: ${file}`);
    }
  }
  return { ok: violations.length === 0, violations };
}

if (process.argv[1]?.endsWith('enforce-scope.mjs')) {
  const agent = process.argv[2] || process.env.AGENT_NAME;
  const baseRef = process.argv[3] || process.env.BASE_REF || 'HEAD';

  let diffOut = '';
  try {
    diffOut = execSync(`git diff --name-only ${baseRef}`, { encoding: 'utf8' });
  } catch {
    try {
      diffOut = execSync('git diff --name-only', { encoding: 'utf8' });
    } catch {}
  }
  const changed = diffOut.split(/\r?\n/).filter(Boolean);

  if (!agent) {
    console.log('ℹ️ Cú pháp: node scripts/harness/enforce-scope.mjs <agent-name> [base-git-ref]');
    console.log('🔍 [SCOPE AUDIT] Kiểm tra bảo vệ cổng con người trên các tệp thay đổi...');
    const humanGateViolations = changed.filter((f) => HUMAN_ONLY_FILES.has(f.replace(/\\/g, '/').trim()));
    if (humanGateViolations.length > 0) {
      console.error('🚨 [HUMAN GATE VIOLATION] Phát hiện tệp của Con người bị sửa đổi trong commit/worktree:');
      humanGateViolations.forEach((f) => console.error('  - ' + f));
      process.exit(1);
    }
    console.log('✅ [SCOPE CHECK] Cổng con người an toàn, không bị can thiệp trái phép.');
    process.exit(0);
  }

  const res = checkAgentWriteScope(agent, changed);
  if (!res.ok) {
    console.error('🚨 [WRITE-SCOPE VIOLATION] Vi phạm cô lập quyền ghi:');
    res.violations.forEach((v) => console.error('  - ' + v));
    process.exit(1);
  }
  console.log(`✅ [SCOPE CHECK] Toàn bộ thay đổi của [${agent}] nằm đúng trong vùng được cấp phép.`);
}

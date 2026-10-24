import { execSync } from 'node:child_process';

export function computeBlastRadius(changedFiles) {
  let level = 'LOW';
  const reasons = [];

  for (const raw of changedFiles) {
    const f = raw.replace(/\\/g, '/');
    if (f === 'contracts/schema.prisma' || f.startsWith('workspace/database/migrations/')) {
      level = 'CRITICAL';
      reasons.push(`Thay đổi cấu trúc Database/Migration: ${f}`);
    } else if (f.includes('auth') || f.includes('rbac') || f.startsWith('infra/') || f.startsWith('.github/workflows/')) {
      if (level !== 'CRITICAL') level = 'HIGH';
      reasons.push(`Thay đổi tầng Bảo mật/Hạ tầng/CI-CD: ${f}`);
    } else if (f === 'contracts/openapi.yaml') {
      if (level === 'LOW') level = 'MEDIUM';
      reasons.push('Cập nhật hợp đồng giao tiếp OpenAPI');
    }
  }

  return {
    blast_radius: level,
    auto_approve_allowed: level === 'LOW' || level === 'MEDIUM',
    requires_human_sign_off: level === 'HIGH' || level === 'CRITICAL',
    reasons
  };
}

if (process.argv[1]?.endsWith('calc-blast-radius.mjs')) {
  let changed = [];
  try {
    changed = execSync('git diff --name-only HEAD', { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
  } catch {
    changed = [];
  }
  const result = computeBlastRadius(changed);
  console.log(JSON.stringify(result, null, 2));
}

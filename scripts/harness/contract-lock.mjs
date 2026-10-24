import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SEALED_FILES = [
  'contracts/project-profile.json',
  'contracts/PRD_SPEC.md',
  'contracts/schema.prisma',
  'contracts/openapi.yaml',
  'contracts/ui-design-tokens.json',
  'contracts/traceability-spec.json'
];

const LOCK_PATHS = [
  '.agent/locks/contracts.sha256',
  '.antigravity/locks/contracts.sha256'
];

export function computeContractManifest(rootDir = process.cwd()) {
  const lines = [];
  for (const rel of SEALED_FILES) {
    const full = path.join(rootDir, rel);
    if (!fs.existsSync(full)) {
      throw new Error(`Thiếu tệp hợp đồng bắt buộc: ${rel}`);
    }
    const normalized = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n');
    const hash = crypto.createHash('sha256').update(normalized).digest('hex');
    lines.push(`${hash}  ${rel}`);
  }
  return lines.join('\n') + '\n';
}

export function sealContracts(rootDir = process.cwd()) {
  const manifest = computeContractManifest(rootDir);
  for (const lockRel of LOCK_PATHS) {
    const full = path.join(rootDir, lockRel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, manifest, 'utf8');
  }
  return manifest;
}

export function verifyContracts(rootDir = process.cwd()) {
  const lockFull = path.join(rootDir, LOCK_PATHS[0]);
  if (!fs.existsSync(lockFull)) {
    return { ok: false, reason: 'Chưa tìm thấy tệp khóa hợp đồng contracts.sha256' };
  }
  const expected = fs.readFileSync(lockFull, 'utf8').replace(/\r\n/g, '\n');
  const actual = computeContractManifest(rootDir);
  if (expected !== actual) {
    return { ok: false, reason: 'Hợp đồng kỹ thuật trong contracts/ đã bị sửa đổi trái phép mà không qua quy trình CCR!' };
  }
  return { ok: true };
}

if (process.argv[1]?.endsWith('contract-lock.mjs')) {
  const mode = process.argv[2] || '--verify';
  if (mode === '--seal') {
    sealContracts();
    console.log('✅ [CONTRACT LOCK] Đã niêm phong SHA-256 cho toàn bộ Hợp đồng kỹ thuật.');
  } else {
    const res = verifyContracts();
    if (!res.ok) {
      console.error(`🚨 [CONTRACT DRIFT BLOCKED] ${res.reason}`);
      process.exit(1);
    }
    console.log('✅ [CONTRACT LOCK] Chữ ký SHA-256 của Hợp đồng kỹ thuật khớp 100%.');
  }
}

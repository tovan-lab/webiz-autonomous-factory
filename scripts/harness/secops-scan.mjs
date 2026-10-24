import fs from 'node:fs';
import path from 'node:path';

const IGNORED_DIRS = new Set(['node_modules', '.next', 'dist', 'build', 'coverage', '.git', '.state']);

export function auditSqlMigration(sqlContent, relPath) {
  const issues = [];
  const isApprovedContract = /@migration-contract-approved:\s*[A-Z0-9-]+/i.test(sqlContent);
  const isDownScript = relPath.endsWith('_down.sql') || relPath.endsWith('.down.sql');

  const alwaysForbidden = [
    { name: 'DROP DATABASE / SCHEMA', rx: /\bDROP\s+(?:DATABASE|SCHEMA)\b/i },
    { name: 'TRUNCATE TABLE', rx: /\bTRUNCATE\s+TABLE\b/i },
    { name: 'Unbounded DELETE without WHERE', rx: /\bDELETE\s+FROM\s+[a-zA-Z0-9_"'.]+\s*;/i }
  ];

  for (const rule of alwaysForbidden) {
    if (rule.rx.test(sqlContent)) {
      issues.push({ ruleId: 'SQL-DESTRUCTIVE', file: relPath, detail: `Lệnh SQL nguy hiểm bị chặn: ${rule.name}` });
    }
  }

  if (!isDownScript && !isApprovedContract) {
    if (/\bDROP\s+(?:TABLE|COLUMN)\b/i.test(sqlContent)) {
      issues.push({
        ruleId: 'SQL-UNAPPROVED-DROP',
        file: relPath,
        detail: 'Phát hiện DROP TABLE/COLUMN trong migration tiến (up) mà không có xác nhận -- @migration-contract-approved: <TICKET>'
      });
    }
    if (/\bALTER\s+COLUMN\b[^;]*\bTYPE\b/i.test(sqlContent)) {
      issues.push({
        ruleId: 'SQL-UNSAFE-ALTER-TYPE',
        file: relPath,
        detail: 'ALTER COLUMN TYPE trực tiếp gây khóa bảng và mất dữ liệu; hãy dùng mẫu Expand-and-Contract.'
      });
    }
  }

  return issues;
}

export function scanSecretsInContent(content, relPath) {
  const issues = [];
  const secretPatterns = [
    { name: 'Private Key Block', rx: /BEGIN\s+(?:RSA|OPENSSH|EC|PGP|PRIVATE)\s+KEY/ },
    { name: 'AWS Access Key ID', rx: /\bAKIA[0-9A-Z]{16}\b/ },
    { name: 'Stripe Live/Test Secret Key', rx: /\b(?:sk|rk)_(?:live|test)_[0-9a-zA-Z]{20,}\b/ },
    { name: 'OpenAI / API Secret Key', rx: /\bsk-[a-zA-Z0-9_-]{20,}\b/ },
    { name: 'GitHub Token', rx: /\b(?:ghp|gho|ghu|ghs|ghr)_[0-9a-zA-Z]{30,}\b/ },
    { name: 'Google Cloud / Gemini API Key', rx: /\bAIza[0-9A-Za-z_-]{35}\b/ },
    { name: 'Hardcoded Database URI Credentials', rx: /(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[^:\s/]+:[^@\s/]+@[^\s/]+/i }
  ];

  for (const pat of secretPatterns) {
    if (pat.rx.test(content)) {
      issues.push({ ruleId: 'SEC-SECRET-LEAK', file: relPath, detail: `Phát hiện rò rỉ khóa bí mật: ${pat.name}` });
    }
  }
  return issues;
}

export function runSqlAndSecOpsAudit(rootDir = process.cwd()) {
  const issues = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      const rel = path.relative(rootDir, full).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        walk(full);
      } else {
        if (/^\.env(\.|$)/.test(entry.name) && entry.name !== '.env.example') {
          issues.push({ ruleId: 'SEC-ENV-FILE', file: rel, detail: 'Cấm lưu tệp .env thật trong kho mã nguồn!' });
        }
        const content = fs.readFileSync(full, 'utf8');
        issues.push(...scanSecretsInContent(content, rel));
        if (entry.name.endsWith('.sql')) {
          issues.push(...auditSqlMigration(content, rel));
        }
      }
    }
  }
  walk(path.join(rootDir, 'workspace'));
  return issues;
}

if (process.argv[1]?.endsWith('secops-scan.mjs')) {
  const issues = runSqlAndSecOpsAudit();
  if (issues.length > 0) {
    console.error('🚨 [SECOPS & SQL GUARD FAILED] Phát hiện vi phạm an toàn dữ liệu hoặc rò rỉ bí mật:');
    console.error(JSON.stringify(issues, null, 2));
    process.exit(1);
  }
  console.log('✅ [SECOPS & SQL GUARD] Không rò rỉ khóa bí mật, toàn bộ tệp SQL tuân thủ Expand-and-Contract.');
}


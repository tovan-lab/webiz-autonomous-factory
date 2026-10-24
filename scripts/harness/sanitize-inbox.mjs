import fs from 'node:fs';
import path from 'node:path';

const INBOX_FILES = ['inbox/PROJECT_BRIEF.md', 'inbox/AUDIT_OR_UPGRADE_REPORT.md'];

const INJECTION_PATTERNS = [
  { id: 'PI-001', name: 'System Prompt Override', regex: /ignore\s+(all\s+)?(previous|prior|system)\s+instructions/i },
  { id: 'PI-002', name: 'Shell Command Injection', regex: /(?:rm\s+-rf|curl\s+[^\n]*\|\s*(?:sh|bash)|wget\s+[^\n]*\|\s*(?:sh|bash)|Invoke-Expression|IEX\s*\()/i },
  { id: 'PI-003', name: 'Gate Bypass Directive', regex: /(?:inquisitor_approved\s*[:=]\s*true|--no-verify|skip\s+all\s+guardrails)/i },
  { id: 'PI-004', name: 'Hidden HTML Script/Comment Injection', regex: /<!--[^>]*?(?:system|ignore|exec|override|bash)[^>]*?-->/i }
];

export function scanInboxContent(content, filename = 'inbox') {
  const violations = [];
  for (const rule of INJECTION_PATTERNS) {
    if (rule.regex.test(content)) {
      violations.push({ ruleId: rule.id, name: rule.name, file: filename });
    }
  }
  return violations;
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('sanitize-inbox.mjs')) {
  let allViolations = [];
  for (const rel of INBOX_FILES) {
    const full = path.join(process.cwd(), rel);
    if (fs.existsSync(full)) {
      const content = fs.readFileSync(full, 'utf8');
      allViolations = allViolations.concat(scanInboxContent(content, rel));
    }
  }
  if (allViolations.length > 0) {
    console.error('🚨 [INBOX SECURITY BLOCK] Phát hiện dấu hiệu Prompt Injection trong inbox/:');
    console.error(JSON.stringify(allViolations, null, 2));
    process.exit(1);
  }
  console.log('✅ [INBOX SANITIZER] Tài liệu đầu vào trong inbox/ an toàn, không chứa mã độc điều khiển Agent.');
}

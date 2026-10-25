import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { initExternalState, STATE_DIR, recordDefect } from './state-manager.mjs';
import { scanInboxContent } from './sanitize-inbox.mjs';
import { verifyContracts } from './contract-lock.mjs';
import { walkAndAudit } from './ast-audit.mjs';
import { runSqlAndSecOpsAudit } from './secops-scan.mjs';
import { verifyTraceability } from './verify-traceability.mjs';

export function runFullVerification({ issueAttestation = false } = {}) {
  initExternalState();
  const root = process.cwd();
  const failures = [];

  // 1. Inbox Prompt Injection Check
  for (const rel of ['inbox/PROJECT_BRIEF.md', 'inbox/AUDIT_OR_UPGRADE_REPORT.md']) {
    const full = path.join(root, rel);
    if (fs.existsSync(full)) {
      const v = scanInboxContent(fs.readFileSync(full, 'utf8'), rel);
      if (v.length > 0) failures.push({ gate: 'INBOX_SANITIZER', details: v });
    }
  }

  // 2. Contract SHA-256 Lock Check
  const contractRes = verifyContracts(root);
  if (!contractRes.ok) {
    failures.push({ gate: 'CONTRACT_LOCK', details: contractRes.reason });
  }

  // 3. AST & Empty Test Audit
  const astIssues = walkAndAudit(root);
  if (astIssues.length > 0) {
    failures.push({ gate: 'AST_AND_TEST_AUDIT', details: astIssues });
  }

  // 4. SQL Migration & Secret Scan
  const secIssues = runSqlAndSecOpsAudit(root);
  if (secIssues.length > 0) {
    failures.push({ gate: 'SECOPS_AND_SQL_GUARD', details: secIssues });
  }

  // 5. Traceability Matrix Verification
  const traceRes = verifyTraceability(root);
  if (!traceRes.ok) {
    failures.push({ gate: 'TRACEABILITY_MATRIX', details: traceRes.errors });
  }

  // 6. Human Gate Verification (contracts/HUMAN_SIGN_OFF.json)
  const signOffPath = path.join(root, 'contracts/HUMAN_SIGN_OFF.json');
  let humanSignOff = null;
  if (!fs.existsSync(signOffPath)) {
    failures.push({ gate: 'HUMAN_SIGN_OFF_GATE', details: 'Thiếu tệp bắt buộc contracts/HUMAN_SIGN_OFF.json' });
  } else {
    try {
      const raw = fs.readFileSync(signOffPath, 'utf8');
      humanSignOff = JSON.parse(raw);
      if (humanSignOff.prd_approved !== true) {
        failures.push({ gate: 'HUMAN_SIGN_OFF_GATE', details: 'Cổng PRD chưa được con người phê duyệt (prd_approved !== true)' });
      }
      if (!humanSignOff.approved_by || typeof humanSignOff.approved_by !== 'string' || !humanSignOff.approved_by.trim()) {
        failures.push({ gate: 'HUMAN_SIGN_OFF_GATE', details: 'Thiếu thông tin người phê duyệt hợp lệ (approved_by)' });
      }
      if (!humanSignOff.timestamp || isNaN(Date.parse(humanSignOff.timestamp))) {
        failures.push({ gate: 'HUMAN_SIGN_OFF_GATE', details: 'Dấu thời gian phê duyệt (timestamp) không hợp lệ' });
      }
    } catch (e) {
      failures.push({ gate: 'HUMAN_SIGN_OFF_GATE', details: `Tệp contracts/HUMAN_SIGN_OFF.json không đúng định dạng JSON: ${e.message}` });
    }
  }

  if (failures.length > 0) {
    for (const f of failures) {
      recordDefect('pipeline-verifier', 'BLOCKER', f.gate, 'contracts/HUMAN_SIGN_OFF.json', typeof f.details === 'string' ? f.details : JSON.stringify(f.details));
    }
    return { ok: false, failures };
  }

  let receipt = null;
  if (issueAttestation) {
    let headSha = 'uncommitted-worktree';
    try {
      headSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {}
    const lockContent = fs.readFileSync(path.join(root, '.agent/locks/contracts.sha256'), 'utf8');
    const traceContent = fs.readFileSync(path.join(root, 'inquisitor-vault/traceability-status.json'), 'utf8');
    const signOffContent = fs.readFileSync(signOffPath, 'utf8');
    const signature = crypto
      .createHash('sha256')
      .update(`${headSha}|${lockContent}|${traceContent}|${signOffContent}`)
      .digest('hex');

    receipt = {
      schema_version: '4.0.0',
      inquisitor_approved: true,
      human_approved: true,
      approved_by: humanSignOff?.approved_by || 'Unknown',
      git_head_sha: headSha,
      attestation_signature_sha256: signature,
      verified_at: new Date().toISOString()
    };
    fs.writeFileSync(path.join(STATE_DIR, 'attestation.receipt.json'), JSON.stringify(receipt, null, 2), 'utf8');
  }

  return { ok: true, receipt };
}

if (process.argv[1]?.endsWith('verify-pipeline.mjs')) {
  const issueAttestation = process.argv.includes('--attest');
  const res = runFullVerification({ issueAttestation });
  if (!res.ok) {
    console.error('🚨 [PIPELINE VERIFICATION FAILED] Hệ thống cưỡng chế chặn bàn giao:');
    console.error(JSON.stringify(res.failures, null, 2));
    process.exit(1);
  }
  console.log('✅ [PIPELINE VERIFIED 100%] Toàn bộ 5 tầng cưỡng chế kỹ thuật đều đạt chuẩn tuyệt đối.');
  if (res.receipt) {
    console.log(`🔐 [CRYPTOGRAPHIC ATTESTATION] Đã cấp biên nhận nghiệm thu: ${res.receipt.attestation_signature_sha256}`);
  }
}

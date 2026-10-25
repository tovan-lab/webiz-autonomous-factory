import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const ROOT = process.cwd();
export const STATE_DIR = path.join(ROOT, '.git', 'webiz-state');

export function initExternalState() {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  const cbPath = path.join(STATE_DIR, 'circuit-breaker.json');
  if (!fs.existsSync(cbPath)) {
    fs.writeFileSync(cbPath, JSON.stringify({
      schema_version: '4.0.0',
      max_retries_per_fingerprint: 3,
      status: 'CLOSED_HEALTHY',
      fingerprints: {}
    }, null, 2), 'utf8');
  }

  const rejPath = path.join(STATE_DIR, 'rejection-log.json');
  if (!fs.existsSync(rejPath)) {
    fs.writeFileSync(rejPath, JSON.stringify({
      schema_version: '4.0.0',
      active_blockers: [],
      history: []
    }, null, 2), 'utf8');
  }
}

export function computeDefectFingerprint(agent, ruleId, relFilePath) {
  const norm = relFilePath.replace(/\\/g, '/').toLowerCase();
  return crypto.createHash('sha256').update(`${agent}:${ruleId}:${norm}`).digest('hex').slice(0, 16);
}

export function recordDefect(agent, severity, ruleId, relFilePath, detail) {
  initExternalState();
  if (severity === 'MINOR') {
    const backlogPath = path.join(ROOT, 'BACKLOG.md');
    const line = `- [MINOR][${new Date().toISOString()}] (${agent} | ${ruleId} | ${relFilePath}): ${detail}\n`;
    fs.appendFileSync(backlogPath, line, 'utf8');
    return { action: 'LOGGED_TO_BACKLOG', retryCount: 0 };
  }

  const fp = computeDefectFingerprint(agent, ruleId, relFilePath);
  const cbPath = path.join(STATE_DIR, 'circuit-breaker.json');
  const cb = JSON.parse(fs.readFileSync(cbPath, 'utf8'));
  const current = cb.fingerprints[fp] || { count: 0, agent, ruleId, file: relFilePath };
  current.count += 1;
  current.last_seen = new Date().toISOString();
  cb.fingerprints[fp] = current;

  if (current.count >= cb.max_retries_per_fingerprint) {
    cb.status = 'OPEN_ESCALATED_TO_ARCHITECT';
  }
  fs.writeFileSync(cbPath, JSON.stringify(cb, null, 2), 'utf8');

  const rejPath = path.join(STATE_DIR, 'rejection-log.json');
  const rej = JSON.parse(fs.readFileSync(rejPath, 'utf8'));
  const entry = {
    fingerprint: fp,
    severity,
    target_agent: agent,
    rule_id: ruleId,
    file: relFilePath,
    detail,
    attempt: current.count,
    timestamp: new Date().toISOString()
  };
  rej.active_blockers.push(entry);
  rej.history.push(entry);
  fs.writeFileSync(rejPath, JSON.stringify(rej, null, 2), 'utf8');

  return {
    action: current.count >= cb.max_retries_per_fingerprint ? 'CIRCUIT_BREAKER_TRIPPED' : 'REJECTED_FOR_REWORK',
    fingerprint: fp,
    retryCount: current.count
  };
}

if (process.argv[1]?.endsWith('state-manager.mjs')) {
  initExternalState();
  const mode = process.argv[2] || '--status';
  const cbPath = path.join(STATE_DIR, 'circuit-breaker.json');
  const rejPath = path.join(STATE_DIR, 'rejection-log.json');

  if (mode === '--status') {
    const cb = JSON.parse(fs.readFileSync(cbPath, 'utf8'));
    const rej = JSON.parse(fs.readFileSync(rejPath, 'utf8'));
    console.log('📊 [CIRCUIT BREAKER STATUS]');
    console.log(`- Trạng thái cầu chì: ${cb.status}`);
    console.log(`- Số lỗi đang theo dõi: ${Object.keys(cb.fingerprints).length}`);
    console.log(`- Active Blockers: ${rej.active_blockers.length}`);
    console.log(JSON.stringify(cb, null, 2));
  } else if (mode === '--reset') {
    fs.writeFileSync(cbPath, JSON.stringify({
      schema_version: '4.0.0',
      max_retries_per_fingerprint: 3,
      status: 'CLOSED_HEALTHY',
      fingerprints: {}
    }, null, 2), 'utf8');
    fs.writeFileSync(rejPath, JSON.stringify({
      schema_version: '4.0.0',
      active_blockers: [],
      history: []
    }, null, 2), 'utf8');
    console.log('🔄 [CIRCUIT BREAKER RESET] Đã đặt lại trạng thái cầu chì về CLOSED_HEALTHY.');
  }
}

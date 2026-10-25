import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { initExternalState, STATE_DIR } from './state-manager.mjs';

export function createCheckpoint(stageName, agentName, rootDir = process.cwd()) {
  initExternalState();
  const timestamp = new Date().toISOString();

  let headSha = 'uncommitted';
  try {
    headSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch {}

  const checkpointFile = path.join(STATE_DIR, 'checkpoints.json');
  let checkpoints = [];
  if (fs.existsSync(checkpointFile)) {
    try {
      checkpoints = JSON.parse(fs.readFileSync(checkpointFile, 'utf8'));
    } catch {}
  }

  const record = {
    stage: stageName,
    agent: agentName,
    head_sha: headSha,
    timestamp
  };
  checkpoints.push(record);

  fs.writeFileSync(checkpointFile, JSON.stringify(checkpoints, null, 2), 'utf8');

  // Thử tạo tag nếu có git repository
  try {
    const tagName = `webiz-${stageName}`;
    execSync(`git tag -f -a "${tagName}" -m "Checkpoint ${stageName} by ${agentName} at ${timestamp}"`, { stdio: 'ignore' });
  } catch {}

  return record;
}

if (process.argv[1]?.endsWith('checkpoint.mjs')) {
  const stage = process.argv[2];
  const agent = process.argv[3] || 'system';

  if (!stage) {
    console.log('ℹ️ Cú pháp: node scripts/harness/checkpoint.mjs <stage-name> [agent-name]');
    process.exit(1);
  }

  const record = createCheckpoint(stage, agent);
  console.log(`📌 [CHECKPOINT CREATED] Đã đóng dấu mốc [${record.stage}] do [${record.agent}] thực thi tại ${record.timestamp}`);
}

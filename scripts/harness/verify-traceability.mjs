import fs from 'node:fs';
import path from 'node:path';

export function verifyTraceability(rootDir = process.cwd()) {
  const specPath = path.join(rootDir, 'contracts/traceability-spec.json');
  const statusPath = path.join(rootDir, 'inquisitor-vault/traceability-status.json');

  if (!fs.existsSync(specPath) || !fs.existsSync(statusPath)) {
    return { ok: false, errors: ['Thiếu tệp traceability-spec.json hoặc traceability-status.json'] };
  }

  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
  const errors = [];

  const minReq = spec.min_requirements ?? 1;
  if (!Array.isArray(spec.requirements) || spec.requirements.length < minReq) {
    errors.push(`Ma trận yêu cầu rỗng hoặc chưa đủ số lượng tối thiểu (${spec.requirements?.length || 0} < ${minReq})`);
  }

  const statusMap = new Map((status.verifications || []).map((v) => [v.req_id, v]));

  for (const req of spec.requirements || []) {
    const v = statusMap.get(req.id);
    if (!v) {
      errors.push(`Yêu cầu [${req.id}] chưa có bản ghi kiểm chứng trong traceability-status.json`);
      continue;
    }
    if (v.status !== 'VERIFIED') {
      errors.push(`Yêu cầu [${req.id}] chưa đạt trạng thái VERIFIED (hiện tại: ${v.status})`);
    }
    const testFull = path.join(rootDir, v.test_file || '');
    if (!v.test_file || !fs.existsSync(testFull)) {
      errors.push(`Yêu cầu [${req.id}] trỏ tới tệp kiểm thử không tồn tại: ${v.test_file}`);
    } else {
      const testContent = fs.readFileSync(testFull, 'utf8');
      if (!testContent.includes(req.id)) {
        errors.push(`Tệp kiểm thử [${v.test_file}] không chứa mã định danh yêu cầu [${req.id}]`);
      }
      if (!/\b(?:expect|assert)\b/.test(testContent)) {
        errors.push(`Tệp kiểm thử [${v.test_file}] không chứa bất kỳ lệnh kiểm chứng expect()/assert nào!`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

if (process.argv[1]?.endsWith('verify-traceability.mjs')) {
  const res = verifyTraceability();
  if (!res.ok) {
    console.error('🚨 [TRACEABILITY AUDIT FAILED] Ma trận nghiệm thu không hợp lệ:');
    res.errors.forEach((e) => console.error('  - ' + e));
    process.exit(1);
  }
  console.log('✅ [TRACEABILITY AUDIT] Mọi yêu cầu trong hợp đồng đều có bài kiểm thử thực tế và đạt chuẩn VERIFIED.');
}

import fs from 'node:fs';
import path from 'node:path';

const IGNORED_DIRS = new Set(['node_modules', '.next', 'dist', 'build', 'coverage', '.git', '.state']);
const CODE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);

function stripStringsAndCommentsKeepDirectives(source) {
  // Giữ lại các comment chứa chỉ thị cấm (@ts-ignore, eslint-disable, TODO, FIXME) nhưng xóa chuỗi ký tự thông thường
  return source.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, '""');
}

export function auditSourceCode(content, relPath) {
  const issues = [];
  const directiveRegex = /(?:@ts-ignore|@ts-nocheck|eslint-disable|\bTODO\b|\bFIXME\b|\bHACK\b)/;
  if (directiveRegex.test(content)) {
    issues.push({ ruleId: 'AST-DIRECTIVE', file: relPath, detail: 'Phát hiện chỉ thị bị cấm (@ts-ignore, @ts-nocheck, eslint-disable, TODO, FIXME, HACK)' });
  }

  const stripped = stripStringsAndCommentsKeepDirectives(content)
    .replace(/\/\*(?!.*(?:@ts-|eslint-))[\s\S]*?\*\//g, '')
    .replace(/\/\/(?!.*(?:@ts-|eslint-|TODO|FIXME)).*/g, '');

  const typeEvasionPatterns = [
    { name: 'Explicit any (: any)', rx: /:\s*any\b/ },
    { name: 'Type assertion (as any)', rx: /\bas\s+any\b/ },
    { name: 'Double cast (as unknown as)', rx: /\bas\s+unknown\s+as\b/ },
    { name: 'Generic any (Array<any> / Record<..., any> / Promise<any>)', rx: /\b(?:Array|Record|Promise|Map|Set)<[^>]*\bany\b[^>]*>/ }
  ];

  for (const pat of typeEvasionPatterns) {
    if (pat.rx.test(stripped)) {
      issues.push({ ruleId: 'AST-TYPE-SAFETY', file: relPath, detail: `Vi phạm an toàn kiểu dữ liệu: ${pat.name}` });
    }
  }

  const testTamperRx = /\b(?:it|test|describe)\.(?:skip|only|todo)\s*\(|\b(?:xit|xdescribe|fit|fdescribe)\s*\(/;
  if (testTamperRx.test(stripped)) {
    issues.push({ ruleId: 'AST-TEST-TAMPER', file: relPath, detail: 'Phát hiện hành vi vô hiệu hóa bài kiểm thử (.skip, .only, .todo, xit, xdescribe)' });
  }

  // Phát hiện bài kiểm thử rỗng không có mệnh đề kiểm chứng (expect / assert)
  if (relPath.includes('.spec.') || relPath.includes('.test.')) {
    const testBlockRx = /\b(?:it|test)\s*\(\s*""\s*,\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g;
    let match;
    while ((match = testBlockRx.exec(stripped)) !== null) {
      const body = match[1].trim();
      if (!body || !/\b(?:expect|assert|expectTypeOf)\b/.test(body)) {
        issues.push({ ruleId: 'AST-EMPTY-TEST', file: relPath, detail: 'Phát hiện hàm kiểm thử it()/test() rỗng hoặc không chứa mệnh đề expect()/assert!' });
      }
    }
  }

  return issues;
}

export function walkAndAudit(rootDir = process.cwd(), targetDirs = ['workspace', 'inquisitor-vault']) {
  const allIssues = [];
  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const full = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (CODE_EXTS.has(path.extname(entry.name))) {
        const rel = path.relative(rootDir, full).replace(/\\/g, '/');
        const content = fs.readFileSync(full, 'utf8');
        allIssues.push(...auditSourceCode(content, rel));
      }
    }
  }
  targetDirs.forEach((d) => walk(path.join(rootDir, d)));
  return allIssues;
}

if (process.argv[1]?.endsWith('ast-audit.mjs')) {
  const issues = walkAndAudit();
  if (issues.length > 0) {
    console.error('🚨 [AST & TEST AUDIT FAILED] Phát hiện vi phạm chất lượng mã nguồn hoặc bài kiểm thử:');
    console.error(JSON.stringify(issues, null, 2));
    process.exit(1);
  }
  console.log('✅ [AST & TEST AUDIT] Mã nguồn sạch 100%, an toàn kiểu tuyệt đối và mọi bài test đều có assertion thực tế.');
}

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('REQ-011: Single-Canvas WebGL & Mobile-First 3D Performance Guardrails', () => {
  it('enforces single-canvas rule and 1.8MB payload cap in design tokens (REQ-011)', () => {
    const tokensPath = path.join(process.cwd(), 'contracts/ui-design-tokens.json');
    const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

    expect(tokens.spatial_3d_engine.single_canvas_rule).toBe(true);
    expect(tokens.spatial_3d_engine.max_initial_payload_bytes).toBeLessThanOrEqual(1887436); // <= 1.8 MB
    expect(tokens.spatial_3d_engine.canvas_dpr).toEqual([1, 1.5]);
    expect(tokens.spatial_3d_engine.compression_formats).toContain('draco');
  });
});

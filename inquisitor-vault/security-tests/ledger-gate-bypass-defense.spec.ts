import { describe, it, expect } from 'vitest';
import { transitionProjectStage } from '../../workspace/backend/src/projects.service';

describe('SEC-002: Ledger Gate Bypass Defense (Deposit & Handover Locks)', () => {
  it('blocks transition to IN_PRODUCTION when 50% deposit has not been paid', () => {
    const result = transitionProjectStage('prj_iron_01', 'IN_PRODUCTION');

    expect('status' in result).toBe(true);
    if ('status' in result) {
      expect(result.status).toBe(409);
      expect(result.type).toBe('https://webiz.vn/errors/ledger-gate-conflict');
      expect(result.detail).toContain('Chặn sản xuất: Chưa xác nhận thanh toán cọc 50%');
    }
  });

  it('blocks transition to DELIVERED_PAID_100 when final 50% has not been paid', () => {
    const result = transitionProjectStage('prj_iron_01', 'DELIVERED_PAID_100');

    expect('status' in result).toBe(true);
    if ('status' in result) {
      expect(result.status).toBe(409);
      expect(result.type).toBe('https://webiz.vn/errors/handover-gate-conflict');
      expect(result.detail).toContain('Chặn bàn giao: Chưa xác nhận thu đủ 100%');
    }
  });
});

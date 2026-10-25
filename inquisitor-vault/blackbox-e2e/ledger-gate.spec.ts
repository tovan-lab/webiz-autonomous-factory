import { describe, it, expect } from 'vitest';
import {
  transitionProjectStage,
  recordDepositPayment,
  recordFinalPayment,
  getProject
} from '../../workspace/backend/src/projects.service';

describe('REQ-005: CRM 9-Stage Pipeline & Strict Ledger Gate Enforcement', () => {
  it('blocks transition to IN_PRODUCTION without deposit50PaidAt (REQ-005)', () => {
    const res = transitionProjectStage('prj_iron_01', 'IN_PRODUCTION');
    expect('status' in res).toBe(true);
    if ('status' in res) {
      expect(res.status).toBe(409);
      expect(res.detail).toContain('Chưa xác nhận thanh toán cọc 50%');
    }
  });

  it('allows transition to IN_PRODUCTION after 50% deposit confirmation (REQ-005)', () => {
    recordDepositPayment('prj_iron_01');
    const project = getProject('prj_iron_01');
    expect(project?.deposit50PaidAt).not.toBeNull();

    const res = transitionProjectStage('prj_iron_01', 'IN_PRODUCTION');
    expect('currentStage' in res).toBe(true);
    if ('currentStage' in res) {
      expect(res.currentStage).toBe('IN_PRODUCTION');
    }
  });

  it('blocks transition to DELIVERED_PAID_100 without final 50% payment (REQ-005)', () => {
    const res = transitionProjectStage('prj_iron_01', 'DELIVERED_PAID_100');
    expect('status' in res).toBe(true);
    if ('status' in res) {
      expect(res.status).toBe(409);
      expect(res.detail).toContain('Chưa xác nhận thu đủ 100%');
    }
  });

  it('allows transition to DELIVERED_PAID_100 after 100% payment (REQ-005)', () => {
    recordFinalPayment('prj_iron_01');
    const res = transitionProjectStage('prj_iron_01', 'DELIVERED_PAID_100');
    expect('currentStage' in res).toBe(true);
    if ('currentStage' in res) {
      expect(res.currentStage).toBe('DELIVERED_PAID_100');
    }
  });
});

import { describe, it, expect } from 'vitest';
import { recordConsent, getConsentAuditHistory } from '../../workspace/backend/src/compliance.service';

describe('REQ-010: Decree 13/2023/ND-CP Personal Data Consent Compliance', () => {
  it('records explicit consent into audit log with timestamp and subject identifier (REQ-010)', () => {
    const res = recordConsent({
      subjectId: '0912345678',
      consentType: 'GYM_LEAD_REGISTRATION',
      granted: true,
      dataCategories: 'PHONE,NAME,BMI'
    });

    expect('id' in res).toBe(true);
    if ('id' in res) {
      expect(res.granted).toBe(true);
      expect(res.subjectId).toBe('0912345678');
      expect(res.recordedAt).toBeDefined();
    }

    const history = getConsentAuditHistory('0912345678');
    expect(history.length).toBeGreaterThanOrEqual(1);
  });

  it('rejects incomplete consent requests with RFC 9457 Problem Details (REQ-010)', () => {
    const badRes = recordConsent({
      subjectId: '',
      consentType: '',
      granted: true
    });
    expect('status' in badRes).toBe(true);
    if ('status' in badRes) {
      expect(badRes.status).toBe(400);
      expect(badRes.title).toBe('Invalid Consent Request');
    }
  });
});

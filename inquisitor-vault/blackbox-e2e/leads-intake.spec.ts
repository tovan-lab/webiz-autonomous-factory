import { describe, it, expect } from 'vitest';
import { intakeLead } from '../../workspace/backend/src/leads.service';

describe('REQ-004: Lead Intake, Auto-Classification & Dynamic Sandbox Brand Config', () => {
  it('processes valid lead and generates dynamic sandboxBrandConfig (REQ-004)', () => {
    const res = intakeLead({
      fullName: 'Trần Văn Nam',
      phoneNumber: '0988776655',
      brandName: 'Titan Gym & Yoga',
      sourceChannel: 'FACEBOOK_MESSENGER',
      industry: 'GYM_FITNESS'
    });

    expect('leadId' in res).toBe(true);
    if ('leadId' in res) {
      expect(res.suggestedTier).toBe('GROWTH_AI');
      expect(res.sandboxPreviewUrl).toContain('brand=Titan');
      expect(res.sandboxBrandConfig.brandName).toBe('Titan Gym & Yoga');
      expect(res.sandboxBrandConfig.primaryColor).toBe('#0DEEF3');
    }
  });
});

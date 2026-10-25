import { describe, it, expect } from 'vitest';
import { consumeChatbotMessage, setChatbotQuota } from '../../workspace/backend/src/chatbot-quota.service';

describe('SEC-003: Chatbot Hard-Cap LLM Quota Protection', () => {
  it('enforces hard-cap lockout when quota limit is reached', () => {
    setChatbotQuota({
      id: 'quota_test_cap',
      projectId: 'prj_test_cap',
      monthlyMessageLimit: 2,
      messagesUsed: 2,
      topUpBalanceMessages: 0,
      hardCapReached: true,
      resetAt: new Date().toISOString()
    });

    const res = consumeChatbotMessage('prj_test_cap');
    expect('status' in res).toBe(true);
    if ('status' in res) {
      expect(res.status).toBe(429);
      expect(res.type).toBe('https://webiz.vn/errors/chatbot-hard-cap-reached');
      expect(res.detail).toContain('Hard-Cap');
    }
  });
});

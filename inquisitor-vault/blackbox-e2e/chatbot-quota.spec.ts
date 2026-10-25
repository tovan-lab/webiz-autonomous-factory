import { describe, it, expect } from 'vitest';
import {
  consumeChatbotMessage,
  getChatbotQuota,
  topUpChatbotQuota,
  setChatbotQuota
} from '../../workspace/backend/src/chatbot-quota.service';

describe('REQ-007: Tenant Chatbot Quota & Strict Hard-Cap Lockout', () => {
  it('manages baseline quota and tracks consumption (REQ-007)', () => {
    const quota = getChatbotQuota('prj_e2e_quota');
    expect(quota.monthlyMessageLimit).toBe(3000);

    const res = consumeChatbotMessage('prj_e2e_quota');
    expect('allowed' in res).toBe(true);
    if ('allowed' in res) {
      expect(res.allowed).toBe(true);
      expect(res.messagesUsed).toBe(1);
    }
  });

  it('triggers hard-cap lockout when limit is touched and unlocks upon top-up (REQ-007)', () => {
    setChatbotQuota({
      id: 'quota_capped',
      projectId: 'prj_capped',
      monthlyMessageLimit: 1,
      messagesUsed: 1,
      topUpBalanceMessages: 0,
      hardCapReached: true,
      resetAt: new Date().toISOString()
    });

    const blocked = consumeChatbotMessage('prj_capped');
    expect('status' in blocked).toBe(true);
    if ('status' in blocked) {
      expect(blocked.status).toBe(429);
      expect(blocked.title).toBe('Chatbot Quota Hard-Cap Exceeded');
    }

    // Top-up adds 5,000 messages and unlocks
    const toppedUp = topUpChatbotQuota('prj_capped', 5000);
    expect(toppedUp.hardCapReached).toBe(false);
    expect(toppedUp.topUpBalanceMessages).toBe(5000);

    const allowedAgain = consumeChatbotMessage('prj_capped');
    expect('allowed' in allowedAgain).toBe(true);
  });
});

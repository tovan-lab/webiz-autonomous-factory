// Tenant Chatbot Quota & Hard-Cap Lockout Service
// Meets REQ-007: Tenant Chatbot Quota & Strict Hard-Cap Lockout

import { createProblemDetails, ProblemDetailsRFC9457 } from './health.service';

export interface ChatbotQuotaEntity {
  id: string;
  projectId: string;
  monthlyMessageLimit: number;
  messagesUsed: number;
  topUpBalanceMessages: number;
  hardCapReached: boolean;
  resetAt: string;
}

export interface ChatbotConsumeResult {
  allowed: boolean;
  messagesUsed: number;
  totalLimit: number;
  remainingMessages: number;
  hardCapReached: boolean;
}

const quotaStore = new Map<string, ChatbotQuotaEntity>([
  [
    'prj_iron_01',
    {
      id: 'quota_iron_01',
      projectId: 'prj_iron_01',
      monthlyMessageLimit: 3000,
      messagesUsed: 120,
      topUpBalanceMessages: 0,
      hardCapReached: false,
      resetAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
    }
  ]
]);

export function getChatbotQuota(projectId: string): ChatbotQuotaEntity {
  let quota = quotaStore.get(projectId);
  if (!quota) {
    quota = {
      id: `quota_${projectId}`,
      projectId,
      monthlyMessageLimit: 3000,
      messagesUsed: 0,
      topUpBalanceMessages: 0,
      hardCapReached: false,
      resetAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
    };
    quotaStore.set(projectId, quota);
  }
  return { ...quota };
}

export function setChatbotQuota(quota: ChatbotQuotaEntity): void {
  quotaStore.set(quota.projectId, { ...quota });
}

export function topUpChatbotQuota(projectId: string, additionalMessages: number = 5000): ChatbotQuotaEntity {
  const quota = getChatbotQuota(projectId);
  quota.topUpBalanceMessages += additionalMessages;
  const totalLimit = quota.monthlyMessageLimit + quota.topUpBalanceMessages;
  if (quota.messagesUsed < totalLimit) {
    quota.hardCapReached = false;
  }
  quotaStore.set(projectId, quota);
  return { ...quota };
}

export function consumeChatbotMessage(projectId: string): ChatbotConsumeResult | ProblemDetailsRFC9457 {
  const quota = getChatbotQuota(projectId);
  const totalLimit = quota.monthlyMessageLimit + quota.topUpBalanceMessages;

  if (quota.messagesUsed >= totalLimit || quota.hardCapReached) {
    quota.hardCapReached = true;
    quotaStore.set(projectId, quota);

    return createProblemDetails({
      status: 429,
      type: 'https://webiz.vn/errors/chatbot-hard-cap-reached',
      title: 'Chatbot Quota Hard-Cap Exceeded',
      detail:
        'Hạn mức tin nhắn AI trong tháng đã chạm trần (Hard-Cap). Để bảo vệ ngân sách, hệ thống tạm ngắt gọi LLM. Vui lòng nạp thêm gói 100k = 5.000 tin nhắn.',
      instance: `/api/v1/projects/${projectId}/chatbot/consume`,
      traceId: `trace-quota-cap-${projectId}`
    });
  }

  quota.messagesUsed += 1;
  if (quota.messagesUsed >= totalLimit) {
    quota.hardCapReached = true;
  }
  quotaStore.set(projectId, quota);

  return {
    allowed: true,
    messagesUsed: quota.messagesUsed,
    totalLimit,
    remainingMessages: totalLimit - quota.messagesUsed,
    hardCapReached: quota.hardCapReached
  };
}

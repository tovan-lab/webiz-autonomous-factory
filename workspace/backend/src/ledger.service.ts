// Deterministic Accounting Ledger & Monthly Budget Guard Service
// Meets REQ-006: Deterministic Accounting Ledger & Monthly 1M Operating Expense Cap Guard

import { createProblemDetails, ProblemDetailsRFC9457 } from './health.service';

export type LedgerEntryType =
  | 'REVENUE_SETUP_DEPOSIT_50'
  | 'REVENUE_SETUP_FINAL_50'
  | 'REVENUE_MONTHLY_RETAINER'
  | 'REVENUE_CHATBOT_TOPUP'
  | 'EXPENSE_AI_API'
  | 'EXPENSE_INFRA_HOSTING';

export interface LedgerTransaction {
  id: string;
  projectId?: string;
  entryType: LedgerEntryType;
  amountVnd: number;
  description: string;
  referenceCode?: string;
  payerOrVendor: string;
  occurredAt: string;
}

export interface LedgerSummaryResponse {
  monthYear: string;
  totalRevenueVnd: number;
  totalExpenseVnd: number;
  expenseCapVnd: number;
  warningThresholdVnd: number;
  annualCumulativeRevenueVnd: number;
  annualRevenueCapVnd: number;
  isWarningTriggered: boolean;
  isHardCapExceeded: boolean;
  activeAlertCount: number;
}

const transactionsStore: LedgerTransaction[] = [
  {
    id: 'tx_01',
    projectId: 'prj_demo_00',
    entryType: 'REVENUE_SETUP_DEPOSIT_50',
    amountVnd: 2950000,
    description: 'Thu cọc 50% gói Growth AI',
    referenceCode: 'VQR-202610-01',
    payerOrVendor: 'Gym Thể Lực Vàng',
    occurredAt: '2026-10-15T09:00:00.000Z'
  },
  {
    id: 'tx_02',
    projectId: 'prj_demo_00',
    entryType: 'REVENUE_SETUP_FINAL_50',
    amountVnd: 2950000,
    description: 'Thu 50% hoàn tất bàn giao',
    referenceCode: 'VQR-202610-02',
    payerOrVendor: 'Gym Thể Lực Vàng',
    occurredAt: '2026-10-20T14:30:00.000Z'
  },
  {
    id: 'tx_03',
    entryType: 'EXPENSE_AI_API',
    amountVnd: 210000,
    description: 'Thanh toán token LLM Gemini & DeepSeek',
    referenceCode: 'INV-AI-202610',
    payerOrVendor: 'Google Cloud Platform',
    occurredAt: '2026-10-22T08:00:00.000Z'
  },
  {
    id: 'tx_04',
    entryType: 'EXPENSE_INFRA_HOSTING',
    amountVnd: 140000,
    description: 'Thanh toán máy chủ & tên miền Vercel / Cloudflare',
    referenceCode: 'INV-INFRA-202610',
    payerOrVendor: 'Vercel Inc.',
    occurredAt: '2026-10-23T10:00:00.000Z'
  }
];

export function getLedgerTransactions(): LedgerTransaction[] {
  return [...transactionsStore];
}

export function createLedgerTransaction(data: {
  projectId?: string;
  entryType: LedgerEntryType;
  amountVnd: number;
  description: string;
  referenceCode?: string;
  payerOrVendor: string;
}): LedgerTransaction | ProblemDetailsRFC9457 {
  if (data.amountVnd <= 0) {
    return createProblemDetails({
      status: 400,
      title: 'Invalid Amount',
      detail: 'Số tiền giao dịch phải lớn hơn 0 VNĐ',
      instance: '/api/v1/ledger/transactions',
      traceId: `trace-tx-amt-${Date.now()}`
    });
  }

  const newTx: LedgerTransaction = {
    id: `tx_${Date.now().toString(36)}`,
    projectId: data.projectId,
    entryType: data.entryType,
    amountVnd: data.amountVnd,
    description: data.description,
    referenceCode: data.referenceCode,
    payerOrVendor: data.payerOrVendor,
    occurredAt: new Date().toISOString()
  };

  transactionsStore.push(newTx);
  return newTx;
}

export function getLedgerSummary(monthYear: string = '2026-10'): LedgerSummaryResponse {
  let totalRevenueVnd = 0;
  let totalExpenseVnd = 0;

  for (const tx of transactionsStore) {
    if (tx.occurredAt.startsWith(monthYear)) {
      if (tx.entryType.startsWith('REVENUE_')) {
        totalRevenueVnd += tx.amountVnd;
      } else if (tx.entryType.startsWith('EXPENSE_')) {
        totalExpenseVnd += tx.amountVnd;
      }
    }
  }

  const expenseCapVnd = 1000000;
  const warningThresholdVnd = 700000;
  const annualCumulativeRevenueVnd = 42000000 + totalRevenueVnd;
  const annualRevenueCapVnd = 1000000000;

  const isWarningTriggered = totalExpenseVnd >= warningThresholdVnd;
  const isHardCapExceeded = totalExpenseVnd >= expenseCapVnd;

  return {
    monthYear,
    totalRevenueVnd,
    totalExpenseVnd,
    expenseCapVnd,
    warningThresholdVnd,
    annualCumulativeRevenueVnd,
    annualRevenueCapVnd,
    isWarningTriggered,
    isHardCapExceeded,
    activeAlertCount: isHardCapExceeded ? 2 : isWarningTriggered ? 1 : 0
  };
}

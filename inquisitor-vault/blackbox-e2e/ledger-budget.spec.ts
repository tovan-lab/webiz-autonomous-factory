import { describe, it, expect } from 'vitest';
import { getLedgerSummary, createLedgerTransaction } from '../../workspace/backend/src/ledger.service';

describe('REQ-006: Deterministic Accounting Ledger & Monthly 1M Operating Expense Cap Guard', () => {
  it('monitors monthly operating budget against 1M ceiling and 700k warning (REQ-006)', () => {
    const summary = getLedgerSummary('2026-10');
    expect(summary.expenseCapVnd).toBe(1000000);
    expect(summary.warningThresholdVnd).toBe(700000);
    expect(summary.totalExpenseVnd).toBeLessThanOrEqual(1000000);
    expect(summary.annualRevenueCapVnd).toBe(1000000000);
  });

  it('records real ledger transactions and validates positive amounts (REQ-006)', () => {
    const invalidTx = createLedgerTransaction({
      entryType: 'EXPENSE_AI_API',
      amountVnd: -50000,
      description: 'Lệnh chi âm không hợp lệ',
      payerOrVendor: 'Test Vendor'
    });
    expect('status' in invalidTx).toBe(true);

    const validTx = createLedgerTransaction({
      entryType: 'REVENUE_MONTHLY_RETAINER',
      amountVnd: 490000,
      description: 'Thu phí duy trì tháng 10 gói Growth AI',
      payerOrVendor: 'Iron House Fitness'
    });
    expect('amountVnd' in validTx).toBe(true);
    if ('amountVnd' in validTx) {
      expect(validTx.amountVnd).toBe(490000);
    }
  });
});

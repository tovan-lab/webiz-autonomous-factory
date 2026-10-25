import { describe, it, expect } from 'vitest';
import { evaluateAnomalies, detectComplaintKeywords } from '../../workspace/backend/src/anomaly.service';

describe('REQ-008: 5-Threshold Anomaly Red Alert System for Chairman', () => {
  it('triggers warnings and critical alerts when thresholds are exceeded (REQ-008)', () => {
    // Ngưỡng 1: Chi phí > 700k
    const alertsExpense = evaluateAnomalies({
      monthlyExpenseVnd: 750000,
      monthlyQuotaUsedPercent: 50,
      retainerOverdueDays: 0,
      annualCumulativeRevenueVnd: 50000000
    });
    expect(alertsExpense.some((a) => a.category === 'EXPENSE_EXCEEDED')).toBe(true);

    // Ngưỡng 2: Quota > 85%
    const alertsQuota = evaluateAnomalies({
      monthlyExpenseVnd: 200000,
      monthlyQuotaUsedPercent: 90,
      retainerOverdueDays: 0,
      annualCumulativeRevenueVnd: 50000000
    });
    expect(alertsQuota.some((a) => a.category === 'QUOTA_EXCEEDED')).toBe(true);

    // Ngưỡng 3: Quá hạn > 5 ngày
    const alertsRetainer = evaluateAnomalies({
      monthlyExpenseVnd: 200000,
      monthlyQuotaUsedPercent: 50,
      retainerOverdueDays: 7,
      annualCumulativeRevenueVnd: 50000000
    });
    expect(alertsRetainer.some((a) => a.category === 'RETAINER_OVERDUE')).toBe(true);

    // Ngưỡng 4: Khiếu nại / 5xx
    const alertsComplaint = evaluateAnomalies({
      monthlyExpenseVnd: 200000,
      monthlyQuotaUsedPercent: 50,
      retainerOverdueDays: 0,
      customerMessageOrHttpError: 'Khách hàng gửi khiếu nại dịch vụ gián đoạn',
      annualCumulativeRevenueVnd: 50000000
    });
    expect(alertsComplaint.some((a) => a.category === 'CUSTOMER_COMPLAINT_OR_5XX')).toBe(true);

    // Ngưỡng 5: Doanh thu năm chạm 800M (NĐ 141/2026)
    const alertsRevenue = evaluateAnomalies({
      monthlyExpenseVnd: 200000,
      monthlyQuotaUsedPercent: 50,
      retainerOverdueDays: 0,
      annualCumulativeRevenueVnd: 820000000
    });
    expect(alertsRevenue.some((a) => a.category === 'ANNUAL_REVENUE_THRESHOLD')).toBe(true);
  });

  it('detects complaint keywords accurately (REQ-008)', () => {
    expect(detectComplaintKeywords('Tôi muốn hoàn tiền ngay lập tức')).toBe(true);
    expect(detectComplaintKeywords('Dịch vụ rất tốt cảm ơn')).toBe(false);
  });
});

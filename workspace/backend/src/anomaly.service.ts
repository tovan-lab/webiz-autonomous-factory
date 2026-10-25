// Anomaly Red Alert Detection Service
// Meets REQ-008: 5-Threshold Anomaly Red Alert System for Chairman

export type AlertSeverity = 'CRITICAL' | 'WARNING';
export type AlertCategory =
  | 'EXPENSE_EXCEEDED'
  | 'QUOTA_EXCEEDED'
  | 'RETAINER_OVERDUE'
  | 'CUSTOMER_COMPLAINT_OR_5XX'
  | 'ANNUAL_REVENUE_THRESHOLD';

export interface AnomalyAlert {
  id: string;
  projectId?: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

const COMPLAINT_KEYWORDS = [
  /khiếu\s*nại/i,
  /lừa\s*đảo/i,
  /hoàn\s*tiền/i,
  /bồi\s*thường/i,
  /chất\s*lượng\s*kém/i
];

export function detectComplaintKeywords(text: string): boolean {
  return COMPLAINT_KEYWORDS.some((rx) => rx.test(text));
}

export function evaluateAnomalies(params: {
  monthlyExpenseVnd: number;
  monthlyQuotaUsedPercent: number;
  retainerOverdueDays: number;
  customerMessageOrHttpError?: string;
  annualCumulativeRevenueVnd: number;
}): AnomalyAlert[] {
  const alerts: AnomalyAlert[] = [];
  const now = new Date().toISOString();

  // Ngưỡng 1: Chi phí AI/Cloud > 700k (Cảnh báo vàng), >= 1tr (Báo động đỏ)
  if (params.monthlyExpenseVnd >= 1000000) {
    alerts.push({
      id: `alt_exp_${Date.now()}`,
      category: 'EXPENSE_EXCEEDED',
      severity: 'CRITICAL',
      title: 'Chi phí vận hành chạm trần cứng 1.000.000 VNĐ/tháng',
      message: `Tổng chi phí tháng đã đạt ${params.monthlyExpenseVnd.toLocaleString('vi-VN')} VNĐ. Toàn bộ tính năng AI vượt quota đã bị khóa.`,
      isResolved: false,
      createdAt: now
    });
  } else if (params.monthlyExpenseVnd >= 700000) {
    alerts.push({
      id: `alt_exp_warn_${Date.now()}`,
      category: 'EXPENSE_EXCEEDED',
      severity: 'WARNING',
      title: 'Chi phí vận hành vượt ngưỡng cảnh báo 700.000 VNĐ',
      message: `Tổng chi phí tháng hiện là ${params.monthlyExpenseVnd.toLocaleString('vi-VN')} VNĐ, cần theo dõi chặt chẽ.`,
      isResolved: false,
      createdAt: now
    });
  }

  // Ngưỡng 2: Khách dùng > 85% quota chatbot
  if (params.monthlyQuotaUsedPercent >= 85) {
    alerts.push({
      id: `alt_quota_${Date.now()}`,
      category: 'QUOTA_EXCEEDED',
      severity: 'WARNING',
      title: 'Khách hàng sử dụng vượt 85% hạn mức Chatbot',
      message: `Dự án đã tiêu thụ ${params.monthlyQuotaUsedPercent}% hạn mức. B02-lead-concierge cần gửi gợi ý nạp gói top-up 100k.`,
      isResolved: false,
      createdAt: now
    });
  }

  // Ngưỡng 3: Phí duy trì trễ hạn > 5 ngày
  if (params.retainerOverdueDays > 5) {
    alerts.push({
      id: `alt_ret_${Date.now()}`,
      category: 'RETAINER_OVERDUE',
      severity: 'WARNING',
      title: 'Phí duy trì trễ hạn quá 5 ngày',
      message: `Khách hàng trễ hạn ${params.retainerOverdueDays} ngày. B04-ledger-controller chuẩn bị gửi thông báo tạm dừng dịch vụ.`,
      isResolved: false,
      createdAt: now
    });
  }

  // Ngưỡng 4: Khách nhắn từ khóa khiếu nại hoặc lỗi HTTP 5xx
  if (params.customerMessageOrHttpError) {
    if (
      params.customerMessageOrHttpError.includes('500') ||
      params.customerMessageOrHttpError.includes('502') ||
      detectComplaintKeywords(params.customerMessageOrHttpError)
    ) {
      alerts.push({
        id: `alt_comp_${Date.now()}`,
        category: 'CUSTOMER_COMPLAINT_OR_5XX',
        severity: 'CRITICAL',
        title: 'Phát hiện khiếu nại nghiêm trọng hoặc lỗi hệ thống 5xx',
        message: `Nội dung kích hoạt: "${params.customerMessageOrHttpError}". Cần Chủ tịch hoặc Lead Engineer xử lý ngay lập tức.`,
        isResolved: false,
        createdAt: now
      });
    }
  }

  // Ngưỡng 5: Doanh thu năm chạm ngưỡng 800.000.000 VNĐ (chuẩn bị ngưỡng 1 tỷ NĐ 141/2026)
  if (params.annualCumulativeRevenueVnd >= 800000000) {
    alerts.push({
      id: `alt_ann_${Date.now()}`,
      category: 'ANNUAL_REVENUE_THRESHOLD',
      severity: 'CRITICAL',
      title: 'Doanh thu lũy kế chạm 800 Triệu VNĐ (Ngưỡng 80% NĐ 141/2026)',
      message: `Doanh thu năm đạt ${params.annualCumulativeRevenueVnd.toLocaleString('vi-VN')} VNĐ. B03-legal-counsel cần chuẩn bị thủ tục chuyển đổi thuế doanh nghiệp.`,
      isResolved: false,
      createdAt: now
    });
  }

  return alerts;
}

import React from 'react';
import { LedgerSummaryResponse } from '../../../backend/src/ledger.service';

export interface LedgerBudgetWidgetProps {
  summary: LedgerSummaryResponse;
}

export const LedgerBudgetWidget: React.FC<LedgerBudgetWidgetProps> = ({ summary }) => {
  const expensePercentage = Math.min(100, Math.round((summary.totalExpenseVnd / summary.expenseCapVnd) * 100));
  const annualPercentage = Math.min(
    100,
    Math.round((summary.annualCumulativeRevenueVnd / summary.annualRevenueCapVnd) * 100)
  );

  return (
    <div
      role="region"
      aria-label="Kiểm Soát Ngân Sách Vận Hành & Doanh Thu Thực"
      style={{
        backgroundColor: '#0F172A',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        color: '#F8FAFC',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, letterSpacing: '0.1em' }}>
            ● DETERMINISTIC LEDGER &amp; BUDGET GUARD
          </span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', color: '#FFFFFF' }}>
            Sổ Kế Toán Thực &amp; Trần Chi Phí 1 Triệu/Tháng
          </h3>
        </div>
        <div style={{ fontSize: '12px', color: '#94A3B8' }}>Tháng: {summary.monthYear}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {/* Doanh thu tháng */}
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>Doanh Thu Thực Thu Tháng</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981', marginTop: '6px' }}>
            {summary.totalRevenueVnd.toLocaleString('vi-VN')} đ
          </div>
          <div style={{ fontSize: '11px', color: '#0DEEF3', marginTop: '4px' }}>
            Đã cưỡng chế cọc 50% trước khi code
          </div>
        </div>

        {/* Chi phí tháng & trần 1tr */}
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8' }}>
            <span>Chi Phí Hoạt Động Tháng</span>
            <span style={{ color: summary.isWarningTriggered ? '#EF4444' : '#10B981', fontWeight: 700 }}>
              {expensePercentage}% Trần Cứng
            </span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>
            {summary.totalExpenseVnd.toLocaleString('vi-VN')} / 1.000.000 đ
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '6px', backgroundColor: '#334155', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${expensePercentage}%`,
                height: '100%',
                backgroundColor: summary.isHardCapExceeded ? '#EF4444' : summary.isWarningTriggered ? '#FFB800' : '#10B981'
              }}
            />
          </div>
        </div>

        {/* Lũy kế năm (Nghị định 141/2026) */}
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8' }}>
            <span>Doanh Thu Lũy Kế Năm</span>
            <span style={{ color: '#0DEEF3', fontWeight: 700 }}>{annualPercentage}% Ngưỡng</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#F8FAFC', marginTop: '6px' }}>
            {(summary.annualCumulativeRevenueVnd / 1000000).toFixed(1)}M / 1.000M đ
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
            Giám sát thuế theo Nghị định 141/2026/NĐ-CP
          </div>
        </div>
      </div>
    </div>
  );
};

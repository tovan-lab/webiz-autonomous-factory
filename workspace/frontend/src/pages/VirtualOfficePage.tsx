import React, { useState, useEffect } from 'react';
import { getOfficeState, OfficeStateResponse, AgentEmployeeState } from '../../../backend/src/office.service';
import { getApprovalQueue, decideApprovalItem, ApprovalItem } from '../../../backend/src/approvals.service';
import { getLedgerSummary, LedgerSummaryResponse } from '../../../backend/src/ledger.service';
import { VirtualOffice3D } from '../components/spatial/VirtualOffice3D';
import { ChairmanApprovalDeck } from '../components/dashboard/ChairmanApprovalDeck';
import { LedgerBudgetWidget } from '../components/dashboard/LedgerBudgetWidget';
import { Skeleton3DLoader } from '../components/common/Skeleton3DLoader';
import { Rfc9457ErrorAlert, ProblemDetailsData } from '../components/common/Rfc9457ErrorAlert';
import { UiLifecycleState } from '../types/tokens';

export const VirtualOfficePage: React.FC = () => {
  const [uiState, setUiState] = useState<UiLifecycleState>('loading_skeleton');
  const [officeData, setOfficeData] = useState<OfficeStateResponse | null>(null);
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>([]);
  const [ledgerSummary, setLedgerSummary] = useState<LedgerSummaryResponse | null>(null);
  const [cyberpunkLightsOff, setCyberpunkLightsOff] = useState<boolean>(false);
  const [apiError, setApiError] = useState<ProblemDetailsData | null>(null);

  const loadData = () => {
    try {
      setUiState('loading_skeleton');
      const office = getOfficeState(cyberpunkLightsOff);
      const queue = getApprovalQueue();
      const ledger = getLedgerSummary('2026-10');

      setOfficeData(office);
      setApprovalItems(queue.items);
      setLedgerSummary(ledger);
      setUiState('data_ready');
    } catch {
      setApiError({
        type: 'https://webiz.vn/errors/internal-error',
        title: 'Lỗi tải trạng thái Trụ sở 3D',
        status: 500,
        detail: 'Không thể kết nối tới dịch vụ điều hành văn phòng thời gian thực.',
        instance: '/api/v1/office/state',
        traceId: `trace-load-${Date.now()}`
      });
      setUiState('error_rfc9457_retry');
    }
  };

  useEffect(() => {
    loadData();
  }, [cyberpunkLightsOff]);

  const handleApprovalDecide = (id: string, decision: 'APPROVED' | 'REVISION_REQUESTED', note: string) => {
    const res = decideApprovalItem(id, decision, note);
    if ('status' in res && typeof res.status === 'number' && res.status >= 400) {
      setApiError(res as ProblemDetailsData);
      return;
    }
    // Refresh queue
    const updated = getApprovalQueue();
    setApprovalItems(updated.items);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: cyberpunkLightsOff ? '#030408' : '#070B14',
        color: '#F8FAFC',
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        padding: '24px 32px',
        boxSizing: 'border-box',
        transition: 'background-color 0.4s ease'
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '1px solid #1E293B',
          paddingBottom: '16px'
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', color: '#0DEEF3' }}>
            WEBIZ AUTONOMOUS AI WORKFORCE
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
            Hệ thống Điều hành Trụ sở Ảo 3D &amp; Hộp Duyệt 1-Chạm | Chủ tịch Phạm Trọng
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="/sandbox/gym?brand=IronHouseFitness&primaryColor=%230DEEF3"
            style={{
              fontSize: '13px',
              color: '#0DEEF3',
              textDecoration: 'none',
              padding: '8px 16px',
              border: '1px solid #0DEEF3',
              borderRadius: '8px',
              fontWeight: 600
            }}
          >
            Mở Live 3D Gym Sandbox →
          </a>
          <button
            type="button"
            onClick={() => setCyberpunkLightsOff((prev) => !prev)}
            style={{
              backgroundColor: cyberpunkLightsOff ? '#FF007A' : '#0F172A',
              color: '#FFFFFF',
              border: '1px solid #FF007A',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {cyberpunkLightsOff ? '☀ Bật Đèn Ngày' : '⚡ Tắt Đèn Cyberpunk (Quay Video)'}
          </button>
        </div>
      </header>

      {/* Lifecycle Handling */}
      {uiState === 'loading_skeleton' && <Skeleton3DLoader label="Khởi tạo mô hình 3D WebGL và kết nối 10 AI Agents..." />}
      {uiState === 'error_rfc9457_retry' && apiError && (
        <Rfc9457ErrorAlert error={apiError} onRetry={loadData} />
      )}

      {uiState === 'data_ready' && officeData && ledgerSummary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main 3D Virtual Office */}
          <VirtualOffice3D
            agents={officeData.agents}
            cyberpunkLightsOff={cyberpunkLightsOff}
            onAgentSelect={(_agent: AgentEmployeeState) => {}}
          />

          {/* Two-Column Operations Deck */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <ChairmanApprovalDeck
              items={approvalItems}
              onDecide={handleApprovalDecide}
            />
            <LedgerBudgetWidget summary={ledgerSummary} />
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';

export interface ProblemDetailsData {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  traceId: string;
}

export interface Rfc9457ErrorAlertProps {
  error: ProblemDetailsData;
  onRetry?: () => void;
}

export const Rfc9457ErrorAlert: React.FC<Rfc9457ErrorAlertProps> = ({ error, onRetry }) => {
  return (
    <div
      role="alert"
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #EF4444',
        borderRadius: '12px',
        padding: '16px',
        color: '#F8FAFC',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4 style={{ margin: 0, color: '#EF4444', fontSize: '16px' }}>
          [{error.status}] {error.title}
        </h4>
        <span style={{ fontSize: '12px', color: '#94A3B8' }}>Mã vết: {error.traceId}</span>
      </div>
      <p style={{ margin: '8px 0', fontSize: '14px', color: '#CBD5E1' }}>{error.detail}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
        <span style={{ fontSize: '11px', color: '#64748B' }}>URI: {error.instance}</span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Thử Lại
          </button>
        )}
      </div>
    </div>
  );
};

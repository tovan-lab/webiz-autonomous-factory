import React from 'react';

export interface Skeleton3DLoaderProps {
  label?: string;
}

export const Skeleton3DLoader: React.FC<Skeleton3DLoaderProps> = ({ label = 'Đang tải không gian 3D WebGL...' }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: '380px',
        backgroundColor: '#070B14',
        borderRadius: '16px',
        border: '1px solid rgba(13, 238, 243, 0.2)',
        color: '#0DEEF3',
        fontFamily: "'Space Grotesk', sans-serif"
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(13, 238, 243, 0.2)',
          borderTopColor: '#0DEEF3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <p style={{ marginTop: '16px', fontSize: '14px', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <span style={{ fontSize: '12px', color: '#64748B' }}>
        Tối ưu hóa Mobile-First | Nén Draco/Meshopt &lt; 1.8 MB
      </span>
    </div>
  );
};

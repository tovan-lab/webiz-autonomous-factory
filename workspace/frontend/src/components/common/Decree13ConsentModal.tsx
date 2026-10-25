import React, { useState } from 'react';

export interface Decree13ConsentModalProps {
  isOpen: boolean;
  brandName: string;
  onConsentGranted: (granted: boolean) => void;
}

export const Decree13ConsentModal: React.FC<Decree13ConsentModalProps> = ({
  isOpen,
  brandName,
  onConsentGranted
}) => {
  const [hasAgreed, setHasAgreed] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 4, 8, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
    >
      <div
        style={{
          backgroundColor: '#0F172A',
          border: '1px solid rgba(13, 238, 243, 0.4)',
          borderRadius: '16px',
          maxWidth: '520px',
          width: '100%',
          padding: '24px',
          color: '#F8FAFC',
          fontFamily: "'Inter', sans-serif",
          boxShadow: '0 0 30px rgba(13, 238, 243, 0.2)'
        }}
      >
        <h3 id="consent-title" style={{ margin: '0 0 12px 0', color: '#0DEEF3', fontSize: '18px' }}>
          Thông Báo Xử Lý Dữ Liệu Cá Nhân (Nghị định 13/2023/NĐ-CP)
        </h3>
        <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#CBD5E1' }}>
          Nhằm mục đích tư vấn thể hình, đặt lịch tập thử và tính chỉ số BMI/TDEE cá nhân hóa,{' '}
          <strong>{brandName}</strong> và nền tảng <strong>Webiz</strong> cần thu thập thông tin cơ bản gồm: Họ tên, Số điện thoại và Chỉ số thể lực.
        </p>
        <ul style={{ fontSize: '12px', color: '#94A3B8', paddingLeft: '20px', margin: '12px 0' }}>
          <li>Dữ liệu được mã hóa và lưu trữ an toàn, cam kết không chia sẻ cho bên thứ ba.</li>
          <li>Bạn có toàn quyền rút lại sự đồng ý hoặc yêu cầu xóa dữ liệu bất kỳ lúc nào.</li>
        </ul>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: '16px 0', fontSize: '13px' }}>
          <input
            type="checkbox"
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#0DEEF3' }}
          />
          <span>Tôi đã đọc và đồng ý cho phép xử lý dữ liệu cá nhân theo quy định.</span>
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => onConsentGranted(false)}
            style={{
              backgroundColor: 'transparent',
              color: '#94A3B8',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Từ Chối
          </button>
          <button
            type="button"
            disabled={!hasAgreed}
            onClick={() => onConsentGranted(true)}
            style={{
              backgroundColor: hasAgreed ? '#0DEEF3' : '#334155',
              color: hasAgreed ? '#070B14' : '#64748B',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 20px',
              fontWeight: 700,
              cursor: hasAgreed ? 'pointer' : 'not-allowed'
            }}
          >
            Đồng Ý & Tiếp Tục
          </button>
        </div>
      </div>
    </div>
  );
};

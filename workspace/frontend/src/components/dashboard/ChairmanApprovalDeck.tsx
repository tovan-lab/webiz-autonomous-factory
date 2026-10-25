import React, { useState } from 'react';
import { ApprovalItem } from '../../../backend/src/approvals.service';

export interface ChairmanApprovalDeckProps {
  items: ApprovalItem[];
  onDecide: (id: string, decision: 'APPROVED' | 'REVISION_REQUESTED', note: string) => void;
}

export const ChairmanApprovalDeck: React.FC<ChairmanApprovalDeckProps> = ({ items, onDecide }) => {
  const [activeItemId, setActiveItemId] = useState<string | null>(items[0]?.id ?? null);
  const [noteInput, setNoteInput] = useState<string>('Đã duyệt phương án, tiến hành bước tiếp theo.');

  const activeItem = items.find((i) => i.id === activeItemId) ?? items[0];

  return (
    <div
      role="region"
      aria-label="Hộp Duyệt 1-Chạm 30 Phút Của Chủ Tịch"
      style={{
        backgroundColor: '#0F172A',
        border: '1px solid rgba(255, 184, 0, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        color: '#F8FAFC',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Deck Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#FFB800', fontWeight: 700, letterSpacing: '0.1em' }}>
            ● CHAIRMAN 30-MINUTE APPROVAL DECK
          </span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', color: '#FFFFFF' }}>
            Hộp Duyệt 1-Chạm Điều Hành Công Ty
          </h3>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255, 184, 0, 0.15)',
            border: '1px solid #FFB800',
            color: '#FFB800',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700
          }}
        >
          ⏱ Thời gian duyệt hôm nay: 24:18 còn lại
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#94A3B8' }}>
          Đã xử lý sạch hàng chờ. Toàn bộ 4 cổng duyệt và video truyền thông đều đã được thông qua!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
          {/* List column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveItemId(item.id)}
                style={{
                  backgroundColor: activeItemId === item.id ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${activeItemId === item.id ? '#FFB800' : '#334155'}`,
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#F8FAFC'
                }}
              >
                <div style={{ fontSize: '11px', color: '#FFB800', fontWeight: 700 }}>{item.gateType}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, margin: '2px 0' }}>{item.title}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>Trình bởi: {item.submittedByAgent}</div>
              </button>
            ))}
          </div>

          {/* Detail & Action column */}
          {activeItem && (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: '#0DEEF3', fontWeight: 600 }}>{activeItem.gateType}</span>
                <h4 style={{ margin: '6px 0 12px 0', fontSize: '16px', color: '#FFFFFF' }}>{activeItem.title}</h4>
                <div
                  style={{
                    backgroundColor: '#070B14',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: '#CBD5E1',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {activeItem.threeLineSummary}
                </div>
                {activeItem.previewUrl && (
                  <div style={{ marginTop: '10px', fontSize: '12px' }}>
                    <a
                      href={activeItem.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#0DEEF3', textDecoration: 'underline' }}
                    >
                      🔗 Mở xem trước sản phẩm: {activeItem.previewUrl}
                    </a>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                  Ghi chú của Chủ tịch Phạm Trọng:
                </label>
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#070B14',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#F8FAFC',
                    fontSize: '13px',
                    marginBottom: '12px',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => onDecide(activeItem.id, 'REVISION_REQUESTED', noteInput)}
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      border: '1px solid #EF4444',
                      color: '#EF4444',
                      borderRadius: '8px',
                      padding: '10px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Yêu Cầu Sửa Đổi
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecide(activeItem.id, 'APPROVED', noteInput)}
                    style={{
                      flex: 2,
                      backgroundColor: '#FFB800',
                      border: 'none',
                      color: '#070B14',
                      borderRadius: '8px',
                      padding: '10px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Ký Duyệt 1-Chạm (SHA-256)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

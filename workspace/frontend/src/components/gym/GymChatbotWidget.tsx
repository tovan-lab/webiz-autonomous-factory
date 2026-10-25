import React, { useState } from 'react';
import { consumeChatbotMessage } from '../../../backend/src/chatbot-quota.service';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export interface GymChatbotWidgetProps {
  brandName: string;
  primaryColor?: string;
  projectId?: string;
  hasConsent: boolean;
  onRequestConsent: () => void;
}

export const GymChatbotWidget: React.FC<GymChatbotWidgetProps> = ({
  brandName,
  primaryColor = '#0DEEF3',
  projectId = 'prj_iron_01',
  hasConsent,
  onRequestConsent
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Xin chào! Tôi là Trợ lý AI thể hình của ${brandName}. Tôi có thể tư vấn gói tập, đo BMI/TDEE hoặc giúp bạn đặt lịch tập thử miễn phí.`,
      timestamp: 'Vừa xong'
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [hardCapWarning, setHardCapWarning] = useState<string | null>(null);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend ?? inputMessage;
    if (!text.trim()) return;

    if (!hasConsent) {
      onRequestConsent();
      return;
    }

    // Check Chatbot Quota Hard-Cap
    const consumeRes = consumeChatbotMessage(projectId);
    if ('status' in consumeRes && consumeRes.status === 429) {
      setHardCapWarning(consumeRes.detail);
      return;
    }

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Vừa xong'
    };

    let reply = `Cảm ơn bạn! Huấn luyện viên của ${brandName} đã nhận được tin nhắn và sẽ gọi lại hỗ trợ bạn sớm nhất.`;
    if (text.includes('giá') || text.includes('gói')) {
      reply = `Hiện ${brandName} có 3 gói: Standard (3.9tr/năm), VIP All-Access (5.9tr/năm) và Gói PT Chuyên Sâu (7.9tr). Bạn muốn tìm hiểu gói nào?`;
    } else if (text.includes('lịch') || text.includes('tập thử')) {
      reply = `Tuyệt vời! Bạn có thể ghé phòng tập thử vào ngày mai trong khung giờ 06:00 - 21:00. Vui lòng để lại số điện thoại để lễ tân gửi mã check-in nhé!`;
    }

    const aiMsg: ChatMessage = {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: reply,
      timestamp: 'Vừa xong'
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputMessage('');
  };

  return (
    <div
      role="region"
      aria-label="Cửa Sổ Trợ Lý Chatbot AI Thể Hình"
      style={{
        backgroundColor: '#0F172A',
        border: `1px solid ${primaryColor}40`,
        borderRadius: '16px',
        padding: '16px',
        color: '#F8FAFC',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        height: '420px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', color: primaryColor, fontWeight: 700, letterSpacing: '0.1em' }}>
            ● 24/7 AI FITNESS CONCIERGE
          </span>
          <h4 style={{ margin: '2px 0 0 0', fontSize: '15px', color: '#FFFFFF' }}>
            Trợ Lý AI {brandName}
          </h4>
        </div>
        <span style={{ fontSize: '11px', color: hasConsent ? '#10B981' : '#FFB800' }}>
          {hasConsent ? '✓ Đã đồng ý NĐ 13' : '⚠ Chưa xác nhận NĐ 13'}
        </span>
      </div>

      {hardCapWarning && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #EF4444',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#FCA5A5',
            marginBottom: '8px'
          }}
        >
          {hardCapWarning}
        </div>
      )}

      {/* Message history */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingRight: '6px'
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: m.sender === 'user' ? primaryColor : 'rgba(255, 255, 255, 0.05)',
              color: m.sender === 'user' ? '#070B14' : '#F8FAFC',
              borderRadius: '12px',
              padding: '10px 14px',
              maxWidth: '80%',
              fontSize: '13px',
              lineHeight: '1.5'
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Quick query chips */}
      <div style={{ display: 'flex', gap: '6px', margin: '10px 0', overflowX: 'auto', paddingBottom: '4px' }}>
        {['Bảng giá hội viên', 'Đặt lịch tập thử', 'Gợi ý bài tập Cardio'].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSendMessage(chip)}
            style={{
              whiteSpace: 'nowrap',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '4px 10px',
              fontSize: '11px',
              color: '#CBD5E1',
              cursor: 'pointer'
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={inputMessage}
          placeholder="Hỏi về lịch tập, huấn luyện viên..."
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          style={{
            flex: 1,
            backgroundColor: '#070B14',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#F8FAFC',
            fontSize: '13px'
          }}
        />
        <button
          type="button"
          onClick={() => handleSendMessage()}
          style={{
            backgroundColor: primaryColor,
            color: '#070B14',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

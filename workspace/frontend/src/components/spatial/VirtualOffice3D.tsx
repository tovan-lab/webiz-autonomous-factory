import React, { useState, useEffect } from 'react';
import { AgentEmployeeState } from '../../../backend/src/office.service';
import { THEME_STANDARD, THEME_LIGHTS_OFF } from '../../types/tokens';

export interface VirtualOffice3DProps {
  agents: AgentEmployeeState[];
  cyberpunkLightsOff: boolean;
  onAgentSelect?: (agent: AgentEmployeeState) => void;
}

export const VirtualOffice3D: React.FC<VirtualOffice3DProps> = ({
  agents,
  cyberpunkLightsOff,
  onAgentSelect
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentEmployeeState | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const currentTheme = cyberpunkLightsOff ? THEME_LIGHTS_OFF : THEME_STANDARD;

  const handleAgentClick = (agent: AgentEmployeeState) => {
    setSelectedAgent(agent);
    if (onAgentSelect) {
      onAgentSelect(agent);
    }
  };

  return (
    <div
      role="region"
      aria-label="Webiz 3D Virtual Office Command Center"
      style={{
        position: 'relative',
        width: '100%',
        height: '520px',
        backgroundColor: currentTheme.backgroundVoid,
        borderRadius: '20px',
        overflow: 'hidden',
        border: `1px solid ${currentTheme.borderGlass}`,
        boxShadow: cyberpunkLightsOff
          ? '0 0 40px rgba(13, 238, 243, 0.25)'
          : '0 10px 30px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.5s ease'
      }}
    >
      {/* HUD Header */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: currentTheme.accentPrimary,
              fontWeight: 700
            }}
          >
            ● LIVE 3D SPATIAL COMMAND CENTER
          </span>
          <h2 style={{ margin: '4px 0 0 0', color: currentTheme.textPrimary, fontSize: '18px' }}>
            Trụ Sở Điều Hành 10 Nhân Sự AI Webiz
          </h2>
        </div>
        <div
          style={{
            backgroundColor: currentTheme.surfaceGlass,
            padding: '6px 14px',
            borderRadius: '20px',
            border: `1px solid ${currentTheme.borderGlass}`,
            fontSize: '12px',
            color: cyberpunkLightsOff ? '#0DEEF3' : '#94A3B8',
            fontWeight: 600
          }}
        >
          {cyberpunkLightsOff ? '⚡ CYBERPUNK LIGHTS OFF MODE' : '☀ DAYLIGHT OFFICE MODE'}
        </div>
      </div>

      {/* 3D Isometric Virtual Office Map Canvas Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px 20px 20px',
          boxSizing: 'border-box'
        }}
      >
        {/* Spatial Floor Plan */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            width: '100%',
            maxWidth: '960px',
            transform: prefersReducedMotion ? 'none' : 'perspective(1000px) rotateX(15deg)',
            transition: 'transform 0.4s ease'
          }}
        >
          {/* Khu 1: Tech Factory */}
          <div
            style={{
              backgroundColor: currentTheme.surfaceCard,
              border: `1px solid ${currentTheme.accentPrimary}`,
              borderRadius: '14px',
              padding: '14px',
              minHeight: '260px'
            }}
          >
            <div style={{ color: currentTheme.accentPrimary, fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
              TECH FACTORY (6 Kỹ sư)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {agents
                .filter((a) => a.division === 'TECH_FACTORY')
                .map((agent) => (
                  <button
                    key={agent.agentCode}
                    type="button"
                    onClick={() => handleAgentClick(agent)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor:
                        selectedAgent?.agentCode === agent.agentCode
                          ? 'rgba(13, 238, 243, 0.25)'
                          : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${agent.accentColorHex}`,
                      borderRadius: '8px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: currentTheme.textPrimary
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>{agent.displayName}</div>
                      <div style={{ fontSize: '10px', color: currentTheme.textMuted }}>{agent.roleTitle}</div>
                    </div>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: agent.currentStatus === 'WORKING' ? '#00F5A0' : '#FFB800'
                      }}
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* Khu 2: Growth Studio & Concierge */}
          <div
            style={{
              backgroundColor: currentTheme.surfaceCard,
              border: `1px solid ${currentTheme.accentMagenta}`,
              borderRadius: '14px',
              padding: '14px',
              minHeight: '260px'
            }}
          >
            <div style={{ color: currentTheme.accentMagenta, fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
              GROWTH &amp; RECEPTION
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {agents
                .filter((a) => a.agentCode === 'B01-growth-director' || a.agentCode === 'B02-lead-concierge')
                .map((agent) => (
                  <button
                    key={agent.agentCode}
                    type="button"
                    onClick={() => handleAgentClick(agent)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor:
                        selectedAgent?.agentCode === agent.agentCode
                          ? 'rgba(255, 0, 122, 0.25)'
                          : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${agent.accentColorHex}`,
                      borderRadius: '8px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: currentTheme.textPrimary
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>{agent.displayName}</div>
                      <div style={{ fontSize: '10px', color: currentTheme.textMuted }}>{agent.roleTitle}</div>
                    </div>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#00F5A0'
                      }}
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* Khu 3: Governance Vault */}
          <div
            style={{
              backgroundColor: currentTheme.surfaceCard,
              border: '1px solid #10B981',
              borderRadius: '14px',
              padding: '14px',
              minHeight: '260px'
            }}
          >
            <div style={{ color: '#10B981', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
              GOVERNANCE VAULT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {agents
                .filter((a) => a.agentCode === 'B03-legal-counsel' || a.agentCode === 'B04-ledger-controller')
                .map((agent) => (
                  <button
                    key={agent.agentCode}
                    type="button"
                    onClick={() => handleAgentClick(agent)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor:
                        selectedAgent?.agentCode === agent.agentCode
                          ? 'rgba(16, 185, 129, 0.25)'
                          : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${agent.accentColorHex}`,
                      borderRadius: '8px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: currentTheme.textPrimary
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>{agent.displayName}</div>
                      <div style={{ fontSize: '10px', color: currentTheme.textMuted }}>{agent.roleTitle}</div>
                    </div>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#00F5A0'
                      }}
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* Khu 4: Chairman Approval Suite */}
          <div
            style={{
              backgroundColor: currentTheme.surfaceCard,
              border: `1px solid ${currentTheme.accentAmber}`,
              borderRadius: '14px',
              padding: '14px',
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ color: currentTheme.accentAmber, fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                CHAIRMAN SUITE
              </div>
              <div style={{ fontSize: '12px', color: currentTheme.textPrimary, fontWeight: 600 }}>
                Chủ tịch Phạm Trọng
              </div>
              <div style={{ fontSize: '11px', color: currentTheme.textMuted, marginTop: '4px' }}>
                Trung tâm điều hành 1-chạm: Duyệt hợp đồng, cọc 50% &amp; video truyền thông.
              </div>
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 184, 0, 0.1)',
                border: '1px solid rgba(255, 184, 0, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '11px',
                color: currentTheme.accentAmber,
                textAlign: 'center'
              }}
            >
              Cổng Duyệt Mật Mã Sẵn Sàng
            </div>
          </div>
        </div>
      </div>

      {/* Selected Agent Quick Inspector Footer */}
      {selectedAgent && (
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 16,
            right: 16,
            backgroundColor: currentTheme.surfaceGlass,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${selectedAgent.accentColorHex}`,
            borderRadius: '12px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 20
          }}
        >
          <div>
            <strong style={{ color: selectedAgent.accentColorHex, fontSize: '13px' }}>
              [{selectedAgent.agentCode}] {selectedAgent.displayName}
            </strong>
            <span style={{ marginLeft: '12px', fontSize: '12px', color: currentTheme.textSecondary }}>
              {selectedAgent.currentTaskSummary}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: currentTheme.textMuted }}>
            Vị trí 3D: [{selectedAgent.position.x}, {selectedAgent.position.y}, {selectedAgent.position.z}]
          </span>
        </div>
      )}
    </div>
  );
};

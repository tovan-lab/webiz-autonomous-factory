import React, { useState } from 'react';
import { WorkoutZoneConfig } from '../../../backend/src/gym-sandbox.service';

export interface GymShowcase3DProps {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  workoutZones: WorkoutZoneConfig[];
  onZoneSelect?: (zone: WorkoutZoneConfig) => void;
}

export const GymShowcase3D: React.FC<GymShowcase3DProps> = ({
  brandName,
  primaryColor,
  secondaryColor,
  workoutZones,
  onZoneSelect
}) => {
  const [activeZoneKey, setActiveZoneKey] = useState<string>('cardio');

  const handleZoneClick = (zone: WorkoutZoneConfig) => {
    setActiveZoneKey(zone.key);
    if (onZoneSelect) {
      onZoneSelect(zone);
    }
  };

  const activeZone = workoutZones.find((z) => z.key === activeZoneKey) ?? workoutZones[0];

  return (
    <div
      role="region"
      aria-label={`Không gian 3D tương tác của ${brandName}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '480px',
        backgroundColor: '#090D16',
        borderRadius: '20px',
        overflow: 'hidden',
        border: `1px solid ${primaryColor}40`,
        boxShadow: `0 0 35px ${primaryColor}20`,
        fontFamily: "'Space Grotesk', sans-serif"
      }}
    >
      {/* 3D Scene Viewport Simulator */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
          boxSizing: 'border-box',
          background: `radial-gradient(circle at center, #1E293B 0%, #090D16 80%)`
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', color: primaryColor, fontWeight: 700, letterSpacing: '0.1em' }}>
              ● 3D INTERACTIVE GYM SHOWROOM
            </span>
            <h3 style={{ margin: '4px 0 0 0', color: '#F8FAFC', fontSize: '20px' }}>
              {brandName}
            </h3>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: `1px solid ${secondaryColor}60`,
              color: secondaryColor,
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            Chạm &amp; Xoay 360°
          </div>
        </div>

        {/* Center 3D Zone Model Presentation */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: `2px dashed ${primaryColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 25px ${primaryColor}40`,
              animation: 'spin 12s linear infinite'
            }}
          >
            <span style={{ fontSize: '32px' }}>
              {activeZoneKey === 'cardio' ? '🏃' : activeZoneKey === 'free_weights' ? '🏋' : '🧘'}
            </span>
          </div>
          <h4 style={{ margin: '16px 0 6px 0', color: '#F8FAFC', fontSize: '18px' }}>
            {activeZone?.name}
          </h4>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px', maxWidth: '420px', lineHeight: '1.5' }}>
            {activeZone?.description}
          </p>
        </div>

        {/* Zone Selector Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          {workoutZones.map((zone) => {
            const isActive = zone.key === activeZoneKey;
            return (
              <button
                key={zone.key}
                type="button"
                onClick={() => handleZoneClick(zone)}
                style={{
                  backgroundColor: isActive ? primaryColor : 'rgba(15, 23, 42, 0.8)',
                  color: isActive ? '#070B14' : '#F8FAFC',
                  border: `1px solid ${isActive ? primaryColor : '#334155'}`,
                  borderRadius: '10px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                {zone.name.split(' (')[0]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

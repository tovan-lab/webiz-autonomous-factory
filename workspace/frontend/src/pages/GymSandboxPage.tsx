import React, { useState, useEffect } from 'react';
import { getGymSandboxPreview, GymSandboxConfig } from '../../../backend/src/gym-sandbox.service';
import { recordConsent } from '../../../backend/src/compliance.service';
import { GymShowcase3D } from '../components/spatial/GymShowcase3D';
import { BmiCalculatorWidget } from '../components/gym/BmiCalculatorWidget';
import { GymChatbotWidget } from '../components/gym/GymChatbotWidget';
import { Decree13ConsentModal } from '../components/common/Decree13ConsentModal';
import { Skeleton3DLoader } from '../components/common/Skeleton3DLoader';

export interface GymSandboxPageProps {
  initialBrand?: string;
  initialPrimaryColor?: string;
  initialSecondaryColor?: string;
}

export const GymSandboxPage: React.FC<GymSandboxPageProps> = ({
  initialBrand = 'Iron House Fitness',
  initialPrimaryColor = '#0DEEF3',
  initialSecondaryColor = '#FF007A'
}) => {
  const [brand, setBrand] = useState<string>(initialBrand);
  const [primaryColor, setPrimaryColor] = useState<string>(initialPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState<string>(initialSecondaryColor);
  const [config, setConfig] = useState<GymSandboxConfig | null>(null);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(false);
  const [hasDecree13Consent, setHasDecree13Consent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Parse URL query on mount if running in browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlBrand = params.get('brand');
      const urlColor = params.get('primaryColor');
      const urlSecondary = params.get('secondaryColor');

      if (urlBrand) setBrand(urlBrand);
      if (urlColor) setPrimaryColor(urlColor);
      if (urlSecondary) setSecondaryColor(urlSecondary);
    }
    const resolvedConfig = getGymSandboxPreview(brand, primaryColor, secondaryColor);
    setConfig(resolvedConfig);
    setIsLoading(false);
  }, [brand, primaryColor, secondaryColor]);

  const handleConsentGranted = (granted: boolean) => {
    setIsConsentModalOpen(false);
    if (granted) {
      setHasDecree13Consent(true);
      recordConsent({
        subjectId: 'guest_user_gym_demo',
        consentType: 'GYM_SANDBOX_FITNESS_ADVICE',
        granted: true,
        dataCategories: 'NAME,PHONE,FITNESS_DATA,BMI'
      });
    }
  };

  if (isLoading || !config) {
    return <Skeleton3DLoader label="Đang tải Live 3D Gym Sandbox..." />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#090D16',
        color: '#F8FAFC',
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        padding: '24px 32px',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Banner with Dynamic Branding Inspector */}
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
          <span style={{ fontSize: '12px', color: primaryColor, fontWeight: 700, letterSpacing: '0.1em' }}>
            WEBIZ 3D CONVERSION KIT — NGÀNH GYM &amp; FITNESS
          </span>
          <h1 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#FFFFFF' }}>{config.brandName}</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>{config.heroTagline}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a
            href="/"
            style={{
              fontSize: '13px',
              color: '#94A3B8',
              textDecoration: 'none',
              padding: '8px 16px',
              border: '1px solid #334155',
              borderRadius: '8px'
            }}
          >
            ← Về Trụ Sở Webiz
          </a>
          <button
            type="button"
            onClick={() => setIsConsentModalOpen(true)}
            style={{
              backgroundColor: hasDecree13Consent ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 184, 0, 0.2)',
              border: `1px solid ${hasDecree13Consent ? '#10B981' : '#FFB800'}`,
              color: hasDecree13Consent ? '#10B981' : '#FFB800',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {hasDecree13Consent ? '✓ Đã Ký Nghị Định 13' : 'Ký Đồng Ý Dữ Liệu NĐ 13'}
          </button>
        </div>
      </header>

      {/* Main 3D Space */}
      <div style={{ marginBottom: '24px' }}>
        <GymShowcase3D
          brandName={config.brandName}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          workoutZones={config.workoutZones}
        />
      </div>

      {/* Packages Grid */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#FFFFFF' }}>Các Gói Hội Viên Ưu Đãi</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {config.packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                backgroundColor: '#0F172A',
                border: '1px solid #1E293B',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: primaryColor }}>{pkg.name}</h4>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', marginBottom: '12px' }}>
                  {pkg.priceMonthlyVnd.toLocaleString('vi-VN')} đ/tháng
                </div>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: '#CBD5E1', lineHeight: '1.6' }}>
                  {pkg.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!hasDecree13Consent) {
                    setIsConsentModalOpen(true);
                  } else {
                    alert(`Đã nhận đăng ký gói ${pkg.name}! Lễ tân sẽ gọi lại qua hotline ${config.hotlineOrZalo}`);
                  }
                }}
                style={{
                  marginTop: '16px',
                  backgroundColor: primaryColor,
                  color: '#070B14',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Đăng Ký Nhận Ưu Đãi
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Tool Section: BMI Calculator + AI Chatbot */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <BmiCalculatorWidget primaryColor={primaryColor} />
        <GymChatbotWidget
          brandName={config.brandName}
          primaryColor={primaryColor}
          hasConsent={hasDecree13Consent}
          onRequestConsent={() => setIsConsentModalOpen(true)}
        />
      </div>

      {/* Decree 13 Consent Modal */}
      <Decree13ConsentModal
        isOpen={isConsentModalOpen}
        brandName={config.brandName}
        onConsentGranted={handleConsentGranted}
      />
    </div>
  );
};

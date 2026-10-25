import React, { useState } from 'react';
import { calculateBmiAndTdee, BmiTdeeResult } from '../../../backend/src/gym-sandbox.service';

export interface BmiCalculatorWidgetProps {
  primaryColor?: string;
  onPlanSuggested?: (planId: string) => void;
}

export const BmiCalculatorWidget: React.FC<BmiCalculatorWidgetProps> = ({
  primaryColor = '#0DEEF3',
  onPlanSuggested
}) => {
  const [weightKg, setWeightKg] = useState<number>(68);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [ageYears, setAgeYears] = useState<number>(26);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<BmiTdeeResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateBmiAndTdee({
      weightKg,
      heightCm,
      ageYears,
      gender,
      activityFactor: 1.375
    });
    setResult(res);
    if (onPlanSuggested) {
      onPlanSuggested(res.suggestedPlanId);
    }
  };

  return (
    <div
      role="region"
      aria-label="Công Cụ Tính Chỉ Số Thể Lực BMI & TDEE"
      style={{
        backgroundColor: '#0F172A',
        border: `1px solid ${primaryColor}40`,
        borderRadius: '16px',
        padding: '20px',
        color: '#F8FAFC',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', color: primaryColor, fontWeight: 700, letterSpacing: '0.1em' }}>
          ● FITNESS METRIC CALCULATOR
        </span>
        <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', color: '#FFFFFF' }}>
          Đo Chỉ Số Thể Lực BMI &amp; Năng Lượng TDEE
        </h3>
      </div>

      <form onSubmit={handleCalculate} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Cân nặng (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            style={{
              width: '100%',
              backgroundColor: '#070B14',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px',
              color: '#F8FAFC',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Chiều cao (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            style={{
              width: '100%',
              backgroundColor: '#070B14',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px',
              color: '#F8FAFC',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Tuổi</label>
          <input
            type="number"
            value={ageYears}
            onChange={(e) => setAgeYears(Number(e.target.value))}
            style={{
              width: '100%',
              backgroundColor: '#070B14',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px',
              color: '#F8FAFC',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Giới tính</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as 'male' | 'female')}
            style={{
              width: '100%',
              backgroundColor: '#070B14',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px',
              color: '#F8FAFC',
              boxSizing: 'border-box'
            }}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        <div style={{ gridColumn: 'span 4', marginTop: '4px' }}>
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: primaryColor,
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              color: '#070B14',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Tính Chỉ Số Thể Lực &amp; Gợi Ý Lộ Trình
          </button>
        </div>
      </form>

      {result && (
        <div
          style={{
            marginTop: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '14px',
            border: `1px solid ${primaryColor}40`,
            display: 'flex',
            justifyContent: 'space-around',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Chỉ số BMI</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: primaryColor, marginTop: '4px' }}>
              {result.bmi}
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1' }}>{result.bmiClassification}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Mức tiêu hao TDEE</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
              {result.tdeeKcal} kcal/ngày
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1' }}>Duy trì cân nặng</div>
          </div>
        </div>
      )}
    </div>
  );
};

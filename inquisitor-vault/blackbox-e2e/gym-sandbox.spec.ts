import { describe, it, expect } from 'vitest';
import { getGymSandboxPreview, calculateBmiAndTdee } from '../../workspace/backend/src/gym-sandbox.service';

describe('REQ-009: Live 3D Gym Sandbox Conversion Kit with Dynamic URL Branding', () => {
  it('generates customized brand profile and 3 workout zones from URL params (REQ-009)', () => {
    const config = getGymSandboxPreview('Olympus Fitness', '#FF007A', '#0DEEF3');
    expect(config.brandName).toBe('Olympus Fitness');
    expect(config.primaryColor).toBe('#FF007A');
    expect(config.secondaryColor).toBe('#0DEEF3');
    expect(config.workoutZones.length).toBe(3);
    expect(config.packages.length).toBe(3);
  });

  it('calculates BMI and TDEE accurately for fitness consultation (REQ-009)', () => {
    const res = calculateBmiAndTdee({
      weightKg: 70,
      heightCm: 175,
      ageYears: 25,
      gender: 'male',
      activityFactor: 1.375
    });

    expect(res.bmi).toBe(22.9);
    expect(res.bmiClassification).toBe('Bình thường');
    expect(res.tdeeKcal).toBeGreaterThan(1500);
  });
});

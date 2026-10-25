// Live 3D Gym Sandbox Service & Dynamic URL Branding
// Meets REQ-009: Live 3D Gym Sandbox Conversion Kit with Dynamic URL Branding

export interface WorkoutZoneConfig {
  key: string;
  name: string;
  description: string;
  cameraTarget: [number, number, number];
}

export interface GymPackagePlan {
  id: string;
  name: string;
  priceMonthlyVnd: number;
  benefits: string[];
}

export interface GymSandboxConfig {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  heroTagline: string;
  hotlineOrZalo: string;
  packages: GymPackagePlan[];
  workoutZones: WorkoutZoneConfig[];
}

export interface BmiTdeeResult {
  bmi: number;
  bmiClassification: string;
  tdeeKcal: number;
  suggestedPlanId: string;
}

export function calculateBmiAndTdee(params: {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  gender: 'male' | 'female';
  activityFactor: number; // e.g. 1.2 (sedentary) to 1.725 (very active)
}): BmiTdeeResult {
  const heightM = params.heightCm / 100;
  const bmi = Number((params.weightKg / (heightM * heightM)).toFixed(1));

  let classification = 'Bình thường';
  let suggestedPlanId = 'plan_growth_vip';
  if (bmi < 18.5) {
    classification = 'Thiếu cân / Cần tăng cơ';
    suggestedPlanId = 'plan_pt_coaching';
  } else if (bmi >= 25.0) {
    classification = 'Thừa cân / Cần giảm mỡ';
    suggestedPlanId = 'plan_pt_coaching';
  }

  // Harris-Benedict BMR equation
  let bmr = 0;
  if (params.gender === 'male') {
    bmr = 88.362 + 13.397 * params.weightKg + 4.799 * params.heightCm - 5.677 * params.ageYears;
  } else {
    bmr = 447.593 + 9.247 * params.weightKg + 3.098 * params.heightCm - 4.33 * params.ageYears;
  }
  const tdeeKcal = Math.round(bmr * params.activityFactor);

  return {
    bmi,
    bmiClassification: classification,
    tdeeKcal,
    suggestedPlanId
  };
}

export function getGymSandboxPreview(
  brand?: string,
  primaryColor?: string,
  secondaryColor?: string
): GymSandboxConfig {
  const resolvedBrand = brand?.trim() || 'Iron House Fitness';
  const resolvedPrimary = primaryColor?.trim() || '#0DEEF3';
  const resolvedSecondary = secondaryColor?.trim() || '#FF007A';

  const workoutZones: WorkoutZoneConfig[] = [
    {
      key: 'cardio',
      name: 'Cardio Zone (Máy chạy & Xe đạp)',
      description: 'Đốt mỡ tối đa với dàn máy chạy bộ Technogym và xe đạp xoay kết nối màn hình ảo.',
      cameraTarget: [-3.5, 1.2, 2.0]
    },
    {
      key: 'free_weights',
      name: 'Free Weights Zone (Tạ đòn & Ghế dốc)',
      description: 'Khu vực tập luyện sức mạnh chuyên nghiệp với thanh đòn Olympic và tạ đơn từ 2.5kg - 50kg.',
      cameraTarget: [0.0, 1.2, 0.0]
    },
    {
      key: 'pt_yoga',
      name: 'PT Coaching & Functional Turf',
      description: 'Không gian huấn luyện 1:1, thảm cỏ trượt tạ sled và khu giãn cơ chuyên sâu.',
      cameraTarget: [3.5, 1.2, 2.0]
    }
  ];

  const packages: GymPackagePlan[] = [
    {
      id: 'plan_starter',
      name: 'Thẻ Hội Viên Standard (3.9tr/Năm)',
      priceMonthlyVnd: 390000,
      benefits: [
        'Tập luyện không giới hạn khung giờ',
        'Tủ đồ cá nhân & phòng tắm nóng lạnh',
        'Đo chỉ số InBody miễn phí hằng tháng'
      ]
    },
    {
      id: 'plan_growth_vip',
      name: 'Thẻ VIP All-Access (5.9tr/Năm)',
      priceMonthlyVnd: 490000,
      benefits: [
        'Toàn bộ quyền lợi Standard',
        'Tặng 2 buổi tập cùng Huấn luyện viên cá nhân PT',
        'Trợ lý Chatbot AI nhắc lịch tập & dinh dưỡng 24/7'
      ]
    },
    {
      id: 'plan_pt_coaching',
      name: 'Combo Chuyển Hóa Vóc Dáng (7.9tr/Khóa)',
      priceMonthlyVnd: 790000,
      benefits: [
        '12 buổi PT kèm 1:1 chuyên biệt',
        'Thực đơn ăn uống cá nhân hóa theo TDEE',
        'Cam kết đạt mục tiêu hình thể'
      ]
    }
  ];

  return {
    brandName: resolvedBrand,
    primaryColor: resolvedPrimary,
    secondaryColor: resolvedSecondary,
    heroTagline: `Bứt phá giới hạn hình thể tại ${resolvedBrand} cùng trải nghiệm 3D độc bản`,
    hotlineOrZalo: '0912.345.678',
    packages,
    workoutZones
  };
}

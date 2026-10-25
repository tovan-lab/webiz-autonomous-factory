// Lead Intake & Sandbox Brand Config Service
// Meets REQ-004: Lead Intake, Auto-Classification & Dynamic Sandbox Brand Config

import { createProblemDetails, ProblemDetailsRFC9457 } from './health.service';

export type LeadSourceChannel = 'FACEBOOK_MESSENGER' | 'ZALO_OA' | 'WEB_FORM' | 'SCHEDULED_CALL';
export type IndustryType = 'GYM_FITNESS' | 'SPA_BEAUTY' | 'HOMESTAY_TRAVEL' | 'FNB_RESTAURANT';
export type PackageTier = 'STARTER_3D' | 'GROWTH_AI' | 'PRO_AUTOMATION';

export interface LeadIntakeInput {
  fullName: string;
  phoneNumber: string;
  email?: string;
  brandName: string;
  sourceChannel: LeadSourceChannel;
  industry: IndustryType;
  notes?: string;
}

export interface SandboxBrandConfig {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  heroTagline: string;
  hotlineOrZalo: string;
  samplePackages: string[];
}

export interface LeadIntakeResult {
  leadId: string;
  projectId: string;
  suggestedTier: PackageTier;
  sandboxPreviewUrl: string;
  sandboxBrandConfig: SandboxBrandConfig;
}

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?previous\s+instructions/i,
  /system\s+prompt/i,
  /eval\s*\(/i,
  /<script[\s>]/i,
  /\bDROP\s+TABLE\b/i,
  /\bUNION\s+SELECT\b/i,
  /\bDAN\s+mode\b/i
];

export function sanitizeAndValidateInput(text: string): boolean {
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return false;
    }
  }
  return true;
}

export function intakeLead(input: LeadIntakeInput): LeadIntakeResult | ProblemDetailsRFC9457 {
  const combinedText = `${input.fullName} ${input.brandName} ${input.notes ?? ''}`;
  if (!sanitizeAndValidateInput(combinedText)) {
    return createProblemDetails({
      status: 400,
      title: 'Prompt Injection / Malicious Content Detected',
      detail: 'Dữ liệu đầu vào bị từ chối do chứa chỉ thị prompt injection hoặc mã độc nguy hại.',
      instance: '/api/v1/leads/intake',
      traceId: `trace-lead-sec-${Date.now()}`
    });
  }

  if (!input.fullName.trim() || !input.phoneNumber.trim() || !input.brandName.trim()) {
    return createProblemDetails({
      status: 400,
      title: 'Validation Error',
      detail: 'Thiếu các trường bắt buộc: fullName, phoneNumber, brandName',
      instance: '/api/v1/leads/intake',
      traceId: `trace-lead-val-${Date.now()}`
    });
  }

  const leadId = `lead_${Date.now().toString(36)}`;
  const projectId = `prj_${Date.now().toString(36)}`;

  let primaryColor = '#0DEEF3';
  let secondaryColor = '#FF007A';
  let heroTagline = 'Bứt phá thương hiệu cùng không gian 3D tương tác sống động';
  let samplePackages = ['Gói Cơ Bản (3.9tr)', 'Gói Tăng Trưởng AI (5.9tr)', 'Gói Tự Động Hóa Pro (7.9tr)'];

  if (input.industry === 'GYM_FITNESS') {
    primaryColor = '#0DEEF3';
    secondaryColor = '#FF007A';
    heroTagline = 'Không gian tập luyện 3D đỉnh cao, đặt lịch tức thì cùng trợ lý AI';
    samplePackages = ['Thẻ Gym 1 Tháng (650k)', 'Thẻ VIP 6 Tháng (3.2tr)', 'Gói Huấn Luyện Viên Cá Nhân PT (5tr)'];
  } else if (input.industry === 'SPA_BEAUTY') {
    primaryColor = '#E056FD';
    secondaryColor = '#F8A5C2';
    heroTagline = 'Thiên đường thư giãn và phục hồi nhan sắc chuẩn chuyên gia';
    samplePackages = ['Chăm Sóc Da Cơ Bản (450k)', 'Trị Liệu Chuyên Sâu (1.2tr)', 'Liệu Trình Trẻ Hóa VIP (3.5tr)'];
  } else if (input.industry === 'HOMESTAY_TRAVEL') {
    primaryColor = '#00B894';
    secondaryColor = '#FDCB6E';
    heroTagline = 'Khám phá toàn cảnh sa bàn 3D Homestay và giữ phòng nghỉ dưỡng trong 1 chạm';
    samplePackages = ['Phòng Bungalow Đơn (800k/đêm)', 'Villa Hồ Bơi Gia Đình (2.5tr/đêm)', 'Combo BBQ Nghỉ Dưỡng (3.5tr)'];
  } else if (input.industry === 'FNB_RESTAURANT') {
    primaryColor = '#E17055';
    secondaryColor = '#D63031';
    heroTagline = 'Menu 3D thực tế ảo xoay 360 độ và đặt bàn ẩm thực thông minh';
    samplePackages = ['Bàn Tiệc Gia Đình (1.5tr)', 'Set Menu Cao Cấp (2.8tr)', 'Buffet Hải Sản Thượng Hạng (3.9tr)'];
  }

  const sandboxBrandConfig: SandboxBrandConfig = {
    brandName: input.brandName,
    primaryColor,
    secondaryColor,
    heroTagline,
    hotlineOrZalo: input.phoneNumber,
    samplePackages
  };

  const encodedBrand = encodeURIComponent(input.brandName);
  const encodedColor = encodeURIComponent(primaryColor);
  const sandboxPreviewUrl = `/sandbox/gym?brand=${encodedBrand}&primaryColor=${encodedColor}`;

  return {
    leadId,
    projectId,
    suggestedTier: 'GROWTH_AI',
    sandboxPreviewUrl,
    sandboxBrandConfig
  };
}

// Decree 13/2023/ND-CP Personal Data Consent Compliance Service
// Meets REQ-010: Decree 13/2023/ND-CP Personal Data Consent Compliance

import { createProblemDetails, ProblemDetailsRFC9457 } from './health.service';

export interface ConsentRecord {
  id: string;
  subjectId: string;
  consentType: string;
  granted: boolean;
  ipAddress?: string;
  userAgent?: string;
  dataCategories?: string;
  recordedAt: string;
}

const consentAuditStore: ConsentRecord[] = [];

export function recordConsent(params: {
  subjectId: string;
  consentType: string;
  granted: boolean;
  ipAddress?: string;
  userAgent?: string;
  dataCategories?: string;
}): ConsentRecord | ProblemDetailsRFC9457 {
  if (!params.subjectId.trim() || !params.consentType.trim()) {
    return createProblemDetails({
      status: 400,
      title: 'Invalid Consent Request',
      detail: 'Thiếu subjectId hoặc consentType bắt buộc theo Nghị định 13/2023/NĐ-CP',
      instance: '/api/v1/compliance/consent',
      traceId: `trace-consent-${Date.now()}`
    });
  }

  const record: ConsentRecord = {
    id: `consent_${Date.now().toString(36)}`,
    subjectId: params.subjectId,
    consentType: params.consentType,
    granted: params.granted,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    dataCategories: params.dataCategories ?? 'PHONE,NAME,FITNESS_DATA',
    recordedAt: new Date().toISOString()
  };

  consentAuditStore.push(record);
  return record;
}

export function getConsentAuditHistory(subjectId?: string): ConsentRecord[] {
  if (!subjectId) return [...consentAuditStore];
  return consentAuditStore.filter((c) => c.subjectId === subjectId);
}

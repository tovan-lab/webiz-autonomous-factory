// CRM Project Pipeline & Ledger Gate Enforcement Service
// Meets REQ-005: CRM 9-Stage Pipeline & Strict Ledger Gate Enforcement (50% Deposit & 100% Final Payment Lock)

import { createProblemDetails, ProblemDetailsRFC9457 } from './health.service';

export type PipelineStage =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'SANDBOX_READY'
  | 'QUOTED'
  | 'CONTRACT_SENT'
  | 'DEPOSIT_50_PAID'
  | 'IN_PRODUCTION'
  | 'DELIVERED_PAID_100'
  | 'LOST';

export interface ClientProjectEntity {
  id: string;
  projectCode: string;
  clientName: string;
  brandName: string;
  pipelineStage: PipelineStage;
  deposit50AmountVnd: number;
  deposit50PaidAt: string | null;
  final50AmountVnd: number;
  final50PaidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransitionSuccessResult {
  projectId: string;
  previousStage: PipelineStage;
  currentStage: PipelineStage;
  transitionedAt: string;
}

const projectStore = new Map<string, ClientProjectEntity>([
  [
    'prj_iron_01',
    {
      id: 'prj_iron_01',
      projectCode: 'PRJ-2026-GYM-001',
      clientName: 'Nguyễn Văn Hùng',
      brandName: 'Iron House Fitness',
      pipelineStage: 'SANDBOX_READY',
      deposit50AmountVnd: 2950000,
      deposit50PaidAt: null,
      final50AmountVnd: 2950000,
      final50PaidAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
]);

export function getProject(projectId: string): ClientProjectEntity | undefined {
  return projectStore.get(projectId);
}

export function recordDepositPayment(projectId: string, paidAt?: string): boolean {
  const project = projectStore.get(projectId);
  if (!project) return false;
  project.deposit50PaidAt = paidAt ?? new Date().toISOString();
  project.pipelineStage = 'DEPOSIT_50_PAID';
  project.updatedAt = new Date().toISOString();
  projectStore.set(projectId, project);
  return true;
}

export function recordFinalPayment(projectId: string, paidAt?: string): boolean {
  const project = projectStore.get(projectId);
  if (!project) return false;
  project.final50PaidAt = paidAt ?? new Date().toISOString();
  project.updatedAt = new Date().toISOString();
  projectStore.set(projectId, project);
  return true;
}

export function transitionProjectStage(
  projectId: string,
  targetStage: PipelineStage
): TransitionSuccessResult | ProblemDetailsRFC9457 {
  const project = projectStore.get(projectId);
  if (!project) {
    return createProblemDetails({
      status: 404,
      title: 'Project Not Found',
      detail: `Không tìm thấy dự án với mã: ${projectId}`,
      instance: `/api/v1/projects/${projectId}/transition`,
      traceId: `trace-prj-404-${projectId}`
    });
  }

  // 1. CƯỠNG CHẾ CỌC 50% (LEDGER GATE) KHI CHUYỂN SANG IN_PRODUCTION
  if (targetStage === 'IN_PRODUCTION' && project.deposit50PaidAt === null) {
    return createProblemDetails({
      status: 409,
      type: 'https://webiz.vn/errors/ledger-gate-conflict',
      title: 'Ledger Gate Conflict - 50% Deposit Required',
      detail: 'Chặn sản xuất: Chưa xác nhận thanh toán cọc 50% vào sổ kế toán Webiz',
      instance: `/api/v1/projects/${projectId}/transition`,
      traceId: `trace-gate-deposit-${projectId}`
    });
  }

  // 2. CƯỠNG CHẾ THU ĐỦ 100% KHI CHUYỂN SANG DELIVERED_PAID_100
  if (targetStage === 'DELIVERED_PAID_100' && project.final50PaidAt === null) {
    return createProblemDetails({
      status: 409,
      type: 'https://webiz.vn/errors/handover-gate-conflict',
      title: 'Handover Gate Conflict - 100% Payment Required',
      detail: 'Chặn bàn giao: Chưa xác nhận thu đủ 100% giá trị hợp đồng trước khi bàn giao',
      instance: `/api/v1/projects/${projectId}/transition`,
      traceId: `trace-gate-handover-${projectId}`
    });
  }

  const previousStage = project.pipelineStage;
  project.pipelineStage = targetStage;
  project.updatedAt = new Date().toISOString();
  projectStore.set(projectId, project);

  return {
    projectId,
    previousStage,
    currentStage: targetStage,
    transitionedAt: project.updatedAt
  };
}

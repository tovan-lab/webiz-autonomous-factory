// Chairman 1-Touch 30-Minute Approval Deck Service
// Meets REQ-003: Chairman 1-Touch 30-Minute Approval Deck (4 Gates + Daily Video)

import crypto from 'node:crypto';
import { createProblemDetails, ProblemDetailsRFC9457 } from './health.service';

export type ApprovalGateType =
  | 'GATE_1_QUOTE'
  | 'GATE_2_SANDBOX_DEMO'
  | 'GATE_3_CONTRACT_INVOICE'
  | 'GATE_4_HANDOVER_RELEASE'
  | 'DAILY_MARKETING_VIDEO';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REVISION_REQUESTED';

export interface ApprovalItemPayload {
  [key: string]: string | number | boolean | null;
}

export interface ApprovalItem {
  id: string;
  projectId?: string;
  gateType: ApprovalGateType;
  title: string;
  threeLineSummary: string;
  previewUrl?: string;
  payloadJson: ApprovalItemPayload;
  riskWarning?: string;
  submittedByAgent: string;
  status: ApprovalStatus;
  chairmanNote?: string;
  signedHash?: string;
  decidedAt?: string;
  createdAt: string;
}

export interface ApprovalQueueResponse {
  items: ApprovalItem[];
  pendingCount: number;
  totalCount: number;
}

const INITIAL_APPROVAL_ITEMS: ApprovalItem[] = [
  {
    id: 'appr_01',
    projectId: 'prj_iron_01',
    gateType: 'GATE_2_SANDBOX_DEMO',
    title: 'Duyệt bản Live 3D Sandbox cho Iron House Fitness',
    threeLineSummary:
      '1. Khách hàng: Nguyễn Văn Hùng (Iron House Fitness)\n2. Đã tiêm thương hiệu màu #0DEEF3 và câu định vị\n3. Trạng thái: Sẵn sàng gửi khách trải nghiệm',
    previewUrl: '/sandbox/gym?brand=IronHouseFitness&primaryColor=%230DEEF3',
    payloadJson: { brand: 'Iron House Fitness', packageTier: 'GROWTH_AI' },
    submittedByAgent: 'B02-lead-concierge',
    status: 'PENDING',
    createdAt: new Date().toISOString()
  },
  {
    id: 'appr_02',
    gateType: 'DAILY_MARKETING_VIDEO',
    title: 'Duyệt Video Remotion: Trụ sở 3D Webiz Cyberpunk Lights Off',
    threeLineSummary:
      '1. Video 45s giới thiệu quy trình 10 AI Agents làm việc ban đêm\n2. Âm thanh Synthwave bản quyền miễn phí\n3. Mục tiêu: Kéo 50 leads chủ phòng Gym/Spa về Zalo OA',
    previewUrl: 'https://video.webiz.vn/previews/cyberpunk-night.mp4',
    payloadJson: { durationSeconds: 45, platform: 'TIKTOK' },
    submittedByAgent: 'B01-growth-director',
    status: 'PENDING',
    createdAt: new Date().toISOString()
  }
];

const approvalStore = new Map<string, ApprovalItem>(
  INITIAL_APPROVAL_ITEMS.map((item) => [item.id, { ...item }])
);

export function getApprovalQueue(): ApprovalQueueResponse {
  const items = Array.from(approvalStore.values());
  const pendingCount = items.filter((i) => i.status === 'PENDING').length;
  return {
    items,
    pendingCount,
    totalCount: items.length
  };
}

export function decideApprovalItem(
  id: string,
  decision: 'APPROVED' | 'REVISION_REQUESTED',
  chairmanNote: string
): ApprovalItem | ProblemDetailsRFC9457 {
  const item = approvalStore.get(id);
  if (!item) {
    return createProblemDetails({
      status: 404,
      title: 'Approval Item Not Found',
      detail: `Không tìm thấy mục phê duyệt với mã định danh: ${id}`,
      instance: `/api/v1/approvals/${id}/decide`,
      traceId: `trace-appr-404-${id}`
    });
  }

  const decidedAt = new Date().toISOString();
  const rawSignature = `${id}|${decision}|${chairmanNote}|${decidedAt}|Phạm Trọng`;
  const signedHash = crypto.createHash('sha256').update(rawSignature).digest('hex');

  item.status = decision;
  item.chairmanNote = chairmanNote;
  item.decidedAt = decidedAt;
  item.signedHash = signedHash;

  approvalStore.set(id, item);
  return item;
}

// 3D Virtual Office & AI Workforce Telemetry Service
// Meets REQ-002: Spatial 3D Office State & 10 AI Agent Telemetry

export type AgentDivision = 'TECH_FACTORY' | 'BIZ_OPS';
export type AgentDeskZone =
  | 'ARCHITECT_DESK'
  | 'ENGINEERING_BAY'
  | 'QA_PODIUM'
  | 'GROWTH_STUDIO'
  | 'CONCIERGE_LOBBY'
  | 'GOVERNANCE_VAULT';
export type AgentStatus =
  | 'IDLE'
  | 'WORKING'
  | 'WAITING_CHAIRMAN_APPROVAL'
  | 'IN_MEETING'
  | 'BLOCKED_BY_HARNESS';

export interface Vector3Position {
  x: number;
  y: number;
  z: number;
}

export interface AgentEmployeeState {
  agentCode: string;
  displayName: string;
  division: AgentDivision;
  roleTitle: string;
  accentColorHex: string;
  deskZone: AgentDeskZone;
  currentStatus: AgentStatus;
  currentTaskSummary: string;
  position: Vector3Position;
}

export interface GitOfficeState {
  currentStage: string;
  lastCheckpoint: string;
  uncommittedChanges: number;
}

export interface KpiWallMetrics {
  activeProjects: number;
  pendingApprovals: number;
  monthlyExpenseVnd: number;
  annualRevenueVnd: number;
}

export interface OfficeStateResponse {
  agents: AgentEmployeeState[];
  cyberpunkLightsOff: boolean;
  gitState: GitOfficeState;
  kpiMetrics: KpiWallMetrics;
  timestamp: string;
}

const DEFAULT_AGENTS: AgentEmployeeState[] = [
  {
    agentCode: '00-chief-architect',
    displayName: 'Chief Architect',
    division: 'TECH_FACTORY',
    roleTitle: 'Principal System Architect',
    accentColorHex: '#0DEEF3',
    deskZone: 'ARCHITECT_DESK',
    currentStatus: 'WORKING',
    currentTaskSummary: 'Giám sát niêm phong hợp đồng & kiến trúc hệ thống',
    position: { x: -4.0, y: 0.0, z: 3.0 }
  },
  {
    agentCode: '01-backend-data-engineer',
    displayName: 'Backend Engineer',
    division: 'TECH_FACTORY',
    roleTitle: 'Senior Data & API Engineer',
    accentColorHex: '#7928CA',
    deskZone: 'ENGINEERING_BAY',
    currentStatus: 'WORKING',
    currentTaskSummary: 'Triển khai Ledger Gate & RFC 9457 APIs',
    position: { x: -2.0, y: 0.0, z: 3.0 }
  },
  {
    agentCode: '02-frontend-artisan',
    displayName: 'Frontend Artisan',
    division: 'TECH_FACTORY',
    roleTitle: 'Spatial 3D & UI Specialist',
    accentColorHex: '#FF007A',
    deskZone: 'ENGINEERING_BAY',
    currentStatus: 'WORKING',
    currentTaskSummary: 'Dựng Webiz 3D Virtual Office & Live Gym Sandbox',
    position: { x: 0.0, y: 0.0, z: 3.0 }
  },
  {
    agentCode: '03-secops-auditor',
    displayName: 'SecOps Auditor',
    division: 'TECH_FACTORY',
    roleTitle: 'Lead Security & Secret Scanner',
    accentColorHex: '#FFB800',
    deskZone: 'ENGINEERING_BAY',
    currentStatus: 'IDLE',
    currentTaskSummary: 'Sẵn sàng kiểm toán an ninh và SQL guards',
    position: { x: 2.0, y: 0.0, z: 3.0 }
  },
  {
    agentCode: '04-release-sre',
    displayName: 'Release SRE',
    division: 'TECH_FACTORY',
    roleTitle: 'Infrastructure & CI/CD Engineer',
    accentColorHex: '#00F5A0',
    deskZone: 'ENGINEERING_BAY',
    currentStatus: 'IDLE',
    currentTaskSummary: 'Sẵn sàng đóng gói Docker và pipeline GitHub Actions',
    position: { x: 4.0, y: 0.0, z: 3.0 }
  },
  {
    agentCode: '99-inquisitor-qa',
    displayName: 'Inquisitor QA',
    division: 'TECH_FACTORY',
    roleTitle: 'Lead Verification & Blackbox Judge',
    accentColorHex: '#EF4444',
    deskZone: 'QA_PODIUM',
    currentStatus: 'WORKING',
    currentTaskSummary: 'Thẩm định ma trận truy vết và ký biên nhận mật mã',
    position: { x: 6.0, y: 0.0, z: 3.0 }
  },
  {
    agentCode: 'B01-growth-director',
    displayName: 'Growth Director',
    division: 'BIZ_OPS',
    roleTitle: 'Head of Content & Video Automation',
    accentColorHex: '#FF007A',
    deskZone: 'GROWTH_STUDIO',
    currentStatus: 'WORKING',
    currentTaskSummary: 'Sản xuất video ngắn TikTok/Reels tự động Remotion',
    position: { x: -4.0, y: 0.0, z: -3.0 }
  },
  {
    agentCode: 'B02-lead-concierge',
    displayName: 'Lead Concierge',
    division: 'BIZ_OPS',
    roleTitle: 'AI Receptionist & 5-Min Sandbox Lead',
    accentColorHex: '#0DEEF3',
    deskZone: 'CONCIERGE_LOBBY',
    currentStatus: 'WORKING',
    currentTaskSummary: 'Trực tuyến 24/7 tiếp nhận khách và sinh Live Sandbox',
    position: { x: -1.5, y: 0.0, z: -3.0 }
  },
  {
    agentCode: 'B03-legal-counsel',
    displayName: 'Legal Counsel',
    division: 'BIZ_OPS',
    roleTitle: 'Chief Legal & Compliance Officer',
    accentColorHex: '#7928CA',
    deskZone: 'GOVERNANCE_VAULT',
    currentStatus: 'WORKING',
    currentTaskSummary: 'Giám sát tuân thủ Nghị định 13/2023/NĐ-CP và hợp đồng',
    position: { x: 1.5, y: 0.0, z: -3.0 }
  },
  {
    agentCode: 'B04-ledger-controller',
    displayName: 'Ledger Controller',
    division: 'BIZ_OPS',
    roleTitle: 'Financial & Cashflow Controller',
    accentColorHex: '#10B981',
    deskZone: 'GOVERNANCE_VAULT',
    currentStatus: 'WORKING',
    currentTaskSummary: 'Kiểm soát trần chi phí 1 triệu/tháng và khóa cọc 50%',
    position: { x: 4.0, y: 0.0, z: -3.0 }
  }
];

let globalCyberpunkLightsOff = false;

export function setCyberpunkLightsOff(enabled: boolean): boolean {
  globalCyberpunkLightsOff = enabled;
  return globalCyberpunkLightsOff;
}

export function getOfficeState(overrideLightsOff?: boolean): OfficeStateResponse {
  const isLightsOff = overrideLightsOff ?? globalCyberpunkLightsOff;
  return {
    agents: DEFAULT_AGENTS,
    cyberpunkLightsOff: isLightsOff,
    gitState: {
      currentStage: 'stage-01-backend-ready',
      lastCheckpoint: 'stage-00-contracts-sealed',
      uncommittedChanges: 0
    },
    kpiMetrics: {
      activeProjects: 3,
      pendingApprovals: 2,
      monthlyExpenseVnd: 350000,
      annualRevenueVnd: 42000000
    },
    timestamp: new Date().toISOString()
  };
}

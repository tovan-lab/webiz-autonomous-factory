-- Webiz Autonomous Software Factory - Initial Seed Data (v5.0)

-- 1. SEED 10 AI AGENTS (6 TECH FACTORY + 4 BIZOPS)
INSERT INTO "AgentEmployee" ("id", "agentCode", "displayName", "division", "roleTitle", "accentColorHex", "deskZone", "currentStatus", "currentTaskSummary", "positionX", "positionY", "positionZ")
VALUES
  ('agent_00', '00-chief-architect', 'Chief Architect', 'TECH_FACTORY', 'Principal System Architect', '#0DEEF3', 'ARCHITECT_DESK', 'WORKING', 'Giám sát niêm phong hợp đồng & kiến trúc hệ thống', -4.0, 0.0, 3.0),
  ('agent_01', '01-backend-data-engineer', 'Backend Engineer', 'TECH_FACTORY', 'Senior Data & API Engineer', '#7928CA', 'ENGINEERING_BAY', 'WORKING', 'Triển khai Ledger Gate & RFC 9457 APIs', -2.0, 0.0, 3.0),
  ('agent_02', '02-frontend-artisan', 'Frontend Artisan', 'TECH_FACTORY', 'Spatial 3D & UI Specialist', '#FF007A', 'ENGINEERING_BAY', 'WORKING', 'Dựng Webiz 3D Virtual Office & Live Gym Sandbox', 0.0, 0.0, 3.0),
  ('agent_03', '03-secops-auditor', 'SecOps Auditor', 'TECH_FACTORY', 'Lead Security & Secret Scanner', '#FFB800', 'ENGINEERING_BAY', 'IDLE', 'Sẵn sàng kiểm toán an ninh và SQL guards', 2.0, 0.0, 3.0),
  ('agent_04', '04-release-sre', 'Release SRE', 'TECH_FACTORY', 'Infrastructure & CI/CD Engineer', '#00F5A0', 'ENGINEERING_BAY', 'IDLE', 'Sẵn sàng đóng gói Docker và pipeline GitHub Actions', 4.0, 0.0, 3.0),
  ('agent_99', '99-inquisitor-qa', 'Inquisitor QA', 'TECH_FACTORY', 'Lead Verification & Blackbox Judge', '#EF4444', 'QA_PODIUM', 'WORKING', 'Thẩm định ma trận truy vết và ký biên nhận mật mã', 6.0, 0.0, 3.0),
  ('agent_b01', 'B01-growth-director', 'Growth Director', 'BIZ_OPS', 'Head of Content & Video Automation', '#FF007A', 'GROWTH_STUDIO', 'WORKING', 'Sản xuất video ngắn TikTok/Reels tự động Remotion', -4.0, 0.0, -3.0),
  ('agent_b02', 'B02-lead-concierge', 'Lead Concierge', 'BIZ_OPS', 'AI Receptionist & 5-Min Sandbox Lead', '#0DEEF3', 'CONCIERGE_LOBBY', 'WORKING', 'Trực tuyến 24/7 tiếp nhận khách và sinh Live Sandbox', -1.5, 0.0, -3.0),
  ('agent_b03', 'B03-legal-counsel', 'Legal Counsel', 'BIZ_OPS', 'Chief Legal & Compliance Officer', '#7928CA', 'GOVERNANCE_VAULT', 'WORKING', 'Giám sát tuân thủ Nghị định 13/2023/NĐ-CP và hợp đồng', 1.5, 0.0, -3.0),
  ('agent_b04', 'B04-ledger-controller', 'Ledger Controller', 'BIZ_OPS', 'Financial & Cashflow Controller', '#10B981', 'GOVERNANCE_VAULT', 'WORKING', 'Kiểm soát trần chi phí 1 triệu/tháng và khóa cọc 50%', 4.0, 0.0, -3.0)
ON CONFLICT ("agentCode") DO UPDATE SET
  "currentStatus" = EXCLUDED."currentStatus",
  "currentTaskSummary" = EXCLUDED."currentTaskSummary";

-- 2. SEED MONTHLY BUDGET MONITOR (2026-10)
INSERT INTO "MonthlyBudgetMonitor" ("id", "monthYear", "totalRevenueVnd", "totalExpenseVnd", "expenseCapVnd", "warningThresholdVnd", "annualCumulativeRevenueVnd", "annualRevenueCapVnd", "isWarningTriggered", "isHardCapExceeded", "updatedAt")
VALUES
  ('mbm_2026_10', '2026-10', 5900000, 350000, 1000000, 700000, 42000000, 1000000000, false, false, CURRENT_TIMESTAMP)
ON CONFLICT ("monthYear") DO NOTHING;

-- 3. SEED SAMPLE LEAD & CLIENT PROJECT FOR GYM 3D SANDBOX
INSERT INTO "Lead" ("id", "fullName", "phoneNumber", "email", "brandName", "sourceChannel", "industry", "preferredTier", "notes", "isQualified")
VALUES
  ('lead_iron_01', 'Nguyễn Văn Hùng', '0912345678', 'hung@ironhouse.vn', 'Iron House Fitness', 'ZALO_OA', 'GYM_FITNESS', 'GROWTH_AI', 'Quan tâm gói 5.9tr kèm chatbot AI và giao diện 3D', true)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ClientProject" ("id", "leadId", "projectCode", "clientName", "brandName", "industry", "packageTier", "pipelineStage", "sandboxBrandConfig", "setupFeeVnd", "monthlyRetainerVnd", "deposit50AmountVnd", "deposit50PaidAt", "final50AmountVnd", "final50PaidAt")
VALUES
  ('prj_iron_01', 'lead_iron_01', 'PRJ-2026-GYM-001', 'Nguyễn Văn Hùng', 'Iron House Fitness', 'GYM_FITNESS', 'GROWTH_AI', 'SANDBOX_READY', '{"brandName": "Iron House Fitness", "primaryColor": "#0DEEF3", "secondaryColor": "#FF007A", "heroTagline": "Bứt phá giới hạn hình thể cùng không gian 3D hiện đại", "hotlineOrZalo": "0912345678"}', 5900000, 490000, 2950000, NULL, 2950000, NULL)
ON CONFLICT ("projectCode") DO NOTHING;

-- 4. SEED TENANT CHATBOT QUOTA FOR PRJ_IRON_01
INSERT INTO "TenantChatbotQuota" ("id", "projectId", "monthlyMessageLimit", "messagesUsed", "topUpBalanceMessages", "hardCapReached", "resetAt")
VALUES
  ('quota_iron_01', 'prj_iron_01', 3000, 120, 0, false, CURRENT_TIMESTAMP + INTERVAL '30 days')
ON CONFLICT ("projectId") DO NOTHING;

-- 5. SEED INITIAL CHAIRMAN APPROVAL ITEMS
INSERT INTO "ChairmanApprovalItem" ("id", "projectId", "gateType", "title", "threeLineSummary", "previewUrl", "payloadJson", "riskWarning", "submittedByAgent", "status")
VALUES
  ('appr_01', 'prj_iron_01', 'GATE_2_SANDBOX_DEMO', 'Duyệt bản Live 3D Sandbox cho Iron House Fitness', '1. Khách hàng: Nguyễn Văn Hùng (Iron House Fitness)\n2. Đã tiêm thương hiệu màu #0DEEF3 và câu định vị\n3. Trạng thái: Sẵn sàng gửi khách trải nghiệm', '/sandbox/gym?brand=IronHouseFitness&primaryColor=%230DEEF3', '{"brand": "Iron House Fitness", "package": "GROWTH_AI"}', NULL, 'B02-lead-concierge', 'PENDING'),
  ('appr_02', NULL, 'DAILY_MARKETING_VIDEO', 'Duyệt Video Remotion: Trụ sở 3D Webiz Cyberpunk Lights Off', '1. Video 45s giới thiệu quy trình 10 AI Agents làm việc ban đêm\n2. Âm thanh Synthwave bản quyền miễn phí\n3. Mục tiêu: Kéo 50 leads chủ phòng Gym/Spa về Zalo OA', 'https://video.webiz.vn/previews/cyberpunk-night.mp4', '{"durationSeconds": 45, "platform": "TIKTOK"}', NULL, 'B01-growth-director', 'PENDING')
ON CONFLICT ("id") DO NOTHING;

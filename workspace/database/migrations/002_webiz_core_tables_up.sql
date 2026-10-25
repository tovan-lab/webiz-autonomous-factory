-- Migration 002: Webiz Core Tables Up (PostgreSQL 16)
-- Matching contracts/schema.prisma v5.0

CREATE TYPE "AgentDivision" AS ENUM ('TECH_FACTORY', 'BIZ_OPS');
CREATE TYPE "AgentDeskZone" AS ENUM ('ARCHITECT_DESK', 'ENGINEERING_BAY', 'QA_PODIUM', 'GROWTH_STUDIO', 'CONCIERGE_LOBBY', 'GOVERNANCE_VAULT');
CREATE TYPE "AgentStatus" AS ENUM ('IDLE', 'WORKING', 'WAITING_CHAIRMAN_APPROVAL', 'IN_MEETING', 'BLOCKED_BY_HARNESS');

CREATE TABLE IF NOT EXISTS "AgentEmployee" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "agentCode" TEXT NOT NULL UNIQUE,
  "displayName" TEXT NOT NULL,
  "division" "AgentDivision" NOT NULL,
  "roleTitle" TEXT NOT NULL,
  "accentColorHex" TEXT NOT NULL DEFAULT '#0DEEF3',
  "deskZone" "AgentDeskZone" NOT NULL,
  "currentStatus" "AgentStatus" NOT NULL DEFAULT 'IDLE',
  "currentTaskSummary" TEXT,
  "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  "positionZ" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  "avatarUrl" TEXT,
  "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "AgentEmployee_division_currentStatus_idx" ON "AgentEmployee"("division", "currentStatus");
CREATE INDEX IF NOT EXISTS "AgentEmployee_deskZone_idx" ON "AgentEmployee"("deskZone");

CREATE TABLE IF NOT EXISTS "AgentTelemetryLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "agentId" TEXT NOT NULL REFERENCES "AgentEmployee"("id") ON DELETE CASCADE,
  "agentCode" TEXT NOT NULL,
  "logLevel" TEXT NOT NULL DEFAULT 'INFO',
  "message" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "AgentTelemetryLog_agentCode_createdAt_idx" ON "AgentTelemetryLog"("agentCode", "createdAt");
CREATE INDEX IF NOT EXISTS "AgentTelemetryLog_logLevel_createdAt_idx" ON "AgentTelemetryLog"("logLevel", "createdAt");

CREATE TYPE "LeadSourceChannel" AS ENUM ('FACEBOOK_MESSENGER', 'ZALO_OA', 'WEB_FORM', 'SCHEDULED_CALL');
CREATE TYPE "IndustryType" AS ENUM ('GYM_FITNESS', 'SPA_BEAUTY', 'HOMESTAY_TRAVEL', 'FNB_RESTAURANT');
CREATE TYPE "PackageTier" AS ENUM ('STARTER_3D', 'GROWTH_AI', 'PRO_AUTOMATION');
CREATE TYPE "PipelineStage" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'SANDBOX_READY', 'QUOTED', 'CONTRACT_SENT', 'DEPOSIT_50_PAID', 'IN_PRODUCTION', 'DELIVERED_PAID_100', 'LOST');

CREATE TABLE IF NOT EXISTS "Lead" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  "email" TEXT,
  "brandName" TEXT NOT NULL,
  "sourceChannel" "LeadSourceChannel" NOT NULL DEFAULT 'WEB_FORM',
  "industry" "IndustryType" NOT NULL DEFAULT 'GYM_FITNESS',
  "preferredTier" "PackageTier" NOT NULL DEFAULT 'GROWTH_AI',
  "notes" TEXT,
  "isQualified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Lead_phoneNumber_idx" ON "Lead"("phoneNumber");
CREATE INDEX IF NOT EXISTS "Lead_industry_sourceChannel_idx" ON "Lead"("industry", "sourceChannel");
CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead"("createdAt");

CREATE TABLE IF NOT EXISTS "ClientProject" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "leadId" TEXT REFERENCES "Lead"("id") ON DELETE SET NULL,
  "projectCode" TEXT NOT NULL UNIQUE,
  "clientName" TEXT NOT NULL,
  "brandName" TEXT NOT NULL,
  "industry" "IndustryType" NOT NULL DEFAULT 'GYM_FITNESS',
  "packageTier" "PackageTier" NOT NULL DEFAULT 'GROWTH_AI',
  "pipelineStage" "PipelineStage" NOT NULL DEFAULT 'NEW',
  "sandboxBrandConfig" JSONB NOT NULL,
  "setupFeeVnd" INTEGER NOT NULL DEFAULT 5900000,
  "monthlyRetainerVnd" INTEGER NOT NULL DEFAULT 490000,
  "deposit50AmountVnd" INTEGER NOT NULL DEFAULT 2950000,
  "deposit50PaidAt" TIMESTAMP(3),
  "final50AmountVnd" INTEGER NOT NULL DEFAULT 2950000,
  "final50PaidAt" TIMESTAMP(3),
  "monthlyRetainerDueAt" TIMESTAMP(3),
  "lastRetainerPaidAt" TIMESTAMP(3),
  "subdomain" TEXT,
  "customDomain" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "ClientProject_pipelineStage_idx" ON "ClientProject"("pipelineStage");
CREATE INDEX IF NOT EXISTS "ClientProject_industry_packageTier_idx" ON "ClientProject"("industry", "packageTier");
CREATE INDEX IF NOT EXISTS "ClientProject_deposit_final_idx" ON "ClientProject"("deposit50PaidAt", "final50PaidAt");

CREATE TYPE "ApprovalGateType" AS ENUM ('GATE_1_QUOTE', 'GATE_2_SANDBOX_DEMO', 'GATE_3_CONTRACT_INVOICE', 'GATE_4_HANDOVER_RELEASE', 'DAILY_MARKETING_VIDEO');
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REVISION_REQUESTED');

CREATE TABLE IF NOT EXISTS "ChairmanApprovalItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT REFERENCES "ClientProject"("id") ON DELETE CASCADE,
  "gateType" "ApprovalGateType" NOT NULL,
  "title" TEXT NOT NULL,
  "threeLineSummary" TEXT NOT NULL,
  "previewUrl" TEXT,
  "payloadJson" JSONB NOT NULL,
  "riskWarning" TEXT,
  "submittedByAgent" TEXT NOT NULL,
  "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
  "chairmanNote" TEXT,
  "signedHash" TEXT,
  "decidedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "ChairmanApprovalItem_status_gateType_idx" ON "ChairmanApprovalItem"("status", "gateType");
CREATE INDEX IF NOT EXISTS "ChairmanApprovalItem_submittedByAgent_createdAt_idx" ON "ChairmanApprovalItem"("submittedByAgent", "createdAt");

CREATE TYPE "LedgerEntryType" AS ENUM (
  'REVENUE_SETUP_DEPOSIT_50',
  'REVENUE_SETUP_FINAL_50',
  'REVENUE_MONTHLY_RETAINER',
  'REVENUE_CHATBOT_TOPUP',
  'EXPENSE_AI_API',
  'EXPENSE_INFRA_HOSTING'
);

CREATE TABLE IF NOT EXISTS "LedgerTransaction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT REFERENCES "ClientProject"("id") ON DELETE SET NULL,
  "entryType" "LedgerEntryType" NOT NULL,
  "amountVnd" INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  "referenceCode" TEXT,
  "payerOrVendor" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "LedgerTransaction_entryType_occurredAt_idx" ON "LedgerTransaction"("entryType", "occurredAt");
CREATE INDEX IF NOT EXISTS "LedgerTransaction_projectId_entryType_idx" ON "LedgerTransaction"("projectId", "entryType");

CREATE TABLE IF NOT EXISTS "MonthlyBudgetMonitor" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "monthYear" TEXT NOT NULL UNIQUE,
  "totalRevenueVnd" INTEGER NOT NULL DEFAULT 0,
  "totalExpenseVnd" INTEGER NOT NULL DEFAULT 0,
  "expenseCapVnd" INTEGER NOT NULL DEFAULT 1000000,
  "warningThresholdVnd" INTEGER NOT NULL DEFAULT 700000,
  "annualCumulativeRevenueVnd" BIGINT NOT NULL DEFAULT 0,
  "annualRevenueCapVnd" BIGINT NOT NULL DEFAULT 1000000000,
  "isWarningTriggered" BOOLEAN NOT NULL DEFAULT false,
  "isHardCapExceeded" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "MonthlyBudgetMonitor_monthYear_idx" ON "MonthlyBudgetMonitor"("monthYear");

CREATE TABLE IF NOT EXISTS "TenantChatbotQuota" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL UNIQUE REFERENCES "ClientProject"("id") ON DELETE CASCADE,
  "monthlyMessageLimit" INTEGER NOT NULL DEFAULT 3000,
  "messagesUsed" INTEGER NOT NULL DEFAULT 0,
  "topUpBalanceMessages" INTEGER NOT NULL DEFAULT 0,
  "hardCapReached" BOOLEAN NOT NULL DEFAULT false,
  "resetAt" TIMESTAMP(3) NOT NULL,
  "lastTopUpAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "TenantChatbotQuota_hardCapReached_idx" ON "TenantChatbotQuota"("hardCapReached");

CREATE TYPE "AlertSeverity" AS ENUM ('CRITICAL', 'WARNING');
CREATE TYPE "AlertCategory" AS ENUM (
  'EXPENSE_EXCEEDED',
  'QUOTA_EXCEEDED',
  'RETAINER_OVERDUE',
  'CUSTOMER_COMPLAINT_OR_5XX',
  'ANNUAL_REVENUE_THRESHOLD'
);

CREATE TABLE IF NOT EXISTS "AnomalyAlert" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT REFERENCES "ClientProject"("id") ON DELETE CASCADE,
  "category" "AlertCategory" NOT NULL,
  "severity" "AlertSeverity" NOT NULL DEFAULT 'WARNING',
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "metadata" JSONB,
  "isResolved" BOOLEAN NOT NULL DEFAULT false,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "AnomalyAlert_severity_isResolved_idx" ON "AnomalyAlert"("severity", "isResolved");
CREATE INDEX IF NOT EXISTS "AnomalyAlert_category_createdAt_idx" ON "AnomalyAlert"("category", "createdAt");

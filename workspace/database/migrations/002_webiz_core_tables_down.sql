-- @migration-contract-approved: CORE-ROLLBACK-002
-- Migration 002: Rollback Webiz Core Tables Down

DROP TABLE IF EXISTS "AnomalyAlert";
DROP TYPE IF EXISTS "AlertCategory";
DROP TYPE IF EXISTS "AlertSeverity";

DROP TABLE IF EXISTS "TenantChatbotQuota";
DROP TABLE IF EXISTS "MonthlyBudgetMonitor";
DROP TABLE IF EXISTS "LedgerTransaction";
DROP TYPE IF EXISTS "LedgerEntryType";

DROP TABLE IF EXISTS "ChairmanApprovalItem";
DROP TYPE IF EXISTS "ApprovalStatus";
DROP TYPE IF EXISTS "ApprovalGateType";

DROP TABLE IF EXISTS "ClientProject";
DROP TABLE IF EXISTS "Lead";
DROP TYPE IF EXISTS "PipelineStage";
DROP TYPE IF EXISTS "PackageTier";
DROP TYPE IF EXISTS "IndustryType";
DROP TYPE IF EXISTS "LeadSourceChannel";

DROP TABLE IF EXISTS "AgentTelemetryLog";
DROP TABLE IF EXISTS "AgentEmployee";
DROP TYPE IF EXISTS "AgentStatus";
DROP TYPE IF EXISTS "AgentDeskZone";
DROP TYPE IF EXISTS "AgentDivision";

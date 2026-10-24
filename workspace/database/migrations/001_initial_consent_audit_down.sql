-- @migration-contract-approved: INIT-ROLLBACK-001
DROP INDEX CONCURRENTLY IF EXISTS "ConsentAuditLog_subjectId_createdAt_idx";
DROP TABLE IF EXISTS "ConsentAuditLog";

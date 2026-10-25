CREATE TABLE IF NOT EXISTS "ConsentAuditLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "subjectId" TEXT NOT NULL,
  "consentType" TEXT NOT NULL,
  "granted" BOOLEAN NOT NULL,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "ConsentAuditLog_subjectId_createdAt_idx"
  ON "ConsentAuditLog"("subjectId", "createdAt");

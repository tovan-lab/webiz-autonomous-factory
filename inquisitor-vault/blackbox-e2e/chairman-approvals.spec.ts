import { describe, it, expect } from 'vitest';
import { getApprovalQueue, decideApprovalItem } from '../../workspace/backend/src/approvals.service';

describe('REQ-003: Chairman 1-Touch 30-Minute Approval Deck (4 Gates + Daily Video)', () => {
  it('retrieves approval queue with pending items across gates (REQ-003)', () => {
    const queue = getApprovalQueue();
    expect(queue.items.length).toBeGreaterThanOrEqual(1);
    expect(queue.pendingCount).toBeGreaterThanOrEqual(0);
  });

  it('records decision and generates SHA-256 cryptographic signed hash (REQ-003)', () => {
    const queue = getApprovalQueue();
    const target = queue.items[0];
    expect(target).toBeDefined();

    const decided = decideApprovalItem(target.id, 'APPROVED', 'Chấp thuận triển khai');
    expect('status' in decided).toBe(true);
    if ('status' in decided && typeof decided.status === 'string') {
      expect(decided.status).toBe('APPROVED');
      expect(decided.signedHash).toBeDefined();
      expect(decided.signedHash?.length).toBe(64); // SHA-256 hex string length
    }
  });
});

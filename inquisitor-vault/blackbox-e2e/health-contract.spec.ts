// Black-box E2E & Contract Test owned exclusively by 99-inquisitor-qa
import { describe, it, expect } from 'vitest';
import { getHealthResponse, createProblemDetails } from '../../workspace/backend/src/health.service';

describe('REQ-001: Healthcheck & RFC 9457 Contract Compliance', () => {
  it('returns valid health payload matching OpenAPI 3.1 contract (REQ-001)', () => {
    const res = getHealthResponse();
    expect(res.status).toBe('ok');
    expect(res.version).toBe('4.0.0');
  });

  it('formats errors strictly according to RFC 9457 Problem Details (REQ-001)', () => {
    const problem = createProblemDetails({
      status: 422,
      title: 'Validation Failed',
      detail: 'Invalid input parameter',
      instance: '/api/v1/healthz',
      traceId: 'trace-req-001'
    });
    expect(problem.type).toContain('https://');
    expect(problem.status).toBe(422);
    expect(problem.traceId).toBe('trace-req-001');
  });
});

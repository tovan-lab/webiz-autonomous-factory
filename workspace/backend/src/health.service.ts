// Health and RFC 9457 Problem Details Service
// Compliant with contracts/openapi.yaml v5.0.0

export interface HealthPayload {
  status: 'ok';
  version: string;
  timestamp: string;
}

export interface ProblemDetailsRFC9457 {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  traceId: string;
}

export function getHealthResponse(): HealthPayload {
  return {
    status: 'ok',
    version: '4.0.0',
    timestamp: new Date().toISOString()
  };
}

export function createProblemDetails(params: {
  status: number;
  title: string;
  detail: string;
  instance: string;
  traceId: string;
  type?: string;
}): ProblemDetailsRFC9457 {
  return {
    type: params.type ?? `https://httpstatuses.io/${params.status}`,
    title: params.title,
    status: params.status,
    detail: params.detail,
    instance: params.instance,
    traceId: params.traceId
  };
}

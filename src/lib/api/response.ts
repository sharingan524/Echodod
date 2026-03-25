/**
 * Standard JSON response helpers for API routes.
 *
 * Success: { data, meta: { timestamp, requestId } }
 * Error:   { error, meta: { timestamp, requestId } }
 */

type ResponseMeta = {
  timestamp: string;
  requestId: string;
};

type ErrorPayload = {
  message: string;
  code: string;
  details?: Record<string, unknown>;
};

const requestIdMap = new WeakMap<Request, string>();

function generateRequestId() {
  // `crypto.randomUUID()` is available in Node 18+ and modern runtimes.
  return crypto.randomUUID();
}

export function getRequestId(request: Request) {
  const existing = requestIdMap.get(request);
  if (existing) return existing;

  const fromHeader = request.headers.get("x-request-id");
  const requestId = fromHeader || generateRequestId();
  requestIdMap.set(request, requestId);
  return requestId;
}

export function getMeta(request: Request): ResponseMeta {
  return {
    timestamp: new Date().toISOString(),
    requestId: getRequestId(request),
  };
}

export function jsonOk<T>(request: Request, data: T, init?: ResponseInit) {
  const meta = getMeta(request);
  const headers = new Headers(init?.headers);
  headers.set("x-request-id", meta.requestId);
  return Response.json(
    { data, meta },
    {
      ...init,
      headers,
    }
  );
}

export function jsonCreated<T>(request: Request, data: T, init?: ResponseInit) {
  return jsonOk(request, data, { ...init, status: 201 });
}

export function jsonError(
  request: Request,
  error: ErrorPayload,
  status: number,
  init?: ResponseInit
) {
  const meta = getMeta(request);
  const headers = new Headers(init?.headers);
  headers.set("x-request-id", meta.requestId);
  return Response.json(
    { error, meta },
    {
      ...init,
      status,
      headers,
    }
  );
}

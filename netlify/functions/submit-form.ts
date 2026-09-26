import type { Config } from '@netlify/functions';
import { validateFormBody } from '../lib/form-validation.ts';

const responseHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
};

const jsonResponse = (status: number, body: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: responseHeaders });

export default async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response(null, {
      status: 405,
      headers: { ...responseHeaders, Allow: 'POST' },
    });
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin !== requestUrl.origin) {
    return jsonResponse(403, { error: 'forbidden_origin' });
  }

  const contentType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  if (contentType !== 'application/x-www-form-urlencoded') {
    return jsonResponse(415, { error: 'unsupported_media_type' });
  }

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > 12_000) {
    return jsonResponse(413, { error: 'payload_too_large' });
  }

  const result = validateFormBody(await request.text());
  if (!result.ok) {
    if (result.spam) return jsonResponse(200, { status: 'accepted' });
    return jsonResponse(result.status, { error: result.code });
  }

  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const page = new URL(referer);
      if (page.origin === requestUrl.origin)
        result.payload.set('pagina', page.href.slice(0, 2_048));
    } catch {
      // El referer es contexto opcional; un valor inválido no invalida datos legítimos.
    }
  }

  const submissionUrl = new URL('/', requestUrl.origin);
  let upstream: Response;
  try {
    upstream = await fetch(submissionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: result.payload.toString(),
      redirect: 'manual',
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    return jsonResponse(502, { error: 'form_service_unavailable' });
  }

  if (!upstream.ok && ![301, 302, 303].includes(upstream.status)) {
    return jsonResponse(502, { error: 'form_service_rejected' });
  }

  return jsonResponse(202, { status: 'accepted' });
};

export const config: Config = {
  path: '/api/formulario',
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ['ip', 'domain'],
  },
};

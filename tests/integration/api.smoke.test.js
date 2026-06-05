import { describe, expect, it } from 'vitest';

const baseUrl = process.env.INTEGRATION_URL?.replace(/\/$/, '');
const runIntegration = Boolean(baseUrl);

describe.skipIf(!runIntegration)('API en ejecución (integración)', () => {
  it('GET /health responde ok con base de datos', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.db).toBe('connected');
  });

  it('GET / confirma que el backend está en línea', async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('online');
  });

  it('GET /openapi.json devuelve el contrato OpenAPI', async () => {
    const res = await fetch(`${baseUrl}/openapi.json`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('openapi');
  });
});

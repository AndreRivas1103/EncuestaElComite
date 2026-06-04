import { describe, expect, it, vi } from 'vitest';

vi.mock('@server/db/connection.js', () => ({ default: {} }));

import { normalizeRoute } from '@server/metrics.js';

describe('normalizeRoute', () => {
  it('normaliza raíz y rutas vacías', () => {
    expect(normalizeRoute()).toBe('/');
    expect(normalizeRoute('/')).toBe('/');
  });

  it('reemplaza IDs numéricos y UUID', () => {
    expect(normalizeRoute('/encuestas/42/opciones')).toBe('/encuestas/:id/opciones');
    expect(normalizeRoute('/voluntarios/a1b2c3d4-e5f6-7890-abcd-ef1234567890')).toBe(
      '/voluntarios/:id'
    );
  });

  it('reemplaza segmentos con correo', () => {
    expect(normalizeRoute('/resultados/usuario@ejemplo.com')).toBe('/resultados/:id');
  });

  it('conserva segmentos estáticos', () => {
    expect(normalizeRoute('/api/encuestas/activa')).toBe('/api/encuestas/activa');
  });
});

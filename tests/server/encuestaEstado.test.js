import { describe, expect, it } from 'vitest';
import { calcularEstado } from '@server/utils/encuestaEstado.js';

describe('calcularEstado', () => {
  const apertura = '2026-01-01';
  const cierre = '2026-12-31';

  it('devuelve programada antes de la apertura', () => {
    expect(calcularEstado(apertura, cierre, new Date(2025, 11, 1))).toBe('programada');
  });

  it('devuelve activa dentro del rango', () => {
    expect(calcularEstado(apertura, cierre, new Date(2026, 5, 15))).toBe('activa');
  });

  it('devuelve activa el día de apertura y cierre', () => {
    expect(calcularEstado(apertura, cierre, new Date(2026, 0, 1))).toBe('activa');
    expect(calcularEstado(apertura, cierre, new Date(2026, 11, 31, 12, 0, 0))).toBe('activa');
  });

  it('devuelve cerrada después del cierre', () => {
    expect(calcularEstado(apertura, cierre, new Date(2027, 0, 1))).toBe('cerrada');
  });
});

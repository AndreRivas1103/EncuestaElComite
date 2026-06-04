import { describe, expect, it } from 'vitest';
import { generarContrasena } from '@server/utils/voluntarioContrasena.js';

describe('generarContrasena', () => {
  it('combina prefijo, sufijo y año', () => {
    expect(generarContrasena('  Ana María ', '1234567890', 2026)).toBe('ana8902026');
  });

  it('usa minúsculas en el prefijo del nombre', () => {
    expect(generarContrasena('PEDRO', '100003', 2025)).toBe('ped0032025');
  });
});

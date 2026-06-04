import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockReq, createMockRes } from '../helpers/mockExpress.js';

vi.mock('@server/models/Resultados.js', () => ({
  default: {
    insertarResultadoCalculado: vi.fn(),
    findAll: vi.fn(),
    findByEmailAndPassword: vi.fn(),
    findPostByEmail: vi.fn(),
  },
}));

import Resultado from '@server/models/Resultados.js';
import {
  guardarResultado,
  obtenerResultadosPorCredenciales,
  obtenerResultadosPostPorCredenciales,
} from '@server/controllers/resultadosController.js';

describe('resultadosController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('guardarResultado', () => {
    it('responde 400 si faltan campos', async () => {
      const req = createMockReq({ body: { id_encuesta: 1 } });
      const res = createMockRes();

      await guardarResultado(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Datos incompletos');
      expect(Resultado.insertarResultadoCalculado).not.toHaveBeenCalled();
    });

    it('guarda y responde 201 con datos válidos', async () => {
      Resultado.insertarResultadoCalculado.mockResolvedValue({ tipo: 'pre' });
      const req = createMockReq({
        body: {
          id_encuesta: 1,
          correo_voluntario: 'a@test.com',
          contrasena: 'abc123',
          resultado: { tipo: 'pre', puntajes: [] },
        },
      });
      const res = createMockRes();

      await guardarResultado(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(Resultado.insertarResultadoCalculado).toHaveBeenCalledOnce();
    });
  });

  describe('obtenerResultadosPorCredenciales', () => {
    it('responde 400 sin correo o contraseña', async () => {
      const res = createMockRes();
      await obtenerResultadosPorCredenciales(createMockReq({ body: { correo: 'a@test.com' } }), res);
      expect(res.statusCode).toBe(400);
    });

    it('devuelve resultados con credenciales válidas', async () => {
      const datos = [{ id: 1 }];
      Resultado.findByEmailAndPassword.mockResolvedValue(datos);
      const res = createMockRes();
      const req = createMockReq({
        body: { correo: 'a@test.com', contrasena: 'clave' },
      });

      await obtenerResultadosPorCredenciales(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual(datos);
    });
  });

  describe('obtenerResultadosPostPorCredenciales', () => {
    it('responde 400 sin correo', async () => {
      const res = createMockRes();
      await obtenerResultadosPostPorCredenciales(createMockReq({ body: {} }), res);
      expect(res.statusCode).toBe(400);
    });
  });
});

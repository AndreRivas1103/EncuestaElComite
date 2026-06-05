import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockReq, createMockRes } from '../helpers/mockExpress.js';

vi.mock('@server/models/Encuesta.js', () => ({
  default: {
    findAll: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn(),
    findOne: vi.fn(),
  },
}));

import Encuesta from '@server/models/Encuesta.js';
import { crearEncuesta, programarEncuesta } from '@server/controllers/encuestaController.js';

describe('encuestaController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('crearEncuesta', () => {
    it('responde 400 sin usuario_id', async () => {
      const res = createMockRes();
      await crearEncuesta(createMockReq({ body: { titulo: 'Test' } }), res);
      expect(res.statusCode).toBe(400);
      expect(Encuesta.create).not.toHaveBeenCalled();
    });

    it('crea encuesta con usuario_id', async () => {
      const encuesta = { id: 1, titulo: 'Nueva' };
      Encuesta.create.mockResolvedValue(encuesta);
      const res = createMockRes();
      const req = createMockReq({ body: { usuario_id: 10, titulo: 'Nueva' } });

      await crearEncuesta(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toEqual(encuesta);
    });
  });

  describe('programarEncuesta', () => {
    it('responde 400 si faltan campos obligatorios', async () => {
      const res = createMockRes();
      await programarEncuesta(createMockReq({ body: { titulo: 'Solo título' } }), res);
      expect(res.statusCode).toBe(400);
      expect(res.body.detalles).toContain('Falta el usuario_id');
    });

    it('programa encuesta con datos completos', async () => {
      const creada = { id: 2, version: 'pre' };
      Encuesta.create.mockResolvedValue(creada);
      const res = createMockRes();
      const req = createMockReq({
        body: {
          titulo: 'Evento',
          usuario_id: 5,
          datos_encuesta: { preguntas: [] },
        },
      });

      await programarEncuesta(req, res);

      expect(res.statusCode).toBe(201);
      expect(Encuesta.create).toHaveBeenCalledWith(
        expect.objectContaining({ version: 'pre' })
      );
    });
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockReq, createMockRes } from '../helpers/mockExpress.js';

vi.mock('@server/models/Voluntario.js', () => ({
  default: {
    createWithValidation: vi.fn(),
    actualizarPostEventoSimple: vi.fn(),
  },
}));

import Voluntario from '@server/models/Voluntario.js';
import {
  registrarVoluntario,
  actualizarPostEvento,
  verificarCredenciales,
} from '@server/controllers/voluntarioController.js';

describe('voluntarioController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registrarVoluntario', () => {
    it('responde 400 si faltan campos obligatorios', async () => {
      const res = createMockRes();
      await registrarVoluntario(createMockReq({ body: { nombre_completo: 'Ana' } }), res);
      expect(res.statusCode).toBe(400);
    });

    it('registra voluntario válido', async () => {
      Voluntario.createWithValidation.mockResolvedValue({
        correo_electronico: 'ana@test.com',
        nombre_completo: 'Ana López',
        numero_identificacion: '123',
      });
      const res = createMockRes();
      const req = createMockReq({
        body: {
          nombre_completo: 'Ana López',
          numero_identificacion: '123',
          correo_electronico: 'ana@test.com',
        },
      });

      await registrarVoluntario(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.correo).toBe('ana@test.com');
    });
  });

  describe('actualizarPostEvento', () => {
    it('rechaza encuesta_post que no sea un array', async () => {
      const res = createMockRes();
      const req = createMockReq({
        body: { correo: 'a@test.com', encuesta_post: { invalido: true } },
      });

      await actualizarPostEvento(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Formato inválido');
    });
  });

  describe('verificarCredenciales', () => {
    it('responde 400 sin correo o identificación', async () => {
      const res = createMockRes();
      await verificarCredenciales(createMockReq({ body: { correo: 'a@test.com' } }), res);
      expect(res.statusCode).toBe(400);
    });
  });
});

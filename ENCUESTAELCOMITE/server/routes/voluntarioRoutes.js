import express from 'express';
import {
  registrarVoluntario,
  actualizarVoluntario,
  verificarVoluntario,
  actualizarPreEvento,
  verificarCredenciales // NUEVO IMPORT
} from '../controllers/voluntarioController.js';

const router = express.Router();
router.post('/voluntarios', registrarVoluntario);
router.put('/voluntarios/:correo', actualizarVoluntario);
router.post('/voluntarios/verificar', verificarVoluntario);
router.post('/voluntarios/actualizar-pre-evento', actualizarPreEvento);
router.post('/voluntarios/verificar-credenciales', verificarCredenciales); // NUEVA RUTA

export default router;
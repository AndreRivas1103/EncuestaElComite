import express from 'express';
import {
  registrarVoluntario,
  actualizarVoluntario,
  verificarVoluntario,
  actualizarPreEvento,
  verificarCredenciales,
  actualizarPostEvento 
} from '../controllers/voluntarioController.js';

const router = express.Router();
router.post('/voluntarios', registrarVoluntario);
router.put('/voluntarios/:correo', actualizarVoluntario);
router.post('/voluntarios/verificar', verificarVoluntario);
router.post('/voluntarios/actualizar-pre-evento', actualizarPreEvento);
router.post('/voluntarios/verificar-credenciales', verificarCredenciales);
router.post('/voluntarios/actualizar-post-evento', actualizarPostEvento); 

export default router;
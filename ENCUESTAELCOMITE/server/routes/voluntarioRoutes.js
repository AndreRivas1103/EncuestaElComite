import express from 'express';
import {
  registrarVoluntario,
  actualizarVoluntario,
  verificarVoluntario
} from '../controllers/voluntarioController.js';


const router = express.Router();
router.post('/voluntarios', registrarVoluntario);
router.put('/voluntarios/:correo', actualizarVoluntario);
router.post('/voluntarios/verificar', verificarVoluntario);

export default router;
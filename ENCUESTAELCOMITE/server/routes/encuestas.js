import { Router } from 'express';
import { 
  crearEncuesta,
  obtenerEncuestas,
  actualizarEncuesta
} from '../controllers/encuestaController.js';

const router = Router();

// Rutas básicas
router.post('/', crearEncuesta);
router.get('/', obtenerEncuestas);
router.put('/:id', actualizarEncuesta);

export default router;
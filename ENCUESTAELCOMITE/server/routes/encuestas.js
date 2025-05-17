import { Router } from 'express';
import { 
  crearEncuesta, 
  obtenerEncuestas,
  validarEncuesta
} from '../controllers/encuestaController.js';

const router = Router();

router.post('/', validarEncuesta, crearEncuesta);
router.get('/', obtenerEncuestas);

export default router;
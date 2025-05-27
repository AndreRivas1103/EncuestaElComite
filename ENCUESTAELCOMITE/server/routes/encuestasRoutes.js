import { Router } from 'express';
import { 
  crearEncuesta,
  programarEncuesta,
  obtenerEncuestaActiva,
  obtenerTodasEncuestas // NUEVA IMPORTACIÓN
} from '../controllers/encuestaController.js';

const router = Router();

// ======= RUTAs=======
router.get('/', obtenerTodasEncuestas);
router.post('/', crearEncuesta);
router.put('/:id', programarEncuesta);
router.get('/activa', obtenerEncuestaActiva);

export default router;
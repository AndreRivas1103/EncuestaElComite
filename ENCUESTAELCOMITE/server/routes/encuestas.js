import { Router } from 'express';
import { 
  crearEncuesta,
  programarEncuesta
} from '../controllers/encuestaController.js';

const router = Router();

// Ruta para crear encuesta
router.post('/', crearEncuesta);

// Ruta para programar encuesta
router.put('/:id', programarEncuesta);

export default router;
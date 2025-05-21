import { Router } from 'express';
import { 
  crearEncuesta,
  programarEncuesta,
  obtenerEncuestaActiva
} from '../controllers/encuestaController.js';

const router = Router();

// Ruta para crear encuesta
router.post('/', crearEncuesta);

// Ruta para programar encuesta
router.put('/:id', programarEncuesta);

// Ruta para mostrar encuesta disponible

// En encuestasRoutes.js
router.get('/activa', obtenerEncuestaActiva);

export default router;
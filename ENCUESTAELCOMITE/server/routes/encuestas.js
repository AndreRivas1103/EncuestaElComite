import { Router } from 'express';
import { 
  crearEncuesta,
  programarEncuesta,
  obtenerEncuestasActivas
} from '../controllers/encuestaController.js';

const router = Router();

// Ruta para crear encuesta
router.post('/', crearEncuesta);

// Ruta para programar encuesta
router.put('/:id', programarEncuesta);

// Ruta para mostrar encuesta disponible
router.get('/encuestas/activas', obtenerEncuestasActivas);

export default router;
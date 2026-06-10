// encuestaRoutes.js
import express from 'express';
import {
  obtenerTodasEncuestas,
  crearEncuesta,
  obtenerEncuestaActiva,
  programarEncuesta,
  obtenerEncuestaPorId,
  eliminarEncuesta
} from '../controllers/encuestaController.js';

const router = express.Router();

// Rutas para encuestas
router.get('/', obtenerTodasEncuestas);
router.post('/', crearEncuesta);
router.post('/programar', programarEncuesta);
router.get('/activa', obtenerEncuestaActiva);
router.delete('/:id', eliminarEncuesta);
router.put('/:id', programarEncuesta);
router.get('/:id', obtenerEncuestaPorId);

export default router;
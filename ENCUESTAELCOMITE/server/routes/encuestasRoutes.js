// encuestaRoutes.js
import express from 'express';
import {
  obtenerTodasEncuestas,
  crearEncuesta,
  obtenerEncuestaActiva,
  programarEncuesta,
  obtenerEncuestaPorId
} from '../controllers/encuestaController.js';

const router = express.Router();

// Rutas para encuestas
router.get('/', obtenerTodasEncuestas);
router.post('/', crearEncuesta);
router.get('/activa', obtenerEncuestaActiva);
router.post('/programar/:id?', programarEncuesta);
router.get('/:id', obtenerEncuestaPorId); // Nueva ruta para obtener por ID

export default router;
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
router.put('/:id', programarEncuesta); // Para permitir actualización por ID
router.get('/:id', obtenerEncuestaPorId); // Nueva ruta para obtener por ID

export default router;
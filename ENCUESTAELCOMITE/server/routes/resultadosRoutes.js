import express from 'express';
import {
  guardarResultado,
  obtenerResultadosPorVoluntario
} from '../controllers/resultadosController.js';

const router = express.Router();

// Guardar un nuevo resultado (usando la función PostgreSQL)
router.post('/resultados', guardarResultado);

// Obtener resultados por voluntario
router.get('/voluntarios/:correo',   obtenerResultadosPorVoluntario);

export default router;
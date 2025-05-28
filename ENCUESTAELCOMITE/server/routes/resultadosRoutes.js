import express from 'express';
import {
  guardarResultado,
  obtenerResultadosPorVoluntario,
  obtenerResultadosPorCredenciales // NUEVO IMPORT
} from '../controllers/resultadosController.js';

const router = express.Router();

// Guardar un nuevo resultado
router.post('/resultados', guardarResultado);

// Obtener resultados por voluntario (solo correo)
router.get('/voluntarios/:correo', obtenerResultadosPorVoluntario);

// NUEVA RUTA: Obtener resultados por correo y contraseña
router.post('/resultados/credenciales', obtenerResultadosPorCredenciales);

export default router;
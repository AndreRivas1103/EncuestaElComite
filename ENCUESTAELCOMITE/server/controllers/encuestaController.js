import Encuesta from '../models/Encuesta.js';
import { body, validationResult } from 'express-validator';

// Validaciones
export const validarEncuesta = [
  body('titulo').optional().isString(),
  body('fecha_apertura').isISO8601().toDate(),
  body('fecha_cierre').isISO8601().toDate(),
  body('usuario_id').isString().notEmpty(),
  body('datos_encuesta').isObject()
];

// Controlador para crear encuesta
export const crearEncuesta = async (req, res, next) => {
  // Validar los datos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Calcular estado automáticamente
    const ahora = new Date();
    const estado = calcularEstado(
      new Date(req.body.fecha_apertura),
      new Date(req.body.fecha_cierre),
      ahora
    );

    const encuestaData = {
      ...req.body,
      estado,
      fecha_creacion: ahora
    };

    const nuevaEncuesta = await Encuesta.create(encuestaData);
    
    res.status(201).json({
      success: true,
      data: nuevaEncuesta,
      message: 'Encuesta creada exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

// Controlador para obtener todas las encuestas
export const obtenerEncuestas = async (req, res, next) => {
  try {
    const encuestas = await Encuesta.getAll();
    res.json({
      success: true,
      data: encuestas
    });
  } catch (error) {
    next(error);
  }
};

// Función para calcular estado
function calcularEstado(fechaApertura, fechaCierre, ahora) {
  if (ahora < fechaApertura) return 'programada';
  if (ahora >= fechaApertura && ahora <= fechaCierre) return 'activa';
  return 'cerrada';
}
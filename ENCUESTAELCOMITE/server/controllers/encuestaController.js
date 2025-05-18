import Encuesta from '../models/Encuesta.js';

// Crear nueva encuesta
export const crearEncuesta = async (req, res) => {
  try {
    // Validación manual básica
    if (!req.body.fecha_apertura || !req.body.fecha_cierre) {
      return res.status(400).json({
        success: false,
        error: 'Fechas de apertura y cierre son requeridas'
      });
    }

    const ahora = new Date();
    const encuestaData = {
      titulo: req.body.titulo || 'Encuesta de Habilidades Blandas',
      fecha_creacion: ahora,
      fecha_apertura: req.body.fecha_apertura,
      fecha_cierre: req.body.fecha_cierre,
      usuario_id: req.body.usuario_id,
      estado: 'borrador', // Estado inicial
      datos_encuesta: req.body.datos_encuesta || {}
    };

    const nuevaEncuesta = await Encuesta.create(encuestaData);
    
    res.status(201).json({
      success: true,
      data: nuevaEncuesta
    });

  } catch (error) {
    console.error('Error al crear encuesta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear la encuesta'
    });
  }
};

// Obtener todas las encuestas
export const obtenerEncuestas = async (req, res) => {
  try {
    const encuestas = await Encuesta.getAll();
    res.json({
      success: true,
      data: encuestas
    });
  } catch (error) {
    console.error('Error al obtener encuestas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener encuestas'
    });
  }
};

// Actualizar encuesta (para calendario)
export const actualizarEncuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_apertura, fecha_cierre } = req.body;

    // Validación manual de fechas
    if (new Date(fecha_cierre) <= new Date(fecha_apertura)) {
      return res.status(400).json({
        success: false,
        error: 'La fecha de cierre debe ser posterior a la de apertura'
      });
    }

    const encuestaActualizada = await Encuesta.update(id, {
      fecha_apertura,
      fecha_cierre,
      estado: 'programada'
    });

    if (!encuestaActualizada) {
      return res.status(404).json({
        success: false,
        error: 'Encuesta no encontrada'
      });
    }

    res.json({
      success: true,
      data: encuestaActualizada
    });
  } catch (error) {
    console.error('Error al actualizar encuesta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar la encuesta'
    });
  }
};
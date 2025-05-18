import Encuesta from '../models/Encuesta.js';

export const crearEncuesta = async (req, res) => {
  try {
    if (!req.body.usuario_id) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: 'El campo usuario_id es requerido'
      });
    }

    const nuevaEncuesta = await Encuesta.create(req.body);
    
    res.status(201).json({
      success: true,
      data: nuevaEncuesta
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error en el servidor',
      details: error.message,
      code: 'ENCUESTA_CREATION_ERROR'
    });
  }
};

export const programarEncuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_apertura, fecha_cierre, usuario_id } = req.body;

    // Validación de formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fecha_apertura) || !dateRegex.test(fecha_cierre)) {
      return res.status(400).json({ error: 'Formato de fecha inválido' });
    }

    // Validación de lógica de fechas
    if (new Date(fecha_cierre) <= new Date(fecha_apertura)) {
      return res.status(400).json({ error: 'Fecha cierre debe ser posterior' });
    }

    // Operación UPSERT sin estado
    const [encuesta, created] = await Encuesta.upsert({
      id: id || generarIdEncuesta(),
      ...req.body
    }, {
      conflictFields: ['id'],
      returning: true
    });

    // Eliminar estado de la respuesta si existe
    const responseData = encuesta.get({ plain: true });
    delete responseData.estado;

    res.status(created ? 201 : 200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error en el servidor',
      details: error.message
    });
  }
};

// Función auxiliar para generar IDs (debe estar en el mismo archivo)
function generarIdEncuesta() {
  const now = new Date();
  return `HB-${now.getFullYear()}-${Math.floor(Math.random() * 90) + 10}`;
}
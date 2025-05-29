import Encuesta from '../models/Encuesta.js';

// ========== MÉTODOS CON funcion==========
export const obtenerTodasEncuestas = async (req, res) => {
  try {
    const encuestas = await Encuesta.obtenerTodas();
    
    res.status(200).json({
      success: true,
      count: encuestas.length,
      data: encuestas
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener encuestas',
      details: error.message
    });
  }
};

// ========== MÉTODOS Normales ==========
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

export const obtenerEncuestaActiva = async (req, res) => {
  try {
    const encuesta = await Encuesta.obtenerEncuestaActiva();
    
    if (!encuesta) {
      return res.status(404).json({
        success: false,
        message: 'No hay encuestas activas disponibles',
        details: {
          requerimientos: {
            estado: 'activa',
            fecha_actual: new Date().toISOString(),
            rango_fechas: 'Debe estar entre fecha_apertura y fecha_cierre'
          }
        }
      });
    }

    let datosEncuesta = encuesta.datos_encuesta;
    if (typeof datosEncuesta === 'string') {
      try {
        datosEncuesta = JSON.parse(datosEncuesta);
      } catch (error) {
        console.error('Error parsing datos_encuesta:', error);
        throw new Error('Formato de datos_encuesta inválido');
      }
    }

    res.json({
      success: true,
      data: {
        ...encuesta.get({ plain: true }),
        datos_encuesta: datosEncuesta
      }
    });

  } catch (error) {
    console.error('Error en obtenerEncuestaActiva:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener encuesta activa',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const programarEncuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_apertura, fecha_cierre, usuario_id } = req.body;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fecha_apertura) || !dateRegex.test(fecha_cierre)) {
      return res.status(400).json({ error: 'Formato de fecha inválido' });
    }

    if (new Date(fecha_cierre) <= new Date(fecha_apertura)) {
      return res.status(400).json({ error: 'Fecha cierre debe ser posterior' });
    }

    const [encuesta, created] = await Encuesta.upsert({
      id: id || generarIdEncuesta(),
      ...req.body
    }, {
      conflictFields: ['id'],
      returning: true
    });

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

// ========== FUNCIÓN AUXILIAR ==========
function generarIdEncuesta() {
  const now = new Date();
  return `HB-${now.getFullYear()}-${Math.floor(Math.random() * 90) + 10}`;
}
export const obtenerEncuestaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const encuesta = await Encuesta.findByPk(id);

    if (!encuesta) {
      return res.status(404).json({
        success: false,
        message: 'Encuesta no encontrada'
      });
    }

    // Parsear datos_encuesta si es necesario
    let datosEncuesta = encuesta.datos_encuesta;
    if (typeof datosEncuesta === 'string') {
      try {
        datosEncuesta = JSON.parse(datosEncuesta);
      } catch (error) {
        console.error('Error parsing datos_encuesta:', error);
        throw new Error('Formato de datos_encuesta inválido');
      }
    }

    res.json({
      success: true,
      data: {
        ...encuesta.get({ plain: true }),
        datos_encuesta: datosEncuesta
      }
    });

  } catch (error) {
    console.error('Error en obtenerEncuestaPorId:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener encuesta por ID',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
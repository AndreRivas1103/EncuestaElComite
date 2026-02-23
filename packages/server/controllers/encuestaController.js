// encuestaController.js (modificado sin obtener_encuestas())
import Encuesta from '../models/Encuesta.js';
import { UniqueConstraintError } from 'sequelize';

function calcularEstado(fecha_apertura, fecha_cierre) {
  const hoy = new Date();
  const apertura = new Date(fecha_apertura);
  const cierre = new Date(fecha_cierre);

  if (hoy < apertura) return 'programada';
  if (hoy >= apertura && hoy <= cierre) return 'activa';
  return 'cerrada';
}

export const obtenerTodasEncuestas = async (req, res) => {
  try {
    const encuestas = await Encuesta.findAll({ order: [['fecha_creacion', 'DESC']] });

    const encuestasConEstado = encuestas.map(enc => ({
      ...enc.get({ plain: true }),
      estado: calcularEstado(enc.fecha_apertura, enc.fecha_cierre)
    }));

    res.status(200).json({
      success: true,
      count: encuestas.length,
      data: encuestasConEstado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener encuestas',
      details: error.message
    });
  }
};

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
    const encuestas = await Encuesta.findAll();

    const encuestaActiva = encuestas.find(e => {
      const estado = calcularEstado(e.fecha_apertura, e.fecha_cierre);
      return estado === 'activa';
    });

    if (!encuestaActiva) {
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

    let datosEncuesta = encuestaActiva.datos_encuesta;
    if (typeof datosEncuesta === 'string') {
      datosEncuesta = JSON.parse(datosEncuesta);
    }

    res.json({
      success: true,
      data: {
        ...encuestaActiva.get({ plain: true }),
        datos_encuesta: datosEncuesta
      }
    });
  } catch (error) {
    console.error('Error en obtenerEncuestaActiva:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener encuesta activa',
      details: error.message
    });
  }
};

export const programarEncuesta = async (req, res) => {
  try {
    const {
      id,
      titulo,
      fecha_apertura,
      fecha_cierre,
      usuario_id,
      datos_encuesta,
      respuestas_count
    } = req.body;

    const errores = [];
    if (!id) errores.push('Falta el ID');
    if (!titulo) errores.push('Falta el título');
    if (!fecha_apertura) errores.push('Falta la fecha de apertura');
    if (!fecha_cierre) errores.push('Falta la fecha de cierre');
    if (!usuario_id) errores.push('Falta el usuario_id');
    if (!datos_encuesta) errores.push('Faltan los datos de la encuesta');

    if (errores.length > 0) {
      return res.status(400).json({ error: 'Campos inválidos', detalles: errores });
    }

    if (new Date(fecha_cierre) <= new Date(fecha_apertura)) {
      return res.status(400).json({ error: 'La fecha de cierre debe ser posterior a la de apertura' });
    }

    const encuestaExistente = await Encuesta.findByPk(id);
    if (encuestaExistente) {
      return res.status(409).json({
        error: `Ya existe una encuesta con el ID "${id}". Por favor, usa uno distinto.`
      });
    }

    const estado = calcularEstado(fecha_apertura, fecha_cierre);

    const nuevaEncuesta = await Encuesta.create({
      id,
      titulo,
      fecha_apertura,
      fecha_cierre,
      fecha_creacion: new Date().toISOString().split('T')[0],
      usuario_id,
      datos_encuesta,
      respuestas_count: respuestas_count ?? 0,
      estado
    });

    res.status(201).json({
      message: 'Encuesta insertada correctamente',
      encuesta: nuevaEncuesta
    });
  } catch (error) {
    console.error('⛔ Error al programar encuesta:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      detalles: error.message
    });
  }
};

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

    let datosEncuesta = encuesta.datos_encuesta;
    if (typeof datosEncuesta === 'string') {
      datosEncuesta = JSON.parse(datosEncuesta);
    }

    const estado = calcularEstado(encuesta.fecha_apertura, encuesta.fecha_cierre);

    res.json({
      success: true,
      data: {
        ...encuesta.get({ plain: true }),
        datos_encuesta: datosEncuesta,
        estado
      }
    });
  } catch (error) {
    console.error('Error en obtenerEncuestaPorId:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener encuesta por ID',
      details: error.message
    });
  }
};

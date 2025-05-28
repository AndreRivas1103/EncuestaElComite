import Voluntario from '../models/Voluntario.js';

export const registrarVoluntario = async (req, res) => {
  try {
    const { 
      nombre_completo,
      numero_identificacion,
      correo_electronico,
      confirmacion_correo
    } = req.body;

    // Validación básica de campos requeridos
    if (!nombre_completo || !numero_identificacion || !correo_electronico) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: 'Faltan campos obligatorios'
      });
    }

    const nuevoVoluntario = await Voluntario.createWithValidation({
      nombre_completo,
      numero_identificacion,
      correo_electronico,
      confirmacion_correo
    });

    res.status(201).json({
      success: true,
      data: {
        correo: nuevoVoluntario.correo_electronico,
        nombre: nuevoVoluntario.nombre_completo,
        identificacion: nuevoVoluntario.numero_identificacion
      }
    });

  } catch (error) {
    // Manejo de errores específicos
    let statusCode = 500;
    let errorDetails = error.message;
    
    if (error.message.includes('no coinciden')) {
      statusCode = 400;
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      statusCode = 409;
      errorDetails = 'El correo o número de identificación ya están registrados';
    }

    res.status(statusCode).json({
      error: 'Error en el registro',
      details: errorDetails,
      code: 'VOLUNTARIO_REGISTRO_ERROR'
    });
  }
};

export const actualizarVoluntario = async (req, res) => {
  try {
    const { correo } = req.params;
    const { encuesta_pre, encuesta_post, id_encuesta } = req.body;

    const [updatedCount] = await Voluntario.updateAdditionalData(correo, {
      encuesta_pre,
      encuesta_post,
      id_encuesta
    });

    if (updatedCount === 0) {
      return res.status(404).json({
        error: 'No encontrado',
        details: 'Voluntario no encontrado'
      });
    }

    res.json({
      success: true,
      updatedFields: Object.keys(req.body)
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error en la actualización',
      details: error.message,
      code: 'VOLUNTARIO_UPDATE_ERROR'
    });
  }
};

function generarContrasena(nombre, identificacion) {
  const prefijo = nombre.trim().toLowerCase().slice(0, 3);
  const sufijo = identificacion.slice(-3);
  const anioActual = new Date().getFullYear();
  return `${prefijo}${sufijo}${anioActual}`;
}


export const verificarVoluntario = async (req, res) => {
  try {
    const { correo } = req.body;
    
    const voluntario = await Voluntario.findByEmail(correo);
    
    if (!voluntario) {
      return res.status(404).json({
        error: 'No registrado',
        details: 'Correo no encontrado en voluntarios'
      });
    }

    res.json({
      success: true,
      data: {
        nombre: voluntario.nombre_completo,
        identificacion: voluntario.numero_identificacion,
        correo: voluntario.correo_electronico
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error en la verificación',
      details: error.message
    });
  }
};


export const actualizarPreEvento = async (req, res) => {
  try {
    const { correo, encuesta_pre, id_encuesta, nombre, identificacion } = req.body;

    // Validación básica
    if (!correo || !encuesta_pre || !id_encuesta || !nombre || !identificacion) {
      return res.status(400).json({
        error: 'Datos incompletos',
        details: 'Se requieren correo, encuesta_pre, id_encuesta, nombre y identificacion'
      });
    }

    // 🔍 Debug para verificar el tipo de JSON recibido
    console.log('[DEBUG] Tipo de encuesta_pre:', typeof encuesta_pre);
    console.log('[DEBUG] ¿Es array?:', Array.isArray(encuesta_pre));
    console.log('[DEBUG] Fragmento JSON:', JSON.stringify(encuesta_pre).slice(0, 300));

    // Validación estricta de formato JSON
    if (typeof encuesta_pre !== 'object' || !Array.isArray(encuesta_pre)) {
      return res.status(400).json({
        error: 'Formato inválido',
        details: 'encuesta_pre debe ser un array de objetos JSON válido'
      });
    }

    const contrasenaGenerada = generarContrasena(nombre, identificacion);

    await Voluntario.actualizarPreEventoDesdeFuncion({
      correo,
      encuesta_pre,
      id_encuesta,
      contraseña: contrasenaGenerada
    });

    res.json({
      success: true,
      message: 'Voluntario actualizado correctamente',
      contrasena: contrasenaGenerada
    });

  } catch (error) {
    console.error('[ERROR] al actualizar voluntario:', error);
    res.status(500).json({
      error: 'Error al actualizar voluntario',
      details: error.message
    });
  }
};
export const verificarCredenciales = async (req, res) => {
  try {
    const { correo, identificacion } = req.body;
    
    // Validación básica
    if (!correo || !identificacion) {
      return res.status(400).json({
        error: 'Datos incompletos',
        details: 'Se requieren correo y número de identificación'
      });
    }

    const voluntario = await Voluntario.findOne({
      where: {
        correo_electronico: correo,
        numero_identificacion: identificacion
      },
      attributes: ['correo_electronico', 'nombre_completo', 'numero_identificacion']
    });

    if (!voluntario) {
      return res.status(404).json({
        error: 'Credenciales inválidas',
        details: 'No se encontró un voluntario con ese correo y número de identificación'
      });
    }

    res.json({
      success: true,
      data: {
        correo: voluntario.correo_electronico,
        nombre: voluntario.nombre_completo,
        identificacion: voluntario.numero_identificacion
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error en la verificación',
      details: error.message
    });
  }
};
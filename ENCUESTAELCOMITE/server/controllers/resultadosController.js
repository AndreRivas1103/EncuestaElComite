import Resultado from '../models/Resultados.js';

export const guardarResultado = async (req, res) => {
  try {
    const { id_encuesta, correo_voluntario, contrasena, resultado } = req.body;

    // Validación básica
    if (!id_encuesta || !correo_voluntario || !contrasena || !resultado) {
      return res.status(400).json({
        error: 'Datos incompletos',
        details: 'Se requieren id_encuesta, correo_voluntario, contrasena y resultado'
      });
    }

    // Insertar usando la función PostgreSQL
    await Resultado.insertarResultadoCalculado(
      id_encuesta,
      correo_voluntario,
      contrasena,
      resultado
    );

    res.status(201).json({
      success: true,
      message: 'Resultado guardado correctamente',
      data: {
        id_encuesta,
        correo_voluntario,
        tipo: resultado.tipo // 'pre' o 'post' según lo determine la función
      }
    });

  } catch (error) {
    console.error('Error al guardar resultado:', error);
    res.status(500).json({
      error: 'Error al guardar resultado',
      details: error.message,
      code: 'RESULTADO_GUARDAR_ERROR'
    });
  }
};

export const obtenerResultadosPorVoluntario = async (req, res) => {
  try {
    const { correo } = req.params;

    const resultados = await Resultado.findAll({
      where: { correo_voluntario: correo },
      order: [['tipo', 'ASC']] // Ordenar por tipo (pre primero, post después)
    });

    res.json({
      success: true,
      data: resultados
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener resultados',
      details: error.message
    });
  }
};

// NUEVO CONTROLADOR QUE USA EL MÉTODO
export const obtenerResultadosPorCredenciales = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Validación básica
    if (!correo || !contrasena) {
      return res.status(400).json({
        error: 'Datos incompletos',
        details: 'Se requieren correo y contrasena'
      });
    }

    // Usar el nuevo método del modelo
    const resultados = await Resultado.findByEmailAndPassword(correo, contrasena);

    res.json({
      success: true,
      message: 'Resultados obtenidos correctamente',
      data: resultados
    });

  } catch (error) {
    console.error('Error al obtener resultados por credenciales:', error);
    res.status(500).json({
      error: 'Error al obtener resultados',
      details: error.message,
      code: 'RESULTADO_OBTENER_CREDENCIALES_ERROR'
    });
  }
};
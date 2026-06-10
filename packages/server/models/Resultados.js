import sequelize from '../db/connection.js';
import { generarContrasena } from '../utils/voluntarioContrasena.js';

async function getTipoByEncuesta(idEncuesta) {
  const [rows] = await sequelize.query(
    `SELECT version FROM encuesta WHERE id_encuesta = :id_encuesta`,
    { replacements: { id_encuesta: Number(idEncuesta) } }
  );
  return rows?.[0]?.version || 'pre';
}

/** Extrae puntajes desde porCategoria o puntajes_por_habilidad */
function extraerPuntajes(resultado) {
  if (!resultado || typeof resultado !== 'object') return {};

  const directos = resultado.puntajes_por_habilidad;
  if (directos && Object.keys(directos).length > 0) {
    return directos;
  }

  const porCategoria = resultado.porCategoria || {};
  const puntajes = {};
  for (const [nombre, datos] of Object.entries(porCategoria)) {
    if (!datos || typeof datos !== 'object') continue;
    puntajes[nombre] = Number(datos.porcentaje ?? datos.puntaje ?? 0);
  }
  return puntajes;
}

/** Agrupa filas de evaluacion_habilidad al formato que espera el frontend */
function agruparResultados(rows) {
  const mapa = new Map();

  for (const row of rows) {
    const key = `${row.id_encuesta}-${row.tipo}`;
    if (!mapa.has(key)) {
      mapa.set(key, {
        id_encuesta: String(row.id_encuesta),
        correo_voluntario: row.correo,
        tipo: row.tipo,
        resultado: {
          resumen: { fecha: new Date().toISOString().split('T')[0] },
          porCategoria: {},
          recomendaciones: []
        }
      });
    }

    const item = mapa.get(key);
    const porcentaje = Number(row.puntaje ?? 0);
    item.resultado.porCategoria[row.habilidad] = {
      porcentaje,
      nivel: porcentaje >= 80 ? 'Alto' : porcentaje >= 60 ? 'Medio' : 'Bajo'
    };
  }

  for (const item of mapa.values()) {
    const cats = Object.values(item.resultado.porCategoria);
    const total = cats.reduce((sum, c) => sum + (c.porcentaje || 0), 0);
    const promedio = cats.length ? Math.round(total / cats.length) : 0;
    item.resultado.resumen.porcentajeTotal = promedio;
    item.resultado.recomendaciones = cats
      .filter((c) => c.porcentaje < 70)
      .map((c, i) => `Revisa tu desempeño en la habilidad evaluada (${c.porcentaje}%)`);
    if (item.resultado.recomendaciones.length === 0 && cats.length > 0) {
      item.resultado.recomendaciones.push('¡Buen desempeño! Sigue fortaleciendo tus habilidades.');
    }
  }

  return [...mapa.values()];
}

async function verificarCodigoAcceso(correo, contrasena, identificacion) {
  const [userRows] = await sequelize.query(
    `
    SELECT correo, nombre_completo, identificacion, codigo_unico
    FROM usuario WHERE correo = :correo
    `,
    { replacements: { correo } }
  );
  const user = userRows?.[0];
  if (!user) return false;

  if (identificacion && String(user.identificacion) !== String(identificacion)) {
    return false;
  }

  const codigoEsperado = generarContrasena(user.nombre_completo, user.identificacion);
  const codigoGuardado = user.codigo_unico;

  return (
    contrasena === codigoGuardado ||
    contrasena === codigoEsperado
  );
}

const Resultado = {
  async insertarResultadoCalculado(id_encuesta, correo_voluntario, contrasena, resultado) {
    const tipo = await getTipoByEncuesta(id_encuesta);
    const puntajes = extraerPuntajes(resultado);
    const keys = Object.keys(puntajes);

    if (keys.length === 0) {
      throw new Error('El resultado no contiene puntajes por habilidad');
    }

    if (contrasena) {
      await sequelize.query(
        `UPDATE usuario SET codigo_unico = :codigo WHERE correo = :correo`,
        { replacements: { correo: correo_voluntario, codigo: contrasena } }
      );
    }

    for (const habilidadNombre of keys) {
      const puntaje = Number(puntajes[habilidadNombre] ?? 0);
      const [habRows] = await sequelize.query(
        `
        INSERT INTO habilidad (nombre)
        VALUES (:nombre)
        ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
        RETURNING id_habilidad
        `,
        { replacements: { nombre: habilidadNombre } }
      );
      const id_habilidad = habRows[0].id_habilidad;

      await sequelize.query(
        `
        INSERT INTO evaluacion_habilidad (correo, id_encuesta, id_habilidad, puntaje)
        VALUES (:correo, :id_encuesta, :id_habilidad, :puntaje)
        ON CONFLICT (correo, id_encuesta, id_habilidad)
        DO UPDATE SET puntaje = EXCLUDED.puntaje
        `,
        {
          replacements: {
            correo: correo_voluntario,
            id_encuesta: Number(id_encuesta),
            id_habilidad,
            puntaje
          }
        }
      );
    }

    return { tipo };
  },

  async findAll({ where }) {
    const [rows] = await sequelize.query(
      `
      SELECT eh.id_encuesta, eh.correo, e.version AS tipo, eh.puntaje, h.nombre AS habilidad
      FROM evaluacion_habilidad eh
      JOIN encuesta e ON e.id_encuesta = eh.id_encuesta
      JOIN habilidad h ON h.id_habilidad = eh.id_habilidad
      WHERE eh.correo = :correo
      ORDER BY eh.id_encuesta DESC, h.nombre ASC
      `,
      { replacements: { correo: where.correo_voluntario } }
    );
    return agruparResultados(rows);
  },

  async findByEmailAndPassword(correo, contrasena, identificacion) {
    const accesoOk = await verificarCodigoAcceso(correo, contrasena, identificacion);
    if (!accesoOk) return [];
    return this.findAll({ where: { correo_voluntario: correo } });
  },

  async findPostByEmail(correo) {
    const [rows] = await sequelize.query(
      `
      SELECT eh.id_encuesta, eh.correo, e.version AS tipo, eh.puntaje, h.nombre AS habilidad
      FROM evaluacion_habilidad eh
      JOIN encuesta e ON e.id_encuesta = eh.id_encuesta
      JOIN habilidad h ON h.id_habilidad = eh.id_habilidad
      WHERE eh.correo = :correo AND e.version = 'post'
      ORDER BY eh.id_encuesta DESC, h.nombre ASC
      `,
      { replacements: { correo } }
    );
    return agruparResultados(rows);
  }
};

export default Resultado;

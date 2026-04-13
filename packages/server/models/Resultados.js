import sequelize from '../db/connection.js';

async function getTipoByEncuesta(idEncuesta) {
  const [rows] = await sequelize.query(
    `SELECT version FROM encuesta WHERE id_encuesta = :id_encuesta`,
    { replacements: { id_encuesta: Number(idEncuesta) } }
  );
  return rows?.[0]?.version || 'pre';
}

const Resultado = {
  async insertarResultadoCalculado(id_encuesta, correo_voluntario, _contrasena, resultado) {
    const tipo = await getTipoByEncuesta(id_encuesta);
    const puntajes = resultado?.puntajes_por_habilidad || {};
    const keys = Object.keys(puntajes);

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
    return rows;
  },

  async findByEmailAndPassword(correo, contrasena) {
    const [userRows] = await sequelize.query(
      `SELECT correo FROM usuario WHERE correo = :correo AND codigo_unico = :codigo`,
      { replacements: { correo, codigo: contrasena } }
    );
    if (!userRows?.length) return [];
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
    return rows;
  }
};

export default Resultado;
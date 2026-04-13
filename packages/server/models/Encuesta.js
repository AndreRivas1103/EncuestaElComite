import sequelize from '../db/connection.js';

function toDateOnly(value) {
  if (!value) return new Date().toISOString().split('T')[0];
  return new Date(value).toISOString().split('T')[0];
}

function wrapRow(row) {
  return {
    ...row,
    get: () => ({ ...row })
  };
}

function buildDatosEncuesta(rows) {
  const categoriasMap = new Map();
  for (const row of rows) {
    if (!categoriasMap.has(row.categoria)) {
      categoriasMap.set(row.categoria, { nombre: row.categoria, preguntas: [] });
    }
    const categoria = categoriasMap.get(row.categoria);
    let pregunta = categoria.preguntas.find((p) => p.id_pregunta === row.id_pregunta);
    if (!pregunta) {
      pregunta = {
        id_pregunta: row.id_pregunta,
        texto: row.texto_pregunta,
        tipoRespuesta: row.tipo_respuesta,
        opciones: []
      };
      categoria.preguntas.push(pregunta);
    }
    if (row.texto_opcion) {
      pregunta.opciones.push(row.texto_opcion);
    }
  }
  return { categorias: [...categoriasMap.values()] };
}

async function hydrateEncuesta(idEncuesta) {
  const [baseRows] = await sequelize.query(
    `SELECT id_encuesta, nombre, fecha, version FROM encuesta WHERE id_encuesta = :id`,
    { replacements: { id: Number(idEncuesta) } }
  );
  const base = baseRows?.[0];
  if (!base) return null;

  const [detailRows] = await sequelize.query(
    `
    SELECT p.id_pregunta, p.texto_pregunta, p.tipo_respuesta, h.nombre AS categoria, o.texto_opcion
    FROM pregunta p
    JOIN habilidad h ON h.id_habilidad = p.id_habilidad
    LEFT JOIN opcion o ON o.id_pregunta = p.id_pregunta
    WHERE p.id_encuesta = :id
    ORDER BY p.id_pregunta, o.id_opcion
    `,
    { replacements: { id: Number(idEncuesta) } }
  );

  const fecha = toDateOnly(base.fecha);
  return wrapRow({
    id: String(base.id_encuesta),
    titulo: base.nombre,
    fecha_creacion: fecha,
    fecha_apertura: fecha,
    fecha_cierre: fecha,
    estado: 'activa',
    version: base.version,
    datos_encuesta: buildDatosEncuesta(detailRows)
  });
}

const Encuesta = {
  async findAll() {
    const [rows] = await sequelize.query(
      `SELECT id_encuesta, nombre, fecha, version FROM encuesta ORDER BY id_encuesta DESC`
    );
    return rows.map((r) =>
      wrapRow({
        id: String(r.id_encuesta),
        titulo: r.nombre,
        fecha_creacion: toDateOnly(r.fecha),
        fecha_apertura: toDateOnly(r.fecha),
        fecha_cierre: toDateOnly(r.fecha),
        estado: 'activa',
        version: r.version,
        datos_encuesta: { categorias: [] }
      })
    );
  },

  async findOne() {
    const [rows] = await sequelize.query(
      `SELECT id_encuesta FROM encuesta WHERE version = 'pre' ORDER BY id_encuesta DESC LIMIT 1`
    );
    if (!rows?.[0]) return null;
    return hydrateEncuesta(rows[0].id_encuesta);
  },

  async findByPk(id) {
    return hydrateEncuesta(id);
  },

  async create(payload) {
    const version = payload?.version === 'post' ? 'post' : 'pre';
    const nombre = payload?.titulo || payload?.nombre || 'Encuesta';
    const fecha = toDateOnly(payload?.fecha_apertura || payload?.fecha || new Date());

    const [inserted] = await sequelize.query(
      `
      INSERT INTO encuesta (nombre, fecha, version)
      VALUES (:nombre, :fecha, :version::enum_encuesta_version)
      RETURNING id_encuesta
      `,
      { replacements: { nombre, fecha, version } }
    );
    const idEncuesta = inserted?.[0]?.id_encuesta;

    const categorias = payload?.datos_encuesta?.categorias || [];
    for (const categoria of categorias) {
      const nombreHabilidad = categoria?.nombre || 'General';
      const [habRows] = await sequelize.query(
        `
        INSERT INTO habilidad (nombre)
        VALUES (:nombre)
        ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
        RETURNING id_habilidad
        `,
        { replacements: { nombre: nombreHabilidad } }
      );
      const idHabilidad = habRows[0].id_habilidad;

      for (const preg of categoria?.preguntas || []) {
        const tipo = preg?.tipoRespuesta === 'abierta' ? 'abierta' : 'multiple';
        const [pregRows] = await sequelize.query(
          `
          INSERT INTO pregunta (id_encuesta, texto_pregunta, tipo_respuesta, id_habilidad)
          VALUES (:id_encuesta, :texto_pregunta, :tipo_respuesta::enum_pregunta_tipo_respuesta, :id_habilidad)
          RETURNING id_pregunta
          `,
          {
            replacements: {
              id_encuesta: idEncuesta,
              texto_pregunta: preg?.texto || 'Pregunta',
              tipo_respuesta: tipo,
              id_habilidad: idHabilidad
            }
          }
        );
        const idPregunta = pregRows[0].id_pregunta;

        if (tipo === 'multiple') {
          for (const opcion of preg?.opciones || []) {
            if (!opcion) continue;
            await sequelize.query(
              `INSERT INTO opcion (id_pregunta, texto_opcion) VALUES (:id_pregunta, :texto_opcion)`,
              { replacements: { id_pregunta: idPregunta, texto_opcion: opcion } }
            );
          }
        }
      }
    }

    return hydrateEncuesta(idEncuesta);
  }
};

export default Encuesta;

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

function mapEncuestaRow(r, datos_encuesta = { categorias: [] }) {
  const hoy = toDateOnly(new Date());
  const fechaCreacion = toDateOnly(r.fecha_creacion || r.fecha || hoy);
  const fechaApertura = toDateOnly(r.fecha_apertura || r.fecha || hoy);
  const fechaCierre = toDateOnly(r.fecha_cierre || r.fecha_apertura || r.fecha || hoy);
  return wrapRow({
    id: String(r.id_encuesta),
    titulo: r.nombre,
    fecha_creacion: fechaCreacion,
    fecha_apertura: fechaApertura,
    fecha_cierre: fechaCierre,
    version: r.version,
    datos_encuesta
  });
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
        opciones: [],
        respuestasCorrectas: []
      };
      categoria.preguntas.push(pregunta);
    }
    if (row.texto_opcion) {
      const idx = pregunta.opciones.length;
      pregunta.opciones.push(row.texto_opcion);
      if (row.es_correcta) {
        pregunta.respuestasCorrectas.push(idx);
      }
    }
  }
  return { categorias: [...categoriasMap.values()] };
}

async function hydrateEncuesta(idEncuesta) {
  const [baseRows] = await sequelize.query(
    `
    SELECT id_encuesta, nombre, fecha_creacion, fecha_apertura, fecha_cierre, version
    FROM encuesta WHERE id_encuesta = :id
    `,
    { replacements: { id: Number(idEncuesta) } }
  );
  const base = baseRows?.[0];
  if (!base) return null;

  const [detailRows] = await sequelize.query(
    `
    SELECT p.id_pregunta, p.texto_pregunta, p.tipo_respuesta, h.nombre AS categoria,
           o.texto_opcion, COALESCE(o.es_correcta, false) AS es_correcta
    FROM pregunta p
    JOIN habilidad h ON h.id_habilidad = p.id_habilidad
    LEFT JOIN opcion o ON o.id_pregunta = p.id_pregunta
    WHERE p.id_encuesta = :id
    ORDER BY p.id_pregunta, o.id_opcion
    `,
    { replacements: { id: Number(idEncuesta) } }
  );

  return mapEncuestaRow(base, buildDatosEncuesta(detailRows));
}

const Encuesta = {
  async findAll() {
    const [rows] = await sequelize.query(
      `
      SELECT id_encuesta, nombre, fecha_creacion, fecha_apertura, fecha_cierre, version
      FROM encuesta ORDER BY id_encuesta DESC
      `
    );
    return rows.map((r) => mapEncuestaRow(r));
  },

  async findOne({ version = 'pre' } = {}) {
    const [rows] = await sequelize.query(
      `
      SELECT id_encuesta, nombre, fecha_creacion, fecha_apertura, fecha_cierre, version
      FROM encuesta
      WHERE version = :version::enum_encuesta_version
      ORDER BY id_encuesta DESC
      `,
      { replacements: { version } }
    );

    const { calcularEstado } = await import('../utils/encuestaEstado.js');

    for (const row of rows) {
      const mapped = mapEncuestaRow(row);
      const plain = mapped.get({ plain: true });
      if (calcularEstado(plain.fecha_apertura, plain.fecha_cierre) === 'activa') {
        return hydrateEncuesta(row.id_encuesta);
      }
    }
    return null;
  },

  async findByPk(id) {
    return hydrateEncuesta(id);
  },

  async create(payload) {
    const version = payload?.version === 'post' ? 'post' : 'pre';
    const nombre = payload?.titulo || payload?.nombre || 'Encuesta';
    const hoy = toDateOnly(new Date());
    const fechaCreacion = toDateOnly(payload?.fecha_creacion || hoy);
    const fechaApertura = toDateOnly(payload?.fecha_apertura || hoy);
    const fechaCierre = toDateOnly(payload?.fecha_cierre || fechaApertura);

    const [inserted] = await sequelize.query(
      `
      INSERT INTO encuesta (nombre, fecha_creacion, fecha_apertura, fecha_cierre, version)
      VALUES (:nombre, :fecha_creacion, :fecha_apertura, :fecha_cierre, :version::enum_encuesta_version)
      RETURNING id_encuesta
      `,
      {
        replacements: {
          nombre,
          fecha_creacion: fechaCreacion,
          fecha_apertura: fechaApertura,
          fecha_cierre: fechaCierre,
          version
        }
      }
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
          const correctas = new Set(preg?.respuestasCorrectas || []);
          for (let oIndex = 0; oIndex < (preg?.opciones || []).length; oIndex++) {
            const opcion = preg.opciones[oIndex];
            if (!opcion || !String(opcion).trim()) continue;
            await sequelize.query(
              `
              INSERT INTO opcion (id_pregunta, texto_opcion, es_correcta)
              VALUES (:id_pregunta, :texto_opcion, :es_correcta)
              `,
              {
                replacements: {
                  id_pregunta: idPregunta,
                  texto_opcion: opcion,
                  es_correcta: correctas.has(oIndex)
                }
              }
            );
          }
        }
      }
    }

    return hydrateEncuesta(idEncuesta);
  },

  async destroy(id) {
    const idEncuesta = Number(id);
    const [rows] = await sequelize.query(
      `SELECT id_encuesta FROM encuesta WHERE id_encuesta = :id`,
      { replacements: { id: idEncuesta } }
    );
    if (!rows?.length) return false;

    await sequelize.query(
      `DELETE FROM encuesta WHERE id_encuesta = :id`,
      { replacements: { id: idEncuesta } }
    );
    return true;
  }
};

export default Encuesta;

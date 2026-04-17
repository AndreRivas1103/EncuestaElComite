/**
 * Datos iniciales para desarrollo / entornos locales.
 * Idempotente: no duplica coordinador ni encuesta si ya existen (por cédula / id fijo).
 *
 * Requisito: esquema creado antes (`npm run db:sync` o `npm run db:migrate:diagram`).
 *
 * Uso:
 *   cd packages/server
 *   DATABASE_URL=postgresql://encuesta:encuesta@localhost:5433/encuestaelcomite npm run db:seed
 *
 * Personalizar sin tocar código: variable SEED_FILE apuntando a un JSON (ver seed.sample.json).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './connection.js';
import Coordinador from '../models/Coordinador.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function dateOnly(d) {
  return d.toISOString().slice(0, 10);
}

function ventanaEncuestaActiva() {
  const hoy = new Date();
  const apertura = new Date(hoy);
  apertura.setDate(apertura.getDate() - 7);
  const cierre = new Date(hoy);
  cierre.setDate(cierre.getDate() + 30);
  return { fecha_apertura: dateOnly(apertura), fecha_cierre: dateOnly(cierre) };
}

const datosEncuestaDemo = {
  categorias: [
    {
      nombre: 'General',
      preguntas: [
        {
          texto: '¿Cómo calificarías tu experiencia?',
          tipoRespuesta: 'multiple',
          opciones: ['Muy buena', 'Buena', 'Regular', 'Mala']
        },
        {
          texto: '¿Recomendarías la actividad?',
          tipoRespuesta: 'multiple',
          opciones: ['Sí', 'No', 'Tal vez']
        }
      ]
    }
  ]
};

function loadSeedFromFile() {
  const file = process.env.SEED_FILE;
  if (!file || !fs.existsSync(file)) {
    return null;
  }
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw);
}

async function seedCoordinadores(overrides) {
  const baseRows = [
    {
      cedula: 'DEV-LOCAL-1',
      nombre: 'Coordinador de prueba',
      correo: 'coord.local@ejemplo.dev'
    },
    {
      cedula: 'DEV-LOCAL-2',
      nombre: 'Carolina Estrada',
      correo: 'carolina.estrada@elcomite.org.co'
    }
  ];

  const rows = overrides?.coordinadores?.length
    ? overrides.coordinadores
    : overrides?.coordinador
      ? [{ ...baseRows[0], ...overrides.coordinador }, baseRows[1]]
      : baseRows;

  let coordinadorEncuestaDemo = null;

  for (const row of rows) {
    const [coordinador, created] = await Coordinador.findOrCreate({
      where: { correo: row.correo },
      defaults: {
        cedula: row.cedula,
        nombre: row.nombre
      }
    });

    if (!created) {
      const needsUpdate =
        coordinador.cedula !== row.cedula ||
        coordinador.nombre !== row.nombre;

      if (needsUpdate) {
        coordinador.cedula = row.cedula;
        coordinador.nombre = row.nombre;
        await coordinador.save();
      }
    }

    if (row.correo === 'carolina.estrada@elcomite.org.co') {
      coordinadorEncuestaDemo = coordinador;
    }

    console.log(created ? `Coordinador creado: ${coordinador.correo}` : `Coordinador ya existía: ${coordinador.correo}`);
  }

  return coordinadorEncuestaDemo || rows[0];
}

async function tableExists(tableName) {
  const [rows] = await sequelize.query(
    `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = :tableName
    ) AS exists
    `,
    { replacements: { tableName } }
  );
  return Boolean(rows?.[0]?.exists);
}

async function seedEncuesta(_coordinador, overrides) {
  const hasOldSchema = await tableExists('encuestas');
  const hasDiagramSchema = await tableExists('encuesta');

  if (hasOldSchema) {
    const fechas = ventanaEncuestaActiva();
    const row = {
      id: overrides?.encuesta?.id || 'HB-DEV-LOCAL',
      titulo: overrides?.encuesta?.titulo || 'Encuesta de demostración (local)',
      fecha_creacion: dateOnly(new Date()),
      fecha_apertura: fechas.fecha_apertura,
      fecha_cierre: fechas.fecha_cierre,
      usuario_id: 'DEV-LOCAL-2',
      estado: 'activa',
      datos_encuesta: overrides?.encuesta?.datos_encuesta || datosEncuestaDemo,
      respuestas_count: 0
    };

    await sequelize.query(
      `
      INSERT INTO encuestas (
        id, titulo, fecha_creacion, fecha_apertura, fecha_cierre,
        usuario_id, estado, datos_encuesta, respuestas_count
      )
      VALUES (
        :id, :titulo, :fecha_creacion, :fecha_apertura, :fecha_cierre,
        :usuario_id, :estado, :datos_encuesta::jsonb, :respuestas_count
      )
      ON CONFLICT (id)
      DO UPDATE SET usuario_id = EXCLUDED.usuario_id
      `,
      {
        replacements: {
          ...row,
          datos_encuesta: JSON.stringify(row.datos_encuesta)
        }
      }
    );
    console.log(`Encuesta demo asegurada en esquema actual: ${row.id}`);
    return;
  }

  if (hasDiagramSchema) {
    const nombre = overrides?.encuesta?.titulo || 'Encuesta de demostración (diagrama)';
    await sequelize.query(
      `
      INSERT INTO encuesta (nombre, fecha, version)
      SELECT :nombre, CURRENT_DATE, 'pre'::enum_encuesta_version
      WHERE NOT EXISTS (
        SELECT 1 FROM encuesta WHERE nombre = :nombre AND version = 'pre'
      )
      `,
      { replacements: { nombre } }
    );
    console.log(`Encuesta demo asegurada en esquema diagrama: ${nombre}`);
    return;
  }

  console.log('No se encontró tabla de encuesta (encuestas/encuesta). Se omitió semilla de encuesta.');
}

async function main() {
  const filePayload = loadSeedFromFile();
  const coordinador = await seedCoordinadores(filePayload);
  await seedEncuesta(coordinador, filePayload);

  console.log('\nListo. Login de prueba (POST /api/auth/login):');
  console.log('- coord.local@ejemplo.dev');
  console.log('- carolina.estrada@elcomite.org.co');
  await sequelize.close();
  process.exit(0);
}

main().catch(async (err) => {
  console.error(err);
  try {
    await sequelize.close();
  } catch {
    /* ignore */
  }
  process.exit(1);
});

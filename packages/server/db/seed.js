/**
 * Datos iniciales para desarrollo / entornos locales.
 * Idempotente: no duplica coordinador ni encuesta si ya existen (por cédula / id fijo).
 *
 * Requisito: esquema creado antes (`npm run db:sync`).
 *
 * Uso:
 *   cd packages/server
 *   DATABASE_URL=postgresql://encuesta:encuesta@localhost:5432/encuestaelcomite npm run db:seed
 *
 * Personalizar sin tocar código: variable SEED_FILE apuntando a un JSON (ver seed.sample.json).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './connection.js';
import Coordinador from '../models/Coordinador.js';
import Encuesta from '../models/Encuesta.js';

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

async function seedCoordinador(overrides) {
  const base = {
    cedula: 'DEV-LOCAL-1',
    nombre: 'Coordinador de prueba',
    correo: 'coord.local@ejemplo.dev'
  };
  const row = { ...base, ...overrides?.coordinador };
  const [coordinador, created] = await Coordinador.findOrCreate({
    where: { cedula: row.cedula },
    defaults: {
      nombre: row.nombre,
      correo: row.correo
    }
  });
  console.log(created ? `Coordinador creado: ${coordinador.correo}` : `Coordinador ya existía: ${coordinador.correo}`);
  return coordinador;
}

async function seedEncuesta(coordinador, overrides) {
  const fechas = ventanaEncuestaActiva();
  const base = {
    id: 'HB-DEV-LOCAL',
    titulo: 'Encuesta de demostración (local)',
    fecha_creacion: dateOnly(new Date()),
    fecha_apertura: fechas.fecha_apertura,
    fecha_cierre: fechas.fecha_cierre,
    usuario_id: coordinador.cedula,
    estado: 'activa',
    datos_encuesta: datosEncuestaDemo,
    respuestas_count: 0
  };
  const row = { ...base, ...overrides?.encuesta };
  if (overrides?.encuesta?.datos_encuesta) {
    row.datos_encuesta = overrides.encuesta.datos_encuesta;
  }

  const [encuesta, created] = await Encuesta.findOrCreate({
    where: { id: row.id },
    defaults: row
  });

  if (!created) {
    console.log(`Encuesta ya existía: ${encuesta.id} (no se sobrescribió)`);
    return encuesta;
  }

  console.log(`Encuesta creada: ${encuesta.id} (${encuesta.estado}, ${row.fecha_apertura} → ${row.fecha_cierre})`);
  return encuesta;
}

async function main() {
  const filePayload = loadSeedFromFile();
  const coordinador = await seedCoordinador(filePayload);
  await seedEncuesta(coordinador, filePayload);

  console.log('\nListo. Login de prueba (POST /api/auth/login):', coordinador.correo);
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

/**
 * Crea tablas a partir de los modelos Sequelize y las funciones PL/pgSQL
 * usadas en Voluntario.actualizarPreEventoDesdeFuncion y Resultado.insertarResultadoCalculado.
 *
 * Uso (con Docker Compose en la raíz del monorepo):
 *   docker compose up -d
 *   cd packages/server && DATABASE_URL=postgresql://encuesta:encuesta@localhost:5432/encuestaelcomite npm run db:sync
 */
import sequelize from './connection.js';

import Coordinador from '../models/Coordinador.js';
import Encuesta from '../models/Encuesta.js';
import Voluntario from '../models/Voluntario.js';
import Resultado from '../models/Resultados.js';

void Coordinador;
void Encuesta;
void Voluntario;
void Resultado;

async function resolveEnumTypenameForResultadosTipo() {
  const [rows] = await sequelize.query(`
    SELECT t.typname::text AS typname
    FROM pg_catalog.pg_attribute a
    JOIN pg_catalog.pg_class c ON c.oid = a.attrelid
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_catalog.pg_type t ON t.oid = a.atttypid
    WHERE n.nspname = 'public'
      AND c.relname = 'resultados'
      AND a.attname = 'tipo'
      AND NOT a.attisdropped
      AND a.attnum > 0
  `);
  return rows?.[0]?.typname;
}

async function applyPostgresFunctions(enumTipoName) {
  const qid = (name) => `"${String(name).replace(/"/g, '""')}"`;

  await sequelize.query(`
CREATE OR REPLACE FUNCTION actualizar_voluntario_pre(
  p_correo VARCHAR(255),
  p_encuesta_pre JSONB,
  p_id_encuesta VARCHAR(50),
  p_contrasena VARCHAR(255)
) RETURNS void AS $func$
BEGIN
  UPDATE voluntarios
  SET encuesta_pre = p_encuesta_pre,
      id_encuesta = p_id_encuesta,
      ${qid('contraseña')} = p_contrasena
  WHERE correo_electronico = p_correo;
END;
$func$ LANGUAGE plpgsql;
  `);

  await sequelize.query(`
CREATE OR REPLACE FUNCTION insertar_resultado_calculado(
  p_id_encuesta VARCHAR(50),
  p_correo VARCHAR(255),
  p_contrasena VARCHAR(255),
  p_resultado JSONB
) RETURNS void AS $func$
DECLARE
  v_tipo TEXT := COALESCE(p_resultado->>'tipo', 'pre');
BEGIN
  INSERT INTO resultados (id_encuesta, correo_voluntario, tipo, ${qid('contraseña')}, resultado)
  VALUES (
    p_id_encuesta,
    p_correo,
    v_tipo::${qid(enumTipoName)},
    p_contrasena,
    p_resultado
  )
  ON CONFLICT (id_encuesta, correo_voluntario, tipo, ${qid('contraseña')})
  DO UPDATE SET resultado = EXCLUDED.resultado;
END;
$func$ LANGUAGE plpgsql;
  `);
}

async function main() {
  const alter = process.env.DB_SYNC_ALTER === 'true';
  console.log(`Sincronizando esquema (alter=${alter})…`);
  await sequelize.sync({ alter });

  const enumName = await resolveEnumTypenameForResultadosTipo();
  if (!enumName) {
    throw new Error(
      'No se encontró el tipo de la columna resultados.tipo. ¿Ejecutó sync correctamente?'
    );
  }

  console.log(`Aplicando funciones PostgreSQL (enum tipo: ${enumName})…`);
  await applyPostgresFunctions(enumName);

  console.log('Listo: tablas y funciones alineadas con el backend.');
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

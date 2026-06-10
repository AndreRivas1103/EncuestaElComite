/**
 * Añade fecha_creacion, fecha_apertura y fecha_cierre a encuesta
 * (migra desde la columna legacy `fecha` si existe).
 */
import sequelize from './connection.js';

async function columnExists(table, column) {
  const [rows] = await sequelize.query(
    `
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = :table
      AND column_name = :column
    `,
    { replacements: { table, column } }
  );
  return rows.length > 0;
}

async function main() {
  const hasEncuesta = await columnExists('encuesta', 'id_encuesta');
  if (!hasEncuesta) {
    console.log('Tabla encuesta no existe; omitiendo upgrade de fechas.');
    await sequelize.close();
    return;
  }

  const hasLegacyFecha = await columnExists('encuesta', 'fecha');
  const hasApertura = await columnExists('encuesta', 'fecha_apertura');

  if (!hasApertura) {
    await sequelize.query(`
      ALTER TABLE encuesta
        ADD COLUMN fecha_creacion DATE,
        ADD COLUMN fecha_apertura DATE,
        ADD COLUMN fecha_cierre DATE
    `);
    console.log('Columnas de fechas añadidas.');
  }

  if (hasLegacyFecha) {
    await sequelize.query(`
      UPDATE encuesta
      SET
        fecha_creacion = COALESCE(fecha_creacion, fecha),
        fecha_apertura = COALESCE(fecha_apertura, fecha),
        fecha_cierre = COALESCE(fecha_cierre, fecha + INTERVAL '30 days')
      WHERE fecha_creacion IS NULL
         OR fecha_apertura IS NULL
         OR fecha_cierre IS NULL
    `);
    console.log('Datos migrados desde columna fecha.');
  } else {
    await sequelize.query(`
      UPDATE encuesta
      SET
        fecha_creacion = COALESCE(fecha_creacion, CURRENT_DATE),
        fecha_apertura = COALESCE(fecha_apertura, CURRENT_DATE),
        fecha_cierre = COALESCE(fecha_cierre, CURRENT_DATE + INTERVAL '30 days')
      WHERE fecha_creacion IS NULL
         OR fecha_apertura IS NULL
         OR fecha_cierre IS NULL
    `);
  }

  await sequelize.query(`
    ALTER TABLE encuesta
      ALTER COLUMN fecha_creacion SET DEFAULT CURRENT_DATE,
      ALTER COLUMN fecha_apertura SET NOT NULL,
      ALTER COLUMN fecha_cierre SET NOT NULL
  `).catch(() => {
    /* puede fallar si ya hay NOT NULL */
  });

  if (hasLegacyFecha) {
    await sequelize.query(`ALTER TABLE encuesta DROP COLUMN IF EXISTS fecha`);
    console.log('Columna legacy fecha eliminada.');
  }

  console.log('Upgrade de fechas de encuesta completado.');
  await sequelize.close();
}

main().catch(async (err) => {
  console.error('Error en upgradeEncuestaFechas:', err);
  try {
    await sequelize.close();
  } catch {
    /* ignore */
  }
  process.exit(1);
});

/**
 * Añade es_correcta a opcion para persistir respuestas correctas de preguntas múltiples.
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
  const hasOpcion = await columnExists('opcion', 'id_opcion');
  if (!hasOpcion) {
    console.log('Tabla opcion no existe; omitiendo upgrade es_correcta.');
    await sequelize.close();
    return;
  }

  const hasEsCorrecta = await columnExists('opcion', 'es_correcta');
  if (!hasEsCorrecta) {
    await sequelize.query(`
      ALTER TABLE opcion
        ADD COLUMN es_correcta BOOLEAN NOT NULL DEFAULT false
    `);
    console.log('Columna opcion.es_correcta añadida.');
  } else {
    console.log('Columna opcion.es_correcta ya existe.');
  }

  console.log('Upgrade de respuestas correctas completado.');
  await sequelize.close();
}

main().catch(async (err) => {
  console.error('Error en upgradeOpcionCorrecta:', err);
  try {
    await sequelize.close();
  } catch {
    /* ignore */
  }
  process.exit(1);
});

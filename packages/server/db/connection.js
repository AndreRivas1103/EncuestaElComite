import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar .env de la carpeta server (necesario porque connection.js se importa antes de dotenv en server.js)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Prioridad: DATABASE_URL (local/Docker) > NEONDB_CONNECTION_STRING (Neon) > Postgres Docker por defecto
const connectionString =
  process.env.DATABASE_URL ||
  process.env.NEONDB_CONNECTION_STRING ||
  'postgresql://encuesta:encuesta@localhost:5433/encuestaelcomite';

function shouldUseSsl(urlString) {
  if (process.env.POSTGRES_SSL === 'false' || process.env.POSTGRES_SSL === '0') {
    return false;
  }
  if (process.env.POSTGRES_SSL === 'true' || process.env.POSTGRES_SSL === '1') {
    return true;
  }
  try {
    const u = new URL(urlString);
    if (u.hostname.includes('neon.tech') || u.searchParams.get('sslmode') === 'require') {
      return true;
    }
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
      return false;
    }
  } catch {
    /* ignore */
  }
  return false;
}

const useSsl = shouldUseSsl(connectionString);

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {},
  logging: console.log
});

// Test de conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión a PostgreSQL establecida${useSsl ? ' (SSL)' : ''}`);
    console.log('\n  ➜  Server Frontend/Backend:   http://localhost:5173/');
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
})();

export default sequelize;
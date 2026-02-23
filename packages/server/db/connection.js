import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar .env de la carpeta server (necesario porque connection.js se importa antes de dotenv en server.js)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Usa NEONDB_CONNECTION_STRING del .env o cadena por defecto (Linux/Windows)
const connectionString = process.env.NEONDB_CONNECTION_STRING ||
  'postgresql://neondb_owner:npg_ClfyY0K8SmFV@ep-black-sunset-a4coxssa-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { // Configuración obligatoria para NeonDB
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log // Opcional: muestra queries en consola
  }
);

// Test de conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión DIRECTA a NeonDB establecida');
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
})();

export default sequelize;
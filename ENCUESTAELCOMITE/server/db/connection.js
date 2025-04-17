import { Pool } from 'pg'; // Importa el cliente PostgreSQL
import dotenv from 'dotenv'; // Para leer variables de entorno

dotenv.config(); // Carga las variables del archivo .env

const pool = new Pool({
  connectionString: process.env.NEONDB_CONNECTION_STRING, // Usa la URL completa de Neon
  ssl: {
    rejectUnauthorized: false // Neon requiere SSL pero con esta configuración
  }
});

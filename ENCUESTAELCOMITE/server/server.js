import express from 'express';
import pool from './db/connection.js';
import './db/init.js'; // Opcional: ejecuta initDB al inicio

const app = express();
app.use(express.json());

// Test de conexión
pool.query('SELECT NOW()')
  .then(() => console.log('✅ DB conectada'))
  .catch(err => console.error('❌ DB no conectada:', err.message));

// Rutas de ejemplo
app.get('/api/db/tables', async (req, res) => {
  const result = await pool.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log('🚀 Servidor en http://localhost:3000');
});
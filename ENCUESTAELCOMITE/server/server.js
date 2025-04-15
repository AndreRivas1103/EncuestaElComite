import express from 'express';
import encuestaRoutes from './routes/encuestaRoutes.js';
import './db/connection.js'; // Solo la importación ya inicializa la conexión

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Monta las rutas bajo /api
app.use('/api/encuestas', encuestaRoutes);
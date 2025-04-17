import express from 'express';
import encuestaRoutes from './routes/encuestaRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import evaluacionRoutes from './routes/evaluacionRoutes.js';
import opcionRoutes from './routes/opcionRoutes.js';
import coordinadorRoutes from './routes/coordinadorRoutes.js';
import './db/connection.js';

const app = express();
app.use(express.json());

// Configuración de rutas
app.use('/api/encuestas', encuestaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);
app.use('/api/opciones', opcionRoutes);
app.use('/api/coordinadores', coordinadorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
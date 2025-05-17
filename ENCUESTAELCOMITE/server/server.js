import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verificarCorreo } from './controllers/coordinadorController.js';
import encuestaRoutes from './routes/encuestas.js'; // Nueva importación

// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares esenciales
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Actualizado para más métodos
}));
app.use(express.json());

// Conexión a la base de datos
import './db/connection.js'; 

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'Backend del Comité operativo',
    endpoints: {
      login: 'POST /api/auth/login',
      encuestas: {
        crear: 'POST /api/encuestas',
        listar: 'GET /api/encuestas'
      }
    }
  });
});

// Autenticación
app.post('/api/auth/login', verificarCorreo);

// Rutas de Encuestas (Nuevo)
app.use('/api/encuestas', encuestaRoutes);

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Ruta para 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor escuchando en: http://localhost:${PORT}`);
  console.log(`🔗 Ruta de prueba: curl http://localhost:${PORT}`);
  console.log(`📝 Ruta de encuestas: curl -X POST http://localhost:${PORT}/api/encuestas -H "Content-Type: application/json" -d '{"fecha_apertura":"2023-12-01","fecha_cierre":"2023-12-15","usuario_id":"1","datos_encuesta":{}}'`);
});
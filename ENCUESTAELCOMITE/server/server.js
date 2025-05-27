import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verificarCorreo } from './controllers/coordinadorController.js';
import encuestaRoutes from './routes/encuestasRoutes.js';
import voluntarioRoutes from './routes/voluntarioRoutes.js';

// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares esenciales
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

// Conexión a la base de datos
import './db/connection.js';

// Documentación de endpoints en raíz
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'Backend del Comité operativo',
    endpoints: {
      login: 'POST /api/auth/login',
      encuestas: {
        crear: 'POST /api/encuestas',
        listar: 'GET /api/encuestas',
        activa: 'GET /api/encuestas/activa',
      },
      voluntarios: {
        registrar: 'POST /api/voluntarios',
        actualizar: 'PUT /api/voluntarios/:correo',
        verificar: 'POST /api/voluntarios/verificar'
      }
    }
  });
});

// Sistema de autenticación
app.post('/api/auth/login', verificarCorreo);

// Rutas principales
app.use('/api/encuestas', encuestaRoutes);
app.use('/api', voluntarioRoutes);

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    suggestion: 'Verifique la documentación en GET /'
  });
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor escuchando en: http://localhost:${PORT}`);
  console.log(`🔗 Endpoints disponibles:`);
  console.log(`   - Autenticación: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   - Registrar voluntario: POST http://localhost:${PORT}/api/voluntarios`);
  console.log(`   - Listar encuestas: GET http://localhost:${PORT}/api/encuestas`);
  console.log(`   - Encuesta activa: GET http://localhost:${PORT}/api/encuestas/activa`);
  console.log(`   - Programar encuesta: POST http://localhost:${PORT}/api/encuestas`);
  console.log(`\n📚 Documentación completa disponible en: http://localhost:${PORT}`);
});
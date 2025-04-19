import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verificarCorreo } from './controllers/coordinadorController.js';

// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares esenciales
app.use(cors({
  origin: 'http://localhost:5173', // Asegúrate que coincida con tu URL de frontend
  credentials: true,
  methods: ['GET', 'POST'] // Métodos permitidos
}));
app.use(express.json()); // Para parsear JSON

// Conexión a la base de datos (opcional, si usas Sequelize directamente)
import './db/connection.js'; 

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'Backend del Comité operativo',
    endpoints: {
      login: 'POST /api/auth/login'
    }
  });
});

// Autenticación
app.post('/api/auth/login', verificarCorreo);

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
  console.log(`🔐 Ruta de login: curl -X POST http://localhost:${PORT}/api/auth/login -H "Content-Type: application/json" -d '{"correo":"correo@ejemplo.com"}'`);
});
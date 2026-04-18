import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { verificarCorreo } from './controllers/coordinadorController.js';
import encuestaRoutes from './routes/encuestasRoutes.js';
import voluntarioRoutes from './routes/voluntarioRoutes.js';
import resultadoRoutes from './routes/resultadosRoutes.js';

// Configuración inicial: cargar .env desde la carpeta server (funciona en Linux/Windows)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
const openapiDocument = JSON.parse(
  readFileSync(path.join(__dirname, 'openapi.json'), 'utf8')
);
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.get('/openapi.json', (req, res) => {
  res.json(openapiDocument);
});

// Documentación de endpoints en raíz
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'Backend del Comité operativo',
    swagger: 'GET /api-docs',
    openApiJson: 'GET /openapi.json',
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
        verificar: 'POST /api/voluntarios/verificar',
        verificarCredenciales: 'POST /api/voluntarios/verificar-credenciales',
        actualizarPreEvento: 'POST /api/voluntarios/actualizar-pre-evento',
        actualizarPostEvento: 'POST /api/voluntarios/actualizar-post-evento'
      },
      resultados: {
        guardar: 'POST /api/resultados',
        obtenerPorCorreo: 'GET /api/voluntarios/:correo/resultados',
        obtenerPorCredenciales: 'POST /api/resultados/credenciales',
        obtenerSoloPost: 'POST /api/resultados/credenciales/post'
      }
    }
  });
});

// Sistema de autenticación
app.post('/api/auth/login', verificarCorreo);

// Rutas principales
app.use('/api/encuestas', encuestaRoutes);
app.use('/api', voluntarioRoutes);
app.use('/api', resultadoRoutes);

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
  console.log(`\n🚀👌 Servidor iniciado en: http://localhost:${PORT}`);
  console.log(`🔗 Endpoints disponibles:`);
  console.log(`   - Autenticación: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   - Registrar voluntario: POST http://localhost:${PORT}/api/voluntarios`);
  console.log(`   - Verificar voluntario: POST http://localhost:${PORT}/api/voluntarios/verificar`);
  console.log(`   - Verificar credenciales: POST http://localhost:${PORT}/api/voluntarios/verificar-credenciales`);
  console.log(`   - Actualizar pre-evento: POST http://localhost:${PORT}/api/voluntarios/actualizar-pre-evento`);
  console.log(`   - Actualizar post-evento: POST http://localhost:${PORT}/api/voluntarios/actualizar-post-evento`);
  console.log(`   - Listar encuestas: GET http://localhost:${PORT}/api/encuestas`);
  console.log(`   - Encuesta activa: GET http://localhost:${PORT}/api/encuestas/activa`);
  console.log(`   - Programar encuesta: POST http://localhost:${PORT}/api/encuestas`);
  console.log(`   - Guardar resultados: POST http://localhost:${PORT}/api/resultados`);
  console.log(`   - Obtener resultados por correo: GET http://localhost:${PORT}/api/voluntarios/:correo/resultados`);
  console.log(`   - Obtener resultados por credenciales: POST http://localhost:${PORT}/api/resultados/credenciales`);
  console.log(`   - Obtener SOLO resultados POST: POST http://localhost:${PORT}/api/resultados/credenciales/post`);
  console.log(`\n📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`📄 OpenAPI JSON: http://localhost:${PORT}/openapi.json`);
  console.log(`Proyecto ElComité 🙊`);
});

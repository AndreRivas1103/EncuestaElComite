# Encuesta El Comité GoBabyGo

## Integrantes

- Samuel David Gallego Meneses
- André Rivas Garcia
- Juliana Franco Alzate 
- Johan Lukas Lopez Bedoya (No Actualmente)

## Descripción

El proyecto Go Baby Go de El Comité busca fomentar la inclusión de niños con discapacidad mediante la adaptación de vehículos de juguete en makeathons (Maratón de creación). Por otra parte los voluntarios modifican carritos y motos para que los niños puedan usarlos, promoviendo su desarrollo físico, cognitivo y emocional.

## Solución

La batería de preguntas estará organizada en secciones, cada una diseñada para evaluar de manera individual distintas habilidades blandas de los voluntarios. Al finalizar la evaluación, se generará un código único que les permitirá acceder a una plataforma donde podrán visualizar su desempeño. Esta plataforma presentará los resultados de forma intuitiva, similar a los reportes del ICFES, mostrando en porcentajes el nivel de afinidad con cada habilidad evaluada.

## Estructura del Proyecto (Monorepo)

```
Proyecto-ElComite-GoBabyGo/
├── packages/
│   ├── client/                         # Frontend React + Vite
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   ├── fonts/              # Fuentes tipográficas
│   │   │   │   └── imagenes_fundacion/ # Imágenes de la fundación
│   │   │   ├── components/
│   │   │   │   ├── MigaDePan.jsx       # Componente breadcrumb
│   │   │   │   ├── MigaDePan.css
│   │   │   │   ├── Sidebar.jsx         # Barra lateral de navegación
│   │   │   │   └── Sidebar.css
│   │   │   ├── pages/
│   │   │   │   ├── styles/             # Estilos de cada página
│   │   │   │   │   ├── Calendario.css
│   │   │   │   │   ├── ClonarEncuesta.css
│   │   │   │   │   ├── ConfirmLogout.css
│   │   │   │   │   ├── CreacionPreguntas.css
│   │   │   │   │   ├── EncuestasActivas.css
│   │   │   │   │   ├── GraciasPorParticipar.css
│   │   │   │   │   ├── Home.css
│   │   │   │   │   ├── InfoEncuesta.css
│   │   │   │   │   ├── InicioCoordinador.css
│   │   │   │   │   ├── PreviewEncuesta.css
│   │   │   │   │   ├── RealizarEncuesta.css
│   │   │   │   │   ├── registroencuestas.css
│   │   │   │   │   ├── RellenarDatos.css
│   │   │   │   │   ├── ResponderEncuesta.css
│   │   │   │   │   ├── SeleccionarEncuesta.css
│   │   │   │   │   ├── TyC.css
│   │   │   │   │   ├── VerResultados.css
│   │   │   │   │   ├── VisualizacionEncuesta.css
│   │   │   │   │   └── VisualizarResultados.css
│   │   │   │   ├── Calendario.jsx
│   │   │   │   ├── ClonarEncuesta.jsx
│   │   │   │   ├── ConfirmLogout.jsx
│   │   │   │   ├── Contacto.jsx
│   │   │   │   ├── CrearPregunta.jsx
│   │   │   │   ├── Encuesta.jsx
│   │   │   │   ├── Escoger_Encuentas.jsx
│   │   │   │   ├── GraciasPorParticipar.jsx
│   │   │   │   ├── GraciasPorParticiparPost.jsx
│   │   │   │   ├── GuardarPreguntas.jsx
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Infoencuesta.jsx
│   │   │   │   ├── Iniciarsesion.jsx
│   │   │   │   ├── InicioCoordinador.jsx
│   │   │   │   ├── NuevoEvento.jsx
│   │   │   │   ├── PreviewEncuesta.jsx
│   │   │   │   ├── RegistroEncuesta.jsx
│   │   │   │   ├── Rellenar_Datos.jsx
│   │   │   │   ├── Rellenar_Datos_Post.jsx
│   │   │   │   ├── Responder_Encuesta.jsx
│   │   │   │   ├── Responder_Encuesta_Post.jsx
│   │   │   │   ├── SeleccionarEncuesta.jsx
│   │   │   │   ├── TyC.jsx
│   │   │   │   ├── Ver_Resultados.jsx
│   │   │   │   └── Visualizar_Resultados.jsx
│   │   │   ├── App.jsx                 # Componente principal
│   │   │   ├── App.css
│   │   │   ├── main.jsx                # Punto de entrada
│   │   │   └── index.css
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── eslint.config.js
│   │   └── package.json
│   │
│   └── server/                         # Backend Express + Sequelize
│       ├── controllers/
│       │   ├── coordinadorController.js
│       │   ├── encuestaController.js
│       │   ├── evaluacionController.js
│       │   ├── opcionController.js
│       │   ├── responderEncuesta.js
│       │   ├── resultadosController.js
│       │   └── voluntarioController.js
│       ├── db/
│       │   └── connection.js           # Conexión a PostgreSQL
│       ├── models/
│       │   ├── Coordinador.js
│       │   ├── Encuesta.js
│       │   ├── Evaluacionh.js
│       │   ├── Habilidad.js
│       │   ├── Opcion.js
│       │   ├── Resultados.js
│       │   └── Voluntario.js
│       ├── routes/
│       │   ├── encuestasRoutes.js
│       │   ├── resultadosRoutes.js
│       │   └── voluntarioRoutes.js
│       ├── server.js                   # Punto de entrada del servidor
│       └── package.json
│
├── package.json                        # Configuración del monorepo (workspaces)
├── .gitignore
└── README.md
```

## Tecnologías

- **Frontend**: React 19, Vite, CoreUI Pro, React Router
- **Backend**: Express, Sequelize, PostgreSQL
- **Monorepo**: npm workspaces

## Instalación

```bash
# Instalar todas las dependencias del monorepo
npm install
```

## Ejecución

```bash
# Ejecutar cliente y servidor simultáneamente
npm run dev

# Ejecutar solo el cliente(Frontend)
npm run dev:client

# Ejecutar solo el servidor(Backend)
npm run dev:server
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Ejecuta cliente y servidor en paralelo |
| `npm run dev:client` | Ejecuta solo el frontend |
| `npm run dev:server` | Ejecuta solo el backend |
| `npm run build` | Compila el cliente para producción |
| `npm run start:server` | Inicia el servidor en producción |
| `npm run lint` | Ejecuta el linter en el cliente |

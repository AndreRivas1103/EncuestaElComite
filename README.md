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

## Qué descargar antes de ejecutar el proyecto

Para que el proyecto funcione, instala esto en tu computador:

- **Node.js 18 o superior** (incluye `npm`): [https://nodejs.org/](https://nodejs.org/)
- **Git** (para clonar el repositorio): [https://git-scm.com/downloads](https://git-scm.com/downloads)
- **Docker Desktop** (opcional, pero recomendado para correr todo con contenedores): [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

Si vas a usar la opción local sin Docker completo:

- Necesitas tener PostgreSQL disponible (puede ser con `docker compose up -d db` como se explica más abajo).

## Correr el proyecto por primera vez

### Requisitos

- Node.js **>= 18**
- Docker Desktop (si usarás contenedores)

---

### Opción A (recomendada): Todo con Docker

Esta opción levanta **frontend + backend + PostgreSQL** desde `docker-compose.yml`.

**¿Por qué Docker?** Un solo comando alinea versiones de Node, PostgreSQL y variables de entorno entre el equipo: el backend habla con la BD en la red interna (`db:5432`), el frontend se sirve en el puerto **3000** y el API en **3010**, sin instalar Postgres ni configurar `DATABASE_URL` a mano en cada máquina.

1. Levanta contenedores:

```bash
docker compose up -d
```

2. Crea esquema y datos iniciales (primera vez):

```bash
docker compose exec back npm run db:migrate:diagram -w @encuestaelcomite/server
docker compose exec back npm run db:seed -w @encuestaelcomite/server
```

3. Abre el sistema:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3010`
- Swagger: `http://localhost:3010/api-docs`

> Nota: `db:migrate:diagram` **borra y recrea** tablas del esquema actual.

#### Datos de prueba (login coordinador)

Tras el seed, el login **solo pide correo** (no hay contraseña). Usa cualquiera de estos:

| Correo | Nombre |
|--------|--------|
| `coord.local@ejemplo.dev` | Coordinador de prueba |
| `carolina.estrada@elcomite.org.co` | Carolina Estrada |

Encuesta demo incluida en seed: ID `HB-DEV-LOCAL` (título *Encuesta de demostración (local)*), ventana de fechas activa (~7 días atrás → ~30 días adelante).

---

### Opción B: Desarrollo local (sin Docker para frontend/backend)

Puedes usar Docker solo para la base de datos y correr app en local:

1. Levanta solo PostgreSQL:

```bash
docker compose up -d db
```

2. Crea esquema y seed:

```bash
npm run db:migrate:diagram -w @encuestaelcomite/server
npm run db:seed -w @encuestaelcomite/server
```

3. Levanta frontend + backend:

```bash
npm run dev
```

Queda normalmente en:

- Frontend (Vite): `http://localhost:5173`
- Backend (Node): `http://localhost:3000`

---

## Cuando NO es la primera vez

### Si trabajas con Docker

Para el día a día, normalmente solo necesitas levantar contenedores:

```bash
docker compose up -d
```

Luego abres:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3010`

Solo ejecuta migración/seed otra vez si realmente quieres recrear datos:

```bash
docker compose exec back npm run db:migrate:diagram -w @encuestaelcomite/server
docker compose exec back npm run db:seed -w @encuestaelcomite/server
```

### Si trabajas en modo local

Con la base ya creada, en el día a día solo levantas servicios:

```bash
docker compose up -d db
npm run dev
```

Si prefieres por separado:

```bash
npm run dev:server
npm run dev:client
```

---

### Comandos útiles Docker

```bash
# Ver logs
docker compose logs -f

# Parar contenedores
docker compose down

# Parar y borrar volumen de BD (reseteo total)
docker compose down -v
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Ejecuta cliente y servidor en paralelo (modo local) |
| `npm run dev:client` | Ejecuta solo el frontend |
| `npm run dev:server` | Ejecuta solo el backend |
| `npm run db:migrate:diagram -w @encuestaelcomite/server` | Recrea el esquema PostgreSQL según el diagrama (borra datos del esquema) |
| `npm run db:seed -w @encuestaelcomite/server` | Inserta datos iniciales / de prueba (requiere esquema ya migrado) |
| `npm run build` | Compila el cliente para producción |
| `npm run start:server` | Inicia el servidor en producción |
| `npm run lint` | Ejecuta el linter en el cliente |

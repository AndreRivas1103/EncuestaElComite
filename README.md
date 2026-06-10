# Encuesta El Comité GoBabyGo

## Integrantes

- Samuel David Gallego Meneses
- André Rivas Garcia
- Juliana Franco Alzate 
- Johan Lukas Lopez Bedoya (No Actualmente)
- Jesus Esteban Arias Salazar

## Descripción

El proyecto Go Baby Go de El Comité busca fomentar la inclusión de niños con discapacidad mediante la adaptación de vehículos de juguete en makeathons (Maratón de creación). Por otra parte los voluntarios modifican carritos y motos para que los niños puedan usarlos, promoviendo su desarrollo físico, cognitivo y emocional.

## Solución

La batería de preguntas estará organizada en secciones, cada una diseñada para evaluar de manera individual distintas habilidades blandas de los voluntarios. Al finalizar la evaluación, se generará un código único que les permitirá acceder a una plataforma donde podrán visualizar su desempeño. Esta plataforma presentará los resultados de forma intuitiva, similar a los reportes del ICFES, mostrando en porcentajes el nivel de afinidad con cada habilidad evaluada.

## Estructura del Proyecto (Monorepo)

```
EncuestaElComite/
├── .github/workflows/
│   ├── ci.yml                    # Lint, tests unitarios/contrato e integración API+BD
│   ├── deploy.yml                # Lint, tests y publicación Docker (main)
│   └── docker-publish.yml
├── k8s/
│   ├── manifest.yaml             # Manifiesto Kubernetes (app + monitoreo)
│   ├── deploy.sh                 # Script de despliegue en Minikube
│   └── README.md                 # Guía K8s y conexión entre pods
├── scripts/
│   └── docker-smoke.mjs          # Smoke Docker (npm run test:docker)
├── tests/
│   ├── setup.js                  # Configuración global de Vitest
│   ├── helpers/
│   │   └── mockExpress.js
│   ├── client/                   # Pruebas de hooks y UI (jsdom)
│   ├── server/                   # Controladores y utilidades del backend
│   ├── integration/              # Smoke contra API real (requiere servidor + Postgres)
│   └── external/                 # Contrato de docker-compose y Dockerfiles
├── packages/
│   ├── client/                   # Frontend React 19 + Vite
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   ├── fonts/
│   │   │   │   └── imagenes_fundacion/
│   │   │   ├── components/       # UI reutilizable
│   │   │   │   ├── AppToaster.jsx
│   │   │   │   ├── MigaDePan.jsx / .css
│   │   │   │   ├── PageLead.jsx
│   │   │   │   ├── PageSurface.jsx
│   │   │   │   ├── PageTransitionShell.jsx
│   │   │   │   ├── RouteTheme.jsx
│   │   │   │   └── Sidebar.jsx / .css
│   │   │   ├── hooks/
│   │   │   │   └── useSidebarClosing.js
│   │   │   ├── lib/
│   │   │   │   └── toast.js
│   │   │   ├── pages/            # Vistas por ruta
│   │   │   │   ├── styles/       # CSS por pantalla (+ survey-builder.css, index.css)
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
│   │   │   ├── styles/           # Estilos globales (toast, page-surface)
│   │   │   ├── App.jsx
│   │   │   ├── App.css
│   │   │   ├── main.jsx
│   │   │   └── index.css
│   │   ├── Dockerfile
│   │   ├── Dockerfile.k8s
│   │   ├── nginx.k8s.conf
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── eslint.config.js
│   │   └── package.json
│   │
│   └── server/                   # Backend Express + Sequelize + PostgreSQL
│       ├── controllers/
│       │   ├── coordinadorController.js
│       │   ├── encuestaController.js
│       │   ├── evaluacionController.js
│       │   ├── opcionController.js
│       │   ├── resultadosController.js
│       │   └── voluntarioController.js
│       ├── db/
│       │   ├── connection.js
│       │   ├── migrateToDiagram.js
│       │   ├── syncSchema.js
│       │   ├── seed.js
│       │   └── seed.sample.json
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
│       ├── utils/
│       │   ├── encuestaEstado.js
│       │   └── voluntarioContrasena.js
│       ├── metrics.js            # Prometheus (/metrics)
│       ├── openapi.json          # Documentación Swagger UI
│       ├── server.js
│       ├── Dockerfile
│       └── package.json
│
├── docker-compose.yml            # Stack local: client + server + db
├── docker-compose.test.yml       # Stack reducido para smoke tests
├── vitest.config.js              # Pruebas en tests/ (raíz del monorepo)
├── package.json                  # Workspaces npm y scripts globales
├── package-lock.json
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
docker compose exec back npm run db:upgrade:fechas -w @encuestaelcomite/server
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

### Opción C: Kubernetes (Minikube)

Para desplegar en un clúster local con frontend, backend, PostgreSQL y monitoreo (Grafana/Prometheus), ve la sección **[Despliegue en Kubernetes (Minikube)](#despliegue-en-kubernetes-minikube)**.

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

## Despliegue en Kubernetes (Minikube)

| Recurso | Descripción |
|---------|-------------|
| **`k8s/manifest.yaml`** | Define namespace, pods, services, BD, monitoreo y Job `init-db` |
| **`k8s/deploy.sh`** | Construye imágenes en Minikube y aplica el manifiesto en orden |
| **`k8s/README.md`** | Guía completa: conceptos, red entre pods, comandos y solución de problemas |

<p>
  <a href="k8s/README.md">
    <img src="https://img.shields.io/badge/Guía%20completa%20Kubernetes-k8s%2FREADME.md-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Abrir guía Kubernetes">
  </a>
  &nbsp;
  <a href="k8s/README.md#cómo-se-conectan-los-pods">
    <img src="https://img.shields.io/badge/Red%20del%20backend%20(pods)-explicación%20detallada-2ea44f?style=for-the-badge" alt="Cómo se conectan los pods">
  </a>
</p>

### Resumen: cómo se conecta el backend

En K8s cada aplicación tiene un **Pod** (proceso) y un **Service** (nombre DNS fijo: `back`, `db`, `client`). Los pods no se llaman por IP.

| Paso | Quién | Hacia dónde | Puerto |
|------|-------|-------------|--------|
| 1 | Tu navegador | Service `client` (NodePort) | **30080** |
| 2 | nginx (pod `client`) | Service `back` vía `http://back:3000` | proxy `/api/*` |
| 3 | Express (pod `back`) | Service `db` vía `DATABASE_URL` | **5432** |

El API **no** está en `localhost:3010` como en Docker Compose: solo es accesible desde dentro del clúster o a través del frontend en el puerto **30080**.

**Despliegue rápido:**

```bash
minikube start
eval $(minikube docker-env)   # Git Bash; en PowerShell ver k8s/README.md
./k8s/deploy.sh
minikube service client -n encuesta --url
```

**URLs tras desplegar** (obtén la base con `minikube service client -n encuesta --url`):

| Qué | URL |
|-----|-----|
| App (React) | `http://127.0.0.1:30080` |
| API (vía nginx) | `http://127.0.0.1:30080/api/...` |
| Swagger | `http://127.0.0.1:30080/api-docs` |
| Grafana | `minikube service grafana -n encuesta --url` (`admin` / `encuesta`) |

Tras desplegar, revisa el [checklist post-despliegue](#checklist-post-despliegue-docker-o-minikube) más abajo y la sección [Cómo se conectan los pods](k8s/README.md#cómo-se-conectan-los-pods) si algo no responde.

---

## Checklist post-despliegue (Docker o Minikube)

1. **Base de datos**
   ```bash
   # Docker
   docker compose exec back npm run db:migrate:diagram -w @encuestaelcomite/server
   docker compose exec back npm run db:upgrade:fechas -w @encuestaelcomite/server
   docker compose exec back npm run db:seed -w @encuestaelcomite/server
   ```
   En Minikube el Job `init-db` del manifiesto hace migrate + upgrade + seed.

2. **Reconstruir imágenes** tras cambios de código:
   ```bash
   # Docker
   docker compose build back client && docker compose up -d back client
   # Minikube (etiquetas deben coincidir con k8s/manifest.yaml)
   eval $(minikube docker-env)
   docker build --no-cache -f packages/server/Dockerfile -t marcelillo/encuestaelcomite-back:latest .
   docker build -f packages/client/Dockerfile.k8s -t marcelillo/encuestaelcomite-client:latest .
   kubectl rollout restart deployment/back deployment/client -n encuesta
   ```

3. **Probar fechas de encuesta (coordinador)**
   - Crear encuesta → calendario: apertura hoy, cierre en 7+ días.
   - En registro debe verse **activa**, no cerrada.

4. **Probar flujo voluntario**
   - Registro → responder encuesta → pantalla de gracias muestra **código de acceso**.
   - Copiar ese código.

5. **Probar resultados**
   - Ir a *Visualizar resultados* con correo, documento y código.
   - Debe abrir gráficos en `/ver-resultados` (aunque la encuesta ya esté cerrada).

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

## Pruebas

El proyecto usa **[Vitest](https://vitest.dev/)** en la carpeta `tests/`. En **GitHub Actions** (`.github/workflows/ci.yml`) se ejecutan automáticamente en cada PR y push a `main`.

### Tipos de prueba

| Tipo | Comando / ubicación | Qué valida |
|------|---------------------|------------|
| **Unitarias** | `npm run test` → `tests/server/`, `tests/client/` | Lógica aislada: utilidades, controladores (modelos simulados) y hooks React. Sin servidor ni PostgreSQL. |
| **Contrato Docker** | Incluidas en `npm run test` → `tests/external/` | Que `docker-compose.yml`, `docker-compose.test.yml` y los Dockerfiles tengan servicios, variables y puertos coherentes (sin levantar contenedores). |
| **Integración API + BD** | `npm run test:integration` (requiere API en marcha) | `GET /health`, `GET /` y `GET /openapi.json` contra un servidor real con PostgreSQL. En CI se levanta Postgres, migra el esquema e inicia el backend. |
| **Smoke Docker** | `npm run test:docker` (requiere Docker) | Construye y levanta `docker-compose.test.yml` (solo `db` + `back`), espera `GET /health` en el puerto `3011` y baja el stack. |

### Endpoint de salud

El backend expone `GET /health` para probes y smoke tests. Responde `200` con `{ status: "ok", db: "connected" }` si PostgreSQL responde; `503` si la base no está disponible.

### Ejecución local

```bash
npm run test              # unitarias + contrato Docker
npm run test:watch        # modo observación

# Integración (terminal 1: BD + API)
docker compose up -d db
npm run db:migrate:diagram -w @encuestaelcomite/server
npm run start:server
# terminal 2:
INTEGRATION_URL=http://localhost:3000 npm run test:integration

# Smoke con contenedores (Docker en ejecución)
npm run test:docker
```

### Qué no cubren

- **E2E en navegador** (Playwright, Cypress).
- **Despliegue en Minikube** (se valida manualmente; ver `k8s/README.md`).

Utilidades extraídas para pruebas unitarias: `packages/server/utils/encuestaEstado.js` y `packages/server/utils/voluntarioContrasena.js`.

---

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Ejecuta cliente y servidor en paralelo (modo local) |
| `npm run dev:client` | Ejecuta solo el frontend |
| `npm run dev:server` | Ejecuta solo el backend |
| `npm run db:migrate:diagram -w @encuestaelcomite/server` | Recrea el esquema PostgreSQL según el diagrama (borra datos del esquema) |
| `npm run db:upgrade:fechas -w @encuestaelcomite/server` | Añade/migra columnas fecha_apertura y fecha_cierre en encuestas |
| `npm run db:seed -w @encuestaelcomite/server` | Inserta datos iniciales / de prueba (requiere esquema ya migrado) |
| `npm run build` | Compila el cliente para producción |
| `npm run start:server` | Inicia el servidor en producción |
| `npm run lint` | Ejecuta el linter en el cliente |
| `npm run test` | Pruebas unitarias y contrato Docker (`tests/`) |
| `npm run test:watch` | Pruebas en modo observación |
| `npm run test:integration` | API + PostgreSQL (variable `INTEGRATION_URL`) |
| `npm run test:docker` | Smoke: compose de prueba + `/health` |

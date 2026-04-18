# Encuesta El Comité (`@encuestaelcomite/client`)

Aplicación **React** que sirve como interfaz pública y de coordinación para el proyecto **Encuesta El Comité** (Go Baby Go): inicio de encuestas pre y post evento, registro de participantes, visualización de resultados y herramientas para coordinadores.

Este paquete forma parte del **monorepo** de la raíz del repositorio (`encuestaelcomite`).

---

## Contenido

| Ruta | Descripción |
|------|-------------|
| `src/main.jsx` | Punto de entrada: monta React en `#root` e importa estilos globales (`index.css`). |
| `src/App.jsx` | Enrutador principal (`react-router-dom`): define todas las rutas de la SPA. |
| `src/pages/` | Pantallas por ruta (formularios, encuestas, coordinador, calendario, etc.). Cada página importa su CSS desde `pages/styles/`. |
| `src/components/` | Piezas utilizadas: `Sidebar`, `MigaDePan`, `PageLead`, `PageTransitionShell`. |
| `src/hooks/` | Hooks compartidos (p. ej. animación/cierre del sidebar). |
| `src/assets/` | Imágenes, logos e iconos usados en la UI. |
| `index.html` | HTML base que carga el bundle de Vite. |
| `vite.config.js` | Configuración de **Vite** con el plugin oficial de React. |

La salida de producción se genera en **`dist/`** al ejecutar `npm run build`.


## Funcionamiento (flujo general)

1. El usuario abre la app: **`main.jsx`** renderiza **`App`** dentro de `React.StrictMode`.
2. **`App.jsx`** envuelve las rutas en **`Router`** y **`PageTransitionShell`** (transición suave entre vistas).
3. Cada **`<Route>`** enlaza una URL con un componente bajo **`src/pages/`** (véase la tabla siguiente).
4. Los formularios y listados **comunican con el servidor** mediante **Axios**. El backend esperado es el paquete **`server`** del monorepo (puerto típico **3000**).
5. **`localStorage`** guarda en varios flujos datos de sesión del coordinador, aceptación de términos o respuestas temporales, según la pantalla.

El listado canónico de rutas está en **`src/App.jsx`** (`<Routes>`).

---

## Páginas: 

Ruta | Archivo (`src/pages/`) | Qué hace
-----|-------------------------|----------
`/` | `Home.jsx` | Página de inicio: mensaje de bienvenida, carrusel de la fundación y enlaces a **Iniciar encuesta** y **Ver resultados** (y acceso a administración si aplica).
`/iniciar-sesion` | `Iniciarsesion.jsx` | **Login por correo**: valida el email contra el API (`/api/auth/login`) y, si es correcto, guarda datos en `localStorage` y redirige al área de coordinación.
`/seleccionar-encuesta` | `SeleccionarEncuesta.jsx` | Tras iniciar sesión: lista encuestas desde el API, **sidebar** de coordinador y navegación hacia la encuesta elegida (flujo de gestión).
`/contacto` | `Contacto.jsx` | Datos de contacto de la organización (email, etc.) y miga de pan para volver.
`/registro-encuestas` | `RegistroEncuesta.jsx` | Panel de **registro/listado de encuestas**: carga encuestas del API, sidebar y accesos para crear o gestionar encuestas.
`/inicio-coordinador` | `InicioCoordinador.jsx` | **Panel principal del coordinador**: resumen y accesos rápidos a encuestas, eventos, calendario, etc.
`/info-encuesta/:id` | `Infoencuesta.jsx` | **Detalle de una encuesta** por ID: ver información, editar, eliminar o ir a clonar según las acciones del UI.
`/clonar-encuesta/:id` | `ClonarEncuesta.jsx` | **Duplicar una encuesta** existente a partir de su ID (formulario y confirmación vía API).
`/nuevo-evento` | `NuevoEvento.jsx` | **Alta de evento** (fechas, datos del evento) con calendario / formulario para el coordinador.
`/guardar-pregunta` | `GuardarPreguntas.jsx` | Pantalla de **confirmación** de que las preguntas se guardaron correctamente (mensaje y enlaces para continuar o volver).
`/crear-pregunta` | `CrearPregunta.jsx` | **Crear o editar una pregunta** concreta (tipo de respuesta, texto, etc.) dentro del flujo de armado de encuesta.
`/calendario` | `Calendario.jsx` | **Vista de calendario** ligada a encuestas/eventos: consulta y operaciones sobre fechas e encuestas temporales vía API.
`/encuestas` | `Encuesta.jsx` | **Vista interactiva de encuesta completa** (categorías, respuestas y resumen de puntuación de demostración) con **sidebar** de coordinador; sirve para revisar el cuestionario como lo vería un participante.
`/confirmar-cierre` | `ConfirmLogout.jsx` | Pantalla de **confirmación al cerrar sesión** o salir del panel (vuelve al inicio o al login según botones).
`/visualizacionE` | `PreviewEncuesta.jsx` | **Previsualización** de cómo verán los participantes categorías y preguntas antes de publicar (componente pensado para recibir datos por props o estado; la ruta directa puede requerir navegación desde el flujo de edición).
`/realizar-encuesta` | `Escoger_Encuentas.jsx` | **Elegir flujo pre o post evento**: dos enlaces hacia registro de datos (`/rellenar-datos` o `/rellenar-datos-post`).
`/rellenar-datos` | `Rellenar_Datos.jsx` | **Registro de datos del participante (pre-evento)**: formulario, términos y envío al API de voluntarios.
`/responder-encuesta` | `Responder_Encuesta.jsx` | **Responder la encuesta activa (pre-evento)**: carga encuesta activa, guarda respuestas y actualiza participación vía API.
`/visualizar-resultados` | `Visualizar_Resultados.jsx` | **Consulta de resultados (pre)** con verificación por credenciales contra el API.
`/terminos-y-condiciones` | `TyC.jsx` | Texto de **términos y condiciones** y acciones Aceptar/Cancelar (enlace desde el registro de datos).
`/ver-resultados` | `Ver_Resultados.jsx` | **Consulta de resultados del post-evento** (credenciales específicas post vía API).
`/gracias-por-participar` | `GraciasPorParticipar.jsx` | **Pantalla de agradecimiento** tras completar el flujo pre-evento.
`/rellenar-datos-post` | `Rellenar_Datos_Post.jsx` | **Identificación / datos para post-evento** (verificación de credenciales y registro vinculado al post).
`/gracias-por-participar-post` | `GraciasPorParticiparPost.jsx` | **Agradecimiento y cierre** del flujo post-evento (puede registrar resultados o actualizar estado según el API).
`/responder-encuesta-post` | `Responder_Encuesta_Post.jsx` | **Responder encuesta post-evento**: encuesta activa post, envío de respuestas y actualización de voluntario post vía API.

**Nota:** Los nombres de archivo pueden usar `PascalCase` o guiones bajos (`Rellenar_Datos.jsx`, `Responder_Encuesta.jsx`, etc.); la tabla usa el nombre real del fichero en `src/pages/`.

---




## Requisitos y desarrollo

- **Node.js** ≥ 18 (según `engines` del monorepo).
- Instalar dependencias desde la raíz: `npm install` (workspaces).
- Para que formularios y encuestas funcionen de extremo a extremo, el **API en `packages/server`** debe estar en marcha y las URLs del cliente deben coincidir con el host/puerto del servidor (hoy muchas rutas están fijadas a `localhost:3000`; conviene centralizarlas en variables de entorno de Vite, p. ej. `VITE_API_URL`, en una mejora futura).

---

## Estructura mental rápida

```
client/
├── index.html
├── package.json
├── vite.config.js
├── README.md          ← este archivo
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── components/
    ├── hooks/
    ├── pages/
    └── assets/
```

Si añades rutas nuevas, regístralas en **`App.jsx`** y crea la página correspondiente en **`pages/`**.

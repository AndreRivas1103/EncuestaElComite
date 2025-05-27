# Guía del Sistema de Migas de Pan (Breadcrumbs)

## Descripción General

El sistema de migas de pan ha sido reorganizado para seguir flujos lógicos coherentes que reflejan los diferentes recorridos del usuario por la aplicación. Cada flujo tiene iconos específicos y nombres descriptivos en español.

## Posicionamiento de las Migas de Pan

### 📍 **Ubicación Estratégica**
Las migas de pan ahora se posicionan de manera inteligente según el tipo de página:

#### **Páginas con Sidebar (Coordinador)**
- **Ubicación:** Debajo del botón de menú hamburguesa (☰)
- **Ejemplos:** `/inicio-coordinador`, `/nuevo-evento`, `/registro-encuestas`
- **Comportamiento:** Se adaptan al sidebar con animaciones de margen y ancho

#### **Páginas de Usuario (Sin Sidebar)**
- **Ubicación:** Inmediatamente después del header
- **Ejemplos:** `/`, `/realizar-encuesta`, `/rellenar-datos`
- **Comportamiento:** Posición estática debajo del header

### 🏗️ **Implementación por Página**

#### **Páginas ya Implementadas:**
✅ `Home.jsx` - Página principal  
✅ `Iniciarsesion.jsx` - Iniciar sesión  
✅ `Contacto.jsx` - Página de contacto  
✅ `Escoger_Encuentas.jsx` - Realizar encuesta  
✅ `Rellenar_Datos.jsx` - Datos del participante  
✅ `Visualizar_Resultados.jsx` - Consultar resultados  
✅ `Ver_Resultados.jsx` - Ver mis resultados  
✅ `InicioCoordinador.jsx` - Panel coordinador  
✅ `NuevoEvento.jsx` - Crear nuevo evento  
✅ `RegistroEncuesta.jsx` - Gestión de encuestas  

#### **Estructura de Implementación:**

**Para páginas SIN sidebar:**
```jsx
import MigaDePan from '../components/MigaDePan.jsx';

// Después del header
<header className="header">
  {/* contenido del header */}
</header>

{/* Migas de Pan */}
<MigaDePan />

<div className="contenido-principal">
  {/* resto del contenido */}
</div>
```

**Para páginas CON sidebar:**
```jsx
import MigaDePan from '../components/MigaDePan.jsx';

// Después del botón de menú
<div className="menu-button-container">
  <button onClick={() => setSidebarVisible(!sidebarVisible)}>
    ☰
  </button>
</div>

{/* Migas de Pan */}
<MigaDePan withSidebar={true} sidebarVisible={sidebarVisible} />

<Sidebar isVisible={sidebarVisible} />
```

## Flujos Implementados

### 1. Flujo del Usuario Regular (Encuesta)
```
🏠 Inicio → 📋 Seleccionar Encuesta → 👤 Datos del Participante → ✍️ Responder Encuesta
```
**Rutas:** `/` → `/realizar-encuesta` → `/rellenar-datos` → `/responder-encuesta`

**Descripción:** Este es el flujo principal para usuarios que desean participar en una encuesta.

### 2. Flujo de Consulta de Resultados
```
🏠 Inicio → 🔍 Consultar Resultados → 📊 Ver Mis Resultados
```
**Rutas:** `/` → `/visualizar-resultados` → `/ver-resultados`

**Descripción:** Flujo para usuarios que desean consultar sus resultados de encuestas previas.

### 3. Flujo del Coordinador - Área Principal
```
🏠 Inicio → 🔐 Iniciar Sesión → ⚙️ Panel de Coordinación
```
**Rutas:** `/` → `/iniciar-sesion` → `/inicio-coordinador`

**Descripción:** Acceso principal para coordinadores.

### 4. Flujo del Coordinador - Gestión de Encuestas
```
🏠 Inicio → 🔐 Iniciar Sesión → ⚙️ Panel de Coordinación → 📝 Gestión de Encuestas → ℹ️ Información de Encuesta
```
**Rutas:** `/` → `/iniciar-sesion` → `/inicio-coordinador` → `/registro-encuestas` → `/info-encuesta`

**Descripción:** Gestión y visualización de encuestas existentes.

### 5. Flujo del Coordinador - Crear Eventos
```
🏠 Inicio → 🔐 Iniciar Sesión → ⚙️ Panel de Coordinación → 📅 Crear Nuevo Evento → 📆 Calendario de Eventos
```
**Rutas:** `/` → `/iniciar-sesion` → `/inicio-coordinador` → `/nuevo-evento` → `/calendario`

**Descripción:** Creación y gestión de eventos en el calendario.

### 6. Flujo del Coordinador - Crear Preguntas
```
🏠 Inicio → 🔐 Iniciar Sesión → ⚙️ Panel de Coordinación → ❓ Crear Pregunta → 💾 Guardar Pregunta → 👁️ Previsualización
```
**Rutas:** `/` → `/iniciar-sesion` → `/inicio-coordinador` → `/crear-pregunta` → `/guardar-pregunta` → `/visualizacionE`

**Descripción:** Proceso completo de creación de preguntas para encuestas.

### 7. Flujo de Términos y Condiciones
```
🏠 Inicio → 📋 Seleccionar Encuesta → 👤 Datos del Participante → 📜 Términos y Condiciones
```
**Rutas:** `/` → `/realizar-encuesta` → `/rellenar-datos` → `/terminos-y-condiciones`

**Descripción:** Acceso a términos y condiciones durante el proceso de encuesta.

### 8. Flujo de Salida
```
🏠 Inicio → 🔐 Iniciar Sesión → ⚙️ Panel de Coordinación → 🚪 Confirmar Salida
```
**Rutas:** `/` → `/iniciar-sesion` → `/inicio-coordinador` → `/confirmar-cierre`

**Descripción:** Proceso de cierre de sesión para coordinadores.

## Contextos Especiales

### Contacto
```
🏠 Inicio → 📞 Contacto
```
**Rutas:** `/` → `/contacto`

### Seleccionar Encuesta (Coordinador)
```
🏠 Inicio → 🔐 Iniciar Sesión → 📋 Seleccionar Encuesta
```
**Rutas:** `/` → `/iniciar-sesion` → `/seleccionar-encuesta`

## Características del Sistema

### 1. **Diseño Visual Mejorado**
- **Iconos descriptivos:** Cada paso tiene un icono que representa visualmente la acción
- **Colores corporativos:** Uso de la paleta azul (#1e3766) y verde (#73a31d)
- **Efectos hover:** Animaciones suaves al pasar el cursor
- **Página actual destacada:** La página actual se muestra con un estilo especial y animación

### 2. **Navegación Inteligente**
- **Enlaces funcionales:** Se puede hacer clic en cualquier paso anterior para regresar
- **Contexto preservado:** Las migas de pan muestran el contexto completo del flujo
- **Responsive:** Se adapta a diferentes tamaños de pantalla
- **Posicionamiento inteligente:** Se ubican debajo del elemento de navegación principal de cada página

### 3. **Accesibilidad**
- **Contraste adecuado:** Colores que cumplen con estándares de accesibilidad
- **Focus visible:** Indicadores claros para navegación con teclado
- **Texto descriptivo:** Nombres claros en español

### 4. **Diferenciación por Rol**
- **Páginas de coordinador:** Fondo especial para páginas administrativas
- **Usuarios regulares:** Estilo estándar para el flujo público
- **Compatibilidad con sidebar:** Adaptación automática cuando hay elementos laterales

## Implementación Técnica

### Archivos Principales
- `MigaDePan.jsx`: Componente principal con lógica de flujos
- `MigaDePan.css`: Estilos mejorados con animaciones y responsive design
- `App.jsx`: Eliminación del componente global para permitir control individual

### Props del Componente
```jsx
<MigaDePan 
  withSidebar={boolean}     // Indica si la página tiene sidebar
  sidebarVisible={boolean}  // Estado de visibilidad del sidebar
/>
```

### Lógica de Detección
1. **Análisis de ruta:** Se analiza la URL actual
2. **Matching de flujos:** Se busca coincidencia con flujos predefinidos
3. **Contextos especiales:** Se verifican casos especiales
4. **Fallback:** Si no hay coincidencia, se usa el sistema tradicional

### Configuración
Los flujos están definidos en el objeto `flujos` dentro de `definirFlujoLogico()`. Para agregar nuevos flujos:

1. Definir el array de pasos con `path`, `label` e `icon`
2. Agregar la ruta correspondiente a `isCoordinadorPage` si es necesario
3. Actualizar el mapeo en `pathMap` si es necesario

### Guía de Implementación para Nuevas Páginas

#### **1. Para páginas sin sidebar:**
```jsx
// 1. Importar el componente
import MigaDePan from '../components/MigaDePan.jsx';

// 2. Colocar después del header
<header className="header">
  {/* contenido del header */}
</header>

{/* 3. Agregar las migas de pan */}
<MigaDePan />
```

#### **2. Para páginas con sidebar:**
```jsx
// 1. Importar el componente
import MigaDePan from '../components/MigaDePan.jsx';

// 2. Colocar después del botón de menú
<div className="menu-button-container">
  <button onClick={() => setSidebarVisible(!sidebarVisible)}>
    ☰
  </button>
</div>

{/* 3. Agregar las migas de pan con props */}
<MigaDePan withSidebar={true} sidebarVisible={sidebarVisible} />
```

## Ventajas del Nuevo Sistema

1. **Navegación intuitiva:** Los usuarios entienden dónde están y cómo llegaron
2. **Experiencia mejorada:** Navegación visual y atractiva
3. **Mantenimiento fácil:** Flujos organizados y documentados
4. **Escalabilidad:** Fácil agregar nuevos flujos o modificar existentes
5. **Consistencia:** Misma experiencia en toda la aplicación
6. **Posicionamiento inteligente:** Se adapta a la estructura específica de cada página
7. **Compatibilidad total:** Funciona tanto con páginas simples como complejas con sidebars 
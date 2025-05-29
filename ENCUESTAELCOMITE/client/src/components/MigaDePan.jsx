import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./MigaDePan.css";

const MigaDePan = ({ withSidebar = false, sidebarVisible = false }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Mapeo mejorado de rutas con nombres descriptivos en español
  const pathMap = {
    "": "Inicio",
    "iniciar-sesion": "Iniciar Sesión",
    "seleccionar-encuesta": "Seleccionar Encuesta",
    contacto: "Contacto",
    "registro-encuestas": "Gestión de Encuestas",
    "inicio-coordinador": "Inicio Coordinación",
    "info-encuesta": "Información de Encuesta",
    "nuevo-evento": "Crear Nuevo Evento",
    "guardar-pregunta": "Guardar Pregunta",
    "crear-pregunta": "Crear Pregunta",
    calendario: "Calendario de Eventos",
    encuestas: "Lista de Encuestas",
    ensayo: "Vista Previa",
    "confirmar-cierre": "Confirmar Salida",
    visualizacionE: "Previsualización",
    "realizar-encuesta": "Seleccionar Encuesta",
    "rellenar-datos": "Datos del Participante",
    "responder-encuesta": "Responder Encuesta",
    "visualizar-resultados": "Consultar Resultados",
    "terminos-y-condiciones": "Términos y Condiciones",
    "ver-resultados": "Ver Mis Resultados",
    tyc: "Términos y Condiciones",
    iniciarsesion: "Iniciar Sesión",
    iniciocoordinador: "Inicio Coordinación",
    "encuestas-activas": "Encuestas Activas",
    "crear-encuesta": "Crear Encuesta",
  };

  // Definir flujos lógicos de navegación mejorados
  const definirFlujoLogico = (pathnames) => {
    const flujos = {
      // Flujo principal de encuesta para usuarios
      encuestaUsuario: [
        { path: "/realizar-encuesta", label: "Seleccionar Encuesta", icon: "📋" },
        { path: "/rellenar-datos", label: "Datos del Participante", icon: "👤" },
        { path: "/responder-encuesta", label: "Responder Encuesta", icon: "✍️" },
      ],
      
      // Flujo de visualización de resultados (corregido)
      resultados: [
        { path: "/visualizar-resultados", label: "Consultar Resultados", icon: "🔍" },
        { path: "/ver-resultados", label: "Ver Mis Resultados", icon: "📊" }
      ],
      
      // Flujo del coordinador - área principal
      coordinadorPrincipal: [
        { path: "/inicio-coordinador", label: "Inicio Coordinación", icon: "⚙️" }
      ],

      // Flujo del coordinador - gestión de encuestas (MODIFICADO)
      coordinadorEncuestas: [
        { path: "/inicio-coordinador", label: "Inicio Coordinación", icon: "⚙️" },
        { path: "/registro-encuestas", label: "Gestión de Encuestas", icon: "📝" },
        { path: "/info-encuesta", label: "Detalles Encuesta", icon: "ℹ️" }
      ],

      // Flujo del coordinador - crear eventos
      coordinadorEventos: [
        { path: "/inicio-coordinador", label: "Inicio Coordinación", icon: "⚙️" },
        { path: "/nuevo-evento", label: "Crear Nuevo Evento", icon: "📅" },
        { path: "/calendario", label: "Calendario de Eventos", icon: "📆" }
      ],

      // Flujo del coordinador - crear preguntas
      coordinadorPreguntas: [
        { path: "/inicio-coordinador", label: "Inicio Coordinación", icon: "⚙️" },
        { path: "/crear-pregunta", label: "Crear Pregunta", icon: "❓" },
        { path: "/guardar-pregunta", label: "Guardar Pregunta", icon: "💾" },
        { path: "/visualizacionE", label: "Previsualización", icon: "👁️" }
      ],

      // Flujo de términos y condiciones
      terminos: [
        { path: "/realizar-encuesta", label: "Seleccionar Encuesta", icon: "📋" },
        { path: "/rellenar-datos", label: "Datos del Participante", icon: "👤" },
        { path: "/terminos-y-condiciones", label: "Términos y Condiciones", icon: "📜" }
      ],

      // Flujo de salida
      salida: [
        { path: "/inicio-coordinador", label: "Inicio Coordinación", icon: "⚙️" },
        { path: "/confirmar-cierre", label: "Confirmar Salida", icon: "🚪" }
      ]
    };

    const currentPath = "/" + pathnames.join("/");
    
    // Determinar qué flujo estamos siguiendo basado en la página actual
    for (const [flujoNombre, flujo] of Object.entries(flujos)) {
      // MODIFICACIÓN: Reconocer rutas dinámicas como /info-encuesta/:id
      const indiceFlujo = flujo.findIndex(item => 
        currentPath.startsWith(item.path) || item.path === currentPath
      );
      
      if (indiceFlujo !== -1) {
        const flujoCompleto = [...flujo];
        
        // Si estamos en una ruta dinámica como /info-encuesta/:id
        if (flujoNombre === "coordinadorEncuestas" && pathnames[0] === "info-encuesta" && pathnames.length > 1) {
          flujoCompleto[2] = {
            ...flujoCompleto[2],
            label: `Detalles Encuesta #${pathnames[1]}`
          };
        }
        
        return flujoCompleto.slice(0, indiceFlujo + 1);
      }
    }
    
    // Si no coincide con ningún flujo predefinido, usar el mapeo tradicional
    return null;
  };

  // Función para determinar contextos especiales
  const obtenerContextoEspecial = (pathnames) => {
    const currentPath = "/" + pathnames.join("/");
    
    // Páginas que requieren contexto especial
    const contextosEspeciales = {
      "/contacto": [
        { path: "/contacto", label: "Contacto", icon: "📞" }
      ],
      "/seleccionar-encuesta": [
        { path: "/inicio-coordinador", label: "Inicio Coordinación", icon: "⚙️" },
        { path: "/registro-encuestas", label: "Gestión de Encuestas", icon: "📝" },
        { path: "/seleccionar-encuesta", label: "Seleccionar Encuesta", icon: "📋" }
      ]
    };

    return contextosEspeciales[currentPath] || null;
  };

  if (pathnames.length === 0) {
    return null;
  }

  const isCoordinadorPage = pathnames.some((path) =>
    [
      "inicio-coordinador",
      "registro-encuestas",
      "nuevo-evento",
      "iniciocoordinador",
      "crear-pregunta",
      "calendario",
      "guardar-pregunta",
      "visualizacionE",
      "confirmar-cierre",
      "info-encuesta",
      "seleccionar-encuesta"
    ].includes(path.toLowerCase())
  );

  // Intentar usar el flujo lógico primero
  const flujoLogico = definirFlujoLogico(pathnames);
  const contextoEspecial = obtenerContextoEspecial(pathnames);

  // Usar contexto especial si existe, luego flujo lógico, finalmente fallback
  const flujoAMostrar = contextoEspecial || flujoLogico;

  // Construir las clases CSS
  const containerClasses = [
    "migadepan-container",
    isCoordinadorPage ? "coordinator-page" : "",
    withSidebar ? "with-sidebar" : ""
  ].filter(Boolean).join(" ");

  // Aplicar estilo inline para el sidebar si es necesario
  const containerStyle = withSidebar && sidebarVisible ? {
    marginLeft: "250px",
    width: "calc(100% - 250px)"
  } : {};

  if (flujoAMostrar) {
    return (
      <div
        className={containerClasses}
        style={containerStyle}
      >
        <div className="migadepan">
          {flujoAMostrar.map((item, index) => {
            const isLast = index === flujoAMostrar.length - 1;
            const isFirst = index === 0;

            return (
              <React.Fragment key={item.path}>
                {!isFirst && <span className="migadepan-separator">/</span>}
                {isLast ? (
                  <span className="migadepan-current">
                    <span className="migadepan-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                ) : (
                  <Link to={item.path} className="migadepan-item">
                    <span className="migadepan-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback al sistema original si no hay flujo definido
  return (
    <div
      className={containerClasses}
      style={containerStyle}
    >
      <div className="migadepan">
        <Link to="/" className="migadepan-item">
          <span className="migadepan-icon">🏠</span>
          <span>Inicio</span>
        </Link>
        {pathnames.map((value, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          const displayName =
            pathMap[value.toLowerCase()] || value.replace(/-/g, " ");

          return (
            <React.Fragment key={value}>
              <span className="migadepan-separator">/</span>
              {isLast ? (
                <span className="migadepan-current">{displayName}</span>
              ) : (
                <Link to={routeTo} className="migadepan-item">
                  {displayName}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default MigaDePan;
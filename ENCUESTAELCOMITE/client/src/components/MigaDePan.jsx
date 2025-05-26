import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./MigaDePan.css";

const MigaDePan = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const pathMap = {
    "": "Inicio",
    "iniciar-sesion": "Iniciar Sesión",
    "seleccionar-encuesta": "Seleccionar Encuesta",
    contacto: "Contacto",
    "registro-encuestas": "Registro de Encuestas",
    "inicio-coordinador": "Inicio Coordinador",
    "info-encuesta": "Información de Encuesta",
    "nuevo-evento": "Nuevo Evento",
    "guardar-pregunta": "Guardar Pregunta",
    "crear-pregunta": "Crear Pregunta",
    calendario: "Calendario",
    encuestas: "Encuestas",
    ensayo: "Ensayo",
    "confirmar-cierre": "Confirmar Cierre",
    visualizacionE: "Previsualización",
    "realizar-encuesta": "Realizar Encuesta",
    "rellenar-datos": "Rellenar Datos",
    "responder-encuesta": "Responder Encuesta",
    "visualizar-resultados": "Visualizar Resultados",
    "terminos-y-condiciones": "Términos y Condiciones",
    "ver-resultados": "Ver Resultados",
    tyc: "Términos y Condiciones",
    iniciarsesion: "Iniciar Sesión",
    iniciocoordinador: "Inicio Coordinador",
    "encuestas-activas": "Encuestas Activas",
    "crear-encuesta": "Crear Encuesta",
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
    ].includes(path.toLowerCase())
  );

  return (
    <div
      className={`migadepan-container ${
        isCoordinadorPage ? "coordinator-page" : ""
      }`}
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

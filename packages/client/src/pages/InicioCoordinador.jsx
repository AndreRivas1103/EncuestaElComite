import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import babyLogo from "../assets/LogoMarcaPersonal.png";
import "../components/Sidebar.css";
import "../pages/styles/Home.css";
import "../pages/styles/InicioCoordinador.css";
import MigaDePan from "../components/MigaDePan.jsx";
import { useSidebarClosing } from "../hooks/useSidebarClosing.js";
import PageLead from "../components/PageLead.jsx";

const Sidebar = ({ isVisible, onClose }) => {
  const { sidebarClassName, requestClose } = useSidebarClosing(isVisible, onClose);
  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    name: localStorage.getItem("userName") || "Usuario",
    email: localStorage.getItem("userEmail") || "usuario@ejemplo.com",
  };

  const handleLogout = () => {
    navigate("/confirmar-cierre");
  };

  const menuItems = [
    { path: "/inicio-coordinador", icon: "🏠", label: "Inicio" },
    { path: "/registro-encuestas", icon: "📝", label: "Registro Encuestas" },
    { path: "/nuevo-evento", icon: "📅", label: "Nuevo Evento" },
  ];

  return (
    <div className={sidebarClassName}>
      <button
        type="button"
        className="sidebar-close-btn"
        onClick={requestClose}
        aria-label="Cerrar menú lateral"
      >
        ×
      </button>

      <div className="sidebar-header">
        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}

        <div className="nav-divider" />

        <button className="nav-item logout-item" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Cerrar Sesión</span>
        </button>
      </nav>
    </div>
  );
};

const InicioCoordinadorPrueba = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  // Efecto para asegurar que el sidebar no esté visible inicialmente
  React.useEffect(() => {
    document.body.classList.toggle("sidebar-visible", sidebarVisible);

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("sidebar-visible");
    };
  }, [sidebarVisible]);

  return (
    <div
      style={styles.appContainer}
      className={sidebarVisible ? "sidebar-visible" : ""}
    >
      <title>Inicio Coordinador</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>

      <header className="header">
        <div className="logo">
          <a href="/inicio-coordinador" className="logo">
            El Comit<span>é</span>
          </a>
        </div>
        <img
          src={babyLogo}
          alt="Baby Go Logo"
          className="header-logo"
        />
      </header>

      <MigaDePan
        withSidebar={true}
        sidebarVisible={sidebarVisible}
        onSidebarToggle={() => setSidebarVisible(!sidebarVisible)}
      />

      <Sidebar
        isVisible={sidebarVisible}
        onClose={() => {
          setSidebarVisible(false);
          document.body.classList.remove("sidebar-visible");
        }}
      />

      <div className="coordinator-shifted-main" style={styles.contentArea}>
        <div className="inicio-coordinador-card" style={styles.mainContent}>
          <h1 className="inicio-coordinador-title">Bienvenido Coordinador</h1>
          <PageLead className="page-lead--center">
            Panel principal para gestionar encuestas, crear eventos y seguir el flujo de trabajo del comité.
          </PageLead>

          <div style={styles.contenedorBotones}>
            <Link to="/registro-encuestas" className="btn">
              Registro de encuestas
            </Link>
            <Link to="/nuevo-evento" className="btn">
              Nuevo evento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    transition: "all 0.3s ease-in-out",
  },
  contentArea: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#d3edff" /* Fondo azul claro */,
  },
  mainContent: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  contenedorBotones: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  btn: {
    padding: "12px 25px",
    backgroundColor: "#9ecd49" /* Verde corporativo */,
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    transition: "all 0.3s",
    fontFamily: '"Roboto", sans-serif',
  },
};

export default InicioCoordinadorPrueba;

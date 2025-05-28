import React, { useState, useEffect } from 'react';
import '../pages/styles/registroencuestas.css';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MigaDePan from '../components/MigaDePan.jsx';
import axios from 'axios';

const RegistroEncuesta = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [encuestas, setEncuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarEncuestas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/encuestas');
        setEncuestas(response.data.data);
      } catch (error) {
        console.error('Error al cargar encuestas:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarEncuestas();
  }, []);

  const Sidebar = ({ isVisible, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = {
      name: localStorage.getItem('userName') || "Usuario",
      email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
    };

    const handleLogout = () => {
      navigate("/confirmar-cierre");
    };

    const menuItems = [
      { path: '/inicio-coordinador', icon: '🏠', label: 'Inicio' },
      { path: '/registro-encuestas', icon: '📝', label: 'Registro Encuestas' },
      { path: '/nuevo-evento', icon: '📅', label: 'Nuevo Evento' },
    ];

    return (
      <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
        <title>Registro Encuesta</title>
        <button className="sidebar-close-btn" onClick={onClose}>×</button>

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
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}

          <div className="nav-divider" />

          <button className="nav-item" onClick={() => navigate(-1)}>
            <span className="nav-icon">↩️</span>
            <span className="nav-label">Regresar</span>
          </button>

          <button className="nav-item logout-item" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />

      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador' className="logo">El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      <div className="menu-button-container">
        <button
          className="menu-button"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          ☰
        </button>
      </div>

      <MigaDePan withSidebar={true} sidebarVisible={sidebarVisible} />

      <Sidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

<div className="registro-encuesta-contenedor">
  <h1 className="title-large">Registro de encuesta</h1>

  {cargando ? (
    <div className="registro-encuesta-cargando">
      <div className="registro-encuesta-spinner"></div>
      <p>Cargando encuestas...</p>
    </div>
  ) : encuestas.length > 0 ? (
    <div className="registro-encuesta-grid">
      {encuestas.map((encuesta) => (
        <Link
          key={encuesta.id}
          to={`/info-encuesta/${encuesta.id}`}
          className={`registro-encuesta-boton registro-encuesta-${encuesta.estado.toLowerCase()}`}
        >
          <span className="registro-encuesta-id">{encuesta.id}</span>
          <span className="registro-encuesta-estado">{encuesta.estado}</span>
        </Link>
      ))}
    </div>
  ) : (
    <div className="registro-encuesta-vacio">
      <p>No se encontraron encuestas registradas</p>
      <button className="registro-encuesta-boton" onClick={() => window.location.reload()}>
        Recargar
      </button>
    </div>
  )}
</div>

    </div>
  );
}

export default RegistroEncuesta;

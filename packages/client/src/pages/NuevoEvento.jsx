import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../components/Sidebar.css';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import MigaDePan from '../components/MigaDePan.jsx';
import { useSidebarClosing } from '../hooks/useSidebarClosing.js';
import PageLead from '../components/PageLead.jsx';
import PageSurface from '../components/PageSurface.jsx';

const NuevoEvento = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Componente Sidebar
  const Sidebar = ({ isVisible, onClose }) => {
    const { sidebarClassName, requestClose } = useSidebarClosing(isVisible, onClose);
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
      <div className={sidebarClassName}>
        <button type="button" className="sidebar-close-btn" onClick={requestClose} aria-label="Cerrar menú lateral">×</button>

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

  // Animación keyframes para el efecto ripple
  const globalStyles = `
    @keyframes ripple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.7);
      animation: ripple 0.6s linear;
    }
  `;

  // Función para crear efecto ripple
  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple-effect");
    
    const ripple = button.getElementsByClassName("ripple-effect")[0];
    if (ripple) ripple.remove();
    
    button.appendChild(circle);
  };

  return (
    <div className="page-container">
      <title>Nuevo Evento</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>
      
      {/* Inyectamos los estilos globales para las animaciones */}
      <style>{globalStyles}</style>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador' className="logo">El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      <MigaDePan
        withSidebar={true}
        sidebarVisible={sidebarVisible}
        onSidebarToggle={() => setSidebarVisible(!sidebarVisible)}
      />

      <Sidebar 
        isVisible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)} 
      />

      <div className="coordinator-shifted-main">
        <PageSurface centered cardClassName="nuevo-evento-card">
          <h1 className="nuevo-evento-card__title">Nuevo Evento</h1>
          <PageLead className="page-lead--center page-lead--tight">
            Crea o reutiliza encuestas para un nuevo evento: parte de plantillas guardadas o arma preguntas desde cero.
          </PageLead>

          <div className="nuevo-evento-card__actions">
            <Link
              to="/seleccionar-encuesta"
              className="btn nuevo-evento-card__btn"
              onClick={createRipple}
            >
              Usar Encuestas Anteriores
            </Link>
            <Link
              to="/crear-pregunta"
              className="btn nuevo-evento-card__btn"
              onClick={createRipple}
            >
              Crear Encuesta
            </Link>
          </div>
        </PageSurface>
      </div>
    </div>
  );
}

export default NuevoEvento;
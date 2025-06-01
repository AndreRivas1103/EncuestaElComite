import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import MigaDePan from '../components/MigaDePan.jsx';

const NuevoEvento = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  // Componente Sidebar
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

  // AJUSTES PRINCIPALES
  const containerStyles = {
    width: '90%',
    maxWidth: '800px',
    minHeight: '60vh',
    padding: '100px 30px',
    borderRadius: '20px',
  };

  const titleStyles = {
    fontSize: '3.5rem',
    marginBottom: '40px',
  };

  // Estilo base para botones con animaciones
  const buttonBaseStyle = {
    display: 'block',
    backgroundColor: '#9ecd49',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontFamily: '"Roboto", sans-serif',
    fontSize: '1.6rem',
    padding: '12px 25px',
    margin: '10px 0',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s',
    
    // Efecto hover
    ':hover': {
      backgroundColor: '#8bbd39',
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
    },
    
    // Efecto al hacer clic
    ':active': {
      transform: 'translateY(1px)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }
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
      <header className="header" style={{
        marginLeft: sidebarVisible ? '250px' : '0',
        width: sidebarVisible ? 'calc(100% - 250px)' : '100%',
        transition: 'all 0.3s ease-in-out'
      }}>
        <div className="logo">
          <a href='/inicio-coordinador' className="logo">El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      {/* Botón del menú */}
      <div className="menu-button-container" style={{
        marginLeft: sidebarVisible ? '250px' : '0',
        width: sidebarVisible ? 'calc(100% - 250px)' : '100%',
        transition: 'all 0.3s ease-in-out'
      }}>
        <button 
          className="menu-button" 
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          {sidebarVisible ? '✕' : '☰'}
        </button>
      </div>

      <MigaDePan withSidebar={true} sidebarVisible={sidebarVisible} />

      <Sidebar 
        isVisible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)} 
      />

      {/* Contenido principal */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: sidebarVisible ? '250px' : '0',
        width: sidebarVisible ? 'calc(100% - 250px)' : '100%',
        transition: 'all 0.3s ease-in-out',
        padding: '20px',
        backgroundColor: '#d3edff'
      }}>
        <div style={{
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          ...containerStyles  
        }}>
          {/* Título */}
          <h1 style={{
            fontFamily: '"Merriweather", serif',
            color: '#000000',
            ...titleStyles    
          }}>Nuevo Evento</h1>
          
          {/* Contenedor de botones - CENTRADO */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '500px',
            alignItems: 'center' // Centrar los botones horizontalmente
          }}>
            <Link 
              to="/seleccionar-encuesta" 
              style={buttonBaseStyle}
              className="btn"
              onClick={createRipple}
            >
              Usar Encuestas Anteriores
            </Link>
            <Link 
              to="/crear-pregunta" 
              style={buttonBaseStyle}
              className="btn"
              onClick={createRipple}
            >
              Crear Encuesta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NuevoEvento;
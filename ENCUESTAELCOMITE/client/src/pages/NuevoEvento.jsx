import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const NuevoEvento = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  // Componente Sidebar (copiado de tus otros archivos)
  const Sidebar = ({ isVisible, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = {
      name: localStorage.getItem('userName') || "Usuario",
      email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
    };

    const handleLogout = () => {
      navigate("/confirmar-cierre" );
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

  return (
    <div>
      <title>Nuevo Evento</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>

      {/* Header original */}
      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      {/* Botón para abrir el Sidebar */}
      <div className="menu-button-container">
        <button 
          className="menu-button" 
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar 
        isVisible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)} 
      />

      {/* Contenido original */}
      <div className='firtsColor'>
        <div>
          <h1 className='title-nuevo-evento'>Nuevo Evento</h1>
          <br></br>
        </div>

        <div className='contenedor-botones'>
          <Link to="/seleccionar-encuesta" className="btn btn-center">Usar Encuestas Anteriores</Link>
          <Link to="/Tipo-e" className="btn">Crear Encuesta</Link>
        </div>
      </div>
    </div>
  );
}

export default NuevoEvento;
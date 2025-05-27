import React, { useState } from 'react';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MigaDePan from '../components/MigaDePan.jsx';

const RegistroEncuesta = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

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

      <div className='firtsColor'>
        <div>
          <h1 className='title-large'>Registro de encuesta</h1>
          <br />
        </div>

        <div className="contenedor-botones">
          <Link to="/info-encuesta" className="boton">Encuesta 001</Link>
          <button className="boton">Encuesta 002</button>
          <button className="boton">Encuesta 003</button>
          <button className="boton">Encuesta 004</button>
          <button className="boton">Encuesta 005</button>
          <button className="boton">Encuesta 006</button>
        </div>
      </div>
    </div>
  );
}

export default RegistroEncuesta;
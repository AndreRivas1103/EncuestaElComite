import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const NuevoEvento = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/inicio-coordinador', icon: '🏠', label: 'Inicio' },
    { path: '/registro-encuestas', icon: '📝', label: 'Registro Encuestas' },
    { path: '/nuevo-evento', icon: '📅', label: 'Nuevo Evento' },
  ];

  return (
    <div>
      <title>Tipo de Evento</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>

      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      {/* Botón para abrir sidebar DEBAJO del header */}
      <div style={{ backgroundColor: '#d3edff', padding: '10px 20px' }}>
        <button 
          onClick={() => setSidebarVisible(true)}
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <button className="sidebar-close-btn" onClick={() => setSidebarVisible(false)}>×</button>

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

          <button className="nav-item logout-item" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </nav>
      </div>

      <div className='firtsColor'>
        <div>
          <h1 className='title-nuevo-evento'>Tipo Evento</h1>
          <br />
        </div>

        <div className='contenedor-botones'>
          <Link to="/crear-encuesta" className="btn">Pre Evento</Link>
          <Link to="/crear-encuesta" className="btn">Post Evento</Link>
        </div>
      </div>
    </div>
  );
};

export default NuevoEvento;

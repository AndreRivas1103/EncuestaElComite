import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
  };

  const menuItems = [
    { path: '/inicio-coordinador', icon: '🏠', label: 'Inicio' },
    // Agrega más rutas según necesites
  ];

  return (
    <div className="sidebar">
      {/* Encabezado */}
      <div className="sidebar-header">
        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>

      {/* Menú de navegación */}
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

        {/* Botón de retroceso */}
        <button 
          className="nav-item back-item" 
          onClick={() => navigate(-1)}
        >
          <span className="nav-icon">↩️</span>
          <span className="nav-label">Regresar</span>
        </button>

        <div className="nav-divider" />

        {/* Botón de cierre de sesión */}
        <button 
          className="nav-item logout-item" 
          onClick={() => navigate('/confirmar-logout')}
        >
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Cerrar Sesión</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
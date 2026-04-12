import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebarClosing } from '../hooks/useSidebarClosing.js';
import './Sidebar.css';

const Sidebar = ({ isVisible, onClose }) => {
  const { sidebarClassName, requestClose } = useSidebarClosing(isVisible, onClose);
  const navigate = useNavigate();
  const location = useLocation();

  // Datos del usuario desde localStorage
  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
  };

  // Items del menú
  const menuItems = [
    { path: '/inicio-coordinador', icon: '🏠', label: 'Inicio' },
    { path: '/registro-encuestas', icon: '📝', label: 'Registro Encuestas' },
    { path: '/nuevo-evento', icon: '📅', label: 'Nuevo Evento' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={sidebarClassName}>
      <button className="sidebar-close-btn" onClick={requestClose} type="button" aria-label="Cerrar menú lateral">×</button>

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

        <div className="nav-divider"></div>

        <button className="nav-item logout-item" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Cerrar Sesión</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener datos del usuario desde localStorage
  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Menú de navegación (personaliza según tus rutas)
  const menuItems = [
    { path: '/inicio-coordinador', icon: '🏠', label: 'Inicio' },
  ];

  return (
    <div className="sidebar">
      {/* Encabezado con avatar y datos del usuario */}
      <div className="sidebar-header">
        <div className="avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
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
        <button className="nav-item" onClick={() => navigate(-1)}>
          <span className="nav-icon">↩️</span>
          <span className="nav-label">Regresar</span>
        </button>

        {/* Separador visual */}
        <div className="nav-divider" />

        {/* Botón de cerrar sesión */}
        <button className="nav-item logout-item" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Cerrar Sesión</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
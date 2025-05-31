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

  // AJUSTES PRINCIPALES (MODIFICA ESTOS VALORES)
  const containerStyles = {
    width: '90%',              // Cambia este valor para ajustar el ancho (ej: '80%', '700px')
    maxWidth: '800px',         // Ancho máximo del contenedor blanco
    minHeight: '60vh',         // Altura mínima del contenedor (ej: '60vh', '500px')
    padding: '100px 30px',      // Espacio interno (arriba/abajo izquierda/derecha)
    borderRadius: '20px',      // Radio de las esquinas curvadas
  };

  const titleStyles = {
    fontSize: '3.5rem',          // Tamaño del título
    marginBottom: '40px',      // Espacio debajo del título
  };

  const buttonStyles = {
    fontSize: '1.6rem',        // Tamaño del texto de los botones
    padding: '12px 25px',      // Relleno interno de los botones
    margin: '10px 0',          // Margen entre botones
  };

  return (
    <div className="page-container">
      <title>Nuevo Evento</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>

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
          
          {/* Contenedor de botones */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '500px'
          }}>
            <Link 
              to="/seleccionar-encuesta" 
              style={{
                backgroundColor: '#9ecd49',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                fontFamily: '"Roboto", sans-serif',
                transition: 'all 0.3s',
                ...buttonStyles  
              }}
            >
              Usar Encuestas Anteriores
            </Link>
            <Link 
              to="/crear-pregunta" 
              style={{
                backgroundColor: '#9ecd49',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                fontFamily: '"Roboto", sans-serif',
                transition: 'all 0.3s',
                ...buttonStyles  
              }}
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
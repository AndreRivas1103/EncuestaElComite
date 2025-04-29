import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import '../components/Sidebar.css';
import '../pages/styles/Home.css';

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

        <button className="nav-item logout-item" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Cerrar Sesión</span>
        </button>
      </nav>
    </div>
  );
};

const InicioCoordinadorPrueba = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div style={styles.appContainer}>
      <title>Inicio Coordinador</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>

      <header style={styles.header}>
        <div style={styles.logo}>
          <a href='#' className="logo">El Comit<span style={styles.logoSpan}>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      
      <div style={styles.menuButtonContainer}>
        <button 
          style={styles.menuButton} 
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          ☰
        </button>
      </div>
      
      <Sidebar 
        isVisible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)} 
      />
      
      <div style={styles.contentArea}>
        <div style={styles.mainContent}>
          <h1 style={styles.titleCoordinador}>Bienvenido Coordinador</h1>
          
          <div style={styles.contenedorBotones}>
            <Link to="/registro-encuestas" className="btn">Registro de encuestas</Link>
            <Link to="/nuevo-evento" className="btn">Nuevo evento</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#1E3766', /* Azul corporativo */
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  logo: {
    display: 'flex',
    alignItems: 'center'
  },
  logoLink: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: '"Glock", sans-serif'
  },
  logoSpan: {
    color: '#9ecd49' /* Verde corporativo */
  },
  headerLogo: {
    height: '50px'
  },
  menuButtonContainer: {
    padding: '10px 20px',
    backgroundColor: '#d3edff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'flex-start'
  },
  menuButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#1E3766', /* Azul corporativo */
    padding: '5px 10px',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#d3edff', /* Fondo azul claro */
  },
  mainContent: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '80%',
    maxWidth: '600px'
  },
  titleCoordinador: {
    color: '#00000', /* Azul corporativo */
    marginBottom: '20px',
    fontFamily: "Glock",
    textAlign: 'center',
    fontSize: '4rem',
    letterspacing: '6px',
  },
  contenedorBotones: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  btn: {
    padding: '12px 25px',
    backgroundColor: '#9ecd49', /* Verde corporativo */
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    fontFamily: '"Roboto", sans-serif'
  }
};

export default InicioCoordinadorPrueba;
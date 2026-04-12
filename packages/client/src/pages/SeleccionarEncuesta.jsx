// src/pages/SeleccionarEncuesta.jsx
import React, { useState, useEffect } from 'react';
import '../components/Sidebar.css';
import '../pages/styles/Home.css';
import '../pages/styles/registroencuestas.css'; // Importar estilos específicos
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MigaDePan from '../components/MigaDePan.jsx';
import { useSidebarClosing } from '../hooks/useSidebarClosing.js';
import PageLead from '../components/PageLead.jsx';
import axios from 'axios';

const SeleccionarEncuesta = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [encuestas, setEncuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // Misma lógica para cargar encuestas que en RegistroEncuesta
  useEffect(() => {
    const cargarEncuestas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/encuestas');
        setEncuestas(response.data.data);
      } catch (error) {
        console.error('Error al cargar encuestas:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarEncuestas();
  }, []);

  // Mismo componente Sidebar que en RegistroEncuesta
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

  return (
    <div>
      <title>Seleccionar Encuestas</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      
      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador' className='logo'>El Comit<span>é</span></a>
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

      {/* 
        Misma estructura de visualización que en RegistroEncuesta
        Solo cambia el título de la página
      */}
      <div className="registro-encuesta-contenedor">
        <h1 className="title-large">Seleccionar Encuesta</h1>
        <PageLead>
          Elige una encuesta existente para reutilizarla o tomarla como base antes de clonar o publicar.
        </PageLead>

        {cargando ? (
          <div className="registro-encuesta-cargando">
            <div className="registro-encuesta-spinner"></div>
            <p>Cargando encuestas...</p>
          </div>
        ) : encuestas.length > 0 ? (
          <div className="registro-encuesta-grid">
            {encuestas.map((encuesta) => (
<Link
  key={encuesta.id}
  to={`/clonar-encuesta/${encuesta.id}`}
  className={`registro-encuesta-boton registro-encuesta-${encuesta.estado.toLowerCase()}`}
>
                <span className="registro-encuesta-id">{encuesta.id}</span>
                <span className="registro-encuesta-estado">{encuesta.estado}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="registro-encuesta-vacio">
            <p>No se encontraron encuestas registradas</p>
            <button className="registro-encuesta-boton" onClick={() => window.location.reload()}>
              Recargar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeleccionarEncuesta;
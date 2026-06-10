import React, { useState, useEffect } from 'react';
import '../components/Sidebar.css';
import '../pages/styles/registroencuestas.css';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MigaDePan from '../components/MigaDePan.jsx';
import { useSidebarClosing } from '../hooks/useSidebarClosing.js';
import PageLead from '../components/PageLead.jsx';
import axios from 'axios';
import { toast } from '../lib/toast.js';

const RegistroEncuesta = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [encuestas, setEncuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eliminandoId, setEliminandoId] = useState(null);

  const cargarEncuestas = async () => {
    try {
      setCargando(true);
      const response = await axios.get('http://localhost:3000/api/encuestas');
      setEncuestas(response.data.data);
    } catch (error) {
      console.error('Error al cargar encuestas:', error);
      toast.error('No se pudieron cargar las encuestas');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEncuestas();
  }, []);

  const handleEliminarEncuesta = async (e, encuesta) => {
    e.preventDefault();
    e.stopPropagation();

    const titulo = encuesta.titulo || `Encuesta #${encuesta.id}`;
    const confirmar = window.confirm(
      `¿Eliminar "${titulo}"?\n\nSe borrarán también sus preguntas, respuestas y resultados asociados. Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    try {
      setEliminandoId(encuesta.id);
      await axios.delete(`http://localhost:3000/api/encuestas/${encuesta.id}`);
      setEncuestas((prev) => prev.filter((item) => item.id !== encuesta.id));
      toast.success('Encuesta eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar encuesta:', error);
      toast.error(error.response?.data?.message || 'No se pudo eliminar la encuesta');
    } finally {
      setEliminandoId(null);
    }
  };

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
        <title>Registro Encuesta</title>
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
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />

      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador' className="logo">El Comit<span>é</span></a>
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

<div className="page-content-area">
<div className="registro-encuesta-contenedor page-card page-card--wide">
  <h1 className="title-large">Registro de encuesta</h1>
  <PageLead>
    Consulta y administra las encuestas creadas: revisa datos, duplica plantillas o entra al detalle de cada una.
  </PageLead>

  {cargando ? (
    <div className="registro-encuesta-cargando">
      <div className="registro-encuesta-spinner"></div>
      <p>Cargando encuestas...</p>
    </div>
  ) : encuestas.length > 0 ? (
    <div className="registro-encuesta-grid">
      {encuestas.map((encuesta) => (
        <div
          key={encuesta.id}
          className={`registro-encuesta-tarjeta registro-encuesta-${encuesta.estado.toLowerCase()}`}
        >
          <Link
            to={`/info-encuesta/${encuesta.id}`}
            className="registro-encuesta-boton"
          >
            <span className="registro-encuesta-id">
              {encuesta.titulo || `Encuesta #${encuesta.id}`}
            </span>
            <span className="registro-encuesta-estado">{encuesta.estado}</span>
          </Link>
          <button
            type="button"
            className="registro-encuesta-eliminar"
            onClick={(e) => handleEliminarEncuesta(e, encuesta)}
            disabled={eliminandoId === encuesta.id}
            aria-label={`Eliminar encuesta ${encuesta.id}`}
            title="Eliminar encuesta"
          >
            {eliminandoId === encuesta.id ? '…' : '🗑️'}
          </button>
        </div>
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

    </div>
  );
}

export default RegistroEncuesta;

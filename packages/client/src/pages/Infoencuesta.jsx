import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/styles/InfoEncuesta.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import MigaDePan from '../components/MigaDePan.jsx';

const InfoEncuesta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encuesta, setEncuesta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const cargarDetallesEncuesta = async () => {
      try {
        setCargando(true);
        setError('');
        
        const response = await axios.get(`http://localhost:3000/api/encuestas/${id}`);
        const data = response.data.data;
        
        // Parsear datos_encuesta si es necesario
        if (typeof data.datos_encuesta === 'string') {
          data.datos_encuesta = JSON.parse(data.datos_encuesta);
        }
        
        setEncuesta(data);
      } catch (error) {
        console.error('Error al cargar detalles de la encuesta:', error);
        setError('Error al cargar los detalles de la encuesta');
      } finally {
        setCargando(false);
      }
    };
    
    cargarDetallesEncuesta();
  }, [id]);

  const Sidebar = ({ isVisible, onClose }) => {
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
              className={`nav-item ${window.location.pathname === item.path ? 'active' : ''}`}
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

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'No disponible';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

const renderDatosEncuesta = () => {
  if (!encuesta || !encuesta.datos_encuesta) return null;
  return (
    <div className="datos-encuesta-container">
      <h3>Configuración de la Encuesta</h3>
      {encuesta.datos_encuesta.categorias?.map((categoria, index) => (
        <div key={index} className="categoria-container">
          <h4>{categoria.nombre || `Categoría ${index + 1}`}</h4>
          <ul className="preguntas-lista">
            {categoria.preguntas?.map((pregunta, pIndex) => (
              <li key={pIndex} className="pregunta-item">
                <strong>Pregunta {pIndex + 1}:</strong> {pregunta.texto}
                {pregunta.tipoRespuesta === 'multiple' && (
                  <ul className="opciones-lista">
                    {pregunta.opciones
                      ?.filter(op => op && op.trim() !== "")
                      .map((opcion, oIndex) => (
                        <li key={oIndex}>{opcion}</li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};



  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta encuesta?')) {
      try {
        await axios.delete(`http://localhost:3000/api/encuestas/${id}`);
        alert('Encuesta eliminada correctamente');
        navigate('/registro-encuestas');
      } catch (error) {
        console.error('Error al eliminar la encuesta:', error);
        setError('Error al eliminar la encuesta');
      }
    }
  };

  if (cargando) {
    return (
      <div className="cargando-container">
        <div className="spinner"></div>
        <p>Cargando detalles de la encuesta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-mensaje">{error}</p>
        <button onClick={() => navigate('/registro-encuestas')} className="btn-volver">
          Volver a encuestas
        </button>
      </div>
    );
  }

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

      {/* Miga de pan actualizada */}
      <MigaDePan 
        withSidebar={true} 
        sidebarVisible={sidebarVisible}
        migas={[
          { label: 'Inicio', ruta: '/inicio-coordinador' },
          { label: 'Registro Encuestas', ruta: '/registro-encuestas' },
          { label: `Detalles Encuesta #${id}` }
        ]}
      />

      <Sidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <div className="info-encuesta-contenedor">
        <h1 className="title-large">Detalles de la Encuesta</h1>
        
        <div className="encuesta-info-card">
          <div className="encuesta-header">
            <h2 className="encuesta-titulo">{encuesta.titulo || 'Encuesta sin título'}</h2>
            <span className={`encuesta-estado ${encuesta.estado.toLowerCase()}`}>
              {encuesta.estado}
            </span>
          </div>
          
          <div className="encuesta-metadata">
            <div className="metadata-item">
              <strong>ID:</strong> {encuesta.id}
            </div>
            <div className="metadata-item">
              <strong>Fecha de creación:</strong> {formatearFecha(encuesta.fecha_creacion)}
            </div>
            <div className="metadata-item">
              <strong>Fecha de apertura:</strong> {formatearFecha(encuesta.fecha_apertura)}
            </div>
            <div className="metadata-item">
              <strong>Fecha de cierre:</strong> {formatearFecha(encuesta.fecha_cierre)}
            </div>
          </div>
          
          {renderDatosEncuesta()}
          
          <div className="encuesta-acciones">
            <button onClick={() => navigate('/registro-encuestas')} className="btn-volver">
              Volver al listado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoEncuesta;
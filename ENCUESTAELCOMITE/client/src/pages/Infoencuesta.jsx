// src/pages/InfoEncuestaPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/styles/InfoEncuestaPage.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import MigaDePan from '../components/MigaDePan.jsx';

const InfoEncuestaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encuesta, setEncuesta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const cargarEncuesta = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/encuestas/${id}`);
        setEncuesta(response.data.data);
      } catch (err) {
        setError('Error al cargar la encuesta');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargarEncuesta();
  }, [id]);

  // Componente Sidebar (similar al de otras páginas)
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

  // Parsear los datos JSON de la encuesta
  let datosEncuesta = { categorias: [] };
  if (encuesta) {
    try {
      datosEncuesta = JSON.parse(encuesta.datos_encuesta_name);
    } catch (e) {
      console.error('Error al parsear JSON de datos_encuesta', e);
    }
  }

  return (
    <div>
      <title>Detalles de Encuesta</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      
      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador' className='logo'>El Comit<span>é</span></a>
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

      <Sidebar 
        isVisible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)} 
      />

      <MigaDePan withSidebar={true} sidebarVisible={sidebarVisible} />

      <div className="info-encuesta-container">
        {cargando ? (
          <div className="info-encuesta-cargando">
            <div className="spinner"></div>
            <p>Cargando encuesta...</p>
          </div>
        ) : error ? (
          <div className="info-encuesta-error">
            <p>{error}</p>
            <button onClick={() => navigate(-1)}>Volver</button>
          </div>
        ) : !encuesta ? (
          <div className="info-encuesta-no-encontrada">
            <p>No se encontró la encuesta solicitada</p>
            <button onClick={() => navigate(-1)}>Volver</button>
          </div>
        ) : (
          <>
            <h1 className="title-large">{encuesta.título || 'Detalles de la encuesta'}</h1>
            
            <div className="info-encuesta-metadata">
              <div className="metadata-card">
                <div className="metadata-item">
                  <span className="label">ID:</span>
                  <span className="value">{encuesta.id}</span>
                </div>
                <div className="metadata-item">
                  <span className="label">Fecha creación:</span>
                  <span className="value">{encuesta.fecha_creacion}</span>
                </div>
              </div>
              
              <div className="metadata-card">
                <div className="metadata-item">
                  <span className="label">Fecha apertura:</span>
                  <span className="value">{encuesta.fecha_apertura}</span>
                </div>
                <div className="metadata-item">
                  <span className="label">Fecha cierre:</span>
                  <span className="value">{encuesta.fecha_cierre}</span>
                </div>
              </div>
            </div>

            <div className="info-encuesta-datos">
              <h2>Contenido de la encuesta</h2>
              {datosEncuesta.categorias && datosEncuesta.categorias.length > 0 ? (
                datosEncuesta.categorias.map((categoria, index) => (
                  <div key={index} className="categoria">
                    <h3>{categoria.nombre}</h3>
                    <div className="preguntas-container">
                      {categoria.preguntas && categoria.preguntas.map((pregunta, idx) => (
                        <div key={idx} className="pregunta">
                          <p className="pregunta-texto">{pregunta.texto}</p>
                          <p className="pregunta-tipo">Tipo: {pregunta.tipo}</p>
                          {pregunta.opciones && pregunta.opciones.length > 0 && (
                            <div className="opciones">
                              <span>Opciones:</span>
                              <ul>
                                {pregunta.opciones.map((opcion, i) => (
                                  <li key={i}>{opcion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No se encontraron categorías en esta encuesta</p>
              )}
            </div>

            <div className="info-encuesta-actions">
              <button 
                className="action-button primary"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>
              <button 
                className="action-button secondary"
                onClick={() => navigate(`/editar-encuesta/${id}`)}
              >
                Editar Encuesta
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfoEncuestaPage;
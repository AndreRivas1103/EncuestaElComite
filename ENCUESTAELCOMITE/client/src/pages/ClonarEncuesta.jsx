// src/pages/ClonarEncuesta.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/styles/ClonarEncuesta.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import MigaDePan from '../components/MigaDePan.jsx';

const ClonarEncuesta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encuesta, setEncuesta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [nuevoId, setNuevoId] = useState('');
  const [fechaApertura, setFechaApertura] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');

  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
    cedula: localStorage.getItem('userCedula')
  };

  useEffect(() => {
    const cargarDetallesEncuesta = async () => {
      try {
        setCargando(true);
        setError('');

        const response = await axios.get(`http://localhost:3000/api/encuestas/${id}`);
        const data = response.data.data;

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

    if (id) {
      cargarDetallesEncuesta();
    } else {
      setError('ID de encuesta no válido');
      setCargando(false);
    }
  }, [id]);

  const Sidebar = ({ isVisible, onClose }) => {
    const handleLogout = () => navigate("/confirmar-cierre");

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
                      {pregunta.opciones?.map((opcion, oIndex) => (
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

  const handleClonar = async () => {
    if (!user.cedula) {
      alert('Usuario no identificado');
      return;
    }

    let idFinal = nuevoId.trim();
    if (!idFinal || idFinal === encuesta.id) {
      const random = Math.floor(Math.random() * 900 + 100);
      idFinal = `HB-${new Date().getFullYear()}-${random}`;
      alert(`ID repetido o vacío. Se generó uno nuevo automáticamente: ${idFinal}`);
    }

    try {
      const { id: _, ...encuestaSinId } = encuesta;
      const nuevaEncuesta = {
        ...encuestaSinId,
        id: idFinal,
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_apertura: fechaApertura || null,
        fecha_cierre: fechaCierre || null,
        respuestas_count: 0,
        usuario_id: user.cedula
      };

      console.log('🔍 Clonando encuesta con ID:', nuevaEncuesta.id);

      await axios.post('http://localhost:3000/api/encuestas', nuevaEncuesta);
      alert('Encuesta clonada correctamente');
      navigate('/registro-encuestas');
    } catch (error) {
      console.error('Error al clonar la encuesta:', error);
      setError('Error al clonar la encuesta');
    }
  };

const handleProgramar = async () => {
  if (!fechaApertura || !fechaCierre) {
    alert('Por favor, complete ambas fechas');
    return;
  }

  if (new Date(fechaCierre) <= new Date(fechaApertura)) {
    alert('La fecha de cierre debe ser posterior a la de apertura');
    return;
  }

  if (!user.cedula) {
    alert('Usuario no identificado');
    return;
  }

  let idFinal = nuevoId.trim();
  if (!idFinal || idFinal === encuesta.id) {
    const random = Math.floor(Math.random() * 900 + 100);
    idFinal = `HB-${new Date().getFullYear()}-${random}`;
    alert(`ID repetido o vacío. Se generó uno nuevo automáticamente: ${idFinal}`);
  }

  const payload = {
    id: idFinal,
    titulo: encuesta.titulo || 'Encuesta Clonada',
    fecha_apertura: fechaApertura,
    fecha_cierre: fechaCierre,
    fecha_creacion: new Date().toISOString().split('T')[0],
    usuario_id: user.cedula,
    datos_encuesta: encuesta.datos_encuesta,
    respuestas_count: 0
  };

  console.log("📤 Payload final:", payload);

  try {
    await axios.post('http://localhost:3000/api/encuestas/programar', payload);
    alert('Encuesta programada correctamente');
    navigate('/registro-encuestas');
  } catch (error) {
    console.error('Error al programar la encuesta:', error.response?.data || error.message);
    setError(error.response?.data?.error || 'Error al programar la encuesta');
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
        <button className="menu-button" onClick={() => setSidebarVisible(!sidebarVisible)}>
          ☰
        </button>
      </div>

      <MigaDePan
        withSidebar={true}
        sidebarVisible={sidebarVisible}
        migas={[
          { label: 'Inicio', ruta: '/inicio-coordinador' },
          { label: 'Registro Encuestas', ruta: '/registro-encuestas' },
          { label: `Clonar Encuesta #${id}` }
        ]}
      />

      <Sidebar isVisible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      <div className="clonar-encuesta-contenedor">
        <h1 className="title-large">Clonar Encuesta</h1>
        <div className="encuesta-info-card">
          <div className="encuesta-header">
            <h2 className="encuesta-titulo">{encuesta.titulo || `Encuesta #${encuesta.id}`}</h2>
            <span className={`encuesta-estado ${encuesta.estado.toLowerCase()}`}>
              {encuesta.estado}
            </span>
          </div>

          <div className="encuesta-metadata">
            <div className="metadata-item"><strong>ID Original:</strong> {encuesta.id}</div>
            <div className="metadata-item"><strong>Fecha de creación:</strong> {formatearFecha(encuesta.fecha_creacion)}</div>
            <div className="metadata-item"><strong>Fecha de apertura:</strong> {formatearFecha(encuesta.fecha_apertura)}</div>
            <div className="metadata-item"><strong>Fecha de cierre:</strong> {formatearFecha(encuesta.fecha_cierre)}</div>
          </div>

          {renderDatosEncuesta()}

          <div className="clonar-formulario">
            <h3>Configuración de la Nueva Encuesta</h3>
            <div className="form-group">
              <label htmlFor="nuevoId">Nuevo ID:</label>
              <input type="text" id="nuevoId" value={nuevoId} onChange={(e) => setNuevoId(e.target.value)} placeholder="Ej: HB-2023-01" required />
            </div>

            <div className="form-group">
              <label htmlFor="fechaApertura">Fecha de Apertura:</label>
              <input type="date" id="fechaApertura" value={fechaApertura} onChange={(e) => setFechaApertura(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="fechaCierre">Fecha de Cierre:</label>
              <input type="date" id="fechaCierre" value={fechaCierre} onChange={(e) => setFechaCierre(e.target.value)} />
            </div>

            <div className="form-acciones">
              <button onClick={handleClonar} className="btn-clonar">Clonar Encuesta</button>
              <button onClick={handleProgramar} className="btn-programar">Programar Encuesta</button>
              <button onClick={() => navigate('/registro-encuestas')} className="btn-volver">Volver</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClonarEncuesta;

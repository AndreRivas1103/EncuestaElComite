import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import '../Pages/styles/Home.css';
import '../Pages/styles/CreacionPreguntas.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const root = ReactDOM.createRoot(document.getElementById('root'));

const CrearPregunta = () => {
  const [preguntas, setPreguntas] = useState([{ 
    texto: '', 
    tipoRespuesta: 'multiple', 
    opciones: ['', '', '', ''] 
  }]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
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

  const agregarPregunta = () => {
    if (preguntas.length < 3) {
      setPreguntas([...preguntas, { 
        texto: '', 
        tipoRespuesta: 'multiple', 
        opciones: ['', '', '', ''] 
      }]);
    }
  };

  const cambiarTextoPregunta = (index, nuevoTexto) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].texto = nuevoTexto;
    setPreguntas(nuevasPreguntas);
  };

  const cambiarTipoRespuesta = (index, tipo) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].tipoRespuesta = tipo;
    setPreguntas(nuevasPreguntas);
  };

  const cambiarOpcion = (preguntaIndex, opcionIndex, nuevoValor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaIndex].opciones[opcionIndex] = nuevoValor;
    setPreguntas(nuevasPreguntas);
  };

  return (
    <div>
      <title>Crear Pregunta</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />

      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt='Baby Go Logo' className='header-logo' />
      </header>

      {/* Botón para abrir sidebar debajo del header */}
      <div style={{ backgroundColor: '#d3edff', padding: '10px 20px' }}>
        <button 
          onClick={() => setSidebarVisible(true)}
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <button className="sidebar-close-btn" onClick={() => setSidebarVisible(false)}>×</button>

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

      <div className='firtsColor'>
        <div>
          <h1 className='title-large'>Crear preguntas</h1>
        </div>

        {preguntas.map((pregunta, index) => (
          <div key={index} className="pregunta-container">
            <h1 className='texto2'>Pregunta {index + 1}:</h1>
            <input 
              type="text" 
              className='campo-pregunta' 
              value={pregunta.texto}
              onChange={(e) => cambiarTextoPregunta(index, e.target.value)}
              placeholder="Escribe tu pregunta aquí"
            />

            <br />
            <h1 className='texto3'>Tipo de respuesta</h1>
            <div className="opciones-container">
              <div className="opcion-group">
                <label className='contenedor-radio'>
                  <input 
                    type="radio" 
                    name={`tipo-respuesta-${index}`} 
                    className="radio-original" 
                    checked={pregunta.tipoRespuesta === 'multiple'}
                    onChange={() => cambiarTipoRespuesta(index, 'multiple')}
                  />
                  <span className="radio-visual"></span>
                  <span className="radio-texto">Respuesta de opción múltiple</span>
                </label>
                
                {pregunta.tipoRespuesta === 'multiple' && (
                  <>
                    <br />
                    <div className="opciones-abcd">
                      {['A', 'B', 'C', 'D'].map((letra, opcionIndex) => (
                        <div className="opcion-item" key={opcionIndex}>
                          <span className="opcion-letra">{letra} </span>
                          <input 
                            type="text" 
                            className="campo-opcion" 
                            placeholder={`Escribe la opción ${letra}`}
                            value={pregunta.opciones[opcionIndex]}
                            onChange={(e) => cambiarOpcion(index, opcionIndex, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <label className='contenedor-radio'>
                  <input 
                    type="radio" 
                    name={`tipo-respuesta-${index}`} 
                    className="radio-original" 
                    checked={pregunta.tipoRespuesta === 'abierta'}
                    onChange={() => cambiarTipoRespuesta(index, 'abierta')}
                  />
                  <span className="radio-visual"></span>
                  <span className="radio-texto">Respuesta abierta</span>
                </label>
                {pregunta.tipoRespuesta === 'abierta' && (
                  <input type="text" className='campo-respuesta' placeholder="Campo para respuesta abierta" />
                )}
              </div>
            </div>
          </div>
        ))}

        <div className='botones-abajo'>
          {preguntas.length < 3 && (
            <button className='btn-pequeno' onClick={agregarPregunta}>
              Agregar otra pregunta
            </button>
          )}
          <Link to="/calendario" className='btn-pequeno btn-pequeno-guardar'>
            Guardar preguntas
          </Link>
        </div>
      </div>
    </div>
  );
};

root.render(<CrearPregunta />);
export default CrearPregunta;

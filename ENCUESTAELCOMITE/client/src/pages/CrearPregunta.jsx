import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import '../Pages/styles/Home.css';
import '../Pages/styles/CreacionPreguntas.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const root = ReactDOM.createRoot(document.getElementById('root'));

const CrearPregunta = () => {
  const [categoriasDisponibles] = useState([
    'Liderazgo',
    'Trabajo En Equipo',
    'Resiliencia',
    'Obtencion de logros'
  ]);
  
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [categoriasConPreguntas, setCategoriasConPreguntas] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
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

  const agregarCategoria = () => {
    if (categoriaSeleccionada && !categoriasConPreguntas.some(c => c.nombre === categoriaSeleccionada)) {
      setCategoriasConPreguntas([
        ...categoriasConPreguntas,
        {
          nombre: categoriaSeleccionada,
          preguntas: [{
            texto: '',
            tipoRespuesta: 'multiple',
            opciones: ['', '', '', '']
          }]
        }
      ]);
      setCategoriaSeleccionada('');
    }
  };

  const agregarPreguntaACategoria = (categoriaIndex) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    if (nuevasCategorias[categoriaIndex].preguntas.length < 4) {
      nuevasCategorias[categoriaIndex].preguntas.push({
        texto: '',
        tipoRespuesta: 'multiple',
        opciones: ['', '', '', '']
      });
      setCategoriasConPreguntas(nuevasCategorias);
    }
  };

  const cambiarTextoPregunta = (categoriaIndex, preguntaIndex, nuevoTexto) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].texto = nuevoTexto;
    setCategoriasConPreguntas(nuevasCategorias);
  };

  const cambiarTipoRespuesta = (categoriaIndex, preguntaIndex, tipo) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].tipoRespuesta = tipo;
    setCategoriasConPreguntas(nuevasCategorias);
  };

  const cambiarOpcion = (categoriaIndex, preguntaIndex, opcionIndex, nuevoValor) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].opciones[opcionIndex] = nuevoValor;
    setCategoriasConPreguntas(nuevasCategorias);
  };

  const eliminarCategoria = (categoriaIndex) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    nuevasCategorias.splice(categoriaIndex, 1);
    setCategoriasConPreguntas(nuevasCategorias);
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

      <div style={{ backgroundColor: '#d3edff', padding: '10px 20px' }}>
        <button 
          onClick={() => setSidebarVisible(true)}
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
        >
          ☰
        </button>
      </div>

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
          <h1 className='title-large' style={{ textAlign: 'center' }}>Crear preguntas</h1>
        </div>

        {/* Selector de categorías - Centrado */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          marginTop: '20px',
          marginBottom: '40px'
        }}>
          <h2 className='texto2' style={{ textAlign: 'center', marginLeft: '0' }}>Seleccione una categoría:</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className='campo-pregunta'
              style={{ width: '400px' }}
            >
              <option value="">Seleccionar...</option>
              {categoriasDisponibles
                .filter(cat => !categoriasConPreguntas.some(c => c.nombre === cat))
                .map((categoria, index) => (
                  <option key={index} value={categoria}>{categoria}</option>
                ))}
            </select>

            {categoriaSeleccionada && (
              <button 
                onClick={agregarCategoria}
                className='btn-pequeno'
              >
                Agregar categoría
              </button>
            )}
          </div>
        </div>

        {/* Lista de categorías con sus preguntas */}
        {categoriasConPreguntas.map((categoria, categoriaIndex) => (
          <div key={categoriaIndex} style={{ 
            marginBottom: '40px',
            border: '2px solid #1e3766',
            borderRadius: '10px',
            padding: '20px',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#1e3766',
                margin: 0
              }}>
                Categoría: {categoria.nombre}
              </h2>
              <button 
                onClick={() => eliminarCategoria(categoriaIndex)}
                style={{
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Eliminar categoría
              </button>
            </div>

            {categoria.preguntas.map((pregunta, preguntaIndex) => (
              <div key={preguntaIndex} className="pregunta-container" style={{ marginBottom: '30px' }}>
                <h3 className='texto2' style={{ marginLeft: '0' }}>Pregunta {preguntaIndex + 1}:</h3>
                <input 
                  type="text" 
                  className='campo-pregunta' 
                  value={pregunta.texto}
                  onChange={(e) => cambiarTextoPregunta(categoriaIndex, preguntaIndex, e.target.value)}
                  placeholder="Escribe tu pregunta aquí"
                  style={{ marginLeft: '0', width: '100%' }}
                />

                <br />
                <h3 className='texto3'>Tipo de respuesta</h3>
                <div className="opciones-container" style={{ justifyContent: 'center', gap: '100px' }}>
                  <div className="opcion-group">
                    <label className='contenedor-radio'>
                      <input 
                        type="radio" 
                        name={`tipo-respuesta-${categoriaIndex}-${preguntaIndex}`} 
                        className="radio-original" 
                        checked={pregunta.tipoRespuesta === 'multiple'}
                        onChange={() => cambiarTipoRespuesta(categoriaIndex, preguntaIndex, 'multiple')}
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
                                onChange={(e) => cambiarOpcion(categoriaIndex, preguntaIndex, opcionIndex, e.target.value)}
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
                        name={`tipo-respuesta-${categoriaIndex}-${preguntaIndex}`} 
                        className="radio-original" 
                        checked={pregunta.tipoRespuesta === 'abierta'}
                        onChange={() => cambiarTipoRespuesta(categoriaIndex, preguntaIndex, 'abierta')}
                      />
                      <span className="radio-visual"></span>
                      <span className="radio-texto">Respuesta abierta</span>
                    </label>
                    {pregunta.tipoRespuesta === 'abierta' && (
                      <input 
                        type="text" 
                        className='campo-respuesta' 
                        placeholder="Campo para respuesta abierta" 
                        style={{ marginLeft: '0', width: '100%' }} 
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {categoria.preguntas.length < 4 && (
              <button 
                onClick={() => agregarPreguntaACategoria(categoriaIndex)}
                className='btn-pequeno'
                style={{ marginLeft: '0', marginTop: '20px' }}
              >
                Agregar pregunta a esta categoría
              </button>
            )}
          </div>
        ))}

        <div className='botones-abajo'>
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
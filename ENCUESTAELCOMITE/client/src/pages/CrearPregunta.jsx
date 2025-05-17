import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import '../Pages/styles/Home.css';
import '../Pages/styles/CreacionPreguntas.css';
import '../Pages/styles/PreviewEncuesta.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const root = ReactDOM.createRoot(document.getElementById('root'));

const PreviewEncuesta = ({ idEncuesta, categoriasConPreguntas, onVolverEdicion, onPublicar }) => {
  const navigate = useNavigate(); // Añadido useNavigate

  return (
    <div className='firtsColor'>
      <div className="preview-container">
        <h1 className='preview-title'>Encuesta de Habilidades Blandas</h1>
        <h2 className='preview-id'>ID: {idEncuesta}</h2>
        
        {categoriasConPreguntas.map((categoria, index) => (
          <div key={index} className="categoria-seccion">
            <h2 className="titulo-categoria">{categoria.nombre}</h2>
            
            {categoria.preguntas.map((pregunta, pIndex) => (
              <div key={pIndex} className="pregunta-item">
                <h3 className="texto-pregunta">{pregunta.texto || "Pregunta sin texto"}</h3>
                
                <div className="opciones-respuesta">
                  {pregunta.tipoRespuesta === 'multiple' && pregunta.opciones.map((opcion, oIndex) => (
                    opcion && (
                      <label key={oIndex} className="opcion">
                        <input
                          type="radio"
                          name={`pregunta-${index}-${pIndex}`}
                          disabled
                        />
                        <span className="checkmark"></span>
                        {['A', 'B', 'C', 'D'][oIndex]}) {opcion}
                        {pregunta.respuestasCorrectas.includes(oIndex) && (
                          <span className="correct-badge">✓ Correcta</span>
                        )}
                      </label>
                    )
                  ))}
                  {pregunta.tipoRespuesta === 'abierta' && (
                    <input
                      type="text"
                      placeholder="Respuesta abierta"
                      className="respuesta-abierta"
                      disabled
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="preview-actions">
          <button onClick={onVolverEdicion} className="btn-editar">
            Volver a Editar
          </button>
          <button 
            onClick={() => {
              onPublicar(); // Primero guarda los datos
              navigate('/calendario'); // Luego redirige
            }} 
            className="btn-publicar"
          >
            Siguiente: Asignar Fecha
          </button>
        </div>
      </div>
    </div>
  );
};

const CrearPregunta = () => {
  const [categoriasDisponibles] = useState([
    'Liderazgo',
    'Trabajo En Equipo',
    'Resiliencia',
    'Obtencion de logros'
  ]);
  
  const [idEncuesta, setIdEncuesta] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [categoriasConPreguntas, setCategoriasConPreguntas] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
    id: localStorage.getItem('userId') || "1"
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
            opciones: ['', '', '', ''],
            respuestasCorrectas: []
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
        opciones: ['', '', '', ''],
        respuestasCorrectas: []
      });
      setCategoriasConPreguntas(nuevasCategorias);
    }
  };

  const eliminarPregunta = (categoriaIndex, preguntaIndex) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    nuevasCategorias[categoriaIndex].preguntas.splice(preguntaIndex, 1);
    setCategoriasConPreguntas(nuevasCategorias);
  };

  const cambiarTextoPregunta = (categoriaIndex, preguntaIndex, nuevoTexto) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].texto = nuevoTexto;
    setCategoriasConPreguntas(nuevasCategorias);
  };

  const cambiarTipoRespuesta = (categoriaIndex, preguntaIndex, tipo) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].tipoRespuesta = tipo;
    if (tipo === 'abierta') {
      nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].respuestasCorrectas = [];
    }
    setCategoriasConPreguntas(nuevasCategorias);
  };

  const cambiarOpcion = (categoriaIndex, preguntaIndex, opcionIndex, nuevoValor) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].opciones[opcionIndex] = nuevoValor;
    if (nuevoValor.trim() === '' && 
        nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].respuestasCorrectas.includes(opcionIndex)) {
      nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].respuestasCorrectas = 
        nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].respuestasCorrectas.filter(i => i !== opcionIndex);
    }
    setCategoriasConPreguntas(nuevasCategorias);
  };

  const toggleRespuestaCorrecta = (categoriaIndex, preguntaIndex, opcionIndex) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    const respuestasCorrectas = nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].respuestasCorrectas;
    
    if (respuestasCorrectas.includes(opcionIndex)) {
      nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].respuestasCorrectas = 
        respuestasCorrectas.filter(i => i !== opcionIndex);
    } else {
      nuevasCategorias[categoriaIndex].preguntas[preguntaIndex].respuestasCorrectas = 
        [...respuestasCorrectas, opcionIndex];
    }
    
    setCategoriasConPreguntas(nuevasCategorias);
  };

  const eliminarCategoria = (categoriaIndex) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    nuevasCategorias.splice(categoriaIndex, 1);
    setCategoriasConPreguntas(nuevasCategorias);
  };

  const validarEncuesta = () => {
    if (!idEncuesta.trim()) {
      alert("Por favor ingresa un ID para la encuesta");
      return false;
    }
    
    if (categoriasConPreguntas.length === 0) {
      alert("Debes agregar al menos una categoría con preguntas");
      return false;
    }
    
    return categoriasConPreguntas.every(categoria => 
      categoria.preguntas.every(pregunta => {
        const tieneTexto = pregunta.texto.trim() !== '';
        const opcionesValidas = pregunta.tipoRespuesta !== 'multiple' || 
          pregunta.opciones.filter(op => op.trim() !== '').length >= 2;
        const tieneRespuestasCorrectas = pregunta.tipoRespuesta !== 'multiple' || 
          pregunta.respuestasCorrectas.length > 0;
        
        return tieneTexto && opcionesValidas && tieneRespuestasCorrectas;
      })
    );
  };

  const guardarEncuestaTemporal = () => {
    if (validarEncuesta()) {
      const encuestaData = {
        id: idEncuesta,
        titulo: "Encuesta de Habilidades Blandas",
        categorias: categoriasConPreguntas,
        usuarioId: user.id,
        fechaCreacion: new Date().toISOString()
      };
      
      localStorage.setItem('encuestaTemporal', JSON.stringify(encuestaData));
      return true; // Añadido return para indicar éxito
    }
    return false;
  };

  const handlePublicarYRedirigir = () => {
    if (guardarEncuestaTemporal()) {
      navigate('/calendario');
    }
  };

  return (
    <div>
      <title>Crear Encuesta</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />

      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador' className="logo">El Comit<span>é</span></a>
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

      {!mostrarPreview ? (
        <div className='firtsColor'>
          <div>
            <h1 className='title-large' style={{ textAlign: 'center' }}>Encuesta de Habilidades Blandas</h1>
          </div>

          <div className='selector-categoria' style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            margin: '20px 0',
            textAlign: 'center'
          }}>
            <h2 className='texto2' style={{ textAlign: 'center', marginLeft: '0' }}>ID de la encuesta:</h2>
            <input
              type="text"
              className='campo-pregunta'
              value={idEncuesta}
              onChange={(e) => setIdEncuesta(e.target.value)}
              placeholder="Ej: HB-2023-1"
              style={{ width: '400px' }}
              required
            />
          </div>

          <div className='selector-categoria' style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            margin: '20px 0 40px',
            textAlign: 'center',
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

          {categoriasConPreguntas.map((categoria, categoriaIndex) => (
            <div key={categoriaIndex} className='categoria-container' style={{ 
              margin: '0 auto 40px',
              border: '2px solid #1e3766',
              borderRadius: '10px',
              padding: '20px',
              maxWidth: '900px',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '10px',
                borderBottom: '1px solid #ddd'
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
                  className='btn-eliminar'
                  style={{
                    background: '#fa0505',
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
                <div key={preguntaIndex} className="pregunta-container" style={{ 
                  marginBottom: '30px',
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => eliminarPregunta(categoriaIndex, preguntaIndex)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#fa0505',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '25px',
                      height: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Eliminar pregunta"
                  >
                    ×
                  </button>

                  <h3 className='texto2' style={{ marginLeft: '0' }}>Pregunta {preguntaIndex + 1}:</h3>
                  <input 
                    type="text" 
                    className='campo-pregunta' 
                    value={pregunta.texto}
                    onChange={(e) => cambiarTextoPregunta(categoriaIndex, preguntaIndex, e.target.value)}
                    placeholder="Escribe tu pregunta aquí"
                    style={{ marginLeft: '0', width: '100%' }}
                    required
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
                              <div className="opcion-item" key={opcionIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <span className="opcion-letra">{letra} </span>
                                <input 
                                  type="text" 
                                  className="campo-opcion" 
                                  placeholder={`Escribe la opción ${letra}`}
                                  value={pregunta.opciones[opcionIndex]}
                                  onChange={(e) => cambiarOpcion(categoriaIndex, preguntaIndex, opcionIndex, e.target.value)}
                                  style={{ flex: 1 }}
                                />
                                {pregunta.opciones[opcionIndex] && (
                                  <label className="respuesta-correcta-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <input
                                      type="checkbox"
                                      checked={pregunta.respuestasCorrectas.includes(opcionIndex)}
                                      onChange={() => toggleRespuestaCorrecta(categoriaIndex, preguntaIndex, opcionIndex)}
                                    />
                                    Correcta
                                  </label>
                                )}
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
                  style={{ marginLeft: '0', marginTop: '10px' }}
                >
                  Agregar pregunta a esta categoría ({4 - categoria.preguntas.length} restantes)
                </button>
              )}
            </div>
          ))}

          {categoriasConPreguntas.length > 0 && (
            <div className='botones-abajo'>
              <button 
                onClick={() => setMostrarPreview(true)} 
                className='btn-pequeno btn-pequeno-guardar'
              >
                Previsualizar Encuesta
              </button>
            </div>
          )}
        </div>
      ) : (
        <PreviewEncuesta
          idEncuesta={idEncuesta}
          categoriasConPreguntas={categoriasConPreguntas}
          onVolverEdicion={() => setMostrarPreview(false)}
          onPublicar={handlePublicarYRedirigir} // Cambiado a la nueva función
        />
      )}
    </div>
  );
};

root.render(<CrearPregunta />);
export default CrearPregunta;
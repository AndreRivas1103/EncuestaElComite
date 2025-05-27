import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import '../pages/styles/Home.css';
import '../pages/styles/CreacionPreguntas.css';
import '../pages/styles/PreviewEncuesta.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import axios from 'axios';
import MigaDePan from '../components/MigaDePan.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

const PreviewEncuesta = ({ idEncuesta, categoriasConPreguntas, onVolverEdicion, onPublicar }) => {
  const navigate = useNavigate();

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
              onPublicar();
              navigate('/calendario');
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preguntasAnimando, setPreguntasAnimando] = useState(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
    cedula: localStorage.getItem('userCedula') // ← Bien definido
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
      const nuevoCategoriaIndex = categoriasConPreguntas.length;
      const preguntaId = `${nuevoCategoriaIndex}-0`;
      
      setCategoriasConPreguntas([
        ...categoriasConPreguntas,
        {
          nombre: categoriaSeleccionada,
          preguntas: [{
            texto: '',
            tipoRespuesta: 'multiple',
            opciones: ['', '', '', ''],
            respuestasCorrectas: [],
            id: preguntaId
          }]
        }
      ]);
      setCategoriaSeleccionada('');
      
      // Activar animación para la primera pregunta de la nueva categoría
      setPreguntasAnimando(prev => new Set([...prev, preguntaId]));
      
      setTimeout(() => {
        setPreguntasAnimando(prev => {
          const newSet = new Set(prev);
          newSet.delete(preguntaId);
          return newSet;
        });
      }, 800);
    }
  };

  const agregarPreguntaACategoria = (categoriaIndex) => {
    const nuevasCategorias = [...categoriasConPreguntas];
    if (nuevasCategorias[categoriaIndex].preguntas.length < 4) {
      const nuevaPreguntaIndex = nuevasCategorias[categoriaIndex].preguntas.length;
      const preguntaId = `${categoriaIndex}-${nuevaPreguntaIndex}`;
      
      // Agregar la nueva pregunta
      nuevasCategorias[categoriaIndex].preguntas.push({
        texto: '',
        tipoRespuesta: 'multiple',
        opciones: ['', '', '', ''],
        respuestasCorrectas: [],
        id: preguntaId // Identificador único para la animación
      });
      
      setCategoriasConPreguntas(nuevasCategorias);
      
      // Activar animación para esta pregunta
      setPreguntasAnimando(prev => new Set([...prev, preguntaId]));
      
      // Remover la animación después de que termine
      setTimeout(() => {
        setPreguntasAnimando(prev => {
          const newSet = new Set(prev);
          newSet.delete(preguntaId);
          return newSet;
        });
      }, 800); // Duración de la animación
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
      alert("❌ Error: Por favor ingresa un ID para la encuesta");
      return false;
    }
    
    if (categoriasConPreguntas.length === 0) {
      alert("❌ Error: Debes agregar al menos una categoría con preguntas");
      return false;
    }
    
    // Validación detallada pregunta por pregunta
    for (let categoriaIndex = 0; categoriaIndex < categoriasConPreguntas.length; categoriaIndex++) {
      const categoria = categoriasConPreguntas[categoriaIndex];
      
      if (categoria.preguntas.length === 0) {
        alert(`❌ Error: La categoría "${categoria.nombre}" no tiene preguntas. Agrega al menos una pregunta.`);
        return false;
      }
      
      for (let preguntaIndex = 0; preguntaIndex < categoria.preguntas.length; preguntaIndex++) {
        const pregunta = categoria.preguntas[preguntaIndex];
        const numeroPregunta = preguntaIndex + 1;
        
        // Validar que tenga texto
        if (!pregunta.texto.trim()) {
          alert(`❌ Error: La Pregunta ${numeroPregunta} de la categoría "${categoria.nombre}" no tiene texto. Por favor escriba la pregunta.`);
          return false;
        }
        
        // Validaciones específicas para preguntas de opción múltiple
        if (pregunta.tipoRespuesta === 'multiple') {
          const opcionesConTexto = pregunta.opciones.filter(op => op.trim() !== '');
          
          // Validar que tenga al menos 2 opciones
          if (opcionesConTexto.length < 2) {
            alert(`❌ Error: La Pregunta ${numeroPregunta} de la categoría "${categoria.nombre}" necesita al menos 2 opciones. Actualmente tiene ${opcionesConTexto.length}.`);
            return false;
          }
          
          // Validar que tenga al menos una respuesta correcta
          if (pregunta.respuestasCorrectas.length === 0) {
            alert(`❌ Error: La Pregunta ${numeroPregunta} de la categoría "${categoria.nombre}" no tiene ninguna respuesta marcada como correcta. Por favor marca al menos una opción como correcta.`);
            return false;
          }
          
          // Validar que las respuestas correctas correspondan a opciones con texto
          const respuestasIncorrectas = pregunta.respuestasCorrectas.filter(index => 
            !pregunta.opciones[index] || pregunta.opciones[index].trim() === ''
          );
          
          if (respuestasIncorrectas.length > 0) {
            const letras = ['A', 'B', 'C', 'D'];
            const opcionesVacias = respuestasIncorrectas.map(index => letras[index]).join(', ');
            alert(`❌ Error: La Pregunta ${numeroPregunta} de la categoría "${categoria.nombre}" tiene opciones marcadas como correctas pero sin texto: ${opcionesVacias}. Complete el texto o desmarque estas opciones.`);
            return false;
          }
        }
      }
    }
    
    return true;
  };

  const guardarEncuestaTemporal = async () => {
    if (!validarEncuesta()) return false;

    const encuestaData = {
      id: idEncuesta,
      titulo: "Encuesta de Habilidades Blandas",
      usuario_id: user.cedula,
      datos_encuesta: {
        categorias: categoriasConPreguntas,
      },
      fecha_creacion: new Date().toISOString(),
      estado: "borrador",
      fecha_apertura: null,
      fecha_cierre: null,
    };

    try {
      console.log("[DEBUG] Simulación de guardado sin API");
      console.log("[DEBUG] Encuesta guardada:", encuestaData);
      localStorage.setItem('encuestaTemporal', JSON.stringify(encuestaData));
      return true;
    } catch (error) {
      console.error('Error al guardar encuesta:', error);
      setError('No se pudo guardar la encuesta.');
      return false;
    }
  };


  const handlePublicarYRedirigir = async () => {
    const success = await guardarEncuestaTemporal();
    if (success) {
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

      <MigaDePan withSidebar={true} sidebarVisible={sidebarVisible} />

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
                  style={{
                    backgroundColor: '#73a31d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    fontFamily: 'Roboto'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#5a8a0f'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#73a31d'}
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
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                  Eliminar categoría
                </button>
              </div>

              {categoria.preguntas.map((pregunta, preguntaIndex) => {
                const preguntaId = pregunta.id || `${categoriaIndex}-${preguntaIndex}`;
                const estaAnimando = preguntasAnimando.has(preguntaId);
                
                return (
                <div key={preguntaIndex} className="pregunta-container" style={{ 
                  marginBottom: '30px',
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  position: 'relative',
                  // Estilos de animación
                  transform: estaAnimando ? 'scale(1.02) translateY(-5px)' : 'scale(1) translateY(0)',
                  opacity: estaAnimando ? 1 : 1,
                  boxShadow: estaAnimando ? 
                    '0 10px 25px rgba(115, 163, 29, 0.3), 0 0 0 3px rgba(115, 163, 29, 0.1)' : 
                    '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  animation: estaAnimando ? 'bounceIn 0.8s ease-out' : 'none',
                  background: estaAnimando ? 
                    'linear-gradient(145deg, #ffffff 0%, #f8fff8 50%, #ffffff 100%)' : 
                    'white'
                }}>
                  <button
                    onClick={() => eliminarPregunta(categoriaIndex, preguntaIndex)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '25px',
                      height: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
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

                  <div style={{ marginTop: '25px' }}>
                    <h3 className='texto3' style={{ marginBottom: '20px', textAlign: 'left', marginLeft: '0' }}>Tipo de respuesta</h3>
                    
                    {/* Contenedor principal más organizado */}
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                      marginLeft: '0'
                    }}>
                      
                      {/* Opción múltiple */}
                      <div style={{
                        padding: '15px',
                        border: pregunta.tipoRespuesta === 'multiple' ? '2px solid #73a31d' : '2px solid #e9ecef',
                        borderRadius: '10px',
                        backgroundColor: pregunta.tipoRespuesta === 'multiple' ? '#f8fff8' : '#f8f9fa',
                        transition: 'all 0.3s ease'
                      }}>
                        <label className='contenedor-radio' style={{ marginBottom: '15px' }}>
                          <input 
                            type="radio" 
                            name={`tipo-respuesta-${categoriaIndex}-${preguntaIndex}`} 
                            className="radio-original" 
                            checked={pregunta.tipoRespuesta === 'multiple'}
                            onChange={() => cambiarTipoRespuesta(categoriaIndex, preguntaIndex, 'multiple')}
                          />
                          <span className="radio-visual"></span>
                          <span className="radio-texto" style={{ fontWeight: 'bold', fontSize: '16px' }}>Respuesta de opción múltiple</span>
                        </label>
                        
                        {pregunta.tipoRespuesta === 'multiple' && (
                          <div style={{ marginTop: '15px', marginLeft: '0' }}>
                            {['A', 'B', 'C', 'D'].map((letra, opcionIndex) => (
                              <div key={opcionIndex} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '15px', 
                                marginBottom: '12px',
                                padding: '8px',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef'
                              }}>
                                <span className="opcion-letra" style={{
                                  minWidth: '35px',
                                  height: '35px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>{letra}</span>
                                <input 
                                  type="text" 
                                  className="campo-opcion" 
                                  placeholder={`Escribe la opción ${letra}`}
                                  value={pregunta.opciones[opcionIndex]}
                                  onChange={(e) => cambiarOpcion(categoriaIndex, preguntaIndex, opcionIndex, e.target.value)}
                                  style={{ 
                                    flex: 1,
                                    padding: '10px',
                                    border: '1px solid #73a31d',
                                    borderRadius: '5px',
                                    fontSize: '14px'
                                  }}
                                />
                                {pregunta.opciones[opcionIndex] && (
                                  <label className="respuesta-correcta-label" style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    minWidth: '90px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                  }}>
                                    <input
                                      type="checkbox"
                                      checked={pregunta.respuestasCorrectas.includes(opcionIndex)}
                                      onChange={() => toggleRespuestaCorrecta(categoriaIndex, preguntaIndex, opcionIndex)}
                                      style={{ 
                                        width: '18px', 
                                        height: '18px',
                                        accentColor: '#73a31d'
                                      }}
                                    />
                                    Correcta
                                  </label>
                                )}
                              </div>
                            ))}
                            
                            {/* Indicador de validación en tiempo real */}
                            {(() => {
                              const opcionesConTexto = pregunta.opciones.filter(op => op.trim() !== '');
                              const tieneRespuestasCorrectas = pregunta.respuestasCorrectas.length > 0;
                              const opcionesMinimas = opcionesConTexto.length >= 2;
                              
                              if (!opcionesMinimas || !tieneRespuestasCorrectas) {
                                return (
                                  <div style={{
                                    marginTop: '15px',
                                    padding: '10px',
                                    backgroundColor: '#fff3cd',
                                    border: '1px solid #ffeaa7',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                  }}>
                                    <span style={{ fontSize: '18px' }}>⚠️</span>
                                    <div style={{ fontSize: '14px', color: '#856404' }}>
                                      {!opcionesMinimas && (
                                        <div>• Necesitas al menos 2 opciones con texto ({opcionesConTexto.length}/2)</div>
                                      )}
                                      {!tieneRespuestasCorrectas && opcionesMinimas && (
                                        <div>• <strong>Debes marcar al menos una opción como correcta</strong></div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                              
                              return (
                                <div style={{
                                  marginTop: '15px',
                                  padding: '10px',
                                  backgroundColor: '#d4edda',
                                  border: '1px solid #c3e6cb',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px'
                                }}>
                                  <span style={{ fontSize: '18px' }}>✅</span>
                                  <div style={{ fontSize: '14px', color: '#155724', fontWeight: '500' }}>
                                    Pregunta configurada correctamente
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                      
                      {/* Respuesta abierta */}
                      <div style={{
                        padding: '15px',
                        border: pregunta.tipoRespuesta === 'abierta' ? '2px solid #73a31d' : '2px solid #e9ecef',
                        borderRadius: '10px',
                        backgroundColor: pregunta.tipoRespuesta === 'abierta' ? '#f8fff8' : '#f8f9fa',
                        transition: 'all 0.3s ease'
                      }}>
                        <label className='contenedor-radio' style={{ marginBottom: '15px' }}>
                          <input 
                            type="radio" 
                            name={`tipo-respuesta-${categoriaIndex}-${preguntaIndex}`} 
                            className="radio-original" 
                            checked={pregunta.tipoRespuesta === 'abierta'}
                            onChange={() => cambiarTipoRespuesta(categoriaIndex, preguntaIndex, 'abierta')}
                          />
                          <span className="radio-visual"></span>
                          <span className="radio-texto" style={{ fontWeight: 'bold', fontSize: '16px' }}>Respuesta abierta</span>
                        </label>
                        
                        {pregunta.tipoRespuesta === 'abierta' && (
                          <div style={{ marginTop: '15px' }}>
                            <input 
                              type="text" 
                              className='campo-respuesta' 
                              placeholder="Los participantes escribirán aquí su respuesta libre" 
                              style={{ 
                                marginLeft: '0', 
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #73a31d',
                                borderRadius: '5px',
                                backgroundColor: 'white',
                                fontSize: '14px'
                              }}
                              disabled
                            />
                            <small style={{ 
                              display: 'block', 
                              marginTop: '5px', 
                              color: '#6c757d',
                              fontStyle: 'italic'
                            }}>
                              Campo de ejemplo - Los participantes podrán escribir libremente
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}

              {categoria.preguntas.length < 4 && (
                <button 
                  onClick={() => agregarPreguntaACategoria(categoriaIndex)}
                  className='btn-pequeno'
                  style={{ 
                    marginLeft: '0', 
                    marginTop: '10px',
                    backgroundColor: '#73a31d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 16px',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    fontFamily: 'Roboto'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#5a8a0f'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#73a31d'}
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
                style={{
                  backgroundColor: '#73a31d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '8px 16px',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  fontFamily: 'Roboto'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#5a8a0f'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#73a31d'}
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
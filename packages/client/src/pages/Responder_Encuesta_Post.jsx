import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../pages/styles/ResponderEncuesta.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import MigaDePan from '../components/MigaDePan.jsx';

const ResponderEncuestaPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [encuesta, setEncuesta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Obtener encuesta activa con manejo detallado de errores
  useEffect(() => {
    const fetchEncuestaActiva = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('[DEBUG] Iniciando carga de encuesta activa...');
        const response = await axios.get('http://localhost:3000/api/encuestas/activa');
        const data = response.data.data;

        console.log('[DEBUG] Datos recibidos:', data);

        // Validación básica de la respuesta
        if (!data) {
          throw new Error('No se recibieron datos de la encuesta');
        }

        // Validar fechas de la encuesta
        const hoy = new Date();
        const fechaApertura = new Date(data.fecha_apertura);
        const fechaCierre = new Date(data.fecha_cierre);
        
        console.log('[DEBUG] Fechas - Hoy:', hoy, 'Apertura:', fechaApertura, 'Cierre:', fechaCierre);
        
        if (hoy < fechaApertura) {
          throw new Error(`Esta encuesta estará disponible a partir del ${fechaApertura.toLocaleDateString()}`);
        }

        // Parsear y validar datos_encuesta
        let datosEncuesta;
        try {
          datosEncuesta = typeof data.datos_encuesta === 'string' 
            ? JSON.parse(data.datos_encuesta) 
            : data.datos_encuesta;
          
          console.log('[DEBUG] Datos encuesta parseados:', datosEncuesta);

          if (!datosEncuesta) {
            throw new Error('La encuesta no tiene datos configurados');
          }

          if (!datosEncuesta.categorias || !Array.isArray(datosEncuesta.categorias)) {
            throw new Error('La estructura de categorías es inválida');
          }

          if (datosEncuesta.categorias.length === 0) {
            throw new Error('La encuesta no tiene categorías configuradas');
          }

          // Validar cada categoría y pregunta
          datosEncuesta.categorias.forEach((categoria, cIndex) => {
            if (!categoria.nombre?.trim()) {
              throw new Error(`La categoría en posición ${cIndex} no tiene nombre`);
            }

            if (!categoria.preguntas || !Array.isArray(categoria.preguntas)) {
              throw new Error(`La categoría "${categoria.nombre}" no tiene una estructura de preguntas válida`);
            }

            if (categoria.preguntas.length === 0) {
              throw new Error(`La categoría "${categoria.nombre}" no tiene preguntas`);
            }

            categoria.preguntas.forEach((pregunta, pIndex) => {
              if (!pregunta.texto?.trim()) {
                throw new Error(`La pregunta ${pIndex + 1} de la categoría "${categoria.nombre}" no tiene texto`);
              }

              if (pregunta.tipoRespuesta === 'multiple') {
                if (!pregunta.opciones || !Array.isArray(pregunta.opciones)) {
                  throw new Error(`La pregunta "${pregunta.texto}" no tiene opciones configuradas`);
                }

                const opcionesValidas = pregunta.opciones.filter(op => op?.trim()).length;
                if (opcionesValidas < 2) {
                  throw new Error(`La pregunta "${pregunta.texto}" necesita al menos 2 opciones válidas`);
                }
              }
            });
          });
        } catch (parseError) {
          console.error('[ERROR] Error al parsear datos_encuesta:', parseError);
          throw new Error('La estructura de la encuesta es inválida. Detalle: ' + parseError.message);
        }

        // Estructurar los datos para el estado
        const encuestaEstructurada = {
          id: data.id,
          titulo: data.titulo || 'Encuesta de Evaluación',
          fecha_apertura: data.fecha_apertura,
          fecha_cierre: data.fecha_cierre,
          categorias: datosEncuesta.categorias.map(categoria => ({
            nombre: categoria.nombre,
            preguntas: categoria.preguntas.map(pregunta => ({
              texto: pregunta.texto,
              tipoRespuesta: pregunta.tipoRespuesta || 'multiple',
              opciones: pregunta.tipoRespuesta === 'multiple'
                ? (pregunta.opciones || ['', '', '', '']).map(op => op || '')
                : [],
              respuestasCorrectas: pregunta.respuestasCorrectas || []
            }))
          }))
        };

        console.log('[DEBUG] Encuesta estructurada:', encuestaEstructurada);
        setEncuesta(encuestaEstructurada);

        // Inicializar respuestas vacías
        const respuestasIniciales = {};
        encuestaEstructurada.categorias.forEach(categoria => {
          categoria.preguntas.forEach((pregunta, pIndex) => {
            const preguntaId = `${categoria.nombre}-p${pIndex}`;
            respuestasIniciales[preguntaId] = '';
          });
        });
        setRespuestas(respuestasIniciales);

        console.log('[DEBUG] Estado de respuestas inicializado:', respuestasIniciales);

      } catch (err) {
        console.error('[ERROR] Error al cargar encuesta:', err);
        
        let errorMessage = 'Error al cargar la encuesta';
        if (err.response) {
          // Error de la API
          errorMessage = err.response.data?.message || err.response.statusText || errorMessage;
          console.error('[ERROR] Detalles del error:', err.response.data);
        } else if (err.message) {
          // Error lanzado manualmente
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEncuestaActiva();
  }, []);

  // Manejar cambios en las respuestas
  const handleChange = (preguntaId, value) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: value
    }));
  };

  // Mostrar modal de confirmación
  const handleShowConfirmation = (e) => {
    e.preventDefault();
    
    // Validar que todas las preguntas tengan respuesta
    const preguntasSinResponder = Object.entries(respuestas)
      .filter(([_, resp]) => resp === '')
      .map(([preguntaId]) => preguntaId);
    
    if (preguntasSinResponder.length > 0) {
      console.error('[ERROR] Preguntas sin responder:', preguntasSinResponder);
      setError('Por favor responde todas las preguntas');
      window.scrollTo(0, 0);
      return;
    }

    setError('');
    setShowConfirmModal(true);
  };

  // Confirmar y enviar respuestas
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setError('');
    
    try {
      const correoVoluntario = new URLSearchParams(location.search).get('correo') || '';
      
      // Preparar respuestas para enviar al backend
      const respuestasFormateadas = encuesta.categorias.flatMap(categoria => 
        categoria.preguntas.map((pregunta, pIndex) => {
          const preguntaId = `${categoria.nombre}-p${pIndex}`;
          const respuestaUsuario = respuestas[preguntaId];
          
          const respuestaBase = {
            categoria: categoria.nombre,
            pregunta: pregunta.texto,
            respuesta: respuestaUsuario,
            tipoRespuesta: pregunta.tipoRespuesta
          };

          if (pregunta.tipoRespuesta === 'multiple') {
            return {
              ...respuestaBase,
              opcionSeleccionada: pregunta.opciones[parseInt(respuestaUsuario)],
              respuestaCorrecta: pregunta.respuestasCorrectas?.[0] ?? null
            };
          } else {
            return respuestaBase;
          }
        })
      );

      console.log('[DEBUG] Respuestas formateadas para enviar:', respuestasFormateadas);
      
      // Enviar respuestas al backend (CORRECCIÓN: endpoint y campo actualizados)
      const response = await axios.post(
        'http://localhost:3000/api/voluntarios/actualizar-post-evento',
        {
          correo: correoVoluntario,
          encuesta_post: respuestasFormateadas,  // Campo corregido
          id_encuesta: encuesta.id,
          nombre: sessionStorage.getItem('nombreVoluntario'),
          identificacion: sessionStorage.getItem('idVoluntario')
        }
      );

      console.log('[DEBUG] Respuesta del servidor:', response.data);

      setSubmitSuccess(true);
      sessionStorage.removeItem('datosVoluntario');
      
      setTimeout(() => {
        navigate('/gracias-por-participar-post', { 
          state: { 
            contrasena: response.data.contrasena,
            nombreCompleto: sessionStorage.getItem('nombreVoluntario'),
            idEncuesta: encuesta.id,
            correoVoluntario: correoVoluntario,
            respuestas: respuestasFormateadas 
          }
        });
      }, 2000);
    } catch (err) {
      console.error('[ERROR] Error al enviar respuestas:', err);
      
      let errorMessage = 'Error al enviar las respuestas';
      if (err.response) {
        errorMessage = err.response.data?.message || err.response.statusText || errorMessage;
        console.error('[ERROR] Detalles del error:', err.response.data);
        
        if (err.response.status === 400) {
          errorMessage = 'Datos de respuesta inválidos: ' + errorMessage;
        } else if (err.response.status === 500) {
          errorMessage = 'Error en el servidor al procesar las respuestas';
        }
      }
      
      setError(errorMessage);
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estados de renderizado
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando encuesta...</p>
        <p className="loading-hint">Si tarda mucho, verifica tu conexión a internet</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <p className="error-hint">
          {error.includes('estructura') && 'La encuesta podría estar mal configurada.'}
          {error.includes('fecha') && 'Verifica las fechas de disponibilidad.'}
          {error.includes('categorías') && 'Revisa la configuración de categorías.'}
        </p>
        <button onClick={() => navigate('/realizar-encuesta')} className="btn-volver">
          Volver a encuestas disponibles
        </button>
        <button onClick={() => window.location.reload()} className="btn-reintentar">
          Reintentar
        </button>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="success-container">
        <h2>Enviando respuestas</h2>
        <p>Tus respuestas han sido guardadas correctamente.</p>
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div>
      <title>Responder Encuesta Post-Evento</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </div>

      <MigaDePan />

      <div className="encuesta-container">
        <button onClick={() => navigate('/realizar-encuesta')} className="btn-back">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>

        <div className="encuesta-content">
          <div className="encuesta-header">
            <h1>{encuesta.titulo}</h1>
            <div className="encuesta-dates">
              <svg className="calendar-icon" viewBox="0 0 24 24">
                <path d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12H20ZM20,10H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z"/>
              </svg>
              <span>Disponible: {new Date(encuesta.fecha_apertura).toLocaleDateString()} - {new Date(encuesta.fecha_cierre).toLocaleDateString()}</span>
            </div>
          </div>

          <form onSubmit={handleShowConfirmation} className="encuesta-form">
            {encuesta.categorias.map((categoria) => (
              <div key={categoria.nombre} className="categoria-group">
                <div className="categoria-header">
                  <div className="categoria-icon">
                    <svg className="star-icon" viewBox="0 0 24 24">
                      <path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21Z"/>
                    </svg>
                  </div>
                  <h2 className="categoria-titulo">{categoria.nombre}</h2>
                </div>
                
                {categoria.preguntas.map((pregunta, pIndex) => {
                  const preguntaId = `${categoria.nombre}-p${pIndex}`;
                  return (
                    <div key={preguntaId} className="pregunta-card">
                      <label className="pregunta-label">
                        <span className="question-number">{pIndex + 1}.</span>
                        {pregunta.texto}
                        <span className="required">*</span>
                      </label>
                      
                      {pregunta.tipoRespuesta === 'multiple' ? (
                        <div className="opciones-container">
                          {pregunta.opciones.filter(op => op.trim() !== '').map((opcion, oIndex) => (
                            <div 
                              key={oIndex} 
                              className={`opcion-group ${
                                respuestas[preguntaId] === String(oIndex) ? 'selected' : ''
                              }`}
                              onClick={() => handleChange(preguntaId, String(oIndex))}
                            >
                              <div className="radio-container">
                                <div className="radio">
                                  {respuestas[preguntaId] === String(oIndex) && (
                                    <div className="radio-dot"></div>
                                  )}
                                </div>
                              </div>
                              <label className="opcion-label">
                                {opcion}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-input-container">
                          <textarea
                            id={`pregunta-${preguntaId}`}
                            value={respuestas[preguntaId] || ''}
                            onChange={(e) => handleChange(preguntaId, e.target.value)}
                            className="respuesta-abierta"
                            required
                            placeholder="Escribe tu respuesta aquí..."
                            rows="3"
                          ></textarea>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {error && (
              <div className="error-message">
                <p>{error}</p>
                {error.includes('responder') && (
                  <p className="error-hint">Por favor revisa las preguntas marcadas con *</p>
                )}
              </div>
            )}

            <div className="submit-container">
              <button type="submit" className="btn-enviar2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Enviando respuestas...
                  </>
                ) : (
                  <>
                    Enviar todas las respuestas
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Modal de confirmación */}
        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirmar envío de respuestas</h3>
              <p>
                ¿Estás seguro de que quieres enviar tus respuestas? 
                Una vez enviadas no podrás modificarlas.
              </p>
              <div className="modal-buttons">
                <button 
                  className="btn-cancelar" 
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-confirmar" 
                  onClick={handleConfirmSubmit}
                >
                  Confirmar y Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponderEncuestaPost;
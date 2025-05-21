import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../Pages/styles/ResponderEncuesta.css';
import '../Pages/styles/PreviewEncuesta.css';
import '../Pages/styles/CreacionPreguntas.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const ResponderEncuesta = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [encuesta, setEncuesta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  // Enviar respuestas con validación y manejo de errores
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('[DEBUG] Intentando enviar respuestas...');
    
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

      const response = await axios.post(
        `http://localhost:3000/api/encuestas/${encuesta.id}/respuestas`,
        {
          correo_voluntario: correoVoluntario,
          respuestas: respuestasFormateadas
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('[DEBUG] Respuesta del servidor:', response.data);
      
      setSubmitSuccess(true);
      sessionStorage.removeItem('datosVoluntario');
      
      setTimeout(() => {
        navigate('/gracias-por-participar');
      }, 2000);
    } catch (err) {
      console.error('[ERROR] Error al enviar respuestas:', err);
      
      let errorMessage = 'Error al enviar las respuestas';
      if (err.response) {
        errorMessage = err.response.data?.message || err.response.statusText || errorMessage;
        console.error('[ERROR] Detalles del error:', err.response.data);
        
        if (err.response.status === 400) {
          errorMessage = 'Datos de respuesta inválidos: ' + errorMessage;
        } else if (err.response.status === 404) {
          errorMessage = 'La encuesta ya no está disponible';
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
        <h2>¡Gracias por participar!</h2>
        <p>Tus respuestas han sido guardadas correctamente.</p>
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="encuesta-page-container">
      <title>Responder Encuesta</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </div>

      <div className="encuesta-container">
        <button onClick={() => navigate('/realizar-encuesta')} className="btn-back">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>

        <div className="encuesta-content">
          <h1>{encuesta.titulo}</h1>
          <p className="encuesta-fechas">
            Disponible desde: {new Date(encuesta.fecha_apertura).toLocaleDateString()} hasta: {new Date(encuesta.fecha_cierre).toLocaleDateString()}
          </p>

          <form onSubmit={handleSubmit} className="encuesta-form">
            {encuesta.categorias.map((categoria) => (
              <div key={categoria.nombre} className="categoria-group">
                <h2 className="categoria-titulo">{categoria.nombre}</h2>
                {categoria.preguntas.map((pregunta, pIndex) => {
                  const preguntaId = `${categoria.nombre}-p${pIndex}`;
                  return (
                    <div key={preguntaId} className="pregunta-group">
                      <label htmlFor={`pregunta-${preguntaId}`}>
                        {pregunta.texto}
                        <span className="required">*</span>
                      </label>
                      
                      {pregunta.tipoRespuesta === 'multiple' ? (
                        <div className="opciones-container">
                          {pregunta.opciones.filter(op => op.trim() !== '').map((opcion, oIndex) => (
                            <div key={oIndex} className="opcion-group">
                              <input
                                type="radio"
                                id={`opcion-${preguntaId}-${oIndex}`}
                                name={`pregunta-${preguntaId}`}
                                value={oIndex}
                                checked={respuestas[preguntaId] === String(oIndex)}
                                onChange={() => handleChange(preguntaId, String(oIndex))}
                                required
                                className="opcion-input"
                              />
                              <label htmlFor={`opcion-${preguntaId}-${oIndex}`}>
                                {opcion}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          id={`pregunta-${preguntaId}`}
                          value={respuestas[preguntaId] || ''}
                          onChange={(e) => handleChange(preguntaId, e.target.value)}
                          className="respuesta-abierta"
                          required
                          placeholder="Escribe tu respuesta aquí"
                        />
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

            <button type="submit" className="btn-enviar" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Enviando...
                </>
              ) : (
                'Enviar Respuestas'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResponderEncuesta;
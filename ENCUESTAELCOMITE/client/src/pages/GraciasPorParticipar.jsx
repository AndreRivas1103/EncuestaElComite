import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import './styles/GraciasPorParticipar.css';

const GraciasPorParticipar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resultadosCalculados, setResultadosCalculados] = useState(null);
  
  // Obtener datos del state
  const { 
    contrasena, 
    nombreCompleto, 
    idEncuesta,
    correoVoluntario,
    respuestas
  } = location.state || {};

  // Función para calcular resultados (con validaciones robustas)
  const calcularResultados = (respuestas) => {
    // Palabras clave por categoría
    const palabrasClavePorCategoria = {
      "Liderazgo": ["iniciativa", "solucionar", "motivar", "proponer", "liderar"],
      "Trabajo En Equipo": ["colaborar", "equipo", "apoyar", "ayudar", "conjunto"],
      "Resiliencia": ["persistir", "adaptar", "superar", "resistir", "continuar"],
      "Obtencion de logros": ["lograr", "meta", "objetivo", "éxito", "conseguir"]
    };

    const resultadosPorCategoria = {};
    let totalPreguntas = 0;
    let totalCorrectas = 0;

    // Procesar cada respuesta con validaciones
    respuestas.forEach(item => {
      // Validar que el ítem tenga estructura mínima
      if (!item || typeof item !== 'object' || !item.categoria || !item.pregunta) {
        console.error('Ítem de respuesta inválido:', item);
        return; // Saltar este ítem
      }
      
      const categoria = item.categoria;
      
      // Inicializar categoría si no existe
      if (!resultadosPorCategoria[categoria]) {
        resultadosPorCategoria[categoria] = {
          preguntas: 0,
          correctas: 0,
          incorrectas: 0,
          puntaje: 0,
          detalles: []
        };
      }
      
      resultadosPorCategoria[categoria].preguntas++;
      totalPreguntas++;

      let esCorrecta = false;
      let razon = "";
      let respuestaCorrectaValor = "No disponible";

      // Evaluación diferente según tipo de pregunta
      if (item.tipoRespuesta === 'multiple') {
        // Validar y obtener índice de respuesta correcta
        const respuestaCorrectaIndex = (typeof item.respuestaCorrecta === 'number' && 
                                      !isNaN(item.respuestaCorrecta))
          ? item.respuestaCorrecta
          : -1; // Valor inválido
        
        // Validar opciones
        const opcionesValidas = Array.isArray(item.opciones) && item.opciones.length > 0;
        
        // Obtener valor de respuesta correcta si es posible
        respuestaCorrectaValor = (opcionesValidas && 
                                 respuestaCorrectaIndex >= 0 && 
                                 respuestaCorrectaIndex < item.opciones.length)
          ? item.opciones[respuestaCorrectaIndex]
          : "Respuesta correcta no disponible";
        
        // Determinar si la respuesta es correcta
        esCorrecta = item.respuesta === String(respuestaCorrectaIndex);
        razon = esCorrecta ? "Respuesta correcta" : "Respuesta incorrecta";
        
      } else {
        // Pregunta abierta - evaluación por palabras clave
        const palabrasClave = palabrasClavePorCategoria[categoria] || [];
        const respuestaUsuario = (item.respuesta || '').toLowerCase();
        
        // Contar palabras clave presentes
        const palabrasEncontradas = palabrasClave.filter(palabra => 
          respuestaUsuario.includes(palabra.toLowerCase())
        ).length;
        
        // Considerar correcta si al menos 2 palabras clave están presentes
        esCorrecta = palabrasEncontradas >= 2;
        razon = esCorrecta 
          ? `Contiene ${palabrasEncontradas} palabras clave de la categoría` 
          : `Solo contiene ${palabrasEncontradas} palabras clave (se requieren al menos 2)`;
      }

      // Actualizar contadores
      if (esCorrecta) {
        resultadosPorCategoria[categoria].correctas++;
        resultadosPorCategoria[categoria].puntaje++;
        totalCorrectas++;
      } else {
        resultadosPorCategoria[categoria].incorrectas++;
      }

      // Guardar detalles
      resultadosPorCategoria[categoria].detalles.push({
        pregunta: item.pregunta,
        respuestaUsuario: item.tipoRespuesta === 'multiple' 
          ? (item.opcionSeleccionada || "No seleccionada")
          : (item.respuesta || "Sin respuesta"),
        respuestaCorrecta: respuestaCorrectaValor,
        esCorrecta,
        razon
      });
    });

    // Calcular porcentajes y niveles si hay preguntas
    Object.keys(resultadosPorCategoria).forEach(categoria => {
      const cat = resultadosPorCategoria[categoria];
      if (cat.preguntas > 0) {
        cat.porcentaje = Math.round((cat.correctas / cat.preguntas) * 100);
        cat.nivel = cat.porcentaje >= 80 ? 'Alto' : 
                    cat.porcentaje >= 60 ? 'Medio' : 'Bajo';
      } else {
        cat.porcentaje = 0;
        cat.nivel = 'Sin datos';
      }
    });

    const porcentajeTotal = totalPreguntas > 0 
      ? Math.round((totalCorrectas / totalPreguntas) * 100)
      : 0;

    // Generar recomendaciones
    const recomendaciones = [];
    Object.entries(resultadosPorCategoria).forEach(([categoria, datos]) => {
      if (datos.porcentaje < 70) {
        recomendaciones.push(`Necesitas mejorar en ${categoria} (${datos.porcentaje}% de aciertos)`);
      }
    });

    if (recomendaciones.length === 0) {
      recomendaciones.push("¡Excelente desempeño en todas las áreas! Continúa así.");
    }

    // Devolver estructura de resultados completa
    return {
      resumen: {
        totalPreguntas,
        totalCorrectas,
        totalIncorrectas: totalPreguntas - totalCorrectas,
        porcentajeTotal,
        fecha: new Date().toISOString().split('T')[0] // Fecha actual
      },
      porCategoria: resultadosPorCategoria,
      recomendaciones,
      perfil: porcentajeTotal >= 80 ? 'Perfil Destacado' : 
              porcentajeTotal >= 60 ? 'Perfil Competente' : 'Perfil en Desarrollo',
      palabrasClaveUsadas: palabrasClavePorCategoria
    };
  };

  // Calcular y guardar resultados cuando el componente se monta
  useEffect(() => {
    const procesarYGuardarResultados = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Validar que tenemos todos los datos necesarios
        if (!idEncuesta || !correoVoluntario || !contrasena || !respuestas) {
          throw new Error('Faltan datos necesarios para calcular resultados');
        }

        console.log('[DEBUG] Iniciando cálculo de resultados...');
        
        // 1. Calcular resultados
        const resultadosCalculados = calcularResultados(respuestas);
        setResultadosCalculados(resultadosCalculados);
        
        console.log('[DEBUG] Resultados calculados:', resultadosCalculados);
        
        // 2. Guardar resultados en la base de datos
        await axios.post('http://localhost:3000/api/resultados', {
          id_encuesta: idEncuesta,
          correo_voluntario: correoVoluntario,
          contrasena: contrasena,
          resultado: resultadosCalculados
        });
        
        console.log('[SUCCESS] Resultados calculados y guardados exitosamente');
        
      } catch (error) {
        console.error('[ERROR] Al procesar resultados:', error);
        setError(error.message || 'Error al calcular resultados');
      } finally {
        setLoading(false);
      }
    };

    procesarYGuardarResultados();
  }, [idEncuesta, correoVoluntario, contrasena, respuestas]);

  // Función para probar con datos simulados
  const probarConDatosSimulados = () => {
    navigate('/gracias-por-participar', {
      state: {
        contrasena: 'and7892024',
        nombreCompleto: 'Andrea Pérez'
      }
    });
  };

  // Mostrar estado de carga mientras se procesa
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Calculando tus resultados...</p>
        <p>Esto puede tomar unos momentos</p>
      </div>
    );
  }

  return (
    <div className="gracias-container">
      <title>¡Gracias por Participar!</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </div>

      <div className="gracias-content">
        <div className="gracias-main">
          <div className="checkmark-animation">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          
          <h1 className="mensaje-principal">¡Gracias por participar!</h1>
          
          {nombreCompleto && (
            <p className="mensaje-nombre">
              <strong>{nombreCompleto}</strong>
            </p>
          )}
          
          <p className="mensaje-secundario">
            Tus respuestas han sido registradas exitosamente.
          </p>

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <p>Por favor contacta al administrador si el problema persiste</p>
            </div>
          )}

          {contrasena ? (
            <div className="contrasena-section">
              <h2 className="contrasena-titulo">Tu contraseña de acceso:</h2>
              <div className="contrasena-display">
                <span className="contrasena-texto">{contrasena}</span>
              </div>
              <p className="contrasena-instruccion">
                ⚠️ <strong>¡Importante!</strong> Guarda esta contraseña. La necesitarás para acceder a tus resultados.
              </p>
            </div>
          ) : (
            <div className="contrasena-section">
              <h2 className="contrasena-titulo">Información de acceso no disponible</h2>
              <p className="contrasena-instruccion">
                Si completaste la encuesta correctamente, deberías haber recibido tu contraseña. 
                Si tienes problemas, contacta al administrador.
              </p>
              <button 
                className="btn-inicio" 
                onClick={probarConDatosSimulados}
                style={{ marginTop: '15px', backgroundColor: '#6c757d' }}
              >
                🧪 Probar con datos simulados
              </button>
            </div>
          )}
          
          {/* Mostrar resumen de resultados si están disponibles */}
          <div className="botones-accion">
            <button 
              className="btn-inicio" 
              onClick={() => navigate('/')}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraciasPorParticipar;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import './styles/GraciasPorParticipar.css';

const GraciasPorParticiparPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resultadosCalculados, setResultadosCalculados] = useState(null);
  const hasGuardadoRef = useRef(false);

const { 
  correoVoluntario: correo,
  respuestas,
  idEncuesta
} = location.state || {};

  // Función para calcular resultados (similar a la versión pre-evento)
  const calcularResultados = (respuestas) => {
    const palabrasClavePorCategoria = {
      "Liderazgo": ["iniciativa", "solucionar", "motivar", "proponer", "liderar"],
      "Trabajo En Equipo": ["colaborar", "equipo", "apoyar", "ayudar", "conjunto"],
      "Resiliencia": ["persistir", "adaptar", "superar", "resistir", "continuar"],
      "Obtencion de logros": ["lograr", "meta", "objetivo", "éxito", "conseguir"]
    };

    const resultadosPorCategoria = {};
    let totalPreguntas = 0;
    let totalCorrectas = 0;

    respuestas.forEach(item => {
      if (!item || typeof item !== 'object' || !item.categoria || !item.pregunta) return;
      const categoria = item.categoria;
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

      if (item.tipoRespuesta === 'multiple') {
        // Validación mejorada para respuestas correctas
        const respuestaCorrectaIndex = (typeof item.respuestaCorrecta === 'number' && !isNaN(item.respuestaCorrecta)) 
          ? item.respuestaCorrecta 
          : -1;
        
        const opcionesValidas = Array.isArray(item.opciones) && item.opciones.length > 0;
        
        respuestaCorrectaValor = (opcionesValidas && respuestaCorrectaIndex >= 0 && respuestaCorrectaIndex < item.opciones.length)
          ? item.opciones[respuestaCorrectaIndex] 
          : "Respuesta correcta no disponible";

        esCorrecta = item.respuesta === String(respuestaCorrectaIndex);
        razon = esCorrecta ? "Respuesta correcta" : "Respuesta incorrecta";

      } else {
        const palabrasClave = palabrasClavePorCategoria[categoria] || [];
        const respuestaUsuario = (item.respuesta || '').toLowerCase();
        const palabrasEncontradas = palabrasClave.filter(palabra => 
          respuestaUsuario.includes(palabra.toLowerCase())
        ).length;
        
        esCorrecta = palabrasEncontradas >= 2;
        razon = esCorrecta 
          ? `Contiene ${palabrasEncontradas} palabras clave de la categoría` 
          : `Solo contiene ${palabrasEncontradas} palabras clave (se requieren al menos 2)`;
      }

      if (esCorrecta) {
        resultadosPorCategoria[categoria].correctas++;
        resultadosPorCategoria[categoria].puntaje++;
        totalCorrectas++;
      } else {
        resultadosPorCategoria[categoria].incorrectas++;
      }

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

    Object.keys(resultadosPorCategoria).forEach(categoria => {
      const cat = resultadosPorCategoria[categoria];
      if (cat.preguntas > 0) {
        cat.porcentaje = Math.round((cat.correctas / cat.preguntas) * 100);
        cat.nivel = cat.porcentaje >= 80 ? 'Alto' : cat.porcentaje >= 60 ? 'Medio' : 'Bajo';
      } else {
        cat.porcentaje = 0;
        cat.nivel = 'Sin datos';
      }
    });

    const porcentajeTotal = totalPreguntas > 0 ? Math.round((totalCorrectas / totalPreguntas) * 100) : 0;
    const recomendaciones = [];
    Object.entries(resultadosPorCategoria).forEach(([categoria, datos]) => {
      if (datos.porcentaje < 70) {
        recomendaciones.push(`Necesitas mejorar en ${categoria} (${datos.porcentaje}% de aciertos)`);
      }
    });

    if (recomendaciones.length === 0) {
      recomendaciones.push("¡Excelente desempeño en todas las áreas! Continúa así.");
    }

    return {
      resumen: {
        totalPreguntas,
        totalCorrectas,
        totalIncorrectas: totalPreguntas - totalCorrectas,
        porcentajeTotal,
        fecha: new Date().toISOString().split('T')[0]
      },
      porCategoria: resultadosPorCategoria,
      recomendaciones,
      perfil: porcentajeTotal >= 80 ? 'Perfil Destacado' : porcentajeTotal >= 60 ? 'Perfil Competente' : 'Perfil en Desarrollo',
      palabrasClaveUsadas: palabrasClavePorCategoria
    };
  };

  useEffect(() => {
    const guardarYCalcularResultados = async () => {
      if (hasGuardadoRef.current) return;
      hasGuardadoRef.current = true;

      try {
        setLoading(true);
        setError('');

        // Validar que tenemos los datos necesarios
        if (!correo || !respuestas) {
          throw new Error('Faltan datos necesarios para guardar la encuesta');
        }

        // Validar formato de respuestas
        if (typeof respuestas !== 'object' || !Array.isArray(respuestas)) {
          throw new Error('Formato de respuestas inválido');
        }

        // 1. Guardar la encuesta post-evento
        await axios.post('http://localhost:3000/api/voluntarios/actualizar-post-evento', {
          correo,
          encuesta_post: respuestas
        });

        // 2. Calcular resultados
        const resultadosCalculados = calcularResultados(respuestas);
        setResultadosCalculados(resultadosCalculados);

        // 3. Guardar los resultados en la base de datos
        await axios.post('http://localhost:3000/api/resultados', {
          id_encuesta: idEncuesta,
          correo_voluntario: correo,
          contrasena: 'post-evento',
          resultado: resultadosCalculados,
          tipo: 'post'
        });

      } catch (error) {
        console.error('[ERROR] Al guardar encuesta y resultados:', error);
        setError(error.message || 'Error al procesar los datos');
      } finally {
        setLoading(false);
      }
    };

    guardarYCalcularResultados();
  }, [correo, respuestas, idEncuesta]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Guardando tus respuestas y calculando resultados...</p>
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
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>

          <h1 className="mensaje-principal">¡Gracias por completar el post-evento!</h1>
          
          <p className="mensaje-secundario">
            Tus respuestas y resultados han sido registrados exitosamente.
          </p>

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <p>Por favor contacta al administrador si el problema persiste</p>
            </div>
          )}

          {/* Mostrar resumen de resultados si están disponibles */}
          {resultadosCalculados && (
            <div className="resultados-section">
              <h2 className="resultados-titulo">Resultados Post-Evento</h2>
              
              <div className="resumen-total">
                <h3>Resumen General</h3>
                <p>Total preguntas: {resultadosCalculados.resumen.totalPreguntas}</p>
                <p>Respuestas correctas: {resultadosCalculados.resumen.totalCorrectas}</p>
                <p>Porcentaje total: {resultadosCalculados.resumen.porcentajeTotal}%</p>
                <p>Perfil: {resultadosCalculados.perfil}</p>
              </div>
              
              <div className="por-categoria">
                <h3>Resultados por Categoría</h3>
                {Object.entries(resultadosCalculados.porCategoria).map(([categoria, datos]) => (
                  <div key={categoria} className="categoria-item">
                    <h4>{categoria}</h4>
                    <p>Preguntas: {datos.preguntas}</p>
                    <p>Correctas: {datos.correctas}</p>
                    <p>Porcentaje: {datos.porcentaje}%</p>
                    <p>Nivel: {datos.nivel}</p>
                  </div>
                ))}
              </div>
              
              <div className="recomendaciones">
                <h3>Recomendaciones</h3>
                <ul>
                  {resultadosCalculados.recomendaciones.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

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

export default GraciasPorParticiparPost;
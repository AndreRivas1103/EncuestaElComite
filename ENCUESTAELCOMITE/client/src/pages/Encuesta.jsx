import React, { useState } from 'react';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const EncuestaCompleta = () => {
  const [respuestas, setRespuestas] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const categorias = [
    {
      nombre: "Liderazgo",
      preguntas: [
        {
          id: "l1",
          texto: "1. Cuando surge un problema durante una actividad, ¿qué harías?",
          opciones: [
            "a) Esperar a que alguien más lo resuelva",
            "b) Tomar la iniciativa y proponer una solución",
            "c) Ignorarlo y seguir con tus tareas"
          ]
        },
        {
          id: "l2",
          texto: "2. Si un compañero no sabe cómo realizar una tarea, ¿cómo actuarías?",
          opciones: [
            "a) Explicarle pacientemente y guiarlo",
            "b) Hacerlo tú mismo para terminar rápido",
            "c) Decirle que pregunte a otro"
          ]
        },
        {
          id: "l3",
          texto: "3. ¿Qué es lo más importante para motivar a un equipo?",
          opciones: [
            "a) Criticar los errores para mejorar",
            "b) Reconocer el esfuerzo y celebrar los logros",
            "c) Dejar que cada uno trabaje solo"
          ]
        },
        {
          id: "l4",
          texto: "4. Si el grupo está desorganizado, ¿qué harías?",
          opciones: [
            "a) Sugerir una reunión para asignar roles claros",
            "b) Quejarte, pero no hacer nada",
            "c) Abandonar la actividad"
          ]
        }
      ]
    },
    {
      nombre: "Trabajo en Equipo",
      preguntas: [
        {
          id: "t1",
          texto: "1. Si un compañero tiene una idea diferente a la tuya, ¿qué haces?",
          opciones: [
            "a) Ignorar su opinión",
            "b) Insistir en que tu idea es la mejor",
            "c) Escucharla y buscar un punto en común"
          ]
        },
        {
          id: "t2",
          texto: "2. ¿Qué haces si un miembro del equipo no colabora?",
          opciones: [
            "a) Hablar con él para entender por qué y ofrecer ayuda",
            "b) Quejarte con los demás",
            "c) Hacer su trabajo por él"
          ]
        },
        {
          id: "t3",
          texto: "3. Dos compañeros discuten por diferencias de opinión, ¿qué harías?",
          opciones: [
            "a) Mediar para que escuchen sus puntos de vista y encuentren una solución",
            "b) Tomar partido por uno de ellos para terminar rápido",
            "c) Evitar involucrarte y dejar que lo resuelvan solos"
          ]
        },
        {
          id: "t4",
          texto: "4. Si un voluntario se molesta por una crítica constructiva, ¿cómo actuarías?",
          opciones: [
            "a) Ignorar su reacción para no empeorar las cosas",
            "b) Explicarle el objetivo de la retroalimentación con empatía",
            "c) Dejar de darle opiniones en el futuro"
          ]
        }
      ]
    },
    {
      nombre: "Obtención de logros",
      preguntas: [
        {
          id: "o1",
          texto: "1. Si una tarea es difícil, ¿cómo reaccionas?",
          opciones: [
            "a) La divides en pasos pequeños y buscas ayuda si es necesario",
            "b) La dejas para después",
            "c) Renuncias"
          ]
        },
        {
          id: "o2",
          texto: "2. ¿Qué haces al cumplir un objetivo?",
          opciones: [
            "a) Reflexionar sobre lo aprendido y celebrar",
            "b) Pasar rápidamente a la siguiente tarea",
            "c) No lo notas"
          ]
        },
        {
          id: "o3",
          texto: "3. Cuando una tarea se complica más de lo esperado, ¿qué sueles hacer?",
          opciones: [
            "a) Abandonarla y pasar a otra cosa",
            "b) Pedir a alguien más que la complete por ti",
            "c) Analizar qué falló, ajustar el enfoque y seguir intentándolo"
          ]
        },
        {
          id: "o4",
          texto: "4. Si un proyecto requiere múltiples intentos antes de ver resultados, ¿cómo te sientes?",
          opciones: [
            "a) Motivado por el desafío y el aprendizaje que conlleva",
            "b) Frustrado por el tiempo que toma",
            "c) Indiferente, mientras alguien más se haga cargo"
          ]
        }
      ]
    },
    {
      nombre: "Resiliencia",
      preguntas: [
        {
          id: "r1",
          texto: "1. Si un proyecto falla, ¿qué harías?",
          opciones: [
            "a) Analizar qué salió mal y aprender para mejorar",
            "b) Culpar a otros",
            "c) Evitar proyectos similares en el futuro"
          ]
        },
        {
          id: "r2",
          texto: "2. ¿Cómo manejas el estrés en situaciones difíciles?",
          opciones: [
            "a) Desquitarte con los demás",
            "b) Respirar profundo y buscar soluciones",
            "c) Aislarte"
          ]
        },
        {
          id: "r3",
          texto: "3. Cuando cambian repentinamente los planes de una actividad, ¿cómo reaccionas?",
          opciones: [
            "a) Espero a que otros decidan qué hacer",
            "b) Me frustro porque ya tenía todo organizado",
            "c) Me ajusto rápido y busco cómo contribuir en la nueva situación"
          ]
        },
        {
          id: "r4",
          texto: "4. Te asignan un rol diferente al que esperabas, ¿qué haces?",
          opciones: [
            "a) Lo acepto como oportunidad para aprender algo nuevo",
            "b) Cumplo, pero sin mucho entusiasmo",
            "c) Pido que me cambien a lo que yo quería"
          ]
        }
      ]
    }
  ];

  // Aplanar todas las preguntas en un solo array para navegación
  const todasLasPreguntas = categorias.flatMap(categoria => 
    categoria.preguntas.map(pregunta => ({
      ...pregunta,
      categoria: categoria.nombre
    }))
  );

  const handleCambioRespuesta = (preguntaId, valor) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: valor
    });
  };

  const handleSiguiente = () => {
    if (preguntaActual < todasLasPreguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      setMostrarResultados(true);
    }
  };

  const handleAnterior = () => {
    setPreguntaActual(preguntaActual - 1);
  };

  const calcularResultados = () => {
    // Aquí iría la lógica para calcular los resultados basados en las respuestas
    return {
      liderazgo: 8,
      trabajoEquipo: 7,
      logros: 6,
      resiliencia: 9
    };
  };

  if (mostrarResultados) {
    const resultados = calcularResultados();
    return (
      <div className="resultados-container">
        <h1>Resultados de tu Encuesta</h1>
        <div className="resultado-categoria">
          <h2>Liderazgo: {resultados.liderazgo}/10</h2>
          <div className="barra-progreso">
            <div style={{ width: `${resultados.liderazgo * 10}%` }}></div>
          </div>
        </div>
        {/* Repetir para otras categorías */}
        <button className="boton-volver">Volver al Inicio</button>
      </div>
    );
  }

  const pregunta = todasLasPreguntas[preguntaActual];
  const categoriaActual = categorias.find(c => c.nombre === pregunta.categoria);

  return (
    <div>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>

      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      <div className='firtsColor'>
        <div className="encuesta-container">
          <h1 className='Texto'>Encuesta de Evaluación</h1>
          
          <div className="categoria-actual">
            <h2>{pregunta.categoria}</h2>
            <div className="progreso">
              Pregunta {preguntaActual + 1} de {todasLasPreguntas.length}
            </div>
          </div>

          <div className="pregunta-actual">
            <h3>{pregunta.texto}</h3>
            
            <div className="opciones-respuesta">
              {pregunta.opciones.map((opcion, index) => (
                <label key={index} className="opcion">
                  <input
                    type="radio"
                    name={pregunta.id}
                    value={opcion}
                    checked={respuestas[pregunta.id] === opcion}
                    onChange={() => handleCambioRespuesta(pregunta.id, opcion)}
                  />
                  <span className="checkmark"></span>
                  {opcion}
                </label>
              ))}
            </div>
          </div>

          <div className="controles-navegacion">
            {preguntaActual > 0 && (
              <button onClick={handleAnterior} className="boton-anterior">
                Anterior
              </button>
            )}
            
            <button 
              onClick={handleSiguiente} 
              className="boton-siguiente"
              disabled={!respuestas[pregunta.id]}
            >
              {preguntaActual === todasLasPreguntas.length - 1 ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncuestaCompleta;
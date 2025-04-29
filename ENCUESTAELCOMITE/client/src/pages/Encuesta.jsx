import React, { useState } from 'react';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const EncuestaCompleta = () => {
  const [respuestas, setRespuestas] = useState({});
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

  const handleCambioRespuesta = (preguntaId, valor) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: valor
    });
  };

  const calcularResultados = () => {
    // Lógica simplificada para calcular resultados
    // En una implementación real, esto debería analizar las respuestas
    return {
      liderazgo: 8,
      trabajoEquipo: 7,
      logros: 6,
      resiliencia: 9
    };
  };

  const todasLasPreguntasRespondidas = () => {
    return categorias.every(categoria => 
      categoria.preguntas.every(pregunta => respuestas[pregunta.id])
    );
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
        <div className="resultado-categoria">
          <h2>Trabajo en Equipo: {resultados.trabajoEquipo}/10</h2>
          <div className="barra-progreso">
            <div style={{ width: `${resultados.trabajoEquipo * 10}%` }}></div>
          </div>
        </div>
        <div className="resultado-categoria">
          <h2>Obtención de Logros: {resultados.logros}/10</h2>
          <div className="barra-progreso">
            <div style={{ width: `${resultados.logros * 10}%` }}></div>
          </div>
        </div>
        <div className="resultado-categoria">
          <h2>Resiliencia: {resultados.resiliencia}/10</h2>
          <div className="barra-progreso">
            <div style={{ width: `${resultados.resiliencia * 10}%` }}></div>
          </div>
        </div>
        <button className="boton-volver">Volver al Inicio</button>
      </div>
    );
  }

  return (
    <div>
      <title>Encuesta</title>
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
          
          {categorias.map((categoria, index) => (
            <div key={index} className="categoria-seccion">
              <h2 className="titulo-categoria">{categoria.nombre}</h2>
              
              {categoria.preguntas.map((pregunta, pIndex) => (
                <div key={pregunta.id} className="pregunta-item">
                  <h3 className="texto-pregunta">{pregunta.texto}</h3>
                  
                  <div className="opciones-respuesta">
                    {pregunta.opciones.map((opcion, oIndex) => (
                      <label key={oIndex} className="opcion">
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
              ))}
            </div>
          ))}

          
        </div>
      </div>

      <style jsx>{`
        .encuesta-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 80px;
          background-color: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        
        .Texto {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
        }
        
        .categoria-seccion {
          margin-bottom: 30px;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .titulo-categoria {
          color: #2c3e50;
          border-bottom: 2px solid #9ecd49;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        
        .pregunta-item {
          margin-bottom: 25px;
        }
        
        .texto-pregunta {
          color: #34495e;
          margin-bottom: 15px;
        }
        
        .opciones-respuesta {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .opcion {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 10px;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        
        .opcion:hover {
          background-color: #f0f0f0;
        }
        
        .opcion input {
          margin-right: 10px;
        }
        
        .checkmark {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #3498db;
          border-radius: 50%;
          margin-right: 10px;
          position: relative;
        }
        
        .opcion input:checked + .checkmark:after {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: #3498db;
          border-radius: 50%;
          top: 2px;
          left: 2px;
        }
        
        .controles-navegacion {
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }
        
        .boton-finalizar {
          padding: 12px 25px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .boton-finalizar:hover {
          background-color: #2980b9;
        }
        
        .boton-finalizar:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        .resultados-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .resultado-categoria {
          margin-bottom: 20px;
        }
        
        .barra-progreso {
          height: 20px;
          background-color: #ecf0f1;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 10px;
        }
        
        .barra-progreso div {
          height: 100%;
          background-color: #3498db;
          transition: width 0.5s;
        }
        
        .boton-volver {
          padding: 12px 25px;
          background-color: #2ecc71;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
          transition: background-color 0.3s;
        }
        
        .boton-volver:hover {
          background-color: #27ae60;
        }
      `}</style>
    </div>
  );
};

export default EncuestaCompleta;
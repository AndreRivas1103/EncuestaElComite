import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../Pages/styles/Home.css'; 
import { Link } from 'react-router-dom';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const root = ReactDOM.createRoot(document.getElementById('root'));

const CrearPregunta = () => {
  const [preguntas, setPreguntas] = useState([{ 
    texto: '', 
    tipoRespuesta: 'multiple', 
    opciones: ['', '', '', ''] 
  }]);

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
          <a href='#'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt='Baby go Logo' className='header-logo' />
      </header>

      <div className='firtsColor'>
        <div>
          <h1 className='title-crear-encuesta'>Crear preguntas</h1>
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
}

root.render(<CrearPregunta />);
export default CrearPregunta;
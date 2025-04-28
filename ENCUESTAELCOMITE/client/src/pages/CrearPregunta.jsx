import React from 'react';
import ReactDOM from 'react-dom/client';
import '../Pages/styles/Home.css'; 
import { Link } from 'react-router-dom';
import babyLogo from '../assets/LogoMarcaPersonal.png';


const root = ReactDOM.createRoot(document.getElementById('root'));

const CrearPregunta = () => {
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
        <div className="botones-izquierda">
          <button className="btn-pequeno">Regresar</button>
          <button className="btn-pequeno">Inicio</button>
          <button className="btn-pequeno">Salir</button>
        </div>

        <div>
          <h1 className='title-crear-encuesta'>Crear preguntas</h1>
        </div>

        <div>
          <h1 className='texto2'>Escribe tu pregunta aquí:</h1>
          <input type="text" className='campo-pregunta' />
        </div>

        <div>
          <br />
          <h1 className='texto3'>Tipo de respuesta</h1>
          <div className="opciones-container">
            <div className="opcion-group">
              <label className='contenedor-radio'>
                <input type="radio" name="tipo-respuesta" className="radio-original" />
                <span className="radio-visual"></span>
                <span className="radio-texto">Respuesta de opción múltiple</span>
              </label>
              
              <br />
              <div className="opciones-abcd">
                <div className="opcion-item">
                  <span className="opcion-letra">A </span>
                  <input type="text" className="campo-opcion" placeholder="Escribe la opción A" />
                </div>
                <div className="opcion-item">
                  <span className="opcion-letra">B </span>
                  <input type="text" className="campo-opcion" placeholder="Escribe la opción B" />
                </div>
                <div className="opcion-item">
                  <span className="opcion-letra">C </span>
                  <input type="text" className="campo-opcion" placeholder="Escribe la opción C" />
                </div>
                <div className="opcion-item">
                  <span className="opcion-letra">D </span>
                  <input type="text" className="campo-opcion" placeholder="Escribe la opción D" />
                </div>
              </div>
            </div>
            
            <div>
              <label className='contenedor-radio'>
                <input type="radio" name="tipo-respuesta" className="radio-original" />
                <span className="radio-visual"></span>
                <span className="radio-texto">Respuesta abierta</span>
              </label>
              <input type="text" className='campo-respuesta' />
            </div>
            
            <div className='botones-abajo'>
              <button className='btn-pequeno'>Agregar otra pregunta</button>
              <Link to="/calendario" className='btn-pequeno'>Guardar pregunta</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

root.render(<CrearPregunta />);
export default CrearPregunta;
import React from 'react';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link } from 'react-router-dom';

const CrearEncuesta = () => {
  return (
    <div>
        <title>Crear Encuesta</title>
      <meta name='viewport' content='width = device-width, initial-scale=1.0'></meta>

      <header className="header">
        <div className="logo">
          <a href='#'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      
      <div className='firtsColor'>
        <div>
          <h1 className='title-crear-encuesta'>Crear Encuesta</h1>
          <br></br>
        </div>

        <div className='contenedor-botones'>
          <Link to="/crear-pregunta" className="btn">Liderazgo</Link>
          <button className="btn">Obtención de logros</button>
        </div>
        <div className='contenedor-botones'>
          <Link to="/seleccionar-encuesta" className="btn">Resiliencia</Link>
          <button className="btn">Trabajo en equipo</button>
        </div>
      </div>
    </div>
  )
}

export default CrearEncuesta;
import React from 'react';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link } from 'react-router-dom';

const NuevoEvento = () => {
  return (
    <div>
        <title>Nuevo Evento</title>
      <meta name='viewport' content='width = device-width, initial-scale=1.0'></meta>

      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      
      <div className='firtsColor'>
        <div>
          <h1 className='title-nuevo-evento'>Nuevo Evento</h1>
          <br></br>
        </div>

        <div className='contenedor-botones'>
          <Link to="/seleccionar-encuesta" className="btn btn-center">Usar Encuestas Anteriores</Link>
          <Link to="/Tipo-e" className="btn">Crear Encuesta</Link>
        </div>
      </div>
    </div>
  )
}

export default NuevoEvento;
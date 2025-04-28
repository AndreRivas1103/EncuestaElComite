import React from 'react';
import '../Pages/styles/Home.css';
import { Link } from 'react-router-dom';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const prueba1 = () => {
  return (
    <div>
      <meta name='viewport' content='width = device-width, initial-scale=1.0'></meta>

      <header className="header">
        <div className="logo">
          <a href='#'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      
      <div className='firtsColor'>
        <div>
          <h1 className='title-coordinador'>Bienvenido Coordinador</h1>
          <br></br>
        </div>

        <div className='contenedor-botones'>
          <Link to="/registro-encuestas" className="btn">Registro de encuestas</Link>
          <Link to="/nuevo-evento" className="btn">Nuevo evento</Link>
        </div>
      </div>
    </div>
  )
}

export default prueba1;
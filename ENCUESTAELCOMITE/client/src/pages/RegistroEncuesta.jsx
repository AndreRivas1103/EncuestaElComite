import React from 'react';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/logogdc.jpg';
import { Link } from 'react-router-dom';



const pagina1 = () => {
  return (
    <div>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      
      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      <div className='firtsColor'>


        <div>
          <h1 className='Texto'>Registro de encuesta</h1>
          <br />
        </div>

        <div className="contenedor-botones">
          <Link to="/info-encuesta" className="boton">Encuesta 001</Link>
          <button className="boton">Encuesta 002</button>
          <button className="boton">Encuesta 003</button>
        </div>

        <br />
        <br />
        <br />

        <div className='contenedor-botones'>
          <button className="boton">Encuesta 004</button>
          <button className="boton">Encuesta 005</button>
          <button className="boton">Encuesta 006</button>
        </div>
      </div>
    </div>
  );
}

export default pagina1;
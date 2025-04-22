import React from 'react';
import '../pages/styles/RegistroEncuesta.css';
import babylogo from '../assets/gobabygo.png';



const pagina1 = () => {
  return (
    <div>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      
      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babylogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      <div className='firtsColor'>
        <div className="botones-izquierda">
          <button className="btn-pequeno">Regresar</button>
          
          {/* Spacer - consider using CSS margin instead */}
          {[...Array(10)].map((_, i) => <br key={i} />)}
          
          <button className="btn-pequeno">Inicio</button>
          <br />
          <button className="btn-pequeno">Salir</button>
        </div>

        <div>
          <h1 className='Texto'>Registro de encuesta</h1>
          <br />
        </div>

        <div className="contenedor-botones">
          <button className="boton">Encuesta 001</button>
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
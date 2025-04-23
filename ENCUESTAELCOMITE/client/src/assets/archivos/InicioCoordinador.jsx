import React from 'react';
import '../pages/styles/InicioCoordinador.css';
import babylogo from '../assets/gobabygo.png';
import Sidebar from '../components/Sidebar'; // Asegúrate de tener esta ruta correcta

const InicioCoordinador = () => {
  return (
    <div className="app-container">
      {/* Sidebar izquierda */}
      <Sidebar />

      {/* Contenido principal (tu diseño actual) */}
      <main className="main-content">
        <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>

        <header className="header">
          <div className="logo">
            <a href='#'>El Comit<span>é</span></a>
          </div>
          <img src={babylogo} alt="Baby Go Logo" className="header-logo" />
        </header>

        <div className='firtsColor'>


          <div>
          <h1 className='title-coordinador'>Bienvenido Coordinador</h1>
            <br></br>
          </div>

          <div className='contenedor-botones'>
            <button className="boton">Registro de encuestas</button>
            <button className="boton">Nuevo evento</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InicioCoordinador;
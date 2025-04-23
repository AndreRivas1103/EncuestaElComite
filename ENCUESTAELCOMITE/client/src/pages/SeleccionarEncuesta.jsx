import React from 'react';
import babyLogo from '../assets/gobabygo.png';
import '../pages/styles/SeleccionarEncuesta.css'; // Archivo CSS específico para este componente

const InicioCoordinador = () => {
  return (
    <div className="inicio-coordinador-container">
    <link href="https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Recoleta&display=swap" rel="stylesheet" />
      {/* Meta viewport para responsive design */}
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      
      {/* Barra de navegación */}
      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      
      {/* Contenido principal */}
      <main className="main-content-coordinador">
        {/* Botones laterales */}

        
        {/* Título principal */}
        <h1 className="titulo-principal">Seleccionar Encuesta</h1>
        
        {/* Botones de encuestas */}
        <div className="encuestas-container">
          <div className="fila-encuestas">
            <button className="btn-encuesta">Encuesta 001</button>
            <button className="btn-encuesta">Encuesta 002</button>
            <button className="btn-encuesta">Encuesta 003</button>
          </div>
          <div className="fila-encuestas">
            <button className="btn-encuesta">Encuesta 004</button>
            <button className="btn-encuesta">Encuesta 005</button>
            <button className="btn-encuesta">Encuesta 006</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InicioCoordinador;
import React from 'react';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/logogdc.jpg';
import { Link } from 'react-router-dom';


const IniciarSesion = () => {
  return (
    <div className="login-container">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Recoleta&display=swap" rel="stylesheet" />
      
      {/* Header con logo y título */}
      <header className="header">
        <div className="logo">
          <a href='/iniciar-sesion'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      <h1>Contacto</h1>
      <h1>Telefono</h1>
      <h1>Correo Electronico: </h1>
    </div>
  );
};

export default IniciarSesion;
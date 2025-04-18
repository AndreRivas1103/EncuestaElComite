import React from 'react';
import './IniciarSesion.css';
import babyLogo from '../assets/gobabygo.png';

const IniciarSesion = () => {
  return (
    <div className="login-container">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Recoleta&display=swap" rel="stylesheet" />
      
      {/* Header con logo y título */}
      <header className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      
      {/* Contenedor del formulario */}
      <main className="login-box">
        <h2 className="login-subtitle">Bienvenido</h2>
        <form className="login-form">
          <input 
            type="email" 
            className="login-input" 
            placeholder="Ingrese correo electrónico" 
            required
          />
          <button type="submit" className="login-btn">Iniciar Sesión</button>
          <a href="#" className="forgot-link">¿No recuerdas tu correo?</a>
        </form>
      </main>
    </div>
  );
};

export default IniciarSesion;
import React from 'react';
import './IniciarSesion.css';
import babyLogo from '../assets/gobabygo.png';

const IniciarSesion = () => {
  return (
    <div className="login-container">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <link href="https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet"></link>
      
      {/* Rectángulo azul grande (header) */}
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>
      {/* Recuadro azul pequeño (contenido) */}
      <div className="login-box">
        <h2 className="login-subtitle">Bienvenido</h2>
        <form className="login-form">
          <input type="email" className="login-input" placeholder="Ingrese correo electrónico"/>
          <button type="submit" className="login-btn">Iniciar Sesión</button>
          <a href="#" className="forgot-link">¿No recuerdas tu correo?</a>
        </form>
      </div>
    </div>
  );
};

export default IniciarSesion;
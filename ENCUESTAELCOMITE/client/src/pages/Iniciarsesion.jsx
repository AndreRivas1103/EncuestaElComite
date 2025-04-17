import React from 'react';
import './IniciarSesion.css';

const IniciarSesion = () => {
  return (
    <div className="login-container">
      {/* Rectángulo azul grande (header) */}
      <div className="blue-header">
        <h1 className="login-title">El Comité</h1>
      </div>

      {/* Recuadro azul pequeño (contenido) */}
      <div className="login-box">
        <h2 className="login-subtitle">Bienvenido</h2>
        
        <form className="login-form">
          <input 
            type="email" 
            className="login-input"
            placeholder="Ingrese correo electrónico"
          />
          
          <button type="submit" className="login-btn">
            Iniciar Sesión
          </button>

          <a href="#" className="forgot-link">
            ¿No recuerdas tu correo?
          </a>
        </form>
      </div>
    </div>
  );
};

export default IniciarSesion;
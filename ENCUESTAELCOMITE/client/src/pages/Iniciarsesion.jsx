import React, { useState } from 'react';
import '../pages/styles/IniciarSesion.css';
import babyLogo from '../assets/gobabygo.png';
import { useNavigate } from 'react-router-dom';

const IniciarSesion = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica del email
    if (!email) {
      setError('Por favor ingrese su correo electrónico');
      return;
    }
    
    if (!email.includes('@elcomite.org.co')) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }
    
    // Si pasa la validación, navegar a la página de coordinador
    navigate('/inicio-coordinador');
  };

  return (
    <div className="login-container">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Recoleta&display=swap" rel="stylesheet" />
      
      {/* Header con logo y título */}
      <header className="header">
        <div className="logo">
          <a href='/'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      
      {/* Contenedor del formulario */}
      <main className="login-box">
        <h2 className="login-subtitle">Bienvenido</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
             
            className="login-input" 
            placeholder="Ingrese correo electrónico" 
            
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(''); // Limpiar error cuando el usuario escribe
            }}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">Iniciar Sesión</button>
          <a href="/contacto" className="forgot-link">¿No recuerdas tu correo?</a>
        </form>
      </main>
    </div>
  );
};

export default IniciarSesion;
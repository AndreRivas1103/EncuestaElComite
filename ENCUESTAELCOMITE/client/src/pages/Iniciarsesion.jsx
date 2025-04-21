import React, { useState } from 'react';
import '../pages/styles/IniciarSesion.css';
import babyLogo from '../assets/gobabygo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const IniciarSesion = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación mejorada del email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }

    setIsLoading(true);

    try {
      // Llamada al backend con axios (mejor manejo de errores)
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        correo: email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Si la respuesta es exitosa (código 2xx)
      if (response.data.success) {
        // Guarda datos en localStorage si es necesario
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', response.data.nombre);
        
        // Redirige a la página de coordinador
        navigate('/inicio-coordinador');
      } else {
        throw new Error(response.data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      // Manejo detallado de errores
      if (err.response) {
        // Error de respuesta del servidor (4xx/5xx)
        setError(err.response.data.error || 'Error en la autenticación');
      } else if (err.request) {
        // No se recibió respuesta
        setError('El servidor no respondió. Intente más tarde');
      } else {
        // Error en la configuración de la solicitud
        setError('Error al configurar la solicitud');
      }
      console.error('Error en login:', err);
    } finally {
      setIsLoading(false);
    }
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
            type="email"
            className="login-input" 
            placeholder="Ingrese correo electrónico"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.trim());
              setError('');
            }}
            disabled={isLoading}
          />
          
          {error && <p className="error-message">{error}</p>}
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
          
          <a href="/contacto" className="forgot-link">
            ¿No recuerdas tu correo?
          </a>
        </form>
        <Link to="/inicio-coordinador" className="btn">Boton Prueba InicioCoordinador</Link>
        <Link to="/registro-encuestas" className="btn">Boton Prueba2 Registro Encuesta</Link>
        <Link to="/seleccionar-encuesta" className="btn">Boton Prueba3 Seleccionar Encuesta</Link>
        <Link to="/info-encuesta" className="btn">Boton Prueba4 Info de la Encuesta</Link>
      </main>
    </div>
  );
};

export default IniciarSesion;
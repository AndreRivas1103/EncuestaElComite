import React, { useState } from 'react';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png'; 
import babyLogoICO from '../assets/LogoMarcaPersonal.ico'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const IniciarSesion = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        correo: email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', response.data.nombre);
        localStorage.setItem('userCedula', response.data.cedula);
        navigate('/inicio-coordinador');
      } else {
        throw new Error(response.data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Error en la autenticación');
      } else if (err.request) {
        setError('El servidor no respondió. Intente más tarde');
      } else {
        setError('Error al configurar la solicitud');
      }
      console.error('Error en login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <link rel="icon" href={babyLogoICO}/>
      <title>Iniciar Sesión</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Recoleta&display=swap" rel="stylesheet" />
      
      <header className="header">
        <div className="logo">
          <a href='/' className="logo">El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      
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

          {/* Botón de Regreso */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              onClick={() => navigate('/')} 
              className="login-btn" 
              style={{ backgroundColor: '#7f8c8d' }}
            >
              Regresar
            </button>
          </div>

          {/* Enlace de ayuda */}
          <a href="/contacto" className="forgot-link">
            ¿No recuerdas tu correo?
          </a>
        </form>
      </main>
    </div>
  );
};

export default IniciarSesion;

import React, { useState } from 'react';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import babyLogoICO from '../assets/LogoMarcaPersonal.ico';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from '../lib/toast.js';

const IniciarSesion = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const msg = 'Por favor ingrese un correo electrónico válido';
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        correo: email,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', response.data.nombre);
        localStorage.setItem('userCedula', response.data.cedula);
        toast.success(`Bienvenido, ${response.data.nombre}`);
        navigate('/inicio-coordinador');
      } else {
        throw new Error(response.data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      let msg = 'Error al configurar la solicitud';
      if (err.response) {
        msg = err.response.data.error || 'Error en la autenticación';
      } else if (err.request) {
        msg = 'El servidor no respondió. Verifica que el backend esté en marcha.';
      }
      setError(msg);
      toast.error(msg);
      console.error('Error en login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <link rel="icon" href={babyLogoICO} />
      <title>Iniciar Sesión</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <header className="header">
        <div className="logo">
          <a href="/" className="logo">El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      <main className="login-page__main">
        <div className="login-card">
          <h2 className="login-subtitle">Bienvenido</h2>
          <p className="login-card__hint">
            Ingresa el correo con el que te registraste como coordinador.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-label" htmlFor="login-email">
              Correo electrónico
            </label>
            <input
              id="login-email"
              type="email"
              className="login-input"
              placeholder="coord.local@ejemplo.dev"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.trim());
                setError('');
              }}
              disabled={isLoading}
              autoComplete="email"
            />

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Iniciar sesión'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="login-btn login-btn--secondary"
              disabled={isLoading}
            >
              Regresar
            </button>

            <a href="/contacto" className="forgot-link">
              ¿No recuerdas tu correo?
            </a>
          </form>
        </div>
      </main>
    </div>
  );
};

export default IniciarSesion;

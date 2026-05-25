import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const ConfirmarCierre = () => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCedula');
    navigate('/');
  };

  return (
    <div className="app-page-stack">
      <title>Cerrar Sesión</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <header className="header">
        <div className="logo">
          <a href="/iniciar-sesion" className="logo">El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      <div className="app-page-stack__body">
        <div className="page-card page-card--center confirm-logout-card">
          <h1 className="title-medium">¿Estás seguro de que deseas cerrar sesión?</h1>

          <div
            className="contenedor-botones"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginTop: '0.5rem',
            }}
          >
            <button type="button" onClick={cerrarSesion} className="btn">
              Sí, salir
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn"
              style={{ backgroundColor: '#5a6c7d' }}
            >
              No, volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarCierre;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import './styles/GraciasPorParticipar.css';

const GraciasPorParticipar = () => {
  const navigate = useNavigate();

  return (
    <div className="gracias-container">
      <title>¡Gracias por Participar!</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </div>

      <div className="gracias-content">
        <div className="gracias-main">
          <div className="checkmark-animation">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          
          <h1 className="mensaje-principal">¡Gracias por participar!</h1>
          
          <p className="mensaje-secundario">
            Tus respuestas han sido registradas exitosamente.
          </p>
          
          <p className="mensaje-info">
            Tu participación es muy valiosa para nosotros y contribuye 
            al mejoramiento continuo de nuestros eventos.
          </p>

          <div className="botones-accion">
            <button 
              className="btn-inicio" 
              onClick={() => navigate('/')}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraciasPorParticipar; 
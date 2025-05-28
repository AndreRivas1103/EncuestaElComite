import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import './styles/GraciasPorParticipar.css';

const GraciasPorParticipar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener datos del state (contraseña y nombre)
  const { contrasena, nombreCompleto } = location.state || {};

  // Debug para ver qué datos estamos recibiendo
  console.log('[DEBUG] Location state:', location.state);
  console.log('[DEBUG] Contraseña recibida:', contrasena);
  console.log('[DEBUG] Nombre recibido:', nombreCompleto);

  // Función para probar con datos simulados
  const probarConDatosSimulados = () => {
    navigate('/gracias-por-participar', {
      state: {
        contrasena: 'and7892024',
        nombreCompleto: 'Andrea Pérez'
      }
    });
  };

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
          
          {nombreCompleto && (
            <p className="mensaje-nombre">
              <strong>{nombreCompleto}</strong>
            </p>
          )}
          
          <p className="mensaje-secundario">
            Tus respuestas han sido registradas exitosamente.
          </p>

          {contrasena ? (
            <div className="contrasena-section">
              <h2 className="contrasena-titulo">Tu contraseña de acceso:</h2>
              <div className="contrasena-display">
                <span className="contrasena-texto">{contrasena}</span>
              </div>
              <p className="contrasena-instruccion">
                ⚠️ <strong>¡Importante!</strong> Guarda esta contraseña. La necesitarás para acceder a tus resultados.
              </p>
            </div>
          ) : (
            <div className="contrasena-section">
              <h2 className="contrasena-titulo">Información de acceso no disponible</h2>
              <p className="contrasena-instruccion">
                Si completaste la encuesta correctamente, deberías haber recibido tu contraseña. 
                Si tienes problemas, contacta al administrador.
              </p>
              <button 
                className="btn-inicio" 
                onClick={probarConDatosSimulados}
                style={{ marginTop: '15px', backgroundColor: '#6c757d' }}
              >
                🧪 Probar con datos simulados
              </button>
            </div>
          )}
          


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
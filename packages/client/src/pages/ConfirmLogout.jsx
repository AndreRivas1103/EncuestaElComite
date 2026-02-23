import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import MigaDePan from '../components/MigaDePan.jsx';

const ConfirmarCierre = () => {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const cerrarSesion = () => {
    navigate('/'); // Redirige a la página de login
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#d3edff', // Fondo azul claro
      display: 'flex',
      flexDirection: 'column'
    }}>
      <title>Cerrar Sesión</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <a href='/iniciar-sesion' className="logo">El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      {/* Contenido principal */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        {/* Recuadro blanco */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          padding: '40px',
          textAlign: 'center',
          width: '90%',
          maxWidth: '620px'
        }}>
          <h1 className='title-medium' style={{ marginBottom: '40px' }}>
            ¿Estás seguro de que deseas cerrar sesión?
          </h1>
          
          <div className='contenedor-botones' style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px',
            marginTop: '20px'
          }}>
            <button 
              onClick={cerrarSesion} 
              className="btn"
              style={{ padding: '12px 30px', fontSize: '1.4rem' }}
            >
              Sí
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="btn"
              style={{ padding: '12px 30px', fontSize: '1.4rem' }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarCierre;
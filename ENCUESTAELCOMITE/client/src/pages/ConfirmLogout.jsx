import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png'; // Asegúrate de tener la misma hoja de estilo
import MigaDePan from '../components/MigaDePan.jsx';

const ConfirmarCierre = () => {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const cerrarSesion = () => {
    navigate('/'); // Redirige a la página de login
  };

  return (
    <div>
      <title>Cerrar Sesión</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>

      <header className="header">
        <div className="logo">
          <a href='/iniciar-sesion' className="logo">El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      <div className='firtsColor' style={{ padding: '50px 20px', textAlign: 'center' }}>
        <h1 className='title-medium'>¿Estás seguro de que deseas cerrar sesión?</h1>
        <div style={{ marginTop: '20px' }}>
          <div className='contenedor-botones' style={{ display: 'flex', justifyContent: 'center', gap: '10px', textAlign: 'center',}}>
            <button 
              onClick={cerrarSesion} 
              className="btn btn-cancelar" 
              style={{textAlign:'center'}}>
              Sí
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="btn btn-cancelar">
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarCierre;

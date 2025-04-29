import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png'; // Asegúrate de tener la misma hoja de estilo

const ConfirmarCierre = () => {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    navigate('/'); // Redirige a la página de login
  };

  return (
    <div>
      <title>Cerrar Sesión</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>

      <header className="header">
        <div className="logo">
          <a href='/iniciar-sesion'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      <div className='firtsColor' style={{ padding: '50px 20px', textAlign: 'center' }}>
        <h1 className='title-contacto-1'>¿Estás seguro de que deseas cerrar sesión?</h1>
        <div style={{ marginTop: '20px' }}>
        <div className='contenedor-botones'>
          <button 
            onClick={cerrarSesion} 
            className="btn" 
            style={{ marginRight: '0px' }}>
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

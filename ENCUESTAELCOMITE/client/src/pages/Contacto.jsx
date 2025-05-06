import React from 'react';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link } from 'react-router-dom';


const IniciarSesion = () => {
  return (
    <div className="login-container">
      <title>Contacto</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Recoleta&display=swap" rel="stylesheet" />
      
      {/* Header con logo y título */}
      <header className="header">
        <div className="logo">
          <a href='/iniciar-sesion' className='logo'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      <h1 className='title-contacto-1'>Contacto</h1>
      <p className='text-contacto'></p>
      <h1 className='title-contacto'>Telefono</h1>
      <p className='text-contacto'>+57 (604) 320 2160</p>
      <h1 className='title-contacto'>Correo Electronico</h1>
      <p className='text-contacto'>Informacion@elcomite.org.co</p>
    </div>
  );
};

export default IniciarSesion;
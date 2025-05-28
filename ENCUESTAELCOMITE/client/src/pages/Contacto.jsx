import React from 'react';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link } from 'react-router-dom';
import MigaDePan from '../components/MigaDePan.jsx';

const Contacto = () => {
  return (
    <div className="contacto-container">
      <title>Contacto</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>
      
      {/* Migas de Pan */}
      <MigaDePan />

      <button
        className="btn-back"
        style={{margin: '20px auto 0', display: 'block'}}
        onClick={() => window.history.back()}
      >
        ← Volver
      </button>
      
      <div className="main-contenido">
        <h1 className="contacto-title">Contacto</h1>
        <p className="contacto-info">Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
        
        <div className="contact-details">
          <p><strong>Email:</strong> info@elcomite.org</p>
          <p><strong>Teléfono:</strong> +1 234 567 8900</p>
          <p><strong>Dirección:</strong> Calle Principal 123, Ciudad</p>
        </div>
        
        <Link to="/" className="btn">Volver al Inicio</Link>
      </div>
    </div>
  );
};

export default Contacto;
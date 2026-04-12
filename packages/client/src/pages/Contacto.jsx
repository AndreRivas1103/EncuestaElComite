import React from 'react';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link } from 'react-router-dom';
import MigaDePan from '../components/MigaDePan.jsx';
import PageLead from '../components/PageLead.jsx';

const Contacto = () => {
  return (
    <div className="contacto-container">
      <title>Contacto</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>
      
      {/* Migas de Pan + volver */}
      <MigaDePan onBack={() => window.history.back()} />

      <div className="main-contenido">
        <h1 className="contacto-title">Contacto</h1>
        <PageLead className="page-lead--center">
          Aquí encuentras los datos de la organización para dudas, apoyo o colaboración con la causa.
        </PageLead>
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
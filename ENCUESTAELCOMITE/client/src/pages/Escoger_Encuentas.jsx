import React from 'react';
import '../pages/styles/RealizarEncuesta.css'; // Importaremos el CSS correspondiente
import babyLogo from '../assets/LogoMarcaPersonal.png'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom'; // Importa Link para navegación

const RealizarEncuesta = () => {
  return (
    <div className="encuesta-page-container">
      <title>El Comité - Realizar Encuesta</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>
      
      <div className="main-contenido">
        <h1 className="encuesta-title">Realizar Encuesta</h1>
        
        <div className="encuesta-options-container">
          <div className="encuesta-column">
            <h2 className="encuesta-option-title">Pre evento</h2>
            <Link to="/rellenar-datos" className="btn btn-encuesta">Realizar Encuesta</Link>
          </div>
          
          <div className="encuesta-column">
            <h2 className="encuesta-option-title">Post evento</h2>
            <Link to="/rellenar-datos" className="btn btn-encuesta">Realizar Encuesta</Link>
          </div>
          
        </div>
        
        <Link to="/" className="btn btn-salir">Salir</Link>
      </div>
    </div>
  );
};

export default RealizarEncuesta;
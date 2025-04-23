import React from 'react';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/logogdc.jpg';
import { Link } from 'react-router-dom'; // Importa Link para navegación

const Home = () => {
  return (
    <div className="home-container">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <link href="https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet"></link>
      
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>
      
      <div className="main-content">
        <h1 className="welcome-title">Bienvenido a Go BaBy <span>Go!</span></h1>
        <p className="mission-text">
          Somos una organización benéfica dedicada a mejorar la vida de los niños discapacitados. 
          Participa y contribuye a nuestra causa. ¡Apoya a nuestros niños!
        </p>
        
        <Link to="/encuesta" className="btn">Iniciar Encuesta</Link>
        <Link to="/resultados" className="btn">Ver resultados</Link>
      </div>
      
      <div className="admin-section">
        <h2 className="admin-title">¿Eres administrador?</h2>
        <p className="admin-text">
          Si eres administrador de éste evento Go BaBy Go, en este apartado podrás ver los resultados de los 
          voluntarios, modificar y planear encuesta.
        </p>
        <Link to="/iniciar-sesion" className="btn">Acceder como Administrador</Link>
      </div>
    </div>
  );
};

export default Home;
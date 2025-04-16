import React from 'react';
import './Home.css';
import babyLogo from '../assets/gobabygo.png'; 

const Home = () => {
  return (
    
    <body>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <link href="https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet"></link>
    <div class="header">
        <div class="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" class="header-logo"></img>
    </div>
    
    <div class="main-content">

        <h1 class="welcome-title">Bienvenido a Go BaBy <span>Go!</span></h1>
        <p class="mission-text">
            Somos una organización benéfica dedicada a mejorar la vida de los niños discapacitados. 
            Participa y contribuye a nuestra causa. ¡Apoya a nuestros niños!
        </p>
        <a href="#" class="btn">Iniciar Encuesta</a>
        <a href="#" class="btn">Ver resultados</a>
    </div>
    {/* Seccion de Admin */}
    <div class="admin-section">
        <h2 class="admin-title">¿Eres administrador?</h2>
        <p class="admin-text">
            Si eres administrador de éste evento Go BaBy Go, en este apartado podrás ver los resultados de los 
            voluntarios, modificar y planear encuesta
        </p>
        <a href="#" class="btn">Acceder como Administrador</a>
    </div>
    </body>
  );
};

export default Home;
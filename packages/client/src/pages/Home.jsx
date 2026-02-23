import React, { useState, useEffect } from 'react';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link } from 'react-router-dom';

// Importar imágenes de la fundación
import fundacion1 from '../assets/imagenes_fundacion/fundacion_1.jpg';
import fundacion2 from '../assets/imagenes_fundacion/fundacion_2.jpg';
import fundacion3 from '../assets/imagenes_fundacion/fundacion_3.jpg';
import fundacion4 from '../assets/imagenes_fundacion/fundacion_4.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  // Array de imágenes
  const imagenes = [fundacion1, fundacion2, fundacion3, fundacion4];

  console.log('Current slide:', currentSlide);
  console.log('Imagenes:', imagenes);

  // Función para mover diapositivas
  const moveSlide = (direction) => {
    setCurrentSlide(prevSlide => {
      const newSlide = prevSlide + direction;
      if (newSlide >= totalSlides) return 0;
      if (newSlide < 0) return totalSlides - 1;
      return newSlide;
    });
  };

  // Función para ir a una diapositiva específica
  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      moveSlide(1);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <title>El Comité</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <link href="https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css2?family=Gloock&display=swap" rel="stylesheet"></link>
      
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>
      
      <div className="main-contenido">
        <h1 className="welcome-title">Bienvenido a Go BaBy <span>Go!</span></h1>
        <p className="mission-text">
          Somos una organización benéfica dedicada a mejorar la vida de los niños discapacitados. 
          Participa y contribuye a nuestra causa. ¡Apoya a nuestros niños!
        </p>
        
        <div className="home-botones-container">
          <Link to="/realizar-encuesta" className="home-btn">Iniciar Encuesta</Link>
          <Link to="/visualizar-resultados" className="home-btn">Ver resultados</Link>
        </div>
      </div>
      
      {/* Carrusel de Imágenes */}
      <div className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-wrapper">
            <img 
              src={imagenes[currentSlide]} 
              alt={`Fundación Go Baby Go - Imagen ${currentSlide + 1}`} 
              className="carousel-image-single"
            />
          </div>
          
          {/* Controles del carrusel */}
          <button className="carousel-btn carousel-btn-prev" onClick={() => moveSlide(-1)}>
            <span>&#8249;</span>
          </button>
          <button className="carousel-btn carousel-btn-next" onClick={() => moveSlide(1)}>
            <span>&#8250;</span>
          </button>
          
          {/* Indicadores */}
          <div className="carousel-indicators">
            <button 
              className={`indicator ${currentSlide === 0 ? 'active' : ''}`} 
              onClick={() => goToSlide(0)}
            ></button>
            <button 
              className={`indicator ${currentSlide === 1 ? 'active' : ''}`} 
              onClick={() => goToSlide(1)}
            ></button>
            <button 
              className={`indicator ${currentSlide === 2 ? 'active' : ''}`} 
              onClick={() => goToSlide(2)}
            ></button>
            <button 
              className={`indicator ${currentSlide === 3 ? 'active' : ''}`} 
              onClick={() => goToSlide(3)}
            ></button>
          </div>
        </div>
      </div>
      
      <div className="admin-section">
        <h2 className="admin-title">¿Eres administrador?</h2>
        <p className="admin-text">
          Si eres administrador de éste evento Go BaBy Go, en este apartado podrás ver los resultados de los 
          voluntarios, modificar y planear encuesta.
        </p>
        <div className="home-admin-button-container">
          <Link to="/iniciar-sesion" className="home-btn-admin">Acceder como Administrador</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
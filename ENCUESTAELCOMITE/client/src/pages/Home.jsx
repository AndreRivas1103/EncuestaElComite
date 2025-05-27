import React, { useState, useEffect } from 'react';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom'; // Importa Link para navegación

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

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
      
      {/* Carrusel de Fotos */}
      <div className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            <div className={`carousel-slide ${currentSlide === 0 ? 'active' : ''}`}>
              <img src={babyLogo} alt="Imagen 1" className="carousel-image" />
              <div className="carousel-caption">
                <h3>Apoyamos a nuestros niños</h3>
                <p>Juntos hacemos la diferencia en sus vidas</p>
              </div>
            </div>
            <div className={`carousel-slide ${currentSlide === 1 ? 'active' : ''}`}>
              <img src={babyLogo} alt="Imagen 2" className="carousel-image" />
              <div className="carousel-caption">
                <h3>Eventos especiales</h3>
                <p>Creando momentos inolvidables</p>
              </div>
            </div>
            <div className={`carousel-slide ${currentSlide === 2 ? 'active' : ''}`}>
              <img src={babyLogo} alt="Imagen 3" className="carousel-image" />
              <div className="carousel-caption">
                <h3>Comunidad unida</h3>
                <p>Trabajando juntos por un futuro mejor</p>
              </div>
            </div>
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
            <button className={`indicator ${currentSlide === 0 ? 'active' : ''}`} onClick={() => goToSlide(0)}></button>
            <button className={`indicator ${currentSlide === 1 ? 'active' : ''}`} onClick={() => goToSlide(1)}></button>
            <button className={`indicator ${currentSlide === 2 ? 'active' : ''}`} onClick={() => goToSlide(2)}></button>
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
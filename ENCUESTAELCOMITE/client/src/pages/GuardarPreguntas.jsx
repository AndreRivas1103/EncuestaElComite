import React from 'react';
import ReactDOM from 'react-dom/client';
import '../Pages/styles/Home.css'; 
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Layout = () => {
  return (
    <div>
      <title>Preguntas Guardadas</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />

      <header className="header">
        <div className="logo">
          <a href='#'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt='Baby go Logo' className='header-logo' />
      </header>

      <div className='firtsColor'>
        <div className="botones-izquierda">
          <button className="btn-pequeno">Regresar</button>
          <button className="btn-pequeno">Inicio</button>
          <button className="btn-pequeno">Salir</button>
        </div>

        <div>
          <h1 className='title-crear-encuesta'>Preguntas guardadas <br />correctamente</h1>
          <br />
        </div>

        <div className='contenedor-botones'>
          <Link to="/programar-cuestionario" className="btn">Programar cuestionario</Link> 
        </div>

        <div className='contenedor-botones'>
          <Link to="/" className="btn">Salir</Link> 
        </div>
      </div>
    </div>
  );
}

root.render(<Layout />);

export default Layout;
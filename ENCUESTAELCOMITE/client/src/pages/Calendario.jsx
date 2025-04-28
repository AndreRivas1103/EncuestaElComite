import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const ProgramarEncuesta = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [tipoEvento, setTipoEvento] = useState('');

  return (
    <div>
      <title>Programar Encuesta</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />

      <header className="header">
        <div className="logo">
          <a href='#'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt='Baby go Logo' className='header-logo' />
      </header>

      <div className="botones-izquierda">
        <Link to="/" className="btn-pequeno">Regresar</Link>
        <Link to="/inicio" className="btn-pequeno">Inicio</Link>
        <button className="btn-pequeno">Salir</button>
      </div>

      <div className='firtsColor'>
        <div className="seccion-calendario">
          <h1 className='title-section'>Selecciona una fecha:</h1>
          <div className="calendario-container">
            <DatePicker
              selected={fechaSeleccionada}
              onChange={date => setFechaSeleccionada(date)}
              dateFormat="dd/MM/yyyy"
              inline
              calendarClassName="calendario-estilizado"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              minDate={new Date()}
            />
          </div>
        </div>

        <div className="seccion-programacion">
          <h1 className='title-section'>Programar encuesta</h1>
          <h2 className='subtitle'>Pre/post evento</h2>
          
          <div className="opciones-evento">
            <label className="radio-option">
              <input 
                type="radio" 
                name="tipo-evento" 
                value="pre" 
                onChange={(e) => setTipoEvento(e.target.value)}
              />
              <span className="radio-label">Pre-evento</span>
            </label>
            
            <label className="radio-option">
              <input 
                type="radio" 
                name="tipo-evento" 
                value="post" 
                onChange={(e) => setTipoEvento(e.target.value)}
              />
              <span className="radio-label">Post-evento</span>
            </label>
          </div>

          <div className='contenedor-botones'>
            <button className='btn-action'>
              Programar encuesta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

root.render(<ProgramarEncuesta />);
export default ProgramarEncuesta;
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
      <div className='firtsColor'>
        <div className="seccion-calendario">
          <h1 className='title-section'>Selecciona una fecha:</h1>
          <div className="calendario-container" style={{ fontSize: '20px' }}>
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
              renderCustomHeader={({
                monthDate,
                decreaseMonth,
                increaseMonth,
              }) => (
                <div className="custom-header" style={{ fontFamily: 'Roboto', fontSize: '20px' }}>
                  <button
                    onClick={decreaseMonth}
                    className="nav-button"
                    aria-label="Mes anterior"
                    style={{ fontSize: '20px' }}
                  >
                    &lt;
                  </button>
                  <span className="month-title" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                    {monthDate.toLocaleString('es-ES', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={increaseMonth}
                    className="nav-button"
                    aria-label="Mes siguiente"
                    style={{ fontSize: '20px' }}
                  >
                    &gt;
                  </button>
                </div>
              )}
              dayClassName={(date) => 
                date.getDate() === fechaSeleccionada.getDate() &&
                date.getMonth() === fechaSeleccionada.getMonth() &&
                date.getFullYear() === fechaSeleccionada.getFullYear()
                  ? 'selected-day' 
                  : 'normal-day'
              }
            />
          </div>
        </div>
        <div className="seccion-programacion">
          <div className='contenedor-botones'>
            <Link to="/inicio-coordinador" className='btn btn-programar'>Programar encuesta</Link> 
          </div>
        </div>
      </div>
    </div>
  );
}

root.render(<ProgramarEncuesta />);
export default ProgramarEncuesta;
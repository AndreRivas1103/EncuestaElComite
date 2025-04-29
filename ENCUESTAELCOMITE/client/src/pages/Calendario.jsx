import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const ProgramarEncuesta = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [tipoEvento, setTipoEvento] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
  };

  const handleLogout = () => {
    navigate("/confirmar-cierre" );
  };

  const menuItems = [
    { path: '/inicio-coordinador', icon: '🏠', label: 'Inicio' },
    { path: '/registro-encuestas', icon: '📝', label: 'Registro Encuestas' },
    { path: '/nuevo-evento', icon: '📅', label: 'Nuevo Evento' },
  ];

  return (
    <div>
      <title>Programar Encuesta</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      
      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt='Baby Go Logo' className='header-logo' />
      </header>

      {/* Botón para abrir sidebar debajo del header */}
      <div style={{ backgroundColor: '#d3edff', padding: '10px 20px' }}>
        <button 
          onClick={() => setSidebarVisible(true)}
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <button className="sidebar-close-btn" onClick={() => setSidebarVisible(false)}>×</button>

        <div className="sidebar-header">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}

          <div className="nav-divider" />

          <button className="nav-item" onClick={() => navigate(-1)}>
            <span className="nav-icon">↩️</span>
            <span className="nav-label">Regresar</span>
          </button>

          <button className="nav-item logout-item" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </nav>
      </div>

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

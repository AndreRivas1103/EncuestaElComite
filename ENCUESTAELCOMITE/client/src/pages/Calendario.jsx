import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Pages/styles/index.css';
import '../Pages/styles/home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Layout() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
  };

  const handleLogout = () => {
    navigate("/confirmar-cierre");
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
          <a href='/inicio-coordinador' className="logo">El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>


      {/* Botón para abrir sidebar */}
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
        <h1 className='texto2'>Selecciona una fecha:</h1>
        <div className="calendario-container">
          <DatePicker
            selected={fechaSeleccionada}
            onChange={date => setFechaSeleccionada(date)}
            dateFormat="dd/MM/yyyy"
            inline 
            calendarClassName="calendario-grande"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            minDate={new Date()}
            renderCustomHeader={({
              monthDate,
              decreaseMonth,
              increaseMonth,
            }) => (
              <div className="custom-header">
                <button
                  onClick={decreaseMonth}
                  className="nav-button"
                  aria-label="Mes anterior"
                >
                  &lt;
                </button>
                <span className="month-title">
                  {monthDate.toLocaleString('es-ES', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <button
                  onClick={increaseMonth}
                  className="nav-button"
                  aria-label="Mes siguiente"
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
      
      <div className='firtsColor'>
        <h1 className='texto3'>Programar encuesta</h1>
        <br />

        <div className='contenedor-botones'>
          <button className='boton'>Programar</button>
        </div>
      </div>
    </div>
  );
}

root.render(<Layout />);
export default Layout;
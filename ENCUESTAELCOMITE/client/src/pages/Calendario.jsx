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

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className='firtsColor' style={{ 
          width: '100%',
          maxWidth: '800px',
          margin: '20px auto',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 className='title-small' style={{ textAlign: 'center', marginBottom: '30px' }}>Selecciona una fecha:</h1>
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
                changeYear,
                changeMonth,
                year,
                month
              }) => (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  backgroundColor: '#9ecd49',
                  color: 'white',
                  borderRadius: '8px 8px 0 0'
                }}>
                  <button
                    onClick={decreaseMonth}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      fontSize: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    &lt;
                  </button>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                      value={month}
                      onChange={({ target: { value } }) => changeMonth(value)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: 'white',
                        fontFamily: 'Roboto',
                        fontSize: '16px'
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                          {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={year}
                      onChange={({ target: { value } }) => changeYear(value)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: 'white',
                        fontFamily: 'Roboto',
                        fontSize: '16px'
                      }}
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() + i}>
                          {new Date().getFullYear() + i}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={increaseMonth}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      fontSize: '20px',
                      cursor: 'pointer'
                    }}
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
        
        <div className='firtsColor' style={{ 
          width: '100%',
          maxWidth: '800px',
          margin: '20px auto',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 className='title-small' style={{ textAlign: 'center', marginBottom: '30px' }}>Programar encuesta</h1>
          
          <div className='contenedor-botones'>
            <button className='btn' style={{ 
              padding: '15px 30px',
              fontSize: '18px',
              width: '100%',
              maxWidth: '300px'
            }}>
              Programar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

root.render(<Layout />);
export default Layout;
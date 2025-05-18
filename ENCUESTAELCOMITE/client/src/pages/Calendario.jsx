import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Pages/styles/calendario.css';
import '../Pages/styles/home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Layout() {
  const [fechaApertura, setFechaApertura] = useState(new Date());
  const [fechaCierre, setFechaCierre] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
    id: localStorage.getItem('userId') || "1"
  };

  useEffect(() => {
    const encuestaTemporal = JSON.parse(localStorage.getItem('encuestaTemporal'));
    if (!encuestaTemporal) {
      navigate('/registro-encuestas');
    }
  }, [navigate]);

  const handleLogout = () => {
    navigate("/confirmar-cierre");
  };

  const menuItems = [
    { path: '/inicio-coordinador', icon: '🏠', label: 'Inicio' },
    { path: '/registro-encuestas', icon: '📝', label: 'Registro Encuestas' },
    { path: '/nuevo-evento', icon: '📅', label: 'Nuevo Evento' },
  ];

  const validarFechas = () => {
    if (fechaCierre <= fechaApertura) {
      setError('La fecha de cierre debe ser posterior a la fecha de apertura');
      return false;
    }
    setError('');
    return true;
  };

  const handleProgramarEncuesta = async () => {
    if (!validarFechas()) return;

    try {
      setLoading(true);
      const encuestaTemporal = JSON.parse(localStorage.getItem('encuestaTemporal'));
      
      if (!encuestaTemporal) {
        throw new Error('No se encontraron datos de la encuesta');
      }

      const encuestaData = {
        ...encuestaTemporal,
        fecha_apertura: fechaApertura.toISOString(),
        fecha_cierre: fechaCierre.toISOString(),
        estado: 'programada',
        usuario_id: user.id
      };

      // 1. Enviar datos al backend
      const response = await axios.put(
        `http://localhost:3000/api/encuestas/${encuestaTemporal._id}`,
        encuestaData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // 2. Limpiar localStorage solo si la API responde correctamente
      localStorage.removeItem('encuestaTemporal');
      
      // 3. Mostrar feedback al usuario
      setSuccess('Encuesta programada exitosamente');
      setError('');
      
      // 4. Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/registro-encuestas', { 
          state: { 
            mensaje: 'Encuesta programada exitosamente',
            encuestaId: encuestaTemporal._id 
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error al programar encuesta:', error);
      setError('Error al programar la encuesta: ' + 
        (error.response?.data?.message || error.message));
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

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

      <div style={{ backgroundColor: '#d3edff', padding: '10px 20px' }}>
        <button 
          onClick={() => setSidebarVisible(true)}
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
        >
          ☰
        </button>
      </div>

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
        {/* Calendario Apertura */}
        <div className='firtsColor' style={{ 
          width: '100%',
          maxWidth: '800px',
          margin: '20px auto',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 className='title-small' style={{ textAlign: 'center', marginBottom: '20px', color: '#1e3766' }}>Fecha de apertura:</h1>
          <div className="calendario-container">
            <DatePicker
              selected={fechaApertura}
              onChange={date => {
                setFechaApertura(date);
                if (fechaCierre <= date) {
                  const newCierre = new Date(date);
                  newCierre.setDate(newCierre.getDate() + 1);
                  setFechaCierre(newCierre);
                }
              }}
              dateFormat="dd/MM/yyyy"
              inline
              calendarClassName="calendario-corporativo"
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
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <select
                      value={month}
                      onChange={({ target: { value } }) => changeMonth(value)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        fontFamily: 'Roboto',
                        fontSize: '16px',
                        color: '#1e3766',
                        cursor: 'pointer'
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
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        fontFamily: 'Roboto',
                        fontSize: '16px',
                        color: '#1e3766',
                        cursor: 'pointer'
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
              renderDayContents={(day) => {
                return (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    {day}
                  </div>
                );
              }}
            />
          </div>
        </div>
        
        {/* Calendario Cierre */}
        <div className='firtsColor' style={{ 
          width: '100%',
          maxWidth: '800px',
          margin: '20px auto',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 className='title-small' style={{ textAlign: 'center', marginBottom: '20px', color: '#1e3766' }}>Fecha de cierre:</h1>
          <div className="calendario-container">
            <DatePicker
              selected={fechaCierre}
              onChange={date => setFechaCierre(date)}
              dateFormat="dd/MM/yyyy"
              inline
              calendarClassName="calendario-corporativo"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              minDate={fechaApertura}
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
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <select
                      value={month}
                      onChange={({ target: { value } }) => changeMonth(value)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        fontFamily: 'Roboto',
                        fontSize: '16px',
                        color: '#1e3766',
                        cursor: 'pointer'
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
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        fontFamily: 'Roboto',
                        fontSize: '16px',
                        color: '#1e3766',
                        cursor: 'pointer'
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
              renderDayContents={(day) => {
                return (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    {day}
                  </div>
                );
              }}
            />
          </div>
        </div>
        
        {/* Botón de Programación */}
        <div className='firtsColor' style={{ 
          width: '100%',
          maxWidth: '800px',
          margin: '20px auto',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 className='title-small' style={{ textAlign: 'center', marginBottom: '30px' }}>Programar encuesta</h1>
          
          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: '20px', 
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#ffebee',
              borderRadius: '5px'
            }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ 
              color: 'green', 
              marginBottom: '20px', 
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#e8f5e9',
              borderRadius: '5px'
            }}>
              {success}
            </div>
          )}
          
          <div className='contenedor-botones'>
            <button 
              className='btn' 
              style={{ 
                padding: '15px 30px',
                fontSize: '18px',
                width: '100%',
                maxWidth: '300px',
                backgroundColor: '#9ecd49',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1,
                pointerEvents: loading ? 'none' : 'auto'
              }}
              onClick={handleProgramarEncuesta}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Programar Encuesta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

root.render(<Layout />);
export default Layout;
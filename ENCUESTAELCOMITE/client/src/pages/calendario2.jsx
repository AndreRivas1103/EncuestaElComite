// Calendario.jsx unificado
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../Pages/styles/calendario.css';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

// Mantener CustomCalendar desde Calendario.jsx
const CustomCalendar = ({ selectedDate, onChange, minDate }) => {
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const generateCalendarGrid = () => {
    const weeks = [];
    let week = [];
    
    for (let i = 0; i < adjustedFirstDay; i++) {
      week.push(<td key={`empty-${i}`} className="calendar-empty-day"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(viewYear, viewMonth, day);
      const isSelected = currentDate.toDateString() === selectedDate.toDateString();
      const isDisabled = currentDate < minDate;
      const isToday = currentDate.toDateString() === new Date().toDateString();

      week.push(
        <td 
          key={day}
          className={`calendar-day ${isSelected ? 'selected-day' : ''} ${isDisabled ? 'disabled-day' : ''}`}
          onClick={() => !isDisabled && onChange(currentDate)}
        >
          <div className="day-number">{day}</div>
          {isToday && <div className="today-indicator"></div>}
        </td>
      );

      if (week.length === 7) {
        weeks.push(<tr key={day}>{week}</tr>);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(<td key={`empty-end-${week.length}`} className="calendar-empty-day"></td>);
      }
      weeks.push(<tr key="last">{week}</tr>);
    }

    return weeks;
  };

  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <div className="month-year-display">
          <span 
            className="month-selector-trigger"
            onClick={() => setShowMonthSelector(!showMonthSelector)}
          >
            {meses[viewMonth].toUpperCase()}
          </span>
          <span 
            className="year-selector-trigger"
            onClick={() => setShowYearSelector(!showYearSelector)}
          >
            {viewYear}
          </span>
          
          {showMonthSelector && (
            <div className="month-selector-dropdown">
              {meses.map((mes, index) => (
                <div
                  key={mes}
                  className="month-option"
                  onClick={() => {
                    setViewMonth(index);
                    setShowMonthSelector(false);
                  }}
                >
                  {mes}
                </div>
              ))}
            </div>
          )}

          {showYearSelector && (
            <div className="year-selector-dropdown">
              {Array.from({length: 10}, (_, i) => viewYear - 5 + i).map(year => (
                <div
                  key={year}
                  className="year-option"
                  onClick={() => {
                    setViewYear(year);
                    setShowYearSelector(false);
                  }}
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="navigation-controls">
          <button 
            onClick={() => setViewMonth(prev => prev > 0 ? prev - 1 : 11)}
            className="nav-button"
          >
            &lt;
          </button>
          <button
            onClick={() => setViewMonth(prev => prev < 11 ? prev + 1 : 0)}
            className="nav-button"
          >
            &gt;
          </button>
        </div>
      </div>

      <table className="calendar-grid">
        <thead>
          <tr>
            {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(day => (
              <th key={day} className="week-day">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{generateCalendarGrid()}</tbody>
      </table>
    </div>
  );
};

// Layout tomado de calendario2.jsx
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
    cedula: localStorage.getItem('userCedula')
  };

  useEffect(() => {
    const encuestaTemporal = JSON.parse(localStorage.getItem('encuestaTemporal'));
    if (!encuestaTemporal?.titulo) navigate('/crear-pregunta');
  }, [navigate]);

  const handleLogout = () => navigate("/confirmar-cierre");

  const menuItems = [
    { path: '/inicio-coordinador', icon: '🏠', label: 'Inicio' },
    { path: '/registro-encuestas', icon: '📝', label: 'Registro Encuestas' },
    { path: '/nuevo-evento', icon: '📅', label: 'Nuevo Evento' },
  ];

  const validarFechas = () => {
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);

    const fechaAperturaSinHora = new Date(fechaApertura);
    fechaAperturaSinHora.setHours(0, 0, 0, 0);

    const fechaCierreSinHora = new Date(fechaCierre);
    fechaCierreSinHora.setHours(0, 0, 0, 0);

    if (fechaAperturaSinHora < ahora) {
      setError('La fecha de apertura no puede ser en el pasado');
      return false;
    }

    if (fechaCierreSinHora <= fechaAperturaSinHora) {
      setError('La fecha de cierre debe ser al menos 1 día después de la apertura');
      return false;
    }

    setError('');
    return true;
  };

  const handleProgramarEncuesta = async () => {
    try {
      if (!validarFechas() || !user?.cedula) return;
      
      setLoading(true);
      const encuestaTemporal = JSON.parse(localStorage.getItem('encuestaTemporal') || '{}');
      
      const payload = {
        id: encuestaTemporal.id || undefined,
        titulo: encuestaTemporal.titulo,
        fecha_apertura: new Date(fechaApertura).toISOString().split('T')[0],
        fecha_cierre: new Date(fechaCierre).toISOString().split('T')[0],
        usuario_id: user.cedula,
        datos_encuesta: encuestaTemporal.datos_encuesta || {},
      };

      const baseURL = 'http://localhost:3000/api/encuestas';
      const response = await axios({
        method: encuestaTemporal.id ? 'put' : 'post',
        url: encuestaTemporal.id ? `${baseURL}/${encuestaTemporal.id}` : baseURL,
        data: payload,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      localStorage.removeItem('encuestaTemporal');
      setSuccess('Encuesta programada con éxito');
      setTimeout(() => navigate('/registro-encuestas'), 1500);

    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-container">
      <header className="header">
        <div className="logo-container">
          <a href='/inicio-coordinador' className="logo">El Comité</a>
          <img src={babyLogo} alt="Logo" className="header-logo" />
        </div>
        
        <button 
          className="menu-toggle"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          ☰
        </button>
      </header>

      <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <button 
          className="sidebar-close-btn" 
          onClick={() => setSidebarVisible(false)}
        >
          ×
        </button>
        
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

          <div className="nav-divider"></div>
          
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

      <main className="main-content">
        <div className="calendar-section">
          <div className="calendar-container">
            <h2 className="section-title">Fecha de apertura</h2>
            <CustomCalendar
              selectedDate={fechaApertura}
              onChange={(date) => {
                setFechaApertura(date);
                if (fechaCierre <= date) {
                  const newCierre = new Date(date);
                  newCierre.setDate(newCierre.getDate() + 1);
                  setFechaCierre(newCierre);
                }
              }}
              minDate={new Date()}
            />
          </div>

          <div className="calendar-container">
            <h2 className="section-title">Fecha de cierre</h2>
            <CustomCalendar
              selectedDate={fechaCierre}
              onChange={setFechaCierre}
              minDate={fechaApertura}
            />
          </div>

          <div className="action-section">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <button 
              className="submit-button"
              onClick={handleProgramarEncuesta}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Programar Encuesta'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout;

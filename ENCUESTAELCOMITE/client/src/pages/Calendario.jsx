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

  // Datos del usuario
  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
    cedula: localStorage.getItem('userCedula')
  };

  useEffect(() => {
    const encuestaTemporal = JSON.parse(localStorage.getItem('encuestaTemporal'));
    console.log('[DEBUG] Encuesta cargada en Calendario:', encuestaTemporal);

    if (!encuestaTemporal?.titulo || !encuestaTemporal?.id) {
      console.warn('[ERROR] Datos de encuesta faltantes, redirigiendo...');
      navigate('/crear-pregunta'); // O la ruta que corresponda
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
    console.log('[DEBUG] Validando fechas...');
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);

    const fechaAperturaSinHora = new Date(fechaApertura);
    fechaAperturaSinHora.setHours(0, 0, 0, 0);

    const fechaCierreSinHora = new Date(fechaCierre);
    fechaCierreSinHora.setHours(0, 0, 0, 0);

    console.log('[DEBUG] Fechas comparadas:', {
      ahora: ahora.toISOString(),
      apertura: fechaAperturaSinHora.toISOString(),
      cierre: fechaCierreSinHora.toISOString()
    });

    if (fechaAperturaSinHora < ahora) {
      console.error('[ERROR] Fecha apertura en pasado');
      setError('La fecha de apertura no puede ser en el pasado');
      return false;
    }

    if (fechaCierreSinHora <= fechaAperturaSinHora) {
      console.error('[ERROR] Fecha cierre anterior a apertura');
      setError('La fecha de cierre debe ser al menos 1 día después de la apertura');
      return false;
    }

    console.log('[DEBUG] Fechas validadas correctamente');
    setError('');
    return true;
  };

  const handleProgramarEncuesta = async () => {
    console.group('[DEBUG] Iniciando programación de encuesta');
    try {
      console.log('[DEBUG] Paso 1/6: Validando fechas y usuario');
      if (!validarFechas()) return;
      
      if (!user?.cedula) {
        console.error('[ERROR] No hay cédula de usuario');
        setError('Debe iniciar sesión para programar encuestas');
        return;
      }

      setLoading(true);
      setError('');
      setSuccess('');

      // 2. Formatear fechas
      const formatDate = (date) => {
        try {
          const formatted = new Date(date).toISOString().split('T')[0];
          console.log(`[DEBUG] Fecha formateada: ${date} -> ${formatted}`);
          return formatted;
        } catch (e) {
          console.error('[ERROR] Formateo de fecha fallido:', e);
          throw new Error(`Fecha inválida: ${date}`);
        }
      };

      // 3. Obtener datos temporales
      console.log('[DEBUG] Paso 2/6: Obteniendo encuesta temporal');
      const encuestaTemporal = JSON.parse(localStorage.getItem('encuestaTemporal') || '{}');
      console.log('[DEBUG] Encuesta temporal obtenida:', encuestaTemporal);
      
      if (!encuestaTemporal?.titulo) {
        console.error('[ERROR] Encuesta temporal sin título');
        throw new Error('No se encontró la encuesta a programar');
      }

      // 4. Preparar payload
      console.log('[DEBUG] Paso 3/6: Preparando payload');
      const payload = {
        id: encuestaTemporal.id || undefined,
        titulo: encuestaTemporal.titulo,
        fecha_apertura: formatDate(fechaApertura),
        fecha_cierre: formatDate(fechaCierre),
        usuario_id: user.cedula,
        datos_encuesta: encuestaTemporal.datos_encuesta || {},
      };

      console.log('[DEBUG] Paso 4/6: Payload completo a enviar:', {
        payload,
        userCedula: user.cedula,
        fechaAperturaOriginal: fechaApertura,
        fechaCierreOriginal: fechaCierre
      });

      // 5. Enviar al backend
      console.log('[DEBUG] Paso 5/6: Enviando al backend');
      const baseURL = 'http://localhost:3000/api/encuestas'; // Ajusta el puerto si es necesario
      const endpoint = encuestaTemporal.id 
        ? `${baseURL}/${encuestaTemporal.id}`
        : baseURL;

      const method = encuestaTemporal.id ? 'put' : 'post';
      console.log(`[DEBUG] Método: ${method.toUpperCase()} a ${endpoint}`);

      const response = await axios({
        method,
        url: endpoint,
        data: payload,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('[DEBUG] Paso 6/6: Respuesta del servidor:', response.data);

      // Éxito
      localStorage.removeItem('encuestaTemporal');
      setSuccess('Encuesta programada con éxito');
      console.log('[DEBUG] Operación completada con éxito');
      
      setTimeout(() => {
        navigate('/registro-encuestas', { 
          state: { success: true } 
        });
      }, 1500);

    } catch (error) {
      console.error('[ERROR] Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        },
        stack: error.stack
      });

      const errorMsg = error.response?.data?.error 
        || error.response?.data?.message
        || error.message
        || 'Error al procesar la encuesta';

      setError(errorMsg);
    } finally {
      setLoading(false);
      console.groupEnd();
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
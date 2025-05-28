import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import '../pages/styles/Calendario.css';
import '../pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import axios from 'axios';
import MigaDePan from '../components/MigaDePan.jsx';

// Registrar la localización en español
registerLocale('es', es);

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Datos del usuario
  const user = {
    name: localStorage.getItem('userName') || "Usuario",
    email: localStorage.getItem('userEmail') || "usuario@ejemplo.com",
    cedula: localStorage.getItem('userCedula')
  };

  // Estados para mes y año de apertura
  const [aperturaMonth, setAperturaMonth] = useState(fechaApertura.getMonth());
  const [aperturaYear, setAperturaYear] = useState(fechaApertura.getFullYear());
  // Estados para mes y año de cierre
  const [cierreMonth, setCierreMonth] = useState(fechaCierre.getMonth());
  const [cierreYear, setCierreYear] = useState(fechaCierre.getFullYear());

  // Sincronizar fechaApertura cuando cambian mes/año
  useEffect(() => {
    const nuevaFecha = new Date(aperturaYear, aperturaMonth, fechaApertura.getDate());
    setFechaApertura(nuevaFecha);
    // eslint-disable-next-line
  }, [aperturaMonth, aperturaYear]);

  // Sincronizar fechaCierre cuando cambian mes/año
  useEffect(() => {
    const nuevaFecha = new Date(cierreYear, cierreMonth, fechaCierre.getDate());
    setFechaCierre(nuevaFecha);
    // eslint-disable-next-line
  }, [cierreMonth, cierreYear]);

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

  const handleShowConfirmation = () => {
    if (!validarFechas()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmProgram = async () => {
    setShowConfirmModal(false);
    await handleProgramarEncuesta();
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

      <MigaDePan withSidebar={true} sidebarVisible={sidebarVisible} />

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
        backgroundColor: '#d3edff',
        minHeight: 'calc(100vh - 200px)',
        padding: '40px 20px'
      }}>
        {/* Contenedor principal de calendarios */}
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Título principal */}
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '40px', 
            color: '#1e3766',
            fontFamily: 'Merriweather',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            Programar Fechas de Encuesta
          </h1>

          {/* Contenedor de calendarios lado a lado */}
          <div className="calendario-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))',
            gap: '50px',
            marginBottom: '60px'
          }}>
            
            {/* Calendario Apertura */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '40px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              border: '1px solid #e9ecef',
              minHeight: '580px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '25px', 
                color: '#1e3766',
                fontFamily: 'Merriweather',
                fontSize: '1.8rem',
                fontWeight: 'bold'
              }}>
                Fecha de apertura:
              </h2>
              <div className="calendario-container">
                <DatePicker
                  selected={fechaApertura}
                  onChange={date => {
                    setFechaApertura(date);
                    setAperturaMonth(date.getMonth());
                    setAperturaYear(date.getFullYear());
                    if (fechaCierre <= date) {
                      const newCierre = new Date(date);
                      newCierre.setDate(newCierre.getDate() + 1);
                      setFechaCierre(newCierre);
                      setCierreMonth(newCierre.getMonth());
                      setCierreYear(newCierre.getFullYear());
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  locale="es"
                  inline
                  calendarClassName="calendario-corporativo"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  minDate={new Date()}
                  month={aperturaMonth}
                  year={aperturaYear}
                  renderCustomHeader={({
                    decreaseMonth,
                    increaseMonth,
                    changeYear,
                    changeMonth,
                    month,
                    year
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
                        onClick={() => {
                          if (aperturaMonth === 0) {
                            setAperturaMonth(11);
                            setAperturaYear(aperturaYear - 1);
                          } else {
                            setAperturaMonth(aperturaMonth - 1);
                          }
                        }}
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
                          value={aperturaMonth}
                          onChange={({ target: { value } }) => setAperturaMonth(Number(value))}
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
                          value={aperturaYear}
                          onChange={({ target: { value } }) => setAperturaYear(Number(value))}
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
                        onClick={() => {
                          if (aperturaMonth === 11) {
                            setAperturaMonth(0);
                            setAperturaYear(aperturaYear + 1);
                          } else {
                            setAperturaMonth(aperturaMonth + 1);
                          }
                        }}
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
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '40px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              border: '1px solid #e9ecef',
              minHeight: '580px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '25px', 
                color: '#1e3766',
                fontFamily: 'Merriweather',
                fontSize: '1.8rem',
                fontWeight: 'bold'
              }}>
                Fecha de cierre:
              </h2>
              <div className="calendario-container">
                <DatePicker
                  selected={fechaCierre}
                  onChange={date => {
                    setFechaCierre(date);
                    setCierreMonth(date.getMonth());
                    setCierreYear(date.getFullYear());
                  }}
                  dateFormat="dd/MM/yyyy"
                  locale="es"
                  inline
                  calendarClassName="calendario-corporativo"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  minDate={fechaApertura}
                  month={cierreMonth}
                  year={cierreYear}
                  renderCustomHeader={({
                    decreaseMonth,
                    increaseMonth,
                    changeYear,
                    changeMonth,
                    month,
                    year
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
                        onClick={() => {
                          if (cierreMonth === 0) {
                            setCierreMonth(11);
                            setCierreYear(cierreYear - 1);
                          } else {
                            setCierreMonth(cierreMonth - 1);
                          }
                        }}
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
                          value={cierreMonth}
                          onChange={({ target: { value } }) => setCierreMonth(Number(value))}
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
                          value={cierreYear}
                          onChange={({ target: { value } }) => setCierreYear(Number(value))}
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
                        onClick={() => {
                          if (cierreMonth === 11) {
                            setCierreMonth(0);
                            setCierreYear(cierreYear + 1);
                          } else {
                            setCierreMonth(cierreMonth + 1);
                          }
                        }}
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
          </div>
          
          {/* Botón de Programación */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '40px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '30px',
              color: '#1e3766',
              fontFamily: 'Merriweather',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              Programar encuesta
            </h2>
            
            {error && (
              <div style={{ 
                color: '#d32f2f', 
                marginBottom: '20px', 
                textAlign: 'center',
                padding: '15px',
                backgroundColor: '#ffebee',
                borderRadius: '10px',
                border: '1px solid #ffcdd2',
                fontFamily: 'Roboto',
                fontSize: '1rem'
              }}>
                {error}
              </div>
            )}
            
            {success && (
              <div style={{ 
                color: '#2e7d32', 
                marginBottom: '20px', 
                textAlign: 'center',
                padding: '15px',
                backgroundColor: '#e8f5e9',
                borderRadius: '10px',
                border: '1px solid #c8e6c9',
                fontFamily: 'Roboto',
                fontSize: '1rem'
              }}>
                {success}
              </div>
            )}
            
            <button 
              style={{ 
                padding: '15px 40px',
                fontSize: '1.2rem',
                backgroundColor: '#9ecd49',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1,
                pointerEvents: loading ? 'none' : 'auto',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(158, 205, 73, 0.3)',
                minWidth: '200px'
              }}
              onClick={handleShowConfirmation}
              disabled={loading}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#8bb63f';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(158, 205, 73, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#9ecd49';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(158, 205, 73, 0.3)';
                }
              }}
            >
              {loading ? 'Enviando...' : 'Programar Encuesta'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '30px 40px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            textAlign: 'center',
            minWidth: '320px',
            maxWidth: '90vw'
          }}>
            <h3 style={{marginBottom: '18px', color: '#1e3766'}}>Confirmar programación</h3>
            <p style={{marginBottom: '28px'}}>¿Estás seguro de que quieres programar esta encuesta?</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
              <button 
                onClick={() => setShowConfirmModal(false)}
                style={{
                  padding: '10px 24px',
                  background: '#e57373',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >Cancelar</button>
              <button 
                onClick={handleConfirmProgram}
                style={{
                  padding: '10px 24px',
                  background: '#9ecd49',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

root.render(<Layout />);
export default Layout;
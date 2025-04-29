import React, { useState } from 'react';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const TukiInicio = () => {
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
      <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>
      <title>Encuesta 001</title>
      
      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      {/* Botón para abrir sidebar DEBAJO del header */}
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
        <div>
          <h1 className='Texto'>Encuesta 001</h1>
          <br></br>
        </div>
        
        <div className="encuesta-container">
          <h1 className='historial'>
            Número de encuestados: 3
          </h1> 
          <br></br>
          
          {/* Primer caso */}
          <div className="caso-encuesta">
            <h1 className='historial'>Persona: Samuel Gallego Meneses</h1>
            <h1 className='historial'>Correo electrónico: Sgallego882@gmail.com</h1>
            
            <div className="resultados-container">
              <h2 className="resultados-titulo">Resultados:</h2>
              <div className="aspectos-container">
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Total:</span>
                  <span className="aspecto-valor">8/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Liderazgo:</span>
                  <span className="aspecto-valor">10/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Trabajo en Equipo:</span>
                  <span className="aspecto-valor">6/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Obtención de logros:</span>
                  <span className="aspecto-valor">6/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Resiliencia:</span>
                  <span className="aspecto-valor">10/10</span>
                </div>
              </div>
            </div>
            
            <button className="boton-ver-encuesta">Ver Encuesta</button>
          </div>
          
          <br></br>
          
          {/* Segundo caso */}
          <div className="caso-encuesta">
            <h1 className='historial'>Persona: Andre Rivas Castro</h1>
            <h1 className='historial'>Correo electrónico: Arivas477@gmail.com</h1>
            
            <div className="resultados-container">
              <h2 className="resultados-titulo">Resultados:</h2>
              <div className="aspectos-container">
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Total:</span>
                  <span className="aspecto-valor">7/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Liderazgo:</span>
                  <span className="aspecto-valor">4/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Trabajo en Equipo:</span>
                  <span className="aspecto-valor">10/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Obtención de logros:</span>
                  <span className="aspecto-valor">8/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Resiliencia:</span>
                  <span className="aspecto-valor">6/10</span>
                </div>
              </div>
            </div>
            
            <button className="boton-ver-encuesta">Ver Encuesta</button>
          </div>
          <br></br>
          
          {/* Tercer caso */}
          <div className="caso-encuesta">
            <h1 className='historial'>Persona: Juliana Franco Alzate</h1>
            <h1 className='historial'>Correo electrónico: Jfranco158@gmail.com</h1>
            
            <div className="resultados-container">
              <h2 className="resultados-titulo">Resultados:</h2>
              <div className="aspectos-container">
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Total:</span>
                  <span className="aspecto-valor">8.5/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Liderazgo:</span>
                  <span className="aspecto-valor">6/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Trabajo en Equipo:</span>
                  <span className="aspecto-valor">10/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Obtención de logros:</span>
                  <span className="aspecto-valor">8/10</span>
                </div>
                <div className="aspecto-item">
                  <span className="aspecto-nombre">Resiliencia:</span>
                  <span className="aspecto-valor">10/10</span>
                </div>
              </div>
            </div>
            
            <button className="boton-ver-encuesta">Ver Encuesta</button>
          </div>

          {/* Botón Mostrar Encuesta (nuevo) */}
          <div className="boton-mostrar-container">
            <Link to="/encuestas" className="boton-ver-encuesta">Mostrar Encuesta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TukiInicio;
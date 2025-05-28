import { useState, useEffect } from "react";
import "../pages/styles/VerResultados.css";
import { Link } from "react-router-dom";
import babyLogo from "../assets/LogoMarcaPersonal.png";
import MigaDePan from "../components/MigaDePan.jsx";

function CircularProgress({ value, size = 40, strokeWidth = 4 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 10) * circumference;

  return (
    <div className="circular-progress">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9ecd49" />
            <stop offset="100%" stopColor="#73a31d" />
          </linearGradient>
        </defs>
        <circle
          className="circle-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="circle-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="progress-value">{value}</span>
    </div>
  );
}

function SkillCard({ title, value }) {
  return (
    <div className="skill-card">
      <span className="skill-title">{title}</span>
      <CircularProgress value={value} />
      <div className="skill-label">{value}/10</div>
    </div>
  );
}

export default function VerResultados() {
  const [userData, setUserData] = useState(null);
  const [resultadosData, setResultadosData] = useState(null);
  const [resultadoPre, setResultadoPre] = useState(null);
  const [resultadoPost, setResultadoPost] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Estado para las habilidades en escala 1-10
  const [skills, setSkills] = useState({
    liderazgo: 0,
    obtencionLogros: 0,
    trabajoEquipo: 0,
    resiliencia: 0,
  });

  // Calcular promedio dinámico en escala 1-10
  const promedio = Math.round(
    Object.values(skills).reduce((a, b) => a + b, 0) /
      Object.values(skills).length
  );

  // Convertir porcentaje a escala 1-10
  const convertirAScala = (porcentaje) => {
    return Math.round((porcentaje / 100) * 10);
  };

  useEffect(() => {
    // Recuperar datos del usuario
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    // Recuperar resultados
    const storedResultadosData = localStorage.getItem('resultadosData');
    if (storedResultadosData) {
      const parsedData = JSON.parse(storedResultadosData);
      setResultadosData(parsedData);
      
      // Filtrar resultados pre y post
      const pre = parsedData.find(r => r.tipo === 'pre');
      const post = parsedData.find(r => r.tipo === 'post');
      setResultadoPre(pre);
      setResultadoPost(post);
      
      // Actualizar habilidades si hay resultado pre
      if (pre && pre.resultado && pre.resultado.porCategoria) {
        const categoriaData = pre.resultado.porCategoria;
        setSkills({
          liderazgo: convertirAScala(categoriaData.Liderazgo?.porcentaje || 0),
          trabajoEquipo: convertirAScala(categoriaData["Trabajo En Equipo"]?.porcentaje || 0),
          obtencionLogros: convertirAScala(categoriaData["Obtencion de logros"]?.porcentaje || 0),
          resiliencia: convertirAScala(categoriaData.Resiliencia?.porcentaje || 0)
        });
      }
    }
    
    // Limpiar localStorage después de usar los datos
    return () => {
      localStorage.removeItem('userData');
      localStorage.removeItem('resultadosData');
    };
  }, []);

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (!userData || !resultadosData) {
    return (
      <div className="app-container">
        <div className="header ">
          <div className="logo header-ver-resultados">
            El Comit<span>é</span>
          </div>
          <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
        </div>
        
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <title>Resultados</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>

      <div className="header ">
        <div className="logo header-ver-resultados">
          El Comit<span>é</span>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>
      
      {/* Migas de Pan */}
      <MigaDePan />
      
      <button
        className="toggle-sidebar-btn"
        onClick={handleToggleSidebar}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      <div className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
        <button 
          className="close-sidebar-btn"
          onClick={handleCloseSidebar}
          aria-label="Cerrar menú"
        >
          ×
        </button>
        <div className="sidebar-superior">
          <div><span className='blanco'>El comit</span><span className='verde'>é</span></div>
          <h2>Menú Principal</h2>
          <ul>
            <li>
              <a href="#" onClick={() => console.log('Navegando a Pre-evento')}>
                📋 Pre-evento
              </a>
            </li>
            <li>
              <a href="#" onClick={() => console.log('Navegando a Post-evento')}>
                📊 Post-evento
              </a>
            </li>
          </ul>
        </div>

        <div className="sidebar2-inferior">
          <ul>
            <li>
              <a href="/" onClick={() => console.log('Salir')}>
                🚪 Salir
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`contenido-principal ${sidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
        <div className="cuadro-porcentajes">
          <h1 className="title-resultados">
            Resultados de {userData.nombreCompleto}
          </h1>
          
          {resultadoPre && resultadoPre.resultado && (
            <div className="resultado-info">
              <p className="resultado-fecha">
                Fecha: {resultadoPre.resultado.resumen?.fecha || 'No disponible'}
              </p>
              <p className="resultado-total">
                Puntuación total: {convertirAScala(resultadoPre.resultado.resumen?.porcentajeTotal || 0)}/10
              </p>
              <p className="resultado-perfil">
                Perfil: {resultadoPre.resultado.perfil || 'No disponible'}
              </p>
            </div>
          )}

          <div className="average-container">
            <CircularProgress value={promedio} size={120} strokeWidth={8} />
            <div className="promedio-label">Promedio: {promedio}/10</div>
          </div>
          
          <div className="skills-grid">
            <SkillCard title="Liderazgo" value={skills.liderazgo} />
            <SkillCard title="Trabajo en equipo" value={skills.trabajoEquipo} />
            <SkillCard
              title="Obtención de logros"
              value={skills.obtencionLogros}
            />
            <SkillCard title="Resiliencia" value={skills.resiliencia} />
          </div>
          
          {resultadoPre && resultadoPre.resultado && resultadoPre.resultado.recomendaciones && (
            <div className="recomendaciones-container">
              <h3>Recomendaciones</h3>
              <ul>
                {resultadoPre.resultado.recomendaciones.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
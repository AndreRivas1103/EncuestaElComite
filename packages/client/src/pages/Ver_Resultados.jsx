import { useState, useEffect } from "react";
import "../pages/styles/VerResultados.css";
import { Link, useNavigate } from "react-router-dom";
import babyLogo from "../assets/LogoMarcaPersonal.png";
import MigaDePan from "../components/MigaDePan.jsx";
import axios from "axios";

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
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [resultadosData, setResultadosData] = useState(null);
  const [resultadoPre, setResultadoPre] = useState(null);
  const [resultadoPost, setResultadoPost] = useState(null);
  const [tipoVista, setTipoVista] = useState("pre");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [skills, setSkills] = useState({
    liderazgo: 0,
    obtencionLogros: 0,
    trabajoEquipo: 0,
    resiliencia: 0,
  });

  const promedio = Math.round(
    Object.values(skills).reduce((a, b) => a + b, 0) /
      Object.values(skills).length
  );

  const convertirAScala = (porcentaje) => {
    return Math.round((porcentaje / 100) * 10);
  };

  const fetchResultadoPostDesdeAPI = async (correo) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.post(
        "http://localhost:3000/api/resultados/credenciales/post", 
        { correo }
      );

      if (!response.data.success || !Array.isArray(response.data.data)) {
        throw new Error("Formato inesperado de resultados");
      }

      const post = response.data.data.find(r => r.tipo === "post");
      if (!post) {
        throw new Error("No se encontraron resultados post");
      }
      
      setResultadoPost(post);
      
      // Actualizar localStorage con el nuevo resultado post
      const newResultadosData = resultadosData ? [...resultadosData] : [];
      const existingPostIndex = newResultadosData.findIndex(r => r.tipo === "post");
      
      if (existingPostIndex !== -1) {
        newResultadosData[existingPostIndex] = post;
      } else {
        newResultadosData.push(post);
      }
      
      setResultadosData(newResultadosData);
      localStorage.setItem("resultadosData", JSON.stringify(newResultadosData));
      
    } catch (error) {
      console.error("[ERROR] al obtener resultados post desde API:", error);
      setError(error.response?.data?.error || error.message || "Error al obtener resultados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }

    const storedResultadosData = localStorage.getItem("resultadosData");
    if (storedResultadosData) {
      const parsedData = JSON.parse(storedResultadosData);
      setResultadosData(parsedData);

      const pre = parsedData.find((r) => r.tipo === "pre");
      const post = parsedData.find((r) => r.tipo === "post");
      setResultadoPre(pre);
      setResultadoPost(post);
    }

    return () => {
      // Mantener los datos en localStorage
    };
  }, []);

  useEffect(() => {
    const resultadoActivo = tipoVista === "pre" ? resultadoPre : resultadoPost;
    if (resultadoActivo && resultadoActivo.resultado && resultadoActivo.resultado.porCategoria) {
      const categoriaData = resultadoActivo.resultado.porCategoria;
      setSkills({
        liderazgo: convertirAScala(categoriaData.Liderazgo?.porcentaje || 0),
        trabajoEquipo: convertirAScala(categoriaData["Trabajo En Equipo"]?.porcentaje || 0),
        obtencionLogros: convertirAScala(categoriaData["Obtencion de logros"]?.porcentaje || 0),
        resiliencia: convertirAScala(categoriaData.Resiliencia?.porcentaje || 0),
      });
    }
  }, [tipoVista, resultadoPre, resultadoPost]);

  const resultadoActivo = tipoVista === "pre" ? resultadoPre : resultadoPost;

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handlePostClick = () => {
    setTipoVista("post");
    if (!resultadoPost && userData) {
      fetchResultadoPostDesdeAPI(userData.correoElectronico);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("resultadosData");
    navigate("/"); // Cambiado para redirigir a la ruta raíz
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <div className="header ">
        <div className="logo header-ver-resultados">
          El Comit<span>é</span>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>

      <MigaDePan />

      <button
        className="toggle-sidebar-btn"
        onClick={handleToggleSidebar}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      <div className={`sidebar ${sidebarVisible ? "visible" : "hidden"}`}>
        <button
          className="close-sidebar-btn"
          onClick={handleCloseSidebar}
          aria-label="Cerrar menú"
        >
          ×
        </button>
        <div className="sidebar-superior">
          <div>
            <span className="blanco">El comit</span>
            <span className="verde">é</span>
          </div>
          <h2>Menú Principal</h2>
          <ul>
            <li>
              <a href="#" onClick={() => setTipoVista("pre")}>📋 Pre-evento</a>
            </li>
            <li>
              <a href="#" onClick={handlePostClick}>📊 Post-evento</a>
            </li>
          </ul>
        </div>

        <div className="sidebar2-inferior">
          <ul>
            <li>
              {/* Cambiado para usar handleLogout que redirige a la ruta raíz */}
              <a href="#" onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}>🚪 Salir</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`contenido-principal ${sidebarVisible ? "sidebar-visible" : "sidebar-hidden"}`}>
        <div className="cuadro-porcentajes">
          <h1 className="title-resultados">Resultados de:</h1>
          <h1 className="title-resultados">{userData.nombreCompleto}</h1>

          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Cargando resultados post...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
            </div>
          )}

          {resultadoActivo && resultadoActivo.resultado ? (
            <>
              <div className="resultado-info">
                <p className="resultado-fecha">
                  Fecha: {resultadoActivo.resultado.resumen?.fecha || "No disponible"}
                </p>
                <p className="resultado-total">Puntuación total:</p>
              </div>

              <div className="average-container">
                <CircularProgress value={promedio} size={120} strokeWidth={8} />
                <div className="tipo-evento-badge">
                  {tipoVista === "pre" ? "PRE-EVENTO" : "POST-EVENTO"}
                </div>
              </div>

              <div className="skills-grid">
                <SkillCard title="Liderazgo" value={skills.liderazgo} />
                <SkillCard title="Trabajo en equipo" value={skills.trabajoEquipo} />
                <SkillCard title="Obtención de logros" value={skills.obtencionLogros} />
                <SkillCard title="Resiliencia" value={skills.resiliencia} />
              </div>

              {resultadoActivo.resultado.recomendaciones && (
                <div className="recomendaciones-container">
                  <h3>Recomendaciones</h3>
                  {resultadoActivo.resultado.recomendaciones.map((rec, index) => (
                    <p key={index}>{rec}</p>
                  ))}
                </div>
              )}
            </>
          ) : tipoVista === "post" ? (
            <div className="no-results-message">
              <p>No se encontraron resultados post-evento</p>
              <button 
                className="btn-intentar-nuevamente"
                onClick={() => fetchResultadoPostDesdeAPI(userData.correoElectronico)}
              >
                Intentar nuevamente
              </button>
            </div>
          ) : (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando resultados pre-evento...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
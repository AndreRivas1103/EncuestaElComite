import { useState } from "react";
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
    </div>
  );
}

export default function VerResultados() {
  const [skills, setSkills] = useState({
    liderazgo: 7,
    obtencionLogros: 8,
    trabajoEquipo: 6,
    resiliencia: 7,
  });

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const promedio = Math.round(
    Object.values(skills).reduce((a, b) => a + b, 0) /
      Object.values(skills).length
  );

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
        onClick={() => setSidebarVisible(!sidebarVisible)}
      >
        ☰
      </button>

      <div className={`sidebar ${sidebarVisible ? "visible" : "hidden"}`}>
        <button
          className="close-sidebar-btn"
          onClick={() => setSidebarVisible(false)}
        >
          ×
        </button>
        <div className="sidebar-superior">
          <div>
            <span className="blanco">El comit</span>
            <span className="verde">é</span>
          </div>
          <br />
          <h2>Menú</h2>
          <br></br>
          <ul>
            <li>
              <a href="#">Pre-evento</a>
            </li>
            <li>
              <a href="#">Post-evento</a>
            </li>
          </ul>
        </div>

        <div className="sidebar-inferior">
          <ul>
            <li>
              <a href="#">Cerrar sesión</a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`contenido-principal ${
          sidebarVisible ? "sidebar-visible" : "sidebar-hidden"
        }`}
      >
        <Link to="/visualizar-resultados" className="btn-back">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
        <div className="cuadro-porcentajes">
          <h1 className="title-resultados">Promedio de habilidades</h1>

          <div className="average-container">
            <CircularProgress value={promedio} size={80} strokeWidth={8} />
          </div>
          <br></br>
          <br></br>
          <div className="skills-grid">
            <SkillCard title="Liderazgo" value={skills.liderazgo} />
            <SkillCard title="Trabajo en equipo" value={skills.trabajoEquipo} />
            <SkillCard
              title="Obtención de logros"
              value={skills.obtencionLogros}
            />
            <SkillCard title="Resiliencia" value={skills.resiliencia} />
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Home.css';
import '../pages/styles/PreviewEncuesta.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';

const PreviewEncuesta = ({ categoriasConPreguntas, onVolverEdicion, onPublicar }) => {
  const navigate = useNavigate();

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
      <title>Previsualizar Encuesta</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>

      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador' className="logo">El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>

      <div className='firtsColor'>
        <div className="preview-container">
          <h1 className='preview-title'>Previsualización de Encuesta</h1>
          
          {categoriasConPreguntas.map((categoria, index) => (
            <div key={index} className="categoria-seccion">
              <h2 className="titulo-categoria">{categoria.nombre}</h2>
              
              {categoria.preguntas.map((pregunta, pIndex) => (
                <div key={pIndex} className="pregunta-item">
                  <h3 className="texto-pregunta">{pregunta.texto || "Pregunta sin texto"}</h3>
                  
                  <div className="opciones-respuesta">
                    {pregunta.tipoRespuesta === 'multiple' && pregunta.opciones.map((opcion, oIndex) => (
                      opcion && (
                        <label key={oIndex} className="opcion">
                          <input
                            type="radio"
                            name={`pregunta-${index}-${pIndex}`}
                            disabled
                          />
                          <span className="checkmark"></span>
                          {['A', 'B', 'C', 'D'][oIndex]}) {opcion}
                        </label>
                      )
                    ))}
                    {pregunta.tipoRespuesta === 'abierta' && (
                      <input
                        type="text"
                        placeholder="Respuesta abierta"
                        className="respuesta-abierta"
                        disabled
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="preview-actions">
            <button onClick={onVolverEdicion} className="btn-editar">
              Volver a Editar
            </button>
            <button onClick={onPublicar} className="btn-publicar">
              Publicar Encuesta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewEncuesta;
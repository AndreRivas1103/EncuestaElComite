import React from 'react';
import '../pages/styles/TyC.css'; // Importamos el CSS correspondiente
import babyLogo from '../assets/LogoMarcaPersonal.png'; // Asegúrate de que la ruta sea correcta
import { Link, useNavigate } from 'react-router-dom';
import MigaDePan from '../components/MigaDePan.jsx';

const TerminosCondiciones = () => {
  const navigate = useNavigate();

  const handleAceptar = () => {
    // Guardar en localStorage que los términos fueron aceptados
    localStorage.setItem('terminosAceptados', 'true');
    localStorage.setItem('fechaAceptacionTerminos', new Date().toISOString());
    
    // Mostrar mensaje de confirmación
    alert('Términos y condiciones aceptados correctamente');
    
    // Redirigir al formulario de datos
    navigate('/rellenar-datos');
  };

  const handleCancelar = () => {
    // Limpiar cualquier aceptación previa
    localStorage.removeItem('terminosAceptados');
    localStorage.removeItem('fechaAceptacionTerminos');
    
    // Redirigir a la página principal
    navigate('/');
  };

  return (
    <div className="terminos-page-container">
      <title>Terminos y Condiciones</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Logo" className="header-logo"></img>
      </div>

      <MigaDePan />

      <div className="terminos-container">
        <Link to="/realizar-encuesta" className="btn-back">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>

        <div className="terminos-content">
          <h1>Terminos y condiciones</h1>
          
          <div className="terminos-text">
            <p>
              En virtud de la Ley 1581 de 2012 y del Decreto 1377 de 2013, declaro de manera libre,
              expresa, inequívoca e informada, que autorizo a EL COMITÉ DE REHABILITACIÓN
              DE ANTIOQUIA, para que realice la recolección, almacenamiento, uso,
              transferencia, circulación, supresión, y, en general, tratamiento de mis datos
              personales, incluyendo datos sensibles, y los que puedan llegar a ser considerados
              como tal de conformidad con la Ley, para que dicho Tratamiento se realice con el
              fin de brindarme información de interés acorde con el objeto de EL COMITÉ DE
              REHABILITACIÓN DE ANTIOQUIA.
            </p>
            <p>
              Declaro que se me ha informado de manera clara y comprensible que tengo
              derecho a conocer, actualizar y rectificar mis datos personales, a presentar
              quejas ante la Superintendencia de Industria y Comercio por el uso indebido de
              mis datos personales, a revocar esta autorización o solicitar la supresión de los
              datos personales suministrados y a acceder de forma gratuita a los mismos.
            </p>
            <p>
              Declaro que me han informado sobre la Política para el Tratamiento de Datos
              Personales, la cual se encuentra disponible en www.elcomite.org.co, y que la
              información por mí proporcionada es veraz, completa, exacta, actualizada y
              verificable. Mediante la firma del presente documento, manifiesto que reconozco
              y acepto que cualquier consulta o reclamación relacionada con el Tratamiento de
              mis datos personales podrá ser elevada verbalmente o por escrito ante EL
              COMITÉ DE REHABILITACIÓN DE ANTIOQUIA, como Responsable del Tratamiento,
              cuya página web es www.elcomite.org.co y su teléfono de atención es 3220160.
            </p>
          </div>

          <div className="buttons-container">
            <button onClick={handleAceptar} className="btn-aceptar">Aceptar</button>
            <button onClick={handleCancelar} className="btn-cancelar">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminosCondiciones;
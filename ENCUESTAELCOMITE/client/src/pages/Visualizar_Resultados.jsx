import React, { useState } from 'react';
import '../pages/styles/VisualizarResultados.css'; // Importaremos el CSS correspondiente  
import babyLogo from '../assets/LogoMarcaPersonal.png'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom';
import MigaDePan from '../components/MigaDePan.jsx';

const ConsultaResultados = () => {
  // Estado para manejar los valores del formulario
  const [formData, setFormData] = useState({
    correoElectronico: '',
    numeroDocumento: '',
    codigo: '',
    nombreCompleto: ''
  });

  // Estado para validaciones
  const [errors, setErrors] = useState({});

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validar formulario antes de enviar
  const validateForm = () => {
    let tempErrors = {};
    let formIsValid = true;

    if (!formData.correoElectronico) {
      formIsValid = false;
      tempErrors["correoElectronico"] = "Por favor ingrese su correo electrónico";
    } else if (!/\S+@\S+\.\S+/.test(formData.correoElectronico)) {
      formIsValid = false;
      tempErrors["correoElectronico"] = "Por favor ingrese un correo electrónico válido";
    }

    if (!formData.numeroDocumento) {
      formIsValid = false;
      tempErrors["numeroDocumento"] = "Por favor ingrese su número de documento";
    }

    if (!formData.codigo) {
      formIsValid = false;
      tempErrors["codigo"] = "Por favor ingrese el código";
    }

    if (!formData.nombreCompleto) {
      formIsValid = false;
      tempErrors["nombreCompleto"] = "Por favor ingrese su nombre completo";
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Aquí puedes enviar los datos a tu backend para consultar resultados
      console.log("Formulario enviado", formData);
      // Redirigir a la página de resultados o procesar la consulta
    }
  };

  return (
    <div className="consulta-page-contenedor">
      <title>Rellenar Datos</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <div className="header">
        <a href="/"className="logo">El Comit<span>é</span></a>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>
      
      {/* Migas de Pan */}
      <MigaDePan />

      <div className="consulta-contenedor">
        
        <h1 className="encuesta-title">Visualizar Resultados</h1>
       
        <div className="consulta-contenido">
          <Link to="/" className="btn-back">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </Link>
          <div className="consulta-form-container">
            
            
            <form onSubmit={handleSubmit}>
              <div className="instructions-container">
                <p className="instructions-text">
                  Recuerde que para realizar la consulta de tus resultados debes ingresar tu número de documento y el código único que se te entrega al finalizar la encuesta.
                </p>
              </div>
              <div className="form-group-rellenar">
                <label htmlFor="correoElectronico">Correo Electrónico<span className="required">*</span></label>
                <input
                  type="email"
                  id="correoElectronico"
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  className={errors.correoElectronico ? "form-input error" : "form-input"}
                />
                {errors.correoElectronico && <small className="error-text">{errors.correoElectronico}</small>}
              </div>

              <div className="form-group-rellenar">
                <label htmlFor="numeroDocumento">Número de documento</label>
                <input
                  type="text"
                  id="numeroDocumento"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  className={errors.numeroDocumento ? "form-input error" : "form-input"}
                />
                {errors.numeroDocumento && <small className="error-text">{errors.numeroDocumento}</small>}
              </div>

              <div className="form-group-rellenar">
                <label htmlFor="codigo">Código<span className="required">*</span></label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  className={errors.codigo ? "form-input error" : "form-input"}
                />
                {errors.codigo && <small className="error-text">{errors.codigo}</small>}
              </div>

              <div className="form-group-rellenar">
                <label htmlFor="nombreCompleto">Nombre completo</label>
                <input
                  type="text"
                  id="nombreCompleto"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  className={errors.nombreCompleto ? "form-input error" : "form-input"}
                />
                {errors.nombreCompleto && <small className="error-text">{errors.nombreCompleto}</small>}
              </div>



              <Link to="/ver-resultados"type="submit" className="btn-ver-resultados">Ver resultados</Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultaResultados;
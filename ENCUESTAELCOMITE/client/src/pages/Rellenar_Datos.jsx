import React, { useState } from 'react';
import '../pages/styles/RellenarDatos.css'; // Importaremos el CSS correspondiente
import babyLogo from '../assets/LogoMarcaPersonal.png'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom';

const FormularioRegistro = () => {
  // Estado para manejar los valores del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    numeroIdentificacion: '',
    correoElectronico: '',
    confirmacionCorreo: '',
    aceptaTerminos: false
  });

  // Estado para validaciones
  const [errors, setErrors] = useState({});

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Validar formulario antes de enviar
  const validateForm = () => {
    let tempErrors = {};
    let formIsValid = true;

    if (!formData.nombreCompleto) {
      formIsValid = false;
      tempErrors["nombreCompleto"] = "Por favor ingrese su nombre completo";
    }

    if (!formData.numeroIdentificacion) {
      formIsValid = false;
      tempErrors["numeroIdentificacion"] = "Por favor ingrese su número de identificación";
    }

    if (!formData.correoElectronico) {
      formIsValid = false;
      tempErrors["correoElectronico"] = "Por favor ingrese su correo electrónico";
    } else if (!/\S+@\S+\.\S+/.test(formData.correoElectronico)) {
      formIsValid = false;
      tempErrors["correoElectronico"] = "Por favor ingrese un correo electrónico válido";
    }

    if (formData.correoElectronico !== formData.confirmacionCorreo) {
      formIsValid = false;
      tempErrors["confirmacionCorreo"] = "Los correos electrónicos no coinciden";
    }

    if (!formData.aceptaTerminos) {
      formIsValid = false;
      tempErrors["aceptaTerminos"] = "Debe aceptar los términos y condiciones";
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Aquí puedes enviar los datos a tu backend o realizar la acción necesaria
      console.log("Formulario enviado", formData);
      // Redirigir o mostrar mensaje de éxito
    }
  };

  return (
    <div className="registro-page-container">
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>

      <div className="form-container">
        <Link to="/realizar-encuesta" className="btn-back">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>

        <div className="form-content">

        <div className='main-content'>
          <div className="registro-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <h1 className="encuesta-title">Rellena Datos</h1>
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

              <div className="form-group">
                <label htmlFor="numeroIdentificacion">Número de identificación</label>
                <input
                  type="text"
                  id="numeroIdentificacion"
                  name="numeroIdentificacion"
                  value={formData.numeroIdentificacion}
                  onChange={handleChange}
                  className={errors.numeroIdentificacion ? "form-input error" : "form-input"}
                />
                {errors.numeroIdentificacion && <small className="error-text">{errors.numeroIdentificacion}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="correoElectronico">Correo Electrónico</label>
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

              <div className="form-group">
                <label htmlFor="confirmacionCorreo">Confirmación de Correo Electrónico</label>
                <input
                  type="email"
                  id="confirmacionCorreo"
                  name="confirmacionCorreo"
                  value={formData.confirmacionCorreo}
                  onChange={handleChange}
                  className={errors.confirmacionCorreo ? "form-input error" : "form-input"}
                />
                {errors.confirmacionCorreo && <small className="error-text">{errors.confirmacionCorreo}</small>}
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="aceptaTerminos"
                  name="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <label htmlFor="aceptaTerminos" className="checkbox-label">
                  <Link to="/terminos-y-condiciones" className="terms-text">Términos y Condiciones</Link>
                </label>
                {errors.aceptaTerminos && <small className="error-text">{errors.aceptaTerminos}</small>}
              </div>
              <button type="submit" className="btn-siguiente">Siguiente</button>
            </form>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioRegistro;
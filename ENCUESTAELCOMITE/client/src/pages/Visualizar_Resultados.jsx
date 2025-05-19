import React, { useState } from 'react';
import '../pages/styles/VisualizarResultados.css'; // Importaremos el CSS correspondiente  
import babyLogo from '../assets/LogoMarcaPersonal.png'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom';

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
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>

      <div className="consulta-contenedor">
        <div className="consulta-contenido">
          <div className="consulta-form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group-rellenar">
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

              <div className="form-group-rellenar">
                <label htmlFor="numeroDocumento">Número de documento<span className="required">*</span></label>
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

              <div className="instructions-container">
                <p className="instructions-text">
                  Recuerde que para realizar la consulta de tus resultados debes ingresar tu número de documento y el código único que se te entrega al finalizar la encuesta.
                </p>
              </div>

              <button type="submit" className="btn-ver-resultados">Ver resultados</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultaResultados;
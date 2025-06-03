import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/styles/RellenarDatos.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import axios from 'axios';
import MigaDePan from '../components/MigaDePan.jsx';

const FormularioRegistro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    numeroIdentificacion: '',
    correoElectronico: '',
    confirmacionCorreo: '',
    aceptaTerminos: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [terminosAceptadosAutomaticamente, setTerminosAceptadosAutomaticamente] = useState(false);

  // Efecto para verificar términos aceptados previamente
  useEffect(() => {
    const terminosAceptados = localStorage.getItem('terminosAceptados');
    const fechaAceptacion = localStorage.getItem('fechaAceptacionTerminos');
    
    if (terminosAceptados === 'true' && fechaAceptacion) {
      const fechaAceptacionDate = new Date(fechaAceptacion);
      const ahora = new Date();
      const diferenciaHoras = (ahora - fechaAceptacionDate) / (1000 * 60 * 60);
      
      if (diferenciaHoras <= 24) {
        setFormData(prevData => ({
          ...prevData,
          aceptaTerminos: true
        }));
        setTerminosAceptadosAutomaticamente(true);
      } else {
        localStorage.removeItem('terminosAceptados');
        localStorage.removeItem('fechaAceptacionTerminos');
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (name === 'aceptaTerminos' && !checked) {
      setTerminosAceptadosAutomaticamente(false);
      localStorage.removeItem('terminosAceptados');
      localStorage.removeItem('fechaAceptacionTerminos');
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    let formIsValid = true;

    if (!formData.nombreCompleto.trim()) {
      tempErrors.nombreCompleto = "Por favor ingrese su nombre completo";
      formIsValid = false;
    }

    if (!formData.numeroIdentificacion.trim()) {
      tempErrors.numeroIdentificacion = "Por favor ingrese su número de identificación";
      formIsValid = false;
    }

    if (!formData.correoElectronico.trim()) {
      tempErrors.correoElectronico = "Por favor ingrese su correo electrónico";
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.correoElectronico)) {
      tempErrors.correoElectronico = "Formato de correo electrónico inválido";
      formIsValid = false;
    }

    if (formData.correoElectronico !== formData.confirmacionCorreo) {
      tempErrors.confirmacionCorreo = "Los correos electrónicos no coinciden";
      formIsValid = false;
    }

    if (!formData.aceptaTerminos) {
      tempErrors.aceptaTerminos = "Debe aceptar los términos y condiciones";
      formIsValid = false;
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Verificar credenciales con el backend
      const response = await axios.post(
        'http://localhost:3000/api/voluntarios/verificar-credenciales',
        {
          correo: formData.correoElectronico,
          identificacion: formData.numeroIdentificacion
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Si las credenciales son válidas
      const voluntario = response.data.data;
      
      setSuccessMessage('Credenciales verificadas! Redirigiendo...');

      // Guardar TODOS los datos en localStorage para uso futuro
      const datosCompletos = {
        nombreCompleto: formData.nombreCompleto,
        numeroIdentificacion: formData.numeroIdentificacion,
        correoElectronico: formData.correoElectronico,
        confirmacionCorreo: formData.confirmacionCorreo,
        datosBackend: {
          nombre: voluntario.nombre,
          identificacion: voluntario.identificacion,
          correo: voluntario.correo
        }
      };
      
      localStorage.setItem('datosVoluntario', JSON.stringify(datosCompletos));
      
      // Guardar también en sessionStorage para acceso inmediato
      sessionStorage.setItem('nombreVoluntario', formData.nombreCompleto);
      sessionStorage.setItem('idVoluntario', formData.numeroIdentificacion);
      sessionStorage.setItem('correoVoluntario', formData.correoElectronico);

      // Guardar términos si fueron aceptados
      if (formData.aceptaTerminos) {
        localStorage.setItem('terminosAceptados', 'true');
        localStorage.setItem('fechaAceptacionTerminos', new Date().toISOString());
      }

      // CAMBIO IMPORTANTE: Redirección a responder-encuesta-post
      setTimeout(() => {
        navigate(`/responder-encuesta-post?correo=${encodeURIComponent(formData.correoElectronico)}`);
      }, 1500);

    } catch (error) {
      let errorMessage = 'Error al verificar las credenciales';

      if (error.response) {
        errorMessage = error.response.data.details || error.response.data.error || errorMessage;
      } else if (error.request) {
        errorMessage = 'El servidor no respondió. Intente nuevamente';
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registro-page-container">
      <title>Rellenar Datos Post Evento</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      
      <div className="header">
        <div className="logo">El Comit<span>é</span></div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo"></img>
      </div>

      {/* Migas de Pan */}
      <MigaDePan />

      <div className="form-container">
        <Link to="/realizar-encuesta" className="btn-back">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>

        <div className="form-content">
          <div className="registro-form">
            <form onSubmit={handleSubmit}>
              <h1 className="encuesta-title">Rellena Datos PostEvento</h1>
              
              {terminosAceptadosAutomaticamente && (
                <div className="terminos-aceptados-mensaje">
                  ✅ Términos y condiciones aceptados
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="nombreCompleto">Nombre completo</label>
                <input
                  type="text"
                  id="nombreCompleto"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  className={errors.nombreCompleto ? "form-input error" : "form-input"}
                  placeholder="Ingresa tu nombre completo"
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
                  placeholder="Ingresa tu número de identificación"
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
                  placeholder="ejemplo@correo.com"
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
                  placeholder="Confirma tu correo electrónico"
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
                  className={`checkbox-input ${terminosAceptadosAutomaticamente ? 'auto-checked' : ''}`}
                />
                <label htmlFor="aceptaTerminos" className="checkbox-label">
                  <Link to="/terminos-y-condiciones" className="terms-text">
                    Acepto los Términos y Condiciones
                    {terminosAceptadosAutomaticamente && <span className="auto-check-indicator">✓</span>}
                  </Link>
                </label>
                {errors.aceptaTerminos && <small className="error-text">{errors.aceptaTerminos}</small>}
              </div>

              {errors.submit && (
                <div className="error-message-global">
                  ⚠️ {errors.submit}
                </div>
              )}

              {successMessage && (
                <div className="success-message-global">
                  ✅ {successMessage}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-siguiente"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                ) : 'Siguiente'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioRegistro;
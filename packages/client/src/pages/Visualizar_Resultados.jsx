import React, { useState } from 'react';
import '../pages/styles/VisualizarResultados.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link, useNavigate } from 'react-router-dom';
import MigaDePan from '../components/MigaDePan.jsx';
import axios from 'axios';

const ConsultaResultados = () => {
  const navigate = useNavigate();
  
  // Estado para manejar los valores del formulario
  const [formData, setFormData] = useState({
    correoElectronico: '',
    numeroDocumento: '',
    codigo: '',
    nombreCompleto: ''
  });

  // Estado para validaciones
  const [errors, setErrors] = useState({});
  
  // Estado para manejar la respuesta de la API
  const [apiResponse, setApiResponse] = useState({
    loading: false,
    error: null,
    success: false
  });

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setApiResponse({ loading: true, error: null, success: false });
    
    try {
      // Guardar datos del usuario en localStorage
      localStorage.setItem('userData', JSON.stringify(formData));
      
      // Hacer la petición al backend para verificar credenciales
      const response = await axios.post(
        'http://localhost:3000/api/resultados/credenciales', 
        {
          correo: formData.correoElectronico,
          contrasena: formData.codigo
        }
      );
      
      if (response.data.success && response.data.data.length > 0) {
        setApiResponse({ loading: false, error: null, success: true });
        
        // Guardar los resultados en localStorage
        localStorage.setItem('resultadosData', JSON.stringify(response.data.data));
        
        // Redirigir a la página de resultados después de 1 segundo
        setTimeout(() => {
          navigate('/ver-resultados');
        }, 1000);
      } else {
        setApiResponse({
          loading: false,
          error: 'Credenciales inválidas o no se encontraron resultados',
          success: false
        });
      }
    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      setApiResponse({
        loading: false,
        error: error.response?.data?.error || 'Error al conectar con el servidor',
        success: false
      });
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

              {/* Mensajes de respuesta de la API */}
              {apiResponse.loading && (
                <div className="api-response loading">
                  <p>Verificando credenciales...</p>
                </div>
              )}
              
              {apiResponse.error && (
                <div className="api-response error">
                  <p>{apiResponse.error}</p>
                </div>
              )}
              
              {apiResponse.success && (
                <div className="api-response success">
                  <p>¡Credenciales válidas! Redirigiendo a resultados...</p>
                </div>
              )}

              <button 
                type="submit" 
                className="btn-ver-resultados"
                disabled={apiResponse.loading}
              >
                {apiResponse.loading ? 'Verificando...' : 'Ver resultados'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultaResultados;
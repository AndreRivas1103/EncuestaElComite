import React from 'react';
import '../Pages/styles/Home.css';
import babyLogo from '../assets/LogoMarcaPersonal.png';
import { Link } from 'react-router-dom';

const TukiInicio = () => {
    return(
    <div>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'></meta>

      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      
        <div className='firtsColor'>
            
            <div>
            <h1 className='Texto'>Encuesta 001</h1>
            <br></br>
            </div>
            
            <div className="encuesta-container">
               <h1 className='historial'>
                Número de encuestados: 3
                </h1> 
                <br></br>
                
                {/* Primer caso */}
                <div className="caso-encuesta">
                    <h1 className='historial'>Persona: Samuel Gallego Meneses</h1>
                    <h1 className='historial'>Correo electrónico: Sgallego882@gmail.com</h1>
                    
                    <div className="resultados-container">
                        <h2 className="resultados-titulo">Resultados:</h2>
                        <div className="aspectos-container">
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Total:</span>
                                <span className="aspecto-valor">8/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Liderazgo:</span>
                                <span className="aspecto-valor">10/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Trabajo en Equipo:</span>
                                <span className="aspecto-valor">6/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Obtención de logros:</span>
                                <span className="aspecto-valor">6/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Resiliencia:</span>
                                <span className="aspecto-valor">10/10</span>
                            </div>
                        </div>
                    </div>
                    
                    <button className="boton-ver-encuesta">Ver Encuesta</button>
                </div>
                
                <br></br>
                
                {/* Segundo caso */}
                <div className="caso-encuesta">
                    <h1 className='historial'>Persona: Andre Rivas Castro</h1>
                    <h1 className='historial'>Correo electrónico: Arivas477@gmail.com</h1>
                    
                    <div className="resultados-container">
                        <h2 className="resultados-titulo">Resultados:</h2>
                        <div className="aspectos-container">
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Total:</span>
                                <span className="aspecto-valor">7/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Liderazgo:</span>
                                <span className="aspecto-valor">4/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Trabajo en Equipo:</span>
                                <span className="aspecto-valor">10/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Obtención de logros:</span>
                                <span className="aspecto-valor">8/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Resiliencia:</span>
                                <span className="aspecto-valor">6/10</span>
                            </div>
                        </div>
                    </div>
                    
                    <button className="boton-ver-encuesta">Ver Encuesta</button>
                </div>
                <br></br>
                
                {/* Tercer caso */}
                <div className="caso-encuesta">
                    <h1 className='historial'>Persona: Juliana Franco Alzate</h1>
                    <h1 className='historial'>Correo electrónico: Jfranco158@gmail.com</h1>
                    
                    <div className="resultados-container">
                        <h2 className="resultados-titulo">Resultados:</h2>
                        <div className="aspectos-container">
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Total:</span>
                                <span className="aspecto-valor">8.5/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Liderazgo:</span>
                                <span className="aspecto-valor">6/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Trabajo en Equipo:</span>
                                <span className="aspecto-valor">10/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Obtención de logros:</span>
                                <span className="aspecto-valor">8/10</span>
                            </div>
                            <div className="aspecto-item">
                                <span className="aspecto-nombre">Resiliencia:</span>
                                <span className="aspecto-valor">10/10</span>
                            </div>
                        </div>
                    </div>
                    
                    <button className="boton-ver-encuesta">Ver Encuesta</button>
                </div>

                {/* Botón Mostrar Encuesta (nuevo) */}
                <div className="boton-mostrar-container">
        <Link to="/encuestas" className="boton-ver-encuesta">Mostrar Encuesta</Link>
                </div>
            </div>
        </div>
    </div>)
}

export default TukiInicio;
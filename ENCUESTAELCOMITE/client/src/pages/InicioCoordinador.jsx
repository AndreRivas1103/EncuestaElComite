import React from 'react';

import '../pages/styles/InicioCoordinador.css';
import babylogo from '../assets/gobabygo.png';




const prueba1 = () => {
    return(
    <div>

        <meta name='viewport'content='width = device-width, initial-scale=1.0'></meta>


        <header className="header">
          <div className="logo">
            <a href='#'>El Comit<span>é</span></a>
          </div>
          <img src={babylogo} alt="Baby Go Logo" className="header-logo" />
        </header>
        <div className='firtsColor'>
            <div class="botones-izquierda">
                <button class="btn-pequeno">Regresar</button>
            </div>

            <div className='botones-derecha'>
                <button class="btn-pequeno">Salir</button>
            </div>

            
            
            <div>
            <img src={babylogo} alt='Baby go Logo' className='header-logo'></img>
            <br></br>


            </div>
            <div class="contenedor-botones">

        
            </div>
            <div className='contenedor-botones'>
            <button class="boton">Registro de encuestas</button>
            <button class="boton">Nuevo evento</button></div>
                
        </div>
    </div>)
}

export default prueba1;
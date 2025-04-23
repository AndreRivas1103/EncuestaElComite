import React from 'react';
import '../Pages/styles/Home.css';
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
            <div>
            <h1 className='title-coordinador'>Bienvenido Coordinador</h1>

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
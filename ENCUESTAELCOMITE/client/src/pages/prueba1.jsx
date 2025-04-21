import React from 'react';
import '../pages/styles/prueba1.css'; // Archivo CSS específico para este componente
import babylogo from '../assets/gobabygo.png';





const TukiInicio = () => {
    return(
    <div>

        <meta name='viewport'content='width = device-width, initial-scale=1.0'></meta>

      <header className="header">
        <div className="logo">
          <a href='/'>El Comit<span>é</span></a>
        </div>
        <img src={babylogo} alt="Baby Go Logo" className="header-logo" />
      </header>
      
        <div className='firtsColor'>
        <div class="botones-izquierda">
            <button class="btn-pequeno">Regresar</button>
            
            <button class="btn-pequeno">Inicio</button>
            
            <button class="btn-pequeno">Salir</button>
        </div>

            
            
            <div>
            <h1 className='Texto'>Encuesta XXXX</h1>
            <br></br>
            


            </div>
            
            <div>
               <h1 className='historial'>
                Número de encuestados: XX
                </h1> 
                <br></br>
                <h1 className='historial'>Persona: XX</h1>
                <h1 className='historial'>Número de identificación: 1111111111</h1>
                <br></br>
                <h1 className='historial'>Persona: XX</h1>
                
                <h1 className='historial'>Número de identificación: 222222222</h1>
            </div>
           
            
                
        </div>
    </div>)
}

export default TukiInicio;
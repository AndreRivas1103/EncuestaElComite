import React from 'react';
import '../Pages/styles/Home.css'; // Archivo CSS específico para este componente
import babyLogo from '../assets/LogoMarcaPersonal.png';





const TukiInicio = () => {
    return(
    <div>

        <meta name='viewport'content='width = device-width, initial-scale=1.0'></meta>

      <header className="header">
        <div className="logo">
          <a href='/inicio-coordinador'>El Comit<span>é</span></a>
        </div>
        <img src={babyLogo } alt="Baby Go Logo" className="header-logo" />
      </header>
      
        <div className='firtsColor'>

            
            
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
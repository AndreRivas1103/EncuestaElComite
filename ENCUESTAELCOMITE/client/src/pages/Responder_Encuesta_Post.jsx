// ./pages/Responder_Encuesta_Post.jsx
import React, { useState } from 'react';

const ResponderEncuestaPost = () => {
  const [respuestas, setRespuestas] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Respuestas:", respuestas);
    // Aquí iría la lógica para enviar las respuestas al backend
  };

  return (
    <div>
      <h1>Encuesta Post-Evento</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pregunta 1: ¿Cómo calificarías tu experiencia?</label>
          <input 
            type="text" 
            onChange={(e) => setRespuestas({...respuestas, pregunta1: e.target.value})}
          />
        </div>
        <button type="submit">Enviar respuestas</button>
      </form>
    </div>
  );
};

export default ResponderEncuestaPost;
import EvaluacionHabilidad from '../db/models/EvaluacionHabilidad.js';

export default {
  guardarEvaluacion: async (req, res) => {
    try {
      const evaluacion = await EvaluacionHabilidad.create(req.body);
      res.status(201).json(evaluacion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerEvaluacionesUsuario: async (req, res) => {
    try {
      const evaluaciones = await EvaluacionHabilidad.getByUserAndSurvey(
        req.params.correo, 
        req.params.id_encuesta
      );
      res.json(evaluaciones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
import Opcion from '../db/models/Opcion.js';

export default {
  crearOpcion: async (req, res) => {
    try {
      const opcion = await Opcion.create(req.body);
      res.status(201).json(opcion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerOpciones: async (req, res) => {
    try {
      const opciones = await Opcion.getByPregunta(req.params.id_pregunta);
      res.json(opciones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  eliminarOpcion: async (req, res) => {
    try {
      await Opcion.delete(req.params.id_opcion);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
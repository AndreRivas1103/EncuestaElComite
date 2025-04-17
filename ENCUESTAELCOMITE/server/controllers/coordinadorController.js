import Coordinador from '../db/models/Coordinador.js';

export default {
  registrarCoordinador: async (req, res) => {
    try {
      const coordinador = await Coordinador.create(req.body);
      res.status(201).json(coordinador);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerCoordinador: async (req, res) => {
    try {
      const coordinador = await Coordinador.getByCedula(req.params.cedula);
      if (!coordinador) {
        return res.status(404).json({ error: 'Coordinador no encontrado' });
      }
      res.json(coordinador);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listarCoordinadores: async (req, res) => {
    try {
      const coordinadores = await Coordinador.getAll();
      res.json(coordinadores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
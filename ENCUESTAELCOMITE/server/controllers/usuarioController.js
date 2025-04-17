import Usuario from '../db/models/Usuario.js';

export default {
  registrarUsuario: async (req, res) => {
    try {
      const usuario = await Usuario.create(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerUsuario: async (req, res) => {
    try {
      const usuario = await Usuario.getByEmail(req.params.correo);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

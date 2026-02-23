import Coordinador from '../models/Coordinador.js';

export const verificarCorreo = async (req, res) => {
  const { correo } = req.body;
  try {
    const usuario = await Coordinador.findOne({ 
      where: { correo },
      attributes: ['cedula', 'nombre', 'correo'] // Selecciona los campos necesarios
    });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Correo no registrado' });
    }
    
    res.json({ 
      success: true,
      nombre: usuario.nombre,
      cedula: usuario.cedula, // Enviamos la cédula como ID
      correo: usuario.correo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
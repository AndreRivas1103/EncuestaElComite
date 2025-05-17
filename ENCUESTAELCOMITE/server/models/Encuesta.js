import pool from '../db/connection.js';

export default {
  async create({ 
    titulo = 'Encuesta de Habilidades Blandas',
    fecha_creacion,
    fecha_apertura,
    fecha_cierre,
    usuario_id,
    estado = 'programada',
    datos_encuesta // JSON con categorías y preguntas
  }) {
    const query = `
      INSERT INTO encuesta(
        titulo, 
        fecha_creacion, 
        fecha_apertura, 
        fecha_cierre, 
        usuario_id, 
        estado,
        datos_encuesta
      ) VALUES($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;
    
    const { rows } = await pool.query(query, [
      titulo,
      fecha_creacion || new Date().toISOString(),
      fecha_apertura,
      fecha_cierre,
      usuario_id,
      estado,
      JSON.stringify(datos_encuesta)
    ]);
    return rows[0];
  },
  async getById(id_encuesta) {
    const { rows } = await pool.query('SELECT * FROM encuesta WHERE id_encuesta = $1', [id_encuesta]);
    return rows[0];
  },

  async getAll() {
    const { rows } = await pool.query('SELECT * FROM encuesta');
    return rows;
  }
};


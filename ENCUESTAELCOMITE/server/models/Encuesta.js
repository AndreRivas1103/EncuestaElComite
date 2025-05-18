import pool from '../db/connection.js';

export default {
  async create(encuestaData) {
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
      encuestaData.titulo,
      encuestaData.fecha_creacion,
      encuestaData.fecha_apertura,
      encuestaData.fecha_cierre,
      encuestaData.usuario_id,
      encuestaData.estado,
      JSON.stringify(encuestaData.datos_encuesta)
    ]);
    return rows[0];
  },

  async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM encuesta ORDER BY fecha_creacion DESC'
    );
    return rows;
  },

  async update(id_encuesta, updateData) {
    const query = `
      UPDATE encuesta 
      SET 
        fecha_apertura = $1,
        fecha_cierre = $2,
        estado = $3
      WHERE id_encuesta = $4
      RETURNING *`;
    
    const { rows } = await pool.query(query, [
      updateData.fecha_apertura,
      updateData.fecha_cierre,
      updateData.estado,
      id_encuesta
    ]);
    return rows[0];
  }
};
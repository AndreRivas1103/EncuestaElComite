import pool from '../connection.js';

export default {
  async create({ correo, id_pregunta, respuesta_texto, id_encuesta }) {
    const query = `
      INSERT INTO responseta(correo, id_pregunta, respuesta_texto, id_encuesta) 
      VALUES($1, $2, $3, $4) RETURNING *
    `;
    const { rows } = await pool.query(query, [correo, id_pregunta, respuesta_texto, id_encuesta]);
    return rows[0];
  },

  async getByEncuesta(id_encuesta) {
    const { rows } = await pool.query('SELECT * FROM responseta WHERE id_encuesta = $1', [id_encuesta]);
    return rows;
  }
};
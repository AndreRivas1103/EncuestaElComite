import pool from '../connection.js';

export default {
  async create({ id_pregunta, texto_opcion }) {
    const query = `
      INSERT INTO opcion(id_pregunta, texto_opcion)
      VALUES($1, $2) RETURNING *
    `;
    const { rows } = await pool.query(query, [id_pregunta, texto_opcion]);
    return rows[0];
  },

  async getByPregunta(id_pregunta) {
    const { rows } = await pool.query(
      'SELECT * FROM opcion WHERE id_pregunta = $1',
      [id_pregunta]
    );
    return rows;
  },

  async delete(id_opcion) {
    await pool.query('DELETE FROM opcion WHERE id_opcion = $1', [id_opcion]);
    return true;
  }
};
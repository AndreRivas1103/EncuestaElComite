import pool from '../connection.js';

export default {
  async create({ nombre }) {
    const query = `
      INSERT INTO habilidad(nombre)
      VALUES($1) RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre]);
    return rows[0];
  },

  async getById(id_habilidad) {
    const { rows } = await pool.query(
      'SELECT * FROM habilidad WHERE id_habilidad = $1',
      [id_habilidad]
    );
    return rows[0];
  },

  async getAll() {
    const { rows } = await pool.query('SELECT * FROM habilidad');
    return rows;
  }
};
import pool from '../connection.js';

export default {
  async create({ nombre, fecha, version }) {
    const query = 'INSERT INTO encuesta(nombre, fecha, version) VALUES($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [nombre, fecha, version]);
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


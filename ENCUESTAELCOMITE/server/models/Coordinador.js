import pool from '../connection.js';

export default {
  async create({ cedula, nombre, correo }) {
    const query = `
      INSERT INTO coordinador(cedula, nombre, correo)
      VALUES($1, $2, $3) RETURNING *
    `;
    const { rows } = await pool.query(query, [cedula, nombre, correo]);
    return rows[0];
  },

  async getByCedula(cedula) {
    const { rows } = await pool.query(
      'SELECT * FROM coordinador WHERE cedula = $1',
      [cedula]
    );
    return rows[0];
  },

  async getAll() {
    const { rows } = await pool.query('SELECT * FROM coordinador');
    return rows;
  }
};
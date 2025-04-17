import pool from '../connection.js';

export default {
  async create({ correo, nombre_completo, identificacion, codigo_unico, acepto_terminos }) {
    const query = `
      INSERT INTO usuario(correo, nombre_completo, identificacion, codigo_unico, acepto_terminos) 
      VALUES($1, $2, $3, $4, $5) RETURNING *
    `;
    const { rows } = await pool.query(query, [correo, nombre_completo, identificacion, codigo_unico, acepto_terminos]);
    return rows[0];
  },

  async getByEmail(correo) {
    const { rows } = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);
    return rows[0];
  }
};
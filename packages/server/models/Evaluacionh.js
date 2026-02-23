import pool from '../connection.js';

export default {
  async create({ correo, id_encuesta, id_habilidad, puntaje }) {
    const query = `
      INSERT INTO evaluacion_habilidad(correo, id_encuesta, id_habilidad, puntaje) 
      VALUES($1, $2, $3, $4) RETURNING *
    `;
    const { rows } = await pool.query(query, [correo, id_encuesta, id_habilidad, puntaje]);
    return rows[0];
  },

  async getByUserAndSurvey(correo, id_encuesta) {
    const { rows } = await pool.query(
      'SELECT * FROM evaluacion_habilidad WHERE correo = $1 AND id_encuesta = $2',
      [correo, id_encuesta]
    );
    return rows;
  }
};
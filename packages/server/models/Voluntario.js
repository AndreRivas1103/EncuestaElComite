import sequelize from '../db/connection.js';

function rowToVoluntario(row) {
  if (!row) return null;
  return {
    correo_electronico: row.correo,
    nombre_completo: row.nombre_completo,
    numero_identificacion: row.identificacion,
    codigo_unico: row.codigo_unico
  };
}

const Voluntario = {
  async findByEmail(email) {
    const [rows] = await sequelize.query(
      `SELECT correo, nombre_completo, identificacion, codigo_unico FROM usuario WHERE correo = :correo`,
      { replacements: { correo: email } }
    );
    return rowToVoluntario(rows?.[0]);
  },

  async findOne({ where }) {
    const [rows] = await sequelize.query(
      `
      SELECT correo, nombre_completo, identificacion, codigo_unico
      FROM usuario
      WHERE correo = :correo AND identificacion = :identificacion
      `,
      { replacements: { correo: where.correo_electronico, identificacion: where.numero_identificacion } }
    );
    return rowToVoluntario(rows?.[0]);
  },

  async findByPk(correo) {
    return this.findByEmail(correo);
  },

  async createWithValidation(data) {
    const correo = data.correo_electronico;
    const nombre = data.nombre_completo;
    const identificacion = data.numero_identificacion;
    await sequelize.query(
      `
      INSERT INTO usuario (correo, nombre_completo, identificacion, acepto_terminos)
      VALUES (:correo, :nombre, :identificacion, true)
      `,
      { replacements: { correo, nombre, identificacion } }
    );
    return this.findByEmail(correo);
  },

  async updateAdditionalData(correo, _data) {
    const [result] = await sequelize.query(
      `UPDATE usuario SET correo = correo WHERE correo = :correo RETURNING correo`,
      { replacements: { correo } }
    );
    return [result?.length || 0];
  },

  async actualizarPreEventoDesdeFuncion({ correo, contraseña }) {
    await sequelize.query(
      `UPDATE usuario SET codigo_unico = :codigo WHERE correo = :correo`,
      { replacements: { correo, codigo: contraseña } }
    );
    return true;
  },

  async actualizarPostEventoSimple(correo) {
    const [rows] = await sequelize.query(
      `SELECT correo FROM usuario WHERE correo = :correo`,
      { replacements: { correo } }
    );
    return rows?.[0] || null;
  }
};

export default Voluntario;

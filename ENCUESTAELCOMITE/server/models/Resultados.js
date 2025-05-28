import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Resultado = sequelize.define('Resultado', {
  id_encuesta: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  correo_voluntario: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  contraseña: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  resultado: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('pre', 'post'),
    allowNull: false
  }
}, {
  tableName: 'resultados',
  timestamps: false
});

// Métodos personalizados
Resultado.insertarResultadoCalculado = async function(id_encuesta, correo_voluntario, contrasena, resultado) {
  const query = `
    SELECT insertar_resultado_calculado(
      '${id_encuesta}',
      '${correo_voluntario}',
      '${contrasena}',
      '${JSON.stringify(resultado)}'::jsonb
    )
  `;
  
  await sequelize.query(query);
};

export default Resultado;
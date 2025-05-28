import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Resultado = sequelize.define('Resultado', {
  id_encuesta: {
    type: DataTypes.STRING(50),  // VARCHAR(50)
    primaryKey: true,
    allowNull: false
  },
  correo_voluntario: {
    type: DataTypes.STRING(255), // VARCHAR(255)
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'voluntarios',
      key: 'correo_electronico'
    }
  },
  contraseña: {
    type: DataTypes.STRING(255), // VARCHAR(255)
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
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['id_encuesta', 'correo_voluntario', 'contraseña']
    }
  ]
});

// Métodos personalizados
Resultado.insertarResultadoCalculado = async function(id_encuesta, correo_voluntario, contrasena, resultado) {
  const query = `
    SELECT insertar_resultado_calculado(
      :id_encuesta,
      :correo_voluntario,
      :contrasena,
      :resultado::jsonb
    )
  `;
  
  await sequelize.query(query, {
    replacements: {
      id_encuesta,
      correo_voluntario,
      contrasena,
      resultado: JSON.stringify(resultado)
    }
  });
};

// Nuevo método para buscar por correo y contraseña
Resultado.findByEmailAndPassword = async function(correo, contrasena) {
  return await this.findAll({
    where: {
      correo_voluntario: correo,
      contraseña: contrasena
    }
  });
};

export default Resultado;
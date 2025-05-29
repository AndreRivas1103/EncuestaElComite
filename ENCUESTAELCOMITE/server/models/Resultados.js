import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Resultado = sequelize.define('Resultado', {
  id_encuesta: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true
  },
  correo_voluntario: {
    type: DataTypes.STRING(255),
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'voluntarios',
      key: 'correo_electronico'
    }
  },
  tipo: {
    type: DataTypes.ENUM('pre', 'post'),
    allowNull: false,
    primaryKey: true
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false,
    primaryKey: true
  },
  resultado: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'resultados',
  timestamps: false
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

Resultado.findByEmailAndPassword = async function(correo, contrasena) {
  return await this.findAll({
    where: {
      correo_voluntario: correo,
      contraseña: contrasena
    }
  });
};

// Método modificado: ahora solo requiere el correo
Resultado.findPostByEmail = async function(correo) {
  return await this.findAll({
    where: {
      correo_voluntario: correo,
      tipo: 'post'
    }
  });
};

export default Resultado;
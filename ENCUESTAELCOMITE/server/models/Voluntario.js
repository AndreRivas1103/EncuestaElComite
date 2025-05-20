import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Voluntario = sequelize.define('Voluntario', {
  correo_electronico: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  nombre_completo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  },
  numero_identificacion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  encuesta_pre: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  encuesta_post: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  id_encuesta: {
    type: DataTypes.STRING(50),
    allowNull: true,
    references: {
      model: 'encuestas',
      key: 'id'
    }
  }
}, {
  // Configuraciones al modelo voluntarios
  tableName: 'voluntarios',          // Nombre exacto de la tabla en la BD
  freezeTableName: true,             // Evita pluralización
  timestamps: false,                 // Sin marcas de tiempo
  underscored: true,                 // Notación snake_case
  paranoid: false                    // Sin borrado lógico
});

Voluntario.findByEmail = async (email) => {
  return await Voluntario.findOne({ 
    where: { correo_electronico: email },
    attributes: ['correo_electronico', 'nombre_completo', 'numero_identificacion']
  });
};

//Relación con Encuestas (acceder a los datos relacionados)
Voluntario.associate = (models) => {
  Voluntario.belongsTo(models.Encuesta, {
    foreignKey: 'id_encuesta',
    as: 'encuesta_relacionada'
  });
};

export default Voluntario;
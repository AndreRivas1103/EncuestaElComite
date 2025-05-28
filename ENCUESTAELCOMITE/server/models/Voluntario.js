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
  },
  Contraseña: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'Contraseña', // ✔ permite null
    validate: {
      len: [3, 255]  // ✔ solo se valida si hay valor
    }
  }
}, {
  tableName: 'voluntarios',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
  paranoid: false
});

// Método para encontrar por email
Voluntario.findByEmail = async (email) => {
  return await Voluntario.findOne({ 
    where: { correo_electronico: email },
    attributes: ['correo_electronico', 'nombre_completo', 'numero_identificacion']
  });
};

// Método personalizado para crear con validación
Voluntario.createWithValidation = async (data) => {
  try {
    const voluntario = await Voluntario.build(data);
    await voluntario.validate(); // Ejecuta validaciones definidas en el modelo
    return await voluntario.save(); // Si todo está bien, guarda en BD
  } catch (error) {
    throw error; // Lanza el error para que lo maneje quien llama
  }
};

// Relación con modelo Encuesta
Voluntario.associate = (models) => {
  Voluntario.belongsTo(models.Encuesta, {
    foreignKey: 'id_encuesta',
    as: 'encuesta_relacionada'
  });
};

Voluntario.actualizarPreEventoDesdeFuncion = async ({ correo, encuesta_pre, id_encuesta, contrasena }) => {
  try {
    return await sequelize.query(
      'SELECT actualizar_voluntario_pre(:correo, :encuesta_pre, :id_encuesta, :contrasena)',
      {
        replacements: {
          correo,
          encuesta_pre,
          id_encuesta,
          contrasena
        },
        type: sequelize.QueryTypes.SELECT
      }
    );
  } catch (error) {
    throw new Error(`Error al ejecutar la función SQL: ${error.message}`);
  }
};

export default Voluntario;

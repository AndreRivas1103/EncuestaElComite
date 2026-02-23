import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Coordinador = sequelize.define('Coordinador', {
  cedula: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  }
}, {
  // 🔥 Solución definitiva para el error de la tabla
  tableName: 'coordinador',          // Nombre exacto de la tabla en NeonDB (en minúsculas)
  freezeTableName: true,             // Evita que Sequelize pluralice el nombre
  timestamps: false,                 // Si no usas created_at/updated_at
  underscored: true,                 // Opcional: usa snake_case en la BD
  paranoid: false                    // Si no usas borrado lógico
});

// Método personalizado para buscar por correo
Coordinador.findByEmail = async (email) => {
  return await Coordinador.findOne({ 
    where: { correo: email },
    attributes: ['cedula', 'nombre', 'correo']  // Campos a retornar
  });
};

export default Coordinador;
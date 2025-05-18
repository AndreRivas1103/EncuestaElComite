import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Encuesta = sequelize.define('Encuesta', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => `HB-${new Date().getFullYear()}-${Math.floor(Math.random() * 90) + 10}`
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Encuesta de Habilidades Blandas'
  },
  fecha_creacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_apertura: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  fecha_cierre: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  usuario_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['borrador', 'programada', 'publicada', 'cerrada']]
    }
  },
  datos_encuesta: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  respuestas_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
}, {
  tableName: 'encuestas',
  freezeTableName: true,
  timestamps: false,
  hooks: {
    beforeSave: (encuesta) => {
      // Elimina el campo estado en cualquier operación
      if (encuesta.estado) {
        delete encuesta.estado;
      }
    },
    beforeCreate: (encuesta) => {
      if (encuesta.fecha_cierre && encuesta.fecha_apertura) {
        if (new Date(encuesta.fecha_cierre) <= new Date(encuesta.fecha_apertura)) {
          throw new Error('La fecha de cierre debe ser posterior a la de apertura');
        }
      }
    }
  },
  defaultScope: {
    attributes: {
      exclude: ['estado'] // Excluir por defecto
    }
  },
  scopes: {
    withEstado: {
      attributes: { include: ['estado'] } // Incluir solo cuando sea necesario
    }
  }
});

// Métodos personalizados
Encuesta.obtenerPorId = async (id) => {
  return await Encuesta.scope('withEstado').findByPk(id);
};

export default Encuesta;
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
    allowNull: true,
    validate: {
      isIn: [['borrador', 'programada', 'activa', 'cerrada']]
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
      exclude: [] // 👈 Cambiado: Ahora incluye todos los campos
    }
  },
  scopes: {
    withEstado: {
      attributes: { include: ['estado'] }
    }
  }
});
Encuesta.obtenerTodas = async function() {
  const results = await sequelize.query(
    "SELECT * FROM obtener_encuestas()", // Usa la función
    { type: sequelize.QueryTypes.SELECT }
  );
  return results;
};

Encuesta.obtenerPorId = async (id) => {
  return await Encuesta.scope('withEstado').findByPk(id);
};

Encuesta.obtenerEncuestaActiva = async function() {
  return await this.scope('withEstado').findOne({
    where: {
      estado: 'activa'
    }
  });
};

export default Encuesta;
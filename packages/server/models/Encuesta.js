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
    defaultValue: 'borrador',
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
    },
    beforeUpdate: async (encuesta) => {
      if (encuesta.fecha_apertura && encuesta.fecha_cierre) {
        const hoy = new Date();
        const apertura = new Date(encuesta.fecha_apertura);
        const cierre = new Date(encuesta.fecha_cierre);

        let nuevoEstado = 'programada';
        if (hoy >= apertura && hoy <= cierre) nuevoEstado = 'activa';
        if (hoy > cierre) nuevoEstado = 'cerrada';

        if (encuesta.estado !== nuevoEstado) {
          encuesta.estado = nuevoEstado;
        }
      }

      if (encuesta.changed('fecha_cierre') || encuesta.changed('fecha_apertura')) {
        if (encuesta.fecha_cierre && encuesta.fecha_apertura) {
          if (new Date(encuesta.fecha_cierre) <= new Date(encuesta.fecha_apertura)) {
            throw new Error('La fecha de cierre debe ser posterior a la de apertura');
          }
        }
      }
    }
  },
  defaultScope: {
    attributes: {
      exclude: [] 
    }
  },
  scopes: {
    withEstado: {
      attributes: { include: ['estado'] }
    }
  }
});

Encuesta.obtenerTodas = async function() {
  const encuestas = await Encuesta.findAll();

  for (const encuesta of encuestas) {
    const hoy = new Date();
    const apertura = new Date(encuesta.fecha_apertura);
    const cierre = new Date(encuesta.fecha_cierre);

    let nuevoEstado = 'programada';
    if (hoy >= apertura && hoy <= cierre) nuevoEstado = 'activa';
    if (hoy > cierre) nuevoEstado = 'cerrada';

    if (encuesta.estado !== nuevoEstado) {
      encuesta.estado = nuevoEstado;
      await encuesta.save();
    }
  }

  return encuestas;
};

Encuesta.obtenerPorId = async (id) => {
  const encuesta = await Encuesta.scope('withEstado').findByPk(id);

  if (encuesta) {
    const hoy = new Date();
    const apertura = new Date(encuesta.fecha_apertura);
    const cierre = new Date(encuesta.fecha_cierre);

    let nuevoEstado = 'programada';
    if (hoy >= apertura && hoy <= cierre) nuevoEstado = 'activa';
    if (hoy > cierre) nuevoEstado = 'cerrada';

    if (encuesta.estado !== nuevoEstado) {
      encuesta.estado = nuevoEstado;
      await encuesta.save();
    }
  }

  return encuesta;
};

Encuesta.obtenerEncuestaActiva = async function() {
  const encuestas = await Encuesta.findAll();
  const hoy = new Date();

  for (const encuesta of encuestas) {
    const apertura = new Date(encuesta.fecha_apertura);
    const cierre = new Date(encuesta.fecha_cierre);

    let nuevoEstado = 'programada';
    if (hoy >= apertura && hoy <= cierre) nuevoEstado = 'activa';
    if (hoy > cierre) nuevoEstado = 'cerrada';

    if (encuesta.estado !== nuevoEstado) {
      encuesta.estado = nuevoEstado;
      await encuesta.save();
    }

    if (nuevoEstado === 'activa') {
      return encuesta;
    }
  }

  return null;
};

export default Encuesta;

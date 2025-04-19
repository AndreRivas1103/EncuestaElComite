import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; // Ruta corregida

const Coordinador = sequelize.define('Coordinador', {
  cedula: { type: DataTypes.STRING(20), primaryKey: true },
  nombre: { type: DataTypes.STRING(100) },
  correo: { type: DataTypes.STRING(100), unique: true }
});

export default Coordinador;
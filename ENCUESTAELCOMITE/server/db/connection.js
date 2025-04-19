import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.NEONDB_CONNECTION_STRING, {
  dialect: 'postgres',
  ssl: true,
  dialectOptions: { ssl: { require: true } }
});

export default sequelize; // o export { sequelize };
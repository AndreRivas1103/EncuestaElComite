import { Sequelize } from 'sequelize';

// Conexión directa (reemplaza con TU cadena de NeonDB)
const sequelize = new Sequelize(
  'postgresql://neondb_owner:npg_ClfyY0K8SmFV@ep-black-sunset-a4coxssa-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { // Configuración obligatoria para NeonDB
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log // Opcional: muestra queries en consola
  }
);

// Test de conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión DIRECTA a NeonDB establecida');
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
})();

export default sequelize;
import pool from './connection.js';

const initDB = async () => {
  try {
    // Tabla encuesta
    await pool.query(`
      CREATE TABLE IF NOT EXISTS encuesta (
        id_encuesta SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        fecha DATE NOT NULL,
        version VARCHAR(10) NOT NULL
      )
    `);

    // Tabla usuario
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        correo VARCHAR(100) PRIMARY KEY,
        nombre_completo VARCHAR(100) NOT NULL,
        identificacion VARCHAR(20) NOT NULL,
        codigo_unico VARCHAR(100) NOT NULL UNIQUE,
        acepto_terminos BOOLEAN NOT NULL
      )
    `);

    // Tabla coordinador
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coordinador (
        cedula VARCHAR(20) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    // Tabla habilidad
    await pool.query(`
      CREATE TABLE IF NOT EXISTS habilidad (
        id_habilidad SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    // Tabla opcion (asumiendo que existe una tabla pregunta relacionada)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS opcion (
        id_opcion SERIAL PRIMARY KEY,
        id_pregunta INT NOT NULL,
        texto_opcion TEXT NOT NULL,
        FOREIGN KEY (id_pregunta) REFERENCES pregunta(id_pregunta)
      )
    `);

    // Tabla evaluacion_habilidad
    await pool.query(`
      CREATE TABLE IF NOT EXISTS evaluacion_habilidad (
        correo VARCHAR(100) NOT NULL,
        id_encuesta INT NOT NULL,
        id_habilidad INT NOT NULL,
        puntaje INT NOT NULL,
        PRIMARY KEY (correo, id_encuesta, id_habilidad),
        FOREIGN KEY (correo) REFERENCES usuario(correo),
        FOREIGN KEY (id_encuesta) REFERENCES encuesta(id_encuesta),
        FOREIGN KEY (id_habilidad) REFERENCES habilidad(id_habilidad)
      )
    `);

    console.log('Todas las tablas creadas exitosamente');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
  } finally {
    pool.end();
  }
};

initDB();
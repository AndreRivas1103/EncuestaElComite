/**
 * Rehace el esquema PostgreSQL para que coincida con el diagrama "literal".
 * ADVERTENCIA: borra datos existentes.
 */
import sequelize from './connection.js';

const DROP_SQL = `
DROP TABLE IF EXISTS evaluacion_habilidad CASCADE;
DROP TABLE IF EXISTS respuesta CASCADE;
DROP TABLE IF EXISTS opcion CASCADE;
DROP TABLE IF EXISTS pregunta CASCADE;
DROP TABLE IF EXISTS encuesta CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS habilidad CASCADE;
DROP TABLE IF EXISTS coordinador CASCADE;

-- Tablas del esquema previo
DROP TABLE IF EXISTS resultados CASCADE;
DROP TABLE IF EXISTS voluntarios CASCADE;
DROP TABLE IF EXISTS encuestas CASCADE;

DROP FUNCTION IF EXISTS actualizar_voluntario_pre(VARCHAR, JSONB, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS insertar_resultado_calculado(VARCHAR, VARCHAR, VARCHAR, JSONB) CASCADE;

DROP TYPE IF EXISTS enum_pregunta_tipo_respuesta CASCADE;
DROP TYPE IF EXISTS enum_encuesta_version CASCADE;
`;

const CREATE_SQL = `
CREATE TYPE enum_pregunta_tipo_respuesta AS ENUM ('multiple', 'abierta');
CREATE TYPE enum_encuesta_version AS ENUM ('pre', 'post');

CREATE TABLE coordinador (
  cedula VARCHAR(20) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE usuario (
  correo VARCHAR(100) PRIMARY KEY,
  nombre_completo VARCHAR(100) NOT NULL,
  identificacion VARCHAR(20) UNIQUE NOT NULL,
  codigo_unico VARCHAR(100),
  acepto_terminos BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE habilidad (
  id_habilidad SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE encuesta (
  id_encuesta SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  version enum_encuesta_version NOT NULL
);

CREATE TABLE pregunta (
  id_pregunta SERIAL PRIMARY KEY,
  id_encuesta INT NOT NULL REFERENCES encuesta(id_encuesta) ON DELETE CASCADE,
  texto_pregunta VARCHAR(255) NOT NULL,
  tipo_respuesta enum_pregunta_tipo_respuesta NOT NULL,
  id_habilidad INT NOT NULL REFERENCES habilidad(id_habilidad)
);

CREATE TABLE opcion (
  id_opcion SERIAL PRIMARY KEY,
  id_pregunta INT NOT NULL REFERENCES pregunta(id_pregunta) ON DELETE CASCADE,
  texto_opcion TEXT NOT NULL
);

CREATE TABLE respuesta (
  id_respuesta SERIAL PRIMARY KEY,
  correo VARCHAR(100) NOT NULL REFERENCES usuario(correo) ON DELETE CASCADE,
  id_pregunta INT NOT NULL REFERENCES pregunta(id_pregunta) ON DELETE CASCADE,
  respuesta TEXT,
  id_encuesta INT NOT NULL REFERENCES encuesta(id_encuesta) ON DELETE CASCADE
);

CREATE TABLE evaluacion_habilidad (
  correo VARCHAR(100) NOT NULL REFERENCES usuario(correo) ON DELETE CASCADE,
  id_encuesta INT NOT NULL REFERENCES encuesta(id_encuesta) ON DELETE CASCADE,
  id_habilidad INT NOT NULL REFERENCES habilidad(id_habilidad),
  puntaje INT NOT NULL DEFAULT 0,
  PRIMARY KEY (correo, id_encuesta, id_habilidad)
);
`;

async function main() {
  console.log('Eliminando esquema actual...');
  await sequelize.query(DROP_SQL);
  console.log('Creando esquema del diagrama...');
  await sequelize.query(CREATE_SQL);
  console.log('Listo: esquema recreado segun diagrama.');
  await sequelize.close();
}

main().catch(async (err) => {
  console.error('Error en migracion:', err);
  try {
    await sequelize.close();
  } catch {
    /* ignore */
  }
  process.exit(1);
});

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function readCompose(filename) {
  return readFileSync(path.join(rootDir, filename), 'utf8');
}

describe('contrato docker-compose.yml', () => {
  const compose = readCompose('docker-compose.yml');

  it('define servicios back, db y client', () => {
    expect(compose).toMatch(/\n\s*back:/);
    expect(compose).toMatch(/\n\s*db:/);
    expect(compose).toMatch(/\n\s*client:/);
  });

  it('configura DATABASE_URL del backend hacia el servicio db', () => {
    expect(compose).toContain('DATABASE_URL: postgresql://encuesta:encuesta@db:5432/encuestaelcomite');
  });

  it('expone healthcheck en PostgreSQL', () => {
    expect(compose).toContain('pg_isready');
  });

  it('el backend depende de db con condition healthy', () => {
    expect(compose).toContain('condition: service_healthy');
  });
});

describe('contrato docker-compose.test.yml', () => {
  const compose = readCompose('docker-compose.test.yml');

  it('solo levanta db y back para smoke', () => {
    expect(compose).toMatch(/\n\s*db:/);
    expect(compose).toMatch(/\n\s*back:/);
    expect(compose).not.toMatch(/\n\s*client:/);
  });

  it('usa puerto distinto para no chocar con el compose principal', () => {
    expect(compose).toContain('"5434:5432"');
    expect(compose).toContain('"3011:3000"');
  });
});

describe('contrato Dockerfiles', () => {
  it('el Dockerfile del servidor expone el puerto 3000', () => {
    const dockerfile = readFileSync(
      path.join(rootDir, 'packages/server/Dockerfile'),
      'utf8'
    );
    expect(dockerfile).toContain('EXPOSE 3000');
    expect(dockerfile).toContain('@encuestaelcomite/server');
  });

  it('el Dockerfile del cliente sirve Vite en el puerto 3000', () => {
    const dockerfile = readFileSync(
      path.join(rootDir, 'packages/client/Dockerfile'),
      'utf8'
    );
    expect(dockerfile).toContain('EXPOSE 3000');
    expect(dockerfile).toContain('--host');
  });
});

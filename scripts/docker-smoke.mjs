import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const COMPOSE_FILE = 'docker-compose.test.yml';
const HEALTH_URL = process.env.DOCKER_SMOKE_URL ?? 'http://localhost:3011/health';
const MAX_WAIT_MS = 120_000;

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: true, ...options });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} terminó con código ${code}`));
    });
  });
}

async function waitForHealth() {
  const deadline = Date.now() + MAX_WAIT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(HEALTH_URL);
      if (res.ok) {
        const body = await res.json();
        if (body.status === 'ok' && body.db === 'connected') return body;
      }
    } catch {
      /* servicio aún no listo */
    }
    await delay(3000);
  }
  throw new Error(`Timeout esperando ${HEALTH_URL}`);
}

async function main() {
  console.log('Validando compose de prueba…');
  await run('docker', ['compose', '-f', COMPOSE_FILE, 'config']);

  console.log('Construyendo y levantando stack de smoke…');
  await run('docker', ['compose', '-f', COMPOSE_FILE, 'up', '-d', '--build', '--wait']);

  try {
    console.log('Comprobando /health…');
    const health = await waitForHealth();
    console.log('Smoke OK:', health);
  } finally {
    console.log('Deteniendo contenedores…');
    await run('docker', ['compose', '-f', COMPOSE_FILE, 'down', '-v']);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

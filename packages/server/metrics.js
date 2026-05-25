import client from 'prom-client';
import sequelize from './db/connection.js';

export const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'encuesta_' });

export const httpRequestDuration = new client.Histogram({
  name: 'encuesta_http_request_duration_seconds',
  help: 'Duración de las peticiones HTTP del API',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  registers: [register]
});

export const httpRequestsTotal = new client.Counter({
  name: 'encuesta_http_requests_total',
  help: 'Total de peticiones HTTP del API',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

export const encuestasTotal = new client.Gauge({
  name: 'encuesta_encuestas_registradas',
  help: 'Cantidad de encuestas en la base de datos',
  registers: [register]
});

export const usuariosTotal = new client.Gauge({
  name: 'encuesta_usuarios_registrados',
  help: 'Cantidad de usuarios (voluntarios) en la base de datos',
  registers: [register]
});

export const coordinadoresTotal = new client.Gauge({
  name: 'encuesta_coordinadores_registrados',
  help: 'Cantidad de coordinadores en la base de datos',
  registers: [register]
});

/** Agrupa rutas con IDs para no explotar cardinalidad en Prometheus */
export function normalizeRoute(path) {
  if (!path || path === '/') return '/';
  const segments = path.split('/').filter(Boolean);
  const normalized = segments.map((seg) =>
    /^\d+$/.test(seg) || /^[0-9a-f-]{36}$/i.test(seg) || seg.includes('@')
      ? ':id'
      : seg
  );
  return `/${normalized.join('/')}`.slice(0, 80);
}

export function metricsMiddleware(req, res, next) {
  if (req.path === '/metrics') {
    return next();
  }

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const route = normalizeRoute(req.path);
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode)
    };
    const seconds = Number(process.hrtime.bigint() - start) / 1e9;
    httpRequestDuration.observe(labels, seconds);
    httpRequestsTotal.inc(labels);
  });

  next();
}

async function refreshBusinessMetrics() {
  try {
    const [[encRow]] = await sequelize.query('SELECT COUNT(*)::int AS total FROM encuesta');
    const [[usrRow]] = await sequelize.query('SELECT COUNT(*)::int AS total FROM usuario');
    const [[coordRow]] = await sequelize.query('SELECT COUNT(*)::int AS total FROM coordinador');
    encuestasTotal.set(encRow?.total ?? 0);
    usuariosTotal.set(usrRow?.total ?? 0);
    coordinadoresTotal.set(coordRow?.total ?? 0);
  } catch {
    /* BD aún no lista o tablas inexistentes */
  }
}

export function startBusinessMetricsCollector(intervalMs = 30_000) {
  encuestasTotal.set(0);
  usuariosTotal.set(0);
  coordinadoresTotal.set(0);
  refreshBusinessMetrics();
  return setInterval(refreshBusinessMetrics, intervalMs);
}

export async function getMetricsText() {
  await refreshBusinessMetrics();
  return register.metrics();
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Solo el flujo del voluntario usa fondo azul animado (FondoAzul2). */
const VOLUNTEER_BLUE_PATHS = new Set([
  '/realizar-encuesta',
  '/rellenar-datos',
  '/rellenar-datos-post',
  '/responder-encuesta',
  '/responder-encuesta-post',
  '/terminos-y-condiciones',
  '/gracias-por-participar',
  '/gracias-por-participar-post',
  '/visualizar-resultados',
  '/ver-resultados',
  '/encuestas',
]);

function resolveTheme(pathname) {
  if (pathname === '/') return 'home';
  if (VOLUNTEER_BLUE_PATHS.has(pathname)) return 'blue';
  /* Administrador / coordinador: fondo blanco en toda la rama */
  return 'white';
}

/**
 * Aplica data-app-bg en <body> para cambiar el fondo según la rama de la app.
 */
export default function RouteTheme() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.dataset.appBg = resolveTheme(pathname);
  }, [pathname]);

  return null;
}

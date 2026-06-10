/** Inicio del día local (00:00:00) a partir de YYYY-MM-DD */
export function inicioDia(fecha) {
  if (!fecha) return new Date(NaN);
  const [y, m, d] = String(fecha).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/** Fin del día local (23:59:59.999) — el cierre incluye todo ese día */
export function finDia(fecha) {
  if (!fecha) return new Date(NaN);
  const [y, m, d] = String(fecha).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

export function calcularEstado(fecha_apertura, fecha_cierre, ahora = new Date()) {
  const apertura = inicioDia(fecha_apertura);
  const cierre = finDia(fecha_cierre);

  if (Number.isNaN(apertura.getTime()) || Number.isNaN(cierre.getTime())) {
    return 'cerrada';
  }

  if (ahora < apertura) return 'programada';
  if (ahora <= cierre) return 'activa';
  return 'cerrada';
}

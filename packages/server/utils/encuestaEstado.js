export function calcularEstado(fecha_apertura, fecha_cierre, ahora = new Date()) {
  const apertura = new Date(fecha_apertura);
  const cierre = new Date(fecha_cierre);

  if (ahora < apertura) return 'programada';
  if (ahora >= apertura && ahora <= cierre) return 'activa';
  return 'cerrada';
}

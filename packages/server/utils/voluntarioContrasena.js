export function generarContrasena(nombre, identificacion, anio = new Date().getFullYear()) {
  const prefijo = nombre.trim().toLowerCase().slice(0, 3);
  const sufijo = identificacion.slice(-3);
  return `${prefijo}${sufijo}${anio}`;
}

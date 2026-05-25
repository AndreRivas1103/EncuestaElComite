/**
 * Área con fondo decorativo visible y contenido en tarjeta blanca.
 */
export default function PageSurface({
  children,
  className = '',
  cardClassName = '',
  centered = false,
  wide = false,
}) {
  const areaClass = [
    'page-content-area',
    centered ? 'page-content-area--centered' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cardClass = [
    'page-card',
    wide ? 'page-card--wide' : '',
    centered ? 'page-card--center' : '',
    cardClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={areaClass}>
      <div className={cardClass}>{children}</div>
    </div>
  );
}

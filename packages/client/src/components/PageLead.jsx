/**
 * Texto breve bajo el título de cada pantalla (qué se hace en la página).
 */
export default function PageLead({ children, className = "" }) {
  return (
    <p className={["page-lead", className].filter(Boolean).join(" ")}>{children}</p>
  );
}

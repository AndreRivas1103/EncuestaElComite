import { useLocation } from "react-router-dom";

/**
 * Re-monta el contenido al cambiar la ruta para disparar una entrada suave
 * (una sola animación sobre el bloque de página, no sobre cada descendiente).
 */
export default function PageTransitionShell({ children }) {
  const location = useLocation();
  return (
    <div className="page-transition-shell" key={location.pathname}>
      {children}
    </div>
  );
}

import { useState, useCallback, useEffect, useLayoutEffect } from "react";

/** Duración alineada con --sidebar-close-duration en CSS */
const CLOSE_MS = 480;

/**
 * Cierra el panel lateral con animación: mantiene el estado "abierto" hasta terminar
 * y entonces llama a onClose.
 *
 * @param {string} [closedModifier] — clase cuando está cerrado: '' (coordinador) o 'hidden' (p. ej. Ver resultados)
 */
export function useSidebarClosing(isVisible, onClose, closedModifier = "") {
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (!isVisible || closing) return;
      setClosing(true);
    },
    [isVisible, closing]
  );

  /* Mismo fotograma que el panel: retracción global (header, miga, contenido) */
  useLayoutEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (closing) {
      document.body.classList.add("sidebar-panel-closing");
    } else {
      document.body.classList.remove("sidebar-panel-closing");
    }
    return () => {
      document.body.classList.remove("sidebar-panel-closing");
    };
  }, [closing]);

  useEffect(() => {
    if (!closing) return;

    const runClose = () => {
      setClosing(false);
      onClose?.();
    };

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      runClose();
      return undefined;
    }

    const id = window.setTimeout(runClose, CLOSE_MS);
    return () => window.clearTimeout(id);
  }, [closing, onClose]);

  useEffect(() => {
    if (!isVisible) setClosing(false);
  }, [isVisible]);

  const openOrClosing = isVisible || closing;
  const sidebarClassName = [
    "sidebar",
    openOrClosing ? "visible" : closedModifier || undefined,
    closing ? "sidebar-closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return { sidebarClassName, requestClose, closing };
}

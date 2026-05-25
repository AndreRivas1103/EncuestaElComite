import { toast as sonnerToast } from 'sonner';

/** Notificaciones alineadas con la marca El Comité (#1e3766, #73A31D, #d3edff). */
export const toast = {
  success(message, options) {
    return sonnerToast.success(message, options);
  },
  error(message, options) {
    return sonnerToast.error(message, options);
  },
  info(message, options) {
    return sonnerToast.info(message, options);
  },
  warning(message, options) {
    return sonnerToast.warning(message, options);
  },
  promise(promise, messages) {
    return sonnerToast.promise(promise, messages);
  },
};

export default toast;

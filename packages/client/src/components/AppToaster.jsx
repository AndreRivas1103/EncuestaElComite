import { Toaster } from 'sonner';
import '../styles/toast.css';

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors={false}
      closeButton
      toastOptions={{
        classNames: {
          toast: 'elcomite-toast',
          title: 'elcomite-toast__title',
          description: 'elcomite-toast__description',
          closeButton: 'elcomite-toast__close',
          success: 'elcomite-toast--success',
          error: 'elcomite-toast--error',
          info: 'elcomite-toast--info',
          warning: 'elcomite-toast--warning',
        },
      }}
    />
  );
}

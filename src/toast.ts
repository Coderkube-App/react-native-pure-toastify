export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

export interface ToastOptions {
  description?: string;
  duration?: number;
  autoClose?: boolean;
  haptic?: 'success' | 'warning' | 'error' | 'selection';
  onPress?: () => void;
  onClose?: () => void;
}

export interface ToastData extends ToastOptions {
  id: string;
  type: ToastType;
  message: string;
}

type ToastListener = (toast: ToastData) => void;

class ToastManager {
  private listeners = new Set<ToastListener>();

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  show(type: ToastType, message: string, options?: ToastOptions) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastData = {
      id,
      type,
      message,
      ...options,
    };
    this.listeners.forEach((listener) => listener(toast));
    return id;
  }

  success(message: string, options?: ToastOptions) {
    return this.show('success', message, options);
  }

  error(message: string, options?: ToastOptions) {
    return this.show('error', message, options);
  }

  info(message: string, options?: ToastOptions) {
    return this.show('info', message, options);
  }

  warning(message: string, options?: ToastOptions) {
    return this.show('warning', message, options);
  }

  default(message: string, options?: ToastOptions) {
    return this.show('default', message, options);
  }
}

export const toast = new ToastManager();

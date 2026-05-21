import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToastData, toast } from './toast';
import { ToastContainer } from './ToastContainer';

export interface ToastContextType {
  toasts: ToastData[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  duration?: number;
}

export const ToastProvider = ({
  children,
  position = 'top',
  duration = 3000,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => {
        // Enforce max active alerts (e.g. 5) to prevent screen clogging
        const filtered = prev.filter((t) => t.id !== newToast.id);
        return [...filtered, newToast].slice(-5);
      });
    });
    return unsubscribe;
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => {
      const found = prev.find((t) => t.id === id);
      if (found?.onClose) {
        try {
          found.onClose();
        } catch (e) {
          console.warn('Error inside onClose callback:', e);
        }
      }
      return prev.filter((t) => t.id !== id);
    });
  };

  const ToastContainerComponent: any = ToastContainer;

  return (
    <ToastContext.Provider value={{ toasts, dismiss }}>
      {children}
      <ToastContainerComponent toasts={toasts} position={position} defaultDuration={duration} dismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { View } from 'react-native';
import { Toast } from '../components/ui/Toast';
import { ToastConfig } from '../types/ui';

interface ToastContextData {
  showToast: (config: Omit<ToastConfig, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = (config: Omit<ToastConfig, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...config, id }]);
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <View style={{ position: 'absolute', top: 50, left: 0, right: 0, zIndex: 9999, pointerEvents: 'box-none' }}>
        {toasts.map((t) => (
          <Toast key={t.id} config={t} onDismiss={hideToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

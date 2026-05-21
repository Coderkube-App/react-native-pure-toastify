import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { ToastData } from './toast';
import { ToastItem } from './ToastItem';

interface ToastContainerProps {
  toasts: ToastData[];
  position: 'top' | 'bottom';
  defaultDuration: number;
  dismiss: (id: string) => void;
}

export const ToastContainer = ({
  toasts,
  position,
  defaultDuration,
  dismiss,
}: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  const SafeAreaViewComponent: any = SafeAreaView;
  const ToastItemComponent: any = ToastItem;

  return (
    <SafeAreaViewComponent
      style={[
        styles.container,
        position === 'top' ? styles.topContainer : styles.bottomContainer,
      ]}
      pointerEvents="box-none"
    >
      {toasts.map((toast) => (
        <ToastItemComponent
          key={toast.id}
          toast={toast}
          position={position}
          defaultDuration={defaultDuration}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </SafeAreaViewComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    gap: 8,
  },
  topContainer: {
    top: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 12,
  },
  bottomContainer: {
    bottom: 16,
  },
});

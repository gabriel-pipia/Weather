export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastConfig {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onPress?: () => void;
  action?: ToastAction;
}
export interface ModalAction {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white';
}

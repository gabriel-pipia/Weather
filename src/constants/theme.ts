import { DimensionValue, Platform } from 'react-native';

/**
 * Base Palette
 */
const palette = {
  blue: '#2196F3',
  lightBlue: '#E3F2FD',
  deepBlue: '#1565C0',
  white: '#FFFFFF',
  black: '#000000',
  grey50: '#F9FAFB',
  grey100: '#F3F4F6',
  grey200: '#E5E7EB',
  grey300: '#D1D5DB',
  grey400: '#9CA3AF',
  grey500: '#6B7280',
  grey600: '#4B5563',
  grey700: '#374151',
  grey800: '#1F2937',
  grey900: '#111827',
  sunny: '#FFD700',
  orange: '#FF9800',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  weather: {
    sunny: ['#4facfe', '#00f2fe'],
    cloudy: ['#485563', '#29323c'],
    rainy: ['#00c6fb', '#005bea'],
    snowy: ['#e6e9f0', '#eef1f5'],
    storm: ['#1e3c72', '#2a5298'],
    clearNight: ['#0f2027', '#203a43', '#2c5364'],
  }
};

export const LightColors = {
  primary: palette.blue,
  secondary: palette.grey600,
  accent: palette.orange,
  background: palette.white,
  surface: palette.grey50,
  text: palette.grey900,
  textSecondary: palette.grey500,
  border: palette.grey200,
  icon: palette.grey600,
  tint: palette.blue,
  error: palette.error,
  success: palette.success,
  white: palette.white,
  black: palette.black,
  glass: 'rgba(255, 255, 255, 0.4)',
  glassDark: 'rgba(255, 255, 255, 0.6)',
  weather: palette.weather,
};

export const DarkColors = {
  primary: palette.blue,
  secondary: palette.grey400,
  accent: palette.orange,
  background: '#0A0A0A',
  surface: '#1A1A1A',
  text: palette.white,
  textSecondary: palette.grey400,
  border: '#2A2A2A',
  icon: palette.grey400,
  tint: palette.white,
  error: palette.error,
  success: palette.success,
  white: palette.white,
  black: palette.black,
  glass: 'rgba(0, 0, 0, 0.4)',
  glassDark: 'rgba(0, 0, 0, 0.6)',
  weather: palette.weather,
};

export const Colors = LightColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screenPadding: 20,
};

export const Typography = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
    giant: 80,
  },
  weight: {
    thin: '100',
    light: '200',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  } as const,
  fonts: Platform.select({
    ios: { sans: 'System' },
    android: { sans: 'Roboto' },
    web: { sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
    default: { sans: 'System' },
  }),
};

export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  small: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const Layout = {
  containerWidth: '90%' as DimensionValue | undefined,
  containerMaxWidth: 500,
};

export default {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
  Layout,
};

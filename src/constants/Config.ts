import { Colors } from './theme';

export const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || '';
export const BASE_URL = process.env.EXPO_PUBLIC_WEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

// For backward compatibility with existing components
export const COLORS = Colors;

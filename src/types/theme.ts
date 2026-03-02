import { DimensionValue, TextProps, ViewProps } from 'react-native';
import { Colors } from '../constants/theme';

export type FontWeight = 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'black';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | number;
export type BorderRadiusSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption' | 'label' | 'error';
  weight?: FontWeight;
  size?: FontSize;
  align?: 'left' | 'center' | 'right';
  colorType?: keyof typeof Colors;
  uppercase?: boolean;
}

export interface ThemedViewProps extends ViewProps {
  themed?: boolean;
  scroll?: boolean;
  blur?: boolean;
  keyboardAvoiding?: boolean;
  safe?: boolean;
  edges?: any;
  keyboardOffset?: number;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  contentContainerStyle?: any;
  maxWidth?: boolean | number | string | DimensionValue;
  refreshControl?: any;
  showsVerticalScrollIndicator?: boolean;
}

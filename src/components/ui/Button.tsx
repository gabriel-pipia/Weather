import React from 'react';
import { StyleProp, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BorderRadiusSize } from '../../types/theme';
import { ThemedText } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'icon';
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  loading?: boolean;
  rounded?: BorderRadiusSize;
}

export function Button({ 
  title, 
  variant = 'primary', 
  type = 'text',
  size = 'md', 
  icon,
  rightIcon,
  style,
  textStyle,
  disabled,
  children,
  weight = 'bold', 
  loading = false,
  rounded = 'md',
  ...props 
}: ButtonProps) {
  const { colors, spacing, borderRadius } = useTheme();
  
  // Size styles (padding)
  const sizePadding = {
    sm: { px: spacing.sm, py: spacing.xs },
    md: { px: spacing.md, py: spacing.sm },
    lg: { px: spacing.xl, py: spacing.md },
  };

  const currentPadding = sizePadding[size];

  // Dynamic Styles based on variant
  let backgroundColor: string = colors.accent;
  let borderColor: string = 'rgba(0,0,0,0.1)';
  let textColor: string = colors.white;
  let borderWidth = 0;
  let borderBottomWidth = 4;

  switch (variant) {
    case 'primary':
      backgroundColor = colors.accent;
      borderColor = 'rgba(0,0,0,0.1)';
      textColor = colors.white;
      break;
    case 'secondary':
      backgroundColor = colors.surface;
      borderColor = colors.border;
      textColor = colors.text;
      borderWidth = 1;
      borderBottomWidth = 2;
      break;
    case 'white':
      backgroundColor = colors.white;
      borderColor = colors.border;
      textColor = colors.black;
      borderBottomWidth = 2;
      break;
    case 'danger':
      backgroundColor = colors.error;
      borderColor = 'rgba(0,0,0,0.2)';
      textColor = colors.white;
      borderBottomWidth = 4;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      textColor = colors.accent;
      borderWidth = 2;
      borderColor = colors.accent;
      borderBottomWidth = 0;
      break;
    case 'ghost':
      backgroundColor = 'transparent';
      textColor = colors.text;
      borderBottomWidth = 0;
      break;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: borderRadius[rounded] || borderRadius.md,
          backgroundColor,
          borderWidth,
          borderColor,
          borderBottomWidth: (disabled || variant === 'outline' || variant === 'ghost') ? borderWidth : borderBottomWidth,
          paddingHorizontal: type === 'icon' ? currentPadding.py : currentPadding.px,
          paddingVertical: currentPadding.py,
          opacity: disabled ? 0.5 : 1,
        },
        style as any
      ]}
      {...props}
    >
      {children ? children : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {icon && <View style={{ marginRight: type === 'text' ? spacing.sm : 0 }}>{icon}</View>}
            {title && (
              <ThemedText
                style={[
                  { color: textColor, fontWeight: weight as any },
                  size === 'lg' && { fontSize: 20 },
                  size === 'md' && { fontSize: 16 },
                  size === 'sm' && { fontSize: 14 },
                  textStyle
                ]}
              >
                {loading ? 'Loading...' : title}
              </ThemedText>
            )}
            {rightIcon && <View style={{ marginLeft: spacing.sm }}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

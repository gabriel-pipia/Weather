import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BorderRadiusSize } from '../../types/theme';
import { ThemedText } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rounded?: BorderRadiusSize;
}

export function Input({ 
  label, 
  error, 
  containerStyle, 
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  style,
  rounded = 'md',
  ...props 
}: InputProps) {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);
  
  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const activeColor = error ? colors.error : (isFocused ? colors.accent : colors.border);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText colorType='text' size="sm" weight='semibold' style={[styles.label, { marginBottom: spacing.xs, marginLeft: spacing.xs }]}>{label}</ThemedText>
      )}
      <View style={styles.inputWrapper}>
        {leftIcon && (
            <View style={[styles.leftIcon, { left: spacing.md }]}>
                {React.cloneElement(leftIcon as React.ReactElement<any>, {
                    color: isFocused ? colors.accent : (leftIcon as any).props.color || colors.textSecondary
                })}
            </View>
        )}
        <TextInput 
          placeholderTextColor={colors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: activeColor,
              borderWidth: 1,
              borderBottomWidth: 3,
              paddingVertical: spacing.md,
              paddingLeft: leftIcon ? spacing.xl + spacing.md : spacing.md,
              paddingRight: rightIcon ? spacing.xl + spacing.md : spacing.md,
              borderRadius: borderRadius[rounded] || borderRadius.md,
              fontSize: typography.size.md,
            },
            style
          ]}
          {...props}
        />
         {rightIcon && (
            <View style={[styles.rightIcon, { right: spacing.md }]}>
                {React.cloneElement(rightIcon as React.ReactElement<any>, {
                    color: isFocused ? colors.accent : (rightIcon as any).props.color || colors.textSecondary
                })}
            </View>
        )}
      </View>
      {error && (
        <ThemedText type="error" style={[styles.error, { color: colors.error, marginTop: spacing.xs, marginLeft: spacing.xs }]}>{error}</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
  },
  inputWrapper: {
    justifyContent: 'center',
    position: 'relative',
  },
  leftIcon: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    zIndex: 10,
  },
  rightIcon: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    zIndex: 10,
  },
  error: {
    fontSize: 14,
    fontWeight: '500',
  },
});

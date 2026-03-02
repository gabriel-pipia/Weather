import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ThemedText } from '../ui/Text';
import { ThemedView } from '../ui/View';

export interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  rightElement?: React.ReactNode;
  hideBorder?: boolean;
  onPress?: () => void;
}

export function SettingRow({ icon, label, rightElement, hideBorder, onPress }: SettingRowProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={[
        styles.settingRow, 
        { borderColor: colors.border },
        hideBorder ? { borderBottomWidth: 0 } : {},
      ]}>
        <ThemedView style={styles.settingRowLeft}>
          <ThemedView style={[styles.settingIconWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {React.cloneElement(icon as React.ReactElement<any>, { color: colors.text, size: 18 })}
          </ThemedView>
          <ThemedText 
            weight="medium" 
            style={{ marginLeft: 16, flex: 1, marginRight: 12 }} 
            numberOfLines={1} 
            adjustsFontSizeToFit={true}
          >
            {label}
          </ThemedText>
        </ThemedView>
        <ThemedView style={{ flexShrink: 0 }}>{rightElement}</ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

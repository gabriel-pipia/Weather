import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { BottomSheet } from '../ui/BottomSheet';
import { Switch } from '../ui/Switch';
import { ThemedText } from '../ui/Text';

interface LocalWeatherSheetProps {
  visible: boolean;
  onClose: () => void;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export function LocalWeatherSheet({ visible, onClose, value, onValueChange }: LocalWeatherSheetProps) {
  const { colors, borderRadius } = useTheme();
  const { t } = useLanguage();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('settings.localWeather')}>
      <View style={styles.container}>
        <Pressable 
          onPress={() => onValueChange(!value)} 
          style={[
            styles.item, 
            { 
              backgroundColor: value ? `${colors.accent}15` : colors.surface,
              borderRadius: borderRadius.lg
            }
          ]}
        >
          <View style={styles.row}>
            <ThemedText weight="bold" size="lg" style={{ color: value ? colors.accent : colors.text }}>
              {value ? t('common.on') : t('common.off')}
            </ThemedText>
            <Switch 
              value={value} 
              onValueChange={onValueChange} 
            />
          </View>
        </Pressable>
        
        <View style={styles.descriptionBox}>
          <ThemedText colorType="textSecondary" type='default' size="sm" style={styles.description}>
            {t('settings.localWeatherDesc')}
          </ThemedText>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  item: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  descriptionBox: {
    paddingHorizontal: 8,
  },
  description: {
    textAlign: 'justify',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
});

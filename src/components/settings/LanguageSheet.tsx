import { Check } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { BottomSheet } from '../ui/BottomSheet';
import { ThemedText } from '../ui/Text';

interface LanguageSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageSheet({ visible, onClose }: LanguageSheetProps) {
  const { colors, borderRadius } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const options = [
    { label: t('common.english'), value: 'en', flag: '🇺🇸' },
    { label: t('common.georgian'), value: 'ka', flag: '🇬🇪' },
  ] as const;

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('settings.language')}>
      <View style={styles.container}>
        {options.map((option, index) => {
          const isSelected = language === option.value;

          return (
            <React.Fragment key={option.value}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.item,
                  { 
                    backgroundColor: isSelected ? `${colors.accent}15` : 'transparent',
                    borderRadius: borderRadius.lg
                  }
                ]}
                onPress={() => {
                  setLanguage(option.value as 'en' | 'ka');
                  onClose();
                }}
              >
                <View style={styles.left}>
                  <ThemedText size="2xl" style={styles.flag}>{option.flag}</ThemedText>
                  <ThemedText 
                    weight={isSelected ? 'bold' : 'medium'}
                    style={{ color: isSelected ? colors.accent : colors.text }}
                    size="lg"
                  >
                    {option.label}
                  </ThemedText>
                </View>
                {isSelected && <Check size={20} color={colors.accent} strokeWidth={3} />}
              </TouchableOpacity>
              {index < options.length - 1 && (
                <View style={[styles.separator, { backgroundColor: colors.border, opacity: 0.5 }]} />
              )}
            </React.Fragment>
          );
        })}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  flag: {
    fontSize: 24,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 4,
  }
});

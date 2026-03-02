import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { ThemedView } from '../ui';
import { BottomSheet } from '../ui/BottomSheet';
import { ThemedText } from '../ui/Text';

interface TermsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function TermsSheet({ visible, onClose }: TermsSheetProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('settings.termsPrivacy')} scrollable>
      <ThemedView maxWidth={true} style={styles.container}>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText weight="semibold" size="md" style={styles.paragraphLabel}>
            {t('settings.terms1Label')}
          </ThemedText>
          <ThemedText colorType="textSecondary" type="default" size="sm" style={styles.paragraphText}>
            {t('settings.terms1Desc')}
          </ThemedText>
          
          <ThemedText weight="semibold" size="md" style={[styles.paragraphLabel, { marginTop: 16 }]}>
            {t('settings.terms2Label')}
          </ThemedText>
          <ThemedText colorType="textSecondary" type="default" size="sm" style={styles.paragraphText}>
            {t('settings.terms2Desc')}
          </ThemedText>

          <ThemedText weight="semibold" size="md" style={[styles.paragraphLabel, { marginTop: 16 }]}>
            {t('settings.terms3Label')}
          </ThemedText>
          <ThemedText colorType="textSecondary" type="default" size="sm" style={styles.paragraphText}>
            {t('settings.terms3Desc')}
          </ThemedText>
        </View>
      </ThemedView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 3,
    marginBottom: 24,
  },
  paragraphLabel: {
    marginBottom: 8,
  },
  paragraphText: {
    lineHeight: 22,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 10,
  }
});

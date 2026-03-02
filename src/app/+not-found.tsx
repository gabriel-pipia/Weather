import { useRouter } from 'expo-router';
import { CloudOff, MoveLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '../components/ui/Button';
import { ThemedText } from '../components/ui/Text';
import { ThemedView } from '../components/ui/View';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

export default function NotFoundScreen() {
  const { t } = useLanguage();
  const { colors, spacing, layout } = useTheme();
  const router = useRouter();

  return (
    <>
      <ThemedView style={styles.container} safe themed>
        <Animated.View
          entering={FadeInUp.duration(800).springify()}
          style={[styles.content, { 
            width: layout.containerWidth,
            maxWidth: layout.containerMaxWidth 
          }]}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <CloudOff color={colors.accent} size={84} strokeWidth={1.5} />
          </View>
          
          <ThemedText type="title" align="center" style={styles.title}>
            {t('notFound.title')}
          </ThemedText>
          
          <ThemedText colorType="textSecondary" align="center" style={styles.message}>
            {t('notFound.message')}
          </ThemedText>

          <Button 
            variant="primary" 
            size="lg" 
            rounded="full"
            onPress={() => router.replace('/')}
            icon={<MoveLeft color={colors.white} size={20} />}
            style={styles.button}
          >
            <ThemedText weight="bold" style={{ color: colors.white, marginLeft: spacing.sm }}>
              {t('notFound.goBack')}
            </ThemedText>
          </Button>
        </Animated.View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderBottomWidth: 5,
  },
  title: {
    fontSize: 42,
    lineHeight: 48,
    marginBottom: 12,
  },
  message: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 40,
    maxWidth: '90%',
  },
  button: {
    width: '100%',
    height: 64,
  },
});

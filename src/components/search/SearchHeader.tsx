import { MapPin, Search, X } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui';
import { Input } from '../ui/Input';
import { ThemedText } from '../ui/Text';
import { ThemedView } from '../ui/View';

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  onCurrentLocation?: () => void;
}

export function SearchHeader({ searchQuery, setSearchQuery, onCurrentLocation }: SearchHeaderProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <ThemedView style={styles.header}>
      <View style={styles.topRow}>
        <ThemedText size="3xl" colorType="text" weight="bold" type='title'>{t('search.title')}</ThemedText>
        {onCurrentLocation && (
          <Button variant='secondary' type='icon' rounded='full' size='md' onPress={onCurrentLocation}>
            <MapPin color={colors.text} size={24} />
          </Button>
        )}
      </View>

      <Input
        leftIcon={<Search color={colors.textSecondary} size={20} />}
        rightIcon={
          searchQuery.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              type='icon'
              icon={<X color={colors.textSecondary} size={24} />}
              onPress={() => setSearchQuery('')}
            />
          ) : undefined
        }
        placeholder={t('search.placeholder')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="words"
        autoCorrect={false}
        rounded="full"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});

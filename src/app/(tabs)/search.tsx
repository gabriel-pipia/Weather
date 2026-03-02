import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet } from 'react-native';
import { LocationCard } from '../../components/search/LocationCard';
import { SearchHeader } from '../../components/search/SearchHeader';
import { RefreshControl } from '../../components/ui/RefreshControl';
import { ThemedText } from '../../components/ui/Text';
import { ThemedView } from '../../components/ui/View';

import { useLanguage } from '../../hooks/useLanguage';
import { useLocations } from '../../hooks/useLocations';
import { useToast } from '../../hooks/useToast';
import { fetchWeatherByCoords, WeatherData } from '../../hooks/useWeather';
import { transliterateGeorgian } from '../../utils/transliterate';

const POPULAR_CITIES = [
  'cities.london',
  'cities.newYork',
  'cities.tokyo',
  'cities.paris',
  'cities.dubai'
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { addLocation } = useLocations();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();

  const handleLocationPress = async (data: WeatherData) => {
    await addLocation({
      id: data.name.toLowerCase(),
      name: data.name,
      country: data.sys?.country || '',
      lat: data.coord?.lat || 0,
      lon: data.coord?.lon || 0,
    });
    router.push('/');
  };

  const handleCurrentLocation = async () => {
    try {
      let { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        if (canAskAgain) {
          const result = await Location.requestForegroundPermissionsAsync();
          status = result.status;
        } else {
          showToast({ 
            title: t('home.permissionDenied'), 
            message: t('home.enableLocation'), 
            type: 'error',
            action: Platform.OS !== 'web' ? {
              label: t('settings.openSettings'),
              onPress: () => Linking.openSettings()
            } : undefined
          });
          return;
        }
      }

      if (status !== 'granted') {
        return;
      }

      showToast({ title: t('home.locating'), message: t('home.findingPosition'), type: 'info', duration: 2000 });
      const currentLoc = await Location.getCurrentPositionAsync({});
      const weatherData = await fetchWeatherByCoords(currentLoc.coords.latitude, currentLoc.coords.longitude);
      
      await handleLocationPress(weatherData);
    } catch {
      showToast({ title: t('home.locationError'), message: t('home.fetchError'), type: 'error' });
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Setting key forces LocationCards to unmount and remount organically fetching new weather
    setRefreshKey(prev => prev + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ThemedView themed safe maxWidth={true} style={styles.container}>
      <SearchHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onCurrentLocation={handleCurrentLocation}
      />

      {searchQuery.trim().length > 0 && searchQuery !== transliterateGeorgian(searchQuery) && (
        <ThemedText 
          size="xs" 
          colorType="textSecondary" 
          style={{ paddingHorizontal: 4, marginTop: -8, marginBottom: 8, fontStyle: 'italic' }}
        >
          {t('search.searchingFor')}: &quot;{transliterateGeorgian(searchQuery)}&quot;
        </ThemedText>
      )}

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {searchQuery.trim().length > 0 ? (
          <ThemedView style={styles.section}>
            <ThemedText colorType="textSecondary" weight="medium" style={styles.sectionTitle}>
              {t('search.title')}
            </ThemedText>
            <LocationCard 
              key={`search-${refreshKey}`} 
              city={searchQuery.trim()} 
              isSearchPreview={true} 
              onPress={handleLocationPress} 
            />
          </ThemedView>
        ) : (
          <ThemedView style={styles.section}>
            <ThemedText colorType="textSecondary" weight="medium" style={styles.sectionTitle}>
              {t('search.topLocations')}
            </ThemedText>
            {POPULAR_CITIES.map(cityKey => (
              <LocationCard 
                key={`${cityKey}-${refreshKey}`} 
                city={t(cityKey)} 
                onPress={handleLocationPress} 
              />
            ))}
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    marginTop: 5,
  },
  sectionTitle: {
    marginVertical: 15,
  },
});

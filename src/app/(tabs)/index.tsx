import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, Linking, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { DailyForecastCard, DailyForecastItem } from '../../components/home/DailyForecastCard';
import { HomeHeader } from '../../components/home/HomeHeader';
import { HourlyForecast, HourlyForecastData } from '../../components/home/HourlyForecast';
import { LocationsSheet } from '../../components/home/LocationsSheet';
import { getParticleType, WeatherCard } from '../../components/home/WeatherCard';
import { WeatherDetailsGrid } from '../../components/home/WeatherDetailsGrid';
import { WeatherParticles } from '../../components/home/WeatherParticles';
import { RefreshControl } from '../../components/ui/RefreshControl';
import { LocationCardSkeleton } from '../../components/ui/Skeleton';
import { ThemedView } from '../../components/ui/View';
import { useDateTranslations, useLanguage } from '../../hooks/useLanguage';
import { useLocations } from '../../hooks/useLocations';
import { useSettings } from '../../hooks/useSettings';
import { useSplash } from '../../hooks/useSplash';
import { useToast } from '../../hooks/useToast';
import { fetchWeatherByCoords, useWeather } from '../../hooks/useWeather';
import { clearScheduledNotifications, scheduleWeatherNotifications } from '../../services/NotificationService';

import { formatTemp } from '../../utils/conversions';

function LocationWeatherView({ 
  locationName,
  isActive
}: { 
  locationName: string;
  isActive: boolean;
}) {
  const { current, forecast, loading, refresh } = useWeather(locationName);
  const { isFahrenheit, notifications } = useSettings();
  const { t } = useLanguage();
  const { isSplashFinished } = useSplash();
  const { weekShort, monthsShort } = useDateTranslations();
  const [refreshing, setRefreshing] = React.useState(false);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh().finally(() => setRefreshing(false));
  }, [refresh]);

  const dNow = new Date();
  const todayString = `${weekShort[dNow.getDay()]}, ${dNow.getDate()}` + (t('settings.title') === "Settings" ? ` ${monthsShort[dNow.getMonth()]}` : ` ${monthsShort[dNow.getMonth()]}`);

  const hourlyData: HourlyForecastData[] = (forecast?.list || []).slice(0, 24).map((item, index) => {
    const date = new Date(item.dt * 1000);
    const hours = date.getHours();
    const timeStr = index === 0 ? t('weather.now') : `${hours.toString().padStart(2, '0')}:00`;
    
    return {
      time: timeStr,
      temp: item.main.temp,
      iconCode: item.weather[0]?.icon || '01d',
      isNow: index === 0,
      pop: item.pop || 0
    };
  });

  const dailyMap = new Map<string, any>();
  (forecast?.list || []).forEach(item => {
    const d = new Date(item.dt * 1000);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const dateStr = weekShort[d.getDay()];
    const hour = d.getHours();

    if (!dailyMap.has(key)) {
      dailyMap.set(key, {
        dateStr,
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        iconCode: item.weather[0]?.icon || '01d',
        pop: (item.pop || 0) * 100
      });
    } else {
      const existing = dailyMap.get(key);
      existing.minTemp = Math.min(existing.minTemp, item.main.temp_min);
      existing.maxTemp = Math.max(existing.maxTemp, item.main.temp_max);
      existing.pop = Math.max(existing.pop, (item.pop || 0) * 100);

      const currentIcon = item.weather[0]?.icon;
      if (currentIcon && currentIcon.includes('d')) {
        if (!existing.iconCode?.includes('d') || (hour >= 11 && hour <= 15)) {
          existing.iconCode = currentIcon;
        }
      }
    }
  });
  const dailyData: DailyForecastItem[] = Array.from(dailyMap.values());

  const particleType = current 
    ? getParticleType(current.weather[0]?.icon || '01d', current.weather[0]?.main || 'Clear')
    : 'none';

  React.useEffect(() => {
    if (isActive && dailyData.length > 0) {
      if (notifications) {
        const forecastForNotif = dailyData.map((d, i) => {
          const dObj = new Date();
          // We assume the first item is today, next is tomorrow etc.
          dObj.setDate(dObj.getDate() + i);
          return {
            dateObj: dObj,
            minTemp: d.minTemp,
            maxTemp: d.maxTemp,
          };
        });
        scheduleWeatherNotifications(locationName, forecastForNotif, isFahrenheit, formatTemp, t);
      } else {
        clearScheduledNotifications();
      }
    }
  }, [isActive, notifications, dailyData, locationName, isFahrenheit, t]); // Fixed dependencies

  if (loading && !current && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <LocationCardSkeleton />
        <View style={{ height: 20 }} />
        <LocationCardSkeleton small />
        <View style={{ height: 20 }} />
        <LocationCardSkeleton small />
      </View>
    );
  }


  return (
    <View style={{ flex: 1 }}>
      <WeatherParticles type={particleType} />
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {isSplashFinished && current && (
          <Animated.View entering={FadeInDown.delay(200).duration(800)}>
            <WeatherCard 
              temperature={current.main.temp}
              condition={
                current.weather[0]?.description
                  ? current.weather[0].description.replace(/\b\w/g, l => l.toUpperCase())
                  : current.weather[0]?.main || t('home.unknown')
              }
              iconCode={current.weather[0]?.icon || '01d'}
              date={todayString}
              maxTemp={dailyData[0]?.maxTemp || current.main.temp_max || current.main.temp}
              minTemp={dailyData[0]?.minTemp || current.main.temp_min || current.main.temp}
              feelsLike={current.main.feels_like}
              scrollY={scrollY}
            />
          </Animated.View>
        )}

        {isSplashFinished && hourlyData.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(800)}>
            <HourlyForecast data={hourlyData} description={`${current?.weather[0]?.main || t('home.clear')}. ${t('home.low')} ${formatTemp(dailyData[0]?.minTemp || current?.main?.temp || 0, isFahrenheit)}°.`} />
          </Animated.View>
        )}

        {isSplashFinished && dailyData.length > 0 && (
          <Animated.View entering={FadeInDown.delay(600).duration(800)}>
            <DailyForecastCard data={dailyData} />
          </Animated.View>
        )}

        {isSplashFinished && current && (
          <Animated.View entering={FadeInDown.delay(800).duration(800)}>
            <WeatherDetailsGrid current={current} />
          </Animated.View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

export default function HomeScreen() {
  const { locations, activeLocation, setActiveLocation, addLocation } = useLocations();
  const { localWeather } = useSettings();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { isSplashFinished } = useSplash();
  const router = useRouter();
  const [sheetVisible, setSheetVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const { current, loading } = useWeather(activeLocation || 'Tbilisi');
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);
  const scrollInitiated = useRef(false);
  const lastSwipedLocation = useRef<string | null>(activeLocation);

  const initialIndex = Math.max(0, locations.findIndex(l => l.name.toLowerCase() === (activeLocation || 'tbilisi').toLowerCase()));

  React.useEffect(() => {
    if (scrollInitiated.current && activeLocation && activeLocation !== lastSwipedLocation.current) {
      const index = locations.findIndex(l => l.name.toLowerCase() === activeLocation.toLowerCase());
      if (index >= 0) {
        scrollRef.current?.scrollTo({ x: index * (containerWidth + 20), animated: false });
      }
    }
    lastSwipedLocation.current = activeLocation;
  }, [activeLocation, locations, containerWidth]);

  const onLayoutContainer = (e: any) => {
    const newWidth = e.nativeEvent.layout.width;
    setContainerWidth(newWidth);
    if (!scrollInitiated.current) {
        scrollRef.current?.scrollTo({ x: initialIndex * (newWidth + 20), animated: false});
        scrollInitiated.current = true;
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (containerWidth + 20));
    if (locations[index] && locations[index].name !== activeLocation) {
      lastSwipedLocation.current = locations[index].name;
      setActiveLocation(locations[index].name);
    }
  };

  const handleCitySelect = (city: string) => {
    setActiveLocation(city);
    setSheetVisible(false);
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
      await addLocation({
        id: weatherData.name.toLowerCase(),
        name: weatherData.name,
        country: weatherData.sys?.country || '',
        lat: currentLoc.coords.latitude,
        lon: currentLoc.coords.longitude,
      });
      setActiveLocation(weatherData.name);
    } catch {
      showToast({ title: t('home.locationError'), message: t('home.fetchError'), type: 'error' });
    }
  };

  const locationFetchedRef = useRef(false);

  React.useEffect(() => {
    if (localWeather && !locationFetchedRef.current) {
      handleCurrentLocation();
      locationFetchedRef.current = true;
    } else if (!localWeather) {
      locationFetchedRef.current = false; // Reset if they turn it off, so it fires again if they turn it on!
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localWeather]);

  return (
    <ThemedView themed safe maxWidth={true} style={{ flex: 1 }} onLayout={onLayoutContainer}>
      {isSplashFinished && (
        <Animated.View entering={FadeInDown.duration(800)}>
          <HomeHeader 
            locationName={current?.name || activeLocation || t('home.unknown')} 
            locationCountry={current?.sys?.country || locations.find(l => l.name === activeLocation)?.country}
            status={loading ? t('home.updating') : t('home.updated')} 
            onLocationPress={() => setSheetVisible(true)}
            onCurrentLocation={handleCurrentLocation}
            onForecastPress={() => router.push('/forecast?tab=hourly')}
          />
        </Animated.View>
      )}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        horizontal
        snapToInterval={containerWidth + 20}
        snapToAlignment="start"
        decelerationRate="normal"
        disableIntervalMomentum={true}
        nestedScrollEnabled={true}
        scrollEnabled={Platform.OS !== 'web'}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentOffset={{x: initialIndex * (containerWidth + 20), y: 0}}
      >
        {locations.map((loc, index) => (
          <View key={loc.id} style={{ flex: 1, width: containerWidth, marginRight: index === locations.length - 1 ? 0 : 20 }}>
            <LocationWeatherView 
              locationName={loc.name} 
              isActive={loc.name === activeLocation} 
            />
          </View>
        ))}
      </ScrollView>

      <LocationsSheet 
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSelect={handleCitySelect}
        activeCity={activeLocation || undefined}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 120,
  }
});

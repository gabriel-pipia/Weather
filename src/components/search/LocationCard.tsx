import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { API_KEY, BASE_URL } from '../../constants/Config';
import { useLanguage } from '../../hooks/useLanguage';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../hooks/useTheme';
import { WeatherData } from '../../hooks/useWeather';
import { formatTemp } from '../../utils/conversions';
import { getCountryName } from '../../utils/country';
import { transliterateGeorgian } from '../../utils/transliterate';
import { LocationCardSkeleton } from '../ui/Skeleton';
import { ThemedText } from '../ui/Text';
import { WeatherIcon } from '../WeatherIcon';

interface LocationCardProps {
  city: string;
  isSearchPreview?: boolean;
  isActive?: boolean;
  onPress?: (data: WeatherData) => void;
  onLongPress?: () => void;
}

export function LocationCard({ city, isSearchPreview = false, isActive = false, onPress, onLongPress }: LocationCardProps) {
  const { colors } = useTheme();
  const { isFahrenheit } = useSettings();
  const { t, language } = useLanguage();
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!city || city.trim().length === 0) {
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const searchCity = transliterateGeorgian(city);
        const res = await axios.get(`${BASE_URL}/weather?q=${searchCity}&appid=${API_KEY}&units=metric&lang=${language}`);
        if (active) setData(res.data);
      } catch (err: any) {
        if (active) setError(err.message || 'City not found');
      } finally {
        if (active) setLoading(false);
      }
    };

    if (isSearchPreview) {
      // Add slight debounce for search previews
      const timeout = setTimeout(() => fetchWeather(), 500);
      return () => {
        active = false;
        clearTimeout(timeout);
      };
    } else {
      fetchWeather();
    }

    return () => {
      active = false;
    };
  }, [city, isSearchPreview, language]);

  if (loading) {
    return (
      <LocationCardSkeleton small={isSearchPreview} />
    );
  }

  if (error || !data) {
     if (isSearchPreview) {
        return (
          <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, justifyContent: 'center' }]}>
             <ThemedText colorType="textSecondary">{`${t('search.noResults')} ${city}`}</ThemedText>
          </View>
        );
     }
     return null;
  }

  return (
    <TouchableOpacity 
      onPress={() => onPress?.(data!)}
      onLongPress={onLongPress}
      activeOpacity={0.8} 
      style={[
        isSearchPreview ? styles.smallContainer : styles.largeContainer, 
        { 
          backgroundColor: colors.surface, 
          borderColor: isActive ? colors.accent : colors.border 
        }
      ]}
    >
      {isSearchPreview ? (
        <>
          <View style={styles.left}>
            <ThemedText size="xl" weight="bold" numberOfLines={1} style={{ marginRight: 8 }}>
              {data.name}{data.sys?.country ? `, ${getCountryName(data.sys.country)}` : ''}
            </ThemedText>
            <ThemedText colorType="textSecondary" size="sm" style={styles.desc}>
              {data.weather[0]?.main}
            </ThemedText>
          </View>
          <View style={styles.right}>
            <WeatherIcon code={data.weather[0]?.icon || '01d'} size={40} />
            <View style={styles.tempContainer}>
              <ThemedText size="3xl" weight="bold">
                {`${formatTemp(data.main.temp, isFahrenheit)}°`}
              </ThemedText>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.largeLeft}>
            <ThemedText size="5xl" weight="bold" type='title' style={styles.largeTemp}>
              {`${formatTemp(data.main.temp, isFahrenheit)}°`}
            </ThemedText>
            <View style={styles.largeBottomLeft}>
              <ThemedText size="lg" weight="bold" numberOfLines={1}>
                {data.name}
              </ThemedText>
              <ThemedText colorType="textSecondary" size="sm" style={styles.largeDesc}>
                {getCountryName(data.sys?.country || '')} • {data.weather[0]?.main}
              </ThemedText>
            </View>
          </View>
          <View style={styles.largeRight}>
            <WeatherIcon code={data.weather[0]?.icon || '01d'} size={72} />
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  largeContainer: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderBottomWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  smallContainer: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  left: {
    flex: 1,
  },
  desc: {
    marginTop: 4,
    textTransform: 'capitalize',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tempContainer: {
    minWidth: 75,
    alignItems: 'flex-end',
  },
  largeLeft: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 120,
  },
  largeBottomLeft: {
    marginTop: 8,
  },
  largeTemp: {
    marginBottom: 8,
  },
  largeDesc: {
    marginTop: 4,
    textTransform: 'capitalize',
  },
  largeRight: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
  },
});

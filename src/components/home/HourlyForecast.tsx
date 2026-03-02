import { useRouter } from 'expo-router';
import { ChevronRight, Droplets } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../hooks/useTheme';
import { formatTemp } from '../../utils/conversions';
import { ThemedText } from '../ui/Text';
import { WeatherIcon } from '../WeatherIcon';

export interface HourlyForecastData {
  time: string;
  temp: number;
  iconCode: string;
  isNow?: boolean;
  pop?: number; // Probability of precipitation
}

interface HourlyForecastProps {
  data: HourlyForecastData[];
  description?: string; // Top description e.g. "Showers. Low 5°C."
}

export function HourlyForecast({ data, description = "Currently clear" }: HourlyForecastProps) {
  const { colors, isDark } = useTheme();
  const { isFahrenheit } = useSettings();
  const { t } = useLanguage();
  const router = useRouter();

  if (!data || data.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <ThemedText weight="semibold" size="md">{description}</ThemedText>
      </View>

      {/* Horizontal List */}
      <ScrollView 
         horizontal 
         showsHorizontalScrollIndicator={false} 
         contentContainerStyle={styles.scrollContent}
         nestedScrollEnabled={true}
      >
        {data.slice(0, 24).map((item, index) => {
          const isActive = item.isNow;
          
          return (
            <View 
              key={index} 
              style={[
                styles.itemContainer, 
                isActive && [styles.activePill, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)' }]
              ]}
            >
              <ThemedText style={styles.timeText} colorType={isActive ? 'text' : 'textSecondary'} size='sm' weight={isActive ? 'bold' : 'medium'}>
                {item.time}
              </ThemedText>
              
              <View style={styles.iconContainer}>
                <WeatherIcon code={item.iconCode} size={32} />
              </View>

              <View style={styles.tempContainer}>
                <ThemedText weight={isActive ? 'bold' : 'semibold'} colorType={isActive ? 'text' : 'textSecondary'} size="2xl">
                  {`${formatTemp(item.temp, isFahrenheit)}°`}
                </ThemedText>
              </View>

              {/* Elegant Precipitation Indicator */}
              <View style={styles.popRow}>
                {item.pop !== undefined ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Droplets size={12} color={isDark ? "#61c6ff" : "#0096ff"} />
                    <ThemedText style={{ color: isDark ? '#61c6ff' : '#0096ff', marginLeft: 2 }} size="xs" weight="bold">
                      {`${Math.round(item.pop * 100)}%`}
                    </ThemedText>
                  </View>
                ) : (
                  <View style={{ height: 16 }} />
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer link */}
      <TouchableOpacity 
        style={[styles.footer, { borderColor: colors.border }]} 
        onPress={() => router.push('/forecast?tab=hourly')}
        activeOpacity={0.7}
      >
        <ThemedText colorType="textSecondary" size="sm" weight="semibold">{t('weather.forecast48h')}</ThemedText>
        <ChevronRight size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    marginBottom: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  itemContainer: {
    alignItems: 'center',
    width: 68,
    paddingVertical: 14,
    borderRadius: 15,
  },
  activePill: {
  },
  timeText: {
    marginBottom: 16,
  },
  iconContainer: {
    height: 38,
    justifyContent: 'center',
    marginBottom: 16,
  },
  tempContainer: {
    marginBottom: 12,
  },
  popRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    height: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 4,
    borderTopWidth: 1,
  }
});

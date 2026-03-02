import { useRouter } from 'expo-router';
import { ChevronRight, Droplets } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../hooks/useTheme';
import { formatTemp } from '../../utils/conversions';
import { ThemedText } from '../ui/Text';
import { WeatherIcon } from '../WeatherIcon';

export interface DailyForecastItem {
  dateStr: string;
  minTemp: number;
  maxTemp: number;
  iconCode: string;
  pop: number; // Probability of precipitation (0-100)
}

interface DailyForecastCardProps {
  data: DailyForecastItem[];
}

export function DailyForecastCard({ data }: DailyForecastCardProps) {
  const { colors } = useTheme();
  const { isFahrenheit } = useSettings();
  const { t } = useLanguage();
  const router = useRouter();

  if (!data || data.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* List */}
      <View style={styles.list}>
        {data.slice(0, 5).map((item, index) => {
          // Check if today
          const isToday = index === 0;

          return (
            <View key={index} style={styles.row}>
              <ThemedText style={styles.dayText} weight={isToday ? 'bold' : 'medium'}>
                {isToday ? t('weather.today') : item.dateStr}
              </ThemedText>
              
              <View style={styles.popContainer}>
                <Droplets size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                <ThemedText colorType="textSecondary" size="sm" weight="semibold">
                  {`${Math.round(item.pop)}%`}
                </ThemedText>
              </View>

              <View style={styles.iconContainer}>
                <WeatherIcon code={item.iconCode} size={28} />
              </View>

              <View style={styles.tempContainer}>
                <ThemedText weight="bold" style={styles.maxTemp}>{`${formatTemp(item.maxTemp, isFahrenheit)}°`}</ThemedText>
                <ThemedText colorType="textSecondary" style={styles.minTemp} weight="semibold">
                  {`${formatTemp(item.minTemp, isFahrenheit)}°`}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity 
        style={[styles.footer, { borderTopColor: colors.border }]} 
        onPress={() => router.push('/forecast?tab=daily')}
        activeOpacity={0.7}
      >
        <ThemedText colorType="textSecondary" size="sm" weight="semibold">{t('weather.forecast5d')}</ThemedText>
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
    overflow: 'hidden', // to ensure inner paddings don't leak
  },
  list: {
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dayText: {
    width: 60, // Fixed width to align contents
    fontSize: 16,
  },
  popContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tempContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  maxTemp: {
    fontSize: 16,
    width: 30,
    textAlign: 'right',
  },
  minTemp: {
    fontSize: 16,
    width: 30,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 8,
    borderTopWidth: 1,
  }
});

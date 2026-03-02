import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Droplets } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { MonthlyCalendar } from '../../components/forecast/MonthlyCalendar';
import { Button, ThemedText, ThemedView } from '../../components/ui';
import { WeatherIcon } from '../../components/WeatherIcon';
import { useDateTranslations, useLanguage } from '../../hooks/useLanguage';
import { useLocations } from '../../hooks/useLocations';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../hooks/useTheme';
import { useWeather } from '../../hooks/useWeather';
import { formatTemp } from '../../utils/conversions';
import { getCountryName } from '../../utils/country';

type TabType = 'hourly' | 'daily';

export default function ForecastScreen() {
  const router = useRouter();
  const { isFahrenheit } = useSettings();
  const { tab } = useLocalSearchParams<{ tab?: TabType }>();
  const activeTab: TabType = tab === 'daily' ? 'daily' : 'hourly';
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const { weekShort, weekLong } = useDateTranslations();
  const { activeLocation, locations } = useLocations();
  const { forecast, current, loading } = useWeather(activeLocation || 'Tbilisi');

  const locationCountry = current?.sys?.country || locations.find(l => l.name === activeLocation)?.country;

  // Parse Hourly Data
  const hourlyData = (forecast?.list || []).slice(0, 48).map((item, index) => {
    const date = new Date(item.dt * 1000);
    const hour = date.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    return {
      time: index === 0 ? t('weather.now') : `${hour12} ${ampm}`,
      dayInfo: index === 0 ? t('weather.today') : weekShort[date.getDay()],
      temp: item.main.temp,
      icon: item.weather[0]?.icon || '01d',
      desc: item.weather[0]?.main || t('home.clear'),
      pop: item.pop || 0
    };
  });

  // Parse Daily Data (group by day)
  const dailyMap = new Map();
  (forecast?.list || []).forEach(item => {
    const d = new Date(item.dt * 1000);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const dateStr = weekLong[d.getDay()];

    if (!dailyMap.has(key)) {
      dailyMap.set(key, {
        date: dateStr,
        dateObj: d,
        temp: item.main.temp,
        maxTemp: item.main.temp_max,
        minTemp: item.main.temp_min,
        icon: item.weather[0]?.icon || '01d',
        desc: item.weather[0]?.main || t('home.clear')
      });
    } else {
      const existing = dailyMap.get(key);
      if (item.main.temp_max > existing.maxTemp) existing.maxTemp = item.main.temp_max;
      if (item.main.temp_min < existing.minTemp) existing.minTemp = item.main.temp_min;
    }
  });
  const dailyData = Array.from(dailyMap.values());

  const activeDataList = activeTab === 'hourly' ? hourlyData : dailyData;

  return (
    <ThemedView themed maxWidth safe style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header]}>
        <Button 
          variant='secondary' 
          type='icon' 
          rounded='full' 
          size='md' 
          onPress={() => router.back()}
        >
          <ArrowLeft color={colors.text} size={24} />
        </Button>
        <View style={styles.headerTitle}>
          <ThemedText size="xl" type='label' weight="bold">{t('weather.forecast')}</ThemedText>
          <ThemedText size="sm" type='label' colorType="textSecondary" weight="medium" numberOfLines={1}>
            {`${activeLocation || t('home.unknown')}${locationCountry ? `, ${getCountryName(locationCountry)}` : ''}`}
          </ThemedText>
        </View>
        <View style={{ width: 44 }} />{/* Empty block for center alignment */}
      </View>

      {/* Tabs */}
      <ThemedView style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
         {(['hourly', 'daily'] as TabType[]).map(tValue => {
            const isActive = activeTab === tValue;
            return (
              <Button 
                key={tValue} 
                onPress={() => router.setParams({ tab: tValue })}
                variant={isActive ? 'primary' : 'secondary'}
                size='md'
                rounded='full'
                style={{ flex: 1, marginHorizontal: 6 }}
              >
                 <ThemedText 
                   weight={isActive ? 'bold' : 'medium'} 
                   style={{ 
                     textTransform: 'capitalize', 
                     color: isActive ? '#fff' : colors.textSecondary 
                   }}
                 >
                    {tValue === 'hourly' ? t('weather.hourly') : t('weather.daily')}
                 </ThemedText>
              </Button>
            );
         })}
      </ThemedView>
      
      {/* Loading State or List */}
      <View style={{ flex: 1 }}>
        {loading && !forecast ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <ScrollView 
            style={{ flex: 1 }} 
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'daily' && (
              <View style={{ paddingVertical: 20 }}>
                <MonthlyCalendar data={dailyData} />
              </View>
            )}

            {activeDataList.map((d, i) => {
              if (activeTab === 'hourly') {
                return (
                  <View key={i} style={[styles.hourlyRow, { borderBottomColor: colors.border }]}>
                    <View style={styles.hourlyTimeCol}>
                      <ThemedText weight={i === 0 ? 'bold' : 'semibold'} size="lg">
                        {d.time}
                      </ThemedText>
                      <ThemedText size="sm" colorType="textSecondary" weight="medium" style={{ marginTop: 2 }}>
                        {d.dayInfo}
                      </ThemedText>
                    </View>

                    <View style={styles.hourlyIconCol}>
                       <WeatherIcon code={d.icon} size={40} />
                       {d.pop !== undefined ? (
                         <View style={styles.hourlyPop}>
                           <Droplets size={10} color={isDark ? "#61c6ff" : "#0096ff"} />
                           <ThemedText style={{ color: isDark ? '#61c6ff' : '#0096ff', marginLeft: 2 }} size="xs" type='label' weight="bold">
                             {`${Math.round(d.pop * 100)}%`}
                           </ThemedText>
                         </View>
                       ) : (
                         <View style={styles.hourlyPop} /> // Placeholder to keep alignment
                       )}
                    </View>

                    <View style={styles.hourlyDescCol}>
                      <ThemedText weight="medium" size="md" colorType="textSecondary" numberOfLines={1}>
                        {d.desc}
                      </ThemedText>
                    </View>

                    <View style={styles.hourlyTempCol}>
                        <ThemedText weight="bold" size="2xl">
                          {`${formatTemp(d.temp, isFahrenheit)}°`}
                        </ThemedText>
                    </View>
                  </View>
                );
              }

              return (
                <View key={i} style={[styles.row, { borderBottomColor: colors.border }]}>
                  <ThemedText weight="semibold" style={{ width: 100, fontSize: 16 }}>
                      {d.date}
                  </ThemedText>
                  <View style={styles.centerCol}>
                      <WeatherIcon code={d.icon} size={36} />
                      <ThemedText colorType="textSecondary" size="sm" style={{ marginLeft: 12 }}>{d.desc}</ThemedText>
                  </View>
                  <View style={styles.rightCol}>
                      <ThemedText weight="bold" size="xl">{`${formatTemp(d.temp, isFahrenheit)}°`}</ThemedText>
                  </View>
                </View>
              );
            })}
            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 8,
  },
  headerTitle: {
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  centerCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  rightCol: {
    width: 60,
    alignItems: 'flex-end',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  hourlyTimeCol: {
    width: 70,
  },
  hourlyIconCol: {
    width: 60,
    alignItems: 'center',
  },
  hourlyPop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    height: 16,
  },
  hourlyDescCol: {
    flex: 1,
    paddingLeft: 12,
  },
  hourlyTempCol: {
    width: 65,
    alignItems: 'flex-end',
  }
});

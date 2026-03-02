import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDateTranslations, useLanguage } from '../../hooks/useLanguage';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../hooks/useTheme';
import { formatTemp } from '../../utils/conversions';
import { ThemedText } from '../ui/Text';
import { WeatherIcon } from '../WeatherIcon';

export interface CalendarDayData {
  dateObj: Date;
  temp: number;
  maxTemp: number;
  minTemp: number;
  icon: string;
}

interface MonthlyCalendarProps {
  data: CalendarDayData[];
}

export function MonthlyCalendar({ data }: MonthlyCalendarProps) {
  const { colors, isDark } = useTheme();
  const { isFahrenheit } = useSettings();
  const { t } = useLanguage();
  const { weekShort, monthsLong } = useDateTranslations();
  
  // Calculate rendering variables for the current month.
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0-6
  
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1);
  const remainingCells = (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7;
  const nextMonthDays = Array.from({ length: remainingCells }, (_, i) => i + 1);
  const weekDays = weekShort;

  // Correlate forecast objects with calendar dates locally
  const weatherMap = new Map<string, CalendarDayData>();
  data.forEach(d => {
    weatherMap.set(`${d.dateObj.getFullYear()}-${d.dateObj.getMonth()}-${d.dateObj.getDate()}`, d);
  });

  const renderCell = (day: number, w: CalendarDayData | undefined, isToday: boolean, isOtherMonth: boolean, keyPrefix: string) => {
    return (
      <View 
        key={`${keyPrefix}-${day}`} 
        style={[
          styles.cell, 
          isToday && { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 12 }
        ]}
      >
        <ThemedText 
          size="sm" 
          weight={isToday ? 'bold' : 'medium'} 
          style={[
            isToday ? { color: colors.accent } : { color: colors.textSecondary },
            isOtherMonth && { opacity: 0.3 }
          ]}
        >
          {day}
        </ThemedText>

        {w ? (
          <View style={[styles.weatherInfo, isOtherMonth && { opacity: 0.5 }]}>
            <WeatherIcon code={w.icon} size={24} />
            <ThemedText size="sm" weight="bold" style={{ marginTop: 2 }}>
              {`${formatTemp(w.temp, isFahrenheit)}°`}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.emptyInfo}>
             <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', opacity: isOtherMonth ? 0.3 : 1 }} />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <ThemedText weight="bold" size="lg">
           {`${monthsLong[month]} ${year}`}
         </ThemedText>
      </View>
      
      {/* Week Labels */}
      <View style={styles.daysRow}>
        {weekDays.map(d => (
          <ThemedText key={d} colorType="textSecondary" size="xs" weight="bold" style={styles.dayLabel}>
            {d}
          </ThemedText>
        ))}
      </View>

      {/* Grid of days */}
      <View style={styles.grid}>
        {/* Previous Month Days */}
        {prevMonthDays.map(day => {
          const dateKey = month === 0 ? `${year - 1}-11-${day}` : `${year}-${month - 1}-${day}`;
          const w = weatherMap.get(dateKey);
          return renderCell(day, w, false, true, 'prev');
        })}

        {/* Current Month Days */}
        {daysArray.map(day => {
          const dateKey = `${year}-${month}-${day}`;
          const w = weatherMap.get(dateKey);
          const isToday = day === today.getDate();
          return renderCell(day, w, isToday, false, 'curr');
        })}

        {/* Next Month Days */}
        {nextMonthDays.map(day => {
          const dateKey = month === 11 ? `${year + 1}-0-${day}` : `${year}-${month + 1}-${day}`;
          const w = weatherMap.get(dateKey);
          return renderCell(day, w, false, true, 'next');
        })}
      </View>

      <View style={styles.infoBox}>
        <ThemedText size="xs" colorType="textSecondary" style={{ textAlign: 'justify', lineHeight: 18 }}>
          {t('weather.noDataWindow')}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    minHeight: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  daysRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
  },
  cell: {
    width: '14.28%', // 7 columns
    aspectRatio: 0.6, // height > width for tall calendar feeling
    alignItems: 'center',
    paddingTop: 8,
  },
  weatherInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 4,
  },
  emptyInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(150,150,150,0.1)',
    alignItems: 'center',
  }
});

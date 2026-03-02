import { CloudRain, Droplets, Sun, Wind } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../hooks/useTheme';
import { formatSpeed, formatTemp } from '../../utils/conversions';
import { ThemedText } from '../ui/Text';

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {  
  return (
    <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View>
        <ThemedText style={styles.label} size="sm" colorType='textSecondary'>{label}</ThemedText>
        <ThemedText colorType='text' size='md' weight="bold">{value}</ThemedText>
      </View>
    </View>
  );
}

interface AirQualityCardProps {
  realFeel: number;
  windSpeed: number;
  chanceOfRain: number;
  uvIndex: number;
}

export function AirQualityCard({ realFeel, windSpeed, chanceOfRain, uvIndex }: AirQualityCardProps) {
  const { colors } = useTheme();
  const { isFahrenheit, isMph } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Wind color={colors.text} size={20} />
          <ThemedText style={styles.headerText} weight="semibold">Air Quality</ThemedText>
        </View>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        <DetailItem 
          icon={<Droplets color={colors.textSecondary} size={20} />}
          label="Real Feel"
          value={`${formatTemp(realFeel, isFahrenheit)}°`}
        />
        <DetailItem 
          icon={<Wind color={colors.textSecondary} size={20} />}
          label="Wind"
          value={`${formatSpeed(windSpeed, isMph)} ${isMph ? 'mph' : 'km/h'}`}
        />
        <DetailItem 
          icon={<CloudRain color={colors.textSecondary} size={20} />}
          label="Chance of Rain"
          value={`${chanceOfRain}%`}
        />
        <DetailItem 
          icon={<Sun color={colors.textSecondary} size={20} />}
          label="UV index"
          value={`${uvIndex}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  itemContainer: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginBottom: 4,
  },
});

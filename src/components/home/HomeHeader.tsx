import { ChevronDown, LayoutList, MapPin } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { getCountryName } from '../../utils/country';
import { Button } from '../ui';
import { ThemedText } from '../ui/Text';
import { ThemedView } from '../ui/View';

interface HomeHeaderProps {
  locationName: string;
  locationCountry?: string;
  status: string;
  onLocationPress?: () => void;
  onCurrentLocation?: () => void;
  onForecastPress?: () => void;
}

export function HomeHeader({ locationName, locationCountry, status, onLocationPress, onCurrentLocation, onForecastPress }: HomeHeaderProps) {
  const { colors } = useTheme();

  return (
    <ThemedView style={styles.container}>
      {/* Left Menu Button */}
      <Button variant='secondary' type='icon' rounded='full' size='md' onPress={onForecastPress}>
        <LayoutList color={colors.text} size={24} />
      </Button>


      {/* Middle Content */}
      <Pressable onPress={onLocationPress} style={{ flex: 1, paddingHorizontal: 10 }}>
        {({ pressed }) => (
          <ThemedView style={[styles.centerCol, pressed ? { opacity: 0.9 } : {}]}>
            <ThemedView style={[styles.locationRow, { flexShrink: 1 }]}>
              <MapPin color={colors.text} size={18} style={{ flexShrink: 0 }} />
              <ThemedText colorType='text' size='lg' weight="bold" numberOfLines={1} style={{ marginHorizontal: 6, flexShrink: 1 }}>
                {locationName}{locationCountry ? `, ${getCountryName(locationCountry)}` : ''}
              </ThemedText>
              <ChevronDown color={colors.text} size={18} style={{ flexShrink: 0 }} />
            </ThemedView>
            {/* <ThemedText colorType='textSecondary' size='sm' align="center">{status}</ThemedText> */}
          </ThemedView>
        )}
      </Pressable>

      {/* Right Menu Button */}
      <Button variant='secondary' type='icon' rounded='full' size='md' onPress={onCurrentLocation}>
        <MapPin color={colors.text} size={24} />
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    gap: 10,
    zIndex: 10,
  },
  centerCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 20,
    letterSpacing: 0.5,
  },
  statusText: {
    fontSize: 12,
    color: '#888',
  },
  rightButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

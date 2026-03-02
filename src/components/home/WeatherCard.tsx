import { useTheme } from '@/hooks/useTheme';
import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import { Animated as RNAnimated, StyleSheet, View } from 'react-native';
import Animated, { Extrapolation, SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useLanguage } from '../../hooks/useLanguage';
import { useSettings } from '../../hooks/useSettings';
import { formatTemp } from '../../utils/conversions';
import { ThemedText } from '../ui/Text';
import { WeatherIcon } from '../WeatherIcon';
import { ParticleType } from './WeatherParticles';

export function getParticleType(iconCode: string, condition: string): ParticleType {
  let particleType: ParticleType = 'none';
  const lowerCondition = condition.toLowerCase();
  
  if (iconCode.includes('13') || lowerCondition.includes('snow')) {
    particleType = 'snow';
  } else if (
    iconCode.includes('09') || 
    iconCode.includes('10') || 
    iconCode.includes('11') ||
    lowerCondition.includes('rain') ||
    lowerCondition.includes('drizzle') ||
    lowerCondition.includes('thunder')
  ) {
    particleType = 'rain';
  } else if (
    iconCode.includes('50') ||
    lowerCondition.includes('mist') ||
    lowerCondition.includes('fog') ||
    lowerCondition.includes('haze') ||
    lowerCondition.includes('smoke')
  ) {
    particleType = 'mist';
  }
  return particleType;
}

const ISLAND_IMAGES = {
  spring: require('../../assets/images/home/house-spring.png'),
  summer: require('../../assets/images/home/house-summer.png'),
  autumn: require('../../assets/images/home/house-autumn.png'),
  winter: require('../../assets/images/home/house-winter.png'),
};

interface WeatherCardProps {
  temperature: number;
  condition: string;
  iconCode: string;
  date: string;
  minTemp?: number;
  maxTemp?: number;
  feelsLike?: number;
  scrollY?: SharedValue<number>;
}

export function WeatherCard({ temperature, condition, iconCode, date, minTemp, maxTemp, feelsLike, scrollY }: WeatherCardProps) {
  const { isDark } = useTheme();
  const { isFahrenheit } = useSettings();
  const { t } = useLanguage();
  
  // Decide which 3D island image to show based on the current month (Northern Hemisphere approximation)
  const currentMonth = new Date().getMonth();
  let islandImage = ISLAND_IMAGES.summer;
  if (currentMonth >= 2 && currentMonth <= 4) islandImage = ISLAND_IMAGES.spring;
  else if (currentMonth >= 8 && currentMonth <= 10) islandImage = ISLAND_IMAGES.autumn;
  else if (currentMonth === 11 || currentMonth <= 1) islandImage = ISLAND_IMAGES.winter;



  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    return {
      opacity: interpolate(scrollY.value, [0, 450], [1, 0], Extrapolation.CLAMP),
      transform: [
        { translateY: interpolate(scrollY.value, [0, 450], [0, 80], Extrapolation.CLAMP) },
        { scale: interpolate(scrollY.value, [0, 450], [1, 0.9], Extrapolation.CLAMP) }
      ]
    };
  });

  const floatAnim = useRef(new RNAnimated.Value(-10)).current;

  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(floatAnim, {
          toValue: 10,
          duration: 2500,
          useNativeDriver: true,
        }),
        RNAnimated.timing(floatAnim, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [floatAnim]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      
      {/* 3D Hero Art (Centered but slightly pushed down natively by layout) */}
      <View style={styles.heroContainer}>
        <RNAnimated.View style={[{ width: 320, height: 320, alignItems: 'center', justifyContent: 'center', transform: [{ translateY: floatAnim }] }]}>
          <Image 
            source={islandImage} 
            style={styles.heroImage} 
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </RNAnimated.View>
      </View>

      {/* Foreground Content Overlay */}
      <View style={styles.overlayContent}>
        
        {/* Left Side */}
        <View style={styles.leftCol}>
          <ThemedText 
            style={[styles.mainCondition, { textShadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}]} 
            weight="bold"
            size="4xl"
            type='title'
            numberOfLines={1}
          >
            {condition}
          </ThemedText>
          <View style={styles.leftSubRow}>
             {feelsLike !== undefined && (
               <ThemedText 
                 style={[styles.subText, { textShadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)' }]} 
                 weight="semibold"
               >
                 {`${t('weather.feelsLike')} ${formatTemp(feelsLike, isFahrenheit)}°`}
               </ThemedText>
             )}
          </View>
          <ThemedText style={[styles.subText, { textShadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)' }]} weight="semibold">{date}</ThemedText>
        </View>

        {/* Right Side */}
        <View style={styles.rightCol}>
          <View style={styles.iconBox}>
             <WeatherIcon code={iconCode} size={64} />
          </View>
          
          <View style={styles.tempBlock}>
            <ThemedText style={[styles.bigTemp, { textShadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)' }]} weight="black">
              {formatTemp(temperature, isFahrenheit)}<ThemedText size="4xl" type='title' weight="black">°</ThemedText>
            </ThemedText>
            
            <View style={styles.highLowStack}>
              {maxTemp !== undefined && (
                <ThemedText style={[styles.hlText, { textShadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)' }]} weight="bold">{t('weather.high')}:{formatTemp(maxTemp, isFahrenheit)}°</ThemedText>
              )}
              {minTemp !== undefined && (
                <ThemedText style={[styles.hlText, { textShadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)' }]} weight="bold">{t('weather.low')}:{formatTemp(minTemp, isFahrenheit)}°</ThemedText>
              )}
            </View>
          </View>
        </View>

      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 440, // Fixed height space to embed the hero art
    width: '100%',
    position: 'relative',
    marginBottom: 10,
    backgroundColor: 'transparent',
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    top: 40, // Push the island down slightly so it's centered
    zIndex: 1,
  },
  heroImage: {
    width: "100%",
    aspectRatio: 1,
  },

  overlayContent: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 2,
    pointerEvents: 'none', // ensures image scrolling beneath isn't blocked 
  },

  // Left Side
  leftCol: {
    alignItems: 'flex-start',
    paddingTop: 16,
    maxWidth: '60%', // Prevent text wrapping from breaking out
    paddingRight: 10,
  },
  mainCondition: {
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    flexShrink: 1, // ensure it shrinks cleanly
  },
  leftSubRow: {
    marginBottom: 12,
  },
  subText: {
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Right Side
  rightCol: {
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingRight: 4,
    maxWidth: '40%', // Rigid right side boundary
  },
  iconBox: {
    marginBottom: -5,
  },
  tempBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bigTemp: {
    fontSize: 64,
    lineHeight: 74,
    alignItems: 'flex-start',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  highLowStack: {
    marginLeft: 8,
    justifyContent: 'center',
    gap: 4,
  },
  hlText: {
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  }
});

import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export type ParticleType = 'rain' | 'snow' | 'mist' | 'none';

interface WeatherParticlesProps {
  type: ParticleType;
}

const PARTICLE_COUNT = 40;

function Particle({ type }: { type: ParticleType }) {
  const y = useSharedValue(-50);
  
  const startX = Math.random() * width;
  const startYOffset = Math.random() * -height;
  
  const size = type === 'snow' ? Math.random() * 4 + 3 : Math.random() * 2 + 1;
  const duration = type === 'snow' ? Math.random() * 3000 + 4000 : Math.random() * 800 + 1000;
  
  const delay = Math.random() * 2000;
  const opacityVal = type === 'snow' ? Math.random() * 0.6 + 0.4 : Math.random() * 0.4 + 0.2;

  useEffect(() => {
    y.value = startYOffset; 
    
    y.value = withDelay(
      delay,
      withRepeat(
        withTiming(height + 100, {
          duration: duration * (height / 350), // Scale duration up to match new huge drop distance
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [type, delay, duration, startYOffset]); // eslint-disable-line react-hooks/exhaustive-deps

  const animatedStyle = useAnimatedStyle(() => {
    const drift = type === 'snow' ? Math.sin(y.value / 40) * 30 : 0;
    return {
      transform: [
        { translateY: y.value },
        { translateX: drift }
      ],
      opacity: y.value > height - 100 ? withTiming(0, { duration: 300 }) : opacityVal, 
    };
  });

  if (type === 'none') return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: startX,
          width: type === 'snow' ? size : 2,
          height: type === 'snow' ? size : 14,
          backgroundColor: type === 'rain' ? '#a4c9e8' : '#ffffff',
          borderRadius: type === 'snow' ? size / 2 : 1,
        },
        animatedStyle,
      ]}
    />
  );
}

function FogLayer({ startY, cloudWidth, fogHeight, opacity, duration, startDelay, reverse }: {
  startY: number; cloudWidth: number; fogHeight: number; opacity: number; duration: number; startDelay: number; reverse?: boolean;
}) {
  const x = useSharedValue(reverse ? width + 50 : -cloudWidth - 50);
  const floatY = useSharedValue(0);
  const fadeBreath = useSharedValue(opacity * 0.6);

  useEffect(() => {
    // Horizontal drift
    x.value = withDelay(
      startDelay,
      withRepeat(
        withTiming(reverse ? -cloudWidth - 50 : width + 50, { duration, easing: Easing.linear }),
        -1,
        false
      )
    );

    // Gentle vertical float (bob up and down)
    floatY.value = withDelay(
      startDelay,
      withRepeat(
        withTiming(12, { duration: 4000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true  // reverse = gentle oscillation
      )
    );

    // Opacity breathing
    fadeBreath.value = withDelay(
      startDelay,
      withRepeat(
        withTiming(opacity, { duration: 3000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: floatY.value },
    ],
    opacity: fadeBreath.value,
  }));

  return (
    <Animated.View style={[
      {
        position: 'absolute',
        top: startY,
        width: cloudWidth,
        height: fogHeight,
        borderRadius: fogHeight / 2,
        backgroundColor: `rgba(200, 210, 220, ${opacity})`,
        shadowColor: '#d0d8e0',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: opacity * 1.5,
        shadowRadius: 40,
      },
      animStyle,
    ]} />
  );
}

function MistEffect() {
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      {/* Left-to-right layers */}
      <FogLayer startY={height * 0.1}  cloudWidth={width * 1.5} fogHeight={80} opacity={0.16} duration={16000} startDelay={0} />
      <FogLayer startY={height * 0.3}  cloudWidth={width * 1.2} fogHeight={120} opacity={0.2}  duration={20000} startDelay={1500} />
      <FogLayer startY={height * 0.6}  cloudWidth={width} fogHeight={100} opacity={0.14} duration={13000} startDelay={3000} />
      <FogLayer startY={height * 0.8}  cloudWidth={width * 1.3} fogHeight={90} opacity={0.18} duration={22000} startDelay={500} />

      {/* Right-to-left counter-flowing layers for realism */}
      <FogLayer startY={height * 0.2}  cloudWidth={width * 1.4} fogHeight={110} opacity={0.13} duration={18000} startDelay={2500} reverse />
      <FogLayer startY={height * 0.5}  cloudWidth={width * 1.6} fogHeight={130} opacity={0.17} duration={24000} startDelay={4000} reverse />
      <FogLayer startY={height * 0.75} cloudWidth={width * 1.1} fogHeight={85} opacity={0.1}  duration={15000} startDelay={7000} reverse />
    </View>
  );
}

export function WeatherParticles({ type }: WeatherParticlesProps) {
  if (type === 'none') return null;

  if (type === 'mist') {
    return (
      <View style={styles.container} pointerEvents="none">
        <MistEffect />
      </View>
    );
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle key={i} type={type} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 99, // Ensure it's on top of background elements but under high zIndex UI
  }
});

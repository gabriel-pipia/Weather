import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
  isAppReady: boolean;
}

// Floating weather particle for ambient effect
function SplashParticle({ delay, startX, size, duration, type, isDark }: {
  delay: number; startX: number; size: number; duration: number; type: 'snow' | 'rain'; isDark: boolean;
}) {
  const y = useSharedValue(-size);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(type === 'snow' ? 0.6 : 0.3, { duration: 400 }));
    y.value = withDelay(
      delay,
      withRepeat(
        withTiming(height + size, {
          duration,
          easing: Easing.linear
        }),
        -1,
        false
      )
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const animStyle = useAnimatedStyle(() => {
    const drift = type === 'snow' ? Math.sin(y.value / 40) * 15 : 0;
    return {
      transform: [{ translateY: y.value }, { translateX: drift }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[{
      position: 'absolute',
      left: startX,
      top: 0,
      width: type === 'snow' ? size : 2,
      height: type === 'snow' ? size : size * 3,
      borderRadius: type === 'snow' ? size / 2 : 1,
      backgroundColor: isDark 
        ? (type === 'snow' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)')
        : (type === 'snow' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.05)'),
    }, animStyle]} />
  );
}

export function AnimatedSplash({ onFinish, isAppReady }: SplashScreenProps) {
  const { isDark, colors } = useTheme();
  const iconScale = useSharedValue(0.4);
  const iconOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const pulse = useSharedValue(1);

  // Generate random particles (snow and rain blend)
  const particles = React.useMemo(() =>
    Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 2000,
      startX: Math.random() * width,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3000 + 4000,
      type: (i % 2 === 0 ? 'rain' : 'snow') as 'rain' | 'snow',
    })),
  []);

  useEffect(() => {
    // Elegant, smooth icon entrance
    iconScale.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.exp) });
    iconOpacity.value = withTiming(1, { duration: 700 });

    // Smooth staggered text entrance
    setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 700 });
    }, 400);

    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, { duration: 700 });
    }, 600);

    // Subtle gentle breathing pulse on icon
    setTimeout(() => {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, true
      );
    }, 900);

    // Set minimum display time, otherwise it flashes and looks broken
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [minTimeElapsed, setMinTimeElapsed] = React.useState(false);

  useEffect(() => {
    // Only dismiss when both minimum 2s have passed AND app context is fully loaded
    if (minTimeElapsed && isAppReady) {
      onFinish();
    }
  }, [minTimeElapsed, isAppReady, onFinish]);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value * pulse.value }],
    opacity: iconOpacity.value,
  }));

  const titleAnimStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: withTiming(titleOpacity.value > 0.5 ? 0 : 10, { duration: 700, easing: Easing.out(Easing.exp) }) }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(500)}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Weather particles background ambient effect */}
      {particles.map(p => (
        <SplashParticle key={p.id} {...p} isDark={isDark} />
      ))}

      {/* Main Center Content */}
      <View style={styles.centerContent}>
        {/* Simplified, elegant App Icon */}
        <Animated.View style={[styles.iconContainer, iconAnimStyle]}>
          {/* Subtle drop shadow glow matching text theme slowly pulsing behind icon */}
          <View style={[styles.iconGlow, {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
            shadowColor: colors.text,
          }]} />
          
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.icon}
            contentFit="contain"
          />
        </Animated.View>

        {/* Clean, themed Title */}
        <Animated.Text style={[styles.title, { color: colors.text }, titleAnimStyle]}>
          Weather
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40, // Offset slightly above perfect center for elegance
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 35,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
});

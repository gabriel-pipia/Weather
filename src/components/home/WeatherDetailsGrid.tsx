import { format } from 'date-fns';
import { Droplet, Eye, FoldVertical, Sun, Thermometer, Wind } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Line, Path, Polygon, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { useLanguage } from '../../hooks/useLanguage';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../hooks/useTheme';
import { formatSpeed, formatTemp } from '../../utils/conversions';
import { ThemedView } from '../ui';
import { ThemedText } from '../ui/Text';

interface WeatherDetailsGridProps {
  current: any; // OWM current weather object
}

// Helper to derive UV Index (Mock since OWM standard doesn't provide it)
function getUVIndex(temp: number, clouds: number) {
  if (clouds > 80) return { val: 1, label: 'Low', desc: 'Low right now' };
  if (temp > 30) return { val: 8, label: 'Very High', desc: 'Use sun protection' };
  if (temp > 25) return { val: 6, label: 'High', desc: 'Use sun protection' };
  if (temp > 15) return { val: 3, label: 'Moderate', desc: 'Moderate right now' };
  return { val: 1, label: 'Low', desc: 'Low right now' };
}

// Helper for Humidity
function getHumidityDesc(humidity: number) {
  if (humidity < 30) return 'Lower than usual';
  if (humidity > 70) return 'Higher than usual';
}
  
 // Helper for Dew point (approx)
 function getDewPoint(T: number, RH: number) {
   const ans = T - ((100 - RH) / 5);
   return Math.round(ans);
 }
 
 function getDewPointDesc(dp: number) {
   if (dp < 10) return 'The air is very dry';
   if (dp > 20) return 'It feels muggy';
   return 'Comfortable';
 }


function formatTime24(timestamp: number) {
  return format(new Date(timestamp * 1000), 'HH:mm');
}

// Helper for Wind
function getWindDesc(speed: number) {
  if (speed < 5) return 'Calm winds';
  if (speed < 20) return 'There is a light breeze';
  if (speed < 40) return 'It is breezy';
  return 'Strong winds today';
}

// Helper for Pressure
function getPressureDesc(pressure: number) {
  if (pressure > 1020) return 'Currently rising rapidly';
  if (pressure < 1005) return 'Currently falling';
  return 'Steady pressure';
}

// Helper for Visibility
function getVisibilityDesc(vis: number) {
  if (vis >= 10) return 'Unlimited visibility';
  if (vis > 5) return 'Good visibility';
  return 'Reduced visibility';
}

export function WeatherDetailsGrid({ current }: WeatherDetailsGridProps) {
  const { colors, isDark } = useTheme();
  const { isFahrenheit, isMph } = useSettings();
  const { t } = useLanguage();

  if (!current) return null;

  const uv = getUVIndex(current.main.temp, current.clouds.all);
  const humDesc = getHumidityDesc(current.main.humidity);
  
  // Speed is meters/sec from API. 
  const windDisplay = formatSpeed(current.wind.speed, isMph);
  const windDesc = getWindDesc(current.wind.speed * 3.6); 
  const pressureDesc = getPressureDesc(current.main.pressure);
  
  const dpOriginal = getDewPoint(current.main.temp, current.main.humidity);
  const dpDisplay = formatTemp(dpOriginal, isFahrenheit);
  const dpDesc = getDewPointDesc(dpOriginal);
  
  const visValue = isMph ? (current.visibility / 1609.34).toFixed(1) : (current.visibility / 1000).toFixed(1);
  const visLabel = isMph ? t('units.mi') : t('units.km');
  const visDesc = getVisibilityDesc(current.visibility / 1000);

  return (
    <View style={styles.grid}>

      {/* 1. UV Index */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}>
          <Sun size={14} color={colors.textSecondary} />
          <ThemedText colorType="textSecondary" size="xs" weight="semibold" style={{ marginLeft: 6 }}>{t('details.uvIndex')}</ThemedText>
        </View>
        <ThemedText colorType="textSecondary" size="sm" style={styles.descLine}>{uv.desc}</ThemedText>

        <View style={styles.bottomContent}>
          <ThemedView
            style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
            <ThemedText size="2xl" weight="bold">{uv.label}</ThemedText>
            <ThemedText size='3xl' colorType='text'>
              {uv.val}
            </ThemedText>
          </ThemedView>
          <View style={styles.uvBarContainer}>
            <Svg width="100%" height="10" style={{ borderRadius: 5, overflow: 'hidden' }}>
              <Defs>
                <SvgLinearGradient id="uvGradient" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#a8d839" />
                  <Stop offset="0.25" stopColor="#f2d12e" />
                  <Stop offset="0.5" stopColor="#f18a24" />
                  <Stop offset="0.75" stopColor="#e73a3c" />
                  <Stop offset="1" stopColor="#b65edd" />
                </SvgLinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" rx="5" ry="5" fill="url(#uvGradient)" />
            </Svg>
            <View style={[styles.uvDot, { 
              left: `${Math.max(5, Math.min(95, (uv.val / 11) * 100))}%`,
              backgroundColor: colors.surface,
              borderColor: isDark ? colors.white : colors.black
            }]} />
          </View>
        </View>
      </View>

      {/* 2. Humidity */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}>
          <Droplet size={14} color={colors.textSecondary} />
          <ThemedText colorType="textSecondary" size="xs" weight="semibold" style={{ marginLeft: 6 }}>{t('details.humidity')}</ThemedText>
        </View>
        <ThemedText colorType="textSecondary" size="sm" style={styles.descLine}>{humDesc}</ThemedText>

        <View style={styles.bottomContent}>
          <ThemedText size="3xl" weight="bold" style={styles.mainValue}>{current.main.humidity}%</ThemedText>
          <View style={styles.humBarContainer}>
             <View style={[styles.humFill, { width: `${current.main.humidity}%` }]} />
          </View>
        </View>
      </View>

      {/* 3. Wind */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}>
          <Wind size={14} color={colors.textSecondary} />
          <ThemedText colorType="textSecondary" size="xs" weight="semibold" style={{ marginLeft: 6 }}>{t('details.wind')}</ThemedText>
        </View>
        <ThemedText colorType="textSecondary" size="sm" style={styles.descLine}>{windDesc}</ThemedText>

        <View style={[styles.bottomContent, styles.centerBlock]}>
          <View style={styles.compassCircle}>
            <Svg width="110" height="110" viewBox="0 0 110 110" style={{ position: 'absolute' }}>
              <Circle cx="55" cy="55" r="46" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} strokeWidth="6" fill="none" />
              <Polygon 
                points="55,16 59,25 51,25" 
                fill={colors.text} 
                transform={`rotate(${current.wind.deg || 0}, 55, 55)`} 
              />
            </Svg>
            
            {/* Compass Directions */}
            <ThemedText style={{ position: 'absolute', top: 3, fontSize: 10, fontWeight: '900', color: isDark ? '#ff4f4f' : '#e63946' }}>{t('compass.N')}</ThemedText>
            <ThemedText style={{ position: 'absolute', bottom: 3, fontSize: 10, fontWeight: '700', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>{t('compass.S')}</ThemedText>
            <ThemedText style={{ position: 'absolute', right: 5, fontSize: 10, fontWeight: '700', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>{t('compass.E')}</ThemedText>
            <ThemedText style={{ position: 'absolute', left: 4, fontSize: 10, fontWeight: '700', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>{t('compass.W')}</ThemedText>
            
            <ThemedText style={{ position: 'absolute', top: 16, right: 16, fontSize: 8, fontWeight: '700', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }}>{t('compass.NE')}</ThemedText>
            <ThemedText style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 8, fontWeight: '700', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }}>{t('compass.SE')}</ThemedText>
            <ThemedText style={{ position: 'absolute', bottom: 16, left: 16, fontSize: 8, fontWeight: '700', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }}>{t('compass.SW')}</ThemedText>
            <ThemedText style={{ position: 'absolute', top: 16, left: 16, fontSize: 8, fontWeight: '700', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }}>{t('compass.NW')}</ThemedText>

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <ThemedText size="2xl" weight="bold" style={{ marginBottom: -2 }}>{`${windDisplay}`}</ThemedText>
              <ThemedText size="sm" colorType="textSecondary" weight="bold">{isMph ? t('units.mph') : t('units.kmh')}</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* 4. Dew point */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Thermometer size={14} color={colors.textSecondary} style={{ marginRight: -4 }} />
            <Droplet size={10} color={colors.textSecondary} />
          </View>
          <ThemedText colorType="textSecondary" size="xs" weight="semibold" style={{ marginLeft: 6 }}>{t('details.dewPoint')}</ThemedText>
        </View>
        <ThemedText colorType="textSecondary" size="sm" style={styles.descLine}>{dpDesc}</ThemedText>

        <View style={styles.bottomContent}>
          <ThemedText size="3xl" weight="bold" style={styles.mainValue}>{dpDisplay}°</ThemedText>
        </View>
      </View>


      {/* 5. Sunrise Visual Card (New Minimalist Design) */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, padding: 0, overflow: 'hidden', width: '100%', minHeight: 180, borderRadius: 24 }]}>
        <View style={{ flex: 1, position: 'relative' }}>
          
          <Svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="none" style={{ position: 'absolute' }}>
            <Defs>
              <SvgLinearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="180" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#FFC107" />
                <Stop offset="0.555" stopColor="#FFC107" />
                <Stop offset="0.555" stopColor={colors.textSecondary} stopOpacity="0.25" />
                <Stop offset="1" stopColor={colors.textSecondary} stopOpacity="0.25" />
              </SvgLinearGradient>
            </Defs>

            {/* Path curve */}
            <Path 
              d="M -20 140 C 60 140, 80 20, 150 20 C 220 20, 240 140, 320 140" 
              stroke="url(#pathGradient)" 
              strokeWidth="2.5" 
              fill="none" 
            />

            {/* Darker overlay for below the horizon */}
            <Rect x="0" y="100" width="300" height="80" fill={colors.border} opacity="0.3" />

            {/* Horizon Line */}
            <Line x1="0" y1="100" x2="300" y2="100" stroke={colors.border} strokeWidth="1" strokeOpacity="0.5" />
          </Svg>

          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 28, paddingBottom: 24 }}>
            <View>
              <ThemedText colorType="text" size="lg" style={{ marginBottom: 4 }}>{t('details.sunrise')}</ThemedText>
              <ThemedText size="3xl" weight="bold">{formatTime24(current.sys.sunrise)}</ThemedText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <ThemedText colorType="text" size="lg" style={{ marginBottom: 4 }}>{t('details.sunset')}</ThemedText>
              <ThemedText size="3xl" weight="bold">{formatTime24(current.sys.sunset)}</ThemedText>
            </View>
          </View>

        </View>
      </View>

      {/* 6. Pressure Visual Card */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, padding: 16 }]}>
        <View style={styles.header}>
          <FoldVertical size={16} color={colors.textSecondary} />
          <ThemedText colorType="textSecondary" size="xs" weight="semibold" style={{ marginLeft: 6 }}>{t('details.pressure')}</ThemedText>
        </View>
        <ThemedText colorType="textSecondary" size="sm" style={styles.descLine}>
          {pressureDesc}
        </ThemedText>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 }}>
          <View style={{ position: 'relative', width: 140, height: 140, justifyContent: 'center', alignItems: 'center' }}>
            {(() => {
              const radius = 60;
              const circumference = Math.PI * 2 * radius;
              const arcLength = (260 / 360) * circumference;
              
              // Typical pressure range: ~970mb to 1050mb
              const minP = 970;
              const maxP = 1050;
              let progress = (current.main.pressure - minP) / (maxP - minP);
              progress = Math.max(0, Math.min(1, progress));
              const activeLength = progress * arcLength;
              
              return (
                <Svg width="140" height="140" viewBox="0 0 140 140">
                  {/* Background Track */}
                  <Circle 
                    cx="70" cy="70" r={radius} 
                    stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"} strokeWidth="12" fill="none" 
                    strokeLinecap="round" 
                    strokeDasharray={`${arcLength} ${circumference}`} 
                    transform="rotate(140, 70, 70)" 
                  />
                  
                  {/* Ticks Inside the loop */}
                  {Array.from({ length: 41 }).map((_, i) => {
                    const deg = -130 + (i / 40) * 260;
                    const isMajor = i % 10 === 0;
                    return (
                      <Line 
                        key={i} x1="70" y1={isMajor ? 14 : 16} x2="70" y2="20" 
                        stroke={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"} strokeWidth={1}
                        transform={`rotate(${deg}, 70, 70)`} 
                      />
                    );
                  })}
                  
                  {/* Active Track Overlay */}
                  <Circle 
                    cx="70" cy="70" r={radius} 
                    stroke={colors.accent} strokeWidth="12" fill="none" 
                    strokeLinecap="round" 
                    strokeDasharray={`${activeLength} ${circumference}`} 
                    transform="rotate(140, 70, 70)" 
                  />
                  
                  {/* Thumb Indicator */}
                  <Line 
                    x1="70" y1="4" x2="70" y2="16" 
                    stroke={colors.text} strokeWidth="2" strokeLinecap="round"
                    transform={`rotate(${-130 + progress * 260}, 70, 70)`} 
                  />
                </Svg>
              );
            })()}

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', paddingTop: 24 }}>
              <ThemedText style={{ fontSize: 26, fontWeight: '500' }} colorType='text'>{current.main.pressure.toFixed(1)}</ThemedText>
              <ThemedText style={{ fontSize: 22, fontWeight: '500', marginTop: 0 }} colorType='text'>{t('units.mb')}</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* 7. Visibility */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}>
          <Eye size={14} color={colors.textSecondary} />
          <ThemedText colorType="textSecondary" size="xs" weight="semibold">{t('details.visibility')}</ThemedText>
        </View>
        <ThemedText colorType="textSecondary" size="sm" style={styles.descLine}>{visDesc}</ThemedText>

        <View style={styles.bottomContent}>
          <ThemedText size="3xl" weight="bold" style={styles.mainValue}>{visValue}</ThemedText>
          <ThemedText size="lg" weight="bold">{visLabel}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    width: '48%',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderBottomWidth: 3,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.8,
  },
  descLine: {
    marginTop: 8,
    minHeight: 40,
    lineHeight: 18,
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  mainValue: {
    marginBottom: 8,
  },
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uvBarContainer: {
    height: 8,
    width: '100%',
    position: 'relative',
    marginTop: 8,
  },
  uvDot: {
    position: 'absolute',
    top: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginLeft: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  humBarContainer: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    overflow: 'hidden',
  },
  humFill: {
    height: '100%',
    backgroundColor: '#61c6ff',
    borderRadius: 6,
  },
  compassCircle: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 10,
  },

});

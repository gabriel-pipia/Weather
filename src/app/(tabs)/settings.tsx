import { Bell, Globe, Info, MapPin, Moon, RefreshCcw, Settings2, Shield, Smartphone, Sun, Thermometer, Wind } from 'lucide-react-native';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Switch } from '../../components/ui/Switch';
import { LanguageSheet } from '../../components/settings/LanguageSheet';
import { LocalWeatherSheet } from '../../components/settings/LocalWeatherSheet';
import { SettingRow } from '../../components/settings/SettingRow';
import { TermsSheet } from '../../components/settings/TermsSheet';
import { ThemedText } from '../../components/ui/Text';
import { ThemedView } from '../../components/ui/View';
import { useLanguage } from '../../hooks/useLanguage';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const { showToast } = useToast();
  
  const {
    isFahrenheit, setIsFahrenheit,
    isMph, setIsMph,
    autoRefresh, setAutoRefresh,
    localWeather, setLocalWeather,
    notifications, setNotifications
  } = useSettings();

  const { t, language } = useLanguage();

  const [localWeatherSheetVisible, setLocalWeatherSheetVisible] = useState(false);
  const [termsSheetVisible, setTermsSheetVisible] = useState(false);
  const [languageSheetVisible, setLanguageSheetVisible] = useState(false);

  const renderThemeButton = (themeMode: 'light' | 'dark' | 'system', icon: React.ReactNode, label: string) => {
    const isActive = mode === themeMode;
    return (
      <TouchableOpacity 
        style={[
          styles.themeButton,
          { 
            backgroundColor: isActive ? colors.accent : colors.surface,
            borderColor: isActive ? colors.accent : colors.border,
            borderBottomWidth: isActive ? 1 : 3,
            transform: [{ translateY: isActive ? 2 : 0 }]
          }
        ]}
        onPress={() => setMode(themeMode)}
        activeOpacity={0.8}
      >
        {isActive && (
          <View style={styles.activeIndicator}>
            <View style={[styles.activeDot, { backgroundColor: colors.accent }]} />
          </View>
        )}
        <View style={[
          styles.themeIconContainer,
          { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent' }
        ]}>
          {React.cloneElement(icon as React.ReactElement<{ color: string, size: number }>, {
            color: isActive ? '#fff' : (colors.textSecondary as string),
            size: 28
          })}
        </View>
        <ThemedText 
          style={{ 
            color: isActive ? '#fff' : colors.textSecondary,
            marginTop: 12,
            fontSize: 14,
            fontWeight: isActive ? '700' : '600'
          }}
        >
          {label}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView themed safe maxWidth={true} style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText size="3xl" colorType="text" weight="bold" type='title'>{t('settings.title')}</ThemedText>
      </ThemedView>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >

        {/* Units Section */}
        <ThemedText colorType="textSecondary" weight="medium" style={[styles.sectionTitle, { marginTop: 28 }]}>
          {t('settings.units')}
        </ThemedText>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingRow
            icon={<Thermometer />} 
            label={t('settings.temperatureUnit')} 
            onPress={() => setIsFahrenheit(!isFahrenheit)}
            rightElement={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText colorType={!isFahrenheit ? 'text' : 'textSecondary'} weight={!isFahrenheit ? 'bold' : 'regular'} style={{ marginRight: 8 }}>°C</ThemedText>
                <Switch 
                  value={isFahrenheit} 
                  onValueChange={setIsFahrenheit} 
                />
                <ThemedText colorType={isFahrenheit ? 'text' : 'textSecondary'} weight={isFahrenheit ? 'bold' : 'regular'} style={{ marginLeft: 8 }}>°F</ThemedText>
              </View>
            }
          />
          <SettingRow
            icon={<Wind />} 
            label={t('settings.windSpeed')} 
            onPress={() => setIsMph(!isMph)}
            hideBorder
            rightElement={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText colorType={!isMph ? 'text' : 'textSecondary'} weight={!isMph ? 'bold' : 'regular'} style={{ marginRight: 8 }}>km/h</ThemedText>
                <Switch 
                  value={isMph} 
                  onValueChange={setIsMph} 
                />
                <ThemedText colorType={isMph ? 'text' : 'textSecondary'} weight={isMph ? 'bold' : 'regular'} style={{ marginLeft: 8 }}>mph</ThemedText>
              </View>
            }
          />
        </View>

        {/* Location & Updates Section */}
        <ThemedText colorType="textSecondary" weight="medium" style={[styles.sectionTitle, { marginTop: 28 }]}>
          {t('settings.locationUpdates')}
        </ThemedText>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingRow
            icon={<RefreshCcw />} 
            onPress={() => setAutoRefresh(!autoRefresh)}
            label={t('settings.autoRefresh')}
            rightElement={
              <Switch 
                value={autoRefresh} 
                onValueChange={setAutoRefresh} 
              />
            }
          />
          <SettingRow
            icon={<MapPin />} 
            label={t('settings.localWeather')}
            rightElement={<ThemedText colorType="textSecondary">{localWeather ? t('common.on') : t('common.off')}</ThemedText>}
            onPress={() => setLocalWeatherSheetVisible(true)}
            hideBorder
          />
        </View>

        {/* Alerts & Permissions Section */}
        <ThemedText colorType="textSecondary" weight="medium" style={[styles.sectionTitle, { marginTop: 28 }]}>
          {t('settings.alertsPermissions')}
        </ThemedText>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingRow
            icon={<Bell />} 
            label={t('settings.notifications')} 
            rightElement={
              <Switch 
                value={notifications} 
                onValueChange={setNotifications} 
              />
            }
          />
          <SettingRow
            icon={<Globe />} 
            label={t('settings.language')}
            rightElement={<ThemedText colorType="textSecondary">{language === 'ka' ? t('common.georgian') : t('common.english')}</ThemedText>}
            onPress={() => setLanguageSheetVisible(true)}
          />
          <SettingRow
            icon={<Shield />} 
            label={t('settings.permissions')}
            rightElement={<ThemedText colorType="textSecondary">{'>'}</ThemedText>}
            onPress={() => {
              if (Platform.OS !== 'web') Linking.openSettings();
            }}
            hideBorder
          />
        </View>

        {/* Appearance Section */}
        <ThemedText colorType="textSecondary" weight="medium" style={[styles.sectionTitle, { marginTop: 28 }]}>
          {t('settings.appearance')}
        </ThemedText>
        <View style={styles.themeGroup}>
          {renderThemeButton('system', <Smartphone size={24} />, t('settings.system'))}
          {renderThemeButton('light', <Sun size={24} />, t('settings.light'))}
          {renderThemeButton('dark', <Moon size={24} />, t('settings.dark'))}
        </View>

        {/* About Section */}
        <ThemedText colorType="textSecondary" weight="medium" style={[styles.sectionTitle, { marginTop: 28 }]}>
          {t('settings.about')}
        </ThemedText>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingRow
            icon={<Settings2 />} 
            label={t('settings.termsPrivacy')} 
            rightElement={<ThemedText colorType="textSecondary">{'>'}</ThemedText>}
            onPress={() => setTermsSheetVisible(true)}
            />
          <SettingRow
            icon={<Info />} 
            label={t('settings.version')} 
            rightElement={<ThemedText colorType="textSecondary">{Constants.expoConfig?.version ?? '1.0.0'}</ThemedText>}
            onPress={() => showToast({ title: t('toast.appUpToDateTitle'), message: t('toast.appUpToDateMsg'), type: 'info' })}
            hideBorder
          />
        </View>
      </ScrollView>

      <LocalWeatherSheet 
        visible={localWeatherSheetVisible} 
        onClose={() => setLocalWeatherSheetVisible(false)} 
        value={localWeather} 
        onValueChange={setLocalWeather} 
      />

      <TermsSheet 
        visible={termsSheetVisible} 
        onClose={() => setTermsSheetVisible(false)} 
      />

      <LanguageSheet
        visible={languageSheetVisible}
        onClose={() => setLanguageSheetVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 10,
    gap: 10,
    marginBottom: 5,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 12,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },
  themeGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    height: 110,
    borderRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  themeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000', // or accent color
  },
  card: {
    borderRadius: 32,
    borderWidth: 1,
    borderBottomWidth: 3,
    paddingHorizontal: 20,
    paddingVertical: 8,
  }
});

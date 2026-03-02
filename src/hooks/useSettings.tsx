import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { useLanguage } from './useLanguage';
import { useToast } from './useToast';

interface SettingsContextType {
  isFahrenheit: boolean;
  setIsFahrenheit: (val: boolean) => void;
  isMph: boolean;
  setIsMph: (val: boolean) => void;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  localWeather: boolean;
  setLocalWeather: (val: boolean) => void;
  notifications: boolean;
  setNotifications: (val: boolean) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = '@weather_settings';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isFahrenheit, setIsFahrenheitState] = useState(false);
  const [isMph, setIsMphState] = useState(false);
  const [autoRefresh, setAutoRefreshState] = useState(true);
  const [localWeather, setLocalWeatherState] = useState(true);
  const [notifications, setNotificationsState] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { showToast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.isFahrenheit !== undefined) setIsFahrenheitState(parsed.isFahrenheit);
        if (parsed.isMph !== undefined) setIsMphState(parsed.isMph);
        if (parsed.autoRefresh !== undefined) setAutoRefreshState(parsed.autoRefresh);
        if (parsed.localWeather !== undefined) setLocalWeatherState(parsed.localWeather);
        if (parsed.notifications !== undefined) setNotificationsState(parsed.notifications);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    } finally {
      setIsReady(true);
    }
  };

  const saveSettings = async (newSettings: any) => {
    try {
      const current = {
        isFahrenheit,
        isMph,
        autoRefresh,
        localWeather,
        notifications,
        ...newSettings
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  const setIsFahrenheit = (val: boolean) => {
    setIsFahrenheitState(val);
    saveSettings({ isFahrenheit: val });
    showToast({ title: t('toast.settingUpdated'), message: `${t('toast.tempSetTo')} ${val ? t('common.fahrenheit') : t('common.celsius')}.`, type: 'success' });
  };

  const setIsMph = (val: boolean) => {
    setIsMphState(val);
    saveSettings({ isMph: val });
    showToast({ title: t('toast.settingUpdated'), message: `${t('toast.windSetTo')} ${val ? t('common.mph') : t('common.kmh')}.`, type: 'success' });
  };

  const setAutoRefresh = (val: boolean) => {
    setAutoRefreshState(val);
    saveSettings({ autoRefresh: val });
    showToast({ title: t('toast.settingUpdated'), message: `${t('toast.autoRefreshNow')} ${val ? t('common.on') : t('common.off')}.`, type: 'success' });
  };

  const setLocalWeather = (val: boolean) => {
    setLocalWeatherState(val);
    saveSettings({ localWeather: val });
    showToast({ title: t('toast.settingUpdated'), message: `${t('toast.localWeatherNow')} ${val ? t('common.on') : t('common.off')}.`, type: 'success' });
  };

  const setNotifications = async (val: boolean) => {
    if (val) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        showToast({ 
          title: t('home.permissionDenied'), 
          message: t('settings.enableNotifications'), 
          type: 'error',
          action: Platform.OS !== 'web' ? {
            label: t('settings.openSettings'),
            onPress: () => Linking.openSettings()
          } : undefined
        });
        return;
      }
    }

    setNotificationsState(val);
    saveSettings({ notifications: val });
    showToast({ title: t('toast.settingUpdated'), message: `${t('toast.notificationsNow')} ${val ? t('common.on') : t('common.off')}.`, type: 'success' });
  };

  if (!isReady) return null; // or a loader/splash

  return (
    <SettingsContext.Provider value={{
      isFahrenheit, setIsFahrenheit,
      isMph, setIsMph,
      autoRefresh, setAutoRefresh,
      localWeather, setLocalWeather,
      notifications, setNotifications
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

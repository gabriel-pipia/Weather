import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AnimatedSplash } from '../components/AnimatedSplash';
import { LanguageProvider } from '../hooks/useLanguage';
import { LocationsProvider, useLocations } from '../hooks/useLocations';
import { SettingsProvider } from '../hooks/useSettings';
import { SplashProvider, useSplash } from '../hooks/useSplash';
import { ThemeProvider, useTheme } from '../hooks/useTheme';
import { ToastProvider } from '../hooks/useToast';

function AppRoot() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

function SplashController() {
  const { isLoading: locationsLoading } = useLocations();
  const { finishSplash } = useSplash();
  const [showSplash, setShowSplash] = useState(true);

  if (!showSplash) return null;

  const handleFinish = () => {
    setShowSplash(false);
    finishSplash();
  };

  return (
    <AnimatedSplash 
      isAppReady={!locationsLoading} 
      onFinish={handleFinish} 
    />
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SplashProvider>
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <SettingsProvider>
                <LocationsProvider>
                  <AppRoot />
                  <SplashController />
                </LocationsProvider>
              </SettingsProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SplashProvider>
    </GestureHandlerRootView>
  );
}

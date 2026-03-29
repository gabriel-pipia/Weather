import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set up the default handler to show the notification when app is in foreground
// (disabled on web — push token listeners are not supported there)
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export interface DailyWeatherForNotification {
  dateObj: Date;
  minTemp: number;
  maxTemp: number;
}

export async function clearScheduledNotifications() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Schedule daily morning notifications for the provided forecast data
 */
export async function scheduleWeatherNotifications(
  cityName: string,
  forecast: DailyWeatherForNotification[],
  isFahrenheit: boolean,
  formatTemp: (temp: number, isF: boolean) => number,
  t: (key: string) => string
) {
  if (Platform.OS === 'web') return;
  // Clear any old schedule first
  await clearScheduledNotifications();

  // We only schedule notifications for future dates
  const now = new Date();
  
  for (const day of forecast) {
    const targetDate = new Date(day.dateObj);
    targetDate.setHours(8, 0, 0, 0); // 8:00 AM
    
    // If the target date is in the past, skip scheduling
    if (targetDate.getTime() <= now.getTime()) {
      continue;
    }

    // Schedule up to 7 days ahead
    const title = `${t('weather.today')} - ${cityName}`;
    const body = `${t('weather.expect')} ${t('weather.high')}: ${formatTemp(day.maxTemp, isFahrenheit)}° / ` + 
                 `${t('weather.low')}: ${formatTemp(day.minTemp, isFahrenheit)}°.`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: targetDate,
      },
    });
  }
}

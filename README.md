# Weather App

An elegant and modern Weather application built natively with React Native, Expo, and Reanimated that provides real-time atmospheric data, daily forecasts, local notifications, and language support.

## Core Features

- **Real-Time Forecasting:** Accurate conditions, humidity, pressure, and visibility metrics via OpenWeatherMap API.
- **Cinematic Animations:** Uses React Native Reanimated & Moti for staggered layout transitions, splash screen sequences, and floating elements.
- **Atmospheric Effects:** The UI dynamically adjusts particles (Mist, Fog, Heat Haze) to match the live weather properties.
- **Dual Language Support:** Instantly swap between English & Georgian (🇬🇪) localizations.
- **Daily Push Notifications:** Built-in background service using `expo-notifications` to schedule the device to natively alert the user with the next day's highs & lows around 8:00 AM.
- **Cross-Platform:** The UI elegantly maps to iOS, Android, and fully supports Web rendering.
- **Responsive Settings:** User preferences intelligently scale metrics like Fahrenheit/Celsius and Mph/Kmh, and locally caches them via AsyncStorage.

## Project Structure

- `src/app/` - Expo Router file-based routing mechanism.
- `src/components/` - Themed foundational widgets, skeletons, and floating UI architectures.
- `src/hooks/` - Encapsulated hook logic for language, locations bounding, themes, and weather fetches.
- `src/services/` - Native background logic, such as the `NotificationService`.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   You must acquire an API key from OpenWeatherMap. Place your API payload directly into a `.env` file at the root:
   ```env
   EXPO_PUBLIC_WEATHER_API_KEY=your_key_here
   EXPO_PUBLIC_WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
   ```

3. **Start the Development Server:**
   ```bash
   npx expo start
   ```

## Production Web Build (Netlify)

To deploy the web version of this app effectively using Netlify, follow these build properties:

- **Build Command:** `npx expo export -p web`
- **Publish Directory:** `dist`

A pre-configured `netlify.toml` layout maps single-page app (SPA) parameters back linearly since Expo Router acts globally using index fallbacks. Use standard GUI dragging deployments or the Netlify CLI to publish the folder!

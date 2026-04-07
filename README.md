<div align="center">
  <img src="./src/assets/images/icon.png" width="120" alt="Weather Logo" style="border-radius: 24px" />
  <h1>Weather</h1>
  <p>
    <strong>An elegant, cross-platform weather application crafted with React Native and Expo.</strong>
  </p>

  <p>
    <strong>🌟 <a href="https://gp-weather.vercel.app">View Live Demo</a> 🌟</strong>
  </p>

  <p>
    <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native"></a>
    <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"></a>
    <a href="https://openweathermap.org/"><img src="https://img.shields.io/badge/OpenWeatherMap-E96E50?style=for-the-badge&logo=openweathermap&logoColor=white" alt="OpenWeatherMap"></a>
    <a href="https://www.netlify.com/"><img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify"></a>
  </p>
</div>

<hr />

## ✨ Features

Atmosphere transcends standard weather apps by deeply integrating fluid animations, contextual visual effects, and a highly polished UI.

- **🌍 Real-Time Forecasting:** Accurate conditions, humidity, pressure, and visibility metrics powered by OpenWeatherMap API.
- **✨ Cinematic Animations:** Staggered layout transitions, elegant splash screen sequences, and floating elements using React Native Reanimated & Moti.
- **🌧️ Atmospheric Particle Effects:** The UI dynamically adjusts contextual particles (Mist, Fog, Snow, Heat Haze) to match live weather properties natively!
- **🇺🇸 Dual Language Support 🇬🇪:** Instantly and seamlessly swap between English and Georgian localizations on the fly.
- **🔔 Daily Push Notifications:** A built-in intelligent background service (`expo-notifications`) locally schedules your device to alert you natively with the next day's highs & lows safely at 8:00 AM.
- **📱 Cross-Platform Consistency:** Elegantly responsive UI perfectly mapped natively to iOS, Android, and Web browsers.
- **⚙️ Responsive Settings:** Intelligently scaling metrics (Fahrenheit/Celsius, Mph/Kmh), and local persistence using AsyncStorage to remember your environment.

---

## 🛠️ Technology Stack

- **Framework:** [Expo](https://expo.dev) & [React Native](https://reactnative.dev/)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Animations:** [Reanimated 3](https://docs.swmansion.com/react-native-reanimated/)
- **Icons:** [Lucide React Native](https://lucide.dev/)
- **Data Source:** [OpenWeatherMap REST API](https://openweathermap.org/api)

---

## 🚀 Getting Started

To run this project locally, simply follow these steps.

### 1. Install Dependencies

Ensure you have `Node.js` installed, then run:

```bash
npm install
```

### 2. Configure Your Environment

Atmosphere connects to the OpenWeatherMap API natively. You will need to bring your own free API key. Create a `.env` file in the root directory and add:

```env
EXPO_PUBLIC_WEATHER_API_KEY=your_openweathermap_key_here
EXPO_PUBLIC_WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

### 3. Launch the Development Server

```bash
npx expo start
```

From here, press `w` to open in your web browser, `i` to open in an iOS simulator, or `a` to open in an Android emulator!

---

## 🌐 Production Web Build (Netlify)

This project has been meticulously configured to deploy efficiently as a Single Page Application (SPA) natively on Netlify using Expo Web.

**Build Settings Configuration:**

- **Build Command:** `npx expo export -p web`
- **Publish Directory:** `dist`

**How it works:**  
The included `netlify.toml` file automatically directs all underlying routing traffic (`/*`) safely back to `/index.html`, ensuring Expo Router dictates the correct screen payloads during hard refreshes seamlessly.

**Deploying manually:**

1. Run `npx expo export -p web` locally.
2. Drag and drop the generated `dist` folder right into the Netlify visual deployment dashboard.

---

<div align="center">
  <i>Built with passion to reflect the beauty of our atmosphere.</i>
</div>

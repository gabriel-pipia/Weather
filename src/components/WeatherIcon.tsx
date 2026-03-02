import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import ClearNightStarry from '../assets/svgs/Clear-Night-Starry.svg';
import ClearSunny from '../assets/svgs/Clear-Sunny.svg';
import CloudyOvercast from '../assets/svgs/Cloudy-Overcast.svg';
import FoggyRain from '../assets/svgs/Foggy-Rain.svg';
import HazeNightCrescent from '../assets/svgs/Haze-Night-Crescent.svg';
import HazyMisty from '../assets/svgs/Hazy-Misty.svg';
import HeavyRain from '../assets/svgs/Heavy-Rain.svg';
import LightRainDay from '../assets/svgs/Light-Rain-Day.svg';
import MostlyCloudyDay from '../assets/svgs/Mostly-Cloudy-Day.svg';
import MostlyCloudyNight from '../assets/svgs/Mostly-Cloudy-Night.svg';
import PartlyCloudyDay from '../assets/svgs/Partly-Cloudy-Day.svg';
import PartlyCloudyNightCrescent from '../assets/svgs/Partly-Cloudy-Night-Crescent.svg';
import PartlyCloudyNightFullMoon from '../assets/svgs/Partly-Cloudy-Night-Full-Moon.svg';
import Rain from '../assets/svgs/Rain.svg';
import ScatteredThunderstormsDay from '../assets/svgs/Scattered-Thunderstorms-Day.svg';
import SnowNight from '../assets/svgs/Snow-Night.svg';
import SnowShowersDay from '../assets/svgs/Snow-Showers-Day.svg';
import Thunderstorms from '../assets/svgs/Thunderstorms.svg';

interface WeatherIconProps {
  code: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

const customIconMap: Record<string, React.FC<any>> = {
  '01d': ClearSunny,
  '01n': ClearNightStarry,
  '02d': PartlyCloudyDay,
  '02n': PartlyCloudyNightCrescent,
  '03d': CloudyOvercast,
  '03n': PartlyCloudyNightFullMoon,
  '04d': MostlyCloudyDay,
  '04n': MostlyCloudyNight,
  '09d': HeavyRain,
  '09n': Rain,
  '10d': LightRainDay,
  '10n': FoggyRain,
  '11d': ScatteredThunderstormsDay,
  '11n': Thunderstorms,
  '13d': SnowShowersDay,
  '13n': SnowNight,
  '50d': HazyMisty,
  '50n': HazeNightCrescent,
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, size = 64, style, color }) => {
  const IconComponent = customIconMap[code] || customIconMap['01d'];
  
  return (
    <IconComponent 
      width={size} 
      height={size} 
      style={style} 
      color={color} 
    />
  );
};

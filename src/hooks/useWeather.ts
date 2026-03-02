import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_KEY, BASE_URL } from '../constants/Config';
import { useSettings } from './useSettings';

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  visibility: number;
}

export interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: {
      main: string;
      icon: string;
    }[];
    pop: number;
  }[];
}

export const useWeather = (city: string = 'Tbilisi') => {
  const { autoRefresh } = useSettings();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    current: WeatherData | null;
    forecast: ForecastData | null;
  }>({ current: null, forecast: null });

  const fetchData = async (searchCity: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather?q=${searchCity}&appid=${API_KEY}&units=metric`),
        axios.get(`${BASE_URL}/forecast?q=${searchCity}&appid=${API_KEY}&units=metric`)
      ]);

      setData({
        current: currentRes.data,
        forecast: forecastRes.data
      });
    } catch (err: any) {
      setError(err.message || 'City not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(city);
    
    if (autoRefresh) {
      // Refresh every 10 minutes if autoRefresh is enabled in Settings
      const interval = setInterval(() => {
        fetchData(city);
      }, 10 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [city, autoRefresh]);

  return { ...data, loading, error, refresh: () => fetchData(city) };
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  const res = await axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  return res.data;
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Location {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface LocationsContextType {
  locations: Location[];
  addLocation: (location: Location) => Promise<void>;
  removeLocation: (id: string) => Promise<void>;
  isLoading: boolean;
  currentBg: string[];
  setCurrentBg: (colors: string[]) => void;
  activeLocation: string | null;
  setActiveLocation: (name: string | null) => void;
}

const LocationsContext = createContext<LocationsContextType | undefined>(undefined);

const STORAGE_KEY = '@weather_locations';

export function LocationsProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState<string[]>(['#4facfe', '#00f2fe']);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Location[] = JSON.parse(stored);
        // Defensive check: ensure no duplicates from storage
        const unique = parsed.filter((loc, index, self) => 
          index === self.findIndex((t) => t.id === loc.id)
        );
        setLocations(unique);
        if (unique.length > 0) setActiveLocation(unique[0].name);
      } else {
        // Default location
        const defaultLoc: Location = {
          id: 'Tbilisi',
          name: 'Tbilisi',
          country: 'Georgia',
          lat: 41.7151,
          lon: 44.8271,
        };
        setLocations([defaultLoc]);
        setActiveLocation(defaultLoc.name);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([defaultLoc]));
      }
    } catch (e) {
      console.error('Failed to load locations', e);
    } finally {
      setIsLoading(false);
    }
  }

  const addLocation = async (location: Location) => {
    try {
      // Normalize input
      const normalizedName = location.name.trim();
      const normalizedId = location.id.toLowerCase().trim();

      setLocations((prev) => {
        // Double check for duplicates using the latest state
        const alreadyExists = prev.some(l => 
          l.id === normalizedId || 
          l.name.toLowerCase() === normalizedName.toLowerCase()
        );
        
        if (alreadyExists) return prev;

        const newLocations = [...prev, { ...location, name: normalizedName, id: normalizedId }];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLocations));
        return newLocations;
      });
      setActiveLocation(normalizedName);
    } catch (e) {
      console.error('Failed to add location', e);
    }
  };

  const removeLocation = async (id: string) => {
    try {
      setLocations((prev) => {
        const newLocations = prev.filter(l => l.id !== id);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLocations));
        return newLocations;
      });
    } catch (e) {
      console.error('Failed to remove location', e);
    }
  };

  return (
    <LocationsContext.Provider value={{ locations, addLocation, removeLocation, isLoading, currentBg, setCurrentBg, activeLocation, setActiveLocation }}>
      {children}
    </LocationsContext.Provider>
  );
}

export function useLocations() {
  const context = useContext(LocationsContext);
  if (context === undefined) {
    throw new Error('useLocations must be used within a LocationsProvider');
  }
  return context;
}

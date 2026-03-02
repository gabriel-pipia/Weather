import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import en from '../locales/en';
import ka from '../locales/ka';

export type Language = 'en' | 'ka';
type TranslationsMap = typeof en;

const translations: Record<Language, TranslationsMap> = { en, ka };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = '@weather_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ka') {
        setLanguageState(stored as Language);
      }
    } catch (e) {
      console.error('Failed to load language', e);
    } finally {
      setIsReady(true);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.error('Failed to save language', e);
    }
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        return path; // Fallback to raw path if translation is missing
      }
    }
    return typeof current === 'string' ? current : path;
  };

  if (!isReady) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useDateTranslations() {
  const { language } = useLanguage();

  return {
    weekShort: language === 'ka' 
      ? ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"] 
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekLong: language === 'ka' 
      ? ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"] 
      : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    monthsShort: language === 'ka' 
      ? ["იან", "თებ", "მარ", "აპრ", "მაი", "ივნ", "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ"] 
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    monthsLong: language === 'ka' 
      ? ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"] 
      : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };
}

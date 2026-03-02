import React, { createContext, ReactNode, useContext, useState } from 'react';

interface SplashContextType {
  isSplashFinished: boolean;
  finishSplash: () => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export function SplashProvider({ children }: { children: ReactNode }) {
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  return (
    <SplashContext.Provider value={{ 
      isSplashFinished, 
      finishSplash: () => setIsSplashFinished(true) 
    }}>
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error('useSplash must be used within a SplashProvider');
  }
  return context;
}

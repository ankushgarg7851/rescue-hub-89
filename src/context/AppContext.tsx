import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AppContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  online: boolean;
  activeView: 'map' | 'sos' | 'resource' | 'volunteer' | 'guide';
  setActiveView: (v: 'map' | 'sos' | 'resource' | 'volunteer' | 'guide') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [activeView, setActiveView] = useState<AppContextType['activeView']>('map');

  React.useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  React.useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const toggleHighContrast = useCallback(() => setHighContrast(p => !p), []);

  return (
    <AppContext.Provider value={{ highContrast, toggleHighContrast, online, activeView, setActiveView }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

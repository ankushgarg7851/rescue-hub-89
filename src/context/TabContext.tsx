import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Tab {
  id: string;
  type: 'map' | 'sos' | 'guide' | 'resource' | 'volunteer';
  title: string;
  data?: Record<string, unknown>;
}

interface TabContextType {
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (tab: Omit<Tab, 'id'>) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

const TabContext = createContext<TabContextType | null>(null);

let tabCounter = 0;

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'map-default', type: 'map', title: 'Live Map' }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('map-default');

  const openTab = useCallback((tab: Omit<Tab, 'id'>) => {
    const id = `${tab.type}-${++tabCounter}`;
    const newTab = { ...tab, id };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(id);
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      if (next.length === 0) return prev;
      return next;
    });
    setActiveTabId(prev => {
      if (prev === id) {
        const idx = tabs.findIndex(t => t.id === id);
        const remaining = tabs.filter(t => t.id !== id);
        if (remaining.length === 0) return prev;
        return remaining[Math.min(idx, remaining.length - 1)].id;
      }
      return prev;
    });
  }, [tabs]);

  const setActiveTab = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  return (
    <TabContext.Provider value={{ tabs, activeTabId, openTab, closeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabs() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error('useTabs must be used within TabProvider');
  return ctx;
}

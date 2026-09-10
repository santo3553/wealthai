import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Settings } from '../types/settings';

interface AppSettingsContextType {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  addLinkedAccount: (accountName: string) => void;
  removeLinkedAccount: (index: number) => void;
  setApiKey: (key: string) => void;
}

const STORAGE_KEY = 'wealthai_settings';

const DEFAULT_SETTINGS: Settings = {
  currency: 'USD',
  notificationsEnabled: true,
  darkMode: true,
  twoFactorAuth: true,
  biometricLogin: true,
  linkedAccounts: [
    'JPMorgan Private Client (Checking •••• 8492)',
    'Goldman Sachs Marcus (High-Yield •••• 1047)',
    'Morgan Stanley Wealth Desk (Investment •••• 3912)',
  ],
  apiKey: '',
  userName: 'Santo',
  userEmail: 'santo@wealthai.private',
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Auto-sync all changes to window.localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage:', e);
    }
  }, [settings]);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const addLinkedAccount = useCallback((accountName: string) => {
    if (!accountName.trim()) return;
    setSettings((prev) => ({
      ...prev,
      linkedAccounts: [...prev.linkedAccounts, accountName.trim()],
    }));
  }, []);

  const removeLinkedAccount = useCallback((index: number) => {
    setSettings((prev) => ({
      ...prev,
      linkedAccounts: prev.linkedAccounts.filter((_, i) => i !== index),
    }));
  }, []);

  const setApiKey = useCallback((key: string) => {
    setSettings((prev) => ({ ...prev, apiKey: key.trim() }));
  }, []);

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        addLinkedAccount,
        removeLinkedAccount,
        setApiKey,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};

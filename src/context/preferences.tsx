import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type Appearance = 'light' | 'dark' | 'system';

type PreferencesContextValue = {
  appearance: Appearance;
  colorScheme: 'light' | 'dark';
  setAppearance: (appearance: Appearance) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [appearance, setAppearance] = useState<Appearance>('system');
  const colorScheme =
    appearance === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : appearance;

  const value = useMemo(
    () => ({ appearance, colorScheme, setAppearance }),
    [appearance, colorScheme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error('usePreferences must be used inside PreferencesProvider');
  }
  return value;
}

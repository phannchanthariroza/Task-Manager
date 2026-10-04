import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { PreferencesProvider, usePreferences } from '@/context/preferences';
import { TaskProvider } from '@/context/task-context';

SplashScreen.preventAutoHideAsync();

function ThemedApp() {
  const { colorScheme } = usePreferences();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <PreferencesProvider>
      <TaskProvider>
        <ThemedApp />
      </TaskProvider>
    </PreferencesProvider>
  );
}

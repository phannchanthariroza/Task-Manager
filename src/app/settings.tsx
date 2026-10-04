import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { usePreferences } from '@/context/preferences';
import { useTheme } from '@/hooks/use-theme';

const options = [
  { value: 'system' as const, label: 'System', description: 'Follow your device settings' },
  { value: 'light' as const, label: 'Light', description: 'Bright and clear' },
  { value: 'dark' as const, label: 'Dark', description: 'Easy on the eyes at night' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { setAppearance } = usePreferences();
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="subtitle">Settings</ThemedText>
        <ThemedText style={styles.heading}>Appearance</ThemedText>
        {options.map((option) => (
          <Pressable key={option.value} onPress={() => setAppearance(option.value)} style={({ pressed }) => [styles.option, { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 }]}>
            <ThemedView style={styles.optionCopy}>
              <ThemedText type="smallBold">{option.label}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">{option.description}</ThemedText>
            </ThemedView>
          </Pressable>
        ))}
        <ThemedText type="small" themeColor="textSecondary" style={styles.note}>Your preference is applied across every screen.</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, gap: 14 },
  heading: { fontSize: 18, fontWeight: '700', marginTop: 18, marginBottom: 4 },
  option: { borderRadius: 18, padding: 16 },
  optionCopy: { gap: 3 },
  note: { textAlign: 'center', marginTop: 12 },
});

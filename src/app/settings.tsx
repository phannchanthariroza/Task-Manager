import { Pressable, ScrollView, StyleSheet, Switch } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { usePreferences, type Appearance } from '@/context/preferences';
import { useTheme } from '@/hooks/use-theme';

const options: { value: Appearance; label: string; description: string }[] = [
  { value: 'system' as const, label: 'System', description: 'Follow your device settings' },
  { value: 'light' as const, label: 'Light', description: 'Bright and clear' },
  { value: 'dark' as const, label: 'Dark', description: 'Easy on the eyes at night' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { appearance, setAppearance } = usePreferences();
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="subtitle" style={styles.screenTitle}>Settings</ThemedText>
        <ThemedText style={styles.heading}>Appearance</ThemedText>
        {options.map((option) => (
          <Pressable key={option.value} onPress={() => setAppearance(option.value)} style={({ pressed }) => [styles.option, { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 }]}>
            <ThemedView style={styles.optionCopy}>
              <ThemedText type="smallBold">{option.label}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">{option.description}</ThemedText>
            </ThemedView>
            <Switch
              value={appearance === option.value}
              onValueChange={(enabled) => enabled && setAppearance(option.value)}
              trackColor={{ false: '#A8ADB7', true: '#A99FFF' }}
              thumbColor={appearance === option.value ? '#6C63FF' : '#F4F4F5'}
              accessibilityLabel={`${option.label} appearance`}
            />
          </Pressable>
        ))}
        <ThemedText type="small" themeColor="textSecondary" style={styles.note}>Your preference is applied across every screen.</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, paddingTop: 32, gap: 14 },
  screenTitle: { fontSize: 30, lineHeight: 38 },
  heading: { fontSize: 18, fontWeight: '700', marginTop: 18, marginBottom: 4 },
  option: { borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
  optionCopy: { gap: 3, flex: 1 },
  note: { textAlign: 'center', marginTop: 12 },
});

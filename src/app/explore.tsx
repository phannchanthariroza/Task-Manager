import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasks } from '@/context/task-context';
import { useTheme } from '@/hooks/use-theme';

export default function InsightsScreen() {
  const { tasks } = useTasks();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const completed = tasks.filter((task) => task.completed).length;
  const priorities = tasks.filter((task) => task.priority).length;
  const wide = width >= 650;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="subtitle" style={styles.screenTitle}>Insights</ThemedText>
        <ThemedText themeColor="textSecondary">A quick view of your momentum.</ThemedText>
        <View style={[styles.stats, wide && styles.statsWide]}>
          <ThemedView style={[styles.stat, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="subtitle" style={styles.statValue}>{completed}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Completed</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.stat, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="subtitle" style={styles.statValue}>{tasks.length - completed}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Remaining</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.stat, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="subtitle" style={styles.statValue}>{priorities}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Priorities</ThemedText>
          </ThemedView>
        </View>
        <ThemedView style={[styles.message, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="smallBold">A little progress adds up.</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">You&apos;re building a steady rhythm. Keep your focus on one task at a time.</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, paddingTop: 32, gap: 14 },
  screenTitle: { fontSize: 30, lineHeight: 38 },
  stats: { gap: 12, marginTop: 18 },
  statsWide: { flexDirection: 'row' },
  stat: { flex: 1, borderRadius: 18, padding: 18, gap: 4 },
  statValue: { fontSize: 32 },
  message: { borderRadius: 18, padding: 18, gap: 5, marginTop: 8 },
});

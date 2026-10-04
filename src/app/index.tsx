import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasks, type Task } from '@/context/task-context';
import { useTheme } from '@/hooks/use-theme';

function TaskCard({ task, onComplete, onPriority }: { task: Task; onComplete: () => void; onPriority: () => void }) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(1));
  const [lastTap, setLastTap] = useState(0);
  const [tapTimer, setTapTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [checkScale] = useState(() => new Animated.Value(task.completed ? 1 : 0));
  const theme = useTheme();
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [opacity]);

  useEffect(() => {
    if (task.completed) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.04, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
    Animated.spring(checkScale, {
      toValue: task.completed ? 1 : 0,
      useNativeDriver: true,
      tension: 120,
      friction: 7,
    }).start();
  }, [checkScale, scale, task.completed]);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTap < 320) {
      if (tapTimer) clearTimeout(tapTimer);
      onComplete();
      setLastTap(0);
      setTapTimer(null);
      return;
    }
    setLastTap(now);
    const timer = setTimeout(() => {
      setLastTap(0);
      setTapTimer(null);
      router.push(`/task/${task.id}`);
    }, 340);
    setTapTimer(timer);
  };

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        onLongPress={onPriority}
        delayLongPress={450}
        style={({ pressed }) => [styles.taskCard, { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.75 : 1 }]}>
        <View style={[styles.dot, { backgroundColor: task.color }]} />
        <View style={styles.taskCopy}>
          <ThemedText style={[styles.taskTitle, task.completed && styles.completed]}>{task.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">{task.project}  ·  {task.due}</ThemedText>
        </View>
        <Pressable onPress={onComplete} hitSlop={10} style={[styles.check, task.completed && { backgroundColor: '#11A683' }]}>
          <Animated.Text style={[styles.checkMark, { transform: [{ scale: checkScale }] }]}>✓</Animated.Text>
        </Pressable>
        {task.priority && <ThemedText style={styles.star}>★</ThemedText>}
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { tasks, addTask, toggleTask, togglePriority } = useTasks();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState('Personal');
  const [newDue, setNewDue] = useState('Today');
  const [progressWidth] = useState(() => new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [addPanel] = useState(() => new Animated.Value(0));
  const completed = tasks.filter((task) => task.completed).length;
  const contentWidth = Math.min(width - 40, 760);
  const progress = completed / tasks.length;
  useEffect(() => {
    Animated.spring(progressWidth, {
      toValue: Math.max(progress * 100, 4),
      useNativeDriver: false,
      tension: 55,
      friction: 8,
    }).start();
  }, [progress, progressWidth]);
  const toggleAddPanel = () => {
    const next = showAddForm ? 0 : 1;
    setShowAddForm(!showAddForm);
    Animated.spring(addPanel, { toValue: next, useNativeDriver: true, tension: 70, friction: 10 }).start();
  };
  const saveNewTask = () => {
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      project: newProject.trim() || 'Personal',
      due: newDue.trim() || 'Today',
      color: '#6C63FF',
    });
    setNewTitle('');
    setNewProject('Personal');
    setNewDue('Today');
    setShowAddForm(false);
    Animated.spring(addPanel, { toValue: 0, useNativeDriver: true, tension: 70, friction: 10 }).start();
  };
  const refreshTasks = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 650);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[styles.content, { width: contentWidth }]}
          showsVerticalScrollIndicator={false}
              stickyHeaderIndices={[0, 1]}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshTasks} tintColor="#6C63FF" />}
        >
              <View style={[styles.header, { backgroundColor: theme.background }]}>
                <ThemedText type="subtitle" style={styles.screenTitle}>Task Manager</ThemedText>
              </View>
              <View style={[styles.progressCard, styles.stickyProgress, { backgroundColor: theme.backgroundSelected }]}>
            <View style={styles.progressCopy}>
              <ThemedText type="smallBold">Today&apos;s focus</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">{completed} of {tasks.length} tasks complete</ThemedText>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
            </View>
          </View>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>My tasks</ThemedText>
            <Pressable onPress={toggleAddPanel} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
              <Animated.Text style={[styles.addButtonText, { transform: [{ rotate: addPanel.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }) }] }]}>
                +
              </Animated.Text>
              <ThemedText style={styles.addButtonText}>Add task</ThemedText>
            </Pressable>
          </View>
          {showAddForm && (
            <Animated.View style={[styles.addForm, { backgroundColor: theme.backgroundElement, opacity: addPanel, transform: [{ translateY: addPanel.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) }] }]}>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Task name"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundSelected }]}
                autoFocus
              />
              <View style={styles.formRow}>
                <TextInput
                  value={newProject}
                  onChangeText={setNewProject}
                  placeholder="Project"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.smallInput, { color: theme.text, backgroundColor: theme.backgroundSelected }]}
                />
                <TextInput
                  value={newDue}
                  onChangeText={setNewDue}
                  placeholder="Due"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.smallInput, { color: theme.text, backgroundColor: theme.backgroundSelected }]}
                />
              </View>
              <Pressable onPress={saveNewTask} style={styles.saveButton}>
                <ThemedText style={styles.addButtonText}>Save task</ThemedText>
              </Pressable>
            </Animated.View>
          )}
          <View style={styles.taskList}>
            {tasks.map((task) => <TaskCard key={task.id} task={task} onComplete={() => toggleTask(task.id)} onPriority={() => togglePriority(task.id)} />)}
          </View>
          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>Pull down to refresh · double tap to complete · long press for priority</ThemedText>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { alignSelf: 'center', padding: 20, paddingTop: 32, gap: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 8 },
  screenTitle: { fontSize: 30, lineHeight: 38 },
  progressCard: { borderRadius: 20, padding: 18, gap: 14 },
  stickyProgress: { marginBottom: 0 },
  progressCopy: { gap: 3 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(108,99,255,0.18)', overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: '#6C63FF' },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 26 },
  taskList: { gap: 12 },
  taskCard: { minHeight: 78, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  taskCopy: { flex: 1, gap: 3 },
  taskTitle: { fontWeight: '700' },
  completed: { textDecorationLine: 'line-through', opacity: 0.55 },
  check: { width: 25, height: 25, borderRadius: 13, borderWidth: 2, borderColor: '#11A683', alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#fff', fontSize: 14, lineHeight: 16 },
  star: { color: '#F59E0B', fontSize: 16 },
  hint: { textAlign: 'center' },
  addButton: { backgroundColor: '#6C63FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 5 },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  pressed: { opacity: 0.7 },
  addForm: { borderRadius: 18, padding: 14, gap: 10 },
  input: { borderRadius: 12, padding: 12, fontSize: 16 },
  formRow: { flexDirection: 'row', gap: 10 },
  smallInput: { flex: 1, borderRadius: 12, padding: 12, fontSize: 14 },
  saveButton: { backgroundColor: '#11A683', borderRadius: 12, padding: 12, alignItems: 'center' },
});

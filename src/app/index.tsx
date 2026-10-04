import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Animated, PanResponder, Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasks, type Task } from '@/context/task-context';
import { useTheme } from '@/hooks/use-theme';

function TaskCard({ task, onComplete, onPriority }: { task: Task; onComplete: () => void; onPriority: () => void }) {
  const [offset] = useState(() => new Animated.Value(0));
  const theme = useTheme();
  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 12,
        onPanResponderMove: (_, gesture) => offset.setValue(Math.min(0, gesture.dx)),
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -90) {
            Animated.timing(offset, { toValue: -420, duration: 180, useNativeDriver: true }).start(onComplete);
          } else {
            Animated.spring(offset, { toValue: 0, useNativeDriver: true }).start();
          }
        },
      }),
    [offset, onComplete],
  );

  return (
    <Animated.View style={{ transform: [{ translateX: offset }] }} {...responder.panHandlers}>
      <Pressable
        onPress={() => router.push(`/task/${task.id}`)}
        onLongPress={onPriority}
        delayLongPress={450}
        style={({ pressed }) => [styles.taskCard, { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.75 : 1 }]}>
        <View style={[styles.dot, { backgroundColor: task.color }]} />
        <View style={styles.taskCopy}>
          <ThemedText style={[styles.taskTitle, task.completed && styles.completed]}>{task.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">{task.project}  ·  {task.due}</ThemedText>
        </View>
        <Pressable onPress={onComplete} hitSlop={10} style={[styles.check, task.completed && { backgroundColor: '#11A683' }]}>
          {task.completed && <ThemedText style={styles.checkMark}>✓</ThemedText>}
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
  const completed = tasks.filter((task) => task.completed).length;
  const contentWidth = Math.min(width - 40, 760);
  const progress = completed / tasks.length;
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
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.content, { width: contentWidth }]} showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <ThemedText type="subtitle">Task Manager</ThemedText>
              </View>
          <View style={[styles.progressCard, { backgroundColor: theme.backgroundSelected }]}>
            <View style={styles.progressCopy}>
              <ThemedText type="smallBold">Today&apos;s focus</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">{completed} of {tasks.length} tasks complete</ThemedText>
            </View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(progress * 100, 4)}%` }]} /></View>
          </View>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>My tasks</ThemedText>
            <Pressable onPress={() => setShowAddForm((visible) => !visible)} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
                <ThemedText style={styles.addButtonText}>+ Add task</ThemedText>
            </Pressable>
          </View>
          {showAddForm && (
            <View style={[styles.addForm, { backgroundColor: theme.backgroundElement }]}>
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
            </View>
          )}
          <View style={styles.taskList}>
            {tasks.map((task) => <TaskCard key={task.id} task={task} onComplete={() => toggleTask(task.id)} onPriority={() => togglePriority(task.id)} />)}
          </View>
          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>Long press a task to mark it as a priority.</ThemedText>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { alignSelf: 'center', padding: 20, gap: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressCard: { borderRadius: 20, padding: 18, gap: 14 },
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
  addButton: { backgroundColor: '#6C63FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  pressed: { opacity: 0.7 },
  addForm: { borderRadius: 18, padding: 14, gap: 10 },
  input: { borderRadius: 12, padding: 12, fontSize: 16 },
  formRow: { flexDirection: 'row', gap: 10 },
  smallInput: { flex: 1, borderRadius: 12, padding: 12, fontSize: 14 },
  saveButton: { backgroundColor: '#11A683', borderRadius: 12, padding: 12, alignItems: 'center' },
});

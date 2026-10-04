import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasks } from '@/context/task-context';
import { useTheme } from '@/hooks/use-theme';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask, deleteTask } = useTasks();
  const task = tasks.find((item) => item.id === id);
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task?.title ?? '');
  const [project, setProject] = useState(task?.project ?? '');
  const [due, setDue] = useState(task?.due ?? '');
  if (!task) return <ThemedView style={styles.container}><ThemedText>Task not found.</ThemedText></ThemedView>;

  const save = () => {
    updateTask(task.id, { title: title.trim() || task.title, project: project.trim() || task.project, due: due.trim() || task.due });
    setEditing(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}><ThemedText type="linkPrimary">‹  Back to tasks</ThemedText></Pressable>
        {editing ? (
          <>
            <ThemedText type="smallBold">Task name</ThemedText>
            <TextInput value={title} onChangeText={setTitle} style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]} />
            <ThemedText type="smallBold">Project</ThemedText>
            <TextInput value={project} onChangeText={setProject} style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]} />
            <ThemedText type="smallBold">Due</ThemedText>
            <TextInput value={due} onChangeText={setDue} style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]} />
          </>
        ) : (
          <ThemedView style={[styles.hero, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={[styles.category, { color: task.color }]}>{task.project.toUpperCase()}</ThemedText>
            <ThemedText type="subtitle">{task.title}</ThemedText>
            <ThemedText themeColor="textSecondary">{task.due}</ThemedText>
          </ThemedView>
        )}
        <Pressable onPress={editing ? save : () => setEditing(true)} style={styles.action}>
          <ThemedText style={styles.actionText}>{editing ? 'Save changes' : 'Edit task'}</ThemedText>
        </Pressable>
        <Pressable onPress={() => { deleteTask(task.id); router.replace('/'); }} style={styles.deleteAction}>
          <ThemedText style={styles.deleteText}>Delete task</ThemedText>
        </Pressable>
        <ThemedText type="smallBold">Task details</ThemedText>
        <ThemedText themeColor="textSecondary">Keep this task visible while you work through today&apos;s priorities. Use the checkbox on the list to update its completion state.</ThemedText>
        <ThemedView style={[styles.status, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="smallBold">{task.completed ? 'Completed' : 'In progress'}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">{task.priority ? 'Priority task' : 'Standard task'}</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, gap: 20 },
  hero: { borderRadius: 22, padding: 22, gap: 10, marginTop: 12 },
  category: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  status: { borderRadius: 16, padding: 18, gap: 4 },
  input: { borderRadius: 14, padding: 15, fontSize: 16 },
  action: { backgroundColor: '#6C63FF', borderRadius: 16, padding: 15, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '700' },
  deleteAction: { padding: 12, alignItems: 'center' },
  deleteText: { color: '#D14343', fontWeight: '700' },
});

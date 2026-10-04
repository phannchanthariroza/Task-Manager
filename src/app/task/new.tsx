import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasks } from '@/context/task-context';
import { useTheme } from '@/hooks/use-theme';

export default function NewTaskScreen() {
  const theme = useTheme();
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('Personal');
  const [due, setDue] = useState('Today');
  const [error, setError] = useState('');
  const save = () => {
    if (!title.trim()) {
      setError('Enter a task name before adding the task.');
      return;
    }
    const id = addTask({ title: title.trim(), project: project.trim() || 'Personal', due: due.trim() || 'Today', color: '#6C63FF' });
    router.replace(`/task/${id}`);
  };
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}><ThemedText type="linkPrimary">‹  Back</ThemedText></Pressable>
        <ThemedText type="subtitle">Add task</ThemedText>
        <ThemedText type="smallBold">Task name</ThemedText>
        <TextInput value={title} onChangeText={setTitle} placeholder="What needs to be done?" placeholderTextColor={theme.textSecondary} style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]} autoFocus />
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
        <ThemedText type="smallBold">Project</ThemedText>
        <TextInput value={project} onChangeText={setProject} style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]} />
        <ThemedText type="smallBold">Due</ThemedText>
        <TextInput value={due} onChangeText={setDue} style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]} />
        <Pressable onPress={save} style={styles.save}><ThemedText style={styles.saveText}>Add task</ThemedText></Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, gap: 14 },
  input: { borderRadius: 14, padding: 15, fontSize: 16 },
  save: { backgroundColor: '#6C63FF', borderRadius: 16, padding: 15, alignItems: 'center', marginTop: 10 },
  saveText: { color: '#fff', fontWeight: '700' },
  error: { color: '#D14343', fontSize: 13 },
});

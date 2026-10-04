import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Task = {
  id: string;
  title: string;
  project: string;
  due: string;
  color: string;
  completed: boolean;
  priority: boolean;
};

const initialTasks: Task[] = [
  { id: '1', title: 'Review launch checklist', project: 'Work', due: 'Today, 10:00 AM', color: '#6C63FF', completed: false, priority: true },
  { id: '2', title: 'Book dentist appointment', project: 'Personal', due: 'Today, 2:30 PM', color: '#F59E0B', completed: false, priority: false },
  { id: '3', title: 'Prepare weekly notes', project: 'Work', due: 'Tomorrow', color: '#11A683', completed: false, priority: false },
  { id: '4', title: 'Plan weekend hike', project: 'Personal', due: 'Sat, Oct 10', color: '#EA5B9A', completed: true, priority: false },
];

type TaskContextValue = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'priority'>) => string;
  updateTask: (id: string, updates: Partial<Pick<Task, 'title' | 'project' | 'due'>>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  togglePriority: (id: string) => void;
};

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState(initialTasks);
  const addTask = (task: Omit<Task, 'id' | 'completed' | 'priority'>) => {
    const id = Date.now().toString();
    setTasks((current) => [...current, { ...task, id, completed: false, priority: false }]);
    return id;
  };
  const updateTask = (id: string, updates: Partial<Pick<Task, 'title' | 'project' | 'due'>>) =>
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  const deleteTask = (id: string) => setTasks((current) => current.filter((task) => task.id !== id));
  const toggleTask = (id: string) =>
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  const togglePriority = (id: string) =>
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, priority: !task.priority } : task)));

  const value = useMemo(
    () => ({ tasks, addTask, updateTask, deleteTask, toggleTask, togglePriority }),
    [tasks],
  );
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const value = useContext(TaskContext);
  if (!value) {
    throw new Error('useTasks must be used inside TaskProvider');
  }
  return value;
}

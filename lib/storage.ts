import type { Task } from './types';

const STORAGE_KEY = 'brain-dump/tasks';

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

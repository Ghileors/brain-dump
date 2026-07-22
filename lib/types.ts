// Mirrors openspec/specs/task-domain/spec.md — update the spec first, then this file.

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'inbox' | 'today' | 'done';

export type TaskSource = 'text' | 'voice';

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate: string | null;
  scheduledTime: string | null;
  status: TaskStatus;
  source: TaskSource;
}

export type Inbox = Task[];

export type Today = Task[];

"use client";

import { useEffect, useState } from "react";
import packageJson from "@/package.json";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { loadTasks, saveTasks } from "@/lib/storage";
import type { Task, TaskPriority } from "@/lib/types";

interface CandidateTask {
  title: string;
  priority: TaskPriority;
  dueDate: string | null;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noTasksFound, setNoTasksFound] = useState(false);

  useEffect(() => {
    // localStorage is unavailable during SSR, so tasks must be hydrated
    // client-side after mount; a lazy initial state would mismatch the
    // server-rendered (empty) markup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(loadTasks());
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setError(null);
    setNoTasksFound(false);

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!response.ok) {
        setError("Couldn't parse that text. Please try again.");
        return;
      }

      const data: { tasks: CandidateTask[] } = await response.json();

      if (data.tasks.length === 0) {
        setNoTasksFound(true);
        return;
      }

      const newTasks: Task[] = data.tasks.map((candidate) => ({
        id: crypto.randomUUID(),
        title: candidate.title,
        priority: candidate.priority,
        dueDate: candidate.dueDate,
        scheduledTime: null,
        status: "inbox",
        source: "text",
      }));

      const updated = [...tasks, ...newTasks];
      setTasks(updated);
      saveTasks(updated);
      setText("");
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function moveToToday(id: string) {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, status: "today" as const } : task,
    );
    setTasks(updated);
    saveTasks(updated);
  }

  const inboxTasks = tasks.filter((task) => task.status === "inbox");
  const todayTasks = tasks.filter((task) => task.status === "today");

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 className="text-xl font-semibold">Brain Dump</h1>
        <p className="w-full text-right text-sm text-muted-foreground">
          v{packageJson.version}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Dump everything on your mind..."
          disabled={isSubmitting}
          rows={4}
        />
        <Button type="submit" disabled={isSubmitting || !text.trim()}>
          {isSubmitting ? "Parsing..." : "Capture"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {noTasksFound && (
          <p className="text-sm text-muted-foreground">
            No tasks found in that text.
          </p>
        )}
      </form>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Inbox</h2>
        {inboxTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Inbox is empty.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {inboxTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5"
              >
                <span className="text-sm">
                  {task.title}{" "}
                  <span className="text-muted-foreground">({task.priority})</span>
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveToToday(task.id)}
                >
                  Move to Today
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Today</h2>
        {todayTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Today is empty.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {todayTasks.map((task) => (
              <li
                key={task.id}
                className="rounded-lg border border-border p-2.5 text-sm"
              >
                {task.title}{" "}
                <span className="text-muted-foreground">({task.priority})</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

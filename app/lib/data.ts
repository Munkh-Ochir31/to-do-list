import type { Priority, Status, Task } from "../types";
import type { StatusRow, TaskRow } from "./supabase";

const taskFromRow = (r: TaskRow): Task => ({
  id: r.id,
  title: r.title,
  category: r.category,
  status: r.status,
  priority: r.priority as Priority,
  assignee: r.assignee,
  dueTime: r.due_time,
  notes: r.notes,
  createdAt: r.created_at,
});

const statusFromRow = (r: StatusRow): Status => ({
  id: r.id,
  label: r.label,
  color: r.color,
  bg: r.bg,
  dot: r.dot,
  pulse: r.pulse,
  isDone: r.is_done,
});

const taskToBody = (t: Omit<Task, "id" | "createdAt">) => ({
  title: t.title,
  category: t.category,
  status: t.status,
  priority: t.priority,
  assignee: t.assignee,
  due_time: t.dueTime,
  notes: t.notes,
});

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks", { cache: "no-store" });
  const rows = await jsonOrThrow<TaskRow[]>(res);
  return rows.map(taskFromRow);
}

export async function fetchStatuses(): Promise<Status[]> {
  const res = await fetch("/api/statuses", { cache: "no-store" });
  const rows = await jsonOrThrow<StatusRow[]>(res);
  return rows.map(statusFromRow);
}

export async function insertTask(task: Omit<Task, "id" | "createdAt">): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskToBody(task)),
  });
  const row = await jsonOrThrow<TaskRow>(res);
  return taskFromRow(row);
}

export async function updateTask(
  id: number,
  task: Omit<Task, "id" | "createdAt">
): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskToBody(task)),
  });
  const row = await jsonOrThrow<TaskRow>(res);
  return taskFromRow(row);
}

export async function updateTaskStatus(id: number, status: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  await jsonOrThrow<TaskRow>(res);
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {}
    throw new Error(msg);
  }
}

export async function replaceStatuses(list: Status[]): Promise<Status[]> {
  const body = list.map((s) => ({
    id: s.id,
    label: s.label,
    color: s.color,
    bg: s.bg,
    dot: s.dot,
    pulse: s.pulse,
    is_done: s.isDone,
  }));
  const res = await fetch("/api/statuses", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const rows = await jsonOrThrow<StatusRow[]>(res);
  return rows.map(statusFromRow);
}

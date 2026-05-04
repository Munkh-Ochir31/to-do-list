export type Status = {
  id: string;
  label: string;
  color: string;
  bg: string;
  dot: string;
  pulse: boolean;
  isDone: boolean;
};

export type Priority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title: string;
  category: string;
  status: string;
  priority: Priority;
  assignee: string;
  dueTime: string;
  notes: string;
  createdAt: string;
};

export type ColorPreset = {
  dot: string;
  bg: string;
  color: string;
};

export type Tweaks = {
  accentColor: string;
  cardRadius: number;
  showPriority: boolean;
  showAssignee: boolean;
  compactMode: boolean;
};

import type { ColorPreset, Status, Task, Tweaks } from "./types";

export const TWEAKS: Tweaks = {
  accentColor: "#0a0a0a",
  cardRadius: 12,
  showPriority: true,
  showAssignee: true,
  compactMode: false,
};

export const DEFAULT_STATUSES: Status[] = [
  { id: "pending",    label: "Хүлээгдэж буй", color: "#a3a3a3", bg: "#f5f5f5", dot: "#a3a3a3", pulse: false, isDone: false },
  { id: "inprogress", label: "Хийгдэж буй",   color: "#525252", bg: "#e5e5e5", dot: "#525252", pulse: true,  isDone: false },
  { id: "washing",    label: "Угааж байна",    color: "#1a1a1a", bg: "#d4d4d4", dot: "#1a1a1a", pulse: true,  isDone: false },
  { id: "drying",     label: "Хатааж байна",   color: "#0a0a0a", bg: "#c4c4c4", dot: "#404040", pulse: true,  isDone: false },
  { id: "done",       label: "Дууссан",        color: "#ffffff", bg: "#0a0a0a", dot: "#ffffff", pulse: false, isDone: true  },
];

export const COLOR_PRESETS: ColorPreset[] = [
  { dot: "#a3a3a3", bg: "#f5f5f5", color: "#525252" },
  { dot: "#525252", bg: "#e5e5e5", color: "#1a1a1a" },
  { dot: "#0a0a0a", bg: "#d4d4d4", color: "#0a0a0a" },
  { dot: "#ffffff", bg: "#0a0a0a", color: "#ffffff" },
  { dot: "#2563eb", bg: "#eff6ff", color: "#1d4ed8" },
  { dot: "#16a34a", bg: "#f0fdf4", color: "#15803d" },
  { dot: "#d97706", bg: "#fffbeb", color: "#b45309" },
  { dot: "#dc2626", bg: "#fef2f2", color: "#b91c1c" },
  { dot: "#7c3aed", bg: "#f5f3ff", color: "#6d28d9" },
  { dot: "#0891b2", bg: "#ecfeff", color: "#0e7490" },
];

export const PRIORITIES = [
  { id: "low",    label: "Бага",   labelEn: "Low",    mark: "↓" },
  { id: "medium", label: "Дунд",   labelEn: "Medium", mark: "→" },
  { id: "high",   label: "Өндөр",  labelEn: "High",   mark: "↑" },
] as const;

export const CATEGORIES = ["Хувцас", "Хөнжил", "Дэр", "Даавуу", "Бусад"];

export const SAMPLE_TASKS: Task[] = [
  { id: 1, title: "Цэнхэр хөнжил угаах", category: "Хөнжил", status: "washing", priority: "high", assignee: "Б. Мөнхбат", dueTime: "14:00", notes: "Халуун усаар угаах", createdAt: "2026-05-04T08:00:00" },
  { id: 2, title: "Цагаан цамц 5ш", category: "Хувцас", status: "pending", priority: "medium", assignee: "О. Сарнай", dueTime: "16:00", notes: "", createdAt: "2026-05-04T09:00:00" },
  { id: 3, title: "Дэрний цов 3ш", category: "Дэр", status: "drying", priority: "low", assignee: "Б. Мөнхбат", dueTime: "15:30", notes: "Нарны гэрэлд хатаах", createdAt: "2026-05-04T07:30:00" },
  { id: 4, title: "Ширээний даавуу угаах", category: "Даавуу", status: "inprogress", priority: "medium", assignee: "О. Сарнай", dueTime: "17:00", notes: "", createdAt: "2026-05-04T10:00:00" },
  { id: 5, title: "Улаан хөнжил", category: "Хөнжил", status: "done", priority: "low", assignee: "Д. Энхтуяа", dueTime: "12:00", notes: "Дууссан", createdAt: "2026-05-04T06:00:00" },
];

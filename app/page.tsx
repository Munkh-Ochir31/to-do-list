"use client";

import { useEffect, useState } from "react";
import { Icon } from "./components/Icon";
import { StatsBar } from "./components/StatsBar";
import { StatusManagerModal } from "./components/StatusManagerModal";
import { TaskModal } from "./components/TaskModal";
import { TaskRow } from "./components/TaskRow";
import { CATEGORIES, DEFAULT_STATUSES, TWEAKS } from "./constants";
import {
  deleteTask,
  fetchStatuses,
  fetchTasks,
  insertTask,
  replaceStatuses,
  updateTask,
  updateTaskStatus,
} from "./lib/data";
import { StatusContext } from "./StatusContext";
import type { Status, Task } from "./types";

const selectStyle: React.CSSProperties = {
  padding: "8px 28px 8px 10px",
  border: "1px solid #e5e5e5",
  borderRadius: 8,
  fontFamily: "var(--font-dm-sans), sans-serif",
  fontSize: 13,
  color: "#0a0a0a",
  background: "#fff",
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23a3a3a3' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
};

type ModalState = null | "add" | Task;
type LoadState = "loading" | "ready" | "error";

export default function Page() {
  const tweaks = TWEAKS;

  const [statuses, setStatuses] = useState<Status[]>(DEFAULT_STATUSES);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [load, setLoad] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [newTaskId, setNewTaskId] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [showStatusManager, setShowStatusManager] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "priority" | "dueTime">("createdAt");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, s] = await Promise.all([fetchTasks(), fetchStatuses()]);
        if (cancelled) return;
        setTasks(t);
        if (s.length) setStatuses(s);
        setLoad("ready");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setLoad("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (payload: Omit<Task, "id" | "createdAt">) => {
    try {
      if (modal && modal !== "add") {
        const updated = await updateTask(modal.id, payload);
        setTasks((ts) => ts.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await insertTask(payload);
        setTasks((ts) => [created, ...ts]);
        setNewTaskId(created.id);
        setTimeout(() => setNewTaskId(null), 600);
      }
      setModal(null);
    } catch (e) {
      alert("Хадгалахад алдаа гарлаа: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleDelete = async (id: number) => {
    const prev = tasks;
    setTasks((ts) => ts.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
    } catch (e) {
      setTasks(prev);
      alert("Устгах алдаа: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    const prev = tasks;
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await updateTaskStatus(id, status);
    } catch (e) {
      setTasks(prev);
      alert("Статус солих алдаа: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleStatusesSave = async (list: Status[]) => {
    const prev = statuses;
    setStatuses(list);
    try {
      const saved = await replaceStatuses(list);
      setStatuses(saved);
    } catch (e) {
      setStatuses(prev);
      alert("Статус хадгалахад алдаа: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const filtered = tasks
    .filter((t) => filterStatus === "all" || t.status === filterStatus)
    .filter((t) => filterCategory === "all" || t.category === filterCategory)
    .filter(
      (t) =>
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.assignee?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "priority") {
        const o = { high: 0, medium: 1, low: 2 } as const;
        return o[a.priority] - o[b.priority];
      }
      if (sortBy === "dueTime")
        return (a.dueTime || "99:99").localeCompare(b.dueTime || "99:99");
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const compact = tweaks.compactMode;
  const doneStatusIds = new Set(statuses.filter((s) => s.isDone).map((s) => s.id));

  return (
    <StatusContext.Provider value={statuses}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 16px 64px", minHeight: "100vh" }}>
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: tweaks.accentColor,
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.5" />
                    <path d="M16 2v4M8 2v4M3 10h18M19 15l-5 5-2-2" />
                  </svg>
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 600, color: "#0a0a0a", letterSpacing: "-0.02em" }}>
                  Даалгаврын модуль
                </h1>
              </div>
              <p style={{ fontSize: 13, color: "#a3a3a3", marginTop: 4, marginLeft: 38 }}>
                Хөнжүүлэх систем · Task management
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => setShowStatusManager(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 14px",
                  background: "#fff",
                  color: "#525252",
                  border: "1px solid #e5e5e5",
                  borderRadius: tweaks.cardRadius,
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <Icon name="filter" size={13} />
                Статус
              </button>
              <button
                onClick={() => setModal("add")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 16px",
                  background: tweaks.accentColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: tweaks.cardRadius,
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <Icon name="plus" size={15} />
                Шинэ даалгавар
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <StatsBar tasks={tasks} tweaks={tweaks} />
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 180px", position: "relative", minWidth: 140 }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#a3a3a3",
                display: "flex",
              }}
            >
              <Icon name="search" size={14} />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Хайх..."
              style={{
                width: "100%",
                padding: "8px 10px 8px 32px",
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 13,
                color: "#0a0a0a",
                background: "#fff",
                outline: "none",
              }}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Бүх статус</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Бүх ангилал</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={selectStyle}
          >
            <option value="createdAt">Шинэ эхлэл</option>
            <option value="priority">Давуу эрх</option>
            <option value="dueTime">Цаг</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontFamily: "var(--font-dm-mono), monospace",
              color: "#a3a3a3",
            }}
          >
            {load === "loading" ? "Уншиж байна..." : `${filtered.length} даалгавар`}
          </span>
          {filtered.filter((t) => !doneStatusIds.has(t.status)).length > 0 && (
            <span style={{ fontSize: 12, color: "#a3a3a3" }}>
              {filtered.filter((t) => !doneStatusIds.has(t.status)).length} хэрэгжих
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {load === "error" ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 24px",
                background: "#fff",
                borderRadius: tweaks.cardRadius,
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: 13,
              }}
            >
              Алдаа гарлаа: {error}
            </div>
          ) : load === "loading" ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 24px",
                background: "#fff",
                borderRadius: tweaks.cardRadius,
                border: "1px solid #f0f0f0",
                color: "#a3a3a3",
                fontSize: 13,
              }}
            >
              Өгөгдөл уншиж байна...
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                background: "#fff",
                borderRadius: tweaks.cardRadius,
                border: "1px solid #f0f0f0",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 15, color: "#525252", fontWeight: 500 }}>
                Даалгавар олдсонгүй
              </div>
              <div style={{ fontSize: 13, color: "#a3a3a3", marginTop: 4 }}>
                Шинэ даалгавар нэмэхийн тулд дээрх товч дарна уу
              </div>
              <button
                onClick={() => setModal("add")}
                style={{
                  marginTop: 16,
                  padding: "8px 18px",
                  background: tweaks.accentColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                + Нэмэх
              </button>
            </div>
          ) : (
            filtered.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onEdit={(t) => setModal(t)}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                tweaks={tweaks}
                compact={compact}
                isNew={task.id === newTaskId}
              />
            ))
          )}
        </div>

        {!compact && load === "ready" && (
          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => setModal("add")}
              style={{
                width: "100%",
                padding: "11px",
                background: "transparent",
                border: "1.5px dashed #d4d4d4",
                borderRadius: tweaks.cardRadius,
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 13,
                color: "#a3a3a3",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "all 0.12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#a3a3a3";
                e.currentTarget.style.color = "#525252";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d4d4d4";
                e.currentTarget.style.color = "#a3a3a3";
              }}
            >
              <Icon name="plus" size={14} />
              Даалгавар нэмэх
            </button>
          </div>
        )}
      </div>

      {modal && (
        <TaskModal
          task={modal === "add" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          tweaks={tweaks}
        />
      )}

      {showStatusManager && (
        <StatusManagerModal
          statuses={statuses}
          onSave={handleStatusesSave}
          onClose={() => setShowStatusManager(false)}
        />
      )}
    </StatusContext.Provider>
  );
}

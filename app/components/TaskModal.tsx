"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { CATEGORIES, PRIORITIES } from "../constants";
import { StatusContext } from "../StatusContext";
import type { Priority, Task, Tweaks } from "../types";
import { Icon } from "./Icon";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #e5e5e5",
  borderRadius: 8,
  fontFamily: "var(--font-dm-sans), sans-serif",
  fontSize: 14,
  color: "#0a0a0a",
  background: "#fafafa",
  outline: "none",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "#737373",
  marginBottom: 5,
  display: "block",
  letterSpacing: "0.03em",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23a3a3a3' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 32,
};

type FormState = Omit<Task, "id" | "createdAt">;

export function TaskModal({
  task,
  onSave,
  onClose,
  tweaks,
}: {
  task: Task | null;
  onSave: (payload: FormState) => void;
  onClose: () => void;
  tweaks: Tweaks;
}) {
  const statuses = useContext(StatusContext);
  const isEdit = !!task?.id;
  const [form, setForm] = useState<FormState>(
    task
      ? {
          title: task.title,
          category: task.category,
          status: task.status,
          priority: task.priority,
          assignee: task.assignee,
          dueTime: task.dueTime,
          notes: task.notes,
        }
      : {
          title: "",
          category: "Хувцас",
          status: "pending",
          priority: "medium",
          assignee: "",
          dueTime: "",
          notes: "",
        }
  );
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: tweaks.cardRadius + 2,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#0a0a0a" }}>
              {isEdit ? "Даалгавар засах" : "Шинэ даалгавар"}
            </div>
            <div style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>
              {isEdit ? "Edit task" : "Add new task"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f5f5f5",
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#737373",
            }}
          >
            <Icon name="close" size={14} />
          </button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>ДААЛГАВРЫН НЭР</label>
            <input
              ref={titleRef}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Жишээ: Цагаан хөнжил угаах..."
              style={inputStyle}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>АНГИЛАЛ</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                style={selectStyle}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>СТАТУС</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                style={selectStyle}
              >
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: tweaks.showPriority ? "1fr 1fr" : "1fr",
              gap: 12,
            }}
          >
            {tweaks.showPriority && (
              <div>
                <label style={labelStyle}>ДАВУУ ЭРХ</label>
                <select
                  value={form.priority}
                  onChange={(e) => set("priority", e.target.value as Priority)}
                  style={selectStyle}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label style={labelStyle}>ДУУСАХ ЦАГ</label>
              <input
                type="time"
                value={form.dueTime}
                onChange={(e) => set("dueTime", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {tweaks.showAssignee && (
            <div>
              <label style={labelStyle}>ХАРИУЦАХ АЖИЛТАН</label>
              <input
                value={form.assignee}
                onChange={(e) => set("assignee", e.target.value)}
                placeholder="Нэр..."
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>ТЭМДЭГЛЭЛ</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Нэмэлт мэдээлэл..."
              rows={2}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
            />
          </div>
        </div>

        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              border: "1px solid #e5e5e5",
              background: "#fff",
              color: "#525252",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Цуцлах
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title.trim()}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "none",
              background: form.title.trim() ? tweaks.accentColor : "#d4d4d4",
              color: "#fff",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: form.title.trim() ? "pointer" : "not-allowed",
              transition: "background 0.15s",
            }}
          >
            {isEdit ? "Хадгалах" : "Нэмэх"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Task, Tweaks } from "../types";
import { Icon } from "./Icon";
import { PriorityMark } from "./PriorityMark";
import { StatusDropdown } from "./StatusDropdown";

export function TaskRow({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  tweaks,
  compact,
  isNew,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  tweaks: Tweaks;
  compact: boolean;
  isNew: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [justDone, setJustDone] = useState(false);
  const isDone = task.status === "done";

  const handleDoneToggle = () => {
    if (!isDone) setJustDone(true);
    setTimeout(() => setJustDone(false), 600);
    onStatusChange(task.id, isDone ? "pending" : "done");
  };

  return (
    <div
      className={isNew ? "task-row-enter" : ""}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: tweaks.showPriority
          ? "20px 1fr auto auto auto"
          : "1fr auto auto auto",
        alignItems: "center",
        gap: 12,
        padding: compact ? "10px 16px" : "14px 20px",
        background: hovered ? "#fafafa" : "#fff",
        borderRadius: tweaks.cardRadius,
        border: "1px solid #f0f0f0",
        transition: "all 0.18s ease",
        cursor: "default",
        opacity: isDone ? 0.65 : 1,
      }}
    >
      {tweaks.showPriority && <PriorityMark priorityId={task.priority} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: isDone ? "#a3a3a3" : "#0a0a0a",
              textDecoration: isDone ? "line-through" : "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 240,
              transition: "color 0.2s, text-decoration 0.2s",
            }}
          >
            {task.title}
          </span>
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-dm-mono), monospace",
              color: "#a3a3a3",
              background: "#f5f5f5",
              padding: "1px 7px",
              borderRadius: 4,
            }}
          >
            {task.category}
          </span>
        </div>
        {!compact && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {task.dueTime && (
              <span
                style={{
                  fontSize: 11,
                  color: "#a3a3a3",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Icon name="clock" size={11} />
                {task.dueTime}
              </span>
            )}
            {tweaks.showAssignee && task.assignee && (
              <span
                style={{
                  fontSize: 11,
                  color: "#a3a3a3",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Icon name="user" size={11} />
                {task.assignee}
              </span>
            )}
            {task.notes && (
              <span
                style={{
                  fontSize: 11,
                  color: "#c4c4c4",
                  fontStyle: "italic",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 160,
                }}
              >
                {task.notes}
              </span>
            )}
          </div>
        )}
      </div>

      <StatusDropdown
        value={task.status}
        onChange={(v) => onStatusChange(task.id, v)}
      />

      <div
        style={{
          display: "flex",
          gap: 4,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.12s",
        }}
      >
        <button
          onClick={() => onEdit(task)}
          style={{
            border: "none",
            background: "#f5f5f5",
            borderRadius: 6,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#525252",
          }}
        >
          <Icon name="edit" size={13} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          style={{
            border: "none",
            background: "#f5f5f5",
            borderRadius: 6,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#737373",
          }}
        >
          <Icon name="trash" size={13} />
        </button>
      </div>

      <div
        className={justDone ? "check-pop" : ""}
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: isDone ? "none" : "1.5px solid #d4d4d4",
          background: isDone ? tweaks.accentColor : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background 0.2s, border-color 0.2s, transform 0.15s",
          boxShadow: isDone ? "0 2px 6px rgba(0,0,0,0.18)" : "none",
        }}
        onClick={handleDoneToggle}
      >
        {isDone && <Icon name="check" size={11} style={{ color: "#fff" }} />}
      </div>
    </div>
  );
}

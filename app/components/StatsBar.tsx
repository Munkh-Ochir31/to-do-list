"use client";

import { useContext } from "react";
import { StatusContext } from "../StatusContext";
import type { Task, Tweaks } from "../types";

export function StatsBar({ tasks, tweaks }: { tasks: Task[]; tweaks: Tweaks }) {
  const statuses = useContext(StatusContext);
  const total = tasks.length;
  const done = tasks.filter((t) => statuses.find((s) => s.id === t.status)?.isDone).length;
  const inprogress = tasks.filter((t) => {
    const s = statuses.find((x) => x.id === t.status);
    return s && s.pulse && !s.isDone;
  }).length;
  const pending = tasks.filter((t) => {
    const s = statuses.find((x) => x.id === t.status);
    return s && !s.pulse && !s.isDone;
  }).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const cards = [
    { label: "Нийт", value: total, color: "#0a0a0a" },
    { label: "Дуусаагүй", value: pending, color: "#a3a3a3" },
    { label: "Явагдаж байна", value: inprogress, color: "#525252" },
    { label: "Дууссан", value: done, color: tweaks.accentColor },
  ];

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {cards.map((s) => (
        <div
          key={s.label}
          style={{
            background: "#fff",
            border: "1px solid #f0f0f0",
            borderRadius: tweaks.cardRadius,
            padding: "12px 16px",
            flex: "1 1 80px",
            minWidth: 80,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 600, color: s.color, lineHeight: 1 }}>
            {s.value}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#a3a3a3",
              marginTop: 3,
              fontFamily: "var(--font-dm-mono), monospace",
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
      <div
        style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: tweaks.cardRadius,
          padding: "12px 16px",
          flex: "1 1 120px",
          minWidth: 120,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#a3a3a3",
              fontFamily: "var(--font-dm-mono), monospace",
            }}
          >
            ЯВЦ
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0a0a0a" }}>{pct}%</span>
        </div>
        <div style={{ height: 4, background: "#f0f0f0", borderRadius: 99, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: pct + "%",
              background: tweaks.accentColor,
              borderRadius: 99,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

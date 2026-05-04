"use client";

import { useContext } from "react";
import { StatusContext } from "../StatusContext";
import { DEFAULT_STATUSES } from "../constants";
import { AnimatedDot } from "./AnimatedDot";

export function StatusBadge({
  statusId,
  small = false,
  animate = true,
}: {
  statusId: string;
  small?: boolean;
  animate?: boolean;
}) {
  const statuses = useContext(StatusContext) || DEFAULT_STATUSES;
  const s = statuses.find((x) => x.id === statusId) || statuses[0];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: small ? "2px 8px" : "4px 10px",
        borderRadius: 99,
        background: s.bg,
        color: s.color,
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: small ? 10 : 11,
        fontWeight: 500,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        border: "1px solid " + (s.isDone ? s.dot : "#e5e5e5"),
        transition: "background 0.25s, color 0.25s, border-color 0.25s",
      }}
    >
      {animate ? (
        <AnimatedDot statusId={statusId} />
      ) : (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: s.dot,
            flexShrink: 0,
          }}
        />
      )}
      {s.label}
    </span>
  );
}

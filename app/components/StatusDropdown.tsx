"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { StatusContext } from "../StatusContext";
import { DEFAULT_STATUSES } from "../constants";
import { AnimatedDot } from "./AnimatedDot";
import { StatusBadge } from "./StatusBadge";

export function StatusDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const statuses = useContext(StatusContext) || DEFAULT_STATUSES;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <StatusBadge statusId={value} />
      </button>
      {open && (
        <div
          className="status-dropdown-menu"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 4,
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            zIndex: 50,
            minWidth: 170,
            overflow: "hidden",
          }}
        >
          {statuses.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onChange(s.id);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "9px 14px",
                background: s.id === value ? "#f5f5f5" : "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 9,
                textAlign: "left",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => {
                if (s.id !== value)
                  (e.currentTarget as HTMLButtonElement).style.background = "#fafafa";
              }}
              onMouseLeave={(e) => {
                if (s.id !== value)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <AnimatedDot statusId={s.id} />
              <span
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: 13,
                  color: "#0a0a0a",
                  fontWeight: s.id === value ? 500 : 400,
                }}
              >
                {s.label}
              </span>
              {s.id === value && (
                <span
                  style={{ marginLeft: "auto", color: "#a3a3a3", fontSize: 11 }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

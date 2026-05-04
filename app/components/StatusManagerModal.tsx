"use client";

import { useState } from "react";
import { COLOR_PRESETS } from "../constants";
import type { Status } from "../types";
import { Icon } from "./Icon";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #e5e5e5",
  borderRadius: 7,
  fontFamily: "var(--font-dm-sans), sans-serif",
  fontSize: 13,
  color: "#0a0a0a",
  background: "#fafafa",
  outline: "none",
};

export function StatusManagerModal({
  statuses,
  onSave,
  onClose,
}: {
  statuses: Status[];
  onSave: (statuses: Status[]) => void;
  onClose: () => void;
}) {
  const [list, setList] = useState<Status[]>(statuses.map((s) => ({ ...s })));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newPreset, setNewPreset] = useState(0);
  const [newPulse, setNewPulse] = useState(false);
  const [newIsDone, setNewIsDone] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const addStatus = () => {
    if (!newLabel.trim()) return;
    const preset = COLOR_PRESETS[newPreset];
    const id = "custom_" + Date.now();
    setList((l) => [
      ...l,
      { id, label: newLabel.trim(), ...preset, pulse: newPulse, isDone: newIsDone },
    ]);
    setNewLabel("");
    setNewPreset(0);
    setNewPulse(false);
    setNewIsDone(false);
  };

  const updateLabel = (id: string, label: string) =>
    setList((l) => l.map((s) => (s.id === id ? { ...s, label } : s)));
  const updatePreset = (id: string, presetIdx: number) =>
    setList((l) =>
      l.map((s) => (s.id === id ? { ...s, ...COLOR_PRESETS[presetIdx] } : s))
    );
  const togglePulse = (id: string) =>
    setList((l) => l.map((s) => (s.id === id ? { ...s, pulse: !s.pulse } : s)));
  const toggleIsDone = (id: string) =>
    setList((l) => l.map((s) => (s.id === id ? { ...s, isDone: !s.isDone } : s)));
  const removeStatus = (id: string) => setList((l) => l.filter((s) => s.id !== id));

  const handleDragStart = (i: number) => setDragIdx(i);
  const handleDragEnter = (i: number) => setDragOver(i);
  const handleDragEnd = () => {
    if (dragIdx !== null && dragOver !== null && dragIdx !== dragOver) {
      const newList = [...list];
      const [moved] = newList.splice(dragIdx, 1);
      newList.splice(dragOver, 0, moved);
      setList(newList);
    }
    setDragIdx(null);
    setDragOver(null);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          width: "100%",
          maxWidth: 500,
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "18px 22px 14px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0a0a0a" }}>
              Статус удирдах
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#a3a3a3",
                marginTop: 2,
                fontFamily: "var(--font-dm-mono), monospace",
              }}
            >
              Manage statuses · drag to reorder
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f5f5f5",
              borderRadius: 7,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#737373",
            }}
          >
            <Icon name="close" size={13} />
          </button>
        </div>

        <div style={{ padding: "14px 22px", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {list.map((s, i) => (
              <div
                key={s.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragEnter={() => handleDragEnter(i)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  border:
                    dragOver === i ? "1.5px dashed #a3a3a3" : "1px solid #f0f0f0",
                  borderRadius: 10,
                  padding: "10px 12px",
                  background: dragIdx === i ? "#fafafa" : "#fff",
                  opacity: dragIdx === i ? 0.5 : 1,
                  transition: "all 0.12s",
                  cursor: "grab",
                }}
              >
                {editingId === s.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input
                      value={s.label}
                      onChange={(e) => updateLabel(s.id, e.target.value)}
                      style={inputStyle}
                      autoFocus
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#a3a3a3",
                          marginBottom: 6,
                          fontFamily: "var(--font-dm-mono), monospace",
                        }}
                      >
                        ӨНГӨ СОНГОХ
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {COLOR_PRESETS.map((p, pi) => {
                          const currentIdx = COLOR_PRESETS.findIndex(
                            (c) => c.dot === s.dot && c.bg === s.bg
                          );
                          const isActive = currentIdx === pi;
                          return (
                            <button
                              key={pi}
                              onClick={() => updatePreset(s.id, pi)}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 7,
                                background: p.bg,
                                border: `2px solid ${isActive ? p.dot : "#e5e5e5"}`,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: p.dot,
                                  display: "block",
                                }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          color: "#525252",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={s.pulse}
                          onChange={() => togglePulse(s.id)}
                          style={{ accentColor: "#0a0a0a" }}
                        />
                        Пульс анимаци
                      </label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          color: "#525252",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={s.isDone}
                          onChange={() => toggleIsDone(s.id)}
                          style={{ accentColor: "#0a0a0a" }}
                        />
                        Дууссан гэж тооцох
                      </label>
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          padding: "6px 14px",
                          border: "1px solid #e5e5e5",
                          background: "#fff",
                          borderRadius: 7,
                          fontFamily: "var(--font-dm-sans), sans-serif",
                          fontSize: 12,
                          cursor: "pointer",
                          color: "#525252",
                        }}
                      >
                        Болих
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          padding: "6px 14px",
                          border: "none",
                          background: "#0a0a0a",
                          borderRadius: 7,
                          fontFamily: "var(--font-dm-sans), sans-serif",
                          fontSize: 12,
                          cursor: "pointer",
                          color: "#fff",
                        }}
                      >
                        Хадгалах
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{ color: "#d4d4d4", display: "flex", flexShrink: 0 }}
                    >
                      <Icon name="grip" size={14} />
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "3px 10px",
                        borderRadius: 99,
                        background: s.bg,
                        color: s.color,
                        fontFamily: "var(--font-dm-mono), monospace",
                        fontSize: 11,
                        fontWeight: 500,
                        border: `1px solid ${s.isDone ? s.dot : "#e5e5e5"}`,
                        flex: 1,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: s.dot,
                        }}
                      />
                      {s.label}
                    </span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {s.pulse && (
                        <span
                          style={{
                            fontSize: 9,
                            fontFamily: "var(--font-dm-mono), monospace",
                            color: "#a3a3a3",
                            background: "#f5f5f5",
                            padding: "1px 5px",
                            borderRadius: 4,
                          }}
                        >
                          пульс
                        </span>
                      )}
                      {s.isDone && (
                        <span
                          style={{
                            fontSize: 9,
                            fontFamily: "var(--font-dm-mono), monospace",
                            color: "#a3a3a3",
                            background: "#f5f5f5",
                            padding: "1px 5px",
                            borderRadius: 4,
                          }}
                        >
                          дууссан
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <button
                        onClick={() => setEditingId(s.id)}
                        style={{
                          border: "none",
                          background: "#f5f5f5",
                          borderRadius: 6,
                          width: 26,
                          height: 26,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#525252",
                        }}
                      >
                        <Icon name="edit" size={12} />
                      </button>
                      {list.length > 1 && (
                        <button
                          onClick={() => removeStatus(s.id)}
                          style={{
                            border: "none",
                            background: "#f5f5f5",
                            borderRadius: 6,
                            width: 26,
                            height: 26,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#a3a3a3",
                          }}
                        >
                          <Icon name="trash" size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 16,
              padding: 14,
              background: "#fafafa",
              borderRadius: 10,
              border: "1px dashed #e5e5e5",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#a3a3a3",
                fontFamily: "var(--font-dm-mono), monospace",
                marginBottom: 10,
                letterSpacing: "0.04em",
              }}
            >
              ШИНЭ СТАТУС НЭМЭХ
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Статусын нэр..."
                style={{ ...inputStyle, flex: 1 }}
                onKeyDown={(e) => e.key === "Enter" && addStatus()}
              />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {COLOR_PRESETS.map((p, pi) => (
                <button
                  key={pi}
                  onClick={() => setNewPreset(pi)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: p.bg,
                    border: `2px solid ${newPreset === pi ? p.dot : "#e5e5e5"}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 0.1s",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: p.dot,
                      display: "block",
                    }}
                  />
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#525252",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={newPulse}
                  onChange={(e) => setNewPulse(e.target.checked)}
                  style={{ accentColor: "#0a0a0a" }}
                />
                Пульс анимаци
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#525252",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={newIsDone}
                  onChange={(e) => setNewIsDone(e.target.checked)}
                  style={{ accentColor: "#0a0a0a" }}
                />
                Дууссан гэж тооцох
              </label>
            </div>
            <button
              onClick={addStatus}
              disabled={!newLabel.trim()}
              style={{
                width: "100%",
                padding: "8px",
                border: "none",
                background: newLabel.trim() ? "#0a0a0a" : "#e5e5e5",
                color: newLabel.trim() ? "#fff" : "#a3a3a3",
                borderRadius: 8,
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 13,
                fontWeight: 500,
                cursor: newLabel.trim() ? "pointer" : "not-allowed",
                transition: "background 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Icon name="plus" size={13} />
              Нэмэх
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "14px 22px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e5e5e5",
              background: "#fff",
              color: "#525252",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Цуцлах
          </button>
          <button
            onClick={() => {
              onSave(list);
              onClose();
            }}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: "#0a0a0a",
              color: "#fff",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}

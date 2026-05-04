"use client";

import { useContext } from "react";
import { StatusContext } from "../StatusContext";
import { DEFAULT_STATUSES } from "../constants";

export function AnimatedDot({ statusId }: { statusId: string }) {
  const statuses = useContext(StatusContext) || DEFAULT_STATUSES;
  const s = statuses.find((x) => x.id === statusId) || statuses[0];
  const pulse = s.pulse;
  return (
    <span
      style={{
        position: "relative",
        width: 7,
        height: 7,
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {pulse && (
        <span
          style={{
            position: "absolute",
            inset: -3,
            borderRadius: "50%",
            background: s.dot,
            opacity: 0.25,
            animation: "dotPulse 1.4s ease-in-out infinite",
          }}
        />
      )}
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          display: "block",
          position: "relative",
          zIndex: 1,
        }}
      />
    </span>
  );
}

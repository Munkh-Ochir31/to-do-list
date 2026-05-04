import { PRIORITIES } from "../constants";
import type { Priority } from "../types";

export function PriorityMark({ priorityId }: { priorityId: Priority }) {
  const p = PRIORITIES.find((x) => x.id === priorityId) || PRIORITIES[1];
  const colors: Record<Priority, string> = {
    low: "#a3a3a3",
    medium: "#525252",
    high: "#0a0a0a",
  };
  return (
    <span
      style={{
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: 12,
        fontWeight: 600,
        color: colors[priorityId] || "#525252",
        userSelect: "none",
      }}
    >
      {p.mark}
    </span>
  );
}

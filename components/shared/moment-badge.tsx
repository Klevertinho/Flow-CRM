import React from "react";
import type { LeadMoment } from "../../lib/lead-moment";

function getStyle(type: LeadMoment["type"]): React.CSSProperties {
  if (type === "closing") {
    return {
      background: "#052e16",
      border: "1px solid #166534",
      color: "#86efac",
    };
  }

  if (type === "decision") {
    return {
      background: "#3f2a00",
      border: "1px solid #92400e",
      color: "#fcd34d",
    };
  }

  if (type === "engaged") {
    return {
      background: "#1e293b",
      border: "1px solid #334155",
      color: "#cbd5e1",
    };
  }

  if (type === "cooling") {
    return {
      background: "#082f49",
      border: "1px solid #0369a1",
      color: "#7dd3fc",
    };
  }

  return {
    background: "#450a0a",
    border: "1px solid #991b1b",
    color: "#fca5a5",
  };
}

export function MomentBadge({ moment }: { moment: LeadMoment }) {
  return (
    <div
      title={moment.description}
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        ...getStyle(moment.type),
      }}
    >
      {moment.label}
    </div>
  );
}
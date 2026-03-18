import React from "react";
import type { LeadScoreResult } from "../../lib/lead-score";

type ScoreBadgeProps = {
  result: LeadScoreResult;
};

function getStyles(level: LeadScoreResult["level"]): React.CSSProperties {
  if (level === "high") {
    return {
      background: "#052e16",
      border: "1px solid #166534",
      color: "#86efac",
    };
  }

  if (level === "medium") {
    return {
      background: "#3f2a00",
      border: "1px solid #92400e",
      color: "#fcd34d",
    };
  }

  return {
    background: "#450a0a",
    border: "1px solid #991b1b",
    color: "#fca5a5",
  };
}

export function ScoreBadge({ result }: ScoreBadgeProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        ...getStyles(result.level),
      }}
    >
      <span>{result.score}</span>
      <span>{result.label}</span>
    </div>
  );
}
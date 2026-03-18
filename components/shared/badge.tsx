import React from "react";

type BadgeTone =
  | "neutral"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "hot"
  | "warm"
  | "cold";

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
};

const toneStyles: Record<BadgeTone, React.CSSProperties> = {
  neutral: { background: "#1f2937", color: "#e5e7eb", border: "1px solid #374151" },
  success: { background: "#052e16", color: "#86efac", border: "1px solid #166534" },
  danger: { background: "#450a0a", color: "#fca5a5", border: "1px solid #991b1b" },
  warning: { background: "#3f2a00", color: "#fcd34d", border: "1px solid #92400e" },
  info: { background: "#0c1f3f", color: "#93c5fd", border: "1px solid #1d4ed8" },
  hot: { background: "#4c0519", color: "#f9a8d4", border: "1px solid #be185d" },
  warm: { background: "#3b1d00", color: "#fdba74", border: "1px solid #c2410c" },
  cold: { background: "#082f49", color: "#7dd3fc", border: "1px solid #0369a1" },
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        ...toneStyles[tone],
      }}
    >
      {children}
    </span>
  );
}
import React from "react";
import { Button } from "../shared/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        border: "1px dashed #334155",
        background: "linear-gradient(180deg, #0b1220 0%, #0f172a 100%)",
        borderRadius: 20,
        padding: 32,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          margin: "0 auto 16px",
          borderRadius: 18,
          background: "#111827",
          border: "1px solid #1f2937",
          display: "grid",
          placeItems: "center",
          color: "#93c5fd",
          fontWeight: 900,
          fontSize: 20,
        }}
      >
        ✦
      </div>

      <h3 style={{ margin: 0, color: "#f8fafc", fontSize: 22 }}>{title}</h3>
      <p
        style={{
          margin: "10px auto 0",
          color: "#94a3b8",
          maxWidth: 560,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {actionLabel && onAction && (
        <div style={{ marginTop: 20 }}>
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
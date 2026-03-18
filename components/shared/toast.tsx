import React from "react";
import type { ToastItem } from "../../hooks/use-toast";

type ToastStackProps = {
  items: ToastItem[];
  onRemove: (id: string) => void;
};

function getTone(type: ToastItem["type"]): React.CSSProperties {
  if (type === "success") {
    return {
      background: "#052e16",
      border: "1px solid #166534",
      color: "#dcfce7",
    };
  }

  if (type === "error") {
    return {
      background: "#450a0a",
      border: "1px solid #991b1b",
      color: "#fee2e2",
    };
  }

  return {
    background: "#0c1f3f",
    border: "1px solid #1d4ed8",
    color: "#dbeafe",
  };
}

export function ToastStack({ items, onRemove }: ToastStackProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: 320,
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            borderRadius: 14,
            padding: 14,
            boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
            ...getTone(item.type),
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{item.title}</div>
              {item.message && (
                <div style={{ marginTop: 4, fontSize: 13, opacity: 0.95 }}>
                  {item.message}
                </div>
              )}
            </div>

            <button
              onClick={() => onRemove(item.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
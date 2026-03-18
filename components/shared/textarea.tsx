import React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, style, ...props }: TextareaProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 600 }}>
          {label}
        </label>
      )}

      <textarea
        {...props}
        style={{
          padding: 10,
          borderRadius: 10,
          border: error ? "1px solid #dc2626" : "1px solid #374151",
          background: "#111827",
          color: "#f9fafb",
          outline: "none",
          fontSize: 14,
          minHeight: 100,
          resize: "vertical",
          ...style,
        }}
      />

      {error && (
        <span style={{ fontSize: 12, color: "#f87171" }}>{error}</span>
      )}
    </div>
  );
}
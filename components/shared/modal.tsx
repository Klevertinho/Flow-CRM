import React from "react";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function Modal({
  open,
  title,
  description,
  children,
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 640,
          background: "#0f172a",
          border: "1px solid #1f2937",
          borderRadius: 18,
          padding: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ margin: 0, color: "#f8fafc", fontSize: 22 }}>{title}</h2>
          {description && (
            <p style={{ marginTop: 8, color: "#94a3b8", fontSize: 14 }}>
              {description}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
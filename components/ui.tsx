"use client";

export function Card({ children }: any) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg,#020617,#0f172a)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </div>
  );
}

export function Button({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
        border: "none",
        padding: "10px 16px",
        borderRadius: 10,
        color: "white",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

export function Input(props: any) {
  return (
    <input
      {...props}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "10px",
        borderRadius: 10,
        color: "white",
        width: "100%",
      }}
    />
  );
}
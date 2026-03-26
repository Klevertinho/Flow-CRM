"use client";

export function Card({ children }: any) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 18,
        backdropFilter: "blur(10px)",
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
        background: "var(--primary)",
        border: "none",
        padding: "10px 16px",
        borderRadius: 10,
        color: "white",
        fontWeight: 600,
        transition: "0.2s",
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
        background: "transparent",
        border: "1px solid var(--border)",
        padding: "10px 12px",
        borderRadius: 10,
        color: "white",
        width: "100%",
      }}
    />
  );
}
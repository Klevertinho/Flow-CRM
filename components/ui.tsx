"use client";

export function Card({ children }: any) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 20,
        backdropFilter: "blur(10px)",
        transition: "0.2s",
      }}
    >
      {children}
    </div>
  );
}

export function Button({ children, onClick, variant = "primary" }: any) {
  const primary = variant === "primary";

  return (
    <button
      onClick={onClick}
      style={{
        background: primary ? "var(--primary)" : "transparent",
        border: primary ? "none" : "1px solid var(--border)",
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
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--border)",
        padding: "10px 12px",
        borderRadius: 10,
        color: "white",
        width: "100%",
      }}
    />
  );
}
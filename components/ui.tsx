"use client";

export function Card({ children }: any) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, rgba(15,23,42,0.6), rgba(2,6,23,0.8))",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: 20,
        backdropFilter: "blur(12px)",
        transition: "0.2s",
      }}
    >
      {children}
    </div>
  );
}

export function Button({ children, onClick, variant = "primary" }: any) {
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={onClick}
      style={{
        background: isPrimary ? "#2563eb" : "transparent",
        border: isPrimary
          ? "none"
          : "1px solid rgba(255,255,255,0.1)",
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
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "10px 12px",
        borderRadius: 10,
        color: "white",
        width: "100%",
      }}
    />
  );
}
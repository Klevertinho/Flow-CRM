"use client";

import Link from "next/link";
import { CSSProperties, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  full?: boolean;
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  full,
}: ButtonProps) {
  const style: CSSProperties = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: full ? "100%" : "auto",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    textDecoration: "none",
    transition: "all .2s ease",
    background:
      variant === "primary"
        ? "#2F6BFF"
        : "rgba(255,255,255,0.04)",
    color: "#fff",
    border:
      variant === "primary"
        ? "none"
        : "1px solid rgba(255,255,255,0.1)",
    boxShadow:
      variant === "primary"
        ? "0 10px 30px rgba(47,107,255,0.3)"
        : "none",
  };

  if (href) {
    return (
      <Link href={href} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </div>
  );
}

export function Input(props: any) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.03)",
        color: "#fff",
        outline: "none",
      }}
    />
  );
}
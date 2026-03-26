"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  full?: boolean;
  disabled?: boolean;
};

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.028) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        padding: 20,
        backdropFilter: "blur(12px)",
        boxShadow: "0 22px 60px rgba(0,0,0,0.20)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  href,
  variant = "primary",
  full,
  disabled,
}: ButtonProps) {
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: full ? "100%" : "auto",
    minHeight: 46,
    padding: "0 16px",
    borderRadius: 12,
    fontWeight: 800,
    fontSize: 14,
    textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
    opacity: disabled ? 0.65 : 1,
    border:
      variant === "primary"
        ? "none"
        : "1px solid rgba(255,255,255,0.10)",
    background:
      variant === "primary"
        ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
        : variant === "secondary"
        ? "rgba(255,255,255,0.06)"
        : "transparent",
    color: "#fff",
    boxShadow:
      variant === "primary"
        ? "0 16px 40px rgba(37,99,235,0.28)"
        : "none",
  };

  if (href) {
    return (
      <Link
        href={href}
        style={style}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      style={style}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
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
        width: "100%",
        minHeight: 48,
        padding: "0 14px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        color: "#fff",
        outline: "none",
        fontSize: 14,
        ...props.style,
      }}
    />
  );
}

export function TextArea(props: any) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        minHeight: 110,
        padding: "14px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        color: "#fff",
        outline: "none",
        fontSize: 14,
        resize: "vertical",
        fontFamily: "inherit",
        ...props.style,
      }}
    />
  );
}
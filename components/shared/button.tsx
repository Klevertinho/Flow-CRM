import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "#2563eb",
    color: "#fff",
    border: "1px solid #2563eb",
  },
  secondary: {
    background: "#1f2937",
    color: "#fff",
    border: "1px solid #374151",
  },
  danger: {
    background: "#7f1d1d",
    color: "#fff",
    border: "1px solid #991b1b",
  },
  ghost: {
    background: "transparent",
    color: "#d1d5db",
    border: "1px solid #374151",
  },
};

export function Button({
  variant = "primary",
  fullWidth = false,
  style,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.6 : 1,
        transition: "all 0.2s ease",
        width: fullWidth ? "100%" : undefined,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
import React from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
};

export function Select({
  label,
  error,
  options,
  style,
  ...props
}: SelectProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 600 }}>
          {label}
        </label>
      )}

      <select
        {...props}
        style={{
          padding: 10,
          borderRadius: 10,
          border: error ? "1px solid #dc2626" : "1px solid #374151",
          background: "#111827",
          color: "#f9fafb",
          outline: "none",
          fontSize: 14,
          ...style,
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span style={{ fontSize: 12, color: "#f87171" }}>{error}</span>
      )}
    </div>
  );
}
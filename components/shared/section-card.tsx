"use client";

import React from "react";

export function SectionCard(props: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: 18,
        padding: 22,
        borderRadius: 24,
        background:
          "linear-gradient(180deg, rgba(17,24,39,0.96) 0%, rgba(11,18,32,0.98) 100%)",
        border: "1px solid #22304a",
        boxShadow: "0 24px 70px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          marginBottom: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#f8fafc",
            }}
          >
            {props.title}
          </div>

          {props.subtitle && (
            <div
              style={{
                marginTop: 6,
                color: "#94a3b8",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {props.subtitle}
            </div>
          )}
        </div>
      </div>

      {props.children}
    </div>
  );
}
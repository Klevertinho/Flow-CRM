"use client";

import React from "react";

export function SectionCard(props: {
  title: string;
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
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#f8fafc",
          }}
        >
          {props.title}
        </div>
      </div>

      {props.children}
    </div>
  );
}
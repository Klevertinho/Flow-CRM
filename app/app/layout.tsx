import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 260,
          padding: 24,
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h2 style={{ fontWeight: 900 }}>VALORA</h2>

        <div style={{ marginTop: 40 }}>
          <div>Dashboard</div>
          <div>Leads</div>
          <div>Pipeline</div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: 32 }}>{children}</main>
    </div>
  );
}
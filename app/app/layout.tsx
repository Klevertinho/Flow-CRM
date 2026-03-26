import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: 240,
          padding: 20,
          borderRight: "1px solid var(--border)",
        }}
      >
        <h2 style={{ fontWeight: 900 }}>VALORA</h2>

        <div style={{ marginTop: 30, display: "grid", gap: 12 }}>
          <span>Dashboard</span>
          <span>Leads</span>
          <span>Pipeline</span>
          <span>Configurações</span>
        </div>
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1, padding: 30 }}>
        {children}
      </main>
    </div>
  );
}
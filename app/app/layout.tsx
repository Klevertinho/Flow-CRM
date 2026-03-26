import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <aside
        style={{
          width: 260,
          padding: 24,
          borderRight: "1px solid var(--border)",
          background: "rgba(2,6,23,0.6)",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 20 }}>
          VALORA
        </div>

        <div style={{ marginTop: 40, display: "grid", gap: 14 }}>
          <span style={{ fontWeight: 600 }}>Dashboard</span>
          <span style={{ opacity: 0.6 }}>Leads</span>
          <span style={{ opacity: 0.6 }}>Pipeline</span>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: 32 }}>
        {children}
      </main>
    </div>
  );
}
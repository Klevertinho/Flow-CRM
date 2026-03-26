import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <aside
        style={{
          width: 260,
          padding: 24,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ fontWeight: 900, fontSize: 20 }}>
            VALORA
          </h2>

          <div style={{ marginTop: 40, display: "grid", gap: 14 }}>
            <span style={{ opacity: 1 }}>Dashboard</span>
            <span style={{ opacity: 0.6 }}>Leads</span>
            <span style={{ opacity: 0.6 }}>Pipeline</span>
          </div>
        </div>

        <div style={{ fontSize: 12, opacity: 0.4 }}>
          VALORA © 2026
        </div>
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1, padding: 32 }}>
        {children}
      </main>
    </div>
  );
}
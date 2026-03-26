import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import Link from "next/link";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(47,107,255,0.12), transparent 40%), #0B1220",
        color: "#E6EAF2",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          height: 70,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 18 }}>
          VALORA <span style={{ opacity: 0.5 }}>CRM</span>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/billing" style={navBtn}>
            Assinatura
          </Link>

          <Link href="/logout" style={navBtn}>
            Sair
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px",
        }}
      >
        {children}
      </main>
    </div>
  );
}

const navBtn = {
  padding: "10px 14px",
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 700,
  textDecoration: "none",
  color: "#E6EAF2",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};
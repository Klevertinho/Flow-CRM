import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.14) 0%, rgba(15,23,42,0.98) 28%, #020617 70%, #01030a 100%)",
        color: "#f8fafc",
        display: "grid",
        gridTemplateColumns: "260px 1fr",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(2,6,23,0.55)",
          backdropFilter: "blur(10px)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 34,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg,#3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 16px 40px rgba(37,99,235,0.25)",
                fontWeight: 900,
              }}
            >
              V
            </div>

            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 22,
                  letterSpacing: -0.6,
                }}
              >
                VALORA
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 12,
                }}
              >
                CRM comercial
              </div>
            </div>
          </div>

          <nav
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            {[
              { label: "Dashboard", href: "/app", active: true },
              { label: "Assinatura", href: "/billing" },
              { label: "Minha conta", href: "/account" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  minHeight: 44,
                  padding: "0 14px",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  color: item.active ? "#fff" : "rgba(255,255,255,0.66)",
                  background: item.active
                    ? "rgba(37,99,235,0.14)"
                    : "transparent",
                  border: item.active
                    ? "1px solid rgba(96,165,250,0.18)"
                    : "1px solid transparent",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          <div
            style={{
              padding: 14,
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                color: "rgba(255,255,255,0.48)",
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              Sessão ativa
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                wordBreak: "break-word",
              }}
            >
              {user.email}
            </div>
          </div>

          <Link
            href="/logout"
            style={{
              minHeight: 46,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Sair
          </Link>
        </div>
      </aside>

      <div
        style={{
          minWidth: 0,
        }}
      >
        <header
          style={{
            minHeight: 78,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            background: "rgba(2,6,23,0.35)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.46)",
                fontWeight: 700,
              }}
            >
              Painel comercial
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: -0.4,
              }}
            >
              CRM VALORA
            </div>
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.56)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            operação clara > improviso
          </div>
        </header>

        <main
          style={{
            padding: 28,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
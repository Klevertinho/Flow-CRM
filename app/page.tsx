import Link from "next/link";
import { createClient } from "../lib/supabase/server";

function Button({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: "14px 22px",
        borderRadius: 14,
        fontWeight: 800,
        fontSize: 14,
        textDecoration: "none",
        background: primary ? "#2F6BFF" : "rgba(255,255,255,0.06)",
        color: "#fff",
        border: primary ? "none" : "1px solid rgba(255,255,255,0.12)",
        boxShadow: primary
          ? "0 12px 30px rgba(47,107,255,0.35)"
          : "none",
        transition: "all .2s ease",
      }}
    >
      {children}
    </Link>
  );
}

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(47,107,255,0.15), transparent 40%), #0B1220",
        color: "#E6EAF2",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 900 }}>VALORA</div>

        <div style={{ display: "flex", gap: 12 }}>
          {user ? (
            <>
              <Button href="/app" primary>
                Ir para o CRM
              </Button>
              <Button href="/logout">Sair</Button>
            </>
          ) : (
            <>
              <Button href="/login">Login</Button>
              <Button href="/signup" primary>
                Começar
              </Button>
            </>
          )}
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              marginBottom: 16,
              fontSize: 12,
              color: "#C6A85A",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            VALORA CRM
          </div>

          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1,
              marginBottom: 20,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            Mais controle.
            <br />
            Mais vendas.
            <br />
            Menos caos.
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: "rgba(230,234,242,0.7)",
              maxWidth: 500,
            }}
          >
            Organize leads, acompanhe follow-ups e transforme conversas soltas em uma operação comercial previsível e lucrativa.
          </p>

          <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
            <Button href={user ? "/app" : "/signup"} primary>
              Começar agora
            </Button>

            <Button href={user ? "/billing" : "/login"}>
              {user ? "Minha conta" : "Login"}
            </Button>
          </div>
        </div>

        {/* MOCK */}
        <div
          style={{
            padding: 20,
            borderRadius: 20,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              background: "#0A0F1A",
              marginBottom: 12,
            }}
          >
            Leads ativos: <strong>28</strong>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 14,
              background: "#0A0F1A",
              marginBottom: 12,
            }}
          >
            Follow-ups vencidos: <strong style={{ color: "#ff6b6b" }}>4</strong>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 14,
              background: "#0A0F1A",
            }}
          >
            Conversão: <strong style={{ color: "#2F6BFF" }}>24%</strong>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: 40,
          fontSize: 13,
          color: "rgba(255,255,255,0.4)",
        }}
      >
        VALORA © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
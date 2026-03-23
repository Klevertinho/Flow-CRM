import Link from "next/link";
import { createClient } from "../lib/supabase/server";

function Section(props: { children: React.ReactNode }) {
  return (
    <section
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "80px 20px",
      }}
    >
      {props.children}
    </section>
  );
}

function ButtonPrimary(props: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={props.href}
      style={{
        display: "inline-block",
        padding: "14px 22px",
        borderRadius: 12,
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "#fff",
        fontWeight: 800,
        textDecoration: "none",
        boxShadow: "0 20px 40px rgba(37,99,235,0.3)",
      }}
    >
      {props.children}
    </Link>
  );
}

export default async function LandingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let primaryHref = "/signup";
let primaryLabel = "Começar agora";
let secondaryHref = "/signup";
let secondaryLabel = "Criar conta";

if (user) {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (subscription) {
    primaryHref = "/app";
    primaryLabel = "Ir para o CRM";
    secondaryHref = "/app";
    secondaryLabel = "Abrir meu CRM";
  } else {
    primaryHref = "/billing";
    primaryLabel = "Ativar assinatura";
    secondaryHref = "/billing";
    secondaryLabel = "Ir para assinatura";
  }
}

  return (
    <div
      style={{
        background: "#020617",
        color: "#f8fafc",
      }}
    >
      <Section>
        <div style={{ maxWidth: 700 }}>
          <div
            style={{
              color: "#93c5fd",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            CRM simples para quem vende no WhatsApp
          </div>

          <h1
            style={{
              fontSize: 52,
              lineHeight: 1.05,
              fontWeight: 900,
              marginBottom: 18,
            }}
          >
            Pare de perder vendas por falta de organização
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 18,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            Organize seus leads, acompanhe follow-ups e feche mais vendas
            sem depender da memória ou do caos do WhatsApp.
          </p>

          <ButtonPrimary href={primaryHref}>{primaryLabel}</ButtonPrimary>
        </div>
      </Section>

      <Section>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 900,
            marginBottom: 20,
          }}
        >
          O problema não é falta de lead
        </h2>

        <p
          style={{
            color: "#94a3b8",
            fontSize: 16,
            lineHeight: 1.8,
            maxWidth: 700,
          }}
        >
          É perder oportunidades porque você esqueceu de responder,
          não fez follow-up ou simplesmente se perdeu nas conversas.
        </p>
      </Section>

      <Section>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 900,
            marginBottom: 20,
          }}
        >
          Um CRM feito para conversas reais
        </h2>

        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          }}
        >
          <div style={{ color: "#94a3b8" }}>
            ✔ Controle todos os leads em um só lugar
          </div>
          <div style={{ color: "#94a3b8" }}>
            ✔ Saiba quem precisa de atenção hoje
          </div>
          <div style={{ color: "#94a3b8" }}>
            ✔ Nunca esqueça um follow-up
          </div>
          <div style={{ color: "#94a3b8" }}>
            ✔ Visual simples e direto ao ponto
          </div>
        </div>
      </Section>

      <Section>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 900,
            marginBottom: 20,
          }}
        >
          Como funciona
        </h2>

        <div style={{ color: "#94a3b8", lineHeight: 1.8 }}>
          1. Adicione seus leads
          <br />
          2. Organize por status
          <br />
          3. Acompanhe follow-ups
          <br />
          4. Feche mais vendas
        </div>
      </Section>

      <Section>
        <div
          style={{
            padding: 30,
            borderRadius: 20,
            background: "#0b1220",
            border: "1px solid #22304a",
            maxWidth: 500,
          }}
        >
          <h3
            style={{
              fontSize: 24,
              fontWeight: 900,
              marginBottom: 10,
            }}
          >
            Plano Pro
          </h3>

          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              marginBottom: 10,
            }}
          >
            R$79/mês
          </div>

          <p
            style={{
              color: "#94a3b8",
              marginBottom: 20,
            }}
          >
            Tudo que você precisa para organizar sua operação comercial
          </p>

          <ButtonPrimary href={secondaryHref}>{secondaryLabel}</ButtonPrimary>
        </div>
      </Section>

      <Section>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 900,
            marginBottom: 16,
          }}
        >
          Comece agora e pare de perder vendas
        </h2>

        <ButtonPrimary href={secondaryHref}>{secondaryLabel}</ButtonPrimary>
      </Section>
    </div>
  );
}
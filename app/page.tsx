import Link from "next/link";

export default function Page() {
  return (
    <div
      style={{
        padding: "80px 60px",
        maxWidth: 1200,
        margin: "0 auto",
        display: "grid",
        gap: 80,
      }}
    >
      {/* HERO */}
      <section style={{ display: "grid", gap: 24 }}>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.1,
            maxWidth: 800,
          }}
        >
          Pare de perder vendas por desorganização.
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "var(--muted)",
            maxWidth: 600,
          }}
        >
          O VALORA organiza seus leads, prioriza quem você deve falar agora
          e transforma conversas soltas em uma operação previsível e lucrativa.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login">
            <button
              style={{
                background: "var(--primary)",
                border: "none",
                padding: "12px 18px",
                borderRadius: 10,
                color: "white",
                fontWeight: 600,
              }}
            >
              Começar agora
            </button>
          </Link>

          <Link href="/login">
            <button
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                padding: "12px 18px",
                borderRadius: 10,
                color: "white",
              }}
            >
              Já tenho conta
            </button>
          </Link>
        </div>
      </section>

      {/* PROVA VISUAL (SIMULAÇÃO DO PRODUTO) */}
      <section
        style={{
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 24,
          background: "rgba(15,23,42,0.6)",
        }}
      >
        <div style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              padding: 14,
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
            }}
          >
            Leads ativos: <strong>28</strong>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
            }}
          >
            Follow-ups atrasados: <strong style={{ color: "#ef4444" }}>4</strong>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
            }}
          >
            Conversão: <strong style={{ color: "#22c55e" }}>24%</strong>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section style={{ display: "grid", gap: 16 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800 }}>
          O problema não é falta de lead.
        </h2>

        <p style={{ color: "var(--muted)", maxWidth: 600 }}>
          É falta de organização. Conversas perdidas, follow-ups esquecidos
          e oportunidades que simplesmente morrem no WhatsApp.
        </p>
      </section>

      {/* SOLUÇÃO */}
      <section style={{ display: "grid", gap: 16 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800 }}>
          O VALORA resolve isso pra você.
        </h2>

        <div style={{ display: "grid", gap: 12 }}>
          <div>✔ Prioriza quem você deve falar agora</div>
          <div>✔ Organiza seus leads automaticamente</div>
          <div>✔ Te lembra de follow-ups importantes</div>
          <div>✔ Te ajuda a fechar mais vendas</div>
        </div>
      </section>

      {/* DIFERENCIAL */}
      <section style={{ display: "grid", gap: 16 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800 }}>
          Não é só um CRM.
        </h2>

        <p style={{ color: "var(--muted)", maxWidth: 600 }}>
          É um sistema que te diz exatamente o que fazer para vender mais.
        </p>
      </section>

      {/* CTA FINAL */}
      <section style={{ display: "grid", gap: 16 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800 }}>
          Comece agora e organize sua operação.
        </h2>

        <Link href="/login">
          <button
            style={{
              background: "var(--primary)",
              border: "none",
              padding: "14px 20px",
              borderRadius: 10,
              color: "white",
              fontWeight: 700,
              width: 200,
            }}
          >
            Criar conta
          </button>
        </Link>
      </section>
    </div>
  );
}
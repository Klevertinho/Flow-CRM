import Link from "next/link";

export default function Page() {
  return (
    <div style={{ padding: "80px 60px" }}>
      
      <h1 style={{
        fontSize: 64,
        fontWeight: 900,
        lineHeight: 1.1
      }}>
        Mais controle. <br /> Mais vendas.
      </h1>

      <p style={{
        marginTop: 20,
        fontSize: 18,
        color: "var(--muted)",
        maxWidth: 500
      }}>
        Organize leads, acompanhe follow-ups e transforme
        conversas em receita com inteligência.
      </p>

      <div style={{ marginTop: 30, display: "flex", gap: 12 }}>
        <Link href="/login">Começar</Link>
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
}
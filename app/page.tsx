import Link from "next/link";

export default function Page() {
  return (
    <div style={{ padding: 60 }}>
      <h1 style={{ fontSize: 52, fontWeight: 900 }}>
        Mais controle. Mais vendas.
      </h1>

      <p style={{ opacity: 0.7 }}>
        Transforme conversas em receita com inteligência.
      </p>

      <div style={{ marginTop: 30 }}>
        <Link href="/login">Começar</Link>
      </div>
    </div>
  );
}
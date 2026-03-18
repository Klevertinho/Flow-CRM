export default function BillingSuccessPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#0f172a",
          border: "1px solid #1f2937",
          borderRadius: 20,
          padding: 28,
          textAlign: "center",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Pagamento confirmado</h1>
        <p style={{ color: "#94a3b8", lineHeight: 1.7 }}>
          Sua assinatura foi processada. Aguarde alguns segundos e volte ao CRM.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "14px 16px",
            borderRadius: 12,
            background: "#2563eb",
            color: "#fff",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Voltar para o CRM
        </a>
      </div>
    </div>
  );
}
const res = await fetch("/api/checkout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ plan }),
});

const data = await res.json();

if (res.status === 409) {
  alert(data?.error || "Sua conta já possui assinatura ativa.");
  router.push(data?.redirectTo || "/app");
  return;
}

if (!res.ok) {
  throw new Error(data?.error || "Erro ao iniciar checkout.");
}

if (!data?.url) {
  throw new Error("Checkout sem URL.");
}

window.location.href = data.url as string;
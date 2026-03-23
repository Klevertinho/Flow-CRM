"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type PlanKey = "starter" | "pro";

export default function BillingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submittingPlan, setSubmittingPlan] = useState<PlanKey | null>(null);

  useEffect(() => {
    const status = searchParams.get("status");

    async function handleBilling() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (status === "success") {
        setMessage("Pagamento confirmado. Redirecionando...");
        setTimeout(() => {
          router.push("/app");
        }, 1200);
        return;
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (sub?.status === "active") {
        router.push("/app");
        return;
      }

      if (status === "cancel") {
        setMessage("Pagamento cancelado. Você pode tentar novamente.");
      }

      setLoading(false);
    }

    void handleBilling();
  }, [router, searchParams, supabase]);

  async function goToCheckout(plan: PlanKey) {
    try {
      setSubmittingPlan(plan);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erro ao iniciar checkout.");
      }

      if (!data?.url) {
        throw new Error("Checkout sem URL.");
      }

      window.location.href = data.url as string;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao iniciar checkout.");
      setSubmittingPlan(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-12">
      <div className="mx-auto w-full max-w-6xl">
        {message ? (
          <div className="mb-6 rounded-lg border border-green-500/40 bg-green-600/20 px-4 py-3 text-center">
            {message}
          </div>
        ) : null}

        <div className="mb-12 text-center">
          <p className="mb-3 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
            Planos FlowCRM
          </p>

          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Escolha o plano para escalar suas vendas
          </h1>

          <p className="mx-auto max-w-2xl text-base text-white/65 md:text-lg">
            Organize leads, pare de perder follow-up e transforme seu WhatsApp em operação comercial de verdade.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex min-h-[420px] flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6">
            <div>
              <h2 className="text-2xl font-semibold">Starter</h2>
              <div className="mt-3 text-4xl font-bold">
                R$ 39
                <span className="ml-1 text-base font-medium text-white/50">/mês</span>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/65">
                Para quem quer sair do caos e começar a organizar a operação comercial sem complicação.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-white/75">
                <li>• Pipeline comercial por etapa</li>
                <li>• Follow-ups e histórico</li>
                <li>• 1 usuário com acesso completo</li>
                <li>• Portal de assinatura incluso</li>
              </ul>
            </div>

            <button
              type="button"
              className="mt-8 w-full rounded-lg bg-white px-4 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => void goToCheckout("starter")}
              disabled={submittingPlan !== null}
            >
              {submittingPlan === "starter" ? "Abrindo..." : "Começar no Starter"}
            </button>
          </div>

          <div className="relative flex min-h-[420px] scale-[1.01] flex-col justify-between rounded-2xl border border-blue-500 bg-blue-500/10 p-6 shadow-[0_0_0_1px_rgba(59,130,246,.15),0_20px_60px_rgba(37,99,235,.18)]">
            <div className="mb-4 inline-flex w-fit rounded-full bg-blue-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Mais recomendado
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Pro</h2>
              <div className="mt-3 text-4xl font-bold">
                R$ 79
                <span className="ml-1 text-base font-medium text-white/50">/mês</span>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/70">
                Para quem quer mais valor percebido, mais estrutura e um plano melhor para crescer sem improviso.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-white/80">
                <li>• Tudo do Starter</li>
                <li>• Melhor posicionamento comercial</li>
                <li>• Mais espaço para evolução do produto</li>
                <li>• Prioridade natural em melhorias futuras</li>
              </ul>
            </div>

            <button
              type="button"
              className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => void goToCheckout("pro")}
              disabled={submittingPlan !== null}
            >
              {submittingPlan === "pro" ? "Abrindo..." : "Assinar o Pro"}
            </button>
          </div>

          <div className="flex min-h-[420px] flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6">
            <div>
              <h2 className="text-2xl font-semibold">Equipe</h2>
              <div className="mt-3 text-2xl font-bold text-white/85">Sob consulta</div>

              <p className="mt-4 text-sm leading-6 text-white/65">
                Para operação maior, múltiplos usuários e necessidades comerciais mais específicas.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-white/75">
                <li>• Multiusuários</li>
                <li>• Atendimento consultivo</li>
                <li>• Possível personalização futura</li>
                <li>• Melhor encaixe para ticket maior</li>
              </ul>
            </div>

            <a
              href="mailto:klevertons.a74@gmail.com?subject=Quero o plano Equipe do FlowCRM"
              className="mt-8 block w-full rounded-lg border border-white/20 px-4 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Falar com a gente
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
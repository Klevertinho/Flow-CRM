"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function BillingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
        }, 1500);

        return;
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (sub && sub.status === "active") {
        router.push("/app");
        return;
      }

      setLoading(false);
    }

    handleBilling();
  }, [searchParams, router, supabase]);

  if (loading) {
    return (
  <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-4">
    <div className="w-full max-w-6xl">

      {message && (
        <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center">
          {message}
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Escolha o plano para escalar suas vendas
        </h1>
        <p className="text-white/60 max-w-xl mx-auto">
          Organize seus leads, nunca mais perca follow-up e feche mais vendas com um fluxo simples.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* STARTER */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold">Starter</h2>
            <p className="text-3xl font-bold mt-2">R$ 39<span className="text-sm text-white/50">/mês</span></p>

            <ul className="mt-6 space-y-2 text-sm text-white/70">
              <li>• Pipeline simples</li>
              <li>• Follow-up básico</li>
              <li>• 1 usuário</li>
            </ul>
          </div>

          <button
            className="mt-6 w-full bg-white text-black py-2 rounded-lg hover:opacity-90"
            onClick={() => {
              window.location.href = "/api/checkout?plan=starter";
            }}
          >
            Começar
          </button>
        </div>

        {/* PRO (DESTAQUE) */}
        <div className="bg-blue-600/10 border border-blue-500 rounded-2xl p-6 flex flex-col justify-between scale-105 shadow-lg">
          <div>
            <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
              MAIS RECOMENDADO
            </span>

            <h2 className="text-xl font-semibold mt-3">Pro</h2>
            <p className="text-3xl font-bold mt-2">R$ 79<span className="text-sm text-white/50">/mês</span></p>

            <ul className="mt-6 space-y-2 text-sm text-white/80">
              <li>• Tudo do Starter</li>
              <li>• Automação de follow-up</li>
              <li>• Melhor organização</li>
              <li>• Prioridade em melhorias</li>
            </ul>
          </div>

          <button
            className="mt-6 w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => {
              window.location.href = "/api/checkout?plan=pro";
            }}
          >
            Assinar agora
          </button>
        </div>

        {/* ENTERPRISE */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold">Equipe</h2>
            <p className="text-lg mt-2 text-white/60">Sob consulta</p>

            <ul className="mt-6 space-y-2 text-sm text-white/70">
              <li>• Multi usuários</li>
              <li>• Personalização</li>
              <li>• Suporte dedicado</li>
            </ul>
          </div>

          <button className="mt-6 w-full border border-white/20 py-2 rounded-lg hover:bg-white/10">
            Falar com a gente
          </button>
        </div>

      </div>
    </div>
  </div>
);
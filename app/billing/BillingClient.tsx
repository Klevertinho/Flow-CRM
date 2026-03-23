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
      <div className="min-h-screen flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
    <div className="w-full max-w-5xl p-10">
      {message && (
        <div className="bg-green-600 p-4 rounded mb-6 text-center">
          {message}
        </div>
      )}

      <h1 className="text-4xl font-bold mb-10 text-center">
        Escolha o plano que acompanha o ritmo da sua operação
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
          <h2 className="text-xl font-semibold">Starter</h2>
          <p className="text-3xl mt-2">R$ 39</p>

          <button
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            onClick={() => {
              window.location.href = "/api/checkout?plan=starter";
            }}
          >
            Assinar
          </button>
        </div>

        <div className="p-6 rounded-xl border border-blue-500 bg-white/5 backdrop-blur">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="text-3xl mt-2">R$ 79</p>

          <button
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            onClick={() => {
              window.location.href = "/api/checkout?plan=pro";
            }}
          >
            Assinar
          </button>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
          <h2 className="text-xl font-semibold">Equipe</h2>
          <p className="text-lg mt-2">Sob consulta</p>
        </div>
      </div>
    </div>
  </div>
);
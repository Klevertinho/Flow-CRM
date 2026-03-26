"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Plan = "starter" | "pro";

function HeaderButton({
  href,
  children,
  primary,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}) {
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 20px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 15,
    border: primary ? "none" : "1px solid rgba(255,255,255,0.10)",
    background: primary
      ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
      : "rgba(255,255,255,0.04)",
    color: "#fff",
    boxShadow: primary ? "0 20px 50px rgba(37,99,235,0.30)" : "none",
    transition: "transform .18s ease",
    cursor: "pointer",
  };

  if (href) {
    return (
      <Link
        href={href}
        style={style}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 999,
        border: "1px solid rgba(96,165,250,0.22)",
        background: "rgba(37,99,235,0.10)",
        color: "#bfdbfe",
        fontWeight: 800,
        fontSize: 13,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#60a5fa",
          boxShadow: "0 0 14px rgba(96,165,250,0.7)",
        }}
      />
      {children}
    </div>
  );
}

function GlassCard({
  children,
  highlighted,
}: {
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 24,
        padding: 22,
        background: highlighted
          ? "linear-gradient(180deg, rgba(25,48,112,0.34) 0%, rgba(10,18,35,0.96) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
        border: highlighted
          ? "1px solid rgba(59,130,246,0.50)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: highlighted
          ? "0 32px 90px rgba(37,99,235,0.18)"
          : "0 22px 60px rgba(0,0,0,0.22)",
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}

function MetricChip({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 18,
        padding: "16px 18px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <span
        style={{
          color: "rgba(255,255,255,0.72)",
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: -0.8,
          color: accent || "#fff",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function PricingCard({
  title,
  price,
  subtitle,
  features,
  cta,
  highlighted,
  badge,
  onClick,
  footnote,
  isHighlightedByQuery,
  loading,
}: {
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  onClick: () => void;
  footnote?: string;
  isHighlightedByQuery?: boolean;
  loading?: boolean;
}) {
  return (
    <div
      style={{
        transform: isHighlightedByQuery ? "scale(1.02)" : "scale(1)",
        transition: "transform .25s ease",
      }}
    >
      <GlassCard highlighted={highlighted || isHighlightedByQuery}>
        {badge ? (
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: 999,
              background:
                highlighted || isHighlightedByQuery
                  ? "#2563eb"
                  : "rgba(255,255,255,0.08)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 12,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {badge}
          </div>
        ) : null}

        <div
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: "#fff",
            marginBottom: 12,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: price === "Sob consulta" ? 34 : 50,
              lineHeight: 1,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            {price}
          </span>

          {price !== "Sob consulta" ? (
            <span
              style={{
                color: "rgba(255,255,255,0.55)",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              /mês
            </span>
          ) : null}
        </div>

        <p
          style={{
            color: "rgba(255,255,255,0.70)",
            lineHeight: 1.8,
            fontSize: 15,
            minHeight: 84,
            margin: 0,
          }}
        >
          {subtitle}
        </p>

        <div style={{ display: "grid", gap: 11, marginTop: 24 }}>
          {features.map((feature) => (
            <div
              key={feature}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                color: "rgba(255,255,255,0.82)",
                lineHeight: 1.6,
                fontSize: 15,
              }}
            >
              <span style={{ color: "#60a5fa", fontWeight: 900 }}>•</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClick}
          disabled={loading}
          style={{
            marginTop: 28,
            width: "100%",
            minHeight: 54,
            borderRadius: 16,
            border:
              highlighted || isHighlightedByQuery
                ? "none"
                : "1px solid rgba(255,255,255,0.14)",
            background:
              highlighted || isHighlightedByQuery
                ? "linear-gradient(135deg,#3b82f6 0%, #2563eb 100%)"
                : "rgba(255,255,255,0.05)",
            color: "#fff",
            fontWeight: 900,
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Carregando..." : cta}
        </button>

        {footnote ? (
          <div
            style={{
              marginTop: 12,
              color: "rgba(255,255,255,0.45)",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            {footnote}
          </div>
        ) : null}
      </GlassCard>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderRadius: 18,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "18px 20px",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: 16,
          fontWeight: 800,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <span>{question}</span>
        <span style={{ opacity: 0.7 }}>{open ? "−" : "+"}</span>
      </button>

      {open ? (
        <div
          style={{
            padding: "0 20px 18px",
            color: "rgba(255,255,255,0.68)",
            lineHeight: 1.8,
            fontSize: 15,
          }}
        >
          {answer}
        </div>
      ) : null}
    </div>
  );
}

export default function LandingClientPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const pricingRef = useRef<HTMLElement | null>(null);
  const [pricingPulse, setPricingPulse] = useState(false);
  const [activeMockTab, setActiveMockTab] = useState<"today" | "pipeline" | "ai">("today");
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const highlightedPlanFromQuery =
    searchParams.get("plan") === "pro"
      ? "pro"
      : searchParams.get("plan") === "starter"
      ? "starter"
      : null;

  const shouldOpenPlans =
    searchParams.get("plans") === "1" || searchParams.get("plan") !== null;

  useEffect(() => {
    async function loadState() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(!!user);

      if (!user) {
        setHasActiveSubscription(false);
        return;
      }

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      setHasActiveSubscription(!!subscription);
    }

    void loadState();
  }, [supabase]);

  useEffect(() => {
    if (!shouldOpenPlans) return;

    const timeout = window.setTimeout(() => {
      pricingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPricingPulse(true);
      window.setTimeout(() => setPricingPulse(false), 1200);
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [shouldOpenPlans]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveMockTab((prev) => {
        if (prev === "today") return "pipeline";
        if (prev === "pipeline") return "ai";
        return "today";
      });
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  async function handlePlanClick(plan: Plan) {
    try {
      setLoadingPlan(plan);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = `/signup?plan=${plan}`;
        return;
      }

      const { data: activeSubscription } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (activeSubscription) {
        window.location.href = "/app";
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (res.status === 409) {
        window.location.href = data?.redirectTo || "/app";
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Erro ao iniciar checkout.");
      }

      if (!data?.url) {
        throw new Error("Checkout sem URL.");
      }

      window.location.href = data.url;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao iniciar checkout.");
    } finally {
      setLoadingPlan(null);
    }
  }

  const goToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setPricingPulse(true);
    window.setTimeout(() => setPricingPulse(false), 1100);
  };

  const mockContent = useMemo(() => {
    if (activeMockTab === "today") {
      return (
        <>
          <MetricChip label="Leads ativos" value="28" />
          <MetricChip label="Follow-ups vencidos" value="4" accent="#fda4af" />
          <MetricChip label="Negócios quentes" value="7" accent="#86efac" />
          <div
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 18,
              background: "rgba(37,99,235,0.12)",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            <div style={{ fontSize: 13, color: "#93c5fd", fontWeight: 800 }}>
              Próxima ação sugerida
            </div>
            <div style={{ marginTop: 6, fontWeight: 800, color: "#fff" }}>
              Responder João agora — lead quente há 2h
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "rgba(255,255,255,0.60)",
              }}
            >
              Probabilidade de fechamento: alta
            </div>
          </div>
        </>
      );
    }

    if (activeMockTab === "pipeline") {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 12,
          }}
        >
          {[
            {
              name: "Entrada",
              color: "#93c5fd",
              items: ["Juliana", "Rafael", "André"],
            },
            {
              name: "Proposta",
              color: "#facc15",
              items: ["João", "Bianca"],
            },
            {
              name: "Fechamento",
              color: "#86efac",
              items: ["Maria", "Carlos"],
            },
          ].map((column) => (
            <div
              key={column.name}
              style={{
                borderRadius: 18,
                padding: 14,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  color: column.color,
                  fontWeight: 900,
                  fontSize: 14,
                  marginBottom: 12,
                }}
              >
                {column.name}
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {column.items.map((item) => (
                  <div
                    key={item}
                    style={{
                      borderRadius: 14,
                      padding: "12px 12px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            padding: 16,
            borderRadius: 18,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ fontSize: 13, color: "#93c5fd", fontWeight: 800 }}>
            Resumo inteligente
          </div>
          <div
            style={{
              marginTop: 8,
              color: "rgba(255,255,255,0.80)",
              lineHeight: 1.8,
              fontSize: 14,
            }}
          >
            Lead pediu orçamento, respondeu rápido e demonstrou interesse real.
            Melhor momento para follow-up é agora.
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 18,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ fontSize: 13, color: "#93c5fd", fontWeight: 800 }}>
            Sugestão de mensagem
          </div>
          <div
            style={{
              marginTop: 8,
              color: "rgba(255,255,255,0.80)",
              lineHeight: 1.8,
              fontSize: 14,
            }}
          >
            “João, vi que você analisou a proposta. Quer que eu te mostre o melhor caminho para fechar isso hoje?”
          </div>
        </div>
      </div>
    );
  }, [activeMockTab]);

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#f8fafc",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.16) 0%, rgba(15,23,42,0.98) 30%, #020617 70%, #01030a 100%)",
      }}
    >
      <header
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          padding: "24px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg,#3b82f6 0%, #2563eb 100%)",
              boxShadow: "0 20px 40px rgba(37,99,235,0.25)",
              fontWeight: 900,
              color: "#fff",
            }}
          >
            V
          </div>

          <div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 24,
                letterSpacing: -0.7,
              }}
            >
              VALORA
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
                marginTop: 2,
              }}
            >
              CRM inteligente para operação comercial
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {isLoggedIn ? (
            <>
              <HeaderButton href="/logout">Sair</HeaderButton>
              {hasActiveSubscription ? (
                <HeaderButton href="/app" primary>
                  Ir para o CRM
                </HeaderButton>
              ) : (
                <HeaderButton onClick={goToPricing} primary>
                  Ver planos
                </HeaderButton>
              )}
            </>
          ) : (
            <>
              <HeaderButton href="/login">Login</HeaderButton>
              <HeaderButton onClick={goToPricing} primary>
                Ver planos
              </HeaderButton>
            </>
          )}
        </div>
      </header>

      <section
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          padding: "38px 20px 56px",
          display: "grid",
          gridTemplateColumns: "1.06fr 0.94fr",
          gap: 32,
          alignItems: "center",
        }}
      >
        <div>
          <SectionTag>Venda com mais controle, ritmo e previsibilidade</SectionTag>

          <h1
            style={{
              marginTop: 22,
              marginBottom: 18,
              fontSize: "clamp(48px, 7vw, 88px)",
              lineHeight: 0.96,
              letterSpacing: -2.8,
              fontWeight: 900,
              maxWidth: 860,
            }}
          >
            Pare de perder vendas por desorganização.
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 740,
              color: "rgba(255,255,255,0.70)",
              fontSize: 22,
              lineHeight: 1.75,
            }}
          >
            O VALORA organiza seus leads, mostra quem precisa de atenção agora e transforma conversas soltas em uma operação comercial mais séria, previsível e lucrativa.
          </p>

          <div
            style={{
              marginTop: 30,
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <HeaderButton onClick={goToPricing} primary>
              Quero organizar minhas vendas
            </HeaderButton>

            {isLoggedIn ? (
              hasActiveSubscription ? (
                <HeaderButton href="/app">Ir para o CRM</HeaderButton>
              ) : (
                <HeaderButton href="/logout">Trocar de conta</HeaderButton>
              )
            ) : (
              <HeaderButton href="/login">Já tenho conta</HeaderButton>
            )}
          </div>

          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0,1fr))",
              gap: 14,
            }}
          >
            {[
              ["Mais clareza", "Veja quem precisa de ação hoje e o que está travando sua operação."],
              ["Mais processo", "Pare de depender da memória e das conversas perdidas no WhatsApp."],
              ["Mais fechamento", "Fale na hora certa, com prioridade e contexto para vender mais."],
            ].map(([title, text]) => (
              <GlassCard key={title}>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 20,
                    marginBottom: 10,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.64)",
                    lineHeight: 1.8,
                    fontSize: 15,
                  }}
                >
                  {text}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <GlassCard highlighted>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            {[
              ["today", "Hoje"],
              ["pipeline", "Pipeline"],
              ["ai", "IA"],
            ].map(([key, label]) => {
              const active = activeMockTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveMockTab(key as "today" | "pipeline" | "ai")}
                  style={{
                    minHeight: 38,
                    padding: "0 14px",
                    borderRadius: 999,
                    border: active
                      ? "1px solid rgba(96,165,250,0.40)"
                      : "1px solid rgba(255,255,255,0.08)",
                    background: active
                      ? "rgba(37,99,235,0.14)"
                      : "rgba(255,255,255,0.04)",
                    color: active ? "#bfdbfe" : "rgba(255,255,255,0.65)",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {mockContent}
        </GlassCard>
      </section>

      <section
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          padding: "0 20px 56px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            gap: 16,
          }}
        >
          {[
            ["Sem conversa perdida", "Centralize histórico, contexto e prioridade no mesmo lugar.", "💬"],
            ["Follow-up no timing certo", "Saiba com quem falar agora antes da oportunidade esfriar.", "⏱️"],
            ["Mais imagem de profissionalismo", "Troque improviso por processo e confiança comercial.", "🛡️"],
            ["Base pronta para IA", "Estruture sua operação para receber camadas de inteligência depois.", "🧠"],
          ].map(([title, text, icon]) => (
            <BenefitCard key={title} title={title} text={text} icon={icon} />
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "10px 20px 64px",
        }}
      >
        <div
          style={{
            maxWidth: 920,
            margin: "0 auto 34px",
            textAlign: "center",
          }}
        >
          <SectionTag>O que o cliente sente quando usa</SectionTag>

          <h2
            style={{
              marginTop: 18,
              fontSize: "clamp(36px, 5vw, 58px)",
              lineHeight: 1.04,
              fontWeight: 900,
            }}
          >
            Não é só um CRM. É uma operação com mais inteligência.
          </h2>

          <p
            style={{
              marginTop: 14,
              color: "rgba(255,255,255,0.68)",
              fontSize: 19,
              lineHeight: 1.8,
            }}
          >
            A pessoa não compra mais uma ferramenta. Ela compra a sensação de finalmente ter controle sobre o próprio comercial.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <GlassCard>
            <div
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.78)",
                fontWeight: 800,
                fontSize: 12,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Antes
            </div>

            <div
              style={{
                color: "#fff",
                fontSize: 30,
                fontWeight: 900,
                marginBottom: 16,
              }}
            >
              Venda no improviso
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {[
                "Lead quente misturado com conversa velha",
                "Follow-up esquecido por falta de rotina",
                "Sem visão clara do que precisa ser feito hoje",
                "Decisão comercial baseada em memória",
              ].map((line) => (
                <div
                  key={line}
                  style={{
                    display: "flex",
                    gap: 10,
                    color: "rgba(255,255,255,0.76)",
                    lineHeight: 1.7,
                  }}
                >
                  <span style={{ color: "#fca5a5" }}>•</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard highlighted>
            <div
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(37,99,235,0.18)",
                color: "#bfdbfe",
                fontWeight: 800,
                fontSize: 12,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Depois
            </div>

            <div
              style={{
                color: "#fff",
                fontSize: 30,
                fontWeight: 900,
                marginBottom: 16,
              }}
            >
              Operação com clareza
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {[
                "Cada lead com histórico e próxima ação",
                "Prioridade clara para agir no tempo certo",
                "Mais processo, menos perda por desorganização",
                "Muito mais confiança para vender sem improviso",
              ].map((line) => (
                <div
                  key={line}
                  style={{
                    display: "flex",
                    gap: 10,
                    color: "rgba(255,255,255,0.82)",
                    lineHeight: 1.7,
                  }}
                >
                  <span style={{ color: "#60a5fa" }}>✓</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 20px 70px",
        }}
      >
        <div
          style={{
            maxWidth: 820,
            margin: "0 auto 28px",
            textAlign: "center",
          }}
        >
          <SectionTag>Como funciona</SectionTag>

          <h2
            style={{
              marginTop: 18,
              fontSize: "clamp(34px, 5vw, 54px)",
              lineHeight: 1.06,
              fontWeight: 900,
            }}
          >
            Simples o suficiente pra usar hoje
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 18,
          }}
        >
          <GlassCard>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#60a5fa", marginBottom: 12 }}>1</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 10 }}>Capture o lead</div>
            <div style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.8, fontSize: 15 }}>
              Adicione o contato e registre contexto sem depender de memória ou conversa solta.
            </div>
          </GlassCard>

          <GlassCard>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#60a5fa", marginBottom: 12 }}>2</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 10 }}>Organize o pipeline</div>
            <div style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.8, fontSize: 15 }}>
              Visualize prioridade, momento do lead e quem precisa de ação antes da oportunidade esfriar.
            </div>
          </GlassCard>

          <GlassCard>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#60a5fa", marginBottom: 12 }}>3</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 10 }}>Siga o processo</div>
            <div style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.8, fontSize: 15 }}>
              Faça follow-ups, mantenha histórico e transforme seu comercial em algo previsível.
            </div>
          </GlassCard>
        </div>
      </section>

      <section
        ref={pricingRef}
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          padding: "0 20px 84px",
          transform: pricingPulse ? "scale(1.01)" : "scale(1)",
          transition: "transform .35s ease",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto 34px",
            textAlign: "center",
          }}
        >
          <SectionTag>Planos</SectionTag>

          <h2
            style={{
              marginTop: 18,
              fontSize: "clamp(36px, 5vw, 60px)",
              lineHeight: 1.03,
              fontWeight: 900,
            }}
          >
            Escolha o plano que acompanha o ritmo da sua operação
          </h2>

          <p
            style={{
              marginTop: 14,
              color: "rgba(255,255,255,0.68)",
              fontSize: 19,
              lineHeight: 1.8,
            }}
          >
            Você não precisa de um sistema complexo. Precisa de um sistema que te faça vender melhor, com menos desperdício e mais controle.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <PricingCard
            title="Starter"
            price="R$ 39"
            subtitle="Para quem quer sair do caos e começar a organizar leads, follow-ups e rotina de vendas sem complicação."
            features={[
              "1 conta com acesso completo",
              "Leads + histórico + follow-ups",
              "Visão de prioridade comercial",
              "Base pronta para crescer com o produto",
            ]}
            cta="Começar no Starter"
            onClick={() => void handlePlanClick("starter")}
            footnote="Ideal para operação individual"
            isHighlightedByQuery={highlightedPlanFromQuery === "starter"}
            loading={loadingPlan === "starter"}
          />

          <PricingCard
            title="Pro"
            price="R$ 79"
            subtitle="Para quem quer mais percepção de valor, mais estrutura comercial e um plano melhor para crescer sem improviso."
            features={[
              "Tudo do Starter",
              "Melhor posicionamento para operação séria",
              "Mais espaço para evolução e recursos futuros",
              "Plano mais forte para quem quer profissionalizar o comercial",
            ]}
            cta="Assinar o Pro"
            highlighted
            badge="Mais recomendado"
            onClick={() => void handlePlanClick("pro")}
            footnote="Mais escolhido por quem quer crescer"
            isHighlightedByQuery={highlightedPlanFromQuery === "pro"}
            loading={loadingPlan === "pro"}
          />

          <PricingCard
            title="Equipe"
            price="Sob consulta"
            subtitle="Para operação maior, múltiplos usuários, necessidades específicas e evolução sob medida."
            features={[
              "Estrutura comercial maior",
              "Possível personalização futura",
              "Suporte mais próximo da operação",
              "Melhor caminho para ticket maior",
            ]}
            cta="Falar com a VALORA"
            onClick={() => {
              window.location.href =
                "mailto:klevertons.a74@gmail.com?subject=Quero o plano Equipe da VALORA";
            }}
            footnote="Para empresas com necessidade sob medida"
          />
        </div>

        <div
          style={{
            marginTop: 18,
            textAlign: "center",
            color: "rgba(255,255,255,0.48)",
            fontSize: 13,
          }}
        >
          Pagamento seguro via Stripe • Cancele quando quiser • Sem burocracia para começar
        </div>
      </section>

      <section
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "0 20px 78px",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto 24px",
            textAlign: "center",
          }}
        >
          <SectionTag>Objeções que travam compra</SectionTag>

          <h2
            style={{
              marginTop: 18,
              fontSize: "clamp(34px, 5vw, 54px)",
              lineHeight: 1.06,
              fontWeight: 900,
            }}
          >
            O cliente não precisa só gostar. Precisa confiar.
          </h2>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <FaqItem
            question="Isso serve pra quem vende pelo WhatsApp?"
            answer="Sim. O produto foi pensado justamente para operações que conversam muito, perdem timing e precisam organizar follow-up com mais clareza."
          />
          <FaqItem
            question="Preciso ser uma empresa grande para usar?"
            answer="Não. O Starter já atende autônomos, pequenos negócios e operações enxutas que querem vender melhor sem depender da memória."
          />
          <FaqItem
            question="É difícil começar?"
            answer="Não. A proposta é ser simples o suficiente para usar hoje e forte o suficiente para acompanhar seu crescimento depois."
          />
          <FaqItem
            question="Posso cancelar quando quiser?"
            answer="Sim. O pagamento é feito com segurança e o cancelamento pode ser feito sem burocracia."
          />
        </div>
      </section>

      <section
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "0 20px 120px",
        }}
      >
        <GlassCard highlighted>
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontSize: "clamp(34px, 5vw, 58px)",
                lineHeight: 1.04,
                fontWeight: 900,
                marginBottom: 14,
              }}
            >
              Menos conversa perdida. Mais processo. Mais fechamento.
            </h2>

            <p
              style={{
                maxWidth: 760,
                margin: "0 auto 24px",
                color: "rgba(255,255,255,0.74)",
                fontSize: 18,
                lineHeight: 1.8,
              }}
            >
              O cliente não quer mais uma ferramenta bonita. Ele quer a sensação de que finalmente encontrou uma solução que organiza o comercial e faz a operação andar.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <HeaderButton onClick={goToPricing} primary>
                Ver planos e começar
              </HeaderButton>

              {isLoggedIn ? (
                hasActiveSubscription ? (
                  <HeaderButton href="/app">Ir para o CRM</HeaderButton>
                ) : (
                  <HeaderButton href="/logout">Trocar de conta</HeaderButton>
                )
              ) : (
                <HeaderButton href="/login">Já tenho conta</HeaderButton>
              )}
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
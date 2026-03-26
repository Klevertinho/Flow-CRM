"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";

type Lead = {
  id: number;
  name: string;
  lastContact: number;
  messages: string[];
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: "João Silva",
      lastContact: Date.now() - 1000 * 60 * 60 * 2,
      messages: ["Pediu orçamento", "Interessado no produto"],
    },
    {
      id: 2,
      name: "Maria Souza",
      lastContact: Date.now() - 1000 * 60 * 60 * 24 * 3,
      messages: ["Sumiu depois da proposta"],
    },
  ]);

  const [name, setName] = useState("");

  function addLead() {
    if (!name) return;

    setLeads([
      ...leads,
      {
        id: Date.now(),
        name,
        lastContact: Date.now(),
        messages: ["Novo lead"],
      },
    ]);

    setName("");
  }

  function getScore(hours: number) {
    if (hours < 6) return "Quente";
    if (hours < 48) return "Morno";
    return "Frio";
  }

  function generateInsight(lead: Lead) {
    const hours =
      (Date.now() - lead.lastContact) / (1000 * 60 * 60);

    if (hours < 6)
      return "Lead engajado recentemente. Alta chance de fechamento.";

    if (hours < 48)
      return "Lead morno. Um follow-up agora pode converter.";

    return "Lead esfriando. Precisa de reengajamento.";
  }

  function generateMessage(lead: Lead) {
    return `Fala ${lead.name.split(" ")[0]}, tudo certo? Vi que você demonstrou interesse. Quer que eu te envie mais detalhes ou seguimos com a proposta?`;
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>
          CRM Inteligente
        </h1>
        <p style={{ opacity: 0.6 }}>
          Insights automáticos baseados no comportamento do lead
        </p>
      </div>

      {/* ADD */}
      <Card>
        <div style={{ display: "flex", gap: 10 }}>
          <Input
            placeholder="Nome do lead"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          <Button onClick={addLead}>Adicionar</Button>
        </div>
      </Card>

      {/* LEADS */}
      <Card>
        <div style={{ display: "grid", gap: 14 }}>
          {leads.map((lead) => {
            const hours =
              (Date.now() - lead.lastContact) /
              (1000 * 60 * 60);

            const score = getScore(hours);

            return (
              <div
                key={lead.id}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ fontWeight: 800 }}>
                  {lead.name}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.6,
                    marginBottom: 6,
                  }}
                >
                  Status: {score}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#2F6BFF",
                    marginBottom: 10,
                  }}
                >
                  {generateInsight(lead)}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    opacity: 0.7,
                    marginBottom: 10,
                  }}
                >
                  Sugestão de mensagem:
                </div>

                <div
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    background: "rgba(47,107,255,0.1)",
                    marginBottom: 10,
                  }}
                >
                  {generateMessage(lead)}
                </div>

                <Button variant="ghost">
                  Copiar mensagem
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
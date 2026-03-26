"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";

type Lead = {
  id: number;
  name: string;
  lastContact: number;
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: "João Silva",
      lastContact: Date.now() - 1000 * 60 * 60 * 2,
    },
    {
      id: 2,
      name: "Maria Souza",
      lastContact: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
  ]);

  const [name, setName] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  function addLead() {
    if (!name) return;

    setLeads([
      ...leads,
      {
        id: Date.now(),
        name,
        lastContact: Date.now(),
      },
    ]);

    setName("");
  }

  function getScore(hours: number) {
    if (hours < 6) return { label: "Quente", color: "#22c55e" };
    if (hours < 48) return { label: "Morno", color: "#facc15" };
    return { label: "Frio", color: "#ef4444" };
  }

  function getInsight(hours: number) {
    if (hours < 6) return "Alta chance de fechamento";
    if (hours < 48) return "Momento ideal para follow-up";
    return "Precisa reengajar com urgência";
  }

  function generateMessage(name: string) {
    return `Fala ${name.split(" ")[0]}, tudo certo? Vi que você demonstrou interesse. Quer que eu te envie mais detalhes ou seguimos com a proposta?`;
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 900 }}>
          Dashboard
        </h1>
        <p style={{ opacity: 0.6 }}>
          Visão geral da sua operação comercial
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
        <div style={{ fontWeight: 800, marginBottom: 12 }}>
          Leads
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {leads.map((lead) => {
            const hours =
              (Date.now() - lead.lastContact) /
              (1000 * 60 * 60);

            const score = getScore(hours);

            return (
              <div
                key={lead.id}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>
                    {lead.name}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: score.color,
                    }}
                  >
                    {score.label}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setSelectedLead(lead)}
                >
                  Abrir
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* DRAWER */}
      {selectedLead && (
        <div
          onClick={() => setSelectedLead(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 420,
              height: "100%",
              background: "#020617",
              padding: 24,
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              animation: "slideIn 0.2s ease",
            }}
          >
            {/* HEADER */}
            <div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>
                {selectedLead.name}
              </div>
            </div>

            {/* STATUS */}
            {(() => {
              const hours =
                (Date.now() - selectedLead.lastContact) /
                (1000 * 60 * 60);

              const score = getScore(hours);

              return (
                <div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>
                    Status
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      color: score.color,
                    }}
                  >
                    {score.label}
                  </div>
                </div>
              );
            })()}

            {/* INSIGHT */}
            <div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>
                Insight
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "rgba(47,107,255,0.1)",
                  fontSize: 14,
                }}
              >
                {getInsight(
                  (Date.now() - selectedLead.lastContact) /
                    (1000 * 60 * 60)
                )}
              </div>
            </div>

            {/* MENSAGEM */}
            <div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>
                Sugestão de mensagem
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  fontSize: 14,
                }}
              >
                {generateMessage(selectedLead.name)}
              </div>
            </div>

            {/* ACTION */}
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  generateMessage(selectedLead.name)
                );
              }}
            >
              Copiar mensagem
            </Button>

            <Button
              variant="ghost"
              onClick={() => setSelectedLead(null)}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
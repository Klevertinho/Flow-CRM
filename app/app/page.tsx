"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";

type Lead = {
  id: number;
  name: string;
  createdAt: number;
  lastContact: number;
  history: { text: string; time: number }[];
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: "João Silva",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      lastContact: Date.now() - 1000 * 60 * 60 * 2,
      history: [
        { text: "Lead criado", time: Date.now() - 1000 * 60 * 60 * 24 * 2 },
        { text: "Pediu orçamento", time: Date.now() - 1000 * 60 * 60 * 5 },
        { text: "Interesse alto", time: Date.now() - 1000 * 60 * 60 * 2 },
      ],
    },
  ]);

  const [name, setName] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  function addLead() {
    if (!name) return;

    const newLead: Lead = {
      id: Date.now(),
      name,
      createdAt: Date.now(),
      lastContact: Date.now(),
      history: [{ text: "Lead criado", time: Date.now() }],
    };

    setLeads([...leads, newLead]);
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
    return "Precisa reengajar urgentemente";
  }

  function formatTime(time: number) {
    const diff = Math.floor((Date.now() - time) / (1000 * 60 * 60));

    if (diff < 1) return "agora";
    if (diff < 24) return `${diff}h atrás`;

    return `${Math.floor(diff / 24)}d atrás`;
  }

  function generateMessage(name: string) {
    return `Fala ${name.split(" ")[0]}, tudo certo? Posso te ajudar a avançar com isso?`;
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 900 }}>
        CRM Inteligente
      </h1>

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
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>
                    {lead.name}
                  </div>
                  <div style={{ fontSize: 12, color: score.color }}>
                    {score.label}
                  </div>
                </div>

                <Button onClick={() => setSelectedLead(lead)}>
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
              display: "flex",
              flexDirection: "column",
              gap: 20,
              overflowY: "auto",
            }}
          >
            <h2 style={{ fontWeight: 900 }}>
              {selectedLead.name}
            </h2>

            {/* INSIGHT */}
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: "rgba(47,107,255,0.1)",
              }}
            >
              {getInsight(
                (Date.now() - selectedLead.lastContact) /
                  (1000 * 60 * 60)
              )}
            </div>

            {/* TIMELINE */}
            <div>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>
                Timeline
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {selectedLead.history.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#2F6BFF",
                        marginTop: 6,
                      }}
                    />

                    <div>
                      <div style={{ fontSize: 14 }}>
                        {item.text}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          opacity: 0.5,
                        }}
                      >
                        {formatTime(item.time)}
                      </div>
                    </div>
                  </div>
                ))}
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
                }}
              >
                {generateMessage(selectedLead.name)}
              </div>
            </div>

            <Button
              onClick={() =>
                navigator.clipboard.writeText(
                  generateMessage(selectedLead.name)
                )
              }
            >
              Copiar mensagem
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

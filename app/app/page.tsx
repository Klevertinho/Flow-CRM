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
    return "Precisa reengajar";
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

      {/* TOP GRID */}
      <div
        className="flowcrm-stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
        }}
      >
        {/* PRIORIDADE */}
        <Card>
          <div style={{ marginBottom: 12, fontWeight: 800 }}>
            Prioridade do dia
          </div>

          {leads.slice(0, 2).map((lead) => {
            const hours =
              (Date.now() - lead.lastContact) /
              (1000 * 60 * 60);

            const score = getScore(hours);

            return (
              <div
                key={lead.id}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 10,
                  background: "rgba(47,107,255,0.1)",
                }}
              >
                <div style={{ fontWeight: 700 }}>
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

                <div style={{ fontSize: 12, opacity: 0.6 }}>
                  {getInsight(hours)}
                </div>
              </div>
            );
          })}
        </Card>

        {/* RESUMO */}
        <Card>
          <div style={{ marginBottom: 12, fontWeight: 800 }}>
            Resumo
          </div>

          <div style={stat}>
            Leads: <strong>{leads.length}</strong>
          </div>

          <div style={stat}>
            Follow-ups: <strong>4</strong>
          </div>

          <div style={stat}>
            Conversão: <strong>24%</strong>
          </div>
        </Card>
      </div>

      {/* ADD */}
      <Card>
        <div style={{ display: "flex", gap: 10 }}>
          <Input
            placeholder="Nome do lead"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />

          <Button onClick={addLead}>
            Adicionar
          </Button>
        </div>
      </Card>

      {/* LISTA */}
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

                <Button variant="ghost">
                  Abrir
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

const stat = {
  marginBottom: 8,
  opacity: 0.7,
};
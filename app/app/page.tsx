"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";

type Lead = {
  id: number;
  name: string;
  lastContact: number; // timestamp
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: "João Silva",
      lastContact: Date.now() - 1000 * 60 * 60 * 2, // 2h atrás
    },
    {
      id: 2,
      name: "Maria Souza",
      lastContact: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 dias
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

  function getLeadScore(lead: Lead) {
    const hours =
      (Date.now() - lead.lastContact) / (1000 * 60 * 60);

    if (hours < 6) return { label: "Quente", color: "#22c55e" };
    if (hours < 48) return { label: "Morno", color: "#facc15" };

    return { label: "Frio", color: "#ef4444" };
  }

  function getNextAction(lead: Lead) {
    const hours =
      (Date.now() - lead.lastContact) / (1000 * 60 * 60);

    if (hours < 6) return "Acompanhar resposta";
    if (hours < 48) return "Enviar follow-up";

    return "Reengajar lead";
  }

  function getPriority(lead: Lead) {
    const hours =
      (Date.now() - lead.lastContact) / (1000 * 60 * 60);

    return hours > 24;
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>
          Dashboard Inteligente
        </h1>
        <p style={{ opacity: 0.6 }}>
          O sistema te mostra o que fazer agora
        </p>
      </div>

      {/* STATS */}
      <div
        className="flowcrm-stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        <Card>
          <div style={statLabel}>Leads</div>
          <div style={statValue}>{leads.length}</div>
        </Card>

        <Card>
          <div style={statLabel}>Alta prioridade</div>
          <div style={statValue}>
            {leads.filter(getPriority).length}
          </div>
        </Card>

        <Card>
          <div style={statLabel}>Ações hoje</div>
          <div style={statValue}>
            {leads.filter(getPriority).length}
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

          <Button onClick={addLead}>Adicionar</Button>
        </div>
      </Card>

      {/* LEADS */}
      <Card>
        <div style={{ display: "grid", gap: 12 }}>
          {leads.map((lead) => {
            const score = getLeadScore(lead);
            const action = getNextAction(lead);
            const priority = getPriority(lead);

            return (
              <div
                key={lead.id}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: priority
                    ? "rgba(47,107,255,0.12)"
                    : "rgba(255,255,255,0.03)",
                  border: priority
                    ? "1px solid #2F6BFF"
                    : "1px solid rgba(255,255,255,0.06)",
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
                      fontWeight: 700,
                    }}
                  >
                    {score.label}
                  </div>

                  <div style={{ fontSize: 12, opacity: 0.6 }}>
                    {action}
                  </div>
                </div>

                <Button variant="ghost">
                  Ver
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

const statLabel = {
  fontSize: 13,
  opacity: 0.6,
};

const statValue = {
  fontSize: 28,
  fontWeight: 900,
};
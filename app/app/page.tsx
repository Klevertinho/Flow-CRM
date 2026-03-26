"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";

type Lead = {
  id: number;
  name: string;
  status: string;
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, name: "João Silva", status: "Quente" },
    { id: 2, name: "Maria Souza", status: "Frio" },
  ]);

  const [name, setName] = useState("");

  function addLead() {
    if (!name) return;

    setLeads([
      ...leads,
      {
        id: Date.now(),
        name,
        status: "Novo",
      },
    ]);

    setName("");
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>
          Dashboard
        </h1>
        <p style={{ opacity: 0.6 }}>
          Controle seus leads e acompanhe sua operação
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
          <div style={statLabel}>Leads ativos</div>
          <div style={statValue}>{leads.length}</div>
        </Card>

        <Card>
          <div style={statLabel}>Follow-ups</div>
          <div style={statValue}>4</div>
        </Card>

        <Card>
          <div style={statLabel}>Conversão</div>
          <div style={statValue}>24%</div>
        </Card>
      </div>

      {/* ADD LEAD */}
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
        <div style={{ display: "grid", gap: 12 }}>
          {leads.map((lead) => (
            <div
              key={lead.id}
              style={{
                padding: 14,
                borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{lead.name}</div>
                <div style={{ opacity: 0.5, fontSize: 12 }}>
                  {lead.status}
                </div>
              </div>

              <Button variant="ghost">
                Ver
              </Button>
            </div>
          ))}
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
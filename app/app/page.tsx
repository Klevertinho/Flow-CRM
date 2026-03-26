"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, Button, Input } from "@/components/ui";

export default function Page() {
  const supabase = createClient();

  const [leads, setLeads] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [note, setNote] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("leads").select("*");
    setLeads(data || []);
  }

  async function addLead() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("leads").insert({
      name,
      phone,
      user_id: user?.id,
    });

    setName("");
    setPhone("");
    load();
  }

  function score(date: string) {
    const h =
      (Date.now() - new Date(date).getTime()) /
      (1000 * 60 * 60);

    if (h < 6) return "🔥";
    if (h < 48) return "⚠️";
    return "❄️";
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 900 }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--muted)" }}>
          Visão geral da operação
        </p>
      </div>

      {/* MÉTRICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        <Card>
          <strong>{leads.length}</strong>
          <div>Leads</div>
        </Card>

        <Card>
          <strong>
            {leads.filter(l => score(l.last_contact) === "🔥").length}
          </strong>
          <div>Quentes</div>
        </Card>

        <Card>
          <strong>
            {leads.filter(l => score(l.last_contact) === "❄️").length}
          </strong>
          <div>Perdidos</div>
        </Card>
      </div>

      {/* ADD */}
      <Card>
        <div style={{ display: "flex", gap: 10 }}>
          <Input
            placeholder="Nome"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          <Input
            placeholder="Telefone"
            value={phone}
            onChange={(e: any) => setPhone(e.target.value)}
          />
          <Button onClick={addLead}>Adicionar</Button>
        </div>
      </Card>

      {/* LISTA */}
      <Card>
        <div style={{ display: "grid", gap: 10 }}>
          {leads.map((lead) => (
            <div
              key={lead.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 12,
                border: "1px solid var(--border)",
                borderRadius: 10,
              }}
            >
              <div>
                {lead.name} {score(lead.last_contact)}
              </div>

              <Button onClick={() => setSelected(lead)}>
                Abrir
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* DRAWER */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 420,
              background: "#020617",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <h2>{selected.name}</h2>

            <Input
              placeholder="Nova nota"
              value={note}
              onChange={(e: any) => setNote(e.target.value)}
            />

            <Button>Salvar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
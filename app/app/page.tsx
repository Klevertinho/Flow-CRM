"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, Input } from "@/components/ui";

type Lead = {
  id: string;
  name: string;
  phone: string;
  last_contact: string;
};

type Event = {
  id: string;
  text: string;
  created_at: string;
};

export default function Page() {
  const supabase = createClient();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("last_contact", { ascending: false });

    setLeads(data || []);
  }

  async function loadEvents(leadId: string) {
    const { data } = await supabase
      .from("lead_events")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: true });

    setEvents(data || []);
  }

  async function addLead() {
    if (!name) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("leads")
      .insert({
        name,
        phone,
        user_id: user?.id,
      })
      .select()
      .single();

    await supabase.from("lead_events").insert({
      lead_id: data.id,
      user_id: user?.id,
      text: "Lead criado",
    });

    setName("");
    setPhone("");
    loadLeads();
  }

  async function addNote() {
    if (!note || !selectedLead) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("lead_events").insert({
      lead_id: selectedLead.id,
      user_id: user?.id,
      text: note,
    });

    await supabase
      .from("leads")
      .update({
        last_contact: new Date().toISOString(),
      })
      .eq("id", selectedLead.id);

    setNote("");
    loadEvents(selectedLead.id);
    loadLeads();
  }

  function openLead(lead: Lead) {
    setSelectedLead(lead);
    loadEvents(lead.id);
  }

  function getScore(date: string) {
    const hours =
      (Date.now() - new Date(date).getTime()) /
      (1000 * 60 * 60);

    if (hours < 6) return { label: "🔥 Quente", color: "#22c55e" };
    if (hours < 48) return { label: "⚠️ Morno", color: "#facc15" };
    return { label: "❄️ Frio", color: "#ef4444" };
  }

  function formatTime(date: string) {
    const diff =
      (Date.now() - new Date(date).getTime()) /
      (1000 * 60 * 60);

    if (diff < 1) return "agora";
    if (diff < 24) return `${Math.floor(diff)}h atrás`;
    return `${Math.floor(diff / 24)}d atrás`;
  }

  function generateMessage(name: string) {
    return `Fala ${name.split(" ")[0]}, tudo certo? Podemos avançar nisso?`;
  }

  function openWhatsApp(lead: Lead) {
    const msg = encodeURIComponent(generateMessage(lead.name));
    const phone = lead.phone?.replace(/\D/g, "");

    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  }

  const total = leads.length;
  const hot = leads.filter((l) =>
    getScore(l.last_contact).label.includes("Quente")
  ).length;

  const cold = leads.filter((l) =>
    getScore(l.last_contact).label.includes("Frio")
  ).length;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 900 }}>
          CRM VALORA
        </h1>
        <p style={{ opacity: 0.6 }}>
          Controle total da sua operação comercial
        </p>
      </div>

      {/* MÉTRICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        <Card>
          <strong>{total}</strong>
          <div>Leads</div>
        </Card>

        <Card>
          <strong>{hot}</strong>
          <div>Quentes</div>
        </Card>

        <Card>
          <strong>{cold}</strong>
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

      {/* PRIORIDADE */}
      <Card>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>
          Prioridade do dia
        </div>

        {leads.slice(0, 3).map((lead) => {
          const score = getScore(lead.last_contact);

          return (
            <div key={lead.id} style={{ marginBottom: 8 }}>
              {lead.name} —{" "}
              <span style={{ color: score.color }}>
                {score.label}
              </span>
            </div>
          );
        })}
      </Card>

      {/* LISTA */}
      <Card>
        <div style={{ display: "grid", gap: 10 }}>
          {leads.map((lead) => {
            const score = getScore(lead.last_contact);

            return (
              <div
                key={lead.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                }}
              >
                <div>
                  {lead.name}
                  <div style={{ fontSize: 12, color: score.color }}>
                    {score.label}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <Button onClick={() => openLead(lead)}>
                    Abrir
                  </Button>

                  <Button onClick={() => openWhatsApp(lead)}>
                    WhatsApp
                  </Button>
                </div>
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
              gap: 16,
              overflowY: "auto",
            }}
          >
            <h2>{selectedLead.name}</h2>

            {/* TIMELINE */}
            {events.map((e) => (
              <div key={e.id}>
                {e.text}
                <div style={{ fontSize: 12 }}>
                  {formatTime(e.created_at)}
                </div>
              </div>
            ))}

            {/* NOTA */}
            <Input
              placeholder="Nova interação"
              value={note}
              onChange={(e: any) => setNote(e.target.value)}
            />

            <Button onClick={addNote}>Salvar</Button>

            <Button onClick={() => openWhatsApp(selectedLead)}>
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
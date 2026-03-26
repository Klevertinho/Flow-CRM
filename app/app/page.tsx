"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, Input } from "@/components/ui";

type Lead = {
  id: string;
  name: string;
  phone: string;
  created_at: string;
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
    const { data } = await supabase.from("leads").select("*");
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

    setNote("");
    loadEvents(selectedLead.id);
  }

  function openLead(lead: Lead) {
    setSelectedLead(lead);
    loadEvents(lead.id);
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
    const message = encodeURIComponent(generateMessage(lead.name));
    const phone = lead.phone?.replace(/\D/g, "");

    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900 }}>
        CRM VALORA
      </h1>

      {/* ADD */}
      <Card>
        <div style={{ display: "flex", gap: 10 }}>
          <Input
            placeholder="Nome"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />

          <Input
            placeholder="Telefone (com DDD)"
            value={phone}
            onChange={(e: any) => setPhone(e.target.value)}
          />

          <Button onClick={addLead}>Adicionar</Button>
        </div>
      </Card>

      {/* LIST */}
      <Card>
        <div style={{ display: "grid", gap: 10 }}>
          {leads.map((lead) => (
            <div
              key={lead.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>{lead.name}</div>

              <div style={{ display: "flex", gap: 6 }}>
                <Button onClick={() => openLead(lead)}>
                  Abrir
                </Button>

                <Button onClick={() => openWhatsApp(lead)}>
                  WhatsApp
                </Button>
              </div>
            </div>
          ))}
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
              width: 400,
              background: "#020617",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 16,
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

            {/* NOTE */}
            <Input
              placeholder="Nova nota"
              value={note}
              onChange={(e: any) => setNote(e.target.value)}
            />

            <Button onClick={addNote}>Salvar</Button>

            {/* WHATSAPP */}
            <Button onClick={() => openWhatsApp(selectedLead)}>
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
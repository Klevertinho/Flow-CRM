"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, Button, Input } from "@/components/ui";

export default function Page() {
  const supabase = createClient();

  const [leads, setLeads] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

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
      last_contact: new Date().toISOString(),
    });

    setName("");
    setPhone("");
    load();
  }

  function score(date: string) {
    const h =
      (Date.now() - new Date(date).getTime()) /
      (1000 * 60 * 60);

    if (h < 6) return { label: "Quente", color: "#22c55e" };
    if (h < 48) return { label: "Morno", color: "#facc15" };
    return { label: "Frio", color: "#ef4444" };
  }

  function openWhatsApp(lead: any) {
    const phone = lead.phone?.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Fala ${lead.name.split(" ")[0]}, podemos continuar?`
    );

    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  }

  return (
    <div style={{ display: "grid", gap: 28 }}>
      
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 34, fontWeight: 900 }}>
          Dashboard
        </h1>
        <p style={{ opacity: 0.6 }}>
          Controle inteligente da sua operação
        </p>
      </div>

      {/* MÉTRICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
        <Card>
          <strong style={{ fontSize: 22 }}>{leads.length}</strong>
          <div style={{ opacity: 0.6 }}>Leads</div>
        </Card>

        <Card>
          <strong style={{ fontSize: 22 }}>
            {leads.filter(l => score(l.last_contact).label === "Quente").length}
          </strong>
          <div style={{ opacity: 0.6 }}>Quentes</div>
        </Card>

        <Card>
          <strong style={{ fontSize: 22 }}>
            {leads.filter(l => score(l.last_contact).label === "Frio").length}
          </strong>
          <div style={{ opacity: 0.6 }}>Perdidos</div>
        </Card>
      </div>

      {/* ADD LEAD */}
      <Card>
        <div style={{ display: "flex", gap: 12 }}>
          <Input placeholder="Nome" value={name} onChange={(e:any)=>setName(e.target.value)} />
          <Input placeholder="Telefone" value={phone} onChange={(e:any)=>setPhone(e.target.value)} />
          <Button onClick={addLead}>Adicionar</Button>
        </div>
      </Card>

      {/* LISTA */}
      <Card>
        <div style={{ display: "grid", gap: 12 }}>
          {leads.map((lead) => {
            const s = score(lead.last_contact);

            return (
              <div
                key={lead.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{lead.name}</div>
                  <div style={{ fontSize: 12, color: s.color }}>
                    {s.label}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Button onClick={() => setSelected(lead)} variant="secondary">
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
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <h2>{selected.name}</h2>

            <Input
              placeholder="Nova interação"
              value={note}
              onChange={(e:any)=>setNote(e.target.value)}
            />

            <Button>Salvar interação</Button>

            <Button onClick={() => openWhatsApp(selected)}>
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
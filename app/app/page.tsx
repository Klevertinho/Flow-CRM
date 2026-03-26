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
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("last_contact", { ascending: false });

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

    if (h < 6) return { label: "🔥 Quente", color: "#22c55e" };
    if (h < 48) return { label: "⚠️ Morno", color: "#facc15" };
    return { label: "❄️ Frio", color: "#ef4444" };
  }

  function nextAction(lead: any) {
    const s = score(lead.last_contact).label;

    if (s.includes("Frio")) return "Retomar contato urgente";
    if (s.includes("Morno")) return "Enviar follow-up";
    return "Fechar venda";
  }

  function openWhatsApp(lead: any) {
    const phone = lead.phone?.replace(/\D/g, "");
    const msg = encodeURIComponent(nextAction(lead));

    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <h1 style={{ fontSize: 34 }}>Dashboard</h1>

      {/* PRIORIDADE INTELIGENTE */}
      <Card>
        <h3>Prioridade do dia</h3>

        {leads.slice(0, 3).map((lead) => (
          <div key={lead.id}>
            {lead.name} — {nextAction(lead)}
          </div>
        ))}
      </Card>

      {/* ADD */}
      <Card>
        <div style={{ display: "flex", gap: 10 }}>
          <Input placeholder="Nome" value={name} onChange={(e:any)=>setName(e.target.value)} />
          <Input placeholder="Telefone" value={phone} onChange={(e:any)=>setPhone(e.target.value)} />
          <Button onClick={addLead}>Adicionar</Button>
        </div>
      </Card>

      {/* LISTA */}
      <Card>
        {leads.map((lead) => {
          const s = score(lead.last_contact);

          return (
            <div key={lead.id} style={{ marginBottom: 10 }}>
              {lead.name} - {s.label}
              <Button onClick={() => openWhatsApp(lead)}>
                WhatsApp
              </Button>
            </div>
          );
        })}
      </Card>

      {/* DRAWER */}
      {selected && (
        <div>
          <h2>{selected.name}</h2>
          <Input value={note} onChange={(e:any)=>setNote(e.target.value)} />
          <Button>Salvar</Button>
        </div>
      )}
    </div>
  );
}
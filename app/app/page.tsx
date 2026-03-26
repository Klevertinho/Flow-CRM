"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, Button, Input } from "@/components/ui";

export default function Page() {
  const supabase = createClient();

  const [leads, setLeads] = useState<any[]>([]);
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

    if (h < 6) return { label: "Quente", color: "#22c55e" };
    if (h < 48) return { label: "Morno", color: "#facc15" };
    return { label: "Frio", color: "#ef4444" };
  }

  return (
    <div style={{ display: "grid", gap: 28 }}>
      
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 34, fontWeight: 900 }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--muted)" }}>
          Visão clara da sua operação
        </p>
      </div>

      {/* MÉTRICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        <Card>
          <strong style={{ fontSize: 22 }}>{leads.length}</strong>
          <div style={{ color: "var(--muted)" }}>Leads</div>
        </Card>

        <Card>
          <strong style={{ fontSize: 22 }}>
            {leads.filter(l => score(l.last_contact).label === "Quente").length}
          </strong>
          <div style={{ color: "var(--muted)" }}>Quentes</div>
        </Card>

        <Card>
          <strong style={{ fontSize: 22 }}>
            {leads.filter(l => score(l.last_contact).label === "Frio").length}
          </strong>
          <div style={{ color: "var(--muted)" }}>Perdidos</div>
        </Card>
      </div>

      {/* FORM */}
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
                  padding: 14,
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{lead.name}</div>
                  <div style={{ fontSize: 12, color: s.color }}>
                    {s.label}
                  </div>
                </div>

                <Button>Ver</Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
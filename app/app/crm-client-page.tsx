"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, Input, TextArea } from "@/components/ui";

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  created_at: string;
  last_contact: string;
};

type LeadEvent = {
  id: string;
  text: string;
  created_at: string;
};

function scoreLead(date: string) {
  const hours = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60);

  if (hours < 6) return { label: "Quente", color: "#22c55e", rank: 3 };
  if (hours < 48) return { label: "Morno", color: "#facc15", rank: 2 };
  return { label: "Frio", color: "#ef4444", rank: 1 };
}

function formatRelative(date: string) {
  const hours = Math.floor(
    (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60)
  );

  if (hours < 1) return "agora";
  if (hours < 24) return `${hours}h atrás`;
  return `${Math.floor(hours / 24)}d atrás`;
}

function nextActionForLead(date: string) {
  const hours = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60);

  if (hours < 6) return "Acompanhar resposta enquanto o interesse ainda está alto";
  if (hours < 48) return "Enviar follow-up agora para não perder timing";
  return "Retomar contato antes que esse lead esfrie de vez";
}

function generateMessage(name: string) {
  const firstName = name.trim().split(" ")[0] || "tudo";
  return `Fala ${firstName}, tudo certo? Vi que conversamos sobre isso e queria te ajudar a avançar. Quer que eu te mostre o melhor próximo passo?`;
}

function MetricCard({
  label,
  value,
  help,
  accent,
}: {
  label: string;
  value: string | number;
  help: string;
  accent?: string;
}) {
  return (
    <Card>
      <div
        style={{
          color: "rgba(255,255,255,0.52)",
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 34,
          fontWeight: 900,
          letterSpacing: -1,
          color: accent || "#fff",
          marginBottom: 10,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "rgba(255,255,255,0.62)",
          lineHeight: 1.7,
          fontSize: 14,
        }}
      >
        {help}
      </div>
    </Card>
  );
}

export default function CRMClientPage() {
  const supabase = createClient();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [note, setNote] = useState("");
  const [savingLead, setSavingLead] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    void loadLeads();
  }, []);

  async function loadLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("last_contact", { ascending: false });

    if (!error) {
      setLeads(data || []);
    }
  }

  async function loadLeadEvents(leadId: string) {
    setLoadingEvents(true);

    const { data, error } = await supabase
      .from("lead_events")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (!error) {
      setEvents(data || []);
    }

    setLoadingEvents(false);
  }

  async function handleAddLead() {
    if (!leadName.trim()) return;

    setSavingLead(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: newLead, error } = await supabase
      .from("leads")
      .insert({
        name: leadName.trim(),
        phone: leadPhone.trim() || null,
        user_id: user?.id,
        last_contact: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error && newLead) {
      await supabase.from("lead_events").insert({
        lead_id: newLead.id,
        user_id: user?.id,
        text: "Lead criado",
      });

      setLeadName("");
      setLeadPhone("");
      await loadLeads();
    }

    setSavingLead(false);
  }

  async function handleOpenLead(lead: Lead) {
    setSelectedLead(lead);
    setNote("");
    await loadLeadEvents(lead.id);
  }

  async function handleAddNote() {
    if (!note.trim() || !selectedLead) return;

    setSavingNote(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const text = note.trim();

    await supabase.from("lead_events").insert({
      lead_id: selectedLead.id,
      user_id: user?.id,
      text,
    });

    await supabase
      .from("leads")
      .update({
        last_contact: new Date().toISOString(),
      })
      .eq("id", selectedLead.id);

    setNote("");
    await loadLeads();

    setSelectedLead({
      ...selectedLead,
      last_contact: new Date().toISOString(),
    });

    await loadLeadEvents(selectedLead.id);
    setSavingNote(false);
  }

  function handleOpenWhatsApp(lead: Lead) {
    const phone = (lead.phone || "").replace(/\D/g, "");
    if (!phone) return;

    const message = encodeURIComponent(generateMessage(lead.name));
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  }

  const totalLeads = leads.length;
  const hotLeads = leads.filter(
    (lead) => scoreLead(lead.last_contact).label === "Quente"
  ).length;
  const coldLeads = leads.filter(
    (lead) => scoreLead(lead.last_contact).label === "Frio"
  ).length;

  const priorityLeads = useMemo(() => {
    return [...leads]
      .sort(
        (a, b) =>
          new Date(a.last_contact).getTime() -
          new Date(b.last_contact).getTime()
      )
      .slice(0, 4);
  }, [leads]);

  const selectedLeadScore = selectedLead
    ? scoreLead(selectedLead.last_contact)
    : null;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.08fr 0.92fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <Card
          style={{
            padding: 26,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(37,99,235,0.12)",
              border: "1px solid rgba(96,165,250,0.18)",
              color: "#bfdbfe",
              fontWeight: 800,
              fontSize: 12,
              marginBottom: 18,
            }}
          >
            Operação comercial com mais clareza
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 4vw, 56px)",
              lineHeight: 1.04,
              fontWeight: 900,
              letterSpacing: -1.5,
              marginBottom: 14,
            }}
          >
            Seu comercial precisa de processo, não de memória.
          </h1>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.68)",
              fontSize: 17,
              lineHeight: 1.8,
              maxWidth: 780,
            }}
          >
            Veja quem precisa de atenção hoje, registre contexto e transforme follow-up perdido em rotina comercial séria.
          </p>
        </Card>

        <Card>
          <div
            style={{
              color: "rgba(255,255,255,0.50)",
              fontSize: 12,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              marginBottom: 14,
            }}
          >
            Prioridade do dia
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {priorityLeads.length === 0 ? (
              <div
                style={{
                  color: "rgba(255,255,255,0.58)",
                  lineHeight: 1.7,
                }}
              >
                Nenhum lead ainda. Adicione o primeiro contato para começar sua operação.
              </div>
            ) : (
              priorityLeads.map((lead) => {
                const s = scoreLead(lead.last_contact);

                return (
                  <div
                    key={lead.id}
                    style={{
                      padding: 14,
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          color: "#fff",
                        }}
                      >
                        {lead.name}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: s.color,
                        }}
                      >
                        {s.label}
                      </div>
                    </div>

                    <div
                      style={{
                        color: "rgba(255,255,255,0.60)",
                        fontSize: 13,
                        lineHeight: 1.7,
                      }}
                    >
                      {nextActionForLead(lead.last_contact)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
          gap: 16,
        }}
      >
        <MetricCard
          label="Leads"
          value={totalLeads}
          help="Base comercial atualmente disponível para operação."
        />
        <MetricCard
          label="Quentes"
          value={hotLeads}
          help="Leads com contato recente e maior chance de avanço."
          accent="#86efac"
        />
        <MetricCard
          label="Perdidos"
          value={coldLeads}
          help="Contatos que precisam ser reativados antes de esfriar de vez."
          accent="#fda4af"
        />
      </div>

      <Card>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Nome do lead"
            value={leadName}
            onChange={(e: any) => setLeadName(e.target.value)}
          />

          <Input
            placeholder="Telefone (com DDD)"
            value={leadPhone}
            onChange={(e: any) => setLeadPhone(e.target.value)}
          />

          <Button onClick={handleAddLead} disabled={savingLead}>
            {savingLead ? "Salvando..." : "Adicionar lead"}
          </Button>
        </div>
      </Card>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: -0.5,
              }}
            >
              Leads
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.56)",
                fontSize: 14,
                marginTop: 4,
              }}
            >
              Visualize rapidamente o momento de cada oportunidade.
            </div>
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.48)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {leads.length} lead{leads.length === 1 ? "" : "s"}
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {leads.length === 0 ? (
            <div
              style={{
                borderRadius: 18,
                padding: 22,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.60)",
                lineHeight: 1.8,
              }}
            >
              Nenhum lead ainda. Adicione seu primeiro contato para começar a usar o CRM de verdade.
            </div>
          ) : (
            leads.map((lead) => {
              const s = scoreLead(lead.last_contact);

              return (
                <div
                  key={lead.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 14,
                    alignItems: "center",
                    padding: 16,
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          color: "#fff",
                          fontSize: 16,
                        }}
                      >
                        {lead.name}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: s.color,
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {s.label}
                      </div>
                    </div>

                    <div
                      style={{
                        color: "rgba(255,255,255,0.58)",
                        fontSize: 14,
                        lineHeight: 1.7,
                      }}
                    >
                      {nextActionForLead(lead.last_contact)}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        color: "rgba(255,255,255,0.42)",
                        fontSize: 12,
                      }}
                    >
                      Último contato: {formatRelative(lead.last_contact)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      variant="secondary"
                      onClick={() => void handleOpenLead(lead)}
                    >
                      Abrir
                    </Button>

                    <Button
                      onClick={() => handleOpenWhatsApp(lead)}
                      disabled={!lead.phone}
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {selectedLead ? (
        <div
          onClick={() => setSelectedLead(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.62)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 100,
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 470,
              maxWidth: "100%",
              height: "100%",
              padding: 24,
              background:
                "linear-gradient(180deg, rgba(11,18,32,0.98) 0%, rgba(2,6,23,1) 100%)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "-30px 0 80px rgba(0,0,0,0.35)",
              overflowY: "auto",
              display: "grid",
              gap: 18,
              alignContent: "start",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.46)",
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    marginBottom: 8,
                  }}
                >
                  Lead selecionado
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    letterSpacing: -0.8,
                    color: "#fff",
                    marginBottom: 8,
                  }}
                >
                  {selectedLead.name}
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: selectedLeadScore?.color || "#fff",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  {selectedLeadScore?.label}
                </div>
              </div>

              <Button variant="ghost" onClick={() => setSelectedLead(null)}>
                Fechar
              </Button>
            </div>

            <Card>
              <div
                style={{
                  color: "rgba(255,255,255,0.46)",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  marginBottom: 10,
                }}
              >
                Próxima ação
              </div>

              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 16,
                  lineHeight: 1.7,
                }}
              >
                {nextActionForLead(selectedLead.last_contact)}
              </div>
            </Card>

            <Card>
              <div
                style={{
                  color: "rgba(255,255,255,0.46)",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  marginBottom: 10,
                }}
              >
                Sugestão de mensagem
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.8,
                  fontSize: 14,
                }}
              >
                {generateMessage(selectedLead.name)}
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  gap: 10,
                }}
              >
                <Button onClick={() => handleOpenWhatsApp(selectedLead)}>
                  Falar no WhatsApp
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      generateMessage(selectedLead.name)
                    );
                  }}
                >
                  Copiar mensagem
                </Button>
              </div>
            </Card>

            <Card>
              <div
                style={{
                  color: "rgba(255,255,255,0.46)",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  marginBottom: 10,
                }}
              >
                Nova interação
              </div>

              <TextArea
                placeholder="Ex.: pediu proposta, respondeu com dúvida, quer retorno amanhã..."
                value={note}
                onChange={(e: any) => setNote(e.target.value)}
              />

              <div
                style={{
                  marginTop: 12,
                }}
              >
                <Button onClick={handleAddNote} disabled={savingNote}>
                  {savingNote ? "Salvando..." : "Salvar interação"}
                </Button>
              </div>
            </Card>

            <Card>
              <div
                style={{
                  color: "rgba(255,255,255,0.46)",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  marginBottom: 12,
                }}
              >
                Timeline
              </div>

              {loadingEvents ? (
                <div
                  style={{
                    color: "rgba(255,255,255,0.56)",
                    fontSize: 14,
                  }}
                >
                  Carregando histórico...
                </div>
              ) : events.length === 0 ? (
                <div
                  style={{
                    color: "rgba(255,255,255,0.56)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  Ainda não existe histórico para esse lead.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: 14,
                  }}
                >
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "14px 1fr",
                        gap: 12,
                        alignItems: "start",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          justifyItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            background: "#60a5fa",
                            boxShadow: "0 0 18px rgba(96,165,250,0.5)",
                            marginTop: 6,
                          }}
                        />
                        {index !== events.length - 1 ? (
                          <div
                            style={{
                              width: 1,
                              flex: 1,
                              minHeight: 36,
                              background: "rgba(255,255,255,0.10)",
                              marginTop: 6,
                            }}
                          />
                        ) : null}
                      </div>

                      <div
                        style={{
                          paddingBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            color: "#fff",
                            fontWeight: 700,
                            lineHeight: 1.7,
                            fontSize: 14,
                          }}
                        >
                          {event.text}
                        </div>

                        <div
                          style={{
                            color: "rgba(255,255,255,0.42)",
                            fontSize: 12,
                            marginTop: 4,
                          }}
                        >
                          {formatRelative(event.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
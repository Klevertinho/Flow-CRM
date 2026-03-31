"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { createClient } from "@/lib/supabase/client";

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

  if (hours < 6) {
    return {
      label: "Quente",
      color: "#22c55e",
      soft: "rgba(34,197,94,0.12)",
      border: "rgba(34,197,94,0.28)",
      rank: 3,
    };
  }

  if (hours < 48) {
    return {
      label: "Morno",
      color: "#f59e0b",
      soft: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.28)",
      rank: 2,
    };
  }

  return {
    label: "Frio",
    color: "#ef4444",
    soft: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.28)",
    rank: 1,
  };
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
  if (hours < 48) return "Enviar follow-up agora para não perder o timing";
  return "Retomar contato antes que esse lead esfrie de vez";
}

function generateMessage(name: string) {
  const firstName = name.trim().split(" ")[0] || "tudo";
  return `Fala ${firstName}, tudo certo? Vi que conversamos sobre isso e queria te ajudar a avançar. Quer que eu te mostre o melhor próximo passo?`;
}

function DashboardCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        borderRadius: 24,
        padding: 22,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
        backdropFilter: "blur(12px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Badge({
  children,
  color,
  background,
  border,
}: {
  children: React.ReactNode;
  color: string;
  background: string;
  border: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 30,
        padding: "0 12px",
        borderRadius: 999,
        fontWeight: 800,
        fontSize: 12,
        color,
        background,
        border: `1px solid ${border}`,
      }}
    >
      {children}
    </div>
  );
}

function TopMetric({
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
    <DashboardCard>
      <div
        style={{
          color: "rgba(255,255,255,0.48)",
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
          marginBottom: 12,
          letterSpacing: 0.4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 38,
          lineHeight: 1,
          fontWeight: 900,
          color: accent || "#fff",
          marginBottom: 10,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "rgba(255,255,255,0.60)",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        {help}
      </div>
    </DashboardCard>
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

  const warmLeads = leads.filter(
    (lead) => scoreLead(lead.last_contact).label === "Morno"
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
    <div
      style={{
        minHeight: "100%",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.08fr 0.92fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <DashboardCard style={{ padding: 28 }}>
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
                textTransform: "uppercase",
              }}
            >
              Operação comercial com mais clareza
            </div>

            <h1
              style={{
                fontSize: "clamp(34px, 4vw, 58px)",
                lineHeight: 1.02,
                fontWeight: 900,
                margin: 0,
                marginBottom: 14,
                maxWidth: 860,
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
                maxWidth: 740,
              }}
            >
              Veja quem precisa de atenção hoje, registre contexto e transforme
              follow-up perdido em rotina comercial séria.
            </p>

            <div
              style={{
                marginTop: 22,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Badge
                color="#bfdbfe"
                background="rgba(37,99,235,0.14)"
                border="rgba(96,165,250,0.20)"
              >
                IA preparada
              </Badge>

              <Badge
                color="#c4b5fd"
                background="rgba(139,92,246,0.14)"
                border="rgba(167,139,250,0.22)"
              >
                CRM adaptável
              </Badge>

              <Badge
                color="#93c5fd"
                background="rgba(255,255,255,0.04)"
                border="rgba(255,255,255,0.08)"
              >
                Fluxo profissional
              </Badge>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div
              style={{
                color: "rgba(255,255,255,0.48)",
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                marginBottom: 14,
                letterSpacing: 0.4,
              }}
            >
              Prioridade do dia
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {priorityLeads.length === 0 ? (
                <div
                  style={{
                    color: "rgba(255,255,255,0.58)",
                    lineHeight: 1.8,
                    fontSize: 14,
                  }}
                >
                  Nenhum lead ainda. Adicione o primeiro contato para começar a usar o CRM de verdade.
                </div>
              ) : (
                priorityLeads.map((lead) => {
                  const score = scoreLead(lead.last_contact);

                  return (
                    <div
                      key={lead.id}
                      style={{
                        borderRadius: 18,
                        padding: 14,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: 15,
                          }}
                        >
                          {lead.name}
                        </div>

                        <Badge
                          color={score.color}
                          background={score.soft}
                          border={score.border}
                        >
                          {score.label}
                        </Badge>
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
          </DashboardCard>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            gap: 16,
          }}
        >
          <TopMetric
            label="Leads"
            value={totalLeads}
            help="Base comercial atualmente disponível para operação."
          />

          <TopMetric
            label="Quentes"
            value={hotLeads}
            help="Leads com maior chance de avanço imediato."
            accent="#86efac"
          />

          <TopMetric
            label="Mornos"
            value={warmLeads}
            help="Leads que precisam de follow-up no timing certo."
            accent="#fcd34d"
          />

          <TopMetric
            label="Frios"
            value={coldLeads}
            help="Leads que pedem retomada antes de morrerem."
            accent="#fca5a5"
          />
        </div>

        <DashboardCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  marginBottom: 6,
                }}
              >
                Novo lead
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.56)",
                  fontSize: 14,
                }}
              >
                Alimente o CRM com novos contatos e comece o processo do jeito certo.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            <input
              placeholder="Nome do lead"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Telefone (com DDD)"
              value={leadPhone}
              onChange={(e) => setLeadPhone(e.target.value)}
              style={inputStyle}
            />

            <button
              type="button"
              onClick={handleAddLead}
              disabled={savingLead}
              style={{
                ...primaryButtonStyle,
                minWidth: 170,
                ...(savingLead ? disabledButtonStyle : {}),
              }}
            >
              {savingLead ? "Salvando..." : "Adicionar lead"}
            </button>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  marginBottom: 6,
                }}
              >
                Leads
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.56)",
                  fontSize: 14,
                }}
              >
                Visualize rapidamente o momento de cada oportunidade.
              </div>
            </div>

            <div
              style={{
                color: "rgba(255,255,255,0.46)",
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
                const score = scoreLead(lead.last_contact);

                return (
                  <div
                    key={lead.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 16,
                      alignItems: "center",
                      borderRadius: 20,
                      padding: 16,
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
                          marginBottom: 8,
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

                        <Badge
                          color={score.color}
                          background={score.soft}
                          border={score.border}
                        >
                          {score.label}
                        </Badge>
                      </div>

                      <div
                        style={{
                          color: "rgba(255,255,255,0.60)",
                          fontSize: 14,
                          lineHeight: 1.7,
                        }}
                      >
                        {nextActionForLead(lead.last_contact)}
                      </div>

                      <div
                        style={{
                          marginTop: 8,
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
                      <button
                        type="button"
                        onClick={() => void handleOpenLead(lead)}
                        style={secondaryButtonStyle}
                      >
                        Abrir
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp(lead)}
                        disabled={!lead.phone}
                        style={{
                          ...primaryButtonStyle,
                          ...(!lead.phone ? disabledButtonStyle : {}),
                        }}
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DashboardCard>
      </div>

      {selectedLead ? (
        <div
          onClick={() => setSelectedLead(null)}
          style={drawerOverlayStyle}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={drawerStyle}
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
                    marginBottom: 8,
                  }}
                >
                  Lead selecionado
                </div>

                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 900,
                    color: "#fff",
                    marginBottom: 10,
                  }}
                >
                  {selectedLead.name}
                </div>

                {selectedLeadScore ? (
                  <Badge
                    color={selectedLeadScore.color}
                    background={selectedLeadScore.soft}
                    border={selectedLeadScore.border}
                  >
                    {selectedLeadScore.label}
                  </Badge>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                style={secondaryButtonStyle}
              >
                Fechar
              </button>
            </div>

            <DashboardCard>
              <div style={drawerSectionLabelStyle}>Próxima ação</div>
              <div style={drawerTextStrongStyle}>
                {nextActionForLead(selectedLead.last_contact)}
              </div>
            </DashboardCard>

            <DashboardCard>
              <div style={drawerSectionLabelStyle}>Sugestão de mensagem</div>

              <div style={drawerTextStyle}>
                {generateMessage(selectedLead.name)}
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(selectedLead)}
                  style={primaryButtonStyle}
                >
                  Falar no WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      generateMessage(selectedLead.name)
                    );
                  }}
                  style={secondaryButtonStyle}
                >
                  Copiar mensagem
                </button>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div style={drawerSectionLabelStyle}>Nova interação</div>

              <textarea
                placeholder="Ex.: pediu proposta, respondeu com dúvida, quer retorno amanhã..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={textareaStyle}
              />

              <div style={{ marginTop: 12 }}>
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={savingNote}
                  style={{
                    ...primaryButtonStyle,
                    ...(savingNote ? disabledButtonStyle : {}),
                  }}
                >
                  {savingNote ? "Salvando..." : "Salvar interação"}
                </button>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div style={drawerSectionLabelStyle}>Timeline</div>

              {loadingEvents ? (
                <div style={drawerMutedTextStyle}>Carregando histórico...</div>
              ) : events.length === 0 ? (
                <div style={drawerMutedTextStyle}>
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
                              minHeight: 36,
                              background: "rgba(255,255,255,0.10)",
                              marginTop: 6,
                            }}
                          />
                        ) : null}
                      </div>

                      <div style={{ paddingBottom: 6 }}>
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
            </DashboardCard>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 50,
  padding: "0 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  outline: "none",
  fontSize: 14,
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: 120,
  padding: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  outline: "none",
  fontSize: 14,
  resize: "vertical",
};

const primaryButtonStyle: CSSProperties = {
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  color: "#fff",
  fontWeight: 900,
  fontSize: 14,
  cursor: "pointer",
  boxShadow: "0 18px 40px rgba(37,99,235,0.25)",
};

const secondaryButtonStyle: CSSProperties = {
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  fontWeight: 800,
  fontSize: 14,
  cursor: "pointer",
};

const disabledButtonStyle: CSSProperties = {
  opacity: 0.65,
  cursor: "not-allowed",
};

const drawerOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.62)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 100,
  backdropFilter: "blur(5px)",
};

const drawerStyle: CSSProperties = {
  width: 500,
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
};

const drawerSectionLabelStyle: CSSProperties = {
  color: "rgba(255,255,255,0.46)",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  marginBottom: 10,
};

const drawerTextStrongStyle: CSSProperties = {
  color: "#fff",
  fontWeight: 800,
  fontSize: 16,
  lineHeight: 1.7,
};

const drawerTextStyle: CSSProperties = {
  color: "rgba(255,255,255,0.82)",
  lineHeight: 1.8,
  fontSize: 14,
};

const drawerMutedTextStyle: CSSProperties = {
  color: "rgba(255,255,255,0.56)",
  fontSize: 14,
  lineHeight: 1.7,
};
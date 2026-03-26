import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔒 Pegando dados corretamente
    const phone: string =
      body?.phone ||
      body?.from ||
      body?.sender ||
      "";

    const message: string =
      body?.text?.message ||
      body?.message ||
      body?.body ||
      "";

    if (!phone || !message) {
      return NextResponse.json({ ok: false });
    }

    const supabase = await createClient();

    // 🔍 procura lead pelo telefone (últimos 10 dígitos)
    const normalizedPhone = phone.replace(/\D/g, "").slice(-10);

    const { data: lead } = await supabase
      .from("leads")
      .select("*")
      .ilike("phone", `%${normalizedPhone}%`)
      .maybeSingle();

    if (!lead) {
      return NextResponse.json({ ok: true });
    }

    // 🧠 salva mensagem recebida
    await supabase.from("lead_events").insert({
      lead_id: lead.id,
      user_id: lead.user_id,
      text: `Cliente: ${message}`,
    });

    // 🔄 atualiza último contato
    await supabase
      .from("leads")
      .update({
        last_contact: new Date().toISOString(),
      })
      .eq("id", lead.id);

    // 🤖 resposta automática (OPCIONAL)
    const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE;
    const ZAPI_TOKEN = process.env.ZAPI_TOKEN;

    if (ZAPI_INSTANCE && ZAPI_TOKEN) {
      await fetch(
        `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone,
            message: "Recebi sua mensagem! Já vou te responder.",
          }),
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return NextResponse.json({ ok: false });
  }
}
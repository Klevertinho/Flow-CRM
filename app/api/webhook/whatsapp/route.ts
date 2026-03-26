import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const phone = body?.phone || body?.from;
    const message = body?.text?.message || body?.message;

    if (!phone || !message) {
      return NextResponse.json({ ok: false });
    }

    const supabase = await createClient();

    // procura lead pelo telefone
    const { data: lead } = await supabase
      .from("leads")
      .select("*")
      .ilike("phone", `%${phone.slice(-10)}%`)
      .maybeSingle();

    if (!lead) {
      return NextResponse.json({ ok: true });
    }

    // salva evento
    await supabase.from("lead_events").insert({
      lead_id: lead.id,
      user_id: lead.user_id,
      text: `Cliente: ${message}`,
    });

    // atualiza último contato
    await supabase
      .from("leads")
      .update({ last_contact: new Date().toISOString() })
      .eq("id", lead.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false });
// resposta automática simples
await fetch("https://api.z-api.io/instances/SUA_INSTANCE/token/SEU_TOKEN/send-text", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    phone,
    message: "Recebi sua mensagem! Já vou te responder.",
  }),
});
  }
}
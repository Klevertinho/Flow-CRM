"use client";

import React, { useState } from "react";
import { Textarea } from "../shared/textarea";
import { Button } from "../shared/button";

type NoteFormProps = {
  onSubmit: (body: string) => Promise<void> | void;
};

export function NoteForm({ onSubmit }: NoteFormProps) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!body.trim()) return;

    setLoading(true);
    await onSubmit(body.trim());
    setBody("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Textarea
        label="Nova nota"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Registre contexto comercial, objeções e próximos passos..."
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Adicionar nota"}
        </Button>
      </div>
    </form>
  );
}
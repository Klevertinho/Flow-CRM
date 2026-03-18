"use client";

import React, { useMemo, useState } from "react";
import type { LeadNote } from "../../types/note";
import { formatDateTime } from "../../lib/date-utils";
import { EmptyState } from "../dashboard/empty-state";
import { Button } from "../shared/button";
import { Textarea } from "../shared/textarea";

type NoteListProps = {
  notes: LeadNote[];
  onUpdateNote: (noteId: string, body: string) => Promise<void> | void;
};

export function NoteList({ notes, onUpdateNote }: NoteListProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [saving, setSaving] = useState(false);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [notes]);

  function startEditing(note: LeadNote) {
    setEditingNoteId(note.id);
    setEditingBody(note.body);
  }

  function cancelEditing() {
    setEditingNoteId(null);
    setEditingBody("");
  }

  async function saveEditing() {
    if (!editingNoteId || !editingBody.trim()) return;

    setSaving(true);
    await onUpdateNote(editingNoteId, editingBody.trim());
    setSaving(false);
    setEditingNoteId(null);
    setEditingBody("");
  }

  if (!sortedNotes.length) {
    return (
      <EmptyState
        title="Sem notas ainda"
        description="Adicione contexto comercial, objeções e próximos passos para enriquecer a operação."
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {sortedNotes.map((note) => {
        const isEditing = editingNoteId === note.id;

        return (
          <div
            key={note.id}
            style={{
              background: "#0b1220",
              border: "1px solid #1f2937",
              borderRadius: 14,
              padding: 14,
            }}
          >
            {isEditing ? (
              <>
                <Textarea
                  label="Editar nota"
                  value={editingBody}
                  onChange={(e) => setEditingBody(e.target.value)}
                  style={{ minHeight: 120 }}
                />

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <Button variant="ghost" onClick={cancelEditing}>
                    Cancelar
                  </Button>
                  <Button onClick={saveEditing} disabled={saving || !editingBody.trim()}>
                    {saving ? "Salvando..." : "Salvar nota"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div style={{ color: "#e5e7eb", fontSize: 14, lineHeight: 1.6 }}>
                  {note.body}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>
                    Atualizada em {formatDateTime(note.updatedAt)}
                  </div>

                  <Button variant="ghost" onClick={() => startEditing(note)}>
                    Editar
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
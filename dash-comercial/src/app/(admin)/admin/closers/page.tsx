"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CloserForm } from "@/components/closers/CloserForm";
import { CloserList } from "@/components/closers/CloserList";
import type { CloserRow } from "@/hooks/useClosers";

export default function ClosersPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<CloserRow | undefined>();

  function openNew() {
    setSelected(undefined);
    setFormOpen(true);
  }

  function openEdit(closer: CloserRow) {
    setSelected(closer);
    setFormOpen(true);
  }

  function close() {
    setFormOpen(false);
    setSelected(undefined);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="font-rajdhani text-2xl font-bold tracking-wide text-white">
          Closers
        </h1>
        <Button onClick={openNew}>
          <Plus className="size-4" aria-hidden />
          Novo closer
        </Button>
      </header>

      <CloserList onEdit={openEdit} />

      <CloserForm open={formOpen} closer={selected} onClose={close} />
    </div>
  );
}

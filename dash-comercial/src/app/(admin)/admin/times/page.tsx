"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TeamForm } from "@/components/teams/TeamForm";
import { TeamList } from "@/components/teams/TeamList";
import type { TeamRow } from "@/hooks/useTeams";

export default function TeamsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamRow | undefined>();

  function openNew() {
    setSelectedTeam(undefined);
    setFormOpen(true);
  }

  function openEdit(team: TeamRow) {
    setSelectedTeam(team);
    setFormOpen(true);
  }

  function close() {
    setFormOpen(false);
    setSelectedTeam(undefined);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="font-rajdhani text-2xl font-bold tracking-wide text-white">
          Times
        </h1>
        <Button onClick={openNew}>
          <Plus className="size-4" aria-hidden />
          Novo time
        </Button>
      </header>

      <TeamList onEdit={openEdit} />

      <TeamForm open={formOpen} team={selectedTeam} onClose={close} />
    </div>
  );
}

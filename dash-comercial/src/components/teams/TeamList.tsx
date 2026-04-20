"use client";

import { Users } from "lucide-react";

import { TeamCard } from "@/components/teams/TeamCard";
import { useDeleteTeam, useTeams, type TeamRow } from "@/hooks/useTeams";

interface TeamListProps {
  onEdit: (team: TeamRow) => void;
}

export function TeamList({ onEdit }: TeamListProps) {
  const { data: teams, isLoading, isError } = useTeams();
  const deleteTeam = useDeleteTeam();

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Carregando times...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive">
        Erro ao carregar times. Tente novamente.
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border-card bg-bg-card p-12 text-center"
      >
        <Users className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">
          Nenhum time cadastrado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onEdit={onEdit}
          onDelete={(t) => deleteTeam.mutate(t.id)}
        />
      ))}
    </div>
  );
}

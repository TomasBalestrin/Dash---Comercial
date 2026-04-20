"use client";

import { Users } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
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
      <EmptyState
        icon={Users}
        title="Nenhum time cadastrado"
        description="Clique em Novo time para começar a organizar seus closers."
      />
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

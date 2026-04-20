"use client";

import { useRouter } from "next/navigation";
import { User, Users } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { CloserCard } from "@/components/closers/CloserCard";
import {
  useClosers,
  useDeleteCloser,
  type CloserRow,
} from "@/hooks/useClosers";
import { useTeams, type TeamRow } from "@/hooks/useTeams";

interface CloserListProps {
  onEdit: (closer: CloserRow) => void;
}

export function CloserList({ onEdit }: CloserListProps) {
  const router = useRouter();
  const teamsQuery = useTeams();
  const closersQuery = useClosers();
  const deleteCloser = useDeleteCloser();

  if (teamsQuery.isLoading || closersQuery.isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Carregando closers...</div>
    );
  }

  if (teamsQuery.isError || closersQuery.isError) {
    return (
      <div className="text-sm text-destructive">
        Erro ao carregar closers.
      </div>
    );
  }

  const teams = teamsQuery.data ?? [];
  const closers = closersQuery.data ?? [];

  if (teams.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Crie um time primeiro"
        description="Closers precisam estar vinculados a um time antes de serem cadastrados."
        action={{
          label: "Ir para Times",
          onClick: () => router.push("/admin/times"),
        }}
      />
    );
  }

  if (closers.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="Nenhum closer cadastrado"
        description="Clique em Novo closer para adicionar o primeiro do time."
      />
    );
  }

  const byTeam = new Map<string | null, CloserRow[]>();
  for (const c of closers) {
    const key = c.team_id;
    const bucket = byTeam.get(key) ?? [];
    bucket.push(c);
    byTeam.set(key, bucket);
  }

  function sectionHeader(team: TeamRow | null) {
    return (
      <header className="flex items-center gap-3">
        <span
          className="size-2 rounded-full"
          style={{ background: team?.accent_color ?? "#64748b" }}
          aria-hidden
        />
        <h2 className="font-rajdhani text-lg font-bold uppercase tracking-wide text-white">
          {team?.name ?? "Sem time"}
        </h2>
      </header>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {teams.map((team) => {
        const members = byTeam.get(team.id) ?? [];
        if (members.length === 0) return null;
        return (
          <section key={team.id} className="flex flex-col gap-3">
            {sectionHeader(team)}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {members.map((c) => (
                <CloserCard
                  key={c.id}
                  closer={c}
                  onEdit={onEdit}
                  onDelete={(x) => deleteCloser.mutate(x.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
      {byTeam.get(null)?.length ? (
        <section className="flex flex-col gap-3">
          {sectionHeader(null)}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {byTeam.get(null)!.map((c) => (
              <CloserCard
                key={c.id}
                closer={c}
                onEdit={onEdit}
                onDelete={(x) => deleteCloser.mutate(x.id)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border-card bg-bg-card p-12 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Crie um time antes de cadastrar closers.
        </p>
        <Button asChild>
          <Link href="/admin/times">Ir para Times</Link>
        </Button>
      </div>
    );
  }

  if (closers.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border-card bg-bg-card p-12 text-center"
      >
        <User className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">
          Nenhum closer cadastrado ainda.
        </p>
      </div>
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

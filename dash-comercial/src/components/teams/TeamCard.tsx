"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { GRADIENTS } from "@/lib/constants/gradients";
import type { TeamRow } from "@/hooks/useTeams";

interface TeamCardProps {
  team: TeamRow;
  onEdit: (team: TeamRow) => void;
  onDelete: (team: TeamRow) => void;
}

export function TeamCard({ team, onEdit, onDelete }: TeamCardProps) {
  const hasBanner = Boolean(team.banner_url);

  return (
    <article
      className="group relative aspect-[4/3] overflow-hidden rounded-card border border-border-card bg-bg-card"
      style={{ borderLeft: `4px solid ${team.accent_color}` }}
    >
      {hasBanner ? (
        <Image
          src={team.banner_url!}
          alt={`Banner do time ${team.name}`}
          fill
          sizes="(min-width: 1024px) 360px, 100vw"
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: GRADIENTS[team.gradient_preset] }}
          aria-hidden
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-rajdhani text-3xl font-bold uppercase tracking-wide text-white">
          {team.name}
        </h3>
      </div>

      <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          aria-label={`Editar ${team.name}`}
          onClick={() => onEdit(team)}
        >
          <Pencil className="size-4" aria-hidden />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              aria-label={`Excluir ${team.name}`}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir time {team.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação pode ser desfeita no banco. Closers vinculados
                precisam ser movidos antes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(team)}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </article>
  );
}

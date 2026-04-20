"use client";

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
import { CloserAvatar } from "@/components/closers/CloserAvatar";
import type { CloserRow } from "@/hooks/useClosers";

interface CloserCardProps {
  closer: CloserRow;
  onEdit: (closer: CloserRow) => void;
  onDelete: (closer: CloserRow) => void;
}

export function CloserCard({ closer, onEdit, onDelete }: CloserCardProps) {
  return (
    <article
      className="group relative flex items-center gap-4 rounded-card border border-border-card bg-bg-card p-4"
      style={{ borderLeft: `4px solid ${closer.accent_color}` }}
    >
      <CloserAvatar closer={closer} size={56} />

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate font-rajdhani text-lg font-bold text-white">
          {closer.name}
        </h3>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {closer.initials}
        </span>
      </div>

      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          aria-label={`Editar ${closer.name}`}
          onClick={() => onEdit(closer)}
        >
          <Pencil className="size-4" aria-hidden />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              aria-label={`Excluir ${closer.name}`}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir {closer.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Vendas deste closer manterão o histórico sem vinculação.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(closer)}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </article>
  );
}

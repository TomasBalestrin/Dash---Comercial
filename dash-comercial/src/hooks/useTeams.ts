"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  TeamCreateInput,
  TeamUpdateInput,
} from "@/lib/schemas/team";
import { useToastStore } from "@/stores/toastStore";

export interface TeamRow {
  id: string;
  name: string;
  banner_url: string | null;
  accent_color: string;
  gradient_preset: "blue" | "coral" | "green" | "purple";
  shape: "triangle" | "chevron" | "hexagon";
  display_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const KEY = ["teams"] as const;

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { error?: string }).error ?? `Erro ${res.status}`;
    throw new Error(message);
  }
  return (body as { data: T }).data;
}

export function useTeams() {
  return useQuery<TeamRow[]>({
    queryKey: KEY,
    queryFn: async () => jsonOrThrow<TeamRow[]>(await fetch("/api/teams")),
  });
}

export function useCreateTeam() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async (input: TeamCreateInput) =>
      jsonOrThrow<TeamRow>(
        await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      show("success", "Time criado");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

export function useUpdateTeam() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: TeamUpdateInput;
    }) =>
      jsonOrThrow<TeamRow>(
        await fetch(`/api/teams/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      show("success", "Time atualizado");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

export function useDeleteTeam() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async (id: string) =>
      jsonOrThrow<null>(
        await fetch(`/api/teams/${id}`, { method: "DELETE" })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      show("success", "Time excluído");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

export function useUploadTeamBanner() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const fd = new FormData();
      fd.append("file", file);
      return jsonOrThrow<{ url: string }>(
        await fetch(`/api/teams/${id}/banner`, {
          method: "POST",
          body: fd,
        })
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      show("success", "Banner atualizado");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

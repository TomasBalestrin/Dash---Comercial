"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CloserCreateInput,
  CloserUpdateInput,
} from "@/lib/schemas/closer";
import { useToastStore } from "@/stores/toastStore";

export interface CloserRow {
  id: string;
  name: string;
  photo_url: string | null;
  initials: string;
  accent_color: string;
  team_id: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const KEY = ["closers"] as const;

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { error?: string }).error ?? `Erro ${res.status}`;
    throw new Error(message);
  }
  return (body as { data: T }).data;
}

export function useClosers() {
  return useQuery<CloserRow[]>({
    queryKey: KEY,
    queryFn: async () =>
      jsonOrThrow<CloserRow[]>(await fetch("/api/closers")),
  });
}

export function useCreateCloser() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async (input: CloserCreateInput) =>
      jsonOrThrow<CloserRow>(
        await fetch("/api/closers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      show("success", "Closer criado");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

export function useUpdateCloser() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: CloserUpdateInput;
    }) =>
      jsonOrThrow<CloserRow>(
        await fetch(`/api/closers/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      show("success", "Closer atualizado");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

export function useDeleteCloser() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async (id: string) =>
      jsonOrThrow<null>(
        await fetch(`/api/closers/${id}`, { method: "DELETE" })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      show("success", "Closer excluído");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

export function useUploadCloserPhoto() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const fd = new FormData();
      fd.append("file", file);
      return jsonOrThrow<{ url: string }>(
        await fetch(`/api/closers/${id}/photo`, {
          method: "POST",
          body: fd,
        })
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      show("success", "Foto atualizada");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

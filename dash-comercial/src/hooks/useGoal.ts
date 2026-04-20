"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { GoalInput } from "@/lib/schemas/goal";
import { useToastStore } from "@/stores/toastStore";

export interface GoalRow {
  id: string;
  month: string;
  target_value: number;
  created_at: string;
  updated_at: string;
}

const ROOT = ["goal"] as const;

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { error?: string }).error ?? `Erro ${res.status}`;
    throw new Error(message);
  }
  return (body as { data: T }).data;
}

export function useGoal(month: string) {
  return useQuery<GoalRow | null>({
    queryKey: [...ROOT, month],
    queryFn: async () =>
      jsonOrThrow<GoalRow | null>(
        await fetch(`/api/goals?month=${encodeURIComponent(month)}`)
      ),
    enabled: Boolean(month),
  });
}

export function useSaveGoal() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async (payload: GoalInput) =>
      jsonOrThrow<GoalRow>(
        await fetch("/api/goals", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROOT });
      show("success", "Meta atualizada");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

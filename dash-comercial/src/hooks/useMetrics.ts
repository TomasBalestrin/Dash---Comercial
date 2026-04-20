"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { MetricBatchInput } from "@/lib/schemas/metric";
import type { CloserRow } from "@/hooks/useClosers";
import { useToastStore } from "@/stores/toastStore";

export type MetricRow = CloserRow & {
  calls: number;
  conversion_pct: number;
};

const ROOT = ["metrics"] as const;

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { error?: string }).error ?? `Erro ${res.status}`;
    throw new Error(message);
  }
  return (body as { data: T }).data;
}

export function useMetrics(month: string) {
  return useQuery<MetricRow[]>({
    queryKey: [...ROOT, month],
    queryFn: async () =>
      jsonOrThrow<MetricRow[]>(
        await fetch(`/api/metrics?month=${encodeURIComponent(month)}`)
      ),
    enabled: Boolean(month),
  });
}

export function useSaveMetrics() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async (payload: MetricBatchInput) =>
      jsonOrThrow<MetricRow[]>(
        await fetch("/api/metrics/batch", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROOT });
      show("success", "Métricas atualizadas");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  SaleCreateInput,
  SaleFilter,
  SaleUpdateInput,
} from "@/lib/schemas/sale";
import { useToastStore } from "@/stores/toastStore";

export interface SaleRow {
  id: string;
  closer_id: string | null;
  product_id: string | null;
  client_name: string;
  sale_date: string;
  value_total: number;
  value_entrada: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const ROOT = ["sales"] as const;

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { error?: string }).error ?? `Erro ${res.status}`;
    throw new Error(message);
  }
  return (body as { data: T }).data;
}

function buildQuery(filters: SaleFilter & { page?: number }): string {
  const params = new URLSearchParams();
  if (filters.month) params.set("month", filters.month);
  if (filters.closer_id) params.set("closer_id", filters.closer_id);
  if (filters.product_id) params.set("product_id", filters.product_id);
  if (filters.search) params.set("search", filters.search);
  if (filters.page) params.set("page", String(filters.page));
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function useSales(filters: SaleFilter & { page?: number } = {}) {
  return useQuery<SaleRow[]>({
    queryKey: [...ROOT, filters],
    queryFn: async () =>
      jsonOrThrow<SaleRow[]>(await fetch(`/api/sales${buildQuery(filters)}`)),
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async (input: SaleCreateInput) =>
      jsonOrThrow<SaleRow>(
        await fetch("/api/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROOT });
      show("success", "Venda registrada");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

export function useUpdateSale() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: SaleUpdateInput;
    }) =>
      jsonOrThrow<SaleRow>(
        await fetch(`/api/sales/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROOT });
      show("success", "Venda atualizada");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

export function useDeleteSale() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async (id: string) =>
      jsonOrThrow<null>(
        await fetch(`/api/sales/${id}`, { method: "DELETE" })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROOT });
      show("success", "Venda excluída");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

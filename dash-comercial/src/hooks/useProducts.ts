"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  ProductCreateInput,
  ProductUpdateInput,
} from "@/lib/schemas/product";
import { useToastStore } from "@/stores/toastStore";

export interface ProductRow {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const KEY = ["products"] as const;

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { error?: string }).error ?? `Erro ${res.status}`;
    throw new Error(message);
  }
  return (body as { data: T }).data;
}

export function useProducts() {
  return useQuery<ProductRow[]>({
    queryKey: KEY,
    queryFn: async () =>
      jsonOrThrow<ProductRow[]>(await fetch("/api/products")),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async (input: ProductCreateInput) =>
      jsonOrThrow<ProductRow>(
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      show("success", "Produto criado");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: ProductUpdateInput;
    }) =>
      jsonOrThrow<ProductRow>(
        await fetch(`/api/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      show("success", "Produto atualizado");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  const show = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async (id: string) =>
      jsonOrThrow<null>(
        await fetch(`/api/products/${id}`, { method: "DELETE" })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      show("success", "Produto excluído");
    },
    onError: (error: Error) => show("error", error.message),
  });
}

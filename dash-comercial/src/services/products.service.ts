import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ProductCreateInput,
  ProductUpdateInput,
} from "@/lib/schemas/product";

export async function listProducts(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createProduct(
  supabase: SupabaseClient,
  input: ProductCreateInput
) {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(
  supabase: SupabaseClient,
  id: string,
  input: ProductUpdateInput
) {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function softDeleteProduct(
  supabase: SupabaseClient,
  id: string
) {
  const { count, error: countError } = await supabase
    .from("sales")
    .select("id", { count: "exact", head: true })
    .eq("product_id", id)
    .is("deleted_at", null);

  if (countError) throw countError;
  if ((count ?? 0) > 0) throw new Error("PRODUCT_HAS_SALES");

  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) throw error;
}

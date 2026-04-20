import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  SaleCreateInput,
  SaleFilter,
  SaleUpdateInput,
} from "@/lib/schemas/sale";

const PAGE_SIZE = 50;

interface ListSalesOptions extends SaleFilter {
  page?: number;
}

function monthBounds(month: string): { from: string; to: string } {
  const [y, m] = month.split("-").map(Number);
  if (!y || !m) throw new Error("INVALID_MONTH");
  const next = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
  return { from: `${month}-01`, to: next };
}

export async function listSales(
  supabase: SupabaseClient,
  options: ListSalesOptions = {}
) {
  const { month, closer_id, product_id, search, page = 0 } = options;

  let query = supabase
    .from("sales")
    .select("*")
    .is("deleted_at", null);

  if (month) {
    const { from, to } = monthBounds(month);
    query = query.gte("sale_date", from).lt("sale_date", to);
  }
  if (closer_id) query = query.eq("closer_id", closer_id);
  if (product_id) query = query.eq("product_id", product_id);
  if (search) query = query.ilike("client_name", `%${search}%`);

  const offset = page * PAGE_SIZE;
  query = query
    .order("sale_date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createSale(
  supabase: SupabaseClient,
  input: SaleCreateInput
) {
  const { data, error } = await supabase
    .from("sales")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSale(
  supabase: SupabaseClient,
  id: string,
  input: SaleUpdateInput
) {
  const { data, error } = await supabase
    .from("sales")
    .update(input)
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function softDeleteSale(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from("sales")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) throw error;
}

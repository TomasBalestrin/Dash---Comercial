import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CloserCreateInput,
  CloserUpdateInput,
} from "@/lib/schemas/closer";

export async function listClosers(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("closers")
    .select("*")
    .is("deleted_at", null)
    .order("team_id", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createCloser(
  supabase: SupabaseClient,
  input: CloserCreateInput
) {
  const { data, error } = await supabase
    .from("closers")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCloser(
  supabase: SupabaseClient,
  id: string,
  input: CloserUpdateInput
) {
  const { data, error } = await supabase
    .from("closers")
    .update(input)
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function softDeleteCloser(
  supabase: SupabaseClient,
  id: string
) {
  const { error } = await supabase
    .from("closers")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) throw error;
}

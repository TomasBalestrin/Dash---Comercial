import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  TeamCreateInput,
  TeamUpdateInput,
} from "@/lib/schemas/team";

export async function listTeams(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createTeam(
  supabase: SupabaseClient,
  input: TeamCreateInput
) {
  const { data, error } = await supabase
    .from("teams")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTeam(
  supabase: SupabaseClient,
  id: string,
  input: TeamUpdateInput
) {
  const { data, error } = await supabase
    .from("teams")
    .update(input)
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function softDeleteTeam(supabase: SupabaseClient, id: string) {
  const { count, error: countError } = await supabase
    .from("closers")
    .select("id", { count: "exact", head: true })
    .eq("team_id", id)
    .is("deleted_at", null);

  if (countError) throw countError;
  if ((count ?? 0) > 0) throw new Error("TEAM_HAS_CLOSERS");

  const { error } = await supabase
    .from("teams")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) throw error;
}

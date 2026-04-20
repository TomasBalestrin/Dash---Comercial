import type { SupabaseClient } from "@supabase/supabase-js";

import type { GoalInput } from "@/lib/schemas/goal";

export async function getByMonth(supabase: SupabaseClient, month: string) {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("month", month)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertGoal(
  supabase: SupabaseClient,
  input: GoalInput
) {
  const { data, error } = await supabase
    .from("goals")
    .upsert(input, { onConflict: "month" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

import type { SupabaseClient } from "@supabase/supabase-js";

import type { MetricItemInput } from "@/lib/schemas/metric";

interface MetricRow {
  closer_id: string;
  calls: number;
  conversion_pct: number;
}

export async function listByMonth(supabase: SupabaseClient, month: string) {
  const [closersRes, metricsRes] = await Promise.all([
    supabase
      .from("closers")
      .select("*")
      .is("deleted_at", null)
      .order("team_id", { ascending: true })
      .order("display_order", { ascending: true }),
    supabase
      .from("monthly_metrics")
      .select("closer_id, calls, conversion_pct")
      .eq("month", month),
  ]);

  if (closersRes.error) throw closersRes.error;
  if (metricsRes.error) throw metricsRes.error;

  const byCloser = new Map<string, MetricRow>();
  for (const m of metricsRes.data ?? []) {
    byCloser.set(m.closer_id, {
      closer_id: m.closer_id,
      calls: Number(m.calls),
      conversion_pct: Number(m.conversion_pct),
    });
  }

  return (closersRes.data ?? []).map((c) => {
    const m = byCloser.get(c.id);
    return {
      ...c,
      calls: m?.calls ?? 0,
      conversion_pct: m?.conversion_pct ?? 0,
    };
  });
}

export async function upsertBatch(
  supabase: SupabaseClient,
  month: string,
  items: MetricItemInput[]
) {
  const rows = items.map((i) => ({
    closer_id: i.closer_id,
    month,
    calls: i.calls,
    conversion_pct: i.conversion_pct,
  }));

  const { data, error } = await supabase
    .from("monthly_metrics")
    .upsert(rows, { onConflict: "closer_id,month" })
    .select();

  if (error) throw error;
  return data ?? [];
}

import type { SupabaseClient } from "@supabase/supabase-js";

import { getCurrentMonth, toMonthDate } from "@/lib/utils/date";
import type {
  DashboardSnapshot,
  GoalSnapshot,
  LatestSaleSnapshot,
  ProductSnapshot,
  SellerSnapshot,
  TeamSnapshot,
  TopSellerSnapshot,
} from "@/types/domain";

interface CloserRow {
  id: string;
  name: string;
  initials: string;
  accent_color: string;
  photo_url: string | null;
  team_id: string | null;
  display_order: number;
}

interface TeamRow {
  id: string;
  name: string;
  banner_url: string | null;
  accent_color: string;
  gradient_preset: "blue" | "coral" | "green" | "purple";
  shape: "triangle" | "chevron" | "hexagon";
  display_order: number;
}

interface CloserMonthlyRow {
  closer_id: string;
  total_vendas: number | string;
  total_entrada: number | string;
}

interface ProductMonthlyRow {
  product_id: string;
  name: string;
  total_vendas: number | string;
}

interface MetricRow {
  closer_id: string;
  calls: number;
  conversion_pct: number | string;
}

interface GoalRow {
  target_value: number | string;
}

const asNumber = (v: number | string): number => Number(v);

export async function getSnapshot(
  supabase: SupabaseClient
): Promise<DashboardSnapshot> {
  const month = getCurrentMonth();
  const monthDate = toMonthDate(month);

  const [
    teamsRes,
    closersRes,
    closerMonthlyRes,
    productMonthlyRes,
    latestRes,
    metricsRes,
    goalRes,
  ] = await Promise.all([
    supabase
      .from("teams")
      .select(
        "id,name,banner_url,accent_color,gradient_preset,shape,display_order"
      )
      .is("deleted_at", null)
      .order("display_order", { ascending: true }),
    supabase
      .from("closers")
      .select(
        "id,name,initials,accent_color,photo_url,team_id,display_order"
      )
      .is("deleted_at", null)
      .order("display_order", { ascending: true }),
    supabase
      .from("v_closer_monthly")
      .select("closer_id,total_vendas,total_entrada")
      .eq("month", monthDate),
    supabase
      .from("v_product_monthly")
      .select("product_id,name,total_vendas")
      .eq("month", monthDate),
    supabase.from("v_latest_sales_public").select("*"),
    supabase
      .from("monthly_metrics")
      .select("closer_id,calls,conversion_pct")
      .eq("month", monthDate),
    supabase
      .from("goals")
      .select("target_value")
      .eq("month", monthDate)
      .maybeSingle(),
  ]);

  for (const res of [
    teamsRes,
    closersRes,
    closerMonthlyRes,
    productMonthlyRes,
    latestRes,
    metricsRes,
    goalRes,
  ]) {
    if (res.error) throw res.error;
  }

  const teams = (teamsRes.data ?? []) as TeamRow[];
  const closers = (closersRes.data ?? []) as CloserRow[];
  const closerMonthly = (closerMonthlyRes.data ?? []) as CloserMonthlyRow[];
  const productMonthly = (productMonthlyRes.data ?? []) as ProductMonthlyRow[];
  const latest = (latestRes.data ?? []) as LatestSaleSnapshot[];
  const metrics = (metricsRes.data ?? []) as MetricRow[];
  const goal = (goalRes.data ?? null) as GoalRow | null;

  const salesByCloser = new Map<string, { totalVendas: number; totalEntrada: number }>();
  for (const row of closerMonthly) {
    salesByCloser.set(row.closer_id, {
      totalVendas: asNumber(row.total_vendas),
      totalEntrada: asNumber(row.total_entrada),
    });
  }

  const metricsByCloser = new Map<
    string,
    { calls: number; conversion_pct: number }
  >();
  for (const row of metrics) {
    metricsByCloser.set(row.closer_id, {
      calls: asNumber(row.calls),
      conversion_pct: asNumber(row.conversion_pct),
    });
  }

  const sellers: SellerSnapshot[] = closers.map((c) => {
    const s = salesByCloser.get(c.id);
    const m = metricsByCloser.get(c.id);
    return {
      id: c.id,
      name: c.name,
      initials: c.initials,
      accent_color: c.accent_color,
      photo_url: c.photo_url,
      totalVendas: s?.totalVendas ?? 0,
      totalEntrada: s?.totalEntrada ?? 0,
      calls: m?.calls ?? 0,
      conversion_pct: m?.conversion_pct ?? 0,
    };
  });

  const sellersByTeam = new Map<string, SellerSnapshot[]>();
  for (const s of sellers) {
    const tid = closers.find((c) => c.id === s.id)?.team_id ?? null;
    if (!tid) continue;
    const bucket = sellersByTeam.get(tid) ?? [];
    bucket.push(s);
    sellersByTeam.set(tid, bucket);
  }

  const rawTeams = teams.map((t) => {
    const members = sellersByTeam.get(t.id) ?? [];
    const totalVendas = members.reduce((acc, s) => acc + s.totalVendas, 0);
    const totalEntrada = members.reduce((acc, s) => acc + s.totalEntrada, 0);
    return {
      id: t.id,
      name: t.name,
      banner_url: t.banner_url,
      gradient_preset: t.gradient_preset,
      shape: t.shape,
      accent_color: t.accent_color,
      totalVendas,
      totalEntrada,
      sellers: [...members].sort((a, b) => b.totalVendas - a.totalVendas),
      isLeader: false,
    };
  });

  const leaderTotal = rawTeams.reduce(
    (max, t) => (t.totalVendas > max ? t.totalVendas : max),
    0
  );
  const teamsOut: TeamSnapshot[] = rawTeams.map((t) => ({
    ...t,
    isLeader: leaderTotal > 0 && t.totalVendas === leaderTotal,
  }));

  const top3: TopSellerSnapshot[] = [...sellers]
    .sort((a, b) => b.totalVendas - a.totalVendas)
    .slice(0, 3)
    .filter((s) => s.totalVendas > 0)
    .map((s, i) => ({
      position: (i + 1) as 1 | 2 | 3,
      id: s.id,
      name: s.name,
      accent_color: s.accent_color,
      totalVendas: s.totalVendas,
    }));

  const products: ProductSnapshot[] = productMonthly
    .map((p) => ({
      id: p.product_id,
      name: p.name,
      totalVendas: asNumber(p.total_vendas),
    }))
    .sort((a, b) => b.totalVendas - a.totalVendas);

  const targetValue = goal ? asNumber(goal.target_value) : 0;
  const currentValue = sellers.reduce((acc, s) => acc + s.totalVendas, 0);
  const goalSnapshot: GoalSnapshot = {
    month: monthDate,
    targetValue,
    currentValue,
    pct: targetValue > 0 ? Math.min(100, (currentValue / targetValue) * 100) : 0,
  };

  return {
    currentMonth: monthDate,
    goal: goalSnapshot,
    top3,
    teams: teamsOut,
    products,
    latestSales: latest,
  };
}

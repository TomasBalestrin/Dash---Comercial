"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/client";
import type { DashboardSnapshot } from "@/types/domain";

const KEY = ["dashboard-snapshot"] as const;
const REALTIME_TABLES = ["sales", "goals", "monthly_metrics", "closers", "teams"] as const;

async function fetchSnapshot(): Promise<DashboardSnapshot> {
  const res = await fetch("/api/dashboard/snapshot", { cache: "no-store" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { error?: string }).error ?? `Erro ${res.status}`;
    throw new Error(message);
  }
  return (body as { data: DashboardSnapshot }).data;
}

export function useDashboardSnapshot() {
  const qc = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  const { data: snapshot, isLoading } = useQuery<DashboardSnapshot>({
    queryKey: KEY,
    queryFn: fetchSnapshot,
    staleTime: 1_000,
  });

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("dashboard");

    const invalidate = () => qc.invalidateQueries({ queryKey: KEY });

    for (const table of REALTIME_TABLES) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        invalidate
      );
    }

    channel.subscribe((status) => {
      setIsConnected(status === "SUBSCRIBED");
    });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [qc]);

  useEffect(() => {
    if (isConnected) return;
    const ms = Number(process.env.NEXT_PUBLIC_DASHBOARD_POLL_MS ?? 30_000);
    const interval = Number.isFinite(ms) && ms > 0 ? ms : 30_000;
    const id = setInterval(
      () => qc.invalidateQueries({ queryKey: KEY }),
      interval
    );
    return () => clearInterval(id);
  }, [isConnected, qc]);

  return { snapshot, isConnected, isLoading };
}

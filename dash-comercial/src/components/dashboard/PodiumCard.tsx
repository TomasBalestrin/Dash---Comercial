"use client";

import { PodiumPlace } from "@/components/dashboard/PodiumPlace";
import type { TopSellerSnapshot } from "@/types/domain";

interface PodiumCardProps {
  top3: TopSellerSnapshot[];
  glow?: boolean;
}

function findBy(
  top3: TopSellerSnapshot[],
  position: 1 | 2 | 3
): TopSellerSnapshot | null {
  return top3.find((s) => s.position === position) ?? null;
}

export function PodiumCard({ top3, glow }: PodiumCardProps) {
  const first = findBy(top3, 1);
  const second = findBy(top3, 2);
  const third = findBy(top3, 3);

  return (
    <section className="flex flex-col gap-6 rounded-card border border-border-card bg-bg-card p-7">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Ranking do mês
        </h2>
        <span className="rounded-pill bg-accent-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-gold">
          Top 3
        </span>
      </header>

      <div className="flex items-end justify-center gap-6 pt-6">
        <PodiumPlace position={2} seller={second} />
        <PodiumPlace position={1} seller={first} glow={glow} />
        <PodiumPlace position={3} seller={third} />
      </div>
    </section>
  );
}

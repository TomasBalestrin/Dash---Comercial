"use client";

import { AnimatePresence } from "framer-motion";

import { LatestSaleRow } from "@/components/dashboard/LatestSaleRow";
import type { LatestSaleSnapshot } from "@/types/domain";

interface LatestSalesCardProps {
  latestSales: LatestSaleSnapshot[];
}

export function LatestSalesCard({ latestSales }: LatestSalesCardProps) {
  const visible = latestSales.slice(0, 6);

  return (
    <section className="flex flex-col gap-5 rounded-card border border-border-card bg-bg-card p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Últimas vendas
        </h2>
        <span className="flex items-center gap-2 rounded-pill bg-bg-cardSoft px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-gold">
          <span
            aria-hidden
            className="size-2 animate-pulse rounded-full bg-accent-gold"
          />
          Tempo real
        </span>
      </header>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aguardando vendas...</p>
      ) : (
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {visible.map((sale) => (
              <li key={sale.id}>
                <LatestSaleRow sale={sale} />
              </li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}

"use client";

import { memo } from "react";

import { CloserAvatar } from "@/components/closers/CloserAvatar";
import { fmtBRLShort } from "@/lib/utils/currency";
import type { SellerSnapshot } from "@/types/domain";

interface SellerCardProps {
  seller: SellerSnapshot;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="font-rajdhani text-base font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

function SellerCardComponent({ seller }: SellerCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-border-card bg-bg-card p-4">
      <CloserAvatar closer={seller} size={56} />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="truncate font-rajdhani text-lg font-bold uppercase tracking-wide text-white">
          {seller.name}
        </span>

        <div className="grid grid-cols-4 gap-3">
          <Stat label="Vendas" value={fmtBRLShort(seller.totalVendas)} />
          <Stat label="Entrada" value={fmtBRLShort(seller.totalEntrada)} />
          <Stat label="Calls" value={String(seller.calls)} />
          <Stat
            label="Conv"
            value={`${Math.round(seller.conversion_pct)}%`}
          />
        </div>
      </div>
    </div>
  );
}

export const SellerCard = memo(SellerCardComponent);

"use client";

import { memo } from "react";
import { motion } from "framer-motion";

import { fmtDateTime } from "@/lib/utils/date";
import type { LatestSaleSnapshot } from "@/types/domain";

interface LatestSaleRowProps {
  sale: LatestSaleSnapshot;
}

function LatestSaleRowComponent({ sale }: LatestSaleRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 rounded-md border border-border-card bg-bg-cardSoft/40 p-3"
    >
      <div
        aria-label={sale.closer_name}
        className="flex size-10 shrink-0 items-center justify-center rounded-full font-rajdhani text-sm font-semibold text-white"
        style={{ background: sale.closer_accent }}
      >
        {sale.closer_initials}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        <span className="truncate font-bold text-white">
          {sale.closer_name}
        </span>
        <span aria-hidden className="text-muted-foreground">
          ·
        </span>
        <span className="truncate text-muted-foreground">
          {sale.product_name}
        </span>
        <span aria-hidden className="text-muted-foreground">
          ·
        </span>
        <span className="truncate text-white/80">
          {sale.client_name_masked}
        </span>
      </div>

      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {fmtDateTime(sale.created_at)}
      </span>
    </motion.div>
  );
}

export const LatestSaleRow = memo(LatestSaleRowComponent);

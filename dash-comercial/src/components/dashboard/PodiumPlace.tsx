"use client";

import { motion } from "framer-motion";

import { fmtBRLShort } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import type { TopSellerSnapshot } from "@/types/domain";

type Position = 1 | 2 | 3;

const BAR_HEIGHT: Record<Position, number> = {
  1: 180,
  2: 140,
  3: 120,
};

const MEDAL_GRADIENT: Record<Position, string> = {
  1: "linear-gradient(145deg, #F5B942 0%, #B8862F 100%)",
  2: "linear-gradient(145deg, #D4DCE6 0%, #7A8595 100%)",
  3: "linear-gradient(145deg, #E8724A 0%, #8E3E21 100%)",
};

const SHIELD_GRADIENT: Record<Position, string> = {
  1: "linear-gradient(180deg, rgba(245,185,66,0.35) 0%, rgba(245,185,66,0.08) 100%)",
  2: "linear-gradient(180deg, rgba(212,220,230,0.28) 0%, rgba(212,220,230,0.06) 100%)",
  3: "linear-gradient(180deg, rgba(232,114,74,0.28) 0%, rgba(232,114,74,0.06) 100%)",
};

interface PodiumPlaceProps {
  position: Position;
  seller: TopSellerSnapshot | null;
  glow?: boolean;
}

export function PodiumPlace({ position, seller, glow }: PodiumPlaceProps) {
  const empty = !seller;
  const height = BAR_HEIGHT[position];
  const isFirst = position === 1;

  return (
    <div className="flex w-40 flex-col items-center gap-3">
      <motion.div
        animate={
          isFirst && glow
            ? {
                boxShadow: [
                  "0 0 0 rgba(245,185,66,0)",
                  "0 0 40px rgba(245,185,66,0.55)",
                  "0 0 0 rgba(245,185,66,0)",
                ],
              }
            : undefined
        }
        transition={
          isFirst && glow
            ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        className="relative flex w-full items-end justify-center rounded-t-card border border-border-card bg-bg-card"
        style={{ height, background: SHIELD_GRADIENT[position] }}
      >
        <div
          className={cn(
            "absolute -top-6 flex size-12 items-center justify-center rounded-full font-rajdhani text-xl font-bold text-white shadow-lg"
          )}
          style={{ background: MEDAL_GRADIENT[position] }}
          aria-label={`${position}º lugar`}
        >
          {position}
        </div>
      </motion.div>

      <div className="flex flex-col items-center gap-0.5 text-center">
        {empty ? (
          <span className="text-lg font-semibold text-muted-foreground">—</span>
        ) : (
          <>
            <span className="truncate text-sm font-semibold uppercase tracking-wide text-white">
              {seller.name}
            </span>
            <span
              className="text-lg font-bold"
              style={{ color: seller.accent_color }}
            >
              {fmtBRLShort(seller.totalVendas)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

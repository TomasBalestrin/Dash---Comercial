"use client";

import { motion } from "framer-motion";
import { formatInTimeZone } from "date-fns-tz";

import { useLiveClock } from "@/hooks/useLiveClock";
import { fmtBRL, fmtBRLShort } from "@/lib/utils/currency";
import type { GoalSnapshot } from "@/types/domain";

const TZ = "America/Sao_Paulo";
const MONTH_NAMES = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
] as const;

function currentMonthLabel(monthDate: string): string {
  const parts = monthDate.split("-");
  const y = parts[0] ?? "";
  const m = Number.parseInt(parts[1] ?? "1", 10);
  const name = MONTH_NAMES[m - 1] ?? "";
  return `${name} ${y}`;
}

interface GoalCardProps {
  goal: GoalSnapshot;
}

export function GoalCard({ goal }: GoalCardProps) {
  const clock = useLiveClock();
  const time = formatInTimeZone(clock, TZ, "HH:mm:ss");
  const pctClamped = Math.max(0, Math.min(100, goal.pct));
  const pctLabel = Math.round(goal.pct);

  return (
    <motion.article
      key={goal.currentValue}
      initial={{ boxShadow: "0 0 0 rgba(245,185,66,0)" }}
      animate={{
        boxShadow: [
          "0 0 0 rgba(245,185,66,0)",
          "0 0 48px rgba(245,185,66,0.45)",
          "0 0 0 rgba(245,185,66,0)",
        ],
      }}
      transition={{ duration: 1.2 }}
      className="flex flex-col gap-6 rounded-card border border-border-card bg-bg-card p-7"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Meta
          </span>
          <span className="text-[72px] leading-none font-bold text-white">
            {fmtBRLShort(goal.targetValue)}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 pt-2">
          <span className="text-3xl font-bold text-accent-gold">
            {fmtBRL(goal.currentValue)}
          </span>
          <span className="text-lg font-semibold text-muted-foreground">
            ({pctLabel}%)
          </span>
        </div>
      </div>

      <div className="relative h-1.5 overflow-hidden rounded-pill bg-bg-cardSoft">
        <div
          className="h-full rounded-pill bg-accent-gold transition-[width] duration-500"
          style={{ width: `${pctClamped}%` }}
          aria-hidden
        />
        {[25, 50, 75].map((t) => (
          <span
            key={t}
            aria-hidden
            className="absolute top-0 h-full w-px bg-white/30"
            style={{ left: `${t}%` }}
          />
        ))}
      </div>

      <footer className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
        <span className="text-muted-foreground">
          {currentMonthLabel(goal.month)} · Mês em curso
        </span>
        <span className="flex items-center gap-2 text-accent-gold">
          <span
            aria-hidden
            className="size-2 animate-pulse rounded-full bg-accent-gold"
          />
          Ao vivo {time}
        </span>
      </footer>
    </motion.article>
  );
}

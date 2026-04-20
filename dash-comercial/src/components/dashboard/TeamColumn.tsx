import { LeaderRibbon } from "@/components/dashboard/LeaderRibbon";
import { SellerCard } from "@/components/dashboard/SellerCard";
import { TeamBanner } from "@/components/dashboard/TeamBanner";
import { fmtBRLShort } from "@/lib/utils/currency";
import type { TeamSnapshot } from "@/types/domain";

interface TeamColumnProps {
  team: TeamSnapshot;
}

function HeadlineCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-card border border-border-card bg-bg-cardSoft p-4">
      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <span className="font-rajdhani text-3xl font-bold text-white">
        {value}
      </span>
    </div>
  );
}

export function TeamColumn({ team }: TeamColumnProps) {
  const sellers = [...team.sellers].sort(
    (a, b) => b.totalVendas - a.totalVendas
  );

  return (
    <section className="relative flex flex-1 flex-col gap-4 overflow-hidden rounded-card">
      <TeamBanner team={team} />
      {team.isLeader ? <LeaderRibbon /> : null}

      <div className="flex gap-2">
        <HeadlineCard label="Venda" value={fmtBRLShort(team.totalVendas)} />
        <HeadlineCard label="Entrada" value={fmtBRLShort(team.totalEntrada)} />
      </div>

      <div className="flex flex-col gap-3">
        {sellers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem closers no time.</p>
        ) : (
          sellers.map((s) => <SellerCard key={s.id} seller={s} />)
        )}
      </div>
    </section>
  );
}

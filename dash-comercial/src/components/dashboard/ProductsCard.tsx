import { fmtBRLShort } from "@/lib/utils/currency";
import type { ProductSnapshot } from "@/types/domain";

interface ProductsCardProps {
  products: ProductSnapshot[];
}

export function ProductsCard({ products }: ProductsCardProps) {
  const max = products.reduce((m, p) => (p.totalVendas > m ? p.totalVendas : m), 0);

  return (
    <section className="flex flex-col gap-5 rounded-card border border-border-card bg-bg-card p-6">
      <header>
        <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Vendas por produto
        </h2>
      </header>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma venda registrada no mês.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((p) => {
            const pct = max > 0 ? (p.totalVendas / max) * 100 : 0;
            return (
              <li key={p.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-semibold uppercase tracking-wide text-white">
                    {p.name}
                  </span>
                  <span className="font-bold tabular-nums text-accent-gold">
                    {fmtBRLShort(p.totalVendas)}
                  </span>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-pill bg-border-card">
                  <div
                    aria-hidden
                    className="h-full rounded-pill bg-accent-gold transition-[width] duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

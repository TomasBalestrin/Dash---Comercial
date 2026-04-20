"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SaleForm } from "@/components/sales/SaleForm";
import { SalesFilters } from "@/components/sales/SalesFilters";
import { SalesTable } from "@/components/sales/SalesTable";
import { useDeleteSale, useSales, type SaleRow } from "@/hooks/useSales";
import type { SaleFilter } from "@/lib/schemas/sale";
import { getCurrentMonth } from "@/lib/utils/date";

const BANNER_KEY = "dash-comercial:vendas-banner-dismissed";

export default function SalesPage() {
  const [filters, setFilters] = useState<SaleFilter>({
    month: getCurrentMonth(),
  });
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleRow | undefined>();
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  const { data: sales = [], isLoading, isError } = useSales(filters);
  const deleteSale = useDeleteSale();

  const [bannerDismissed, setBannerDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    setBannerDismissed(window.localStorage.getItem(BANNER_KEY) === "1");
  }, []);

  function dismissBanner() {
    window.localStorage.setItem(BANNER_KEY, "1");
    setBannerDismissed(true);
  }

  function openNew() {
    setSelectedSale(undefined);
    setFormOpen(true);
  }

  function openEdit(sale: SaleRow) {
    setSelectedSale(sale);
    setFormOpen(true);
  }

  function close() {
    setFormOpen(false);
    setSelectedSale(undefined);
  }

  return (
    <div className="flex flex-col gap-6">
      {bannerDismissed === false ? (
        <div
          role="note"
          className="flex items-center gap-3 rounded-card border border-accent-gold/30 bg-accent-gold/10 px-4 py-3 text-sm text-white"
        >
          <span aria-hidden className="text-lg">
            💡
          </span>
          <span className="flex-1">
            Abra{" "}
            <a
              href="/dashboard"
              target="_blank"
              rel="noopener"
              className="font-semibold text-accent-gold underline underline-offset-2"
            >
              /dashboard
              <ExternalLink className="ml-1 inline size-3" aria-hidden />
            </a>{" "}
            na TV do escritório para ver o ranking em tempo real.
          </span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Fechar aviso"
            onClick={dismissBanner}
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>
      ) : null}

      <header className="flex items-center justify-between">
        <h1 className="font-rajdhani text-2xl font-bold tracking-wide text-white">
          Vendas
        </h1>
        <Button onClick={openNew}>
          <Plus className="size-4" aria-hidden />
          Nova venda
        </Button>
      </header>

      <SalesFilters filters={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Carregando vendas...</div>
      ) : isError ? (
        <div className="text-sm text-destructive">Erro ao carregar vendas.</div>
      ) : (
        <SalesTable
          sales={sales}
          onEdit={openEdit}
          onDelete={(s) => deleteSale.mutate(s.id)}
          lastCreatedId={lastCreatedId}
        />
      )}

      <SaleForm
        open={formOpen}
        sale={selectedSale}
        onClose={close}
        onCreated={(id) => setLastCreatedId(id)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SaleForm } from "@/components/sales/SaleForm";
import { SalesFilters } from "@/components/sales/SalesFilters";
import { SalesTable } from "@/components/sales/SalesTable";
import { useDeleteSale, useSales, type SaleRow } from "@/hooks/useSales";
import type { SaleFilter } from "@/lib/schemas/sale";
import { getCurrentMonth } from "@/lib/utils/date";

export default function SalesPage() {
  const [filters, setFilters] = useState<SaleFilter>({
    month: getCurrentMonth(),
  });
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleRow | undefined>();
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  const { data: sales = [], isLoading, isError } = useSales(filters);
  const deleteSale = useDeleteSale();

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

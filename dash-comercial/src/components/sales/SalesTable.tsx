"use client";

import { useEffect, useMemo, useState } from "react";
import { MoreHorizontal, Pencil, ShoppingCart, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CloserAvatar } from "@/components/closers/CloserAvatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { useClosers, type CloserRow } from "@/hooks/useClosers";
import { useProducts, type ProductRow } from "@/hooks/useProducts";
import { type SaleRow } from "@/hooks/useSales";
import { fmtBRL } from "@/lib/utils/currency";
import { fmtDateTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

interface SalesTableProps {
  sales: SaleRow[];
  onEdit: (sale: SaleRow) => void;
  onDelete: (sale: SaleRow) => void;
  lastCreatedId?: string | null;
}

export function SalesTable({
  sales,
  onEdit,
  onDelete,
  lastCreatedId,
}: SalesTableProps) {
  const { data: closers = [] } = useClosers();
  const { data: products = [] } = useProducts();
  const [flashId, setFlashId] = useState<string | null>(null);

  useEffect(() => {
    if (!lastCreatedId) return;
    setFlashId(lastCreatedId);
    const t = setTimeout(() => setFlashId(null), 2000);
    return () => clearTimeout(t);
  }, [lastCreatedId]);

  const closersById = useMemo(
    () =>
      new Map<string, CloserRow>(closers.map((c: CloserRow) => [c.id, c])),
    [closers]
  );
  const productsById = useMemo(
    () =>
      new Map<string, ProductRow>(
        products.map((p: ProductRow) => [p.id, p])
      ),
    [products]
  );

  if (sales.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Nenhuma venda encontrada"
        description="Ajuste os filtros ou registre uma nova venda."
      />
    );
  }

  return (
    <div className="rounded-card border border-border-card bg-bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Data</TableHead>
            <TableHead>Closer</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Entrada</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-12" aria-label="Ações" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((s) => {
            const closer = s.closer_id ? closersById.get(s.closer_id) : null;
            const product = s.product_id
              ? productsById.get(s.product_id)
              : null;
            const highlight = flashId === s.id;
            return (
              <TableRow
                key={s.id}
                className={cn(
                  "transition-colors",
                  highlight && "bg-accent-gold/10"
                )}
              >
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {fmtDateTime(s.created_at)}
                </TableCell>
                <TableCell>
                  {closer ? (
                    <span className="flex items-center gap-2">
                      <CloserAvatar closer={closer} size={24} />
                      <span className="text-sm">{closer.name}</span>
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {product?.name ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-white">
                  {s.client_name}
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {fmtBRL(s.value_entrada)}
                </TableCell>
                <TableCell className="text-right text-sm font-semibold tabular-nums text-white">
                  {fmtBRL(s.value_total)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Ações da venda"
                      >
                        <MoreHorizontal className="size-4" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onEdit(s)}>
                        <Pencil className="mr-2 size-4" aria-hidden />
                        Editar
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="mr-2 size-4" aria-hidden />
                            Excluir
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Excluir venda de {s.client_name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Total {fmtBRL(s.value_total)}. A operação pode
                              ser revertida no banco de dados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(s)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

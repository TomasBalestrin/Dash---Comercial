"use client";

import { useState } from "react";
import { Package, Trash2 } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductInlineForm } from "@/components/products/ProductInlineForm";
import {
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
  type ProductRow,
} from "@/hooks/useProducts";

export function ProductTable() {
  const { data: products, isLoading, isError } = useProducts();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Carregando produtos...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive">
        Erro ao carregar produtos.
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border-card bg-bg-card p-12 text-center"
      >
        <Package className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">
          Nenhum produto cadastrado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border-card bg-bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="w-16 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: ProductRow) => {
            const isEditing = editingId === product.id;
            return (
              <TableRow key={product.id}>
                <TableCell className="align-middle">
                  {isEditing ? (
                    <ProductInlineForm
                      initial={product.name}
                      onCreate={() => {}}
                      onUpdate={(name) => {
                        updateProduct.mutate(
                          { id: product.id, input: { name } },
                          { onSettled: () => setEditingId(null) }
                        );
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingId(product.id)}
                      className="w-full text-left text-white hover:text-accent-gold"
                    >
                      {product.name}
                    </button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Excluir ${product.name}`}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Excluir {product.name}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Produtos vinculados a vendas não podem ser
                          excluídos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteProduct.mutate(product.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

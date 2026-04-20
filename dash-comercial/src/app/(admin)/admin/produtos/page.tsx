"use client";

import { ProductInlineForm } from "@/components/products/ProductInlineForm";
import { ProductTable } from "@/components/products/ProductTable";
import { useCreateProduct } from "@/hooks/useProducts";

export default function ProductsPage() {
  const createProduct = useCreateProduct();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <h1 className="font-rajdhani text-2xl font-bold tracking-wide text-white">
          Produtos
        </h1>
        <ProductInlineForm
          onCreate={(name) => createProduct.mutate({ name })}
        />
      </header>

      <ProductTable />
    </div>
  );
}

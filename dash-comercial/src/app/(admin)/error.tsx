"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error("[ADMIN.ERROR]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div
        role="alert"
        className="flex w-full max-w-md flex-col items-center gap-4 rounded-card border border-destructive/40 bg-bg-card p-8 text-center"
      >
        <AlertTriangle className="size-10 text-destructive" aria-hidden />
        <h2 className="font-rajdhani text-xl font-bold text-white">
          Algo deu errado
        </h2>
        <p className="text-sm text-muted-foreground">
          Não conseguimos carregar esta página. Tente novamente — se persistir,
          avise o administrador.
        </p>
        <Button type="button" onClick={reset}>
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}

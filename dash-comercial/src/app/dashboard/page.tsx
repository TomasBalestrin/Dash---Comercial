"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const DashboardCanvas = dynamic(
  () =>
    import("@/components/dashboard/DashboardCanvas").then((m) => ({
      default: m.DashboardCanvas,
    })),
  { ssr: false }
);

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center text-sm text-muted-foreground">
          Carregando...
        </div>
      }
    >
      <DashboardCanvas />
    </Suspense>
  );
}

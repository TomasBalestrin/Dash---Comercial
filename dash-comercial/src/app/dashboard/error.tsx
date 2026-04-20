"use client";

import { useEffect, useState } from "react";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const RELOAD_SECONDS = 10;

export default function DashboardError({ error }: DashboardErrorProps) {
  const [countdown, setCountdown] = useState(RELOAD_SECONDS);

  useEffect(() => {
    console.error("[DASHBOARD.ERROR]", error);
  }, [error]);

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    const reload = setTimeout(() => window.location.reload(), RELOAD_SECONDS * 1000);
    return () => {
      clearInterval(tick);
      clearTimeout(reload);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-bg-main text-center text-muted-foreground">
      <div className="flex flex-col items-center gap-3 font-rajdhani">
        <span className="text-base uppercase tracking-[0.35em]">
          Dashboard temporariamente indisponível
        </span>
        <span className="text-sm">
          Recarregando em {countdown}s...
        </span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

import { GoalCard } from "@/components/dashboard/GoalCard";
import { LatestSalesCard } from "@/components/dashboard/LatestSalesCard";
import { PodiumCard } from "@/components/dashboard/PodiumCard";
import { ProductsCard } from "@/components/dashboard/ProductsCard";
import { useDashboardSnapshot } from "@/hooks/useDashboardSnapshot";

const PODIUM_GLOW = process.env.NEXT_PUBLIC_PODIUM_GLOW === "true";

export function DashboardCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { snapshot, isConnected } = useDashboardSnapshot();

  useEffect(() => {
    function resize() {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setScale(Math.min(scaleX, scaleY));
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden"
    >
      <div
        className="flex gap-5 p-5"
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <div id="dash-left" className="flex w-[774px] flex-col gap-5">
          {snapshot ? (
            <>
              <GoalCard goal={snapshot.goal} />
              <PodiumCard top3={snapshot.top3} glow={PODIUM_GLOW} />
              <div className="grid flex-1 grid-cols-2 gap-5">
                <ProductsCard products={snapshot.products} />
                <LatestSalesCard latestSales={snapshot.latestSales} />
              </div>
            </>
          ) : null}
        </div>
        <div id="dash-right" className="flex flex-1 gap-5">
          RIGHT
        </div>
      </div>

      {!isConnected ? (
        <span className="absolute right-4 top-4 flex items-center gap-2 rounded-pill border border-border-card bg-bg-card/80 px-3 py-1 text-xs text-accent-gold backdrop-blur">
          <span
            aria-hidden
            className="size-2 animate-pulse rounded-full bg-accent-gold"
          />
          Reconectando...
        </span>
      ) : null}
    </div>
  );
}

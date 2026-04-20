import { GRADIENTS } from "@/lib/constants/gradients";
import { SHAPES } from "@/lib/constants/shapes";
import type { TeamSnapshot } from "@/types/domain";

interface TeamBannerProps {
  team: TeamSnapshot;
}

export function TeamBanner({ team }: TeamBannerProps) {
  return (
    <div
      className="relative flex h-[120px] items-center justify-center overflow-hidden rounded-card"
      style={{ background: GRADIENTS[team.gradient_preset] }}
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
      >
        <path d={SHAPES[team.shape]} fill="white" fillOpacity={0.15} />
      </svg>

      <h2 className="relative font-rajdhani text-5xl font-bold uppercase tracking-[0.15em] text-white">
        {team.name}
      </h2>
    </div>
  );
}

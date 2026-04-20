import Image from "next/image";

import type { CloserRow } from "@/hooks/useClosers";

interface CloserAvatarProps {
  closer: Pick<CloserRow, "name" | "photo_url" | "initials" | "accent_color">;
  size?: number;
}

export function CloserAvatar({ closer, size = 48 }: CloserAvatarProps) {
  const dimension = { width: size, height: size };

  if (closer.photo_url) {
    return (
      <div
        className="relative overflow-hidden rounded-full"
        style={dimension}
      >
        <Image
          src={closer.photo_url}
          alt={`Foto de ${closer.name}`}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-label={closer.name}
      className="flex items-center justify-center rounded-full font-rajdhani font-semibold text-white"
      style={{
        ...dimension,
        background: closer.accent_color,
        fontSize: Math.round(size * 0.4),
      }}
    >
      {closer.initials}
    </div>
  );
}

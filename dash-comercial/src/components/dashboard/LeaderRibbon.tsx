export function LeaderRibbon() {
  return (
    <span
      aria-label="Time líder"
      className="pointer-events-none absolute right-0 top-0 z-10 bg-accent-gold px-8 py-1 font-rajdhani text-xs font-bold uppercase tracking-[0.25em] text-black shadow-lg"
      style={{
        transform: "translate(30%, 40%) rotate(45deg)",
        transformOrigin: "center",
      }}
    >
      Liderando
    </span>
  );
}

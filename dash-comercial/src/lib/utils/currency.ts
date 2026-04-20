const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function fmtBRL(n: number): string {
  return BRL.format(n);
}

export function fmtBRLShort(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });

  if (abs >= 1_000_000_000) return `${sign}R$ ${fmt(abs / 1_000_000_000)} bi`;
  if (abs >= 1_000_000) return `${sign}R$ ${fmt(abs / 1_000_000)} mi`;
  if (abs >= 1_000) return `${sign}R$ ${fmt(abs / 1_000)}K`;
  return BRL.format(n);
}

export function parseBRL(s: string): number {
  const cleaned = s
    .replace(/\s/g, "")
    .replace(/R\$/gi, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number.parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const TZ = "America/Sao_Paulo";

export function getCurrentMonth(): string {
  return formatInTimeZone(new Date(), TZ, "yyyy-MM");
}

export function toMonthDate(monthYYYYMM: string): string {
  return `${monthYYYYMM}-01`;
}

export function fmtDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return format(date, "dd/MM HH:mm");
}

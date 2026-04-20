"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CloserAvatar } from "@/components/closers/CloserAvatar";
import {
  useMetrics,
  useSaveMetrics,
  type MetricRow,
} from "@/hooks/useMetrics";
import { getCurrentMonth, toMonthDate } from "@/lib/utils/date";

const TZ = "America/Sao_Paulo";

interface DraftEntry {
  calls: number;
  conversion_pct: number;
}
type Draft = Record<string, DraftEntry>;

function lastTwelveMonths(): string[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return formatInTimeZone(d, TZ, "yyyy-MM");
  });
}

function labelForMonth(m: string): string {
  const label = formatInTimeZone(new Date(`${m}-15T12:00:00`), TZ, "MMM yyyy");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function snapshot(rows: MetricRow[]): Draft {
  const d: Draft = {};
  for (const r of rows) {
    d[r.id] = { calls: r.calls, conversion_pct: r.conversion_pct };
  }
  return d;
}

export function MetricsEditor() {
  const months = useMemo(lastTwelveMonths, []);
  const [month, setMonth] = useState<string>(getCurrentMonth());
  const { data: rows = [], isLoading, isError } = useMetrics(month);
  const saveMetrics = useSaveMetrics();

  const [initial, setInitial] = useState<Draft>({});
  const [draft, setDraft] = useState<Draft>({});

  useEffect(() => {
    const snap = snapshot(rows);
    setInitial(snap);
    setDraft(snap);
  }, [rows]);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initial),
    [draft, initial]
  );

  useEffect(() => {
    if (!isDirty) return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  function patch(id: string, value: Partial<DraftEntry>) {
    setDraft((d) => ({
      ...d,
      [id]: { ...(d[id] ?? { calls: 0, conversion_pct: 0 }), ...value },
    }));
  }

  function discard() {
    setDraft(initial);
  }

  async function save() {
    const items = rows
      .map((r) => ({
        closer_id: r.id,
        calls: draft[r.id]?.calls ?? 0,
        conversion_pct: draft[r.id]?.conversion_pct ?? 0,
      }))
      .filter((item) => {
        const base = initial[item.closer_id];
        return (
          !base ||
          base.calls !== item.calls ||
          base.conversion_pct !== item.conversion_pct
        );
      });
    if (items.length === 0) return;
    await saveMetrics.mutateAsync({ month: toMonthDate(month), items });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {labelForMonth(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Carregando métricas...</div>
      ) : isError ? (
        <div className="text-sm text-destructive">Erro ao carregar métricas.</div>
      ) : (
        <div className="rounded-card border border-border-card bg-bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Closer</TableHead>
                <TableHead className="w-32">Calls</TableHead>
                <TableHead className="w-40">Conversão %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const entry = draft[r.id] ?? { calls: 0, conversion_pct: 0 };
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <CloserAvatar closer={r} size={28} />
                        <span className="text-sm text-white">{r.name}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={entry.calls}
                        onChange={(e) =>
                          patch(r.id, {
                            calls: Math.max(
                              0,
                              Number.parseInt(e.target.value, 10) || 0
                            ),
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={0.1}
                          inputMode="decimal"
                          value={entry.conversion_pct}
                          onChange={(e) =>
                            patch(r.id, {
                              conversion_pct: Math.min(
                                100,
                                Math.max(0, Number(e.target.value) || 0)
                              ),
                            })
                          }
                          className="pr-7"
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-muted-foreground"
                        >
                          %
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <footer className="sticky bottom-4 flex items-center justify-between rounded-card border border-border-card bg-bg-card/80 px-4 py-3 backdrop-blur">
        <span className="text-xs text-muted-foreground">
          {isDirty ? (
            <span className="text-accent-gold">● Alterações não salvas</span>
          ) : (
            "Tudo sincronizado"
          )}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={discard}
            disabled={!isDirty || saveMetrics.isPending}
          >
            Descartar
          </Button>
          <Button
            type="button"
            onClick={save}
            disabled={!isDirty || saveMetrics.isPending}
          >
            {saveMetrics.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}

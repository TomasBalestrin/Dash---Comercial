"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Target } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "@/components/sales/CurrencyInput";
import { useGoal, useSaveGoal } from "@/hooks/useGoal";
import { fmtBRL } from "@/lib/utils/currency";
import { getCurrentMonth, toMonthDate } from "@/lib/utils/date";

const TZ = "America/Sao_Paulo";

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

export function GoalForm() {
  const months = useMemo(lastTwelveMonths, []);
  const [month, setMonth] = useState<string>(getCurrentMonth());
  const { data: goal, isLoading } = useGoal(month);
  const saveGoal = useSaveGoal();

  const [target, setTarget] = useState(0);

  useEffect(() => {
    setTarget(goal ? Number(goal.target_value) : 0);
  }, [goal]);

  const canSave = target > 0 && target !== (goal ? Number(goal.target_value) : 0);

  async function handleSave() {
    if (!canSave) return;
    await saveGoal.mutateAsync({
      month: toMonthDate(month),
      target_value: target,
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <article className="flex items-center gap-4 rounded-card border border-border-card bg-bg-card p-5">
        <div className="flex size-12 items-center justify-center rounded-full bg-accent-gold/10 text-accent-gold">
          <Target className="size-5" aria-hidden />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Meta atual ({labelForMonth(month)})
          </span>
          {isLoading ? (
            <span className="text-sm text-muted-foreground">Carregando...</span>
          ) : goal ? (
            <span className="font-rajdhani text-3xl font-bold text-white">
              {fmtBRL(Number(goal.target_value))}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Nenhuma meta cadastrada neste mês.
            </span>
          )}
        </div>
      </article>

      <div className="flex flex-col gap-2">
        <Label>Mês</Label>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-full max-w-xs">
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="goal-target">Valor da meta</Label>
        <CurrencyInput
          id="goal-target"
          value={target}
          onChange={setTarget}
          placeholder="R$ 0,00"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={!canSave || saveGoal.isPending}
        >
          {saveGoal.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloserAvatar } from "@/components/closers/CloserAvatar";
import { useClosers, type CloserRow } from "@/hooks/useClosers";
import { useProducts } from "@/hooks/useProducts";
import type { SaleFilter } from "@/lib/schemas/sale";

const TZ = "America/Sao_Paulo";
const ALL = "__all__";

interface SalesFiltersProps {
  filters: SaleFilter;
  onChange: (f: SaleFilter) => void;
}

function lastTwelveMonths(): string[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return formatInTimeZone(d, TZ, "yyyy-MM");
  });
}

function labelForMonth(m: string): string {
  const d = new Date(`${m}-15T12:00:00`);
  const label = formatInTimeZone(d, TZ, "MMM yyyy");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function SalesFilters({ filters, onChange }: SalesFiltersProps) {
  const { data: closers = [] } = useClosers();
  const { data: products = [] } = useProducts();

  const months = useMemo(lastTwelveMonths, []);
  const [closerOpen, setCloserOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState(filters.search ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchDraft(filters.search ?? "");
  }, [filters.search]);

  function patch(next: Partial<SaleFilter>) {
    onChange({ ...filters, ...next });
  }

  function onSearch(value: string) {
    setSearchDraft(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      patch({ search: value.trim() || undefined });
    }, 300);
  }

  const selectedCloser = closers.find(
    (c: CloserRow) => c.id === filters.closer_id
  );

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex min-w-40 flex-col gap-1">
        <span className="text-xs text-muted-foreground">Mês</span>
        <Select
          value={filters.month ?? ALL}
          onValueChange={(v) => patch({ month: v === ALL ? undefined : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {labelForMonth(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-52 flex-col gap-1">
        <span className="text-xs text-muted-foreground">Closer</span>
        <Popover open={closerOpen} onOpenChange={setCloserOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={closerOpen}
              className="justify-between"
            >
              {selectedCloser ? (
                <span className="flex items-center gap-2">
                  <CloserAvatar closer={selectedCloser} size={20} />
                  {selectedCloser.name}
                </span>
              ) : (
                "Todos"
              )}
              <ChevronsUpDown className="size-4 opacity-50" aria-hidden />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar closer..." />
              <CommandList>
                <CommandEmpty>Nenhum closer</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      patch({ closer_id: undefined });
                      setCloserOpen(false);
                    }}
                  >
                    <X className="mr-2 size-4" aria-hidden />
                    Todos
                  </CommandItem>
                  {closers.map((c: CloserRow) => (
                    <CommandItem
                      key={c.id}
                      value={c.name}
                      onSelect={() => {
                        patch({ closer_id: c.id });
                        setCloserOpen(false);
                      }}
                    >
                      <CloserAvatar closer={c} size={20} />
                      <span className="ml-2">{c.name}</span>
                      {filters.closer_id === c.id ? (
                        <Check className="ml-auto size-4" aria-hidden />
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex min-w-40 flex-col gap-1">
        <span className="text-xs text-muted-foreground">Produto</span>
        <Select
          value={filters.product_id ?? ALL}
          onValueChange={(v) =>
            patch({ product_id: v === ALL ? undefined : v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-56 flex-1 flex-col gap-1">
        <span className="text-xs text-muted-foreground">Cliente</span>
        <Input
          placeholder="Buscar por nome..."
          value={searchDraft}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

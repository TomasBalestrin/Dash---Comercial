"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CloserAvatar } from "@/components/closers/CloserAvatar";
import { CurrencyInput } from "@/components/sales/CurrencyInput";
import {
  useCreateSale,
  useUpdateSale,
  type SaleRow,
} from "@/hooks/useSales";
import { useClosers, type CloserRow } from "@/hooks/useClosers";
import { useProducts } from "@/hooks/useProducts";
import {
  saleCreateSchema,
  type SaleCreateInput,
} from "@/lib/schemas/sale";

const TZ = "America/Sao_Paulo";
const todaySp = () => formatInTimeZone(new Date(), TZ, "yyyy-MM-dd");

interface SaleFormProps {
  sale?: SaleRow;
  open: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

const DEFAULTS = (): SaleCreateInput => ({
  closer_id: "",
  product_id: "",
  client_name: "",
  sale_date: todaySp(),
  value_total: 0,
  value_entrada: 0,
});

export function SaleForm({ sale, open, onClose, onCreated }: SaleFormProps) {
  const createSale = useCreateSale();
  const updateSale = useUpdateSale();
  const { data: closers = [] } = useClosers();
  const { data: products = [] } = useProducts();
  const [closerOpen, setCloserOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SaleCreateInput>({
    resolver: zodResolver(saleCreateSchema),
    defaultValues: DEFAULTS(),
  });

  useEffect(() => {
    if (!open) return;
    reset(
      sale
        ? {
            closer_id: sale.closer_id ?? "",
            product_id: sale.product_id ?? "",
            client_name: sale.client_name,
            sale_date: sale.sale_date,
            value_total: Number(sale.value_total),
            value_entrada: Number(sale.value_entrada),
          }
        : DEFAULTS()
    );
  }, [open, sale, reset]);

  const total = watch("value_total");
  function applyPct(pct: number) {
    setValue("value_entrada", Math.round(total * pct) / 1, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  async function onSubmit(values: SaleCreateInput) {
    try {
      const saved = sale
        ? await updateSale.mutateAsync({ id: sale.id, input: values })
        : await createSale.mutateAsync(values);
      if (!sale && saved?.id) onCreated?.(saved.id);
      onClose();
    } catch {
      /* hooks already toast */
    }
  }

  const selectedCloser = (id: string) =>
    closers.find((c: CloserRow) => c.id === id);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto bg-bg-card p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border-card p-6 text-left">
          <SheetTitle>{sale ? "Editar venda" : "Nova venda"}</SheetTitle>
          <SheetDescription>
            Valores alimentam o ranking do mês em tempo real.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-5 p-6"
          noValidate
        >
          <Controller
            control={control}
            name="closer_id"
            render={({ field }) => {
              const current = selectedCloser(field.value);
              return (
                <div className="flex flex-col gap-2">
                  <Label>Closer</Label>
                  <Popover open={closerOpen} onOpenChange={setCloserOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={closerOpen}
                        className="justify-between"
                      >
                        {current ? (
                          <span className="flex items-center gap-2">
                            <CloserAvatar closer={current} size={20} />
                            {current.name}
                          </span>
                        ) : (
                          "Selecione um closer"
                        )}
                        <ChevronsUpDown
                          className="size-4 opacity-50"
                          aria-hidden
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar closer..." />
                        <CommandList>
                          <CommandEmpty>Nenhum closer</CommandEmpty>
                          <CommandGroup>
                            {closers.map((c: CloserRow) => (
                              <CommandItem
                                key={c.id}
                                value={c.name}
                                onSelect={() => {
                                  field.onChange(c.id);
                                  setCloserOpen(false);
                                }}
                              >
                                <CloserAvatar closer={c} size={20} />
                                <span className="ml-2">{c.name}</span>
                                {field.value === c.id ? (
                                  <Check
                                    className="ml-auto size-4"
                                    aria-hidden
                                  />
                                ) : null}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.closer_id ? (
                    <span className="text-xs text-destructive">
                      {errors.closer_id.message}
                    </span>
                  ) : null}
                </div>
              );
            }}
          />

          <Controller
            control={control}
            name="product_id"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label>Produto</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.product_id ? (
                  <span className="text-xs text-destructive">
                    {errors.product_id.message}
                  </span>
                ) : null}
              </div>
            )}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="sale-client">Cliente</Label>
            <Input
              id="sale-client"
              maxLength={80}
              {...register("client_name")}
            />
            {errors.client_name ? (
              <span className="text-xs text-destructive">
                {errors.client_name.message}
              </span>
            ) : null}
          </div>

          <Controller
            control={control}
            name="sale_date"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label>Data</Label>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="justify-start gap-2"
                    >
                      <CalendarIcon className="size-4" aria-hidden />
                      {field.value
                        ? format(parseISO(field.value), "dd/MM/yyyy")
                        : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? parseISO(field.value) : undefined}
                      onSelect={(d) => {
                        if (!d) return;
                        field.onChange(format(d, "yyyy-MM-dd"));
                        setDateOpen(false);
                      }}
                      disabled={{ after: parseISO(todaySp()) }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.sale_date ? (
                  <span className="text-xs text-destructive">
                    {errors.sale_date.message}
                  </span>
                ) : null}
              </div>
            )}
          />

          <Controller
            control={control}
            name="value_total"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="sale-total">Valor total</Label>
                <CurrencyInput
                  id="sale-total"
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={!!errors.value_total}
                />
                {errors.value_total ? (
                  <span className="text-xs text-destructive">
                    {errors.value_total.message}
                  </span>
                ) : null}
              </div>
            )}
          />

          <Controller
            control={control}
            name="value_entrada"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="sale-entrada">Valor entrada</Label>
                <CurrencyInput
                  id="sale-entrada"
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={!!errors.value_entrada}
                />
                <div className="flex gap-2">
                  {[0.3, 0.5, 1].map((p) => (
                    <Button
                      key={p}
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={!total}
                      onClick={() => applyPct(p)}
                    >
                      {Math.round(p * 100)}%
                    </Button>
                  ))}
                </div>
                {errors.value_entrada ? (
                  <span className="text-xs text-destructive">
                    {errors.value_entrada.message}
                  </span>
                ) : null}
              </div>
            )}
          />

          <div className="mt-auto flex items-center justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

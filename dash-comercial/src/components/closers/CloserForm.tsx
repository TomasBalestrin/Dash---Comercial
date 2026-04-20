"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  useCreateCloser,
  useUpdateCloser,
  useUploadCloserPhoto,
  type CloserRow,
} from "@/hooks/useClosers";
import { useTeams } from "@/hooks/useTeams";
import {
  closerCreateSchema,
  type CloserCreateInput,
} from "@/lib/schemas/closer";
import { cn } from "@/lib/utils/cn";
import { getInitials } from "@/lib/utils/initials";

type CloserFormValues = z.input<typeof closerCreateSchema>;

interface CloserFormProps {
  closer?: CloserRow;
  open: boolean;
  onClose: () => void;
}

const ACCENT_SWATCHES = ["#F5B942", "#E8724A", "#58A6FF", "#96C878"] as const;

const DEFAULTS: CloserFormValues = {
  name: "",
  initials: "",
  accent_color: "#F5B942",
  team_id: "",
  display_order: 0,
};

export function CloserForm({ closer, open, onClose }: CloserFormProps) {
  const createCloser = useCreateCloser();
  const updateCloser = useUpdateCloser();
  const uploadPhoto = useUploadCloserPhoto();
  const { data: teams = [] } = useTeams();

  const [file, setFile] = useState<File | null>(null);
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CloserFormValues, unknown, CloserCreateInput>({
    resolver: zodResolver(closerCreateSchema),
    defaultValues: DEFAULTS,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      closer
        ? {
            name: closer.name,
            initials: closer.initials,
            accent_color: closer.accent_color,
            team_id: closer.team_id ?? "",
            display_order: closer.display_order,
          }
        : DEFAULTS
    );
    setFile(null);
  }, [open, closer, reset]);

  const watchName = watch("name");
  const watchInitials = watch("initials");
  const watchAccent = watch("accent_color");
  const previewCloser = {
    name: watchName || "—",
    initials: watchInitials || "?",
    accent_color: watchAccent || "#F5B942",
    photo_url: preview ?? closer?.photo_url ?? null,
  };

  async function onSubmit(values: CloserCreateInput) {
    try {
      const saved = closer
        ? await updateCloser.mutateAsync({ id: closer.id, input: values })
        : await createCloser.mutateAsync(values);
      if (file && saved?.id) {
        await uploadPhoto.mutateAsync({ id: saved.id, file });
      }
      onClose();
    } catch {
      /* hooks already toast */
    }
  }

  if (teams.length === 0) {
    return (
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent side="right" className="bg-bg-card sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Novo closer</SheetTitle>
            <SheetDescription>
              Você precisa de pelo menos um time antes de cadastrar closers.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button asChild>
              <Link href="/admin/times">Ir para Times</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto bg-bg-card p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border-card p-6 text-left">
          <SheetTitle>{closer ? "Editar closer" : "Novo closer"}</SheetTitle>
          <SheetDescription>
            Dados do closer exibidos no dashboard e no ranking.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-5 p-6"
          noValidate
        >
          <div className="flex items-center gap-4">
            <CloserAvatar closer={previewCloser} size={72} />
            <label
              htmlFor="closer-photo"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border-card bg-bg-cardSoft px-3 py-2 text-xs text-muted-foreground hover:border-accent-gold"
            >
              <Upload className="size-4" aria-hidden />
              {file ? file.name : "Enviar foto"}
              <input
                id="closer-photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="closer-name">Nome</Label>
            <Input
              id="closer-name"
              maxLength={40}
              {...register("name", {
                onBlur: (e) => {
                  if (!watchInitials && e.target.value) {
                    setValue("initials", getInitials(e.target.value));
                  }
                },
              })}
            />
            {errors.name ? (
              <span className="text-xs text-destructive">
                {errors.name.message}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="closer-initials">Iniciais</Label>
            <Input
              id="closer-initials"
              maxLength={3}
              {...register("initials", {
                onChange: (e) => {
                  const up = e.target.value.toUpperCase();
                  if (up !== e.target.value) setValue("initials", up);
                },
              })}
            />
            {errors.initials ? (
              <span className="text-xs text-destructive">
                {errors.initials.message}
              </span>
            ) : null}
          </div>

          <Controller
            control={control}
            name="accent_color"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label>Cor de destaque</Label>
                <div className="flex items-center gap-2">
                  {ACCENT_SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Cor ${c}`}
                      onClick={() => field.onChange(c)}
                      className={cn(
                        "size-7 rounded-full border-2",
                        field.value === c
                          ? "border-white"
                          : "border-transparent"
                      )}
                      style={{ background: c }}
                    />
                  ))}
                  <input
                    type="color"
                    aria-label="Cor customizada"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="h-8 w-12 cursor-pointer rounded border border-border-card bg-transparent"
                  />
                </div>
                {errors.accent_color ? (
                  <span className="text-xs text-destructive">
                    {errors.accent_color.message}
                  </span>
                ) : null}
              </div>
            )}
          />

          <Controller
            control={control}
            name="team_id"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label>Time</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um time" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.team_id ? (
                  <span className="text-xs text-destructive">
                    {errors.team_id.message}
                  </span>
                ) : null}
              </div>
            )}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="closer-order">Ordem</Label>
            <Input
              id="closer-order"
              type="number"
              min={0}
              max={999}
              {...register("display_order", { valueAsNumber: true })}
            />
          </div>

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

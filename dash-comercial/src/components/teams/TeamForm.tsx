"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";

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
import {
  useCreateTeam,
  useUpdateTeam,
  useUploadTeamBanner,
  type TeamRow,
} from "@/hooks/useTeams";
import { GRADIENTS } from "@/lib/constants/gradients";
import {
  teamCreateSchema,
  type TeamCreateInput,
} from "@/lib/schemas/team";
import { cn } from "@/lib/utils/cn";
import { z } from "zod";

type TeamFormValues = z.input<typeof teamCreateSchema>;

interface TeamFormProps {
  team?: TeamRow;
  open: boolean;
  onClose: () => void;
}

const SHAPES = ["triangle", "chevron", "hexagon"] as const;
const GRADIENT_KEYS = ["blue", "coral", "green", "purple"] as const;
const ACCENT_SWATCHES = ["#F5B942", "#E8724A", "#58A6FF", "#96C878"] as const;

const DEFAULTS: TeamFormValues = {
  name: "",
  accent_color: "#F5B942",
  gradient_preset: "blue",
  shape: "triangle",
  display_order: 0,
};

export function TeamForm({ team, open, onClose }: TeamFormProps) {
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const uploadBanner = useUploadTeamBanner();

  const [file, setFile] = useState<File | null>(null);
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : team?.banner_url ?? null),
    [file, team?.banner_url]
  );
  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(preview!);
    };
  }, [file, preview]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormValues, unknown, TeamCreateInput>({
    resolver: zodResolver(teamCreateSchema),
    defaultValues: DEFAULTS,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      team
        ? {
            name: team.name,
            accent_color: team.accent_color,
            gradient_preset: team.gradient_preset,
            shape: team.shape,
            display_order: team.display_order,
          }
        : DEFAULTS
    );
    setFile(null);
  }, [open, team, reset]);

  async function onSubmit(values: TeamCreateInput) {
    try {
      const saved = team
        ? await updateTeam.mutateAsync({ id: team.id, input: values })
        : await createTeam.mutateAsync(values);
      if (file && saved?.id) {
        await uploadBanner.mutateAsync({ id: saved.id, file });
      }
      onClose();
    } catch {
      /* hooks already toast */
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto bg-bg-card p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border-card p-6 text-left">
          <SheetTitle>{team ? "Editar time" : "Novo time"}</SheetTitle>
          <SheetDescription>
            Configure nome, banner, cor e apresentação do time.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-5 p-6"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="team-name">Nome</Label>
            <Input id="team-name" maxLength={40} {...register("name")} />
            {errors.name ? (
              <span className="text-xs text-destructive">
                {errors.name.message}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Banner</Label>
            <label
              htmlFor="team-banner"
              className="group flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-border-card bg-bg-cardSoft text-sm text-muted-foreground hover:border-accent-gold"
              style={
                preview
                  ? {
                      backgroundImage: `url(${preview})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              {!preview ? (
                <span className="flex items-center gap-2">
                  <Upload className="size-4" aria-hidden /> Enviar imagem
                </span>
              ) : null}
              <input
                id="team-banner"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <p className="text-xs text-muted-foreground">
              PNG/JPEG/WEBP até 2 MB.
            </p>
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
            name="gradient_preset"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label>Gradient</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADIENT_KEYS.map((k) => (
                      <SelectItem key={k} value={k}>
                        <span className="flex items-center gap-2">
                          <span
                            className="size-4 rounded-sm"
                            style={{ background: GRADIENTS[k] }}
                            aria-hidden
                          />
                          {k}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Controller
            control={control}
            name="shape"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label>Shape</Label>
                <div
                  role="radiogroup"
                  aria-label="Shape"
                  className="grid grid-cols-3 gap-2"
                >
                  {SHAPES.map((s) => {
                    const active = field.value === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => field.onChange(s)}
                        className={cn(
                          "rounded-md border px-3 py-2 text-sm capitalize transition-colors",
                          active
                            ? "border-accent-gold bg-bg-cardSoft text-white"
                            : "border-border-card text-muted-foreground hover:text-white"
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="team-order">Ordem</Label>
            <Input
              id="team-order"
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

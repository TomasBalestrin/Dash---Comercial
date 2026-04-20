import { z } from "zod";

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const teamCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Nome obrigatório")
    .max(40, "Máximo 40 caracteres"),
  accent_color: z
    .string()
    .regex(HEX_COLOR, "Cor hex inválida (ex: #F5B942)"),
  gradient_preset: z.enum(["blue", "coral", "green", "purple"]),
  shape: z.enum(["triangle", "chevron", "hexagon"]),
  display_order: z.number().int().min(0).default(0),
});

export const teamUpdateSchema = teamCreateSchema.partial();

export type TeamCreateInput = z.infer<typeof teamCreateSchema>;
export type TeamUpdateInput = z.infer<typeof teamUpdateSchema>;

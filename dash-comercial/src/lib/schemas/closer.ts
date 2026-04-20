import { z } from "zod";

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const INITIALS = /^[A-Z]{1,3}$/;

export const closerCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Nome obrigatório")
    .max(40, "Máximo 40 caracteres"),
  initials: z
    .string()
    .min(1, "Iniciais obrigatórias")
    .max(3, "Máximo 3 caracteres")
    .regex(INITIALS, "Use 1 a 3 letras maiúsculas"),
  accent_color: z
    .string()
    .regex(HEX_COLOR, "Cor hex inválida (ex: #F5B942)"),
  team_id: z.string().uuid("Time inválido"),
  display_order: z.number().int().min(0).default(0),
  photo_url: z.string().url("URL inválida").optional(),
});

export const closerUpdateSchema = closerCreateSchema.partial();

export type CloserCreateInput = z.infer<typeof closerCreateSchema>;
export type CloserUpdateInput = z.infer<typeof closerUpdateSchema>;

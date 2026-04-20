import { z } from "zod";

export const productCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Nome obrigatório")
    .max(60, "Máximo 60 caracteres"),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

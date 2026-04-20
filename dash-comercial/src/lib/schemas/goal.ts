import { z } from "zod";

const DATE_YYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;

export const goalSchema = z.object({
  month: z.string().regex(DATE_YYYYMMDD, "Use o formato AAAA-MM-DD"),
  target_value: z.number().positive("Meta deve ser maior que zero"),
});

export type GoalInput = z.infer<typeof goalSchema>;

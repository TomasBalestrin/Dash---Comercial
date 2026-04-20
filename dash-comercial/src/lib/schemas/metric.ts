import { z } from "zod";

const DATE_YYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;

export const metricItemSchema = z.object({
  closer_id: z.string().uuid("Closer inválido"),
  calls: z.number().int().min(0, "Não pode ser negativo"),
  conversion_pct: z
    .number()
    .min(0, "Mínimo 0")
    .max(100, "Máximo 100"),
});

export const metricBatchSchema = z.object({
  month: z.string().regex(DATE_YYYYMMDD, "Use o formato AAAA-MM-DD"),
  items: z.array(metricItemSchema).min(1, "Nenhum closer no lote"),
});

export type MetricItemInput = z.infer<typeof metricItemSchema>;
export type MetricBatchInput = z.infer<typeof metricBatchSchema>;

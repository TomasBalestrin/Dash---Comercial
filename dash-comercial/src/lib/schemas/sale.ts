import { z } from "zod";
import { formatInTimeZone } from "date-fns-tz";

const DATE_YYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_YYYYMM = /^\d{4}-\d{2}$/;
const TZ = "America/Sao_Paulo";

function todaySp(): string {
  return formatInTimeZone(new Date(), TZ, "yyyy-MM-dd");
}

export const saleCreateSchema = z
  .object({
    closer_id: z.string().uuid("Closer inválido"),
    product_id: z.string().uuid("Produto inválido"),
    client_name: z
      .string()
      .min(2, "Mínimo 2 caracteres")
      .max(80, "Máximo 80 caracteres"),
    sale_date: z
      .string()
      .regex(DATE_YYYYMMDD, "Use o formato AAAA-MM-DD"),
    value_total: z.number().positive("Deve ser positivo"),
    value_entrada: z.number().min(0, "Não pode ser negativo"),
  })
  .refine((v) => v.value_entrada <= v.value_total, {
    message: "Entrada não pode exceder o total",
    path: ["value_entrada"],
  })
  .refine((v) => v.sale_date <= todaySp(), {
    message: "Data não pode ser no futuro",
    path: ["sale_date"],
  });

export const saleUpdateSchema = z
  .object({
    closer_id: z.string().uuid().optional(),
    product_id: z.string().uuid().optional(),
    client_name: z.string().min(2).max(80).optional(),
    sale_date: z.string().regex(DATE_YYYYMMDD).optional(),
    value_total: z.number().positive().optional(),
    value_entrada: z.number().min(0).optional(),
  })
  .refine(
    (v) =>
      v.value_total === undefined ||
      v.value_entrada === undefined ||
      v.value_entrada <= v.value_total,
    {
      message: "Entrada não pode exceder o total",
      path: ["value_entrada"],
    }
  )
  .refine(
    (v) => v.sale_date === undefined || v.sale_date <= todaySp(),
    { message: "Data não pode ser no futuro", path: ["sale_date"] }
  );

export const saleFilterSchema = z.object({
  month: z.string().regex(MONTH_YYYYMM).optional(),
  closer_id: z.string().uuid().optional(),
  product_id: z.string().uuid().optional(),
  search: z.string().min(1).max(80).optional(),
});

export type SaleCreateInput = z.infer<typeof saleCreateSchema>;
export type SaleUpdateInput = z.infer<typeof saleUpdateSchema>;
export type SaleFilter = z.infer<typeof saleFilterSchema>;

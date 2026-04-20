import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { listByMonth } from "@/services/metrics.service";
import { toMonthDate } from "@/lib/utils/date";

const querySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Mês inválido (YYYY-MM)"),
});

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = querySchema.safeParse({
      month: req.nextUrl.searchParams.get("month") ?? "",
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Parâmetro inválido" },
        { status: 400 }
      );
    }

    const data = await listByMonth(supabase, toMonthDate(parsed.data.month));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[METRICS.GET]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

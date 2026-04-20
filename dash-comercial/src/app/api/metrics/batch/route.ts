import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { metricBatchSchema } from "@/lib/schemas/metric";
import { upsertBatch } from "@/services/metrics.service";

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = metricBatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const data = await upsertBatch(
      supabase,
      parsed.data.month,
      parsed.data.items
    );
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[METRICS.BATCH.PUT]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

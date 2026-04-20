import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  saleCreateSchema,
  saleFilterSchema,
} from "@/lib/schemas/sale";
import { createSale, listSales } from "@/services/sales.service";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sp = req.nextUrl.searchParams;
    const raw = {
      month: sp.get("month") ?? undefined,
      closer_id: sp.get("closer_id") ?? undefined,
      product_id: sp.get("product_id") ?? undefined,
      search: sp.get("search") ?? undefined,
    };
    const parsed = saleFilterSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Filtro inválido" },
        { status: 400 }
      );
    }

    const pageParam = Number(sp.get("page") ?? 0);
    const page = Number.isFinite(pageParam) && pageParam >= 0 ? pageParam : 0;

    const data = await listSales(supabase, { ...parsed.data, page });
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[SALES.GET]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = saleCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const data = await createSale(supabase, parsed.data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[SALES.POST]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

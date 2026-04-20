import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { saleUpdateSchema } from "@/lib/schemas/sale";
import { softDeleteSale, updateSale } from "@/services/sales.service";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = saleUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const data = await updateSale(supabase, id, parsed.data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[SALES.PATCH]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await softDeleteSale(supabase, id);
    return NextResponse.json({ data: null });
  } catch (error) {
    console.error("[SALES.DELETE]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

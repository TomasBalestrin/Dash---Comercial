import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { productUpdateSchema } from "@/lib/schemas/product";
import {
  softDeleteProduct,
  updateProduct,
} from "@/services/products.service";

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
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const data = await updateProduct(supabase, id, parsed.data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[PRODUCTS.PATCH]", error);
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
    await softDeleteProduct(supabase, id);
    return NextResponse.json({ data: null });
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_HAS_SALES") {
      return NextResponse.json(
        { error: "Produto possui vendas vinculadas" },
        { status: 422 }
      );
    }
    console.error("[PRODUCTS.DELETE]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

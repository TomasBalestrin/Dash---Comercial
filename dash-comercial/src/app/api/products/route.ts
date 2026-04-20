import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { productCreateSchema } from "@/lib/schemas/product";
import { createProduct, listProducts } from "@/services/products.service";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await listProducts(supabase);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[PRODUCTS.GET]", error);
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
    const parsed = productCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const data = await createProduct(supabase, parsed.data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[PRODUCTS.POST]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

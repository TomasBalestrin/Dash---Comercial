import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/schemas/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
      console.error("[AUTH.LOGIN]", error);
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    return NextResponse.json({ data: { user: data.user } }, { status: 200 });
  } catch (error) {
    console.error("[AUTH.LOGIN]", error);
    return NextResponse.json(
      { error: "Erro inesperado" },
      { status: 500 }
    );
  }
}

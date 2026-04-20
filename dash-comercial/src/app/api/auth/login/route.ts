import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/schemas/auth";
import { getIP, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`login:${getIP(req.headers)}`, 5, 60_000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em instantes." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(limit.retryAfter / 1000)) },
        }
      );
    }

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

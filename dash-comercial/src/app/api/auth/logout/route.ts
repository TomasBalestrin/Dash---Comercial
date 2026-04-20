import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[AUTH.LOGOUT]", error);
      return NextResponse.json(
        { error: "Erro ao encerrar sessão" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: null }, { status: 200 });
  } catch (error) {
    console.error("[AUTH.LOGOUT]", error);
    return NextResponse.json(
      { error: "Erro inesperado" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getSnapshot } from "@/services/dashboard.service";

export async function GET() {
  try {
    const supabase = await createClient();
    const data = await getSnapshot(supabase);
    return NextResponse.json(
      { data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[DASHBOARD.SNAPSHOT.GET]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

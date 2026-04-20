import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getSnapshot } from "@/services/dashboard.service";
import { getIP, rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const limit = rateLimit(`snapshot:${getIP(req.headers)}`, 120, 60_000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Limite de requisições excedido." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(limit.retryAfter / 1000)) },
        }
      );
    }

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

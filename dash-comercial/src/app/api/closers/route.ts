import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { closerCreateSchema } from "@/lib/schemas/closer";
import { createCloser, listClosers } from "@/services/closers.service";
import { getInitials } from "@/lib/utils/initials";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await listClosers(supabase);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[CLOSERS.GET]", error);
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

    const raw = (await req.json()) as Record<string, unknown>;
    if (!raw.initials && typeof raw.name === "string") {
      raw.initials = getInitials(raw.name);
    }

    const parsed = closerCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const data = await createCloser(supabase, parsed.data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[CLOSERS.POST]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

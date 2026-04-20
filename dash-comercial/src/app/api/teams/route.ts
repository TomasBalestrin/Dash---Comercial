import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { teamCreateSchema } from "@/lib/schemas/team";
import { createTeam, listTeams } from "@/services/teams.service";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await listTeams(supabase);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[TEAMS.GET]", error);
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
    const parsed = teamCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const data = await createTeam(supabase, parsed.data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[TEAMS.POST]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

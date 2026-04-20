import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/services/upload.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Arquivo obrigatório" },
        { status: 400 }
      );
    }

    const url = await uploadImage(supabase, "team-banners", file, id);

    const { error: updateError } = await supabase
      .from("teams")
      .update({ banner_url: url })
      .eq("id", id)
      .is("deleted_at", null);

    if (updateError) throw updateError;

    return NextResponse.json({ data: { url } });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_MIME") {
        return NextResponse.json(
          { error: "Formato inválido. Use PNG, JPEG ou WEBP." },
          { status: 400 }
        );
      }
      if (error.message === "TOO_LARGE") {
        return NextResponse.json(
          { error: "Arquivo maior que 2 MB." },
          { status: 400 }
        );
      }
    }
    console.error("[TEAMS.BANNER.POST]", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

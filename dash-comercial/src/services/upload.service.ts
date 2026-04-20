import type { SupabaseClient } from "@supabase/supabase-js";

const ALLOWED_MIMES = ["image/png", "image/jpeg", "image/webp"] as const;
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

type AllowedMime = (typeof ALLOWED_MIMES)[number];

const EXT_BY_MIME: Record<AllowedMime, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export async function uploadImage(
  supabase: SupabaseClient,
  bucket: string,
  file: File,
  entityId: string
): Promise<string> {
  if (!ALLOWED_MIMES.includes(file.type as AllowedMime)) {
    throw new Error("INVALID_MIME");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("TOO_LARGE");
  }

  const ext = EXT_BY_MIME[file.type as AllowedMime];
  const path = `${entityId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}

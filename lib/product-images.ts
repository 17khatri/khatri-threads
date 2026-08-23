import { createSupabaseServerClient } from "@/lib/supabase/server";

export const PRODUCT_IMAGE_BUCKET =
  process.env.SUPABASE_PRODUCT_IMAGE_BUCKET?.trim() || "Tshirt";

export function getProductImageUrl(storagePath: string) {
  const supabase = createSupabaseServerClient();
  return supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(storagePath)
    .data.publicUrl;
}

export async function removeProductImages(storagePaths: string[]) {
  if (!storagePaths.length) return;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove(storagePaths);

  if (error) console.error("Could not remove product images from Supabase", error);
}

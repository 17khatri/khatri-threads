import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { getProductImageUrl, PRODUCT_IMAGE_BUCKET } from "@/lib/product-images";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function extensionFor(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const files = formData.getAll("images").filter((value): value is File => value instanceof File);
  if (!files.length) return NextResponse.json({ error: "Select at least one image." }, { status: 400 });
  if (files.some((file) => !ACCEPTED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE)) {
    return NextResponse.json({ error: "Images must be JPG, PNG, or WebP and no larger than 10 MB." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const uploaded: { url: string; storagePath: string }[] = [];
  for (const file of files) {
    const storagePath = `products/${crypto.randomUUID()}.${extensionFor(file)}`;
    const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(storagePath, file, { contentType: file.type, upsert: false });
    if (error) {
      if (uploaded.length) await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(uploaded.map((image) => image.storagePath));
      return NextResponse.json({ error: `Image upload failed: ${error.message}` }, { status: 500 });
    }
    uploaded.push({ storagePath, url: getProductImageUrl(storagePath) });
  }
  return NextResponse.json({ images: uploaded }, { status: 201 });
}

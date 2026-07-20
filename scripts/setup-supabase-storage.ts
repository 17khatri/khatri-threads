import "dotenv/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "pdf-forms";

async function main() {
  const supabase = createSupabaseServerClient();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(`Could not list Supabase buckets: ${listError.message}`);
  }

  if (buckets.some((item) => item.name === bucket)) {
    console.log(`Bucket "${bucket}" already exists.`);
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: false,
    allowedMimeTypes: ["application/pdf"],
  });

  if (createError) {
    throw new Error(`Could not create bucket "${bucket}": ${createError.message}`);
  }

  console.log(`Created private bucket "${bucket}".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

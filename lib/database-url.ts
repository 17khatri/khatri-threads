type DatabaseTarget = "local" | "supabase";

const DEFAULT_LOCAL_DATABASE_URL =
  "postgresql://root:root@localhost:5432/khushi_enterprise";

function normalizeDatabaseTarget(value: string | undefined): DatabaseTarget {
  if (!value) {
    return "local";
  }

  const target = value.trim().toLowerCase();

  if (target === "local" || target === "supabase") {
    return target;
  }

  throw new Error(
    `Invalid DATABASE_TARGET "${value}". Use "local" or "supabase".`,
  );
}

function env(name: string) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function getDatabaseTarget() {
  return normalizeDatabaseTarget(env("DATABASE_TARGET"));
}

export function resolveDatabaseUrl(options?: { forMigration?: boolean }) {
  const target = getDatabaseTarget();

  if (target === "supabase") {
    const url =
      (options?.forMigration ? env("SUPABASE_DIRECT_URL") : undefined) ||
      env("SUPABASE_DATABASE_URL") ||
      env("DATABASE_URL");

    if (!url) {
      throw new Error(
        "DATABASE_TARGET is supabase, but SUPABASE_DATABASE_URL is not set.",
      );
    }

    return url;
  }

  return (
    env("LOCAL_DATABASE_URL") ||
    env("DATABASE_URL") ||
    DEFAULT_LOCAL_DATABASE_URL
  );
}

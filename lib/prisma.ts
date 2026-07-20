import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl } from "@/lib/database-url";

const connectionString = resolveDatabaseUrl();

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

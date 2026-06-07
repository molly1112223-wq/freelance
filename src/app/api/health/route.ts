import { ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await prisma.$queryRaw`SELECT 1`;
  return ok({ status: "ok", checkedAt: new Date().toISOString() });
}

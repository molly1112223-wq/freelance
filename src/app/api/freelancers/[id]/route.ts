import { ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const freelancer = await prisma.freelancerProfile.findFirst({
    where: { OR: [{ id }, { userId: id }] },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          status: true,
          reviewsReceived: { orderBy: { createdAt: "desc" }, take: 10 }
        }
      }
    }
  });

  return ok(freelancer);
}

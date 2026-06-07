import { ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skill = searchParams.get("skill") ?? undefined;

  const freelancers = await prisma.freelancerProfile.findMany({
    include: { user: { select: { id: true, name: true, avatarUrl: true, status: true } } },
    orderBy: [{ ratingAvg: "desc" }, { completedProjects: "desc" }]
  });

  return ok(
    skill
      ? freelancers.filter((freelancer) =>
          Array.isArray(freelancer.skills) ? freelancer.skills.includes(skill) : false
        )
      : freelancers
  );
}

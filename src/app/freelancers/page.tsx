import { FreelancerDirectory } from "@/components/freelancer-directory";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export default async function FreelancersPage() {
  const profiles = await prisma.freelancerProfile.findMany({
    include: { user: { select: { id: true, name: true, status: true } } },
    orderBy: [{ ratingAvg: "desc" }, { completedProjects: "desc" }]
  });
  const freelancers = profiles
    .filter((profile) => profile.user.status === "active")
    .map((profile) => ({
      id: profile.userId,
      name: profile.user.name,
      title: profile.title,
      bio: profile.bio,
      skills: stringArray(profile.skills),
      hourlyRate: profile.hourlyRate ?? 0,
      ratingAvg: profile.ratingAvg
    }));

  return (
    <main className="container py-10">
      <FreelancerDirectory freelancers={freelancers} />
    </main>
  );
}

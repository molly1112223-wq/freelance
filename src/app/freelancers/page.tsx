import { FreelancerDirectory } from "@/components/freelancer-directory";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DB_PAGE_TIMEOUT_MS = 8000;

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

async function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => resolve(fallback), DB_PAGE_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeout]);
  } catch {
    return fallback;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export default async function FreelancersPage() {
  const profiles = await withTimeout(
    prisma.freelancerProfile.findMany({
      include: { user: { select: { id: true, name: true, status: true } } },
      orderBy: [{ ratingAvg: "desc" }, { completedProjects: "desc" }]
    }),
    []
  );
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

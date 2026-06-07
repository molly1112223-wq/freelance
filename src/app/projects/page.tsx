import { ProjectBoard } from "@/components/project-board";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toProject } from "@/lib/project-mappers";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({ searchParams }: { searchParams?: Promise<{ q?: string; keyword?: string }> }) {
  const params = searchParams ? await searchParams : {};
  const initialQuery = params.q ?? params.keyword ?? "";
  const user = await getCurrentUser();
  const dbProjects = await prisma.project.findMany({
    where: { status: "published" },
    include: {
      client: { select: { name: true } },
      _count: { select: { proposals: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  const initialProjects = dbProjects.map(toProject);

  return (
    <main className="container py-10">
      <ProjectBoard initialProjects={initialProjects} initialQuery={initialQuery} userRole={user?.role ?? null} />
    </main>
  );
}

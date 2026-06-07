import { ProjectBoard } from "@/components/project-board";
import { prisma } from "@/lib/prisma";
import { toProject } from "@/lib/project-mappers";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
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
      <ProjectBoard initialProjects={initialProjects} />
    </main>
  );
}

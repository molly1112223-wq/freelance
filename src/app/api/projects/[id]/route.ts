import { handleApiError, ok } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validators";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true, avatarUrl: true } },
      proposals: {
        include: { freelancer: { select: { id: true, name: true, avatarUrl: true } } }
      },
      contract: true
    }
  });

  if (!project) return ok(null);

  const canSeeAllProposals = user?.role === "admin" || user?.id === project.clientId;
  const visibleProject = {
    ...project,
    proposals: canSeeAllProposals ? project.proposals : project.proposals.filter((proposal) => proposal.freelancerId === user?.id),
    contract:
      user?.role === "admin" || user?.id === project.clientId || user?.id === project.contract?.freelancerId
        ? project.contract
        : null
  };

  return ok(visibleProject);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const existing = await prisma.project.findUnique({ where: { id } });

    if (!existing || (existing.clientId !== user?.id && user?.role !== "admin")) {
      throw new Error("项目不存在，或你没有编辑权限。");
    }

    const input = projectSchema.partial().parse(await request.json());
    const project = await prisma.project.update({ where: { id }, data: input });
    return ok(project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const existing = await prisma.project.findUnique({ where: { id } });

    if (!existing || (existing.clientId !== user?.id && user?.role !== "admin")) {
      throw new Error("项目不存在，或你没有编辑权限。");
    }

    await prisma.project.delete({ where: { id } });
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

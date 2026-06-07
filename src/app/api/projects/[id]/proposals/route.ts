import { created, fail, handleApiError, ok } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertRole } from "@/lib/rbac";
import { proposalSchema } from "@/lib/validators";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return fail("请先登录。", 401);

    const project = await prisma.project.findUnique({ where: { id }, select: { clientId: true } });
    if (!project) return fail("项目不存在。", 404);

    const proposals = await prisma.proposal.findMany({
      where: user.role === "admin" || project.clientId === user.id ? { projectId: id } : { projectId: id, freelancerId: user.id },
      include: { freelancer: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" }
    });

    return ok(proposals);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    assertRole(user?.role, ["freelancer"]);

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.status !== "published") {
      throw new Error("项目必须处于招募中状态才能接收报价。");
    }

    const input = proposalSchema.parse(await request.json());
    const proposal = await prisma.proposal.create({
      data: {
        ...input,
        projectId: id,
        freelancerId: user!.id,
        status: "submitted"
      }
    });

    await prisma.notification.create({
      data: {
        userId: project.clientId,
        type: "proposalSubmitted",
        title: "收到新的报价",
        body: `${user!.name} 为「${project.title}」提交了报价。`
      }
    });

    return created(proposal);
  } catch (error) {
    return handleApiError(error);
  }
}

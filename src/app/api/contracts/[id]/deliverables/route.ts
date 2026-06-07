import { created, fail, handleApiError, ok } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deliverableSchema } from "@/lib/validators";
import type { Prisma } from "@prisma/client";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return fail("请先登录。", 401);

    const contract = await prisma.contract.findUnique({ where: { id } });
    if (!contract) return fail("合约不存在。", 404);
    if (user.role !== "admin" && contract.clientId !== user.id && contract.freelancerId !== user.id) {
      return fail("你没有权限查看交付物。", 403);
    }

    const deliverables = await prisma.deliverable.findMany({
      where: { contractId: id },
      orderBy: { createdAt: "desc" }
    });

    return ok(deliverables);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const contract = await prisma.contract.findUnique({ where: { id }, include: { project: true } });

    if (!contract || contract.freelancerId !== user?.id) {
      throw new Error("合约不存在，或你没有编辑权限。");
    }

    const input = deliverableSchema.parse(await request.json());
    const deliverable = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdDeliverable = await tx.deliverable.create({
        data: { ...input, contractId: id, freelancerId: user.id, status: "submitted" }
      });

      await tx.contract.update({ where: { id }, data: { status: "submitted" } });
      await tx.notification.create({
        data: {
          userId: contract.clientId,
          type: "deliverableSubmitted",
          title: "收到新的交付物",
          body: `${user.name} 为「${contract.project.title}」提交了交付物。`
        }
      });

      return createdDeliverable;
    });

    return created(deliverable);
  } catch (error) {
    return handleApiError(error);
  }
}

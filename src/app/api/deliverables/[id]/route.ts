import { handleApiError, ok } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const deliverable = await prisma.deliverable.findUnique({
      where: { id },
      include: { contract: true }
    });

    if (!deliverable || deliverable.contract.clientId !== user?.id) {
      throw new Error("交付物不存在，或你没有编辑权限。");
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const approved = await tx.deliverable.update({ where: { id }, data: { status: "approved" } });
      const contract = await tx.contract.update({
        where: { id: deliverable.contractId },
        data: { status: "completed" }
      });
      await tx.project.update({ where: { id: contract.projectId }, data: { status: "completed" } });
      return approved;
    });

    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

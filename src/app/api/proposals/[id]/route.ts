import { handleApiError, ok } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const body = (await request.json()) as { status?: "accepted" | "rejected" };
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!proposal || proposal.project.clientId !== user?.id) {
      throw new Error("报价不存在，或你没有编辑权限。");
    }

    if (body.status === "rejected") {
      return ok(await prisma.proposal.update({ where: { id }, data: { status: "rejected" } }));
    }

    if (body.status !== "accepted") {
      throw new Error("不支持的报价状态。");
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const acceptedProposal = await tx.proposal.update({
        where: { id },
        data: { status: "accepted" }
      });

      await tx.proposal.updateMany({
        where: { projectId: proposal.projectId, id: { not: id } },
        data: { status: "rejected" }
      });

      await tx.project.update({
        where: { id: proposal.projectId },
        data: {
          status: "inProgress",
          selectedProposalId: id,
          selectedFreelancerId: proposal.freelancerId
        }
      });

      const contract = await tx.contract.create({
        data: {
          projectId: proposal.projectId,
          proposalId: id,
          clientId: proposal.project.clientId,
          freelancerId: proposal.freelancerId,
          amount: proposal.proposedAmount,
          status: "active"
        }
      });

      await tx.notification.create({
        data: {
          userId: proposal.freelancerId,
          type: "proposalAccepted",
          title: "报价已被接受",
          body: `你为「${proposal.project.title}」提交的报价已被客户接受。`
        }
      });

      return { proposal: acceptedProposal, contract };
    });

    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

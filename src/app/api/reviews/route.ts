import { created, handleApiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validators";
import type { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("请先登录。");
    }

    const input = reviewSchema.parse(await request.json());
    const contract = await prisma.contract.findUnique({ where: { id: input.contractId } });

    if (!contract || (contract.clientId !== user.id && contract.freelancerId !== user.id)) {
      throw new Error("合约不存在，或你没有评价权限。");
    }

    if (contract.status !== "completed") {
      throw new Error("合约完成后才能评价。");
    }

    const expectedRevieweeId = user.id === contract.clientId ? contract.freelancerId : contract.clientId;
    if (input.revieweeId !== expectedRevieweeId) {
      throw new Error("只能评价本次合约的另一方。");
    }

    const review = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdReview = await tx.review.create({
        data: {
          ...input,
          reviewerId: user.id
        }
      });

      await tx.notification.create({
        data: {
          userId: input.revieweeId,
          type: "reviewReceived",
          title: "收到新的评价",
          body: `${user.name} 给你留下了一条评价。`
        }
      });

      if (input.revieweeId === contract.freelancerId) {
        const reviews = await tx.review.findMany({
          where: { revieweeId: contract.freelancerId },
          select: { rating: true }
        });
        const ratingAvg = reviews.reduce((total, item) => total + item.rating, 0) / reviews.length;
        await tx.freelancerProfile.update({
          where: { userId: contract.freelancerId },
          data: {
            ratingAvg,
            completedProjects: { increment: 1 }
          }
        });
      }

      return createdReview;
    });

    return created(review);
  } catch (error) {
    return handleApiError(error);
  }
}

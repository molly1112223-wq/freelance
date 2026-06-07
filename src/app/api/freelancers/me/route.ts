import { fail, handleApiError, ok } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { freelancerProfileSchema } from "@/lib/validators";

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("请先登录。", 401);
    if (user.role !== "freelancer") return fail("只有自由职业者账号可以编辑作品集资料。", 403);

    const input = freelancerProfileSchema.parse(await request.json());
    const profile = await prisma.freelancerProfile.upsert({
      where: { userId: user.id },
      update: input,
      create: {
        ...input,
        userId: user.id
      }
    });

    return ok(profile);
  } catch (error) {
    return handleApiError(error);
  }
}

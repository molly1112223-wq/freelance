import { fail, handleApiError, ok } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return fail("请先登录。", 401);

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        project: true,
        proposal: true,
        client: { select: { id: true, name: true, avatarUrl: true } },
        freelancer: { select: { id: true, name: true, avatarUrl: true } },
        deliverables: true,
        reviews: true
      }
    });

    if (!contract) return fail("合约不存在。", 404);
    if (user.role !== "admin" && contract.clientId !== user.id && contract.freelancerId !== user.id) {
      return fail("你没有权限查看该合约。", 403);
    }

    return ok(contract);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const body = (await request.json()) as { status?: "approved" | "completed" };
    const contract = await prisma.contract.findUnique({ where: { id } });

    if (!contract || (contract.clientId !== user?.id && user?.role !== "admin")) {
      throw new Error("合约不存在，或你没有编辑权限。");
    }

    const updated = await prisma.contract.update({
      where: { id },
      data: { status: body.status ?? "approved" }
    });

    return ok(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

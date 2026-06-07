import { created, handleApiError, ok } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertRole } from "@/lib/rbac";
import { projectSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  const projects = await prisma.project.findMany({
    where: {
      status: "published",
      category,
      OR: keyword
        ? [
            { title: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } }
          ]
        : undefined
    },
    include: {
      client: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { proposals: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return ok(projects);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    assertRole(user?.role, ["client", "admin"]);
    const input = projectSchema.parse(await request.json());

    const project = await prisma.project.create({
      data: {
        ...input,
        clientId: user!.id,
        status: "published"
      }
    });

    return created(project);
  } catch (error) {
    return handleApiError(error);
  }
}

import { fail, handleApiError, ok } from "@/lib/api";
import { createSession, setSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      return fail("邮箱或密码错误", 401);
    }

    await setSessionCookie(await createSession(user.id));
    return ok({ id: user.id, role: user.role, name: user.name, email: user.email, status: user.status });
  } catch (error) {
    return handleApiError(error);
  }
}

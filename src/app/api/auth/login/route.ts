import { fail, handleApiError, ok } from "@/lib/api";
import { createSession, setSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await prisma.user.findFirst({
      where: input.phone.includes("@") ? { email: input.phone } : { phone: input.phone }
    });

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      return fail("手机号或密码错误", 401);
    }

    await setSessionCookie(await createSession(user.id));
    return ok({ id: user.id, role: user.role, name: user.name, phone: user.phone, status: user.status });
  } catch (error) {
    return handleApiError(error);
  }
}

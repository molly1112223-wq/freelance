import { fail, handleApiError, ok } from "@/lib/api";
import { createSession, setSessionCookie } from "@/lib/auth";
import { consumePhoneVerificationCode } from "@/lib/phone-verification";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    await consumePhoneVerificationCode(input.phone, "login", input.code);
    const user = await prisma.user.findUnique({ where: { phone: input.phone } });

    if (!user) {
      return fail("该手机号尚未注册，请先创建账号。", 404);
    }

    await setSessionCookie(await createSession(user.id));
    return ok({ id: user.id, role: user.role, name: user.name, phone: user.phone, status: user.status });
  } catch (error) {
    return handleApiError(error);
  }
}

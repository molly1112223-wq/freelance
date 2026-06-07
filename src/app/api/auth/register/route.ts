import { created, fail, handleApiError } from "@/lib/api";
import { createSession, hashPassword, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const exists = await prisma.user.findUnique({ where: { phone: input.phone } });

    if (exists) {
      return fail("该手机号已注册", 409);
    }

    const user = await prisma.user.create({
      data: {
        role: input.role,
        name: input.name,
        email: `phone-${input.phone}@users.spacex1.cn`,
        phone: input.phone,
        passwordHash: await hashPassword(input.password),
        freelancerProfile:
          input.role === "freelancer"
            ? {
                create: {
                  title: "自由职业者",
                  bio: "新入驻的职链自由职业者",
                  skills: [],
                  portfolioUrls: []
                }
              }
            : undefined
      },
      select: { id: true, role: true, name: true, phone: true, status: true }
    });

    await setSessionCookie(await createSession(user.id));
    return created(user);
  } catch (error) {
    return handleApiError(error);
  }
}

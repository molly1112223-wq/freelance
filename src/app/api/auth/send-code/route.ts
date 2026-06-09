import { fail, handleApiError, ok } from "@/lib/api";
import { assertCanSendPhoneVerificationCode, createPhoneVerificationCode } from "@/lib/phone-verification";
import { prisma } from "@/lib/prisma";
import { sendSmsCode } from "@/lib/sms";
import { sendSmsCodeSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const input = sendSmsCodeSchema.parse(await request.json());
    const exists = await prisma.user.findUnique({ where: { phone: input.phone } });

    if (input.purpose === "register" && exists) {
      return fail("该手机号已注册，请直接登录。", 409);
    }

    if (input.purpose === "login" && !exists) {
      return fail("该手机号尚未注册，请先创建账号。", 404);
    }

    await assertCanSendPhoneVerificationCode(input.phone, input.purpose);
    const result = await sendSmsCode(input.phone);
    if (!result.code) {
      throw new Error("验证码生成失败。");
    }

    await createPhoneVerificationCode(input.phone, input.purpose, result.code);

    return ok({
      provider: result.provider,
      // mock 模式用于上线前测试，不会产生短信费用。
      code: result.provider === "mock" ? result.code : undefined,
      message: result.provider === "mock" ? "测试验证码已生成。" : "验证码已发送。"
    });
  } catch (error) {
    return handleApiError(error);
  }
}

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";

const codeTtlMs = 5 * 60 * 1000;
const sendIntervalMs = 60 * 1000;
const maxAttempts = 5;

export async function createPhoneVerificationCode(phone: string, purpose: "login" | "register", code: string) {
  await prisma.phoneVerificationCode.create({
    data: {
      phone,
      purpose,
      codeHash: await hashPassword(code),
      expiresAt: new Date(Date.now() + codeTtlMs)
    }
  });
}

export async function assertCanSendPhoneVerificationCode(phone: string, purpose: "login" | "register") {
  const latest = await prisma.phoneVerificationCode.findFirst({
    where: {
      phone,
      purpose,
      consumedAt: null,
      createdAt: { gt: new Date(Date.now() - sendIntervalMs) }
    },
    orderBy: { createdAt: "desc" }
  });

  if (latest) {
    throw new Error("验证码发送太频繁，请 60 秒后再试。");
  }
}

export async function consumePhoneVerificationCode(phone: string, purpose: "login" | "register", code: string) {
  const record = await prisma.phoneVerificationCode.findFirst({
    where: {
      phone,
      purpose,
      consumedAt: null,
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: "desc" }
  });

  if (!record) {
    throw new Error("验证码不存在或已过期，请重新获取。");
  }

  if (record.attempts >= maxAttempts) {
    throw new Error("验证码尝试次数过多，请重新获取。");
  }

  const isValid = await verifyPassword(code, record.codeHash);
  if (!isValid) {
    await prisma.phoneVerificationCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } }
    });
    throw new Error("验证码错误。");
  }

  await prisma.phoneVerificationCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() }
  });
}

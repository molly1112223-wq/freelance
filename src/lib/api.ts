import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: { message, details } }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("表单校验失败", 422, error.flatten());
  }

  if (error instanceof Error) {
    if (process.env.NODE_ENV === "production") {
      return fail("服务器暂时无法处理请求", 500);
    }

    return fail(error.message, 400);
  }

  return fail("服务器发生未知错误", 500);
}

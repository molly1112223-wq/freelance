"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthMode = "login" | "register";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [role, setRole] = useState("client");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  function startCountdown() {
    setCountdown(60);
    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }

  async function sendCode() {
    setMessage("");
    if (!/^(\+?86)?1[3-9]\d{9}$/.test(phone.trim())) {
      setMessage("请先输入有效的手机号。");
      return;
    }

    setIsSending(true);
    const response = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, purpose: mode })
    });
    const result = (await response.json()) as { data?: { code?: string; message?: string }; error?: { message?: string } };
    setIsSending(false);

    if (!response.ok) {
      setMessage(result.error?.message ?? "验证码发送失败，请稍后重试。");
      return;
    }

    if (result.data?.code) {
      setCode(result.data.code);
      setMessage(`测试验证码：${result.data.code}`);
    } else {
      setMessage(result.data?.message ?? "验证码已发送。");
    }
    startCountdown();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const payload = mode === "login" ? { phone, code } : { role, name, phone, code };
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = (await response.json()) as { data?: { role?: string }; error?: { message?: string } };
    setIsLoading(false);

    if (!response.ok) {
      setMessage(result.error?.message ?? "操作失败，请稍后重试。");
      return;
    }

    router.push(result.data?.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
    router.refresh();
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      {mode === "register" ? (
        <>
          <select
            className="h-11 w-full rounded-lg border border-[color-mix(in_srgb,var(--ink)_22%,var(--border))] bg-[var(--card)] px-3 text-sm outline-none focus:border-[var(--accent)]"
            name="role"
            onChange={(event) => setRole(event.target.value)}
            value={role}
          >
            <option value="client">客户</option>
            <option value="freelancer">自由职业者</option>
          </select>
          <Input name="name" onChange={(event) => setName(event.target.value)} placeholder="姓名或公司名" required value={name} />
        </>
      ) : null}
      <Input
        autoComplete="tel"
        inputMode="tel"
        name="phone"
        onChange={(event) => setPhone(event.target.value)}
        pattern="(\\+?86)?1[3-9][0-9]{9}"
        placeholder="手机号"
        required
        type="tel"
        value={phone}
      />
      <div className="flex gap-2">
        <Input
          autoComplete="one-time-code"
          inputMode="numeric"
          name="code"
          onChange={(event) => setCode(event.target.value)}
          placeholder="短信验证码"
          required
          value={code}
        />
        <button
          className="h-11 shrink-0 rounded border border-[var(--border)] px-4 text-sm text-[var(--ink)] transition-colors hover:border-[var(--muted)] hover:bg-[var(--accent-3)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSending || countdown > 0}
          type="button"
          onClick={sendCode}
        >
          {isSending ? "发送中" : countdown > 0 ? `${countdown}s` : "获取验证码"}
        </button>
      </div>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      <Button className="w-full" disabled={isLoading} type="submit">
        {isLoading ? "处理中..." : mode === "login" ? "登录" : "创建账号"}
      </Button>
      {mode === "login" ? (
        <p className="text-center text-sm text-[var(--muted)]">
          还没有账号？<Link className="text-[var(--ink)] underline underline-offset-4" href="/register">立即注册</Link>
        </p>
      ) : (
        <p className="text-center text-sm text-[var(--muted)]">
          已有账号？<Link className="text-[var(--ink)] underline underline-offset-4" href="/login">去登录</Link>
        </p>
      )}
    </form>
  );
}

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const payload = mode === "login" ? { email, password } : { role, name, email, password };
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
      <Input name="email" onChange={(event) => setEmail(event.target.value)} placeholder="邮箱" required type="email" value={email} />
      <Input name="password" minLength={mode === "register" ? 8 : 1} onChange={(event) => setPassword(event.target.value)} placeholder="密码" required type="password" value={password} />
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

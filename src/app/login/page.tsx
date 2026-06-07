import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="container grid min-h-[calc(100vh-64px)] place-items-center py-10">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-semibold">登录</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">进入你的 Craft 工作台。</p>
        <AuthForm mode="login" />
      </Card>
    </main>
  );
}

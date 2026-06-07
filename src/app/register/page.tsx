import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="container grid min-h-[calc(100vh-64px)] place-items-center py-10">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-semibold">创建账号</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">以客户或自由职业者身份入驻。</p>
        <AuthForm mode="register" />
      </Card>
    </main>
  );
}

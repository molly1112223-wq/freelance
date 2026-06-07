"use client";

import { Search, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";

const nav = [
  { href: "/projects", label: "需求广场" },
  { href: "/freelancers", label: "作品集" },
  { href: "/#how", label: "如何运作" }
];

type SessionUser = {
  id: string;
  role: "client" | "freelancer" | "admin";
  name: string;
  email: string;
};

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((result: { data?: SessionUser | null }) => {
        if (isMounted) setUser(result.data ?? null);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const dashboardHref = user?.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";

  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur">
      <div className="container flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="font-[var(--craft-serif)] text-[22px] text-[var(--ink)]">
          Craft
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-[var(--muted)] lg:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-[var(--muted)] hover:text-[var(--foreground)]">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link className="hidden size-10 place-items-center rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition-colors hover:border-[var(--muted)] sm:grid" aria-label="搜索" href="/projects">
            <Search size={18} />
          </Link>
          {user ? (
            <>
              <ButtonLink href={dashboardHref} variant="secondary" className="hidden sm:inline-flex">
                <UserRound size={16} />
                {user.name}
              </ButtonLink>
              <button
                className="inline-flex h-11 items-center justify-center rounded border border-[var(--border)] bg-transparent px-4 text-sm font-normal text-[var(--ink)] transition-colors hover:border-[var(--muted)] hover:bg-[var(--accent-3)]"
                type="button"
                onClick={logout}
              >
                退出
              </button>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="secondary" className="hidden sm:inline-flex">
                <UserRound size={16} />
                登录
              </ButtonLink>
              <ButtonLink href="/register">免费注册</ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import { usePathname } from "next/navigation";

const footerLinks = [
  { label: "需求广场", href: "/projects" },
  { label: "作品集", href: "/freelancers" },
  { label: "如何运作", href: "/#how" },
  { label: "客户工作台", href: "/dashboard/client" },
  { label: "自由职业者工作台", href: "/dashboard/freelancer" }
];

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="container grid gap-10 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-[var(--craft-serif)] text-[22px]">Craft</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
            连接经过认证的专业自由职业者与真实需求方，从设计到开发，每一笔交易都有保障。
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">基础信息</p>
          <div className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
            {footerLinks.map((item) => (
              <a key={item.href} href={item.href} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">平台信息</p>
          <div className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
            <p>认证后开放核心权限</p>
            <p>托管付款，验收放款</p>
            <p>© 2026 Craft. 保留所有权利。</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

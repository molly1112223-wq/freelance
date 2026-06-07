"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ShowcaseItem = {
  title: string;
  description: string;
  image: string;
  tag: string;
};

export function HomeDesignTabs({ items }: { items: ShowcaseItem[] }) {
  const tabs = useMemo(() => ["全部", ...Array.from(new Set(items.map((item) => item.tag)))], [items]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const visibleItems = activeTab === "全部" ? items : items.filter((item) => item.tag === activeTab);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              activeTab === tab
                ? "border-[var(--button-bg)] bg-[var(--button-bg)] text-[var(--button-text)]"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {visibleItems.map((item, index) => (
          <Card key={item.title} className="animate-soft-reveal overflow-hidden p-0" style={{ animationDelay: `${index * 70}ms` }}>
            <div className="relative aspect-[16/10] bg-[var(--card)]">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
            <div className="p-5">
              <p className="text-xs text-[var(--muted)]">{item.tag}</p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <ButtonLink href="/projects" variant="secondary">
          查看对应设计需求
        </ButtonLink>
      </div>
    </div>
  );
}
